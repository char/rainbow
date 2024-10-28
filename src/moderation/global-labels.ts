import type { LabelDefinition, LabelName } from "./label.ts";

export const GLOBAL_LABELS: Record<LabelName, LabelDefinition> = {
  "!hide": {
    identifier: "!hide",
    severity: "alert",
    blurs: "forced",
    // flags: forced | no-self
    locales: [{ lang: "en", name: "Hidden by moderators", description: "" }],
    defaultSetting: "hide",
  },
  "!warn": {
    identifier: "!warn",
    severity: "alert",
    blurs: "forced",
    // flags: no-self
    locales: [{ lang: "en", name: "Content warning", description: "" }],
    defaultSetting: "warn",
  },
  porn: {
    identifier: "porn",
    severity: "none",
    blurs: "media",
    // flags: adult-only
    locales: [
      { lang: "en", name: "Erotic nudity or explicit sexual activity", description: "" },
    ],
    defaultSetting: "warn",
  },
  sexual: {
    identifier: "sexual",
    severity: "none",
    blurs: "media",
    // flags: adult only
    locales: [
      {
        lang: "en",
        name: "Sexually suggestive",
        description: "Not pornographic but sexual in nature",
      },
    ],
    defaultSetting: "warn",
  },
  "graphic-media": {
    identifier: "graphic-media",
    severity: "none",
    blurs: "media",
    // flags: adult only
    locales: [{ lang: "en", name: "Graphic media", description: "Disturbing content" }],
    defaultSetting: "warn",
  },
  nudity: {
    identifier: "nudity",
    severity: "none",
    blurs: "media",
    // flags: none
    locales: [{ lang: "en", name: "Nudity", description: "Artistic or non-erotic nudity" }],
    defaultSetting: "warn",
  },
} as const;
