import { timeline } from "./timeline.ts";
import { header } from "./header.ts";
import { profilePage } from "./profile-page.ts";
import { select } from "../util/select.ts";
import { elem } from "../util/elem.ts";
import { route } from "../navigation.ts";

export const app = document.querySelector("#app")!;

export function ui() {
  header();
  timeline();
  profilePage();

  const routeDebug = elem("code", {}, []);
  route.subscribe(route => {
    routeDebug.textContent = JSON.stringify(route, undefined, 2);
  });

  select(app, "footer").append(elem("pre", {}, ["current route", "\n", routeDebug]));
}
