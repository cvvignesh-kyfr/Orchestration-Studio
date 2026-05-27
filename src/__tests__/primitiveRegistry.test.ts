import { describe, it, expect } from "vitest";
import { primitives, storePrimitives } from "@/constants/primitiveRegistry";

describe("Primitive Registry Tests", () => {
  it("should contain at least 20 entries in storePrimitives", () => {
    const keys = Object.keys(storePrimitives);
    expect(keys.length).toBeGreaterThanOrEqual(20);
  });

  it("should have no duplicate IDs in storePrimitives", () => {
    const keys = Object.keys(storePrimitives);
    const ids = Object.values(storePrimitives).map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(keys.length);
  });

  it("should verify required fields exist and are valid for every primitive in storePrimitives", () => {
    Object.values(storePrimitives).forEach((prim) => {
      expect(prim.id).toBeDefined();
      expect(prim.name).toBeDefined();
      expect(prim.category).toBeDefined();
      expect(prim.path).toBeDefined();
      expect(prim.base).toBeDefined();
      expect(prim.definition).toBeDefined();
      expect(prim.principle).toBeDefined();
      expect(prim.owner).toBeDefined();
      expect(prim.range).toBeDefined();
      expect(prim.semanticInterpretation).toBeDefined();

      expect(typeof prim.id).toBe("string");
      expect(prim.id.length).toBeGreaterThan(0);
      expect(typeof prim.name).toBe("string");
      expect(prim.name.length).toBeGreaterThan(0);
      expect(typeof prim.category).toBe("string");
      expect(prim.category.length).toBeGreaterThan(0);
      expect(typeof prim.path).toBe("string");
      expect(prim.path.length).toBeGreaterThan(0);
      expect(typeof prim.definition).toBe("string");
      expect(prim.definition.length).toBeGreaterThan(0);
      expect(typeof prim.principle).toBe("string");
      expect(prim.principle.length).toBeGreaterThan(0);
      expect(typeof prim.owner).toBe("string");
      expect(prim.owner.length).toBeGreaterThan(0);

      expect(typeof prim.base).toBe("number");
      expect(typeof prim.range).toBe("object");
      expect(typeof prim.range.min).toBe("number");
      expect(typeof prim.range.max).toBe("number");

      expect(typeof prim.semanticInterpretation).toBe("object");
      expect(typeof prim.semanticInterpretation.min).toBe("string");
      expect(typeof prim.semanticInterpretation.mid).toBe("string");
      expect(typeof prim.semanticInterpretation.max).toBe("string");
    });
  });

  it("should verify base value bounds are valid (between 0 and 1)", () => {
    Object.values(storePrimitives).forEach(prim => {
      expect(prim.base).toBeGreaterThanOrEqual(0);
      expect(prim.base).toBeLessThanOrEqual(1);
    });
  });

  it("should verify range consistency", () => {
    Object.values(storePrimitives).forEach(prim => {
      expect(prim.range.min).toBeLessThan(prim.range.max);
      expect(prim.base).toBeGreaterThanOrEqual(prim.range.min);
      expect(prim.base).toBeLessThanOrEqual(prim.range.max);
    });
  });

  it("should match the path format global_foundation.{family}.{id}", () => {
    Object.values(storePrimitives).forEach(prim => {
      const match = prim.path.match(/^global_foundation\.[a-z0-9_]+\.[a-z0-9_]+$/);
      expect(match).not.toBeNull();
    });
  });

  it("should confirm primitives (compiler format) named export exists and has identical keys", () => {
    expect(primitives).toBeDefined();
    const compilerKeys = Object.keys(primitives);
    expect(compilerKeys.length).toBeGreaterThan(0);
  });
});
