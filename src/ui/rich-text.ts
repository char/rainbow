import type { AppBskyRichtextFacet } from "@atcute/client/lexicons";
import { tokenize } from "npm:@atcute/bluesky-richtext-parser@1";
import { segmentize } from "npm:@atcute/bluesky-richtext-segmenter@1";
import { resolveHandle } from "../util/atp.ts";
import { elem } from "../util/elem.ts";

export type Facet = AppBskyRichtextFacet.Main;

export function linkifyText(text: string): Facet[] {
  const facets: Facet[] = [];

  // stolen from @atproto/api
  const URL_REGEX =
    /(^|\s|\()((https?:\/\/[\S]+)|((?<domain>[a-z][a-z0-9]*(\.[a-z0-9]+)+)[\S]*))/gim;
  const encoder = new TextEncoder();

  let match;
  while ((match = URL_REGEX.exec(text))) {
    const matchURI = match[2];

    let uri = matchURI;
    if (!uri.startsWith("http")) {
      const domain = match.groups?.domain;
      uri = `https://${uri}`;
    }

    const startUTF16 = text.indexOf(matchURI, match.index);
    let endUTF16 = startUTF16 + matchURI.length;

    if (/[.,;:!?]$/.test(uri)) {
      uri = uri.slice(0, -1);
      endUTF16--;
    }

    facets.push({
      features: [
        {
          $type: "app.bsky.richtext.facet#link",
          uri,
        },
      ],
      index: {
        byteStart: encoder.encode(text.substring(0, startUTF16)).byteLength,
        byteEnd: encoder.encode(text.substring(0, endUTF16)).byteLength,
      },
    });
  }

  return facets;
}

export async function parseRichText(text: string, links: boolean = true): Promise<Facet[]> {
  const tokens = tokenize(text);

  const facets: AppBskyRichtextFacet.Main[] = [];
  let i = 0;
  const encoder = new TextEncoder();
  for (const token of tokens) {
    const index = {
      byteStart: i,
      byteEnd: (i += encoder.encode(token.raw).byteLength),
    };

    if (index.byteStart === index.byteEnd) {
      continue;
    }

    if (links && (token.type === "link" || token.type === "autolink")) {
      facets.push({
        index,
        features: [{ $type: "app.bsky.richtext.facet#link", uri: token.url }],
      });
    } else if (token.type === "mention") {
      if (token.handle === "handle.invalid") continue;
      const did = await resolveHandle(token.handle);
      facets.push({ index, features: [{ $type: "app.bsky.richtext.facet#mention", did }] });
    } else if (token.type === "topic") {
      facets.push({
        index,
        features: [{ $type: "app.bsky.richtext.facet#tag", tag: token.name }],
      });
    }
  }

  return facets;
}

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
