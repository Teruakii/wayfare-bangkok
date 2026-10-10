import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/presentation/actions/form-state";

describe("safeNextPath", () => {
  it("keeps same-site paths", () => {
    expect(safeNextPath("/places/wat-pho")).toBe("/places/wat-pho");
    expect(safeNextPath("/dashboard?tab=reviews")).toBe("/dashboard?tab=reviews");
  });

  it("blocks off-site and empty targets", () => {
    for (const bad of ["", "https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)"]) {
      expect(safeNextPath(bad)).toBe("/dashboard");
    }
  });
});
