import { elem } from "../util/elem.ts";

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

export function age(since: Date) {
  return elem("time", { dateTime: since.toISOString() }, [
    formatRelativeTime(since, new Date()),
  ]).also(it => {
    let age = Date.now() - since.getTime();
    const periods = [
      [60 * 1000, 500],
      [60 * 60 * 1000, 30_000],
      [30 * 60 * 60 * 1000, undefined],
    ] as const;

    let intervalId: number | undefined;
    let currentGroup: number | undefined;

    const update = () => {
      it.textContent = formatRelativeTime(since, new Date());
      age = Date.now() - since.getTime();

      for (const [ageCap, interval] of periods) {
        if (age < ageCap) {
          if (currentGroup !== ageCap) {
            if (intervalId) clearInterval(intervalId);
            currentGroup = ageCap;
            if (interval === undefined) return;
            intervalId = setInterval(update, interval);
            it.dataset.intervalId = `${intervalId}`;
          }

          break;
        }
      }
    };
    update();
  });
}
