import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { createPost } from "../ui/post.ts";
import type { Subscribable } from "../util/subscribable.ts";

export interface StoredPost {
  uri: string;
  article: HTMLElement;

  ownLike: Subscribable<string | undefined>;
  ownRepost: Subscribable<string | undefined>;

  likeCount: Subscribable<number>;
  repostCount: Subscribable<number>;
  replyCount: Subscribable<number>;

  parent?: StoredPost;
  replies?: StoredPost[];
}

export const $posts = new Map<string, StoredPost>();

export function normalizePostURI(post: AppBskyFeedDefs.PostView) {
  const handle = post.author.handle === "handle.invalid" ? undefined : post.author.handle;
  return `at://${handle ?? post.author.did}/app.bsky.feed.post/${post.uri.split("/").pop()}`;
}

export function post(
  post: AppBskyFeedDefs.PostView,
  details?: Pick<AppBskyFeedDefs.FeedViewPost, "reason" | "reply">,
): StoredPost {
  const uri = normalizePostURI(post);
  const existingPost = $posts.get(uri);
  if (existingPost) {
    existingPost.article.className = "post";
    return existingPost;
  }
  return createPost(post, details);
}
