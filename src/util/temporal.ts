const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" });

export function formatRelativeTime(before: Date, after: Date) {
  const seconds = Math.floor((after.getTime() - before.getTime()) / 1000);

  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (Math.abs(years) >= 1) return rtf.format(-years, "year");
  if (Math.abs(months) >= 1) return rtf.format(-months, "month");
  if (Math.abs(days) >= 1) return rtf.format(-days, "day");
  if (Math.abs(hours) >= 1) return rtf.format(-hours, "hour");
  if (Math.abs(mins) >= 1) return rtf.format(-mins, "minute");
  return rtf.format(-seconds, "second");
}
