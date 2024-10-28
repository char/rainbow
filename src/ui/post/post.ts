import type { AppBskyFeedDefs, AppBskyFeedPost, At } from "@atcute/client/lexicons";
import { moderatePost, type ModerationResult } from "../../moderation/mod.ts";
import { navigateTo } from "../../navigation.ts";
import { session } from "../../session.ts";
import { moderationRules } from "../../state/labelers.ts";
import { createRecord, deleteRecord } from "../../util/atp.ts";
import { elem } from "../../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Repeat2, Reply } from "../../util/icons.ts";
import { Subscribable } from "../../util/subscribable.ts";
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
      this.store.get(uri)?.also(p => p.update(post)) ??
      new Post(post, reply).also(p => this.store.set(uri, p))
    );
  }

  uri: string;
  createdAt: Date;

  view: AppBskyFeedDefs.PostView;
  reply?: PostReply;

  author: PostAuthor;

  ownLike = new Subscribable<string | undefined>(undefined);
  ownRepost = new Subscribable<string | undefined>(undefined);

  likeCount = new Subscribable(0);
  repostCount = new Subscribable(0);
  replyCount = new Subscribable(0);

  moderation: ModerationResult[];

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

    this.article = elem("article", { className: "post" }, [
      elem("div", { className: "reason" }, []),
      elem("aside", {}, [
        elem(
          "a",
          { className: "contents", href: `/profile/${this.author.handle ?? this.author.did}` },
          [elem("img", { className: "avatar", src: this.author.avatar, loading: "lazy" })],
        ),
      ]),
      elem("section", { className: "post-main" }, [
        elem("div", { className: "topline" }, [
          elem("section", { className: "author" }, [
            ...(this.author.displayName
              ? [elem("strong", {}, [this.author.displayName]), " "]
              : []),
            this.author.handle
              ? elem("a", { className: "handle", href: `/profile/${this.author.handle}` }, [
                  `@${this.author.handle}`,
                ])
              : elem("a", { className: "handle" }, ["[invalid handle]"]),
          ]),
          elem("section", { className: "details" }, [age(this.createdAt)]),
        ]),
        reply
          ? elem("span", { className: "reply-details" }, [
              icon(Reply),
              "Replying to ",
              createReplyAuthor(reply),
            ])
          : "",
        elem("section", { className: "post-body" }, [
          richText(record.text, record.facets),
          ...(post.embed?.tap(embedMedia) ?? []),
        ]),
        this.#setupControls(),
      ]),
    ]);

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
    this.replyCount.set(newView.repostCount ?? 0);
  }

  #setupControls(): HTMLElement {
    return elem("section", { className: "controls" }, [
      elem("button", { className: "reply" }, [
        icon(MessageCircle),
        elem("data").also(data =>
          this.replyCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]),
      elem("button", { className: "repost" }, [
        icon(Repeat2),
        elem("data").also(data =>
          this.repostCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]).also(button => {
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
        elem("data").also(data =>
          this.likeCount.subscribeImmediate(count => (data.textContent = `${count}`)),
        ),
      ]).also(button => {
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

Object.defineProperty(globalThis, "Post", { value: Post });
