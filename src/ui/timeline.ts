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

  hide() {
    this.container.remove();
  }

  show(elem: Element) {
    for (const post of this.posts) post.article.className = "post";
    this.container.replaceChildren(...this.posts.map(p => p.article));
    elem.append(this.container);
  }

  append(feed: AppBskyFeedDefs.FeedViewPost[]) {
    for (const feedPost of feed) {
      const post = Post.get(feedPost.post, feedPost.reply?.parent?.tap(feedReply));
      this.posts.push(post);
      this.container.append(post.article);
    }
  }
}

export function timeline() {
  let timeline = new Timeline();

  route.subscribe(async route => {
    if (route.id !== "timeline") {
      timeline.hide();
      return;
    }
    timeline.show(select(app, "main"));

    const {
      data: { feed, cursor },
    } = await session!.xrpc.get("app.bsky.feed.getTimeline", {
      params: { limit: 30 },
    });
    timeline.hide();

    timeline = new Timeline();
    timeline.cursor = cursor;
    timeline.append(feed);
    timeline.show(select(app, "main"));
  });
}
