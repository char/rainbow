import "../_env.ts";
import "../css/main.css";

import "./util/also.ts";

import "npm:urlpattern-polyfill";
import "./navigation.ts";

import { loginForm } from "./login-form.ts";
import { session } from "./session.ts";

import { parseRoute, route } from "./navigation.ts";
import { fetchPreferences } from "./state/preferences.ts";
import { ui } from "./ui/_ui.ts";
import { isComposing } from "./ui/compose.ts";
import { banner } from "./ui/header.ts";

if (session !== undefined) {
  let requestedPath = location.pathname;
  const preOAuthRoute = localStorage.getItem("rainbow/pre-oauth-route");
  if (preOAuthRoute) {
    localStorage.removeItem("rainbow/pre-oauth-route");
    requestedPath = preOAuthRoute;
  }

  await fetchPreferences();

  ui();

  if (requestedPath === "/compose") {
    route.set({ id: "timeline" });
    isComposing.set(true);
  } else {
    route.set(requestedPath.tap(parseRoute));
  }
} else {
  document.querySelector("header")!.append(banner());
  document.querySelector("main")!.append(loginForm());
}
