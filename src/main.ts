import "../_env.ts";
import "../css/main.css";

import "./util/also.ts";

import "npm:urlpattern-polyfill";
import "./navigation.ts";

import { loginForm } from "./login-form.ts";
import { session } from "./session.ts";

import { banner } from "./banner.ts";
import { parseRoute, route } from "./navigation.ts";
import { fetchPreferences } from "./state/preferences.ts";
import { ui } from "./ui/_ui.ts";

if (session !== undefined) {
  let requestedRoute = parseRoute(location.pathname);

  const preOAuthRoute = localStorage.getItem("rainbow/pre-oauth-route");
  if (preOAuthRoute) {
    localStorage.removeItem("rainbow/pre-oauth-route");
    requestedRoute = parseRoute(preOAuthRoute);
  }

  await fetchPreferences();

  ui();
  route.set(requestedRoute);
} else {
  document.querySelector("header")!.append(banner());
  document.querySelector("main")!.append(loginForm());
}
