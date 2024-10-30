import type { AppBskyRichtextFacet } from "@atcute/client/lexicons";
import { session } from "../session.ts";
import { selfProfile } from "../state/profile.ts";
import { createRecord, resolveHandle } from "../util/atp.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { setClass } from "../util/set-class.ts";
import { Subscribable } from "../util/subscribable.ts";

import { tokenize } from "npm:@atcute/bluesky-richtext-parser@1";
import { getPathForRoute, navigateTo } from "../navigation.ts";

export const isComposing = new Subscribable(false);

export function compose() {
  const composeBox = elem("form", { id: "compose-box", lang: "en" }, [
    elem("p", {}, [
      "Posting as: ",
      elem("strong", {}, []).also(it =>
        selfProfile.subscribeImmediate(p => (it.textContent = p.handle ?? p.did)),
      ),
    ]),
    elem("label", { htmlFor: "post-text" }, ["Text"]),
    elem("textarea", { id: "post-text", maxLength: 300 }, []),
    elem("button", { type: "submit" }, ["Post"]),
  ]);
  composeBox.addEventListener("submit", async e => {
    e.preventDefault();

    const text = select(composeBox, "#post-text", "textarea").value;
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

      if (token.type === "link" || token.type === "autolink") {
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

    const record = await createRecord({
      repo: session!.did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text,
        createdAt: new Date().toISOString(),
        facets,
        langs: ["en"], // TODO: configurable
        // TODO: embeds
        // TODO: replies
      },
    });

    isComposing.set(false);
    navigateTo(getPathForRoute({ id: "thread", uri: record.uri }));
  });

  const composeModal = elem("section", { id: "compose-modal" }, [composeBox]);
  document.body.append(composeModal);

  composeModal.addEventListener("click", e => {
    if (e.target === composeModal) {
      history.back();
    }
  });

  isComposing.subscribe(composing => {
    setClass(composeModal, "visible", composing);
  });
}
