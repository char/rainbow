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
