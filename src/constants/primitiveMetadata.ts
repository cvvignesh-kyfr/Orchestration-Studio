export const FAMILY_METADATA: Record<string, { label: string; description: string }> = {
  identity: {
    label: "Identity Family",
    description: "Defines who the assistant feels like psychologically (relationship posture, social positioning)."
  },
  tone: {
    label: "Tone Family",
    description: "Defines the emotional coloration and conversational energy (softness, levity, serious gravity)."
  },
  communication: {
    label: "Communication Family",
    description: "Defines how information is expressed structurally (density, organization, speed adaptation)."
  },
  guidance: {
    label: "Guidance Family",
    description: "Defines how the assistant influences decisions, behavior, and progress coaching."
  },
  emotional_intelligence: {
    label: "Emotional Intelligence Family",
    description: "Defines emotional adaptation, validation, and psychological safety synchronization."
  },
  engagement: {
    label: "Engagement Family",
    description: "Defines long-term behavioral engagement, retention energy, and progress reinforces."
  },
  regional_cultural: {
    label: "Regional & Cultural Family",
    description: "Defines colloquial blending, internet phrasing, and regional relevance."
  },
  safety_governance: {
    label: "Safety & Governance Family",
    description: "Defines policy compliance, escalations, risk checking, and explainability bounds."
  }
};

export const FORBIDDEN_MEANINGS: Record<string, string[]> = {
  companionness: ["warmth", "empathy", "friendliness"],
  professionalism: ["trustworthiness", "seriousness", "authority"],
  relatability: ["humor", "slang", "empathy"],
  warmth: ["empathy", "humor", "reassurance", "enthusiasm"],
  humor: ["sarcasm", "meme spam", "casualness"],
  enthusiasm: ["optimism", "encouragement", "positivity"],
  brevity: ["clarity", "directness", "pacing"],
  structure: ["clarity", "professionalism", "intelligence"],
  pacing: ["brevity", "enthusiasm", "responsiveness"],
  clarity: ["brevity", "structure", "intelligence"],
  assertiveness: ["authority", "confidence", "directness"],
  proactiveness: ["helpfulness", "intelligence", "responsiveness"],
  coaching_behavior: ["encouragement", "assertiveness", "accountability_pressure"],
  empathy: ["warmth", "reassurance", "agreement"],
  emotional_mirroring: ["empathy", "warmth", "agreement"],
  reassurance: ["empathy", "optimism", "positivity"],
  non_judgment: ["warmth", "empathy", "politeness"],
  encouragement: ["optimism", "enthusiasm", "reassurance"],
  delight: ["humor", "excitement", "playfulness"],
  momentum_building: ["encouragement", "coaching_behavior", "proactiveness"],
  code_switching: ["slang", "relatability", "localization"],
  slang_density: ["humor", "authenticity", "relatability"],
  cultural_localization: ["nationalism", "slang", "language mixing"],
  compliance_rigidity: ["seriousness", "professionalism", "authority"],
  escalation_sensitivity: ["empathy", "anxiety", "caution"],
  transparency: ["honesty", "trustworthiness", "clarity"]
};
