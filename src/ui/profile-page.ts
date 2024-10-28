import type { AppBskyActorDefs } from "@atcute/client/lexicons";
import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem, noneElem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import { richText } from "./rich-text.ts";
import { Timeline } from "./timeline.ts";

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

export function profilePage() {
  const page = elem("section");
  let profile: HTMLElement = elem("div");

  let lastActor: string | undefined;
  let currentTimeline: Timeline | undefined;
  let details: Element = noneElem();

  route.subscribe(async route => {
    if (route.id !== "profile") {
      page.remove();
      return;
    }

    if (profile) profile.remove();
    profile = elem("div", {}, [details]);
    page.append(profile);

    const actor = route.didOrHandle;

    // if we're returning to the last actor we loaded we can use the stuff we already rendered
    if (actor === lastActor) {
      select(app, "main").append(page);
      currentTimeline?.show(profile);
    }

    lastActor = actor;

    const showProfileDetails = async () => {
      const { data: profileView } = await session!.xrpc.get("app.bsky.actor.getProfile", {
        params: { actor },
      });
      const newDetails = profileDetails(actor, profileView);
      details.replaceWith(newDetails);
      details = newDetails;
    };

    const loadTimeline = async () => {
      const { data: feedView } = await session!.xrpc.get("app.bsky.feed.getAuthorFeed", {
        params: { actor, filter: "posts_and_author_threads", limit: 30 },
      });

      currentTimeline?.hide();
      const timeline = new Timeline();
      currentTimeline = timeline;
      timeline.cursor = feedView.cursor;
      timeline.append(feedView.feed);

      timeline.loadMore = async cursor => {
        const { data: feedView } = await session!.xrpc.get("app.bsky.feed.getAuthorFeed", {
          params: { actor, filter: "posts_and_author_threads", limit: 30, cursor },
        });
        timeline.cursor = feedView.cursor;
        timeline.append(feedView.feed);
        return feedView.feed.length > 0;
      };

      timeline.show(profile);
    };

    await Promise.all([showProfileDetails(), loadTimeline()]);
    select(app, "main").append(page);
  });
}
