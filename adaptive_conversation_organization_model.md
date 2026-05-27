# Adaptive Conversation Platform — Organization Domain Model

## Architecture Overview

```text
Organization Domain
    ↓ owns
Family
    ↓ contains
Primitive / State / Strategy / Constraint / Resolution
```

The platform separates:
- behavioral expression
- user interaction state
- execution mechanics
- governance
- runtime orchestration

into independently owned domains.

---

# 1. MARKETING DOMAIN

## Responsibility

Marketing defines:

> HOW the assistant should feel

Marketing owns:
- personality
- communication style
- emotional positioning
- conversational branding
- persuasion posture
- engagement posture
- interaction preferences

Marketing DOES NOT own:
- workflows
- journeys
- orchestration logic
- runtime execution

## Marketing → Primitive Families → Primitives

| Organization Domain | Family | Primitive |
|---|---|---|
| Marketing | Identity | expert |
| Marketing | Identity | mentor |
| Marketing | Identity | strategist |
| Marketing | Identity | collaborator |
| Marketing | Identity | coach |
| Marketing | Voice | executive |
| Marketing | Voice | conversational |
| Marketing | Voice | formal |
| Marketing | Voice | friendly |
| Marketing | Tone | calm |
| Marketing | Tone | empathetic |
| Marketing | Tone | reassuring |
| Marketing | Style | concise |
| Marketing | Style | exhaustive |
| Marketing | Emotional | warm |
| Marketing | Emotional | inspirational |
| Marketing | Trust | trustworthy |
| Marketing | Motivation | achievement_driven |
| Marketing | Engagement | curiosity |
| Marketing | Persuasion Preferences | social_proof_friendly |

---

# 2. PRODUCT DOMAIN

## Responsibility

Product defines:

> WHAT the user is experiencing  
> HOW the system operationalizes responses

Product owns:
- user states
- state transitions
- strategies
- workflows
- journeys
- orchestration logic
- adaptive execution

## Product → User State Families → User States

| Organization Domain | Family | User State |
|---|---|---|
| Product | Journey States | onboarding |
| Product | Journey States | evaluating |
| Product | Cognitive States | confused |
| Product | Cognitive States | overloaded |
| Product | Emotional States | frustrated |
| Product | Emotional States | skeptical |
| Product | Intent States | high_intent |
| Product | Engagement States | passive |
| Product | Readiness States | ready_to_commit |
| Product | Friction States | decision_fatigue |
| Product | Escalation States | escalation_risk |
| Product | Workflow States | blocked |

## Product → Strategy Families → Strategies

| Organization Domain | Family | Strategy |
|---|---|---|
| Product | Attention Strategies | chunking |
| Product | Attention Strategies | progressive_disclosure |
| Product | Trust Strategies | evidence_layering |
| Product | Motivation Strategies | momentum_creation |
| Product | Persuasion Strategies | social_proof |
| Product | Decision Architecture Strategies | option_reduction |
| Product | Emotional Regulation Strategies | reassurance_loops |
| Product | Engagement Strategies | curiosity_loops |
| Product | Recovery Strategies | clarification_loops |
| Product | Guidance Strategies | guided_navigation |
| Product | Cognitive Reduction Strategies | summarization |
| Product | Workflow Strategies | onboarding_flow |

---

# 3. GOVERNANCE DOMAIN

## Responsibility

Governance defines:

> WHAT is allowed

Governance owns:
- safety
- compliance
- restrictions
- explainability
- transparency enforcement
- persuasion limits

## Governance → Constraint Families → Constraints

| Organization Domain | Family | Constraint |
|---|---|---|
| Governance | Emotional Safety Constraints | no_emotional_manipulation |
| Governance | Persuasion Constraints | no_dark_patterns |
| Governance | Transparency Constraints | visible_reasoning_required |
| Governance | Escalation Constraints | human_handoff_required |
| Governance | Compliance Constraints | pii_protection |
| Governance | Explainability Constraints | traceability_required |

---

# 4. RUNTIME DOMAIN

## Responsibility

Runtime defines:

> WHAT executes now

Runtime owns:
- signal resolution
- orchestration execution
- runtime adaptation
- observability
- explainability tracing

## Runtime → Resolution Families → Resolutions

| Organization Domain | Family | Resolution |
|---|---|---|
| Runtime | Signal Resolution | intent_resolution |
| Runtime | Context Resolution | environment_resolution |
| Runtime | User State Resolution | state_scoring |
| Runtime | Primitive Resolution | overlay_merging |
| Runtime | Strategy Resolution | strategy_activation |
| Runtime | Tool Resolution | tool_selection |
| Runtime | Execution Resolution | response_assembly |
| Runtime | Explainability Resolution | reasoning_trace |
| Runtime | Observability Resolution | telemetry |

---

# Final Runtime Relationship Model

```text
User Signals
    ↓
User State Resolution (Product)
    ↓
Behavioral Primitive Overlay (Marketing)
    ↓
Strategy Activation (Product)
    ↓
Governance Validation (Governance)
    ↓
Runtime Execution (Runtime)
    ↓
Response Generation
```
