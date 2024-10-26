import "../_env.ts";
import "../css/main.css";

import "npm:urlpattern-polyfill";
import "./navigation.ts";

import { loginForm } from "./login-form.ts";
import { session } from "./session.ts";

import { app, ui } from "./ui/_ui.ts";
import { parseRoute, route } from "./navigation.ts";
import { select } from "./util/select.ts";

if (session !== undefined) {
  ui();
  route.set(parseRoute(window.location.pathname));
} else {
  select(app, "main").append(loginForm);
}
