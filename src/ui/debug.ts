import { route } from "../navigation.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { app } from "./_ui.ts";

export function debugUI() {
  const bskyAppLink = elem("a", { className: "link" }, ["Open in bsky.app"]);

  const routeDebug = elem("code", {}, []);
  route.subscribe(route => {
    routeDebug.textContent = JSON.stringify(route, undefined, 2);
    bskyAppLink.href = new URL(window.location.pathname, "https://bsky.app").href;
  });

  const footer = select(app, "footer");

  footer.append(bskyAppLink);
  footer.append(elem("pre", {}, ["current route", "\n", routeDebug]));
}
