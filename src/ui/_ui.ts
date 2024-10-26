import { debugUI } from "./debug.ts";
import { header } from "./header.ts";
import { profilePage } from "./profile-page.ts";
import { threadPage } from "./thread-page.ts";
import { timeline } from "./timeline.ts";

export const app = document.querySelector("#app")!;

export function ui() {
  header();
  timeline();
  profilePage();
  threadPage();

  debugUI();
}
