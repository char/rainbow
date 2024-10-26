import type { AppBskyFeedDefs, AppBskyFeedPost } from "@atcute/client/lexicons";
import { elem } from "../util/elem.ts";
import { Ellipsis, Heart, icon, MessageCircle, Recycle } from "../util/icons.ts";
import { richText } from "./rich-text.ts";

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
): HTMLElement {
  const record = post.record as AppBskyFeedPost.Record;
  if (record.$type !== "app.bsky.feed.post") throw new Error();

  const article = elem("article", { className: "post" }, [
    elem("a", { className: "contents", href: `/profile/${post.author.handle}` }, [
      elem("img", { className: "avatar", src: post.author.avatar }),
    ]),
    elem("section", {}, [
      elem("a", { className: "contents", href: `/profile/${post.author.handle}` }, [
        elem("section", { className: "author" }, [
          post.author.displayName ? elem("strong", {}, [post.author.displayName]) : "",
          " ",
          elem("a", { className: "handle", href: `/profile/${post.author.handle}` }, [
            `@${post.author.handle}`,
          ]),
        ]),
      ]),
      details?.reply ? "[reply to somebody]" : "",
      richText(record.text, record.facets),
      elem("section", { className: "controls" }, [
        elem("button", { className: "reply" }, [
          icon(MessageCircle),
          elem("data", {}, [`${post.replyCount ?? 0}`]),
        ]),
        elem("button", { className: "repost" }, [
          icon(Recycle),
          elem("data", {}, [`${post.repostCount ?? 0}`]),
        ]),
        elem("button", { className: "like" }, [
          icon(Heart),
          elem("data", {}, [`${post.likeCount ?? 0}`]),
        ]),
        elem("button", { className: "more" }, [icon(Ellipsis)]),
      ]),
    ]),
  ]);

  article.querySelectorAll(".controls button").forEach(it =>
    it.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
    }),
  );

  const articleWrapper = elem(
    "a",
    {
      className: "contents",
      href: `/profile/${post.author.handle}/post/${post.uri.split("/").pop()}`,
    },
    [article],
  );

  return articleWrapper;
}
