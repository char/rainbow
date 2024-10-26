import { timeline } from "./timeline.ts";
import { header } from "./header.ts";
import { profilePage } from "./profile-page.ts";
import { debugUI } from "./debug.ts";

export const app = document.querySelector("#app")!;

export function ui() {
  header();
  timeline();
  profilePage();

  debugUI();
}
