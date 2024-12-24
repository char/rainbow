import { AppBskyFeedPost } from "@atcute/client/lexicons";
import { navigateTo, routeEarly } from "../navigation.ts";
import { session } from "../session.ts";
import { selfProfile } from "../state/profile.ts";
import { createRecord } from "../util/atp.ts";
import { elem } from "../util/elem.ts";
import { select } from "../util/select.ts";
import { sleep } from "../util/sleep.ts";
import { Subscribable } from "../util/subscribable.ts";
import { createPostArticle, Post } from "./post/post.ts";
import { parseRichText } from "./rich-text.ts";

export class Composer {
  static current = new Subscribable<Composer | undefined>(undefined);

  box: HTMLElement;
  modal: HTMLElement;

  langs: string[] = ["en"];
  embed = undefined; // TODO
  reply: AppBskyFeedPost.ReplyRef | undefined; // TODO

  constructor(replyingTo?: Post) {
    let replyPostElem: HTMLElement | undefined;
    if (replyingTo) {
      const record = replyingTo.view.record as AppBskyFeedPost.Record;
      const parent = { cid: replyingTo.view.cid, uri: replyingTo.view.uri };
      const root = record.reply
        ? { cid: record.reply.root.cid, uri: record.reply.root.uri }
        : parent;
      this.reply = { parent, root };
      replyPostElem = createPostArticle(replyingTo);
      replyPostElem.dataset.noLink = "";
    }

    this.box = elem("form", { className: "compose-box", lang: "en" }, [
      elem("p", {}, [
        "Posting as: ",
        elem("strong", {}, []).tap(it =>
          selfProfile.subscribeImmediate(p => (it.textContent = p.handle ?? p.did)),
        ),
      ]),
      replyPostElem ?? "",
      elem("label", { htmlFor: "post-text" }, ["Text"]),
      elem("textarea", { className: "post-text", id: "post-text", maxLength: 300 }, []),
      elem("button", { type: "submit" }, ["Post"]),
    ]);

    // TODO: use a <dialog> element
    this.modal = elem("section", { className: "compose-modal" }, [this.box]);

    select(this.box, "#post-text", "textarea").addEventListener("keydown", e => {
      if (Composer.current.get() !== this) return;

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        this.send();
      }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.dispelIfCurrent();
      }
    });

    this.box.addEventListener("submit", e => {
      e.preventDefault();
      this.send();
    });

    this.modal.addEventListener("click", e => {
      if (Composer.current.get() !== this) return;
      if (e.target !== this.modal) return;
      Composer.current.set(undefined);
    });
  }

  async send() {
    const textBox = select(this.box, "#post-text", "textarea");
    const text = textBox.value;
    // if (!text.trim()) return;

    const facets = await parseRichText(text);

    const record = await createRecord({
      repo: session!.did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text,
        createdAt: new Date().toISOString(),
        facets,
        langs: this.langs,
        embed: this.embed,
        reply: this.reply,
      },
    });

    textBox.value = "";

    this.dispelIfCurrent();

    // TODO: optimistically store a Post in store so that if AppView hasn't
    // seen our post yet we can still render something instead of a blank page
    navigateTo({ id: "thread", uri: record.uri });
  }

  dispelIfCurrent() {
    if (Composer.current.get() === this) {
      Composer.current.set(undefined);
    }
  }

  show() {
    document.body.append(this.modal);
    this.modal.classList.add("visible");
    select(this.box, "textarea").focus();
  }

  hide() {
    this.modal.classList.remove("visible");
    setTimeout(() => {
      if (Composer.current.get() !== this) {
        this.modal.remove();
      }
    }, 1000);
  }
}

export function compose() {
  let lastComposer: Composer | undefined;
  Composer.current.subscribe(composer => {
    const app = select(document.body, "#app");
    if (lastComposer) {
      const composer = lastComposer;
      composer.modal.classList.remove("visible");
      setTimeout(() => {
        if (Composer.current.get() !== composer) {
          composer.modal.remove();
        }
      }, 1000);
    }
    app.inert = false;

    if (composer !== undefined) {
      app.inert = true;
      document.body.append(composer.modal);
      sleep(0).then(() => {
        composer.modal.classList.add("visible");
      });
    } else {
      if (location.pathname === "/compose") {
        history.back();
      }
    }

    lastComposer = composer;
  });

  const defaultComposer = new Composer();
  routeEarly.subscribe(rt => {
    if (rt.route.id === "compose") {
      Composer.current.set(defaultComposer);
      rt.cancel = true;
    } else {
      if (Composer.current.get() === defaultComposer) {
        Composer.current.set(undefined);
      }
    }
  });
}
