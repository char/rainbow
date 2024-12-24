import type { AppBskyLabelerDefs, ComAtprotoLabelDefs } from "@atcute/client/lexicons";
import { GLOBAL_LABELS } from "./global-labels.ts";
import type { LabelSetting, LabelVisibility } from "./label.ts";

export interface ModerationRule {
  labeler?: AppBskyLabelerDefs.LabelerViewDetailed;
  label: ComAtprotoLabelDefs.LabelValueDefinition;
  visibility: LabelVisibility;
}
export type ModerationRules = Partial<Record<string, ModerationRule[]>>;

export function computeModerationRules(
  services: AppBskyLabelerDefs.LabelerViewDetailed[],
  overrides: LabelSetting[],
): ModerationRules {
  const rules: ModerationRules = {};
  const addRule = (label: string, rule: ModerationRule) => {
    const rulesList = rules[label] ?? [];
    rulesList.push(rule);
    rules[label] = rulesList;
  };

  const overridesMap: Partial<Record<string, LabelSetting>> = overrides
    .map(it => [it.labeler ? `${it.labeler}/${it.label}` : it.label, it])
    .pipe(Object.fromEntries);

  for (const label of Object.values(GLOBAL_LABELS)) {
    const override = overridesMap[label.identifier];
    const visibility = override?.visibility ?? label.defaultSetting ?? "warn";
    addRule(label.identifier, {
      label,
      visibility,
    });
  }

  for (const service of services) {
    for (const labelId of service.policies.labelValues) {
      const label =
        service.policies.labelValueDefinitions?.find(it => it.identifier === labelId) ??
        GLOBAL_LABELS[labelId];
      if (label === undefined) continue;

      const override = overridesMap[`${service.creator.did}/${label.identifier}`];
      const visibility = override?.visibility ?? label.defaultSetting ?? "warn";
      addRule(label.identifier, {
        label,
        labeler: service,
        visibility,
      });
    }
  }

  return rules;
}
