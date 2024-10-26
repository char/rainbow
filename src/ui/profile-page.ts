import { route } from "../navigation.ts";
import { session } from "../session.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";
import type { AppBskyActorDefs } from "@atcute/client/lexicons";
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
      elem("a", { href: `/profile/${actor}/followers` }, [
        elem("data", {}, [`${profile.followersCount}`]),
        ` followers`,
      ]),
      " ",
      elem("a", { href: `/profile/${actor}/following` }, [
        elem("data", {}, [`${profile.followsCount}`]),
        ` following`,
      ]),
      " ",
      elem("data", {}, [`${profile.postsCount}`]),
      ` posts`,
    ]),

    profile.description ? richText(profile.description) : "",
  ]);

  return article;
}

export function profilePage() {
  const page = elem("section", {}, []);
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

    actor = route.didOrHandle;

    const { data: profileView } = await session!.xrpc.get("app.bsky.actor.getProfile", {
      params: { actor },
    });

    profile = profileDetails(actor, profileView);
    page.append(profile);

    // TODO: render a timeline of posts
  });
}
