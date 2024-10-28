import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { Post } from "./post/post.ts";
import { feedReply } from "./post/reply.ts";

export class Timeline {
  posts: Post[] = [];
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

    for (const post of this.posts) post.article.className = "post";
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
      const post = Post.get(feedPost.post, feedPost.reply?.parent?.tap(feedReply));
      this.posts.push(post);
      this.container.append(post.article);
    }

    this.container.append(this.timelineEnd);
  }

  prepend(feed: AppBskyFeedDefs.FeedViewPost[]) {
    const posts = [];
    for (const feedPost of feed) {
      const post = Post.get(feedPost.post, feedPost.reply?.parent?.tap(feedReply));
      posts.push(post);
    }

    this.posts.unshift(...posts);
    this.container.prepend(...posts.map(it => it.article));
  }
}

export function timeline() {
  const timeline = new Timeline();

  timeline.loadMore = async () => {
    const {
      data: { feed, cursor },
    } = await session!.xrpc.get("app.bsky.feed.getTimeline", {
      params: { limit: 30, cursor: timeline.cursor },
    });
    timeline.cursor = cursor;
    timeline.append(feed);

    return feed.length > 0;
  };
  timeline.loadMore?.(undefined);

  route.subscribe(async route => {
    if (route.id !== "timeline") {
      timeline.hide();
      return;
    }

    timeline.show(select(app, "main"));
  });
}
