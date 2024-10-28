import type { AppBskyFeedGetPostThread } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { setClass } from "../util/set-class.ts";
import { app } from "./_ui.ts";
import { Post } from "./post/post.ts";
import { threadReply } from "./post/reply.ts";

export function sortPosts(posts: Post[]) {
  // TODO: follower priority for sorting?
  posts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function buildThread(threadView: AppBskyFeedGetPostThread.Output["thread"]): Post {
  if (threadView.$type !== "app.bsky.feed.defs#threadViewPost") throw new Error("TODO");

  const root = Post.get(threadView.post, threadView.parent?.tap(threadReply));
  setClass(root.article, "active", true);

  type ThreadData = { threadView: typeof threadView; post: Post };
  const threadData = { threadView, post: root };

  let current: ThreadData | undefined = threadData;
  while (current !== undefined) {
    let parent: ThreadData | undefined;

    if (current.threadView.parent?.$type === "app.bsky.feed.defs#threadViewPost") {
      parent = {
        threadView: current.threadView.parent,
        post: Post.get(
          current.threadView.parent.post,
          current.threadView.parent.parent?.tap(threadReply),
        ),
      };
    }

    if (parent) {
      current.post.hierarchy.parent = parent.post;
      parent.post.hierarchy.replies.add(current.post);
      setClass(parent.post.article, "active", false);
      setClass(parent.post.article, "has-reply", true);
      setClass(current.post.article, "top-reply", true);
    }

    current = parent;
  }

  const addReplies = (thread: ThreadData) => {
    if (thread.threadView.replies?.length) {
      setClass(thread.post.article, "has-reply", true);

      let isTopReply = true;
      for (const reply of thread.threadView.replies) {
        if (reply.$type === "app.bsky.feed.defs#threadViewPost") {
          const replyThread: ThreadData = {
            threadView: reply,
            post: Post.get(reply.post, threadReply(thread.threadView)),
          };
          setClass(replyThread.post.article, "active", false);
          setClass(replyThread.post.article, "top-reply", isTopReply);

          replyThread.post.hierarchy.parent = thread.post;
          thread.post.hierarchy.replies.add(replyThread.post);

          isTopReply = false;
          addReplies(replyThread);
        }

        isTopReply = false;
      }
    }
  };

  addReplies(threadData);

  return root;
}

export function renderThread(page: HTMLElement, root: Post) {
  page.append(root.article);
  setClass(root.article, "active", true);

  // render ancestors
  let current: Post | undefined = root;
  while (current) {
    const parent: Post | undefined = current.hierarchy.parent;
    if (parent) {
      current.article.insertAdjacentElement("beforebegin", parent.article);
      setClass(parent.article, "active", false);
      setClass(parent.article, "has-reply", true);
      setClass(current.article, "top-reply", true);
    }
    current = parent;
  }

  const addReplies = (post: Post) => {
    let isTopReply = true;
    for (const child of [...post.hierarchy.replies].also(sortPosts)) {
      setClass(child.article, "active", false);
      setClass(child.article, "has-reply", child.hierarchy.replies.size);

      setClass(child.article, "top-reply", isTopReply);
      isTopReply = false;

      page.append(child.article);
      addReplies(child);
    }
  };

  addReplies(root);
}

export function threadPage() {
  const page = elem("section", { className: "timeline thread" });

  route.subscribe(async route => {
    if (route.id !== "thread") {
      page.remove();
      return;
    }

    page.innerHTML = "";

    const eagerPost = $posts.get(route.uri);
    if (eagerPost) {
      renderThread(page, eagerPost);
    }

    select(app, "main").append(page);

    let earlyBoundingRect: DOMRect | undefined = eagerPost?.article.getBoundingClientRect();
    const pageBoundingRect = page.getBoundingClientRect();
    if (earlyBoundingRect) {
      // 1px gap for psuedo-border
      scrollTo(0, earlyBoundingRect.y - pageBoundingRect.y - 1);
    }

    const { data: threadView } = await session!.xrpc.get("app.bsky.feed.getPostThread", {
      params: { uri: route.uri },
    });

    earlyBoundingRect = eagerPost?.article.getBoundingClientRect();

    page.innerHTML = "";
    renderThread(page, buildThread(threadView.thread));

    if (eagerPost) {
      const postRect = eagerPost.article.getBoundingClientRect();
      const delta = postRect.y + 1 - (earlyBoundingRect?.y ?? 0);
      scrollTo(0, scrollY + delta);
    }
  });
}
