import { At, type AppBskyLabelerDefs } from "@atcute/client/lexicons";
import {
  computeModerationRules,
  type LabelSetting,
  type ModerationRules,
} from "../moderation/mod.ts";
import { session } from "../session.ts";
import { Subscribable } from "../util/subscribable.ts";
import { preferences } from "./preferences.ts";

// TODO: set atproto-accept-labelers

export const BSKY_MODERATION = `did:plc:ar7c4by46qjdydhdevvrndac`;
export const labelerServiceIDs = new Subscribable<At.DID[]>([BSKY_MODERATION]);
preferences.subscribe(prefs => {
  for (const pref of prefs) {
    if (pref.$type === "app.bsky.actor.defs#labelersPref") {
      labelerServiceIDs.set([BSKY_MODERATION, ...pref.labelers.map(it => it.did)]);
    }
  }
});

type LabelerServices = Record<At.DID, AppBskyLabelerDefs.LabelerViewDetailed>;
export const labelerServices = new Subscribable<LabelerServices>(
  await fetchLabelerServices(labelerServiceIDs.get()),
);
labelerServiceIDs.subscribe(async dids => {
  labelerServices.set(await fetchLabelerServices(dids));
});
async function fetchLabelerServices(dids: At.DID[]): Promise<LabelerServices> {
  if (!session) return {};
  const { data } = await session.xrpc.get("app.bsky.labeler.getServices", {
    params: { dids, detailed: true },
  });
  return data.views
    .map(it => [it.creator.did, it as AppBskyLabelerDefs.LabelerViewDetailed])
    .tap(Object.fromEntries);
}

export const labelOverrides = new Subscribable<LabelSetting[]>([]);
preferences.subscribe(prefs => {
  const overrides = prefs
    .filter(it => it.$type === "app.bsky.actor.defs#contentLabelPref")
    .map(
      ({ label, visibility, labelerDid }) =>
        ({ label, labeler: labelerDid, visibility }) satisfies LabelSetting,
    );
  labelOverrides.set(overrides);
});

export let moderationRules: ModerationRules;
function updateRules() {
  moderationRules = computeModerationRules(
    labelerServices.get().tap(Object.values),
    labelOverrides.get(),
  );
}
labelerServices.subscribe(updateRules);
labelOverrides.subscribe(updateRules);
updateRules();
