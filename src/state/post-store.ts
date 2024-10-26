import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { createPost } from "../ui/post.ts";
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
Object.defineProperty(globalThis, "$posts", { value: $posts });

export function normalizePostURI(post: AppBskyFeedDefs.PostView) {
  const handle = post.author.handle === "handle.invalid" ? undefined : post.author.handle;
  return `at://${handle ?? post.author.did}/app.bsky.feed.post/${post.uri.split("/").pop()}`;
}

export function normalizePostURIInternal(post: AppBskyFeedDefs.PostView) {
  const handle = post.author.handle === "handle.invalid" ? undefined : post.author.handle;
  return `/profile/${handle ?? post.author.did}/post/${post.uri.split("/").pop()}`;
}

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
): UIPostData {
  const uri = normalizePostURI(post);
  const existingPost = $posts.get(uri);
  if (existingPost) {
    existingPost.article.className = "post";
    return existingPost;
  }
  return createPost(post, details);
}
