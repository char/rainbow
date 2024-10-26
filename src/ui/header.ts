import { session } from "../session.ts";
import { selfProfile } from "../state/profile.ts";
import { elem } from "../util/elem.ts";
import { Bell, Hash, House, icon, UserCircle } from "../util/icons.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";

export function nav() {
  const nav = elem("nav", {}, [
    elem("a", { href: "/" }, [icon(House), "Home"]),
    elem("a", { href: "/notifications" }, [icon(Bell), "Notifications"]),
    elem("a", { href: "/feeds" }, [icon(Hash), "Feeds"]),
    elem("a", { href: "/profile/" + session?.did }, [icon(UserCircle), "Profile"]),
  ]);

  select(app, "header").append(nav);
}

export function profile() {
  const profile = elem("section", { id: "self-profile" }, [
    elem("img", { className: "avatar" }),
    elem("div", { id: "name" }, [
      elem("strong", { id: "display-name" }, ["[name]"]),
      elem("a", { className: "handle" }, ["@[handle]"]),
    ]),
  ]);
  const profileWrapper = elem("a", { className: "contents" }, [profile]);

  selfProfile.subscribe(self => {
    profileWrapper.href = `/profile/${self.handle}`;

    const displayName = select(profile, "#display-name");

    if (self.displayName) {
      displayName.style.display = "";
      displayName.textContent = self.displayName;
    } else displayName.style.display = "none";

    const handle = select(profile, ".handle", "a");
    handle.textContent = `@${self.handle}`;
    handle.href = `/profile/${self.handle}`;

    if (self.avatar) {
      select(profile, "img", "img").src = self.avatar;
    } else {
      select(profile, "img").removeAttribute("src");
    }
  });

  select(app, "header").append(profileWrapper);
}

export function header() {
  select(app, "header").append(
    elem("section", { id: "app-info" }, [
      elem("h1", {}, ["Rainbow", elem("span", { ariaHidden: "true" }, [" 🌈"])]),
      elem("small", {}, ["Vanilla client for Bluesky."]),
    ]),
  );

  nav();
  profile();
}
