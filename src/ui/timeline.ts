import type { AppBskyFeedDefs, AppBskyFeedGetTimeline } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { Post } from "./post/post.ts";
import { feedReply } from "./post/reply.ts";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;

export class Timeline {
  posts: Post[] = [];
  feedPosts = new Map<string, FeedViewPost>();

  container: HTMLElement = elem("section", { className: "timeline" });
  cursor: string | undefined;

  timelineEnd: HTMLElement = elem("div", { className: "loading" }, ["Loading..."]);
  observer?: IntersectionObserver;

  hasMore: boolean = true;
  loadMore?: (cursor: string | undefined) => Promise<boolean> = undefined;
  loadingDebounce: boolean = false;

  hide() {
    this.observer?.unobserve(this.timelineEnd);
    this.container.remove();
  }

  show(elem: Element) {
    this.observer?.unobserve(this.timelineEnd);
    this.timelineEnd.remove();

    for (const post of this.posts) {
      post.article.className = "post";

      const feedPost = this.feedPosts.get(post.uri);
      post.setReason(feedPost?.reason);
    }
    this.container.replaceChildren(...this.posts.map(p => p.article));
    elem.append(this.container);

    if (!this.observer) {
      this.observer = new IntersectionObserver(
        entries => {
          if (!entries.some(it => it.isIntersecting)) return;

          if (this.hasMore && !this.loadingDebounce) {
            this.timelineEnd.textContent = "Fetching...";
            this.loadingDebounce = true;
            this.loadMore?.(this.cursor)
              .then(hasMore => {
                this.hasMore = hasMore;
              })
              .finally(() => {
                this.timelineEnd.textContent = "End of timeline.";
                this.loadingDebounce = false;
              });
          }
        },
        { root: null },
      );
    }

    this.container.append(this.timelineEnd);
    if (this.hasMore) this.observer.observe(this.timelineEnd);
  }

  append(feed: AppBskyFeedDefs.FeedViewPost[]) {
    for (const feedPost of feed) {
      const post = Post.get(feedPost.post, feedPost.reply?.parent?.pipe(feedReply));
      const alreadyExisted = this.feedPosts.has(post.uri);
      this.feedPosts.set(post.uri, feedPost);
      if (!alreadyExisted) {
        this.posts.push(post);
        this.container.append(post.article);
      }
    }

    this.container.append(this.timelineEnd);
  }

  prepend(feed: AppBskyFeedDefs.FeedViewPost[]) {
    const posts = [];
    for (const feedPost of feed) {
      const post = Post.get(feedPost.post, feedPost.reply?.parent?.pipe(feedReply));
      const alreadyExisted = this.feedPosts.has(post.uri);
      this.feedPosts.set(post.uri, feedPost);
      if (!alreadyExisted) posts.push(post);
    }

    this.posts.unshift(...posts);
    this.container.prepend(...posts.map(it => it.article));
  }
}

async function fetchFeed(
  algorithm: string | undefined,
  cursor: string | undefined,
): Promise<AppBskyFeedGetTimeline.Output> {
  const { data } = await session!.xrpc.get("app.bsky.feed.getTimeline", {
    params: { limit: 30, cursor, algorithm },
  });
  return data;
}

async function createFeedTimeline(algorithm: string | undefined) {
  const timeline = new Timeline();
  timeline.loadMore = async (cursor: string | undefined) => {
    const { feed, cursor: newCursor } = await fetchFeed(algorithm, cursor);
    timeline.cursor = newCursor;
    timeline.append(feed);
    return feed.length > 0;
  };
  await timeline.loadMore?.(undefined);

  return timeline;
}

export function timeline() {
  let currentTimeline: Timeline | undefined;
  const timelines = new Map<string | undefined, Timeline>();

  route.subscribe(async route => {
    if (route.id !== "timeline") {
      currentTimeline?.hide();
      return;
    }

    currentTimeline?.show(select(app, "main"));

    const timeline =
      timelines.get(route.alg) ??
      (await createFeedTimeline(route.alg)).tap(it => timelines.set(route.alg, it));

    if (currentTimeline === timeline) {
      fetchFeed(route.alg, undefined).then(res => {
        timeline.prepend(res.feed);
      });
    } else {
      currentTimeline?.hide();
      currentTimeline = timeline;
      timeline.show(select(app, "main"));
    }
  });
}
