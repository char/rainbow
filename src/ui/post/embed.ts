import type {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from "@atcute/client/lexicons";
import { elem, noneElem } from "../../util/elem.ts";
import { richText } from "../rich-text.ts";
import { age } from "./age.ts";
import { normalizePostURIInternal } from "./post.ts";

export function embedImages(media: AppBskyEmbedImages.View): HTMLElement {
  const container = elem("div", { className: "images" });
  for (const image of media.images) {
    const img = elem("img", {
      src: image.fullsize,
      alt: image.alt,
      title: image.alt,
      loading: "lazy",
    });
    if (image.aspectRatio)
      img.style.setProperty(
        "--aspect-ratio",
        `${image.aspectRatio.width} / ${image.aspectRatio.height}`,
      );
    container.append(img);
  }
  // return elem("rainbow-blur", {}, [container], { dataset: { unblur: "" } });
  return container;
}

export function embedCard(external: AppBskyEmbedExternal.View["external"]): HTMLElement {
  return elem("div", { className: "external" }, [
    elem("a", { className: "contents", target: "_blank", href: external.uri }, [
      elem("section", {}, [
        external.thumb ? elem("img", { src: external.thumb }, []) : "",
        elem("div", {}, [
          elem("h3", {}, [external.title ? external.title : new URL(external.uri).hostname]),
          elem("p", {}, [
            external.description
              ? external.description
              : external.title
                ? new URL(external.uri).hostname
                : external.uri,
          ]),
        ]),
      ]),
    ]),
  ]);
}

export function embedQuote(record: AppBskyEmbedRecord.ViewRecord): HTMLElement {
  const author = record.author;
  const quoteRecord = record.value as AppBskyFeedPost.Record;

  return elem("div", { className: "quote" }, [
    elem("a", { className: "contents", href: normalizePostURIInternal(record) }, [
      elem("div", { className: "topline" }, [
        elem("img", { className: "avatar", src: author.avatar }),
        elem("div", {}, [
          ...(author.displayName ? [elem("strong", {}, [author.displayName]), " "] : []),
          elem("a", { className: "handle" }, [`@${author.handle}`]),
        ]),
        elem("div", {}, [age(new Date(quoteRecord.createdAt))]),
      ]),
      richText(quoteRecord.text, quoteRecord.facets),
      ...(record.embeds?.tap(e => e.flatMap(embedMedia)) ?? []),
    ]),
  ]);
}

export function embedRecord(record: AppBskyEmbedRecord.View["record"]): HTMLElement {
  if (record.$type === "app.bsky.embed.record#viewRecord") {
    return embedQuote(record);
  }

  // TODO: other record types

  return noneElem();
}

export function embedMedia(
  embed: NonNullable<AppBskyFeedDefs.PostView["embed"]>,
): HTMLElement[] {
  const results = [];

  if (embed.$type === "app.bsky.embed.images#view") {
    results.push(elem("section", { className: "embed" }, [embedImages(embed)]));
  }
  if (embed.$type === "app.bsky.embed.external#view") {
    results.push(elem("section", { className: "embed" }, [embedCard(embed.external)]));
  }

  if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
    results.push(...embedMedia(embed.media));
  }

  if (
    embed.$type === "app.bsky.embed.record#view" ||
    embed.$type === "app.bsky.embed.recordWithMedia#view"
  ) {
    const record =
      embed.$type === "app.bsky.embed.record#view" ? embed.record : embed.record.record;
    results.push(elem("section", { className: "embed" }, [embedRecord(record)]));
  }

  return results;
}
