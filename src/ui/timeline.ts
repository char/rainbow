import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { post } from "../state/post-store.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";

export function timeline() {
  const feed = elem("section", { className: "timeline" });

  route.subscribe(async route => {
    if (route.id !== "timeline") {
      feed.remove();
      return;
    }
    select(app, "main").append(feed);

    const timeline = await session!.xrpc.get("app.bsky.feed.getTimeline", {
      params: { limit: 30 },
    });

    for (const postView of timeline.data.feed) {
      const { article } = post(postView.post, postView);
      feed.append(article);
    }
  });
}
