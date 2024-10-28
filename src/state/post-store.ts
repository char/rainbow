import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { createPost, type UIPostReply } from "../ui/post.ts";
import type { Subscribable } from "../util/subscribable.ts";

export interface UIPostData {
  uri: string;
  article: HTMLElement;

  createdAt: Date;

  ownLike: Subscribable<string | undefined>;
  ownRepost: Subscribable<string | undefined>;

  likeCount: Subscribable<number>;
  repostCount: Subscribable<number>;
  replyCount: Subscribable<number>;

  feedViewDetails?: {
    reason?: AppBskyFeedDefs.FeedViewPost["reason"];
    reply?: AppBskyFeedDefs.FeedViewPost["reply"];
  };

  hierarchy: {
    parent?: UIPostData;
    replies: Set<UIPostData>;
  };
}

// TODO: evict posts from store when we don't need them
export const $posts = new Map<string, UIPostData>();

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

export function post(post: AppBskyFeedDefs.PostView, reply?: UIPostReply): UIPostData {
  const uri = normalizePostURI(post);
  const existingPost = $posts.get(uri);
  if (existingPost) {
    existingPost.article.className = "post";
    return existingPost;
  }
  return createPost(post, reply);
}
