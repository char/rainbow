import type { AppBskyActorGetProfile } from "@atcute/client/lexicons";
import { session } from "../session.ts";
import { LateSubscribable } from "../util/subscribable.ts";

export const selfProfile = new LateSubscribable<AppBskyActorGetProfile.Output>();

void (async () => {
  if (!session) return;
  const profileView = await session.xrpc.get("app.bsky.actor.getProfile", {
    params: { actor: session!.did },
  });
  selfProfile.set(profileView.data);
})();
