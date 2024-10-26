import type { AppBskyFeedGetPostThread } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { post } from "./post.ts";

export function* threadPost(
  threadView: AppBskyFeedGetPostThread.Output["thread"],
  active: boolean = true,
  topReply: boolean = false,
): Generator<HTMLElement> {
  if (threadView.$type === "app.bsky.feed.defs#threadViewPost") {
    if (threadView.parent) {
      yield* threadPost(threadView.parent, false, false);
    }

    const article = post(threadView.post, undefined, true);
    if (active) article.classList.add("active");
    if (topReply) article.classList.add("top-reply");

    if (threadView.replies?.at(0)) article.classList.add("has-reply");

    yield article;

    if (threadView.replies) {
      let isTopReply = true;
      for (const reply of threadView.replies) {
        yield* threadPost(reply, false, isTopReply);
        isTopReply = false;
      }
    }
  }

  if (threadView.$type === "app.bsky.feed.defs#blockedPost") {
    // TODO
  }

  if (threadView.$type === "app.bsky.feed.defs#notFoundPost") {
    // TODO
  }
}

export function threadPage() {
  const page = elem("section", { className: "timeline" });

  let thread: HTMLElement | undefined;
  let threadURI: string | undefined;

  route.subscribe(async route => {
    if (route.id !== "thread") {
      page.remove();
      return;
    }

    page.innerHTML = "";

    const { data: threadView } = await session!.xrpc.get("app.bsky.feed.getPostThread", {
      params: { uri: route.uri },
    });

    page.append(...threadPost(threadView.thread));

    select(app, "main").append(page);
  });
}
