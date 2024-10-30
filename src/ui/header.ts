import { session } from "../session.ts";
import { selfProfile } from "../state/profile.ts";
import { elem } from "../util/elem.ts";
import { Bell, Hash, House, icon, Pen, Settings, UserCircle } from "../util/icons.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";

export function banner(): HTMLElement {
  return elem("section", { id: "app-info" }, [
    elem("h1", {}, ["Rainbow", elem("span", { ariaHidden: "true" }, [" 🌈"])]),
    elem("small", {}, ["Vanilla client for Bluesky."]),
    elem("div", {}, [
      elem("small", {}, [
        elem(
          "a",
          { className: "link", target: "_blank", href: "https://github.com/char/rainbow" },
          ["Source code"],
        ),
      ]),
    ]),
  ]);
}

export function nav(): HTMLElement {
  return elem("nav", {}, [
    elem("a", { href: "/" }, [icon(House), "Home"]),
    elem("a", { href: "/notifications", ariaDisabled: "true" }, [icon(Bell), "Notifications"]),
    elem("a", { href: "/feeds", ariaDisabled: "true" }, [icon(Hash), "Feeds"]),

    elem("a", { href: "/profile/" + session?.did }, [icon(UserCircle), "Profile"]).also(it => {
      selfProfile.subscribeImmediate(self => {
        it.href = `/profile/${self.handle === "handle.invalid" ? self.did : self.handle}`;
      });
    }),

    elem("a", { href: "/preferences", ariaDisabled: "true" }, [icon(Settings), "Preferences"]),

    elem("a", { className: "highlight", href: "/compose" }, [icon(Pen), "Compose"]),
  ]);
}

export function profile(): HTMLElement {
  const profile = elem("section", { id: "self-profile" }, [
    elem("img", { className: "avatar" }),
    elem("div", { id: "name" }, [
      elem("strong", { id: "display-name" }, ["[name]"]),
      elem("a", { className: "handle" }, ["@[handle]"]),
    ]),
  ]);
  const profileWrapper = elem("a", { className: "contents" }, [profile]);

  selfProfile.subscribeImmediate(self => {
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

  return profileWrapper;
}

export function header() {
  select(app, "header").append(banner(), nav(), profile());
}
