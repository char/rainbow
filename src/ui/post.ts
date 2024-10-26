import type { AppBskyFeedDefs, AppBskyFeedPost, At } from "@atcute/client/lexicons";
import type { Facet } from "npm:@atcute/bluesky-richtext-segmenter@1";
import { navigateTo } from "../navigation.ts";
import { session } from "../session.ts";
import { createRecord, deleteRecord } from "../util/atp.ts";
import { elem, elemRewrite, noneElem } from "../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Repeat2, Reply } from "../util/icons.ts";
import { select } from "../util/select.ts";
import { Subscribable } from "../util/subscribable.ts";
import { formatRelativeTime } from "../util/temporal.ts";
import { embed as renderEmbed } from "./embed.ts";
import { richText } from "./rich-text.ts";

function replyAuthor(reply: AppBskyFeedDefs.ReplyRef): HTMLElement {
  if (reply.parent.$type === "app.bsky.feed.defs#notFoundPost") {
    return elem("a", { href: reply.parent.uri }, ["[not found]"]);
  }

  let display: string | undefined;
  let didOrHandle: string | undefined;

  if (reply.parent.$type === "app.bsky.feed.defs#postView") {
    display = reply.parent.author.displayName ?? reply.parent.author.handle;
    didOrHandle = reply.parent.author.did;
  }
  if (reply.parent.$type === "app.bsky.feed.defs#blockedPost") {
    display = "[blocked]";
    didOrHandle = reply.parent.author.did;
  }
  if (display === undefined || didOrHandle === undefined) throw new Error("unreachable");

  return elem("a", { className: "handle", href: `/profile/${didOrHandle}` }, [display]);
}

export const postStore = new Map<string, AppBskyFeedDefs.PostView>();
export const feedDetailsStore = new Map<
  string,
  Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">
>();

export interface UIAuthor {
  did: string;
  displayName?: string;
  handle?: string;
  avatar?: string;
}

export interface UIPostData {
  uri: At.Uri;
  cid: At.CID;
  author: UIAuthor;
  createdAt: Date;
  text?: string;
  facets?: Facet[];
  replyRef?: AppBskyFeedDefs.ReplyRef;
  embed?: AppBskyFeedDefs.PostView["embed"];
}

export const DUMMY_AUTHOR: UIAuthor = {
  did: "",
  handle: "user.bsky.example",
};

export const DUMMY_POST_DATA: UIPostData = {
  uri: "at://undefined",
  cid: "undefined",
  author: DUMMY_AUTHOR,
  createdAt: new Date(0),
};

export class UIPost extends HTMLElement {
  postData = new Subscribable(DUMMY_POST_DATA);

  ownLike = new Subscribable<string | undefined>(undefined);
  ownRepost = new Subscribable<string | undefined>(undefined);

  likeCount = new Subscribable(0);
  repostCount = new Subscribable(0);
  replyCount = new Subscribable(0);

  sections: HTMLElement[];

