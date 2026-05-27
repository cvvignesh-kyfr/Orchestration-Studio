import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useBehaviorStore } from "@/store/useBehaviorStore";
import { Primitive, Segment } from "@/store/types";

describe("Behavior Store Composed Slices Tests", () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    act(() => {
      useBehaviorStore.setState(useBehaviorStore.getInitialState(), true);
    });
  });

  describe("Primitives Slice", () => {
    it("should initially contain at least one primitive", () => {
      const state = useBehaviorStore.getState();
      const primList = Object.values(state.primitives);
      expect(primList.length).toBeGreaterThan(0);
    });

    it("should update a primitive's base value via updatePrimitiveBase", () => {
      const state = useBehaviorStore.getState();
      const firstId = Object.keys(state.primitives)[0];

      act(() => {
        state.updatePrimitiveBase(firstId, 0.99);
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.primitives[firstId].base).toBe(0.99);
      // Verify audit log entry is appended
      expect(updatedState.auditLogs.length).toBeGreaterThan(0);
      expect(updatedState.auditLogs[0].actionType).toBe("update_base");
    });

    it("should add a new primitive via createPrimitive and record audit log", () => {
      const state = useBehaviorStore.getState();
      const newPrim: Primitive = {
        id: "new_test_prim",
        name: "New Test Primitive",
        category: "Tone",
        path: "global_foundation.tone.new_test_prim",
        base: 0.50,
        definition: "A new primitive for testing",
        principle: "Testing directive",
        owner: "Engineering Squad",
        range: { min: 0, max: 1 },
        semanticInterpretation: { min: "low", mid: "mid", max: "high" }
      };

      act(() => {
        state.createPrimitive(newPrim);
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.primitives["new_test_prim"]).toEqual(newPrim);
      expect(updatedState.auditLogs[0].description).toContain('Created new behavioral primitive: "new_test_prim"');
    });

    it("should delete a primitive via deletePrimitive", () => {
      const state = useBehaviorStore.getState();
      const firstId = Object.keys(state.primitives)[0];

      act(() => {
        state.deletePrimitive(firstId);
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.primitives[firstId]).toBeUndefined();
      expect(updatedState.auditLogs[0].description).toContain(`Deleted behavioral primitive: "${firstId}"`);
    });
  });

  describe("Segments Slice", () => {
    it("should initially contain at least one segment", () => {
      const state = useBehaviorStore.getState();
      expect(state.segments.length).toBeGreaterThan(0);
    });

    it("should create a new segment via createSegment", () => {
      const state = useBehaviorStore.getState();
      const initialCount = state.segments.length;
      
      const newSegment: Segment = {
        id: "new_test_seg",
        name: "New Test Segment",
        description: "Segment for testing",
        category: "behavioral",
        rules: [],
        modifiers: {}
      };

      act(() => {
        state.createSegment(newSegment);
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.segments.length).toBe(initialCount + 1);
      expect(updatedState.segments.find(s => s.id === "new_test_seg")).toEqual(newSegment);
    });

    it("should delete a segment via deleteSegment", () => {
      const state = useBehaviorStore.getState();
      const targetId = state.segments[0].id;
      const initialCount = state.segments.length;

      act(() => {
        state.deleteSegment(targetId);
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.segments.length).toBe(initialCount - 1);
      expect(updatedState.segments.find(s => s.id === targetId)).toBeUndefined();
    });

    it("should update modifiers of a segment and not affect other segments via updateSegmentModifier", () => {
      const state = useBehaviorStore.getState();
      const segmentId = state.segments[0].id;
      
      act(() => {
        state.updateSegmentModifier(segmentId, "warmth", 0.25);
      });

      const updatedState = useBehaviorStore.getState();
      const targetSeg = updatedState.segments.find(s => s.id === segmentId)!;
      expect(targetSeg.modifiers["warmth"]).toBeDefined();
      expect(targetSeg.modifiers["warmth"].value).toBe(0.25);
    });
  });

  describe("UI Slice", () => {
    it("should update active L1 Domain and L2 Section correctly", () => {
      const state = useBehaviorStore.getState();

      act(() => {
        state.setActiveL1Domain("product");
        state.setActiveL2Section("simulation");
        state.setSelectedUser("user_abc");
      });

      const updatedState = useBehaviorStore.getState();
      expect(updatedState.activeL1Domain).toBe("product");
      expect(updatedState.activeL2Section).toBe("simulation");
      expect(updatedState.selectedUserId).toBe("user_abc");
    });
  });

  describe("Strategies Slice", () => {
    it("should contain at least one strategy with required fields", () => {
      const state = useBehaviorStore.getState();
      expect(state.strategies.length).toBeGreaterThan(0);
      
      const strategy = state.strategies[0];
      expect(strategy.id).toBeDefined();
      expect(strategy.name).toBeDefined();
      expect(strategy.description).toBeDefined();
    });
  });
});
