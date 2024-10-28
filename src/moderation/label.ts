import type { At, ComAtprotoLabelDefs } from "@atcute/client/lexicons";

type OpenUnion<U> = U | (string & Record<never, never>);

export type LabelDefinition = ComAtprotoLabelDefs.LabelValueDefinition;

export type LabelName = OpenUnion<
  "!hide" | "!warn" | "porn" | "sexual" | "graphic-media" | "nudity"
>;
export type LabelVisibility = OpenUnion<"hide" | "ignore" | "show" | "warn">;
export type LabelSeverity = OpenUnion<"alert" | "inform" | "none">;
export type LabelTarget = "account" | "profile" | "content";

export interface LabelSetting {
  label: string;
  labeler?: At.DID;
  visibility: LabelVisibility;
}
