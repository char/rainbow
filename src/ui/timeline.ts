import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { post, type UIPostData } from "../state/post-store.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { feedReply } from "./post.ts";

export class Timeline {
  posts: UIPostData[] = [];
  container: HTMLElement = elem("section", { className: "timeline" });
  cursor: string | undefined;

  hide() {
    this.container.remove();
  }

  show(elem: Element) {
    this.container.replaceChildren(
      ...this.posts.map(p => p.article.also(a => (a.className = "post"))),
    );
    elem.append(this.container);
  }

  append(feed: AppBskyFeedDefs.FeedViewPost[]) {
    for (const feedPost of feed) {
      const postObj = post(feedPost.post, feedPost.reply?.parent?.tap(feedReply));
      this.posts.push(postObj);
      this.container.append(postObj.article);
    }
  }
}

export function timeline() {
  const timeline = new Timeline();

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
    timeline.cursor = cursor;
    timeline.append(feed);
  });
}
