import type { OpeningPeriod, Place, Weekday } from "@/domain/entities";

/** "฿฿" for restaurants, "Free" or "฿500 entry" for attractions. */
export function formatPrice(place: Place): string {
  if (place.price.kind === "level") return "฿".repeat(place.price.level);
  return place.price.amountThb === 0
    ? "Free"
    : `฿${place.price.amountThb.toLocaleString("en-US")} entry`;
}

export function priceLabel(place: Place): string {
  return place.price.kind === "level"
    ? `Price level ${place.price.level} of 4`
    : formatPrice(place);
}

/** Cuisine for restaurants, category for attractions. */
export function placeKind(place: Place): string {
  return place.type === "restaurant" ? place.cuisine : place.category;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Week shown Monday first.
const WEEK: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export interface HoursRow {
  days: string;
  hours: string;
}

/**
 * Groups consecutive days with identical hours:
 * [{ days: "Daily", hours: "09:00–00:00" }] or
 * [{ days: "Wed–Sat", hours: "09:00–19:00" }, { days: "Mon–Tue, Sun", hours: "Closed" }].
 */
export function formatOpeningHours(periods: OpeningPeriod[]): HoursRow[] {
  const hoursByDay = new Map<Weekday, string>();
  for (const p of periods) {
    const range = `${p.opens}–${p.closes}`;
    const existing = hoursByDay.get(p.day);
    hoursByDay.set(p.day, existing ? `${existing}, ${range}` : range);
  }

  const groups = new Map<string, Weekday[][]>();
  let previous: string | undefined;
  for (const day of WEEK) {
    const hours = hoursByDay.get(day) ?? "Closed";
    const runs = groups.get(hours) ?? [];
    if (hours === previous) runs[runs.length - 1].push(day);
    else runs.push([day]);
    groups.set(hours, runs);
    previous = hours;
  }

  if (groups.size === 1 && !groups.has("Closed")) {
    return [{ days: "Daily", hours: [...groups.keys()][0] }];
  }

  const rows = [...groups].map(([hours, runs]) => ({
    days: runs
      .map((run) =>
        run.length === 1
          ? DAY_NAMES[run[0]]
          : `${DAY_NAMES[run[0]]}–${DAY_NAMES[run[run.length - 1]]}`,
      )
      .join(", "),
    hours,
  }));
  // Open hours first, closed days last.
  return rows.sort((a, b) => Number(a.hours === "Closed") - Number(b.hours === "Closed"));
}

export function formatReviewDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);
}
