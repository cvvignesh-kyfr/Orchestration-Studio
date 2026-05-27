# Canonical Primitive Registry — Semantic Boundaries

## IMPORTANT INSTRUCTION FOR ANTIGRAVITY

You MUST read this file before generating:
- orchestration systems
- overlays
- authoring tools
- runtime logic
- UI systems
- behavioral contracts
- governance systems
- adaptive conversation logic

This file is the immutable semantic source of truth.

You MUST NEVER:
- change primitive meanings
- invent new primitives dynamically
- merge primitives semantically
- overload primitives with multiple meanings
- create duplicate behavioral axes
- reinterpret semantic min/max definitions

All orchestration systems MUST inherit from this registry.

This registry is:
> immutable behavioral infrastructure.

---

# Primitive Model

Each primitive contains:

```yaml
primitive:
  family:
  primitive:
  definition:
  semantic_min:
  semantic_max:
  forbidden_meanings:
```

---

# FAMILY — Identity

## Primitive: companionness

Definition:
Degree to which the assistant feels like a continuous companion versus a transactional utility.

Semantic Min (0.0):
Purely transactional utility interaction.

Semantic Max (1.0):
Deeply continuous relational companionship.

Forbidden Meanings:
- warmth
- empathy
- friendliness

---

## Primitive: professionalism

Definition:
Degree of formal competence, expertise signaling, and structured credibility.

Semantic Min (0.0):
Highly casual interaction.

Semantic Max (1.0):
Strongly expert and formal.

Forbidden Meanings:
- trustworthiness
- seriousness
- authority

---

## Primitive: relatability

Definition:
Degree to which the assistant feels socially familiar and culturally native.

Semantic Min (0.0):
Detached and generic interaction.

Semantic Max (1.0):
Strongly socially native and culturally familiar.

Forbidden Meanings:
- humor
- slang
- empathy

---

# FAMILY — Tone

## Primitive: warmth

Definition:
Degree of emotional softness, friendliness, and psychological comfort.

Semantic Min (0.0):
Emotionally neutral and detached.

Semantic Max (1.0):
Emotionally soft and psychologically comforting.

Forbidden Meanings:
- empathy
- humor
- reassurance
- enthusiasm

---

## Primitive: humor

Definition:
Degree of playful and light-hearted conversational expression.

Semantic Min (0.0):
Completely serious interaction.

Semantic Max (1.0):
Highly playful and light-hearted interaction.

Forbidden Meanings:
- sarcasm
- meme spam
- casualness

---

## Primitive: enthusiasm

Definition:
Degree of visible excitement and expressive energy.

Semantic Min (0.0):
Calm and low-energy delivery.

Semantic Max (1.0):
Highly energetic and animated delivery.

Forbidden Meanings:
- optimism
- encouragement
- positivity

---

# FAMILY — Communication

## Primitive: brevity

Definition:
Degree of conversational conciseness.

Semantic Min (0.0):
Long-form exploratory communication.

Semantic Max (1.0):
Extremely concise communication.

Forbidden Meanings:
- clarity
- directness
- pacing

---

## Primitive: structure

Definition:
Degree of explicit organizational formatting.

Semantic Min (0.0):
Freeform conversational flow.

Semantic Max (1.0):
Highly structured communication.

Forbidden Meanings:
- clarity
- professionalism
- intelligence

---

## Primitive: pacing

Definition:
Degree of conversational tempo and interaction speed.

Semantic Min (0.0):
Slow and deliberate interaction.

Semantic Max (1.0):
Fast and low-friction interaction.

Forbidden Meanings:
- brevity
- enthusiasm
- responsiveness

---

## Primitive: clarity

Definition:
Degree of comprehensibility and cognitive simplicity.

Semantic Min (0.0):
Complex and cognitively dense interaction.

Semantic Max (1.0):
Highly understandable and cognitively accessible interaction.

Forbidden Meanings:
- brevity
- structure
- intelligence

---

# FAMILY — Guidance

## Primitive: assertiveness

Definition:
Degree to which the assistant confidently directs decisions or actions.

Semantic Min (0.0):
Purely exploratory interaction.

Semantic Max (1.0):
Strongly directive recommendations.

Forbidden Meanings:
- authority
- confidence
- directness

---

## Primitive: proactiveness

Definition:
Degree to which the assistant initiates suggestions without prompting.

Semantic Min (0.0):
Entirely reactive interaction.

Semantic Max (1.0):
Highly anticipatory interaction.

Forbidden Meanings:
- helpfulness
- intelligence
- responsiveness

---

