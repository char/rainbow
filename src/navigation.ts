import { Subscribable } from "./util/subscribable.ts";

type R<Id extends string> = { id: Id };
export type AppRoute =
  | R<"loading">
  | { id: "timeline"; alg?: string }
  | { id: "thread"; uri: string }
  | R<"notifications">
  | R<"feed-list">
  | R<"settings">
  | { id: "profile"; didOrHandle: string }
  | R<"not-found">;

export const route = new Subscribable<AppRoute>({ id: "loading" });

function matchPattern(pattern: string, path: string): URLPatternResult | undefined {
  const p = new URLPattern(pattern, "http://localhost");
  const match = p.exec("http://localhost" + path);
  return match ?? undefined;
}

export function parseRoute(path: string): AppRoute {
  if (path === "/") return { id: "timeline" };
  if (path === "/notifications") return { id: "notifications" };
  if (path === "/feeds") return { id: "feed-list" };
  if (path === "/settings") return { id: "settings" };

  const threadMatch = matchPattern("/profile/:handleOrDid/post/:id", path);
  if (threadMatch) {
    const { handleOrDid, id } = threadMatch.pathname.groups;
    return { id: "thread", uri: `at://${handleOrDid}/app.bsky.feed.post/${id}` };
  }

  const profileMatch = matchPattern("/profile/:didOrHandle", path);
  if (profileMatch) {
    const { didOrHandle } = profileMatch.pathname.groups;
    return { id: "profile", didOrHandle: didOrHandle! };
  }

  return { id: "not-found" };
}

document.addEventListener("click", e => {
  if (!(e.target instanceof Element)) return;
  const anchor = e.target.closest("a");
  if (anchor === null) return;

  if (e.ctrlKey || e.button !== 0) return;

  // TODO: make sure these open in a new tab
  const url = new URL(anchor.href);
  if (window.location.origin !== url.origin) return; // open external links normally

  e.preventDefault();

  history.pushState(null, "", url.pathname);
  route.set(parseRoute(url.pathname));
});

window.addEventListener("popstate", () => {
  route.set(parseRoute(window.location.pathname));
});
