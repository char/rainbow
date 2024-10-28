import type { LabelDefinition, LabelTarget } from "./label.ts";
import type { ModerationResult } from "./results.ts";

export type LabelContext = `${"content" | "profile"}-${"list" | "view" | "media"}`;
export type LabelBehavior = "blur" | "blur-if-adult-or-alert" | "alert-or-inform";

export const LABEL_BEHAVIOR_MAP: Record<
  LabelDefinition["blurs"],
  Record<LabelTarget, Partial<Record<LabelContext, LabelBehavior>>>
> = {
  forced: {
    account: {
      "profile-list": "blur",
      "profile-view": "blur",
      "content-list": "blur",
      "content-view": "blur",
    },
    profile: {
      "profile-list": "blur",
      "profile-view": "blur",
    },
    content: {
      "content-list": "blur",
      "content-view": "blur",
    },
  },
  content: {
    account: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
      "content-list": "blur",
      "content-view": "blur-if-adult-or-alert",
    },
    profile: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
    },
    content: {
      "content-list": "blur",
      "content-view": "blur-if-adult-or-alert",
    },
  },
  media: {
    account: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
      "profile-media": "blur",
    },
    profile: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
      "profile-media": "blur",
    },
    content: {
      "content-media": "blur",
    },
  },
  none: {
    account: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
      "content-list": "alert-or-inform",
      "content-view": "alert-or-inform",
    },
    profile: {
      "profile-list": "alert-or-inform",
      "profile-view": "alert-or-inform",
    },
    content: {
      "content-list": "alert-or-inform",
      "content-view": "alert-or-inform",
    },
  },
};

export interface ModerationBehavior {
  filters: ModerationResult[];
  blurs: ModerationResult[];
  alerts: ModerationResult[];
  informs: ModerationResult[];
}

export function moderationBehavior(
  results: Iterable<ModerationResult>,
  context: LabelContext,
): ModerationBehavior | undefined {
  const filters: ModerationResult[] = [];
  const blurs: ModerationResult[] = [];
  const alerts: ModerationResult[] = [];
  const informs: ModerationResult[] = [];

  // TODO: handle mutes / blocks

  for (const result of results) {
    const rule = result.rule;
    if (rule.visibility === "ignore") continue;

    const target = result.target;

    const behavior = LABEL_BEHAVIOR_MAP[rule.label.blurs][target][context];

    if (rule.visibility === "hide") {
      if (
        (context === "profile-list" && target === "profile") ||
        (context === "content-list" && (target === "content" || target === "account"))
      ) {
        filters.push(result);
      }
    }

    if (
      behavior === "blur" ||
      (behavior === "blur-if-adult-or-alert" && rule.label.adultOnly)
    ) {
      blurs.push(result);
    } else if (behavior === "alert-or-inform" || behavior === "blur-if-adult-or-alert") {
      if (rule.label.severity === "alert") {
        alerts.push(result);
      } else if (rule.label.severity === "inform") {
        informs.push(result);
      }
    }
  }

  if (!(filters.length || blurs.length || alerts.length || informs.length)) return undefined;
  return { filters, blurs, alerts, informs };
}
