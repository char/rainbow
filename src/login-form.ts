import {
  createAuthorizationUrl,
  resolveFromIdentity,
} from "npm:@atcute/oauth-browser-client@1";
import { elem } from "./util/elem.ts";
import { select } from "./util/select.ts";

export function loginForm(): HTMLElement {
  const status = elem("p");

  const loginForm = elem("form", { id: "login-form" }, [
    elem("label", { htmlFor: "handle-field" }, ["Handle / DID"]),
    elem("input", {
      type: "text",
      name: "handle",
      id: "handle-field",
      placeholder: "handle.bsky.example",
      required: true,
    }),
    elem("button", { type: "submit" }, ["Sign in with OAuth"]),
    status,
  ]);
  const handleField = select(loginForm, "input[name=handle]", "input");

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    const handle = handleField.value;

    const authOpts = await resolveFromIdentity(handle);
    const authUrl = await createAuthorizationUrl({
      scope: import.meta.env.OAUTH_SCOPE,
      ...authOpts,
    });
    localStorage.setItem("rainbow/pre-oauth-route", location.pathname + location.search);
    location.assign(authUrl);
  });

  return loginForm;
}
