import type { AppBskyActorDefs, AppBskyFeedDefs } from "@atcute/client/lexicons";
import type { LabelTarget } from "./label.ts";
import type { ModerationRule, ModerationRules } from "./rules.ts";

export interface ModerationResult {
  target: LabelTarget;
  rule: ModerationRule;
}

export function* moderateAuthor(
  rules: ModerationRules,
  author: AppBskyActorDefs.ProfileViewBasic,
): Generator<ModerationResult> {
  if (!author.labels) return;
  for (const label of author.labels) {
    const applicableRules = rules[label.val];
    if (applicableRules === undefined) continue;
    for (const rule of applicableRules) {
      const ruleSource = rule.labeler?.creator?.did;
      if (!(ruleSource === undefined || ruleSource === label.src)) continue;

      const target = label.uri.endsWith("/app.bsky.actor.profile/self") ? "profile" : "account";
      yield { target, rule };
    }
  }
}

export function* moderatePost(
  rules: ModerationRules,
  post: AppBskyFeedDefs.PostView,
): Generator<ModerationResult> {
  yield* moderateAuthor(rules, post.author);

  if (!post.labels) return;

  for (const label of post.labels) {
    const applicableRules = rules[label.val];
    if (applicableRules === undefined) continue;

    for (const rule of applicableRules) {
      const ruleSource = rule.labeler?.creator?.did;
      if (!(ruleSource === undefined || ruleSource === label.src)) continue;

      yield { target: "content", rule };
    }
  }
}
