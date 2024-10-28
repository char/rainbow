import type { AppBskyActorDefs } from "@atcute/client/lexicons";
import { session } from "../session.ts";
import { LateSubscribable } from "../util/subscribable.ts";

export const preferences = new LateSubscribable<AppBskyActorDefs.Preferences>();
export async function fetchPreferences() {
  if (!session) return;

  const {
    data: { preferences: prefs },
  } = await session.xrpc.get("app.bsky.actor.getPreferences", {});
  preferences.set(prefs);
}
