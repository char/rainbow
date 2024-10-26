import type { AppBskyActorGetProfile } from "@atcute/client/lexicons";
import { LateSubscribable } from "../util/subscribable.ts";
import { session } from "../session.ts";

export const selfProfile = new LateSubscribable<AppBskyActorGetProfile.Output>();

void (async () => {
  const profileView = await session!.xrpc.get("app.bsky.actor.getProfile", {
    params: { actor: session!.did },
  });
  selfProfile.set(profileView.data);
})();
