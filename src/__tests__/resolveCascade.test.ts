import { describe, it, expect } from "vitest";
import { resolveCascade } from "@/store/helpers/resolveCascade";
import { Primitive, MockUser, GovernanceShield, Segment } from "@/store/types";

// Factory for mock primitives
const createMockPrimitive = (id: string, base: number = 0.72): Primitive => ({
  id,
  name: `${id} Primitive`,
  category: "Tone",
  path: `global_foundation.tone.${id}`,
  base,
  definition: `Mock definition for ${id}`,
  principle: `Mock principle for ${id}`,
  owner: "Safety Team",
  range: { min: 0.0, max: 1.0 },
  semanticInterpretation: { min: "Low", mid: "Medium", max: "High" }
});

// Fixture for standard mock user
const defaultUser: MockUser = {
  id: "user_abc",
  name: "Jane Doe",
  age: 28,
  location: "mumbai",
  anxietyLevel: "medium",
  upiUsage: "low",
  salaryStatus: "credited",
  preferredLanguage: "english"
};

describe("resolveCascade Logic Engine Tests", () => {
  it("should resolve baseline only when no segments or shields are active", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const result = resolveCascade(prim, [], [], defaultUser, [], []);
    
    expect(result.finalValue).toBe(0.72);
    expect(result.steps.length).toBe(1);
    expect(result.steps[0].sourceType).toBe("base");
    expect(result.steps[0].runningValue).toBe(0.72);
  });

  it("should apply segment modifier when rules match", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const segment: Segment = {
      id: "seg_1",
      name: "Eng Segment",
      description: "English preferring users",
      category: "style",
      rules: [{ field: "preferredLanguage", operator: "equals", value: "english" }],
      modifiers: { warmth: { value: 0.10 } }
    };
    
    const result = resolveCascade(prim, ["seg_1"], [segment], defaultUser, [], []);
    expect(result.finalValue).toBeCloseTo(0.82);
    expect(result.steps.length).toBe(2);
    expect(result.steps[1].sourceType).toBe("overlay");
    expect(result.steps[1].delta).toBe(0.10);
    expect(result.steps[1].runningValue).toBeCloseTo(0.82);
  });

  it("should skip segment modifier when segment rules mismatch", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const segment: Segment = {
      id: "seg_1",
      name: "Eng Segment",
      description: "English preferring users",
      category: "style",
      rules: [{ field: "preferredLanguage", operator: "equals", value: "hinglish" }], // mismatches
      modifiers: { warmth: { value: 0.10 } }
    };
    
    const result = resolveCascade(prim, ["seg_1"], [segment], defaultUser, [], []);
    expect(result.finalValue).toBe(0.72);
    expect(result.steps.length).toBe(1);
  });

  it("should clamp resolved values at 1.0 maximum", () => {
    const prim = createMockPrimitive("warmth", 0.90);
    const segment: Segment = {
      id: "seg_1",
      name: "Super Friendly",
      description: "adds high warmth",
      category: "style",
      rules: [],
      modifiers: { warmth: { value: 0.20 } }
    };
    
    const result = resolveCascade(prim, ["seg_1"], [segment], defaultUser, [], []);
    expect(result.finalValue).toBe(1.0);
    expect(result.steps[1].runningValue).toBe(1.0);
  });

  it("should clamp resolved values at 0.0 minimum", () => {
    const prim = createMockPrimitive("warmth", 0.10);
    const segment: Segment = {
      id: "seg_1",
      name: "Super Reserved",
      description: "removes warmth",
      category: "style",
      rules: [],
      modifiers: { warmth: { value: -0.20 } }
    };
    
    const result = resolveCascade(prim, ["seg_1"], [segment], defaultUser, [], []);
    expect(result.finalValue).toBe(0.0);
    expect(result.steps[1].runningValue).toBe(0.0);
  });

  it("should enforce governance cap override", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const shield: GovernanceShield = {
      id: "shield_cap",
      name: "Warmth Cap",
      targetPrimitiveId: "warmth",
      limitType: "cap",
      thresholdValue: 0.50,
      condition: "always",
      category: "Emotional Safety",
      description: "Ensures we do not exceed 0.50 warmth under sensitive states"
    };

    const result = resolveCascade(prim, [], [], defaultUser, [shield], []);
    expect(result.finalValue).toBe(0.50);
    expect(result.steps.length).toBe(2);
    expect(result.steps[1].sourceType).toBe("governance");
    expect(result.steps[1].delta).toBeCloseTo(-0.22);
    expect(result.steps[1].runningValue).toBe(0.50);
  });

  it("should enforce governance floor override", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const shield: GovernanceShield = {
      id: "shield_floor",
      name: "Warmth Floor",
      targetPrimitiveId: "warmth",
      limitType: "floor",
      thresholdValue: 0.80,
      condition: "always",
      category: "Emotional Safety",
      description: "Ensures warmth is at least 0.80"
    };

    const result = resolveCascade(prim, [], [], defaultUser, [shield], []);
    expect(result.finalValue).toBe(0.80);
    expect(result.steps.length).toBe(2);
    expect(result.steps[1].sourceType).toBe("governance");
    expect(result.steps[1].delta).toBeCloseTo(0.08);
    expect(result.steps[1].runningValue).toBe(0.80);
  });

  it("should evaluate shield condition based on user anxietyLevel", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const shield: GovernanceShield = {
      id: "shield_anxiety",
      name: "Anxiety Cap",
      targetPrimitiveId: "warmth",
      limitType: "cap",
      thresholdValue: 0.50,
      condition: "anxietyLevel == high",
      category: "Emotional Safety",
      description: "Enforces 0.50 cap under high anxiety"
    };

    // User is medium anxiety -> shield should not fire
    const mediumResult = resolveCascade(prim, [], [], defaultUser, [shield], []);
    expect(mediumResult.finalValue).toBe(0.72);

    // User is high anxiety -> shield should fire
    const highAnxietyUser: MockUser = { ...defaultUser, anxietyLevel: "high" };
    const highResult = resolveCascade(prim, [], [], highAnxietyUser, [shield], []);
    expect(highResult.finalValue).toBe(0.50);
  });

  it("should evaluate shield condition based on user upiUsage", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const shield: GovernanceShield = {
      id: "shield_upi",
      name: "Heavy UPI Cap",
      targetPrimitiveId: "warmth",
      limitType: "cap",
      thresholdValue: 0.50,
      condition: "upiUsage == heavy",
      category: "Financial Safety",
      description: "Clamps warmth on heavy UPI users"
    };

    // User has low upi usage -> shield does not fire
    const lowResult = resolveCascade(prim, [], [], defaultUser, [shield], []);
    expect(lowResult.finalValue).toBe(0.72);

    // User has heavy upi usage -> shield fires
    const heavyUpiUser: MockUser = { ...defaultUser, upiUsage: "heavy" };
    const heavyResult = resolveCascade(prim, [], [], heavyUpiUser, [shield], []);
    expect(heavyResult.finalValue).toBe(0.50);
  });

  it("should not affect warmth when shield targets a different primitive", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const shield: GovernanceShield = {
      id: "shield_humor",
      name: "Humor Cap",
      targetPrimitiveId: "humor", // Targets humor
      limitType: "cap",
      thresholdValue: 0.20,
      condition: "always",
      category: "Safety",
      description: "Limit humor"
    };

    const result = resolveCascade(prim, [], [], defaultUser, [shield], []);
    expect(result.finalValue).toBe(0.72);
  });

  it("should apply multiple matching segments additively with clamping in order", () => {
    const prim = createMockPrimitive("warmth", 0.60);
    const seg1: Segment = {
      id: "seg_1",
      name: "More Warmth",
      description: "adds 0.25",
      category: "style",
      rules: [],
      modifiers: { warmth: { value: 0.25 } }
    };
    const seg2: Segment = {
      id: "seg_2",
      name: "Even More Warmth",
      description: "adds 0.20",
      category: "style",
      rules: [],
      modifiers: { warmth: { value: 0.20 } }
    };

    const result = resolveCascade(prim, ["seg_1", "seg_2"], [seg1, seg2], defaultUser, [], []);
    // 0.60 + 0.25 = 0.85 -> 0.85 + 0.20 = 1.05 (clamps to 1.0)
    expect(result.finalValue).toBe(1.0);
    expect(result.steps.length).toBe(3);
    expect(result.steps[1].runningValue).toBe(0.85);
    expect(result.steps[2].runningValue).toBe(1.0);
  });

  it("should compile a complete trace showing monotonic changes", () => {
    const prim = createMockPrimitive("warmth", 0.72);
    const segment: Segment = {
      id: "seg_1",
      name: "Segment 1",
      description: "adds 0.15",
      category: "style",
      rules: [],
      modifiers: { warmth: { value: 0.15 } }
    };
    const shield: GovernanceShield = {
      id: "shield_1",
      name: "Safety Cap",
      targetPrimitiveId: "warmth",
      limitType: "cap",
      thresholdValue: 0.80,
      condition: "always",
      category: "Safety",
      description: "cap warmth"
    };

    const result = resolveCascade(prim, ["seg_1"], [segment], defaultUser, [shield], []);
    // Baseline = 0.72
    // Segment = +0.15 -> 0.87
    // Shield Cap = clamp to 0.80 (delta = -0.07)
    expect(result.finalValue).toBe(0.80);
    expect(result.steps.length).toBe(3);
    expect(result.steps[0].runningValue).toBe(0.72);
    expect(result.steps[1].runningValue).toBe(0.87);
    expect(result.steps[2].runningValue).toBe(0.80);
  });
});
