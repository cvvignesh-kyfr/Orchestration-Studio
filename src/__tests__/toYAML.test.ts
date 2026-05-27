import { describe, it, expect } from "vitest";
import { toYAML } from "@/lib/toYAML";

describe("toYAML Utility Tests", () => {
  it("should format primitives correctly", () => {
    expect(toYAML(null)).toBe("null");
    expect(toYAML(undefined)).toBe("undefined");
    expect(toYAML(42)).toBe("42");
    expect(toYAML(3.14)).toBe("3.14");
    expect(toYAML(true)).toBe("true");
    expect(toYAML(false)).toBe("false");
  });

  it("should format strings correctly", () => {
    // plain string
    expect(toYAML("plain_value")).toBe("plain_value");
    
    // strings with special characters
    expect(toYAML("value:colon")).toBe('"value:colon"');
    expect(toYAML("value\nnewline")).toBe('"value\nnewline"');
    expect(toYAML('value"quote')).toBe('"value\\\"quote"');
  });

  it("should format arrays correctly", () => {
    // empty array
    expect(toYAML([])).toBe("[]");
    
    // array of strings
    const arr = ["item1", "item2"];
    const yaml = toYAML(arr);
    expect(yaml).toContain("- item1");
    expect(yaml).toContain("- item2");
  });

  it("should format objects correctly", () => {
    // empty object
    expect(toYAML({})).toBe("{}");
    
    // flat object
    const obj = { key1: "val1", key2: "val2" };
    const yaml = toYAML(obj);
    expect(yaml).toContain("key1: val1");
    expect(yaml).toContain("key2: val2");
    
    // nested object
    const nested = { key: { innerKey: "innerValue" } };
    const nestedYaml = toYAML(nested);
    expect(nestedYaml).toContain("key:\n  innerKey: innerValue");
  });

  it("should pass the round-trip smoke test", () => {
    const data = {
      id: "warmth",
      base: 0.72,
      active: true,
      tags: ["tone", "safety"]
    };
    
    const yaml = toYAML(data);
    expect(yaml).toContain("id: warmth");
    expect(yaml).toContain("base: 0.72");
    expect(yaml).toContain("active: true");
    expect(yaml).toContain("- tone");
    expect(yaml).toContain("- safety");
  });
});
