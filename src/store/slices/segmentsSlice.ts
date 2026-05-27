import { StateCreator } from "zustand";
import { BehaviorState, Segment, SegmentRule } from "../types";

const initialSegments: Segment[] = [
  {
    id: "style_supportive",
    name: "Style: Supportive Preset",
    description: "Preset tone adjustments offering soft, safe expression vectors.",
    category: "style",
    rules: [
      { field: "preferredLanguage", operator: "equals", value: "english" }
    ],
    modifiers: {
      warm: { value: 0.22 },
      concise: { value: -0.10 }
    }
  },
  {
    id: "style_analytical",
    name: "Style: Analytical Preset",
    description: "Preset tone adjustments focusing on high compliance and minimal levity.",
    category: "style",
    rules: [
      { field: "upiUsage", operator: "equals", value: "low" }
    ],
    modifiers: {
      concise: { value: 0.35 },
      friendly: { value: -0.15 }
    }
  },
  {
    id: "bangalore_urban",
    name: "Regional: Bangalore Urban",
    description: "Active regional cohort situated in Bengaluru metro centers.",
    category: "regional",
    rules: [
      { field: "location", operator: "equals", value: "Bangalore" }
    ],
    modifiers: {
      friendly: { value: 0.20 }
    }
  },
  {
    id: "india_genz",
    name: "Demographic: India Gen Z",
    description: "Under-28 age segment establishing authentic, relatable identity markers.",
    category: "demographic",
    rules: [
      { field: "age", operator: "less_than", value: "28" }
    ],
    modifiers: {
      friendly: { value: 0.20 },
      conversational: { value: 0.15 }
    }
  },
  {
    id: "mode_financial_anxiety",
    name: "Mode: Financial Anxiety Trigger",
    description: "Contextual pacing adjustment automatically activated upon stress situations.",
    category: "contextual",
    rules: [
      { field: "anxietyLevel", operator: "equals", value: "high" }
    ],
    modifiers: {
      calm: { value: 0.20 },
      concise: { value: 0.15 }
    }
  }
];

export interface SegmentsSlice {
  segments: Segment[];
  selectedSegmentId: string;
  createSegment: (segment: Segment) => void;
  deleteSegment: (id: string) => void;
  updateSegment: (id: string, name: string, description: string, category: Segment["category"]) => void;
  addSegmentRule: (segmentId: string, rule: SegmentRule) => void;
  deleteSegmentRule: (segmentId: string, ruleIndex: number) => void;
  updateSegmentModifier: (segmentId: string, primitiveId: string, value: number) => void;
  setSelectedSegment: (id: string) => void;
}

export const createSegmentsSlice: StateCreator<
  BehaviorState,
  [],
  [],
  SegmentsSlice
> = (set) => ({
  segments: initialSegments,
  selectedSegmentId: "india_genz",

  setSelectedSegment: (id) => set({ selectedSegmentId: id }),

  createSegment: (segment) =>
    set((state) => ({
      segments: [...state.segments, segment]
    })),

  deleteSegment: (id) =>
    set((state) => ({
      segments: state.segments.filter((s) => s.id !== id)
    })),

  updateSegment: (id, name, description, category) =>
    set((state) => ({
      segments: state.segments.map((s) => s.id === id ? { ...s, name, description, category } : s)
    })),

  addSegmentRule: (segmentId, rule) =>
    set((state) => ({
      segments: state.segments.map((s) => s.id === segmentId ? { ...s, rules: [...s.rules, rule] } : s)
    })),

  deleteSegmentRule: (segmentId, ruleIndex) =>
    set((state) => ({
      segments: state.segments.map((s) => 
        s.id === segmentId 
          ? { ...s, rules: s.rules.filter((_, idx) => idx !== ruleIndex) } 
          : s
      )
    })),

  updateSegmentModifier: (segmentId, primitiveId, value) =>
    set((state) => {
      const segments = state.segments.map((s) => {
        if (s.id === segmentId) {
          return {
            ...s,
            modifiers: {
              ...s.modifiers,
              [primitiveId]: { value }
            }
          };
        }
        return s;
      });
      return { segments };
    })
});
