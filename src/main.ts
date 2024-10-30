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
  await fetchPreferences();

  ui();
  route.set(parseRoute(location.pathname));
} else {
  document.querySelector("header")!.append(banner());
  document.querySelector("main")!.append(loginForm());
}
