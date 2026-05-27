# Specification: Behavioral and Governance Primitives

Behavioral and Governance Primitives are the fundamental semantic building blocks of the **KYFR Platform**. They represent fine-grained conversational, stylistic, and psychological dimensions configured dynamically for the downstream LLM Orchestration Engine.

---

## 1. Primitive Schema Definition

Each primitive in the system conforms to the strict `Primitive` interface defined in `src/store/types.ts`:

```ts
export interface Primitive {
  readonly id: string; // Machine-readable unique identifier
  readonly name: string; // Human-readable label
  readonly category: "Identity" | "Voice" | "Tone" | "Style" | "Emotional" | "Trust" | "Motivation" | "Engagement" | "Persuasion Preferences";
  readonly path: string; // Unique dot-separated path format
  readonly base: number; // Default baseline value [0.0 - 1.0]
  readonly definition: string; // Core linguistic explanation
  readonly principle: string; // Instruction rule for the LLM
  readonly owner: string; // Team owner (e.g. "Product Squad")
  readonly range: { min: number; max: number }; // Safety boundaries
  readonly semanticInterpretation: { min: string; mid: string; max: string }; // Plaintext translation of values
  
  readonly resolutionSignals?: string[]; // Inputs used to infer this value
  readonly inferenceRules?: string[]; // Dynamic inference equations
  readonly compatibleStrategies?: string[]; // Product strategies that utilize this
  readonly incompatibleStrategies?: string[]; // Product strategies that clash
  readonly governanceConstraints?: {
    cap?: number; // Maximum value cap
    floor?: number; // Minimum value floor
    excludedContexts?: string[]; // Situations where this primitive is forbidden
  };
  readonly linguisticImplications?: {
    promptDirective?: string; // Direct system prompt injection snippet
    examplePhrasing?: string; // Example phrase demonstrating this level
  };
}
```

---

## 2. Core Field Specification

| Field | Type | Bounds / Format | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `snake_case` (e.g., `coaching_behavior`) | Acts as the system key for matching segment modifiers, compiling defaults, and configuring safety cap/floor rules. |
| `path` | `string` | `global_foundation.{category}.{id}` | Unique dot-separated path string ensuring zero collision in nested dictionaries. |
| `base` | `number` | `0.0 <= base <= 1.0` | Default value applied if no segments or governance overrides are active. |
| `range` | `object` | `min < max`, within `[0.0, 1.0]` | Restricts any combined overlay or user override from pushing a value past this safety envelope. |
| `semanticInterpretation`| `object` | 3 descriptive text strings | Standard dictionary defining what the `min` (0.0), `mid` (0.5), and `max` (1.0) values represent in conversation. |

---

## 3. The 8 Behavioral Primitive Families

The system categorizes primitives into distinct families corresponding to specific aspects of customer interaction:

1. **Identity**: Determines the base role and operational persona boundaries (e.g., `expert`, `mentor`).
2. **Voice**: Style features governing speech cadence and vocabulary constraints (e.g., `clarity`, `directness`).
3. **Tone**: Underpins emotional phrasing characteristics (e.g., `warmth`, `professionalism`).
4. **Style**: Interaction formatting rules (e.g., `pacing`, `conversational_depth`).
5. **Emotional**: Psychological calibration metrics (e.g., `reassurance`, `validation_depth`).
6. **Trust**: Transparency and credibility protocols (e.g., `evidence_layering`, `disclosure_level`).
7. **Motivation**: Drive-enhancing conversational behaviors (e.g., `momentum_building`, `celebration_frequency`).
8. **Persuasion Preferences**: Guidance model selections tailored to user decision-making (e.g., `assertiveness`, `option_reduction`).

---

## 4. Governance Constraints & Safety Limits

Governance safety controls are defined statically in `primitiveRegistry.ts` or dynamically via `governanceShields` in the store:

- **Value Caps (`cap`)**: Hard maximum threshold limit. If a user's matched segment multipliers push `warmth` to `0.95`, but a safety shield has a cap of `0.70`, the value is clamped down to `0.70`.
- **Value Floors (`floor`)**: Hard minimum threshold limit. Ensures critical support metrics (e.g., `disclosure_level` during transaction failures) stay above a minimum safety level (e.g., `0.80`).
- **Excluded Contexts (`excludedContexts`)**: Disables segment-level adjustments entirely when specific system state variables are detected (e.g. `salaryStatus == delayed` or `anxietyLevel == high`).

---

## 5. How to Add a New Primitive

To introduce a new primitive to the system, follow these steps:

1. **Open** `src/constants/primitiveRegistry.ts`.
2. **Add** the entry to the `storePrimitives` record. Ensure that all required fields from the `Primitive` interface are fully populated:
   ```ts
   coaching_behavior: {
     id: "coaching_behavior",
     name: "Coaching Behavior",
     category: "Persuasion Preferences",
     path: "global_foundation.persuasion.coaching_behavior",
     base: 0.40,
     definition: "Guides the user using questions and educational scaffolding rather than commands.",
     principle: "Adopt a coaching stance: clarify goals, suggest self-reflection, and explain reasoning.",
     owner: "Product Squad",
     range: { min: 0.10, max: 0.90 },
     semanticInterpretation: {
       min: "Direct instructional guidance.",
       mid: "Collaborative, explanatory support.",
       max: "Socratic inquiry and long-term skill empowerment."
     }
   }
   ```
3. **Save** the file. The compiled Next.js client-side Zustand store and the command-line CLI compiler (`compile.ts`) will automatically import, validate, and serialize your new primitive into the defaults system without any changes to component files.
