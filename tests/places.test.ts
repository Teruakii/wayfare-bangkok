import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { InMemoryAreaRepository, InMemoryPlaceRepository } from "@/data/repositories";
import { sampleAreas } from "@/data/sample/areas";
import { samplePlaces } from "@/data/sample/places";
import { NotFoundError, ValidationError } from "@/domain/errors";
import {
  makeGetPlaceById,
  makeListAreas,
  makeListPlaces,
  makeSearchPlaces,
} from "@/domain/use-cases/places";

const places = new InMemoryPlaceRepository(samplePlaces);
const listPlaces = makeListPlaces({ places });
const searchPlaces = makeSearchPlaces({ places });
const getPlaceById = makeGetPlaceById({ places });

describe("sample data", () => {
  it("has 8 restaurants and 8 attractions with unique ids", async () => {
    expect(await listPlaces({ type: "restaurant" })).toHaveLength(8);
    expect(await listPlaces({ type: "attraction" })).toHaveLength(8);
    expect(new Set(samplePlaces.map((p) => p.id)).size).toBe(samplePlaces.length);
  });

  it("uses known areas and existing photo files", () => {
    const areaIds = new Set(sampleAreas.map((a) => a.id));
    for (const p of samplePlaces) {
      expect(areaIds.has(p.location.areaId)).toBe(true);
      expect(existsSync(join("public", p.photo.src))).toBe(true);
    }
  });
});

describe("listPlaces", () => {
  it("filters by type and area, sorted by name", async () => {
    const result = await listPlaces({ type: "attraction", areaId: "rattanakosin" });
    expect(result.map((p) => p.id)).toEqual(["grand-palace", "wat-pho"]);
  });

  it("returns featured places", async () => {
    const result = await listPlaces({ featured: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.featured)).toBe(true);
  });

  it("rejects an unknown area", async () => {
    // @ts-expect-error — simulating a bad value from the URL
    await expect(listPlaces({ areaId: "atlantis" })).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("searchPlaces", () => {
  it("matches name, cuisine and description case-insensitively", async () => {
    expect((await searchPlaces({ text: "PAD THAI" })).map((p) => p.id)).toContain("thipsamai");
    expect((await searchPlaces({ text: "isan" })).map((p) => p.id)).toEqual([
      "lay-lao",
      "somtum-der",
      "supanniga-eating-room",
    ]);
  });

  it("treats blank params as no filter", async () => {
    const result = await searchPlaces({ text: "  ", type: "", areaId: "" });
    expect(result).toHaveLength(samplePlaces.length);
  });

  it("combines text with type and area", async () => {
    const result = await searchPlaces({ text: "temple", type: "attraction", areaId: "chinatown" });
    expect(result.map((p) => p.id)).toEqual(["wat-traimit"]);
  });
});

describe("getPlaceById / listAreas", () => {
  it("returns a place or throws NotFoundError", async () => {
    expect((await getPlaceById("wat-pho")).name).toBe("Wat Pho");
    await expect(getPlaceById("nope")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns copies, so callers cannot mutate the store", async () => {
    const place = await getPlaceById("wat-pho");
    place.name = "Changed";
    expect((await getPlaceById("wat-pho")).name).toBe("Wat Pho");
  });

  it("lists the six areas", async () => {
    const listAreas = makeListAreas({ areas: new InMemoryAreaRepository(sampleAreas) });
    expect(await listAreas()).toHaveLength(6);
  });
});
