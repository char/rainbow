import type { AppBskyFeedDefs, AppBskyFeedPost } from "@atcute/client/lexicons";
import { navigateTo } from "../navigation.ts";
import { session } from "../session.ts";
import { createRecord, deleteRecord } from "../util/atp.ts";
import { elem, noneElem } from "../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Repeat2, Reply } from "../util/icons.ts";
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

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
  isLink?: boolean,
): HTMLElement {
  const record = post.record as AppBskyFeedPost.Record;

  const author = {
    did: post.author.did,
    displayName: post.author.displayName,
    handle: post.author.handle === "handle.invalid" ? undefined : post.author.handle,
    avatar: post.author.avatar,
  };

  const createdAt = new Date(record.createdAt);

  const ownLike = new Subscribable<string | undefined>(post.viewer?.like);
  const ownRepost = new Subscribable<string | undefined>(post.viewer?.like);

  const likeCount = new Subscribable(post.likeCount ?? 0);
  const repostCount = new Subscribable(post.repostCount ?? 0);
  const replyCount = new Subscribable(post.replyCount ?? 0);

  const article = elem(
    "article",
    { className: "post" },
    [
      elem("a", { className: "contents", href: `/profile/${author.handle ?? author.did}` }, [
        elem("img", { className: "avatar", src: author.avatar }),
      ]),
      elem("section", {}, [
        elem("div", { className: "topline" }, [
          elem("section", { className: "author" }, [
            ...(author.displayName ? [elem("strong", {}, [author.displayName]), " "] : []),
            author.handle
              ? elem("a", { className: "handle", href: `/profile/${author.handle}` }, [
                  `@${author.handle}`,
                ])
              : elem("a", { className: "handle" }, ["[invalid handle]"]),
          ]),
          elem("section", { className: "details" }, [
            elem("time", { dateTime: createdAt.toISOString() }, [
              formatRelativeTime(createdAt, new Date()),
            ]).also(it => {
              let age = Date.now() - createdAt.getTime();
              const periods = [
                [60 * 1000, 500],
                [60 * 60 * 1000, 30_000],
              ];

              let intervalId: number | undefined;
              let currentGroup: number | undefined;

              const update = () => {
                it.textContent = formatRelativeTime(createdAt, new Date());
                age = Date.now() - createdAt.getTime();

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
          ]),
        ]),
        details?.reply
          ? elem("span", { className: "reply-details" }, [
              icon(Reply),
              "Replying to ",
              replyAuthor(details.reply),
            ])
          : noneElem(),
        richText(record.text, record.facets),
        post.embed ? renderEmbed(post.embed) : "",
        elem("section", { className: "controls" }, [
          elem("button", { className: "reply" }, [
            icon(MessageCircle),
            elem("data").also(data =>
              replyCount.subscribe(count => (data.textContent = `${count}`)),
            ),
          ]),
          elem("button", { className: "repost" }, [
            icon(Repeat2),
            elem("data").also(data =>
              repostCount.subscribeImmediate(count => (data.textContent = `${count}`)),
            ),
          ]).also(button => {
            button.addEventListener("click", async e => {
              e.preventDefault();
              e.stopPropagation();

              const repostURI = ownRepost.get();
              if (repostURI === "in-progress") {
                // do nothing
              } else if (repostURI) {
                ownRepost.set(undefined);
                repostCount.set(repostCount.get() - 1);
                await deleteRecord({
                  collection: "app.bsky.feed.repost",
                  repo: session!.did,
                  rkey: repostURI.split("/").pop()!,
                });
              } else {
                ownRepost.set("in-progress");
                repostCount.set(repostCount.get() + 1);
                const newRepost = await createRecord({
                  collection: "app.bsky.feed.repost",
                  repo: session!.did,
                  record: {
                    $type: "app.bsky.feed.repost",
                    createdAt: new Date().toISOString(),
                    subject: { cid: post.cid, uri: post.uri },
                  },
                });
                ownRepost.set(newRepost.uri);
              }
            });

            ownRepost.subscribe(uri => {
              if (uri) button.dataset.repost = uri;
              else delete button.dataset.repost;
            });
          }),
          elem("button", { className: "like" }, [
            icon(Heart),
            elem("data").also(data =>
              likeCount.subscribeImmediate(count => (data.textContent = `${count}`)),
            ),
          ]).also(button => {
            button.addEventListener("click", async e => {
              e.preventDefault();
              e.stopPropagation();

              const likeURI = ownLike.get();
              if (likeURI === "in-progress") {
                // do nothing
              } else if (likeURI) {
                ownLike.set(undefined);
                likeCount.set(likeCount.get() - 1);
                await deleteRecord({
                  collection: "app.bsky.feed.like",
                  repo: session!.did,
                  rkey: likeURI.split("/").pop()!,
                });
              } else {
                ownLike.set("in-progress");
                likeCount.set(likeCount.get() + 1);
                const newLike = await createRecord({
                  collection: "app.bsky.feed.like",
                  repo: session!.did,
                  record: {
                    $type: "app.bsky.feed.like",
                    createdAt: new Date().toISOString(),
                    subject: { cid: post.cid, uri: post.uri },
                  },
                });
                ownLike.set(newLike.uri);
              }
            });

            ownLike.subscribeImmediate(uri => {
              if (uri) button.dataset.like = uri;
              else delete button.dataset.like;
            });
          }),
          elem("button", { className: "more" }, [icon(Ellipsis)]),
        ]),
      ]),
    ],
    {
      dataset: { uri: post.uri, link: isLink ? "" : undefined },
    },
  );

  let mouseDownTime = 0;

  article.addEventListener("pointerdown", () => {
    mouseDownTime = performance.now();
  });

  article.addEventListener("click", e => {
    const isLink = article.dataset.link !== undefined;
    if (!isLink) return;

    if (e.target instanceof HTMLElement && e.target.closest("a") !== null) return;
    if (e.ctrlKey || e.button !== 0) return;

    // don't navigate if we're like dragging on the post (e.g. to select text)
    const timeDelta = performance.now() - mouseDownTime;
    if (timeDelta > 200) return;

    e.preventDefault();
    e.stopPropagation();
    navigateTo(`/profile/${author.handle ?? author.did}/post/${post.uri.split("/").pop()}`);
  });

  return article;
}
