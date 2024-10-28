import type { AppBskyActorDefs, AppBskyFeedDefs } from "@atcute/client/lexicons";
import { elem } from "../../util/elem.ts";

export type PostReply =
  | { type: "post"; author: AppBskyActorDefs.ProfileViewBasic }
  | { type: "blocked"; author: AppBskyFeedDefs.BlockedAuthor }
  | { type: "not-found"; uri: string };
export function feedReply(feedParent: AppBskyFeedDefs.ReplyRef["parent"]): PostReply {
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
): PostReply {
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

export function createReplyAuthor(reply: PostReply): HTMLElement {
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
