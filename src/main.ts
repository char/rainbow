import "../_env.ts";
import "../css/main.css";

import "./util/also.ts";

import "npm:urlpattern-polyfill";
import "./navigation.ts";

import { loginForm } from "./login-form.ts";
import { session } from "./session.ts";

import { parseRoute, route } from "./navigation.ts";
import { app, ui } from "./ui/_ui.ts";
import { select } from "./util/select.ts";

if (session !== undefined) {
  ui();
  route.set(parseRoute(location.pathname));
} else {
  select(app, "main").append(loginForm);
}
