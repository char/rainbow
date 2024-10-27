import type {
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from "@atcute/client/lexicons";
import { navigateTo } from "../navigation.ts";
import { session } from "../session.ts";
import {
  $posts,
  normalizePostURI,
  normalizePostURIInternal,
  type UIPostData,
} from "../state/post-store.ts";
import { createRecord, deleteRecord } from "../util/atp.ts";
import { elem } from "../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Repeat2, Reply } from "../util/icons.ts";
import { Subscribable } from "../util/subscribable.ts";
import { age } from "./age.ts";
import { embedMedia } from "./embed.ts";
import { richText } from "./rich-text.ts";

export type UIPostReply =
  | { type: "post"; author: AppBskyActorDefs.ProfileViewBasic }
  | { type: "blocked"; author: AppBskyFeedDefs.BlockedAuthor }
  | { type: "not-found"; uri: string };
export function feedReply(feedParent: AppBskyFeedDefs.ReplyRef["parent"]): UIPostReply {
  if (feedParent.$type === "app.bsky.feed.defs#postView") {
    return { type: "post", author: feedParent.author };
  }
  if (feedParent.$type === "app.bsky.feed.defs#blockedPost") {
    return { type: "blocked", author: feedParent.author };
  }
  if (feedParent.$type === "app.bsky.feed.defs#notFoundPost") {
    return { type: "not-found", uri: feedParent.uri };
  }
  throw new Error("unreachable");
}
export function threadReply(
  threadParent: NonNullable<AppBskyFeedDefs.ThreadViewPost["parent"]>,
): UIPostReply {
  if (threadParent.$type === "app.bsky.feed.defs#threadViewPost") {
    return { type: "post", author: threadParent.post.author };
  }
  if (threadParent.$type === "app.bsky.feed.defs#blockedPost") {
    return { type: "blocked", author: threadParent.author };
  }
  if (threadParent.$type === "app.bsky.feed.defs#notFoundPost") {
    return { type: "not-found", uri: threadParent.uri };
  }
  throw new Error("unreachable");
}

function replyAuthor(reply: UIPostReply): HTMLElement {
  if (reply.type === "not-found") {
    return elem("a", { href: reply.uri }, ["[not found]"]);
  }

  let display: string | undefined;
  let didOrHandle: string | undefined;

  if (reply.type === "post") {
    display = reply.author.displayName ?? reply.author.handle;
    didOrHandle = reply.author.did;
  }
  if (reply.type === "blocked") {
    display = "[blocked]";
    didOrHandle = reply.author.did;
  }
  if (display === undefined || didOrHandle === undefined) throw new Error("unreachable");

  return elem("a", { className: "handle", href: `/profile/${didOrHandle}` }, [display]);
}

export function createPost(post: AppBskyFeedDefs.PostView, reply?: UIPostReply): UIPostData {
  const record = post.record as AppBskyFeedPost.Record;

  const author = {
    did: post.author.did,
    displayName: post.author.displayName,
    handle: post.author.handle === "handle.invalid" ? undefined : post.author.handle,
    avatar: post.author.avatar,
  };

  const uri = normalizePostURI(post);

  const createdAt = new Date(record.createdAt);

  const ownLike = new Subscribable<string | undefined>(post.viewer?.like);
  const ownRepost = new Subscribable<string | undefined>(post.viewer?.repost);

  const likeCount = new Subscribable(post.likeCount ?? 0);
  const repostCount = new Subscribable(post.repostCount ?? 0);
  const replyCount = new Subscribable(post.replyCount ?? 0);

  const article = elem(
    "article",
    { className: "post" },
    [
      elem("aside", {}, [
        elem("a", { className: "contents", href: `/profile/${author.handle ?? author.did}` }, [
          elem("img", { className: "avatar", src: author.avatar, loading: "lazy" }),
        ]),
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
          elem("section", { className: "details" }, [age(createdAt)]),
        ]),
        reply
          ? elem("span", { className: "reply-details" }, [
              icon(Reply),
              "Replying to ",
              replyAuthor(reply),
            ])
          : "",
        richText(record.text, record.facets),
        ...(post.embed?.tap(embedMedia) ?? []),
        elem("section", { className: "controls" }, [
          elem("button", { className: "reply" }, [
            icon(MessageCircle),
            elem("data").also(data =>
              replyCount.subscribeImmediate(count => (data.textContent = `${count}`)),
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

            ownRepost.subscribeImmediate(uri => {
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
      dataset: { uri },
    },
  );

  let mouseDownTime = 0;

  article.addEventListener("pointerdown", () => {
    mouseDownTime = performance.now();
  });

  article.addEventListener("click", e => {
    const isNotLink = article.dataset.noLink !== undefined;
    if (isNotLink) return;

    if (e.target instanceof HTMLElement && e.target.closest("a") !== null) return;
    if (e.ctrlKey || e.button !== 0) return;

    // don't navigate if we're like dragging on the post (e.g. to select text)
    const timeDelta = performance.now() - mouseDownTime;
    if (timeDelta > 200) return;

    e.preventDefault();
    e.stopPropagation();
    navigateTo(normalizePostURIInternal(post));
  });

  const postData = {
    uri,
    article,
    createdAt,
    ownLike,
    ownRepost,
    likeCount,
    replyCount,
    repostCount,

    hierarchy: {
      replies: new Set(),
    },
  } satisfies UIPostData;

  return postData.also(post => $posts.set(uri, post));
}
