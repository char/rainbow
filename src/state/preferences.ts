import type { AppBskyActorDefs } from "@atcute/client/lexicons";
import { LazySignal } from "@char/aftercare";
import { session } from "../session.ts";

export const preferences = new LazySignal<AppBskyActorDefs.Preferences>();
export async function fetchPreferences() {
  if (!session) return;

  const {
    data: { preferences: prefs },
  } = await session.xrpc.get("app.bsky.actor.getPreferences", {});
  preferences.set(prefs);
}
