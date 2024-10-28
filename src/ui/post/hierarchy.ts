import type { Post } from "./post.ts";

export interface PostHierarchy {
  parent?: Post;
  replies: Set<Post>;
}
