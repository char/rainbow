import { Signal } from "@char/aftercare";

type R<Id extends string> = { id: Id };
export type AppRoute =
  | R<"loading">
  | { id: "timeline"; alg?: string }
  | { id: "thread"; uri: string }
  | R<"notifications">
  | R<"feed-list">
  | R<"settings">
  | { id: "profile"; didOrHandle: string }
  | R<"not-found">
  | { id: "compose" };

export const route = new Signal<AppRoute>({ id: "loading" });
export const routeEarly = new Signal<{
  from?: string;
  to?: string;
  route: AppRoute;
  cancel?: boolean;
}>({
  from: undefined,
  to: undefined,
  route: route.get(),
});

function matchPattern(pattern: string, path: string): URLPatternResult | undefined {
  const p = new URLPattern(pattern, "http://localhost");
  const match = p.exec("http://localhost" + path);
  return match ?? undefined;
}

const THREAD_PATTERN = "/profile/:handleOrDid/post/:id";
const PROFILE_PATTERN = "/profile/:didOrHandle";

export function parseRoute(path: string): AppRoute {
  if (path === "/") return { id: "timeline" };
  if (path === "/notifications") return { id: "notifications" };
  if (path === "/feeds") return { id: "feed-list" };
  if (path === "/settings") return { id: "settings" };
  if (path === "/compose") return { id: "compose" };

  const threadMatch = matchPattern(THREAD_PATTERN, path);
  if (threadMatch) {
    const { handleOrDid, id } = threadMatch.pathname.groups;
    return { id: "thread", uri: `at://${handleOrDid}/app.bsky.feed.post/${id}` };
  }

  const profileMatch = matchPattern(PROFILE_PATTERN, path);
  if (profileMatch) {
    const { didOrHandle } = profileMatch.pathname.groups;
    return { id: "profile", didOrHandle: didOrHandle! };
  }

  return { id: "not-found" };
}

export function getPathForRoute(route: AppRoute): string {
  if (route.id === "timeline" && route.alg === undefined) return "/";
  if (route.id === "notifications") return "/notifications";
  if (route.id === "feed-list") return "/feeds";
  if (route.id === "settings") return "/settings";
  if (route.id === "compose") return "/compose";

  if (route.id === "thread") {
    const [authority, _repo, rkey] = route.uri.substring("at://".length).split("/");
    return `/profile/${authority}/post/${rkey}`;
  }

  if (route.id === "profile") {
    return `/profile/${route.didOrHandle}`;
  }

  return "/404";
}

export function navigateTo(pathOrRoute: string | AppRoute) {
  const path = typeof pathOrRoute === "string" ? pathOrRoute : getPathForRoute(pathOrRoute);
  const parsedRoute = typeof pathOrRoute === "string" ? parseRoute(pathOrRoute) : pathOrRoute;
  routeEarly.set({ from: location.pathname, to: path, route: parsedRoute });
  history.pushState(null, "", path);
  if (!routeEarly.get().cancel) {
    scrollTo(0, 0);
    route.set(parsedRoute);
  }
}

document.addEventListener("click", e => {
  if (!(e.target instanceof Element)) return;
  const anchor = e.target.closest("a");
  if (anchor === null) return;

  if (e.ctrlKey || e.button !== 0) return;

  // TODO: make sure these open in a new tab
  const url = new URL(anchor.href);
  if (location.origin !== url.origin) return; // open external links normally

  e.preventDefault();

  navigateTo(url.pathname);
});

addEventListener("popstate", () => {
  const parsedRoute = parseRoute(location.pathname);
  routeEarly.set({
    from: routeEarly.get().to,
    to: location.pathname,
    route: parsedRoute,
  });
  if (!routeEarly.get().cancel) {
    route.set(parsedRoute);
  }
});
