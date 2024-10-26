import type {
  AppBskyFeedDefs,
  AppBskyFeedGetPostThread,
  AppBskyFeedPost,
} from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { $posts, post, type UIPostData } from "../state/post-store.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { setClass } from "../util/set-class.ts";
import { app } from "./_ui.ts";

// TODO: follower priority for sorting?

export function sortPosts(posts: UIPostData[]) {
  posts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function sortReplies(replies: NonNullable<AppBskyFeedDefs.ThreadViewPost["replies"]>) {
  replies.sort((a, b) => {
    if (
      a.$type !== "app.bsky.feed.defs#threadViewPost" ||
      b.$type !== "app.bsky.feed.defs#threadViewPost"
    ) {
      return 0;
    }

    const aRecord = a.post.record as AppBskyFeedPost.Record;
    const bRecord = b.post.record as AppBskyFeedPost.Record;
    return new Date(aRecord.createdAt).getTime() - new Date(bRecord.createdAt).getTime();
  });
}

export function* threadPost(
  threadView: AppBskyFeedGetPostThread.Output["thread"],
  opts: {
    active?: boolean;
    topReply?: boolean;
    parentPost?: UIPostData;
    childPost?: UIPostData;
  } = {},
): Generator<UIPostData> {
  if (threadView.$type !== "app.bsky.feed.defs#threadViewPost") return;

  const currentPost = post(threadView.post);
  setClass(currentPost.article, "top-reply", opts.topReply);
  setClass(currentPost.article, "has-reply", opts.childPost || threadView.replies?.length);
  setClass(currentPost.article, "active", opts.active);

  if (opts.parentPost) {
    currentPost.hierarchy.parent = opts.parentPost;
    opts.parentPost.hierarchy.replies.add(currentPost);
  }
  if (opts.childPost) {
    currentPost.hierarchy.replies.add(opts.childPost);
    opts.childPost.hierarchy.parent = currentPost;
  }

  if (threadView.parent) {
    yield* threadPost(threadView.parent, { childPost: currentPost });
    setClass(currentPost.article, "top-reply", true);
  }

  yield currentPost;

  if (threadView.replies) {
    let isTopReply = true;
    for (const reply of [...threadView.replies].also(sortReplies)) {
      yield* threadPost(reply, { parentPost: currentPost, topReply: isTopReply });
      isTopReply = false;
    }
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
      console.log(earlyPost);

      page.append(earlyPost.article);
      setClass(earlyPost.article, "active", true);

      let currentUpwards: UIPostData | undefined = earlyPost;
      while (currentUpwards !== undefined) {
        if (currentUpwards.hierarchy.parent) {
          currentUpwards.article.insertAdjacentElement(
            "beforebegin",
            currentUpwards.hierarchy.parent.article,
          );
          setClass(currentUpwards.hierarchy.parent.article, "active", false);
        }
        currentUpwards = currentUpwards.hierarchy.parent;
      }

      const showChildren = (post: UIPostData) => {
        for (const child of [...post.hierarchy.replies].also(sortPosts)) {
          setClass(child.article, "active", false);
          page.append(child.article);
          showChildren(child);
        }
      };

      showChildren(earlyPost);
    }

    select(app, "main").append(page);

    let earlyBoundingRect: DOMRect | undefined = earlyPost?.article.getBoundingClientRect();
    const pageBoundingRect = page.getBoundingClientRect();
    if (earlyBoundingRect) {
      // 1px gap for psuedo-border
      scrollTo(0, earlyBoundingRect.y - pageBoundingRect.y - 1);
    }

    const { data: threadView } = await session!.xrpc.get("app.bsky.feed.getPostThread", {
      params: { uri: route.uri },
    });

    earlyBoundingRect = earlyPost?.article.getBoundingClientRect();

    page.innerHTML = "";
    for (const post of threadPost(threadView.thread, { active: true })) {
      page.append(post.article);
    }

    if (earlyPost) {
      const postRect = earlyPost.article.getBoundingClientRect();
      const delta = postRect.y - (earlyBoundingRect?.y ?? 0);
      scrollTo(0, scrollY + delta);
    }
  });
}
