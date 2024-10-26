import type { AppBskyFeedGetPostThread } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { $posts, post } from "../state/post-store.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";

export function* threadPost(
  threadView: AppBskyFeedGetPostThread.Output["thread"],
  active: boolean = true,
  topReply: boolean = false,
  isParent: boolean = false,
): Generator<HTMLElement> {
  if (threadView.$type === "app.bsky.feed.defs#threadViewPost") {
    if (threadView.parent) {
      yield* threadPost(threadView.parent, false, false, true);
      topReply = true;
    }

    const { article } = post(threadView.post);
    if (active) article.classList.add("active");
    if (topReply) article.classList.add("top-reply");

    if (isParent || threadView.replies?.at(0)) article.classList.add("has-reply");

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

  route.subscribe(async route => {
    if (route.id !== "thread") {
      page.remove();
      return;
    }

    page.innerHTML = "";

    const earlyPost = $posts.get(route.uri);
    if (earlyPost) {
      const article = earlyPost.article;
      article.className = "post active";
      article.classList.add("active");
      page.append(article);
    }

    select(app, "main").append(page);

    const { data: threadView } = await session!.xrpc.get("app.bsky.feed.getPostThread", {
      params: { uri: route.uri },
    });

    const earlyBoundingRect: DOMRect | undefined = earlyPost?.article.getBoundingClientRect();

    page.innerHTML = "";
    page.append(...threadPost(threadView.thread));

    if (earlyPost) {
      const postRect = earlyPost.article.getBoundingClientRect();
      console.log(postRect);
      window.scrollTo(0, postRect.top - (earlyBoundingRect?.top ?? 0));
    }
  });
}
