import { elem } from "./util/elem.ts";

export function banner(): HTMLElement {
  return elem("section", { id: "app-info" }, [
    elem("h1", {}, ["Rainbow", elem("span", { ariaHidden: "true" }, [" 🌈"])]),
    elem("small", {}, ["Vanilla client for Bluesky."]),
  ]);
}
