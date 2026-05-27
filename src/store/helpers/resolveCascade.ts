import { Primitive, MockUser, GovernanceShield, CascadeResult, CascadeStep, Segment, IllegalCombination } from "../types";

export function resolveCascade(
  prim: Primitive,
  activeSegmentIds: string[],
  segments: Segment[],
  user: MockUser,
  governanceShields: GovernanceShield[],
  _illegalCombinations: IllegalCombination[] = []
): CascadeResult {
  void _illegalCombinations;
  const steps: CascadeStep[] = [];
  let runningValue = prim.base;

  // 1. Initial Baseline Value (Marketing Layer)
  steps.push({
    sourceName: "Brand Persona Baseline",
    sourceType: "base",
    delta: 0,
    runningValue,
    category: "marketing"
  });

  const allSegments = segments || [];

  activeSegmentIds.forEach(segId => {
    const segment = allSegments.find((s: Segment) => s.id === segId);
    if (!segment) return;
    
    // Check rule compatibility
    let matches = true;
    if (segment.rules && segment.rules.length > 0) {
      for (const rule of segment.rules) {
        const uVal = String(user[rule.field as keyof MockUser] || "");
        if (rule.operator === "equals" && uVal !== rule.value) {
          matches = false;
          break;
        }
      }
    }

    if (matches && segment.modifiers && segment.modifiers[prim.id] !== undefined) {
      const modObj = segment.modifiers[prim.id];
      const delta = typeof modObj === "number" ? modObj : modObj?.value ?? 0;
      runningValue += delta;
      
      // Clamp standard range
      if (runningValue < 0) runningValue = 0;
      if (runningValue > 1) runningValue = 1;

      steps.push({
        sourceName: segment.name,
        sourceType: "overlay",
        delta,
        runningValue,
        category: "product"
      });
    }
  });

  // 3. Governance Shield Enforcement (Governance overrides all layers!)
  governanceShields.forEach(shield => {
    if (shield.targetPrimitiveId !== prim.id) return;

    // Check if the shield conditional is met
    let active = false;
    if (shield.condition === "always") {
      active = true;
    } else if (shield.condition === "anxietyLevel == high" && user.anxietyLevel === "high") {
      active = true;
    } else if (shield.condition === "upiUsage == heavy" && user.upiUsage === "heavy") {
      active = true;
    }

    if (active) {
      if (shield.limitType === "cap" && runningValue > shield.thresholdValue) {
        const diff = shield.thresholdValue - runningValue;
        runningValue = shield.thresholdValue;
        
        steps.push({
          sourceName: `${shield.name} (Safety Override)`,
          sourceType: "governance",
          delta: diff,
          runningValue,
          category: "governance"
        });
      } else if (shield.limitType === "floor" && runningValue < shield.thresholdValue) {
        const diff = shield.thresholdValue - runningValue;
        runningValue = shield.thresholdValue;

        steps.push({
          sourceName: `${shield.name} (Safety Override)`,
          sourceType: "governance",
          delta: diff,
          runningValue,
          category: "governance"
        });
      }
    }
  });

  return {
    finalValue: runningValue,
    steps
  };
}
