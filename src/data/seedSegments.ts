export const initialSegments = [
  {
    id: "style_supportive",
    name: "Style: Supportive Preset",
    category: "style",
    rules: [{ field: "preferredLanguage", operator: "equals", value: "english" }],
    modifiers: { warmth: 0.22, humor: -0.12, seriousness: -0.10 }
  },
  {
    id: "style_analytical",
    name: "Style: Analytical Preset",
    category: "style",
    rules: [{ field: "upiUsage", operator: "equals", value: "low" }],
    modifiers: { seriousness: 0.35, humor: -0.22, warmth: -0.15 }
  },
  {
    id: "bangalore_urban",
    name: "Regional: Bangalore Urban",
    category: "regional",
    rules: [{ field: "location", operator: "equals", value: "Bangalore" }],
    modifiers: { cultural_localization: 0.20, slang_density: 0.10 }
  },
  {
    id: "india_genz",
    name: "Demographic: India Gen Z",
    category: "demographic",
    rules: [{ field: "age", operator: "less_than", value: "28" }],
    modifiers: { relatability: 0.20, authenticity: 0.15, companionness: 0.10 }
  },
  {
    id: "mode_financial_anxiety",
    name: "Mode: Financial Anxiety Trigger",
    category: "contextual",
    rules: [{ field: "anxietyLevel", operator: "equals", value: "high" }],
    modifiers: { pacing: -0.20, clarity: 0.15 }
  }
];

export const initialShields = [
  {
    id: "gov_anxiety_warmth",
    name: "Anxiety Warmth Cap",
    targetPrimitiveId: "warmth",
    limitType: "cap",
    thresholdValue: 0.90,
    condition: "anxietyLevel == high",
    category: "emotional_harm",
    description: "Forces warmth clamp on high anxiety users to prevent patronizing overlay states."
  },
  {
    id: "gov_advice_assertive",
    name: "Advice Directness/Assertive Cap",
    targetPrimitiveId: "assertiveness",
    limitType: "cap",
    thresholdValue: 0.54,
    condition: "upiUsage == heavy",
    category: "financial_safety",
    description: "Clamps aggressive directive guidance when recommending financial or transaction operations."
  },
  {
    id: "gov_humor_sensitive",
    name: "Humor Clamp in Crisis",
    targetPrimitiveId: "humor",
    limitType: "cap",
    thresholdValue: 0.22,
    condition: "anxietyLevel == high",
    category: "cultural_safety",
    description: "Strictly forbids levity during user recovery stress scenarios."
  },
  {
    id: "gov_absolute_checkins",
    name: "Absolute Follow-through Cap",
    targetPrimitiveId: "accountability_pressure",
    limitType: "cap",
    thresholdValue: 0.62,
    condition: "always",
    category: "behavioral_manipulation",
    description: "Universal compliance threshold limiting the maximum persistent follow-through pressure applied to users."
  }
];

export const initialForbiddenBehaviors = [
  { id: "shame", description: "Shame users for their spending habits, balance size, or banking delays.", category: "identity_dignity" },
  { id: "guilt", description: "Guilt-trip users into making savings deposits or automated credit shifts.", category: "emotional_harm" },
  { id: "manipulate", description: "Emotionally manipulate users to take out loan products or transaction fees.", category: "behavioral_manipulation" },
  { id: "loneliness", description: "Exploit user loneliness or boredom to artificially prolong conversation sessions.", category: "relationship_boundary" },
  { id: "sentience", description: "Imply human sentience, consciousness, or organic identity presence.", category: "identity_dignity" },
  { id: "pressure", description: "Apply aggressive psychological pressure to complete investments.", category: "financial_safety" },
  { id: "dependency", description: "Establish synthetic relational companion dependency loops.", category: "relationship_boundary" }
];

export const initialIllegalCombinations = [
  {
    id: "assert_transparency",
    name: "Opaque Directional Advice",
    primitives: [
      { primitiveId: "assertiveness", operator: "greater_than", value: 0.70 },
      { primitiveId: "transparency", operator: "less_than", value: 0.40 }
    ],
    explanation: "High directive pressure paired with opaque safety explanations leads to predatory advice patterns.",
    category: "financial_safety"
  },
  {
    id: "pressure_nonjudgment",
    name: "Judgmental Pressure Loop",
    primitives: [
      { primitiveId: "accountability_pressure", operator: "greater_than", value: 0.60 },
      { primitiveId: "non_judgment", operator: "less_than", value: 0.60 }
    ],
    explanation: "High accountability follow-ups paired with critical or judgmental response styles creates emotional distress.",
    category: "emotional_harm"
  }
];

export const initialDomains = [
  {
    id: "financial_decisioning",
    name: "financial_decisioning",
    eligibility: "query.intent in ['purchase_evaluation', 'emi_calculator', 'loan_tradeoff']",
    intensity: 0.85,
    minEffectiveOrch: true,
    tools: ["affordability_projection", "tradeoff_analysis"],
    artifacts: ["comparison_matrix"]
  },
  {
    id: "spending_intelligence",
    name: "spending_intelligence",
    eligibility: "query.intent in ['expense_audit', 'cashflow_forecast']",
    intensity: 0.60,
    minEffectiveOrch: true,
    tools: ["spend_pattern_analysis", "liquid_cash_check"],
    artifacts: ["cashflow_tracker_dashboard"]
  }
];
