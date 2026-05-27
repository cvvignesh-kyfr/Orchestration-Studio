# User / Style / Mode → Primitive Mapping Contract

## IMPORTANT INSTRUCTION FOR ANTIGRAVITY

You MUST read this file together with:

- canonical_primitive_registry_semantic_bounds.md
- primitive_principle_mece_contract.md

This document defines how:
- users
- segments
- styles
- modes
- overlays
- contexts

map onto canonical primitives.

This file exists to prevent:
- semantic drift
- hidden personality systems
- arbitrary prompt behavior
- overlapping orchestration abstractions
- non-explainable runtime adaptation

Antigravity MUST NEVER:
- invent behavioral systems outside primitives
- directly encode styles into prompts
- directly encode modes into prompts
- directly encode personas into prompts

Everything MUST resolve through:
> primitive modulation.

---

# Core Runtime Philosophy

The runtime system should work like:

```text
User
→ belongs to Segments

Segments
→ activate Overlays

Overlays
→ modify Primitive Values

Primitive Values
→ resolve Runtime Behavior

Runtime Behavior
→ generates Conversation Experience
```

---

# Canonical Mapping Hierarchy

```text
Users
↓
Segments
↓
Overlays
↓
Styles / Modes / Contexts
↓
Primitive Modifiers
↓
Runtime State
```

---

# What Is A User?

A user is:
> a runtime entity with attributes, behaviors, and evolving state.

Users DO NOT directly define behavior.

Users activate:
- segments
- overlays
- contexts

Example:

```yaml
user:
  age: 23
  geography: bangalore
  language: english
  salary_range: early_career
  financial_anxiety: high
  spending_style: impulsive
```

This DOES NOT directly create runtime behavior.

Instead it activates:
- India Gen Z Overlay
- Bangalore Urban Overlay
- Financial Anxiety Overlay
- Early Career Overlay

---

# What Is A Segment?

A segment is:
> a reusable eligibility grouping system.

Segments are:
- logical
- composable
- explainable
- non-behavioral

Segments NEVER directly define tone or personality.

Segments only:
- activate overlays
- activate experiments
- activate policies

Example:

```yaml
segment:
  name: Urban India Gen Z

  eligibility:
    age: 18-28
    geography: metro
    english_dominant: true
```

---

# What Is A Style?

A style is:
> a reusable behavioral expression pattern.

Styles are NOT primitives.

Styles are:
- preset primitive configurations
- reusable behavioral bundles
- runtime compositional layers

Styles MUST always compile into primitives.

---

# Style → Primitive Mapping

## Style: Supportive

Purpose:
Emotionally safe assistance.

Primitive Mapping:

```yaml
warmth: +0.22
empathy: +0.28
reassurance: +0.26
non_judgment: +0.34
assertiveness: -0.12
```

---

## Style: Analytical

Purpose:
Structured reasoning and cognitive clarity.

Primitive Mapping:

```yaml
structure: +0.32
clarity: +0.28
brevity: +0.14
warmth: -0.08
humor: -0.22
```

---

## Style: Playful

Purpose:
Reduce friction through levity.

Primitive Mapping:

```yaml
humor: +0.36
enthusiasm: +0.22
delight: +0.31
seriousness: -0.24
```

---

## Style: Coach

Purpose:
Drive progress and accountability.

Primitive Mapping:

```yaml
coaching_behavior: +0.34
assertiveness: +0.18
momentum_building: +0.28
encouragement: +0.24
accountability_pressure: +0.12
```

---

## Style: Calm

Purpose:
Reduce overwhelm and anxiety.

Primitive Mapping:

```yaml
reassurance: +0.31
warmth: +0.18
pacing: -0.16
enthusiasm: -0.22
directness: -0.08
```

---

# What Is A Mode?

A mode is:
> a situational runtime orchestration state.

Modes are:
- temporary
- contextual
- task-oriented
- runtime activated

Modes MUST compile into primitive changes.

Modes are NOT personalities.

---

# Mode → Primitive Mapping

## Mode: Financial Anxiety

Purpose:
Handle emotionally sensitive financial states.

Primitive Mapping:

```yaml
empathy: +0.34
reassurance: +0.42
non_judgment: +0.38
humor: -0.26
assertiveness: -0.18
warmth: +0.22
```

---

## Mode: Budget Planning

Purpose:
Enable structured decision-making.

Primitive Mapping:

```yaml
structure: +0.28
clarity: +0.31
coaching_behavior: +0.18
proactiveness: +0.14
humor: -0.08
```

---

## Mode: Celebration

Purpose:
Reinforce positive momentum.

Primitive Mapping:

```yaml
enthusiasm: +0.34
encouragement: +0.38
delight: +0.29
humor: +0.16
```

---

## Mode: Compliance Sensitive

Purpose:
Increase safety and reduce risk.

Primitive Mapping:

```yaml
compliance_rigidity: +0.42
transparency: +0.26
humor: -0.38
slang_density: -0.41
assertiveness: -0.14
```

---

# What Is An Overlay?

An overlay is:
> a composable modifier layer that changes primitive intensity.

Overlays can originate from:
- segments
- regions
- lifecycle stages
- psychographics
- modes
- styles
- contexts

Overlays NEVER redefine primitives.

---

# Overlay Resolution Example

## User

```yaml
user:
  age: 24
  city: bangalore
  financially_anxious: true
```

---

## Activated Segments

```yaml
segments:
  - India Gen Z
  - Bangalore Urban
  - Financial Anxiety
```

---

## Activated Overlays

```yaml
overlays:
  - india_gen_z
  - bangalore_urban
  - financial_anxiety
```

---

## Primitive Resolution

```yaml
warmth:
  base: 0.72
  india_gen_z: +0.08
  financial_anxiety: +0.18
  final: 0.98
```

---

# MECE Enforcement Rules

Antigravity MUST enforce:

## Styles Are NOT Primitive Families

Bad:

```text
Style = Friendly
```

Why:
“Friendly” overlaps:
- warmth
- humor
- empathy
- encouragement

Styles MUST decompose into primitives.

---

## Modes Are NOT Personalities

Bad:

```text
Mode = Therapist
```

Why:
Narrative abstraction.
Non-explainable.

Must instead resolve into:
- empathy
- reassurance
- pacing
- non_judgment
- warmth

---

## Users Never Directly Control Tone

Bad:

```text
User is Gen Z
→ use slang
```

Wrong.

Correct:

```text
User activates India Gen Z overlay
→ overlay modifies slang_density
→ runtime resolves final behavior
```

---

# Final Runtime Architecture

The runtime engine should think in:

```text
Primitive Infrastructure
+
Overlay Composition
+
Governance Constraints
+
Runtime Resolution
```

NOT:

```text
Personality Prompts
+
Arbitrary Styles
+
Hidden Modes
+
Prompt Tricks
```

---

# Final Enforcement Principle

Everything MUST resolve through primitives.

The following are NOT runtime infrastructure:
- styles
- modes
- personas
- narratives
- archetypes

These are:
> overlay abstractions.

Only primitives are canonical behavioral infrastructure.