  constructor() {
    super();

    const avatarSection = elem("a", { className: "contents" }, [
      elem("img", { className: "avatar" }),
    ]);
    this.postData.subscribe(({ author }) => {
      avatarSection.href = `/profile/${author.handle}`;
      const img = select(avatarSection, "img", "img");
      if (author.avatar) img.src = author.avatar;
      else img.removeAttribute("src");
    });

    const detailsSection = elem("section", { className: "details" });
    this.postData.subscribe(data => {
      elemRewrite(detailsSection, [
        elem("time", { dateTime: data.createdAt.toISOString() }, [
          formatRelativeTime(data.createdAt, new Date()),
        ]).also(it => {
          let age = Date.now() - data.createdAt.getTime();
          const periods = [
            [60 * 1000, 500],
            [60 * 60 * 1000, 30_000],
          ];

          let intervalId: number | undefined;
          let currentGroup: number | undefined;

          const update = () => {
            it.textContent = formatRelativeTime(data.createdAt, new Date());
            age = Date.now() - data.createdAt.getTime();

            for (const [ageCap, interval] of periods) {
              if (age < ageCap) {
                if (currentGroup !== ageCap) {
                  if (intervalId) clearInterval(intervalId);
                  intervalId = setInterval(update, interval);
                  currentGroup = ageCap;
                }

                break;
              }
            }
          };
          update();
        }),
      ]);
    });

    const authorSection = elem("section", { className: "author" });
    const authorLink = elem("a", { className: "contents" }, [authorSection]);
    this.postData.subscribe(({ author }) => {
      authorLink.href = `/profile/${author.handle ?? author.did}`;
      elemRewrite(authorSection, [
        ...(author.displayName ? [elem("strong", {}, [author.displayName]), " "] : []),
        elem("a", { className: "handle", href: `/profile/${author.handle}` }, [
          `@${author.handle}`,
        ]),
      ]);
      select(authorSection, "strong").textContent = author.displayName ?? "";
    });

    const topline = elem("div", { className: "topline" }, [authorSection, detailsSection]);

    let replyDetails: HTMLElement = noneElem();
    this.postData.subscribe(({ replyRef }) => {
      const newReplyDetails = replyRef
        ? elem("span", { className: "reply-details" }, [
            icon(Reply),
            "Replying to ",
            replyAuthor(replyRef),
          ])
        : noneElem();
      replyDetails.replaceWith(newReplyDetails);
      replyDetails = newReplyDetails;
    });

    let content: HTMLElement = noneElem();
    this.postData.subscribe(({ text, facets }) => {
      const newContent = text ? richText(text, facets) : noneElem();
      content.replaceWith(newContent);
      content = newContent;
    });

    let embed: HTMLElement = noneElem();
    this.postData.subscribe(({ embed: embedData }) => {
      const newEmbed = embedData ? renderEmbed(embedData) : noneElem();
      embed.replaceWith(newEmbed);
      embed = newEmbed;
    });

    const controlsSection = elem("section", { className: "controls" }, [
      elem("button", { className: "reply" }, [
        icon(MessageCircle),
        elem("data").also(data =>
          this.replyCount.subscribe(count => (data.textContent = `${count}`)),
        ),
      ]),
      elem("button", { className: "repost" }, [
        icon(Repeat2),
        elem("data").also(data =>
          this.repostCount.subscribe(count => (data.textContent = `${count}`)),
        ),
      ]).also(button => {
        button.addEventListener("click", async e => {
          e.preventDefault();
          e.stopPropagation();

          const ownRepost = this.ownRepost.get();
          if (ownRepost === "in-progress") {
            // do nothing
          } else if (ownRepost) {
            this.ownRepost.set(undefined);
            this.repostCount.set(this.repostCount.get() - 1);
            await deleteRecord({
              collection: "app.bsky.feed.repost",
              repo: session!.did,
              rkey: ownRepost.split("/").pop()!,
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
                subject: { cid: this.postData.get().cid, uri: this.postData.get().uri },
              },
            });
            this.ownRepost.set(newRepost.uri);
          }
        });

        this.ownRepost.subscribe(uri => {
          if (uri) button.dataset.repost = uri;
          else delete button.dataset.repost;
        });
      }),
      elem("button", { className: "like" }, [
        icon(Heart),
        elem("data").also(data =>
          this.likeCount.subscribe(count => (data.textContent = `${count}`)),
        ),
      ]).also(button => {
        button.addEventListener("click", async e => {
          e.preventDefault();
          e.stopPropagation();

          const ownLike = this.ownLike.get();
          if (ownLike === "in-progress") {
            // do nothing
          } else if (ownLike) {
            this.ownLike.set(undefined);
            this.likeCount.set(this.likeCount.get() - 1);
            await deleteRecord({
              collection: "app.bsky.feed.like",
              repo: session!.did,
              rkey: ownLike.split("/").pop()!,
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
                subject: { cid: this.postData.get().cid, uri: this.postData.get().uri },
              },
            });
            this.ownLike.set(newLike.uri);
          }
        });

        this.ownLike.subscribe(uri => {
          if (uri) button.dataset.like = uri;
          else delete button.dataset.like;
        });
      }),
      elem("button", { className: "more" }, [icon(Ellipsis)]),
    ]);

    this.sections = [
      avatarSection,
      elem("section", {}, [topline, replyDetails, content, embed, controlsSection]),
    ];

    let mouseDownTime = 0;

    this.addEventListener("pointerdown", () => {
      mouseDownTime = performance.now();
    });

    this.addEventListener("click", e => {
      const isLink = this.dataset.link !== undefined;
      if (!isLink) return;

      if (e.target instanceof HTMLElement && e.target.closest("a") !== null) return;
      if (e.ctrlKey || e.button !== 0) return;

      // don't navigate if we're like dragging on the post (e.g. to select text)
      const timeDelta = performance.now() - mouseDownTime;
      if (timeDelta > 200) return;

      e.preventDefault();
      e.stopPropagation();
      navigateTo(
        `/profile/${this.postData.get().author.handle}/post/${this.postData.get().uri.split("/").pop()}`,
      );
    });
  }

  connectedCallback() {
    this.append(...this.sections);

    const postURI = this.dataset.uri;

    if (!postURI) throw new Error();

    const post = postStore.get(postURI);
    if (!post) throw new Error("unreachable");
    const details = feedDetailsStore.get(postURI);

    const record = post.record as AppBskyFeedPost.Record;
    if (record.$type !== "app.bsky.feed.post") throw new Error("unreachable");

    this.postData.set({
      uri: post.uri,
      cid: post.cid,
      author: {
        did: post.author.did,
        displayName: post.author.displayName,
        handle: post.author.handle,
        avatar: post.author.avatar,
      },
      createdAt: new Date(record.createdAt),
      text: record.text,
      facets: record.facets,
      replyRef: details?.reply,
      embed: post.embed,
    });

    this.likeCount.set(post.likeCount ?? 0);
    this.repostCount.set(post.repostCount ?? 0);
    this.replyCount.set(post.replyCount ?? 0);

    this.ownLike.set(post.viewer?.like);
    this.ownRepost.set(post.viewer?.repost);
  }

  disconnectedCallback() {
    this.innerHTML = "";
  }
}

customElements.define("rainbow-post", UIPost);
declare global {
  interface HTMLElementTagNameMap {
    "rainbow-post": UIPost;
  }
}

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
  isLink?: boolean,
): HTMLElement {
  postStore.set(post.uri, post);
  if (details) feedDetailsStore.set(post.uri, details);

  return elem("rainbow-post", {}, [], {
    dataset: { uri: post.uri, link: isLink ? "" : undefined },
  });
}
