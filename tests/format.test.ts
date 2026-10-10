import { describe, expect, it } from "vitest";
import { samplePlaces } from "@/data/sample/places";
import type { OpeningPeriod, Weekday } from "@/domain/entities";
import { formatOpeningHours, formatPrice } from "@/presentation/format";

const on = (days: Weekday[], opens: string, closes: string): OpeningPeriod[] =>
  days.map((day) => ({ day, opens, closes }));

describe("formatOpeningHours", () => {
  it("collapses identical days to Daily", () => {
    expect(formatOpeningHours(on([0, 1, 2, 3, 4, 5, 6], "09:00", "00:00"))).toEqual([
      { days: "Daily", hours: "09:00–00:00" },
    ]);
  });

  it("groups day ranges and lists closed days last", () => {
    expect(formatOpeningHours(on([3, 4, 5, 6], "09:00", "19:00"))).toEqual([
      { days: "Wed–Sat", hours: "09:00–19:00" },
      { days: "Mon–Tue, Sun", hours: "Closed" },
    ]);
  });

  it("handles weekend-only places", () => {
    expect(formatOpeningHours(on([0, 6], "09:00", "18:00"))).toEqual([
      { days: "Sat–Sun", hours: "09:00–18:00" },
      { days: "Mon–Fri", hours: "Closed" },
    ]);
  });
});

describe("formatPrice", () => {
  const byId = (id: string) => samplePlaces.find((p) => p.id === id)!;
  it("formats levels, fees and free entry", () => {
    expect(formatPrice(byId("supanniga-eating-room"))).toBe("฿฿฿");
    expect(formatPrice(byId("grand-palace"))).toBe("฿500 entry");
    expect(formatPrice(byId("lumphini-park"))).toBe("Free");
  });
});
