import type { AppBskyFeedDefs, AppBskyFeedPost, At } from "@atcute/client/lexicons";
import { Signal } from "@char/aftercare";
import { moderatePost, type ModerationResult } from "../../moderation/mod.ts";
import { navigateTo } from "../../navigation.ts";
import { session } from "../../session.ts";
import { moderationRules } from "../../state/labelers.ts";
import { createRecord, deleteRecord } from "../../util/atp.ts";
import { elem, elemRewrite } from "../../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Pin, Repeat2, Reply } from "../../util/icons.ts";
import { select } from "../../util/select.ts";
import { Composer } from "../compose.ts";
import { richText } from "../rich-text.ts";
import { age } from "./age.ts";
import { embedMedia } from "./embed.ts";
import type { PostHierarchy } from "./hierarchy.ts";
import { createReplyAuthor, type PostReply } from "./reply.ts";

export function normalizePostURI(post: Pick<AppBskyFeedDefs.PostView, "uri" | "author">) {
  const handle = post.author.handle === "handle.invalid" ? undefined : post.author.handle;
  return `at://${handle ?? post.author.did}/app.bsky.feed.post/${post.uri.split("/").pop()}`;
}

export function normalizePostURIInternal(
  post: Pick<AppBskyFeedDefs.PostView, "uri" | "author">,
) {
  const handle = post.author.handle === "handle.invalid" ? undefined : post.author.handle;
  const rkey = post.uri.split("/").pop()!;
  return `/profile/${handle ?? post.author.did}/post/${rkey}`;
}

export interface PostAuthor {
  did: At.DID;
  displayName?: string;
  handle?: string;
  avatar?: string;
}

export class Post {
  static store = new Map<string, Post>();
  static get(post: AppBskyFeedDefs.PostView, reply?: PostReply) {
    const uri = normalizePostURI(post);
    return (
      this.store.get(uri)?.tap(p => p.update(post)) ??
      new Post(post, reply).tap(p => this.store.set(uri, p))
    );
  }

  uri: string;
  createdAt: Date;

  view: AppBskyFeedDefs.PostView;
  reply?: PostReply;

  author: PostAuthor;

  ownLike = new Signal<string | undefined>(undefined);
  ownRepost = new Signal<string | undefined>(undefined);

  likeCount = new Signal(0);
  repostCount = new Signal(0);
  replyCount = new Signal(0);

  replyComposer: Composer | undefined;

  moderation: ModerationResult[];

  reason: HTMLElement;
  article: HTMLElement;

  hierarchy: PostHierarchy = {
    parent: undefined,
    replies: new Set(),
  };

