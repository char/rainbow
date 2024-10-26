import { createAuthorizationUrl } from "npm:@atcute/oauth-browser-client@1";
import { resolveFromIdentity } from "npm:@atcute/oauth-browser-client@1";
import { elem } from "./util/elem.ts";
import { select } from "./util/select.ts";

export const loginForm = elem("form", { id: "login-form" }, [
  elem("input", { name: "handle", placeholder: "handle.bsky.example" }),
  elem("button", { type: "submit" }, ["Log in"]),
]);
export const handleField = select(loginForm, "input[name=handle]", "input");

loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const handle = handleField.value;

  const authOpts = await resolveFromIdentity(handle);
  const authUrl = await createAuthorizationUrl({
    scope: import.meta.env.OAUTH_SCOPE,
    ...authOpts,
  });
  window.location.assign(authUrl);
});
