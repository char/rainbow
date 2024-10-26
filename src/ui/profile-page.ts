import type { AppBskyActorDefs } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { post } from "../state/post-store.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { feedReply } from "./post.ts";
import { richText } from "./rich-text.ts";

export function profileDetails(
  actor: string,
  profile: AppBskyActorDefs.ProfileViewDetailed,
): HTMLElement {
  const article = elem("article", { className: "profile-details" }, [
    elem("header", {}, [
      elem("img", { className: "banner", src: profile.banner }),
      elem("img", { className: "avatar", src: profile.avatar }),
      profile.displayName ? elem("h2", {}, [profile.displayName]) : "",
      elem("a", { className: "handle", href: `/profile/${profile.handle}` }, [
        `@${profile.handle}`,
      ]),
    ]),

    elem("section", { id: "numbers" }, [
      elem("span", {}, [
        elem("a", { href: `/profile/${actor}/followers` }, [
          elem("data", {}, [`${profile.followersCount}`]),
          ` followers`,
        ]),
      ]),
      " ",
      elem("span", {}, [
        elem("a", { href: `/profile/${actor}/following` }, [
          elem("data", {}, [`${profile.followsCount}`]),
          ` following`,
        ]),
      ]),
      " ",
      elem("span", {}, [elem("data", {}, [`${profile.postsCount}`]), ` posts`]),
    ]),

    profile.description ? richText(profile.description) : "",
  ]);

  return article;
}

export function profileTimeline(actor: string): HTMLElement {
  const section = elem("section", { className: "timeline" });

  session!.xrpc
    .get("app.bsky.feed.getAuthorFeed", {
      params: { actor, filter: "posts_and_author_threads", limit: 30 },
    })
    .then(({ data: feedView }) => {
      for (const postView of feedView.feed) {
        section.append(
          post(
            postView.post,
            postView.reply?.parent ? feedReply(postView.reply.parent) : undefined,
          ).article,
        );
      }
    });

  return section;
}

export function profilePage() {
  const page = elem("section");
  let profile: HTMLElement | undefined;

  let actor: string | undefined;

  route.subscribe(async route => {
    if (route.id !== "profile") {
      page.remove();
      return;
    }

    // if we're returning to the last actor we loaded we can use the stuff we already rendered
    if (route.didOrHandle === actor) {
      select(app, "main").append(page);
      return;
    }

    if (profile) profile.remove();
    select(app, "main").append(page);
    profile = elem("div");

    actor = route.didOrHandle;

    const { data: profileView } = await session!.xrpc.get("app.bsky.actor.getProfile", {
      params: { actor },
    });

    profile.append(profileDetails(actor, profileView));
    profile.append(profileTimeline(actor));

    page.append(profile);

    // TODO: render a timeline of posts
  });
}
