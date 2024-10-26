import { segmentize, type Facet } from "npm:@atcute/bluesky-richtext-segmenter@1";
import { elem } from "../util/elem.ts";
import type { AppBskyRichtextFacet } from "@atcute/client/lexicons";

export function richText(text: string, facets?: Facet[]): HTMLElement {
  const paragraph = elem("p", { className: "rich-text" });

  for (const segment of segmentize(text, facets)) {
    if (segment.features) {
      let node: Text | Element = document.createTextNode(segment.text);

      for (const feature_ of segment.features) {
        type UnwrapArray<T> = T extends (infer V)[] ? V : never;
        const feature = feature_ as UnwrapArray<AppBskyRichtextFacet.Main["features"]>;
        if (feature.$type === "app.bsky.richtext.facet#link") {
          const uri = feature.uri;
          // TODO: map bsky.app links to local app -- but for now we assume everything is external
          node = elem("a", { href: uri }, [node]);
        }
        if (feature.$type === "app.bsky.richtext.facet#mention") {
          node = elem("a", { href: `/profile/${feature.did}` }, [node]);
        }
        if (feature.$type === "app.bsky.richtext.facet#tag") {
          node = elem(
            "a",
            { href: `/search?q=${encodeURIComponent("#" + feature.tag)}&t=top_posts` },
            [node],
          );
        }
      }

      paragraph.append(node);
    } else {
      paragraph.append(segment.text);
    }
  }

  return paragraph;
}
