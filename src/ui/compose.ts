import { session } from "../session.ts";
import { selfProfile } from "../state/profile.ts";
import { createRecord } from "../util/atp.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { setClass } from "../util/set-class.ts";
import { Subscribable } from "../util/subscribable.ts";

import { getPathForRoute, navigateTo } from "../navigation.ts";
import { parseRichText } from "./rich-text.ts";

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
    const facets = await parseRichText(text);

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
