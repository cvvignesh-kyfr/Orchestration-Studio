# Specification: Behavior State Store (Zustand Slices)

The **KYFR Platform** manages complex multi-domain state through a highly modularized Zustand store. The store is composed of distinct slices consolidated into a single unified hook in `src/store/useBehaviorStore.ts`.

---

## 1. Composition Architecture

The master store composed in `src/store/index.ts` combines the following specialized slices:

```ts
export const useBehaviorStore = create<BehaviorState>()((...a) => ({
  ...createPrimitivesSlice(...a),
  ...createSegmentsSlice(...a),
  ...createGovernanceSlice(...a),
  ...createStrategiesSlice(...a),
  ...createUiSlice(...a),
  ...createMockUserSlice(...a),
}));
```

---

## 2. Slice Reference & API Specs

### A. Primitives Slice (`src/store/slices/primitivesSlice.ts`)
Owns the base behavioral primitive values and registry controls.

- **State Owned**:
  - `primitives: Record<string, Primitive>`: Dictionaries of active primitives in the workspace.
- **Actions & API**:
  - `updatePrimitiveBase(id: string, value: number)`: Updates `base` value of primitive `id`. Clamps value automatically to the primitive's defined safety bounds and appends an `update_base` audit log.
  - `createPrimitive(primitive: Primitive)`: Seeds a new primitive in the local workspace.
  - `deletePrimitive(id: string)`: Removes the primitive from the active memory.
  - `updatePrimitive(id: string, updates: Partial<Primitive>)`: Modifies specific fields.

---

### B. Segments Slice (`src/store/slices/segmentsSlice.ts`)
Manages segment targeting rules and overlay modifiers.

- **State Owned**:
  - `segments: Segment[]`: List of demographics, regions, or context blocks.
- **Actions & API**:
  - `createSegment(segment: Segment)`: Adds a new targeting segment.
  - `deleteSegment(id: string)`: Deletes segment and removes corresponding mod targets.
  - `updateSegment(id, name, description, category)`: Updates core identification parameters.
  - `addSegmentRule(segmentId: string, rule: SegmentRule)`: Appends an evaluation condition (e.g. `upiUsage equals heavy`).
  - `deleteSegmentRule(segmentId: string, ruleIndex: number)`: Removes a rule index.
  - `updateSegmentModifier(segmentId, primitiveId, value)`: Updates or adds a modifier value (e.g. `warmth = +0.10`) targeting a primitive inside a segment.

---

### C. Governance Slice (`src/store/slices/governanceSlice.ts`)
Manages safety rules, caps, floors, and forbidden behaviors.

- **State Owned**:
  - `governanceShields: GovernanceShield[]`: Active cap and floor rules.
  - `forbiddenBehaviors: ForbiddenBehavior[]`: Flagged conversational bans.
  - `illegalCombinations: IllegalCombination[]`: Cross-primitive conflicting state rules.
- **Actions & API**:
  - `addGovernanceShield(shield: GovernanceShield)`: Appends a limit rule.
  - `deleteGovernanceShield(id: string)`: Deletes a cap or floor rule.
  - `toggleForbiddenBehavior(id: string)`: Toggles active status of an immutable hard prohibition.
  - `addIllegalCombination(comb: IllegalCombination)`: Creates a cross-primitive safety constraint.

---

### D. UI Slice (`src/store/slices/uiSlice.ts`)
Tracks active tabs, active domains, selected items, and routing.

- **State Owned**:
  - `activeL1Domain: "marketing" | "product" | "governance" | ...`
  - `activeL2Section: string`
  - `selectedPrimitiveId: string`
  - `selectedSegmentId: string`
  - `selectedUserId: string`
- **Actions & API**:
  - `setActiveL1Domain(domain)`: Switches main workspace category.
  - `setActiveL2Section(section)`: Switches inner panel layout.
  - `setSelectedPrimitive(id)`, `setSelectedSegment(id)`, `setSelectedUser(id)`: Changes editor focus.

---

## 3. How to Add a New Slice

To extend the store with a new slice (e.g., `experimentsSlice`):

1. **Create the slice file** `src/store/slices/experimentsSlice.ts`.
2. **Define the interface** and creator function conforming to Zustand's signature:
   ```ts
   import { StateCreator } from "zustand";
   import { BehaviorState } from "../types";

   export interface ExperimentsSlice {
     experiments: any[];
     createExperiment: (exp: any) => void;
   }

   export const createExperimentsSlice: StateCreator<
     BehaviorState,
     [],
     [],
     ExperimentsSlice
   > = (set) => ({
     experiments: [],
     createExperiment: (exp) => set((state) => ({ experiments: [...state.experiments, exp] })),
   });
   ```
3. **Import and merge** the slice in `src/store/index.ts`:
   ```ts
   import { createExperimentsSlice } from "./slices/experimentsSlice";
   
   export const useBehaviorStore = create<BehaviorState>()((...a) => ({
     ...
     ...createExperimentsSlice(...a),
   }));
   ```
4. **Extend** the combined `BehaviorState` interface in `src/store/types.ts` to inherit `ExperimentsSlice`.
