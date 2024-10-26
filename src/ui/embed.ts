import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { elem } from "../util/elem.ts";

export function embed(embed: NonNullable<AppBskyFeedDefs.PostView["embed"]>): HTMLElement {
  if (embed.$type === "app.bsky.embed.images#view") {
    const container = elem("div", { className: "embed images" });

    for (const image of embed.images) {
      const img = elem("img", { src: image.fullsize, alt: image.alt, title: image.alt });
      container.append(img);
    }

    return container;
  }

  return elem("div");
}