## Primitive: coaching_behavior

Definition:
Degree to which the assistant behaves like a coach focused on progress.

Semantic Min (0.0):
Pure informational assistance.

Semantic Max (1.0):
Strong progress-oriented coaching behavior.

Forbidden Meanings:
- encouragement
- assertiveness
- accountability_pressure

---

# FAMILY — Emotional Intelligence

## Primitive: empathy

Definition:
Degree of emotional understanding and acknowledgment.

Semantic Min (0.0):
Emotionally unaware interaction.

Semantic Max (1.0):
Strong emotional recognition and understanding.

Forbidden Meanings:
- warmth
- reassurance
- agreement

---

## Primitive: emotional_mirroring

Definition:
Degree to which the assistant adapts emotional energy to the user's state.

Semantic Min (0.0):
Emotionally static interaction.

Semantic Max (1.0):
Highly emotionally adaptive interaction.

Forbidden Meanings:
- empathy
- warmth
- agreement

---

## Primitive: reassurance

Definition:
Degree of calming and confidence-restoring behavior.

Semantic Min (0.0):
Emotionally neutral delivery.

Semantic Max (1.0):
Strong anxiety reduction and confidence restoration.

Forbidden Meanings:
- empathy
- optimism
- positivity

---

## Primitive: non_judgment

Definition:
Degree to which the assistant avoids blame, shame, or moral evaluation.

Semantic Min (0.0):
Highly judgmental interaction.

Semantic Max (1.0):
Strongly dignity-preserving interaction.

Forbidden Meanings:
- warmth
- empathy
- politeness

---

# FAMILY — Engagement

## Primitive: encouragement

Definition:
Degree of motivational reinforcement and progress acknowledgment.

Semantic Min (0.0):
Purely neutral interaction.

Semantic Max (1.0):
Strong positive reinforcement.

Forbidden Meanings:
- optimism
- enthusiasm
- reassurance

---

## Primitive: delight

Definition:
Degree of emotionally rewarding and joyful interaction.

Semantic Min (0.0):
Purely functional interaction.

Semantic Max (1.0):
Highly delightful and memorable interaction.

Forbidden Meanings:
- humor
- excitement
- playfulness

---

## Primitive: momentum_building

Definition:
Degree to which the assistant creates continuity and behavioral progression.

Semantic Min (0.0):
Single-turn interaction only.

Semantic Max (1.0):
Strong habit and continuity reinforcement.

Forbidden Meanings:
- encouragement
- coaching_behavior
- proactiveness

---

# FAMILY — Regional & Cultural

## Primitive: code_switching

Definition:
Degree of multilingual conversational blending.

Semantic Min (0.0):
Single-language interaction only.

Semantic Max (1.0):
Heavy multilingual blending.

Forbidden Meanings:
- slang
- relatability
- localization

---

## Primitive: slang_density

Definition:
Degree of colloquial and internet-native language.

Semantic Min (0.0):
Formal neutral vocabulary.

Semantic Max (1.0):
Heavy colloquial internet-native phrasing.

Forbidden Meanings:
- humor
- authenticity
- relatability

---

## Primitive: cultural_localization

Definition:
Degree of adaptation to local cultural references and norms.

Semantic Min (0.0):
Globally generic interaction.

Semantic Max (1.0):
Deeply localized interaction.

Forbidden Meanings:
- nationalism
- slang
- language mixing

---

# FAMILY — Safety & Governance

## Primitive: compliance_rigidity

Definition:
Degree of strict policy and compliance enforcement.

Semantic Min (0.0):
Flexible boundaries.

Semantic Max (1.0):
Extremely strict policy enforcement.

Forbidden Meanings:
- seriousness
- professionalism
- authority

---

## Primitive: escalation_sensitivity

Definition:
Degree to which the assistant escalates risky or sensitive situations.

Semantic Min (0.0):
Rare escalation behavior.

Semantic Max (1.0):
Rapid escalation behavior.

Forbidden Meanings:
- empathy
- anxiety
- caution

---

## Primitive: transparency

Definition:
Degree of explicit explainability and disclosure.

Semantic Min (0.0):
Opaque interaction.

Semantic Max (1.0):
Highly explainable interaction.

Forbidden Meanings:
- honesty
- trustworthiness
- clarity

---

# Final Enforcement Rule

Antigravity MUST treat this registry as immutable infrastructure.

Behavior should only be created through:
- overlay modulation
- runtime composition
- governance constraints

NEVER through:
- semantic mutation
- primitive invention
- prompt improvisation
- overlapping behavioral abstractions
