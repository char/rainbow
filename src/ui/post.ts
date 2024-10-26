import type { AppBskyFeedDefs, AppBskyFeedPost } from "@atcute/client/lexicons";
import { navigateTo } from "../navigation.ts";
import { session } from "../session.ts";
import { createRecord, deleteRecord } from "../util/atp.ts";
import { elem } from "../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Repeat2, Reply } from "../util/icons.ts";
import { select } from "../util/select.ts";
import { formatRelativeTime } from "../util/temporal.ts";
import { embed } from "./embed.ts";
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

function handleControls(post: AppBskyFeedDefs.PostView, article: HTMLElement) {
  const like = select(article, ".controls .like", "button");
  like.addEventListener("click", async e => {
    e.preventDefault();
    e.stopPropagation();

    const likeId = like.dataset.like;
    if (likeId === "in-progress") {
      // do nothing
    } else if (likeId) {
      await deleteRecord({
        collection: "app.bsky.feed.like",
        repo: session!.did,
        rkey: likeId.split("/").pop()!,
      });

      delete like.dataset.like;
    } else {
      like.dataset.like = "in-progress";
      const newLike = await createRecord({
        collection: "app.bsky.feed.like",
        repo: session!.did,
        record: {
          $type: "app.bsky.feed.like",
          createdAt: new Date().toISOString(),
          subject: { cid: post.cid, uri: post.uri },
        },
      });
      like.dataset.like = newLike.uri;
    }
  });

  const repost = select(article, ".controls .repost", "button");
  repost.addEventListener("click", async e => {
    e.preventDefault();
    e.stopPropagation();

    const repostId = repost.dataset.repost;
    if (repostId === "in-progress") {
      // do nothing
    } else if (repostId) {
      await deleteRecord({
        collection: "app.bsky.feed.repost",
        repo: session!.did,
        rkey: repostId.split("/").pop()!,
      });
    } else {
      repost.dataset.repost = "in-progress";
      const newRepost = await createRecord({
        collection: "app.bsky.feed.repost",
        repo: session!.did,
        record: {
          $type: "app.bsky.feed.repost",
          createdAt: new Date().toISOString(),
          subject: { cid: post.cid, uri: post.uri },
        },
      });
      repost.dataset.repost = newRepost.uri;
    }
  });

  const reply = select(article, ".controls .reply", "button");
  // TODO

  const menuButton = select(article, ".controls .more", "button");
  // TODO
}

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
  isLink?: boolean,
): HTMLElement {
  const record = post.record as AppBskyFeedPost.Record;
  if (record.$type !== "app.bsky.feed.post") throw new Error("unreachable");

  const article = elem("article", { className: "post" }, [
    elem("a", { className: "contents", href: `/profile/${post.author.handle}` }, [
      elem("img", { className: "avatar", src: post.author.avatar }),
    ]),
    elem("section", {}, [
      elem("div", { className: "topline" }, [
        elem("a", { className: "contents", href: `/profile/${post.author.handle}` }, [
          elem("section", { className: "author" }, [
            post.author.displayName ? elem("strong", {}, [post.author.displayName]) : "",
            " ",
            elem("a", { className: "handle", href: `/profile/${post.author.handle}` }, [
              `@${post.author.handle}`,
            ]),
          ]),
        ]),
        elem("section", { className: "details" }, [
          elem("time", { dateTime: record.createdAt }, [
            formatRelativeTime(new Date(record.createdAt), new Date()),
          ]),
        ]),
      ]),
      details?.reply
        ? elem("span", { className: "reply-details" }, [
            icon(Reply),
            "Replying to ",
            replyAuthor(details.reply),
          ])
        : "",
      richText(record.text, record.facets),
      post.embed ? embed(post.embed) : "",
      elem("section", { className: "controls" }, [
        elem("button", { className: "reply" }, [
          icon(MessageCircle),
          elem("data", {}, [`${post.replyCount ?? 0}`]),
        ]),
        elem(
          "button",
          { className: "repost" },
          [icon(Repeat2), elem("data", {}, [`${post.repostCount ?? 0}`])],
          { dataset: { repost: post.viewer?.repost } },
        ),
        elem(
          "button",
          { className: "like" },
          [icon(Heart), elem("data", {}, [`${post.likeCount ?? 0}`])],
          { dataset: { like: post.viewer?.like } },
        ),
        elem("button", { className: "more" }, [icon(Ellipsis)]),
      ]),
    ]),
  ]);

  handleControls(post, article);

  if (isLink) {
    let mouseDownTime = 0;

    article.addEventListener("pointerdown", () => {
      mouseDownTime = performance.now();
    });

    article.addEventListener("click", e => {
      if (e.target instanceof HTMLElement && e.target.closest("a") !== null) return;
      if (e.ctrlKey || e.button !== 0) return;

      // don't navigate if we're like dragging on the post (e.g. to select text)
      const timeDelta = performance.now() - mouseDownTime;
      if (timeDelta > 200) return;

      e.preventDefault();
      e.stopPropagation();
      navigateTo(`/profile/${post.author.handle}/post/${post.uri.split("/").pop()}`);
    });
  }

  return article;
}
