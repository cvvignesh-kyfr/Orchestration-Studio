import { StateCreator } from "zustand";
import { BehaviorState, BehavioralStrategy, AuditLog } from "../types";

const initialStrategies: BehavioralStrategy[] = [
  {
    id: "behavioral_spend_awareness",
    name: "Behavioral Spend Awareness",
    description: "Turns transaction patterns into small, non-judgmental awareness prompts that improve savings discipline.",
    intent: "Build savings consistency by helping users notice and correct repeated spend leakage.",
    bestAppliedWhen: "User shows recurring overspending, skipped budgets, or reduced savings momentum.",
    conversationalBehaviors: ["pattern_highlighting", "micro_goal_setting", "gentle_nudges"],
    compatibleStates: ["confused", "overwhelmed", "newly_onboarded"],
    compatibleJourneys: ["improve_savings_discipline", "spending_awareness", "budget_confidence"],
    family: "Financial Intelligence Strategies",
    owner: "Product Squad"
  },
  {
    id: "progressive_disclosure",
    name: "Progressive Disclosure",
    description: "Hides detailed compliance checklists and non-essential inputs until explicitly required by the user.",
    intent: "Reduce immediate cognitive load and prevent premature abandonment.",
    bestAppliedWhen: "User is overwhelmed, comparing too many options, or facing high behavioral friction.",
    conversationalBehaviors: ["simplify_explanations", "hide_advanced_options", "break_into_steps"],
    compatibleStates: ["overwhelmed", "confused", "decision_fatigue", "high_cognitive_load"],
    compatibleJourneys: ["troubleshooting", "decision_support", "onboarding"],
    family: "Cognitive Reduction Strategies",
    owner: "Product Squad"
  },
  {
    id: "evidence_layering",
    name: "Evidence Layering",
    description: "Surfaces verifiable facts, community statistics, and compliance certificates dynamically.",
    intent: "Build trust by directly addressing skepticism with objective proof.",
    bestAppliedWhen: "User hesitates at commitment boundaries or questions system motives.",
    conversationalBehaviors: ["cite_sources", "show_social_proof", "highlight_compliance"],
    compatibleStates: ["skeptical", "distrustful", "hesitant", "risk_assessing"],
    compatibleJourneys: ["trust_building", "activation", "evaluation"],
    family: "Trust Strategies",
    owner: "Product Squad"
  },
  {
    id: "reassurance_loops",
    name: "Reassurance Loops",
    description: "Injects empathetic validation statements prior to giving instructions.",
    intent: "De-escalate anxiety and validate emotional friction before demanding action.",
    bestAppliedWhen: "User encounters errors, system latency, or displays negative sentiment.",
    conversationalBehaviors: ["validate_emotion", "slow_pacing", "normalize_difficulty"],
    compatibleStates: ["anxious", "frustrated", "emotionally_sensitive", "stuck"],
    compatibleJourneys: ["recovery", "troubleshooting", "reengagement"],
    family: "Emotional Regulation Strategies",
    owner: "Product Squad"
  },
  {
    id: "momentum_building",
    name: "Momentum Building",
    description: "Accelerates interactions by pre-filling data, auto-advancing, and celebrating micro-wins.",
    intent: "Capitalize on high intent to drive rapid journey progression.",
    bestAppliedWhen: "User is actively engaged, highly motivated, or nearing a positive commitment.",
    conversationalBehaviors: ["accelerate_pacing", "celebrate_wins", "remove_friction_steps"],
    compatibleStates: ["highly_motivated", "excited", "momentum_building", "activation_ready"],
    compatibleJourneys: ["activation", "upsell", "habit_formation"],
    family: "Motivation Strategies",
    owner: "Product Squad"
  }
];

export interface StrategiesSlice {
  strategies: BehavioralStrategy[];
  selectedStrategyId: string;
  createStrategy: (strategy: BehavioralStrategy) => void;
  deleteStrategy: (id: string) => void;
  updateStrategy: (id: string, updates: Partial<BehavioralStrategy>) => void;
  setSelectedStrategy: (id: string) => void;
}

export const createStrategiesSlice: StateCreator<
  BehaviorState,
  [],
  [],
  StrategiesSlice
> = (set) => ({
  strategies: initialStrategies,
  selectedStrategyId: "chunking",

  setSelectedStrategy: (id) => set({ selectedStrategyId: id }),

  createStrategy: (strategy) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Author",
        actionType: "create_strategy",
        description: `Created product strategy: "${strategy.name}"`
      };
      return {
        strategies: [...state.strategies, strategy],
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  deleteStrategy: (id) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Author",
        actionType: "delete_strategy",
        description: `Deleted product strategy ID: "${id}"`
      };
      return {
        strategies: state.strategies.filter((s) => s.id !== id),
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  updateStrategy: (id, updates) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Author",
        actionType: "update_strategy",
        description: `Updated properties on strategy: "${id}"`
      };
      return {
        strategies: state.strategies.map((s) => s.id === id ? { ...s, ...updates } : s),
        auditLogs: [log, ...state.auditLogs]
      };
    })
});
