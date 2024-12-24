import type { AppBskyActorGetProfile } from "@atcute/client/lexicons";
import { LazySignal } from "@char/aftercare";
import { session } from "../session.ts";

export const selfProfile = new LazySignal<AppBskyActorGetProfile.Output>();

void (async () => {
  if (!session) return;
  const profileView = await session.xrpc.get("app.bsky.actor.getProfile", {
    params: { actor: session!.did },
  });
  selfProfile.set(profileView.data);
})();