  constructor(post: AppBskyFeedDefs.PostView, reply?: PostReply) {
    this.uri = normalizePostURI(post);
    this.view = post;
    this.reply = reply;

    const record = post.record as AppBskyFeedPost.Record;
    if (record.$type !== "app.bsky.feed.post") throw new Error();

    this.createdAt = new Date(record.createdAt);

    this.ownLike.set(post.viewer?.like);
    this.ownRepost.set(post.viewer?.repost);

    this.likeCount.set(post.likeCount ?? 0);
    this.replyCount.set(post.replyCount ?? 0);
    this.repostCount.set(post.repostCount ?? 0);

    this.author = {
      did: post.author.did,
      displayName: post.author.displayName,
      handle: post.author.handle === "handle.invalid" ? undefined : post.author.handle,
      avatar: post.author.avatar,
    };

    this.moderation = [...moderatePost(moderationRules, post)];

    this.reason = elem("div", { className: "reason" }, []);
    this.article = createPostArticle(this);
    select(this.article, ".post-main").append(this.#setupControls());

    this.article.dataset.uri = post.uri;
    this.article.dataset.author = post.author.did;

    this.#setupLink();
  }

  update(newView: AppBskyFeedDefs.PostView) {
    this.view = newView;
    this.ownLike.set(newView.viewer?.like);
    this.ownRepost.set(newView.viewer?.repost);
    this.likeCount.set(newView.likeCount ?? 0);
    this.repostCount.set(newView.repostCount ?? 0);
    this.replyCount.set(newView.replyCount ?? 0);
  }

  setReason(reason?: AppBskyFeedDefs.FeedViewPost["reason"]) {
    if (!reason) {
      this.reason.innerHTML = "";
      return;
    }

    if (reason.$type === "app.bsky.feed.defs#reasonRepost") {
      elemRewrite(this.reason, [
        icon(Repeat2),
        elem("div", {}, [
          "Reposted by ",
          elem("a", { className: "handle", href: `/profile/${reason.by.handle}` }, [
            reason.by.displayName ?? `@${reason.by.handle}`,
          ]),
        ]),
      ]);
    }

    if (reason.$type === "app.bsky.feed.defs#reasonPin") {
      elemRewrite(this.reason, [icon(Pin), elem("div", {}, ["Pinned post"])]);
    }
  }

  #setupControls(): HTMLElement {
    return elem("section", { className: "controls" }, [
      elem("button", { className: "reply" }, [
        icon(MessageCircle),
        elem("data").tap(data =>
          this.replyCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]).tap(button => {
        button.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();

          this.replyComposer ??= new Composer(this);
          Composer.current.set(this.replyComposer);
        });
      }),
      elem("button", { className: "repost" }, [
        icon(Repeat2),
        elem("data").tap(data =>
          this.repostCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]).tap(button => {
        button.addEventListener("click", async e => {
          e.preventDefault();
          e.stopPropagation();

          const repostURI = this.ownRepost.get();
          if (repostURI === "in-progress") {
            // do nothing
          } else if (repostURI) {
            this.ownRepost.set(undefined);
            this.repostCount.set(this.repostCount.get() - 1);
            await deleteRecord({
              collection: "app.bsky.feed.repost",
              repo: session!.did,
              rkey: repostURI.split("/").pop()!,
            });
          } else {
            this.ownRepost.set("in-progress");
            this.repostCount.set(this.repostCount.get() + 1);
            const newRepost = await createRecord({
              collection: "app.bsky.feed.repost",
              repo: session!.did,
              record: {
                $type: "app.bsky.feed.repost",
                createdAt: new Date().toISOString(),
                subject: { cid: this.view.cid, uri: this.view.uri },
              },
            });
            this.ownRepost.set(newRepost.uri);
          }
        });

        this.ownRepost.subscribeImmediate(uri => {
          if (uri) button.dataset.repost = uri;
          else delete button.dataset.repost;
        });
      }),
      elem("button", { className: "like" }, [
        icon(Heart),
        elem("data").tap(data =>
          this.likeCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]).tap(button => {
        button.addEventListener("click", async e => {
          e.preventDefault();
          e.stopPropagation();

          const likeURI = this.ownLike.get();
          if (likeURI === "in-progress") {
            // do nothing
          } else if (likeURI) {
            this.ownLike.set(undefined);
            this.likeCount.set(this.likeCount.get() - 1);
            await deleteRecord({
              collection: "app.bsky.feed.like",
              repo: session!.did,
              rkey: likeURI.split("/").pop()!,
            });
          } else {
            this.ownLike.set("in-progress");
            this.likeCount.set(this.likeCount.get() + 1);
            const newLike = await createRecord({
              collection: "app.bsky.feed.like",
              repo: session!.did,
              record: {
                $type: "app.bsky.feed.like",
                createdAt: new Date().toISOString(),
                subject: { cid: this.view.cid, uri: this.view.uri },
              },
            });
            this.ownLike.set(newLike.uri);
          }
        });

        this.ownLike.subscribeImmediate(uri => {
          if (uri) button.dataset.like = uri;
          else delete button.dataset.like;
        });
      }),
      elem("button", { className: "more" }, [icon(Ellipsis)]),
    ]);
  }

  #setupLink() {
    let mouseDownTime = 0;
    this.article.addEventListener("pointerdown", () => {
      mouseDownTime = performance.now();
    });
    this.article.addEventListener("click", e => {
      const isNotLink = this.article.dataset.noLink !== undefined;
      if (isNotLink) return;

      if (this.article.classList.contains("active")) return;

      if (e.target instanceof HTMLElement && e.target.closest("a") !== null) return;
      if (e.ctrlKey || e.button !== 0) return;

      const deltaTime = performance.now() - mouseDownTime;
      if (deltaTime > 200) return;

      e.preventDefault();
      e.stopPropagation();

      navigateTo(normalizePostURIInternal(this.view));
    });
  }
}

export function createPostArticle(post: Post): HTMLElement {
  const record = post.view.record as AppBskyFeedPost.Record;

  return elem("article", { className: "post" }, [
    post.reason,
    elem("aside", {}, [
      elem(
        "a",
        { className: "contents", href: `/profile/${post.author.handle ?? post.author.did}` },
        [elem("img", { className: "avatar", src: post.author.avatar, loading: "lazy" })],
      ),
    ]),
    elem("section", { className: "post-main" }, [
      elem("div", { className: "topline" }, [
        elem("section", { className: "author" }, [
          ...(post.author.displayName
            ? [elem("strong", {}, [post.author.displayName]), " "]
            : []),
          post.author.handle
            ? elem("a", { className: "handle", href: `/profile/${post.author.handle}` }, [
                `@${post.author.handle}`,
              ])
            : elem("a", { className: "handle" }, ["[invalid handle]"]),
        ]),
        elem("section", { className: "details" }, [age(post.createdAt)]),
      ]),
      post.reply
        ? elem("span", { className: "reply-details" }, [
            icon(Reply),
            "Replying to ",
            createReplyAuthor(post.reply),
          ])
        : "",
      elem("section", { className: "post-body" }, [
        richText(record.text, record.facets),
        ...(post.view.embed?.pipe(embedMedia) ?? []),
      ]),
    ]),
  ]);
}
