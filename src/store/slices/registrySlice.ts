import { StateCreator } from "zustand";
import { 
  BehaviorState, UserState, RuntimeResolution, Journey, Tool, Capability, Artifact, 
  ExecutionSemanticsRegistry, CapabilityContractsRegistry, GovernanceShield, 
  ForbiddenBehavior, IllegalCombination, Experiment, Organization, AuditLog, MockUser, 
  ExecutionTypeSemantic, InputContract, OutputContract, RuntimeContract
} from "../types";

const canonicalUserStates: Record<string, UserState> = {
  confused: {
    id: "confused",
    name: "Confused",
    category: "Cognitive States",
    description: "User exhibits signals of cognitive mismatch or loop execution.",
    owner: "Product",
    observableSignals: ["Repeated clarifications", "Delayed responses", "Abrupt topic switching"],
    suggestedStrategies: ["clarification_loops", "summarization", "step_by_step_guidance"],
    compatibleJourneys: ["troubleshooting", "education"],
    adaptiveGuidance: ["Reduce pacing", "Simplify choices", "Increase transparency"],
    isActive: true
  },
  skeptical: {
    id: "skeptical",
    name: "Skeptical",
    category: "Trust & Confidence States",
    description: "User questions rates, permissions, or automated steps.",
    owner: "Product",
    observableSignals: ["Reviewing privacy constraints", "Assessing security warnings"],
    suggestedStrategies: ["evidence_layering", "social_proof", "transparency_first"],
    compatibleJourneys: ["trust_building", "decision_support"],
    adaptiveGuidance: ["Increase transparency", "Validate uncertainty"],
    isActive: true
  },
  highly_motivated: {
    id: "highly_motivated",
    name: "Highly Motivated",
    category: "Motivational States",
    description: "User exhibits strong forward progress signals.",
    owner: "Product",
    observableSignals: ["Moving rapidly", "Explicit confirmation intents"],
    suggestedStrategies: ["momentum_building", "progressive_disclosure"],
    compatibleJourneys: ["activation", "upsell"],
    adaptiveGuidance: ["Accelerate pacing", "Remove friction steps"],
    isActive: true
  },
  anxious: {
    id: "anxious",
    name: "Anxious",
    category: "Emotional States",
    description: "User displays negative sentiment or rapid correction clicks.",
    owner: "Product",
    observableSignals: ["Typing all-caps", "Aggressive UI retry clicks", "Focusing on failure risks"],
    suggestedStrategies: ["reassurance", "emotional_validation", "friction_reduction"],
    compatibleJourneys: ["recovery", "troubleshooting"],
    adaptiveGuidance: ["Reduce pacing", "Validate emotional state", "Provide clear exit paths"],
    isActive: true
  },
  comparing_options: {
    id: "comparing_options",
    name: "Comparing Options",
    category: "Decision-Making States",
    description: "User is currently comparing multiple alternative solutions.",
    owner: "Product",
    observableSignals: ["Alternating between option A and B", "Reviewing loan interest schedules"],
    suggestedStrategies: ["comparison_framing", "simplify_choices", "tradeoff_structuring"],
    compatibleJourneys: ["evaluation", "decision_support"],
    adaptiveGuidance: ["Highlight key differences", "Minimize non-essential data"],
    isActive: true
  },
  passive_consumption: {
    id: "passive_consumption",
    name: "Passive Consumption",
    category: "Engagement States",
    description: "User is idle or shows minimal conversation input.",
    owner: "Product",
    observableSignals: ["Zero mouse movements", "System prompts remain unanswered"],
    suggestedStrategies: ["curiosity_expansion", "guided_exploration"],
    compatibleJourneys: ["exploration", "education"],
    adaptiveGuidance: ["Trigger interactive polls", "Provide auto-suggested questions"],
    isActive: true
  },
  overwhelmed: {
    id: "overwhelmed",
    name: "Overwhelmed",
    category: "Behavioral Friction States",
    description: "Branching options overload user's active processing window.",
    owner: "Product",
    observableSignals: ["Idle duration exceeds 90 seconds", "Scroll speed surges rapidly"],
    suggestedStrategies: ["progressive_disclosure", "cognitive_chunking", "option_reduction"],
    compatibleJourneys: ["recovery", "trust_building"],
    adaptiveGuidance: ["Clamp active navigation to max two choices", "Hide detailed checklists"],
    isActive: true
  },
  newly_onboarded: {
    id: "newly_onboarded",
    name: "Newly Onboarded",
    category: "Journey Progression States",
    description: "User has just completed initial setup and needs direction.",
    owner: "Product",
    observableSignals: ["First session", "Exploring dashboard"],
    suggestedStrategies: ["educational_scaffolding", "guided_exploration"],
    compatibleJourneys: ["onboarding", "habit_formation"],
    adaptiveGuidance: ["Show prominent next-best-action", "Celebrate completion milestone"],
    isActive: true
  }
};

const canonicalResolutions: Record<string, RuntimeResolution> = {
  intent_resolution: { id: "intent_resolution", name: "Intent Resolution Engine", category: "Signal Resolution", description: "Decodes natural language tokens into deterministic intent vectors.", status: "active" },
  environment_resolution: { id: "environment_resolution", name: "Environment Resolution Engine", category: "Context Resolution", description: "Resolves browser parameters, latency limits, and UPI state constraints.", status: "active" },
  state_scoring: { id: "state_scoring", name: "User State Scoring Core", category: "User State Resolution", description: "Computes active user state dimensions based on multi-turn analytics.", status: "active" },
  overlay_merging: { id: "overlay_merging", name: "Primitive Overlay Fusion Module", category: "Primitive Resolution", description: "Resolves global defaults with active segment modifier delta vectors.", status: "active" },
  strategy_activation: { id: "strategy_activation", name: "Strategy Activation Pipeline", category: "Strategy Resolution", description: "Triggers behavioral strategies and applies linguistic intervention templates.", status: "active" },
  tool_selection: { id: "tool_selection", name: "Tool Selection Router", category: "Tool Resolution", description: "Selects and schedules execution of verified computational tools.", status: "active" },
  response_assembly: { id: "response_assembly", name: "Response Assembly System", category: "Execution Resolution", description: "Fuses active strategic directives with tone and style overlays to emit response text.", status: "active" },
  reasoning_trace: { id: "reasoning_trace", name: "Reasoning Trace Logger", category: "Explainability Resolution", description: "Maintains full explainability tree tracing every modifier delta back to its active owner.", status: "active" },
  telemetry: { id: "telemetry", name: "Telemetry & Observability Agent", category: "Observability Resolution", description: "Streams real-time metrics, system health, and resolution traces.", status: "active" }
};

const initialShields: GovernanceShield[] = [
  {
    id: "no_emotional_manipulation",
    name: "Emotional Safety Cap",
    targetPrimitiveId: "empathetic",
    limitType: "cap",
    thresholdValue: 0.85,
    condition: "always",
    category: "Emotional Safety Constraints",
    description: "Clamps empathy levels to prevent parasitic emotional manipulation."
  },
  {
    id: "no_dark_patterns",
    name: "Dark Patterns Persuasion Cap",
    targetPrimitiveId: "social_proof_friendly",
    limitType: "cap",
    thresholdValue: 0.60,
    condition: "always",
    category: "Persuasion Constraints",
    description: "Clamps consensus-driven urgency prompts to prevent synthetic dark patterns."
  },
  {
    id: "visible_reasoning_required",
    name: "Transparency Floor",
    targetPrimitiveId: "trustworthy",
    limitType: "floor",
    thresholdValue: 0.70,
    condition: "always",
    category: "Transparency Constraints",
    description: "Forces minimum trustworthiness presentation transparency for compliance visibility."
  },
  {
    id: "human_handoff_required",
    name: "Human Handoff Cap",
    targetPrimitiveId: "expert",
    limitType: "cap",
    thresholdValue: 0.80,
    condition: "always",
    category: "Escalation Constraints",
    description: "Ensures bot doesn't pretend to have infinite expert capacity, routing to humans at bounds."
  },
  {
    id: "pii_protection",
    name: "PII Protection Shield",
    targetPrimitiveId: "conversational",
    limitType: "cap",
    thresholdValue: 0.90,
    condition: "always",
    category: "Compliance Constraints",
    description: "Forbids conversational overrides from leaking personal financial tokens."
  },
  {
    id: "traceability_required",
    name: "Traceability Minimum",
    targetPrimitiveId: "trustworthy",
    limitType: "floor",
    thresholdValue: 0.60,
    condition: "always",
    category: "Explainability Constraints",
    description: "Mandates explainability metadata logging triggers."
  }
];

const initialForbiddenBehaviors: ForbiddenBehavior[] = [
  { id: "shame", description: "Shame users for their spending habits, balance size, or banking delays.", category: "Compliance Constraints", isActive: true },
  { id: "guilt", description: "Guilt-trip users into making savings deposits or automated credit shifts.", category: "Emotional Safety Constraints", isActive: true },
  { id: "manipulate", description: "Emotionally manipulate users to take out loan products or transaction fees.", category: "Persuasion Constraints", isActive: true },
  { id: "loneliness", description: "Exploit user loneliness or boredom to artificially prolong conversation sessions.", category: "Emotional Safety Constraints", isActive: true },
  { id: "sentience", description: "Imply human sentience, consciousness, or organic identity presence.", category: "Transparency Constraints", isActive: true },
  { id: "pressure", description: "Apply aggressive psychological pressure to complete investments.", category: "Persuasion Constraints", isActive: true },
  { id: "dependency", description: "Establish synthetic relational companion dependency loops.", category: "Emotional Safety Constraints", isActive: true }
];

const initialIllegalCombinations: IllegalCombination[] = [
  {
    id: "assert_transparency",
    name: "Opaque Directional Advice",
    primitives: [
      { primitiveId: "expert", operator: "greater_than", value: 0.70 },
      { primitiveId: "trustworthy", operator: "less_than", value: 0.40 }
    ],
    explanation: "High expert posture paired with low trustworthiness creates opaque advice patterns.",
    category: "Transparency Constraints"
  },
  {
    id: "pressure_nonjudgment",
    name: "Judgmental Pressure Loop",
    primitives: [
      { primitiveId: "achievement_driven", operator: "greater_than", value: 0.60 },
      { primitiveId: "empathetic", operator: "less_than", value: 0.60 }
    ],
    explanation: "High achievement pressure paired with low empathy loops causes emotional distress.",
    category: "Emotional Safety Constraints"
  },
  {
    id: "companion_authenticity",
    name: "Artificial Relationship Bond",
    primitives: [
      { primitiveId: "coach", operator: "greater_than", value: 0.80 },
      { primitiveId: "trustworthy", operator: "less_than", value: 0.40 }
    ],
    explanation: "High coach tutoring styling paired with opaque transparency levels exploits user trust.",
    category: "Emotional Safety Constraints"
  },
  {
    id: "concise_exhaustive",
    name: "Contradictory Writing Directives",
    primitives: [
      { primitiveId: "concise", operator: "greater_than", value: 0.75 },
      { primitiveId: "exhaustive", operator: "greater_than", value: 0.75 }
    ],
    explanation: "Simultaneously forcing maximum conciseness and maximum detail creates syntactic fragmentation.",
    category: "Compliance Constraints"
  }
];

const canonicalExecutionSemanticsRegistry: ExecutionSemanticsRegistry = {
  execution_types: [
    {
      id: "calculator",
      orchestration_behavior: "Single-step deterministic execution with direct resolver dispatch.",
      execution_expectations: "Strict input validation, immediate computation, no chaining required.",
      latency_profile: "instant",
      conversational_style: "concise_result_delivery",
      state_persistence_requirements: "optional_output_persistence",
      retry_behavior: "no_retry_unless_input_fix",
      UI_rendering_hints: ["inline_result"],
      runtime_behavior: { synchronous: true, deterministic: true, stateful: false },
      input_behavior: { strict_inputs: true, conversational_collection: "optional" },
      output_behavior: { immediate_response: true, produces_artifacts: "optional" },
      persistence_behavior: { persist_outputs: "optional" },
      UX_behavior: { preferred_rendering: "inline_result" }
    },
    {
      id: "retrieval",
      orchestration_behavior: "Tool resolution required with async support and resilient fetch loop.",
      execution_expectations: "Retrieve structured data with retries and timeout guards.",
      latency_profile: "near_realtime_or_async",
      conversational_style: "status_updates_then_result",
      state_persistence_requirements: "cacheable_retrieval_output",
      retry_behavior: "bounded_exponential_backoff",
      UI_rendering_hints: ["dashboard_card", "conversational_response"],
      runtime_behavior: { asynchronous_supported: true, retries_enabled: true },
      input_behavior: { infer_missing_inputs: true },
      output_behavior: { returns_structured_data: true },
      persistence_behavior: { cacheable: true },
      UX_behavior: { loading_states_required: true }
    },
    {
      id: "analysis",
      orchestration_behavior: "Supports capability chaining and multi-tool analytical pipelines.",
      execution_expectations: "Consumes artifacts and emits insights/artifacts with explainable traces.",
      latency_profile: "near_realtime_to_batch",
      conversational_style: "insight_narration_with_evidence",
      state_persistence_requirements: "store_analysis_outputs",
      retry_behavior: "retry_failed_segment_only",
      UI_rendering_hints: ["dashboard_card", "visualization"],
      runtime_behavior: { multi_tool_execution: "supported" },
      input_behavior: { artifact_consumption: "high" },
      output_behavior: { produces_insights: true, produces_artifacts: true, produces_moments: "optional" },
      persistence_behavior: { store_analysis_outputs: true },
      UX_behavior: { visualization_friendly: true }
    },
    {
      id: "generator",
      orchestration_behavior: "Context-heavy generation using prior artifacts and user goals.",
      execution_expectations: "Creates new artifacts with quality checks and optional revision loops.",
      latency_profile: "near_realtime",
      conversational_style: "draft_present_then_refine",
      state_persistence_requirements: "versioned_outputs",
      retry_behavior: "regenerate_with_constraint_adjustments",
      UI_rendering_hints: ["editable_document", "conversational_response"],
      runtime_behavior: { llm_assisted: "supported" },
      output_behavior: { produces_new_artifacts: true },
      persistence_behavior: { version_outputs: true },
      UX_behavior: { editable_output: true }
    },
    {
      id: "workflow",
      orchestration_behavior: "State machine style step transitions with resumable checkpoints.",
      execution_expectations: "Progressive input collection and explicit transition guards.",
      latency_profile: "multi_turn_session",
      conversational_style: "guided_step_by_step",
      state_persistence_requirements: "workflow_state_required",
      retry_behavior: "retry_failed_step_then_resume",
      UI_rendering_hints: ["stepper_flow", "dashboard_card"],
      runtime_behavior: { multi_step: true, resumable: true, stateful: true },
      input_behavior: { progressive_collection: true },
      persistence_behavior: { workflow_state_required: true },
      UX_behavior: { progress_tracking: true }
    },
    {
      id: "agentic_flow",
      orchestration_behavior: "Autonomous planner with recursive decomposition and dynamic chaining.",
      execution_expectations: "Adaptive conversational execution with long-horizon continuity.",
      latency_profile: "long_running_adaptive",
      conversational_style: "continuous_coaching_dialogue",
      state_persistence_requirements: "persistent_context_required",
      retry_behavior: "self_replan_then_reexecute",
      UI_rendering_hints: ["conversational_response", "dashboard_card", "recommendation_stack"],
      runtime_behavior: { adaptive: true, recursive_planning: "supported", dynamic_capability_resolution: true },
      input_behavior: { conversational_discovery: true, contextual_memory_usage: "high" },
      output_behavior: { multi_artifact_generation: "supported", moment_generation: "high", momentum_modification: "high" },
      persistence_behavior: { persistent_context: "required" },
      UX_behavior: { conversational_continuity: "high" }
    },
    {
      id: "mutation",
      orchestration_behavior: "Validated write path with governance and idempotency protections.",
      execution_expectations: "State modifications require contract checks and audit trace.",
      latency_profile: "near_realtime",
      conversational_style: "confirmation_before_commit",
      state_persistence_requirements: "durable_write_required",
      retry_behavior: "idempotent_retry_only",
      UI_rendering_hints: ["conversational_response", "alert_banner"]
    },
    {
      id: "recommendation",
      orchestration_behavior: "Contextual filtering and ranking over candidate actions.",
      execution_expectations: "Prioritized recommendations with transparent rationale.",
      latency_profile: "near_realtime",
      conversational_style: "explain_then_suggest",
      state_persistence_requirements: "store_ranked_output_optional",
      retry_behavior: "rerank_with_updated_context",
      UI_rendering_hints: ["recommendation_stack", "dashboard_card"],
      runtime_behavior: { ranking_required: true },
      output_behavior: { prioritized_recommendations: true },
      UX_behavior: { explanation_required: true }
    },
    {
      id: "simulation",
      orchestration_behavior: "Parameter variation engine with comparative scenario execution.",
      execution_expectations: "Generate scenario branches and compare tradeoffs.",
      latency_profile: "near_realtime_to_batch",
      conversational_style: "compare_options_with_tradeoffs",
      state_persistence_requirements: "scenario_results_versioning_optional",
      retry_behavior: "rerun_with_adjusted_parameters",
      UI_rendering_hints: ["visualization", "dashboard_card"],
      runtime_behavior: { scenario_generation: true },
      output_behavior: { comparative_outputs: true },
      UX_behavior: { visualization_preferred: true }
    },
    {
      id: "decisioning",
      orchestration_behavior: "Policy-aware rule evaluation with score thresholds.",
      execution_expectations: "Deterministic decision output with explainable criteria.",
      latency_profile: "instant_to_near_realtime",
      conversational_style: "clear_decision_with_reasoning",
      state_persistence_requirements: "store_decision_trace_required",
      retry_behavior: "retry_on_data_unavailability",
      UI_rendering_hints: ["dashboard_card", "conversational_response"]
    },
    {
      id: "trigger",
      orchestration_behavior: "Event dispatch runtime for escalation and flow launching.",
      execution_expectations: "Condition check then trigger side-effecting orchestration branch.",
      latency_profile: "instant",
      conversational_style: "brief_action_confirmation",
      state_persistence_requirements: "trigger_audit_required",
      retry_behavior: "safe_replay_with_dedup",
      UI_rendering_hints: ["alert_banner", "conversational_response"]
    },
    {
      id: "notification",
      orchestration_behavior: "Routing engine decides best channel and urgency modifier.",
      execution_expectations: "Track delivery status and apply notification governance.",
      latency_profile: "instant_to_async_delivery",
      conversational_style: "short_urgency_adapted",
      state_persistence_requirements: "delivery_tracking_required",
      retry_behavior: "channel_fallback_then_retry",
      UI_rendering_hints: ["alert_banner", "conversational_response"],
      runtime_behavior: { delivery_guarantees: "configurable" },
      persistence_behavior: { delivery_tracking: true },
      UX_behavior: { urgency_modifiers_supported: true }
    }
  ],
  input_acquisition_models: [
    { id: "conversational_collection", user_interruption_behavior: "asks_targeted_questions", orchestration_impact: "blocks_until_minimum_inputs_collected", fallback_handling: "switch_to_progressive_discovery", memory_usage: "high", confidence_thresholds: "requires_explicit_user_confirmation" },
    { id: "silent_inference", user_interruption_behavior: "no_interrupt", orchestration_impact: "fast_path_execution", fallback_handling: "fallback_to_conversational_collection", memory_usage: "medium", confidence_thresholds: "only_when_confidence_above_0.85" },
    { id: "artifact_lookup", user_interruption_behavior: "no_interrupt_unless_missing", orchestration_impact: "reduces_prompting_and_latency", fallback_handling: "fallback_to_tool_lookup", memory_usage: "medium", confidence_thresholds: "artifact_freshness_and_schema_match_required" },
    { id: "tool_lookup", user_interruption_behavior: "minimal_status_updates", orchestration_impact: "external_dependency_resolution", fallback_handling: "fallback_to_cached_artifact_or_conversation", memory_usage: "low", confidence_thresholds: "tool_health_and_auth_checks_required" },
    { id: "progressive_discovery", user_interruption_behavior: "incremental_questions", orchestration_impact: "stepwise_planning", fallback_handling: "pause_and_resume_later", memory_usage: "high", confidence_thresholds: "per_step_confidence_above_0.7" },
    { id: "best_effort_execution", user_interruption_behavior: "none_until_needed", orchestration_impact: "partial_execution_permitted", fallback_handling: "graceful_degradation", memory_usage: "low", confidence_thresholds: "confidence_can_drop_to_0.55_with_disclaimer" },
    { id: "blocking_required", user_interruption_behavior: "explicit_block_and_request", orchestration_impact: "halts_plan_progression", fallback_handling: "human_handoff_or_abort", memory_usage: "low", confidence_thresholds: "requires_confidence_above_0.95_or_manual_override" }
  ],
  output_behaviors: [
    "returns_data",
    "produces_artifact",
    "produces_insight",
    "produces_recommendation",
    "modifies_state",
    "creates_moment",
    "modifies_momentum",
    "launches_followup_flow"
  ],
  orchestration_patterns: [
    "single_step_sync",
    "async_fetch_with_retry",
    "chain_execution",
    "multi_step_state_machine",
    "autonomous_agentic_planning",
    "event_driven_triggering"
  ],
  persistence_models: [
    "ephemeral_response_only",
    "cacheable_snapshot",
    "versioned_artifact",
    "workflow_checkpoint_state",
    "longitudinal_momentum_state"
  ],
  runtime_policies: [
    "latency_budget_enforcement",
    "governance_pre_execution_checks",
    "tool_health_gating",
    "cost_aware_resolution",
    "explainability_trace_required"
  ],
  interaction_models: [
    "transactional_qna",
    "guided_workflow",
    "adaptive_coaching_dialogue",
    "recommendation_review_loop"
  ],
  failure_behaviors: [
    "retry_with_same_tool",
    "fallback_tool_selection",
    "conversational_recovery",
    "partial_completion",
    "graceful_degradation",
    "human_handoff",
    "governance_escalation"
  ],
  continuation_policies: [
    "immediate_completion",
    "resumable",
    "background_execution",
    "wait_for_user_input",
    "scheduled_followup",
    "event_triggered_resume"
  ],
  UX_rendering_hints: [
    "inline_result",
    "dashboard_card",
    "conversational_response",
    "stepper_flow",
    "visualization",
    "editable_document",
    "recommendation_stack",
    "alert_banner"
  ]
};

const canonicalCapabilityContractsRegistry: CapabilityContractsRegistry = {
  input_sources: [
    "user_input",
    "artifact_lookup",
    "memory_lookup",
    "tool_lookup",
    "runtime_context",
    "derived_computation",
    "inference",
    "external_system"
  ],
  acquisition_strategies: [
    "conversational_collection",
    "progressive_collection",
    "silent_resolution",
    "best_effort_execution",
    "blocking_required",
    "deferred_collection"
  ],
  output_types: [
    "structured_data",
    "insight",
    "recommendation",
    "artifact",
    "visualization",
    "workflow_state",
    "notification",
    "action_plan",
    "moment",
    "momentum_update"
  ],
  retry_policies: ["no_retry", "retry_same_tool", "retry_alternate_tool", "exponential_backoff", "conversational_retry"],
  continuation_policies: ["immediate_completion", "resumable", "wait_for_user_input", "background_execution", "scheduled_resume", "event_triggered_resume"],
  fallback_policies: ["alternate_tool_resolution", "degraded_execution", "partial_completion", "human_handoff", "conversational_recovery"],
  input_contracts: [
    {
      id: "calculate_emi_inputs",
      capability_id: "calculate_emi",
      required_inputs: ["loan_amount", "interest_rate", "tenure_months"],
      optional_inputs: ["processing_fee"],
      input_schema: {
        loan_amount: { type: "currency" },
        interest_rate: { type: "percentage" },
        tenure_months: { type: "integer" }
      },
      validation_rules: {
        loan_amount: { min: 1000 },
        interest_rate: { min: 0 }
      },
      input_sources: {
        loan_amount: ["user_input"],
        interest_rate: ["user_input"],
        tenure_months: ["user_input"]
      },
      acquisition_strategy: { mode: "conversational_collection" },
      inference_rules: {},
      fallback_behavior: { missing_required_inputs: "block_execution" },
      confidence_thresholds: { minimum: 0.95 },
      governance_constraints: ["numeric_sanity_checks_required"],
      persistence_behavior: { persist_user_defaults: "optional" }
    },
    {
      id: "analyze_spending_inputs",
      capability_id: "analyze_spending",
      required_inputs: ["transaction_data"],
      optional_inputs: ["analysis_period"],
      input_schema: {
        transaction_data: { type: "structured_data" },
        analysis_period: { type: "date_range" }
      },
      validation_rules: {
        transaction_data: { non_empty: true }
      },
      input_sources: {
        transaction_data: ["artifact_lookup", "tool_lookup"],
        analysis_period: ["inference", "user_input"]
      },
      acquisition_strategy: { mode: "silent_resolution" },
      inference_rules: {
        analysis_period: { default: "last_30_days" }
      },
      fallback_behavior: {
        missing_transaction_data: { invoke_capability: "fetch_financial_data" }
      },
      confidence_thresholds: { analysis_period_inference: 0.7 },
      governance_constraints: ["pii_validation_required"],
      persistence_behavior: { persist_last_period: true }
    },
    {
      id: "financial_coach_inputs",
      capability_id: "financial_coach",
      required_inputs: ["user_goal"],
      optional_inputs: ["risk_appetite", "spending_behavior", "savings_goal"],
      input_schema: {
        user_goal: { type: "text" },
        risk_appetite: { type: "enum" },
        spending_behavior: { type: "artifact_ref" },
        savings_goal: { type: "currency_target" }
      },
      validation_rules: {
        user_goal: { min_length: 3 }
      },
      input_sources: {
        user_goal: ["user_input"],
        risk_appetite: ["memory_lookup", "inference"],
        spending_behavior: ["artifact_lookup"]
      },
      acquisition_strategy: { mode: "progressive_collection" },
      inference_rules: {
        infer_risk_appetite: { enabled: true }
      },
      fallback_behavior: {
        low_confidence: { ask_followup_question: "true" }
      },
      confidence_thresholds: { inference_minimum: 0.75 },
      governance_constraints: ["sensitive_coaching_guardrails_required"],
      persistence_behavior: { persist_goal_context: true }
    }
  ],
  output_contracts: [
    {
      id: "analyze_spending_outputs",
      capability_id: "analyze_spending",
      output_types: ["insight", "visualization", "artifact"],
      output_schema: {
        spend_profile: { type: "artifact_ref" },
        transaction_summary: { type: "artifact_ref" },
        insight_blocks: { type: "array" }
      },
      produced_artifacts: ["transaction_summary", "spend_profile"],
      produced_moments: ["overspending_alert"],
      modified_momentum: ["savings_momentum"],
      persistence_rules: { persist_transaction_summary: true },
      rendering_hints: { preferred: ["dashboard_card", "visualization"] },
      downstream_dependencies: ["generate_budget_plan", "generate_savings_recommendations"],
      governance_classification: { financial_data: true }
    },
    {
      id: "generate_budget_plan_outputs",
      capability_id: "generate_budget_plan",
      output_types: ["recommendation", "artifact", "action_plan"],
      output_schema: {
        budget_plan: { type: "artifact_ref" },
        recommendation_plan: { type: "artifact_ref" },
        actions: { type: "array" }
      },
      produced_artifacts: ["budget_plan", "recommendation_plan"],
      produced_moments: ["goal_commitment_detected"],
      modified_momentum: ["financial_discipline_momentum"],
      persistence_rules: { persist_budget_versions: true },
      rendering_hints: { preferred: ["editable_document"] },
      downstream_dependencies: ["financial_coach", "summarize_financial_health"],
      governance_classification: { financial_planning: true }
    },
    {
      id: "financial_coach_outputs",
      capability_id: "financial_coach",
      output_types: ["recommendation", "structured_data", "momentum_update"],
      output_schema: {
        coaching_response: { type: "text" },
        coaching_plan: { type: "artifact_ref" },
        momentum_delta: { type: "object" }
      },
      produced_artifacts: ["coaching_plan"],
      produced_moments: ["trust_breakthrough", "hesitation_detected"],
      modified_momentum: ["trust_momentum", "engagement_momentum"],
      persistence_rules: { persist_conversation_context: true },
      rendering_hints: { preferred: ["conversational_response", "dashboard_card"] },
      downstream_dependencies: ["generate_savings_recommendations"],
      governance_classification: { advisory_content: true }
    }
  ],
  runtime_contracts: [
    {
      id: "fetch_financial_data_runtime",
      capability_id: "fetch_financial_data",
      execution_semantic: "retrieval",
      orchestration_policy: { asynchronous_supported: true },
      retry_policy: { strategy: "retry_alternate_tool" },
      timeout_policy: { max_timeout_ms: 15000 },
      fallback_policy: { strategy: "degraded_execution" },
      continuation_policy: { mode: "background_execution" },
      concurrency_policy: { max_parallel_tools: 2 },
      observability: { logs: true, traces: true },
      governance_bindings: { pii_validation_required: true },
      persistence_contract: { cache_response: true },
      failure_behavior: { fallback: "partial_completion" },
      execution_priority: "high"
    },
    {
      id: "onboarding_flow_runtime",
      capability_id: "onboarding_flow",
      execution_semantic: "workflow",
      orchestration_policy: { multi_step: true, resumable: true },
      retry_policy: { strategy: "retry_same_tool" },
      timeout_policy: { max_timeout_ms: 30000 },
      fallback_policy: { strategy: "conversational_recovery" },
      continuation_policy: { mode: "wait_for_user_input" },
      concurrency_policy: { max_parallel_steps: 1 },
      observability: { logs: true, metrics: true },
      governance_bindings: { consent_required: true },
      persistence_contract: { persist_workflow_state: true },
      failure_behavior: { fallback: "human_handoff" },
      execution_priority: "high"
    },
    {
      id: "financial_coach_runtime",
      capability_id: "financial_coach",
      execution_semantic: "agentic_flow",
      orchestration_policy: { recursive_planning: "enabled", dynamic_capability_resolution: "enabled" },
      retry_policy: { strategy: "conversational_retry" },
      timeout_policy: { max_timeout_ms: 45000 },
      fallback_policy: { strategy: "conversational_recovery" },
      continuation_policy: { mode: "resumable" },
      concurrency_policy: { max_parallel_chains: 3 },
      observability: { logs: true, traces: true, orchestration_debugging: true },
      governance_bindings: { advisory_guardrails_required: true },
      persistence_contract: { persistent_context_required: true },
      failure_behavior: { fallback: "conversational_recovery" },
      execution_priority: "critical"
    }
  ],
  validation_rules: [
    "missing_inputs_validation",
    "invalid_outputs_validation",
    "governance_violations_validation",
    "artifact_corruption_validation",
    "unresolved_capabilities_validation",
    "failed_tool_resolution_validation"
  ],
  resolution_policies: [
    "capability_dependency_resolution",
    "tool_resolution_priority_order",
    "input_source_precedence",
    "confidence_weighted_resolution"
  ],
  state_persistence_contracts: [
    "artifact_persistence_rules",
    "workflow_checkpointing_rules",
    "context_memory_retention_rules",
    "momentum_state_update_rules"
  ],
  governance_bindings: [
    "pre_execution_guardrail_checks",
    "pii_handling_requirements",
    "explainability_trace_requirements",
    "escalation_threshold_bindings"
  ],
  continuation_contracts: [
    "resume_token_contract",
    "background_job_resume_contract",
    "event_triggered_resume_contract",
    "user_prompt_resume_contract"
  ]
};

const canonicalCapabilities: Capability[] = [
  {
    id: "notify_user", name: "User Notification Gateway", description: "Proactively triggers messages, alerts, and notifications.", category: "communication", execution_type: "notification", required_inputs: ["userId", "message"], optional_inputs: ["channel"], input_sources: { userId: ["runtime_context"] }, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["delivery_status"], required_artifacts: [], produced_artifacts: [], produced_moments: [], modified_momentum: [], implemented_by_tools: ["whatsapp_api", "email_service", "notification_router"], implemented_by_actions: ["whatsapp_api.send_message", "whatsapp_api.send_template", "whatsapp_api.send_media", "email_service.send_email", "notification_router.route_notification"], governance_constraints: ["Check communication rate limit policy"], permissions_required: ["send_notifications"], fallback_capabilities: [], priority: "high", latency_tier: "instant", cost_tier: "low"
  },
  {
    id: "fetch_financial_data", name: "Fetch Financial Data", description: "Connects to bank accounts or parses inputs to acquire transaction summaries.", category: "financial_data", execution_type: "retrieval", required_inputs: ["userId"], optional_inputs: ["consentId", "timeframe"], input_sources: { userId: ["runtime_context"] }, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["transaction_summary"], required_artifacts: [], produced_artifacts: ["transaction_summary"], produced_moments: [], modified_momentum: [], implemented_by_tools: ["aa_provider"], implemented_by_actions: ["aa_provider.fetch_accounts", "aa_provider.fetch_transactions", "aa_provider.fetch_balances"], governance_constraints: ["Verify customer AA consent status", "Audit data confidentiality laws"], permissions_required: ["read_financial_data"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "low"
  },
  {
    id: "analyze_spending", name: "Analyze Spending", description: "Evaluates discretionary transactions, recurring leaks, and budget outflows.", category: "financial_intelligence", execution_type: "analysis", required_inputs: ["transaction_summary"], optional_inputs: [], input_sources: { transaction_summary: ["artifact"] }, missing_input_strategy: { mode: "best_effort_execution" }, output_types: ["spend_profile"], required_artifacts: ["transaction_summary"], produced_artifacts: ["spend_profile", "transaction_summary"], produced_moments: ["overspending_alert"], modified_momentum: ["savings_momentum"], implemented_by_tools: ["aa_provider", "transaction_engine", "spend_ai"], implemented_by_actions: ["aa_provider.fetch_transactions", "transaction_engine.normalize_transactions", "spend_ai.categorize_transactions", "spend_ai.generate_spend_summary"], governance_constraints: ["Perform PII scanning on transaction notes"], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "medium", latency_tier: "near_realtime", cost_tier: "high"
  },
  {
    id: "generate_budget_plan", name: "Generate Budget Plan", description: "Generates optimal budget plan options aligning with income.", category: "financial_planning", execution_type: "generator", required_inputs: ["monthly_income", "fixed_expenses", "savings_goal"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["recommendation", "artifact"], required_artifacts: ["spend_profile"], produced_artifacts: ["budget_plan"], produced_moments: [], modified_momentum: ["savings_momentum"], implemented_by_tools: ["budgeting_engine", "recommendation_engine"], implemented_by_actions: ["budgeting_engine.create_budget_plan", "recommendation_engine.generate_recommendations"], governance_constraints: ["Verify risk profile threshold limits"], permissions_required: ["generate_advice"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "low"
  },
  {
    id: "categorize_transactions", name: "Categorize Transactions", description: "Categorizes raw transactions into semantic buckets.", category: "financial_intelligence", execution_type: "analysis", required_inputs: ["transaction_summary"], optional_inputs: [], input_sources: { transaction_summary: ["artifact"] }, missing_input_strategy: { mode: "best_effort_execution" }, output_types: ["transaction_summary"], required_artifacts: ["transaction_summary"], produced_artifacts: ["transaction_summary"], produced_moments: [], modified_momentum: [], implemented_by_tools: ["spend_ai"], implemented_by_actions: ["spend_ai.categorize_transactions"], governance_constraints: [], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "high"
  },
  {
    id: "detect_financial_risk", name: "Detect Financial Risk", description: "Detects financial risks and predicts defaults.", category: "risk", execution_type: "decisioning", required_inputs: ["spend_profile"], optional_inputs: [], input_sources: { spend_profile: ["artifact"] }, missing_input_strategy: { mode: "best_effort_execution" }, output_types: ["risk_assessment"], required_artifacts: ["spend_profile"], produced_artifacts: ["risk_assessment"], produced_moments: ["financial_anxiety_detected"], modified_momentum: ["trust_momentum"], implemented_by_tools: ["risk_engine"], implemented_by_actions: ["risk_engine.calculate_risk_score", "risk_engine.detect_risk_pattern"], governance_constraints: [], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "high"
  },
  {
    id: "calculate_emi", name: "Calculate EMI", description: "Calculates EMI for given loan amount, tenure, and interest.", category: "calculator", execution_type: "calculator", required_inputs: ["principal", "interest_rate", "tenure"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["calculator_result"], required_artifacts: [], produced_artifacts: [], produced_moments: [], modified_momentum: [], implemented_by_tools: ["calculator_engine"], implemented_by_actions: ["calculator_engine.calculate_emi"], governance_constraints: [], permissions_required: [], fallback_capabilities: [], priority: "low", latency_tier: "instant", cost_tier: "free"
  },
  {
    id: "compare_loan_options", name: "Compare Loan Options", description: "Simulates multiple loan scenarios.", category: "financial_planning", execution_type: "simulation", required_inputs: ["loan_options"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["simulation_result"], required_artifacts: [], produced_artifacts: [], produced_moments: [], modified_momentum: [], implemented_by_tools: ["simulation_engine"], implemented_by_actions: ["simulation_engine.compare_loan_options"], governance_constraints: [], permissions_required: [], fallback_capabilities: [], priority: "medium", latency_tier: "instant", cost_tier: "free"
  },
  {
    id: "onboarding_flow", name: "Onboarding Flow", description: "Guides first-time users through consents and setup.", category: "onboarding", execution_type: "workflow", required_inputs: ["userId"], optional_inputs: [], input_sources: { userId: ["runtime_context"] }, missing_input_strategy: { mode: "human_handoff" }, output_types: ["onboarding_state"], required_artifacts: [], produced_artifacts: ["onboarding_state"], produced_moments: ["onboarding_excitement"], modified_momentum: ["onboarding_momentum"], implemented_by_tools: ["onboarding_orchestrator"], implemented_by_actions: ["onboarding_orchestrator.start_onboarding", "onboarding_orchestrator.advance_step"], governance_constraints: ["Requires explicit user agreement"], permissions_required: ["write_user_profile"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "free"
  },
  {
    id: "financial_coach", name: "Financial Coach", description: "Agentic flow for providing coaching.", category: "coaching", execution_type: "agentic_flow", required_inputs: ["user_query"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["coaching_response"], required_artifacts: [], produced_artifacts: ["coaching_plan"], produced_moments: ["trust_breakthrough", "confusion_detected", "goal_commitment_detected"], modified_momentum: ["coaching_adherence_momentum"], implemented_by_tools: ["coaching_agent"], implemented_by_actions: ["coaching_agent.generate_followup_question", "coaching_agent.create_action_plan", "coaching_agent.adjust_coaching_style"], governance_constraints: [], permissions_required: ["use_ai_copilot"], fallback_capabilities: [], priority: "medium", latency_tier: "near_realtime", cost_tier: "high"
  },
  {
    id: "generate_savings_recommendations", name: "Generate Savings Recommendations", description: "Provides personalized savings recommendations.", category: "coaching", execution_type: "recommendation", required_inputs: ["spend_profile"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["recommendations"], required_artifacts: ["spend_profile"], produced_artifacts: ["recommendation_plan"], produced_moments: ["savings_milestone_achieved", "recommendation_resistance"], modified_momentum: ["savings_momentum"], implemented_by_tools: ["recommendation_engine"], implemented_by_actions: ["recommendation_engine.generate_recommendations"], governance_constraints: [], permissions_required: ["generate_advice"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "low"
  },
  {
    id: "escalate_high_risk_user", name: "Escalate High Risk User", description: "Escalates user when high risk is detected.", category: "escalation", execution_type: "trigger", required_inputs: ["risk_assessment"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "block_execution" }, output_types: ["escalation_status"], required_artifacts: ["risk_assessment"], produced_artifacts: [], produced_moments: [], modified_momentum: ["trust_momentum"], implemented_by_tools: ["risk_engine", "notification_router"], implemented_by_actions: ["risk_engine.escalate_user", "notification_router.route_notification"], governance_constraints: [], permissions_required: ["escalate_emergencies"], fallback_capabilities: [], priority: "critical", latency_tier: "instant", cost_tier: "free"
  },
  {
    id: "summarize_financial_health", name: "Summarize Financial Health", description: "Summarizes user's overall financial health.", category: "insights", execution_type: "generator", required_inputs: ["spend_profile", "budget_plan"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "conversational_collection" }, output_types: ["financial_health_summary"], required_artifacts: ["spend_profile", "budget_plan"], produced_artifacts: ["financial_health_summary"], produced_moments: [], modified_momentum: ["financial_discipline_momentum"], implemented_by_tools: ["spend_ai", "calculator_engine"], implemented_by_actions: ["spend_ai.generate_spend_summary", "calculator_engine.calculate_savings_projection"], governance_constraints: [], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "medium", latency_tier: "near_realtime", cost_tier: "low"
  },
  {
    id: "detect_behavior_change", name: "Detect Behavior Change", description: "Detects behavioral changes based on transaction shifts.", category: "behavioral_intelligence", execution_type: "analysis", required_inputs: ["transaction_summary"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "best_effort_execution" }, output_types: ["behavioral_signals"], required_artifacts: ["transaction_summary", "spend_profile"], produced_artifacts: ["user_preference_graph"], produced_moments: ["high_confidence_detected"], modified_momentum: ["engagement_momentum"], implemented_by_tools: ["spend_ai", "behavioral_signal_engine"], implemented_by_actions: ["spend_ai.detect_behavior_change", "behavioral_signal_engine.detect_confidence"], governance_constraints: [], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "high", latency_tier: "near_realtime", cost_tier: "high"
  },
  {
    id: "generate_spend_insights", name: "Generate Spend Insights", description: "Generates actionable spend insights.", category: "insights", execution_type: "analysis", required_inputs: ["spend_profile"], optional_inputs: [], input_sources: {}, missing_input_strategy: { mode: "best_effort_execution" }, output_types: ["insights"], required_artifacts: ["spend_profile"], produced_artifacts: ["transaction_summary"], produced_moments: ["overspending_alert"], modified_momentum: ["financial_discipline_momentum"], implemented_by_tools: ["spend_ai"], implemented_by_actions: ["spend_ai.generate_spend_summary", "spend_ai.detect_overspending"], governance_constraints: [], permissions_required: ["run_analytics"], fallback_capabilities: [], priority: "medium", latency_tier: "near_realtime", cost_tier: "high"
  }
];

const canonicalTools: Tool[] = [
  {
    id: "whatsapp_api", name: "whatsapp_api", description: "WhatsApp messaging API", category: "communication", status: "active", owner_team: "Communications", authentication: "Bearer", rate_limits: "100/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "whatsapp_api.send_message", tool_id: "whatsapp_api", name: "Send Message", description: "Send text message", inputs: [], outputs: [], execution_type: "notification", side_effects: "SMS sent", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "whatsapp_api.send_template", tool_id: "whatsapp_api", name: "Send Template", description: "Send template message", inputs: [], outputs: [], execution_type: "notification", side_effects: "SMS sent", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "whatsapp_api.send_media", tool_id: "whatsapp_api", name: "Send Media", description: "Send media message", inputs: [], outputs: [], execution_type: "notification", side_effects: "SMS sent", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "Sends external notifications", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/whatsapp", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 100
  },
  {
    id: "email_service", name: "email_service", description: "Email delivery service", category: "communication", status: "active", owner_team: "Communications", authentication: "Bearer", rate_limits: "100/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "email_service.send_email", tool_id: "email_service", name: "Send Email", description: "Send email message", inputs: [], outputs: [], execution_type: "notification", side_effects: "Email sent", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "Sends email notifications", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/email", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 100
  },
  {
    id: "notification_router", name: "notification_router", description: "Routes notifications", category: "orchestration", status: "active", owner_team: "Platform", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "free", actions: [
      { id: "notification_router.route_notification", tool_id: "notification_router", name: "Route Notification", description: "Route notification", inputs: [], outputs: [], execution_type: "notification", side_effects: "Push notification", timeout_ms: 100, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "Device push", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/notif", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 50
  },
  {
    id: "aa_provider", name: "aa_provider", description: "Account Aggregator framework", category: "financial_data", status: "active", owner_team: "Data", authentication: "OAuth", rate_limits: "50/s", sla: "99.9%", latency_tier: "near_realtime", cost_tier: "low", actions: [
      { id: "aa_provider.fetch_accounts", tool_id: "aa_provider", name: "Fetch Accounts", description: "Fetch user accounts", inputs: [], outputs: [], execution_type: "retrieval", side_effects: "None", timeout_ms: 5000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "aa_provider.fetch_transactions", tool_id: "aa_provider", name: "Fetch Transactions", description: "Fetch transactions", inputs: [], outputs: [], execution_type: "retrieval", side_effects: "None", timeout_ms: 5000, retryable: true, produces_artifacts: ["transaction_summary"], consumes_artifacts: [], governance_requirements: [] },
      { id: "aa_provider.fetch_balances", tool_id: "aa_provider", name: "Fetch Balances", description: "Fetch account balances", inputs: [], outputs: [], execution_type: "retrieval", side_effects: "None", timeout_ms: 5000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: ["read_financial_data"], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/aa", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 400
  },
  {
    id: "transaction_engine", name: "transaction_engine", description: "Transaction processing engine", category: "financial_processing", status: "active", owner_team: "Data", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "transaction_engine.normalize_transactions", tool_id: "transaction_engine", name: "Normalize Transactions", description: "Normalize transaction data", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "transaction_engine.detect_recurring_expenses", tool_id: "transaction_engine", name: "Detect Recurring Expenses", description: "Detect subscriptions", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/tx", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 100
  },
  {
    id: "spend_ai", name: "spend_ai", description: "AI engine for spending analysis", category: "intelligence", status: "active", owner_team: "AI Core", authentication: "Internal", rate_limits: "100/s", sla: "99.9%", latency_tier: "near_realtime", cost_tier: "high", actions: [
      { id: "spend_ai.categorize_transactions", tool_id: "spend_ai", name: "Categorize Transactions", description: "Categorize spending", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: ["spend_profile"], consumes_artifacts: ["transaction_summary"], governance_requirements: [] },
      { id: "spend_ai.generate_spend_summary", tool_id: "spend_ai", name: "Generate Spend Summary", description: "Summarize spending", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "spend_ai.detect_overspending", tool_id: "spend_ai", name: "Detect Overspending", description: "Detect overspending", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "spend_ai.detect_behavior_change", tool_id: "spend_ai", name: "Detect Behavior Change", description: "Detect behavior change", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/spendai", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 300
  },
  {
    id: "recommendation_engine", name: "recommendation_engine", description: "Recommendation engine", category: "recommendations", status: "active", owner_team: "Data", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "recommendation_engine.generate_recommendations", tool_id: "recommendation_engine", name: "Generate Recommendations", description: "Generate insights", inputs: [], outputs: [], execution_type: "generator", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: ["recommendation_plan"], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/recs", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 150
  },
  {
    id: "risk_engine", name: "risk_engine", description: "Risk and compliance engine", category: "risk", status: "active", owner_team: "Risk", authentication: "Internal", rate_limits: "100/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "risk_engine.calculate_risk_score", tool_id: "risk_engine", name: "Calculate Risk Score", description: "Calculate risk", inputs: [], outputs: [], execution_type: "decisioning", side_effects: "None", timeout_ms: 500, retryable: true, produces_artifacts: ["risk_assessment"], consumes_artifacts: [], governance_requirements: [] },
      { id: "risk_engine.detect_risk_pattern", tool_id: "risk_engine", name: "Detect Risk Pattern", description: "Detect patterns", inputs: [], outputs: [], execution_type: "decisioning", side_effects: "None", timeout_ms: 500, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "risk_engine.escalate_user", tool_id: "risk_engine", name: "Escalate User", description: "Escalate high risk", inputs: [], outputs: [], execution_type: "trigger", side_effects: "Triggers escalation workflow", timeout_ms: 500, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/risk", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 100
  },
  {
    id: "budgeting_engine", name: "budgeting_engine", description: "Budget calculation engine", category: "planning", status: "active", owner_team: "Core", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "budgeting_engine.create_budget_plan", tool_id: "budgeting_engine", name: "Create Budget Plan", description: "Create budget", inputs: [], outputs: [], execution_type: "generator", side_effects: "None", timeout_ms: 100, retryable: true, produces_artifacts: ["budget_plan"], consumes_artifacts: [], governance_requirements: [] },
      { id: "budgeting_engine.optimize_budget", tool_id: "budgeting_engine", name: "Optimize Budget", description: "Optimize budget", inputs: [], outputs: [], execution_type: "generator", side_effects: "None", timeout_ms: 100, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/budget", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 50
  },
  {
    id: "onboarding_orchestrator", name: "onboarding_orchestrator", description: "Onboarding workflow engine", category: "onboarding", status: "active", owner_team: "Core", authentication: "Internal", rate_limits: "100/s", sla: "99.9%", latency_tier: "near_realtime", cost_tier: "low", actions: [
      { id: "onboarding_orchestrator.start_onboarding", tool_id: "onboarding_orchestrator", name: "Start Onboarding", description: "Start flow", inputs: [], outputs: [], execution_type: "workflow", side_effects: "Creates user state", timeout_ms: 1000, retryable: true, produces_artifacts: ["onboarding_state"], consumes_artifacts: [], governance_requirements: [] },
      { id: "onboarding_orchestrator.advance_step", tool_id: "onboarding_orchestrator", name: "Advance Step", description: "Advance flow", inputs: [], outputs: [], execution_type: "workflow", side_effects: "Updates user state", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "onboarding_orchestrator.complete_onboarding", tool_id: "onboarding_orchestrator", name: "Complete Onboarding", description: "Complete flow", inputs: [], outputs: [], execution_type: "workflow", side_effects: "Finalizes user state", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "Modifies user state", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/onboarding", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 100
  },
  {
    id: "coaching_agent", name: "coaching_agent", description: "Agentic coaching system", category: "agentic_runtime", status: "active", owner_team: "AI Core", authentication: "Internal", rate_limits: "50/s", sla: "99.9%", latency_tier: "near_realtime", cost_tier: "high", actions: [
      { id: "coaching_agent.generate_followup_question", tool_id: "coaching_agent", name: "Generate Followup Question", description: "Generate prompt", inputs: [], outputs: [], execution_type: "agentic_flow", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "coaching_agent.create_action_plan", tool_id: "coaching_agent", name: "Create Action Plan", description: "Create plan", inputs: [], outputs: [], execution_type: "agentic_flow", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: ["coaching_plan"], consumes_artifacts: [], governance_requirements: [] },
      { id: "coaching_agent.adjust_coaching_style", tool_id: "coaching_agent", name: "Adjust Coaching Style", description: "Adjust style", inputs: [], outputs: [], execution_type: "agentic_flow", side_effects: "None", timeout_ms: 2000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/coach", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 300
  },
  {
    id: "calculator_engine", name: "calculator_engine", description: "Utility calculations", category: "utilities", status: "active", owner_team: "Platform", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "free", actions: [
      { id: "calculator_engine.calculate_emi", tool_id: "calculator_engine", name: "Calculate EMI", description: "Calculate EMI", inputs: [], outputs: [], execution_type: "calculator", side_effects: "None", timeout_ms: 100, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "calculator_engine.calculate_savings_projection", tool_id: "calculator_engine", name: "Calculate Savings Projection", description: "Project savings", inputs: [], outputs: [], execution_type: "calculator", side_effects: "None", timeout_ms: 100, retryable: true, produces_artifacts: ["savings_projection"], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/calc", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 50
  },
  {
    id: "simulation_engine", name: "simulation_engine", description: "Financial simulator", category: "simulation", status: "active", owner_team: "Platform", authentication: "Internal", rate_limits: "100/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "simulation_engine.compare_loan_options", tool_id: "simulation_engine", name: "Compare Loan Options", description: "Compare options", inputs: [], outputs: [], execution_type: "simulation", side_effects: "None", timeout_ms: 500, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "simulation_engine.simulate_budget_scenarios", tool_id: "simulation_engine", name: "Simulate Budget Scenarios", description: "Simulate budgets", inputs: [], outputs: [], execution_type: "simulation", side_effects: "None", timeout_ms: 500, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/sim", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 150
  },
  {
    id: "memory_store", name: "memory_store", description: "User context memory", category: "memory", status: "active", owner_team: "Data", authentication: "Internal", rate_limits: "1000/s", sla: "99.9%", latency_tier: "instant", cost_tier: "low", actions: [
      { id: "memory_store.retrieve_memory", tool_id: "memory_store", name: "Retrieve Memory", description: "Get memory", inputs: [], outputs: [], execution_type: "retrieval", side_effects: "None", timeout_ms: 100, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "memory_store.store_memory", tool_id: "memory_store", name: "Store Memory", description: "Set memory", inputs: [], outputs: [], execution_type: "mutation", side_effects: "Updates database", timeout_ms: 100, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "Database writes", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/mem", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 50
  },
  {
    id: "behavioral_signal_engine", name: "behavioral_signal_engine", description: "Behavioral signal tracker", category: "behavioral_intelligence", status: "active", owner_team: "AI Core", authentication: "Internal", rate_limits: "100/s", sla: "99.9%", latency_tier: "near_realtime", cost_tier: "high", actions: [
      { id: "behavioral_signal_engine.detect_hesitation", tool_id: "behavioral_signal_engine", name: "Detect Hesitation", description: "Detect hesitation", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "behavioral_signal_engine.detect_confidence", tool_id: "behavioral_signal_engine", name: "Detect Confidence", description: "Detect confidence", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] },
      { id: "behavioral_signal_engine.detect_financial_anxiety", tool_id: "behavioral_signal_engine", name: "Detect Financial Anxiety", description: "Detect anxiety", inputs: [], outputs: [], execution_type: "analysis", side_effects: "None", timeout_ms: 1000, retryable: true, produces_artifacts: [], consumes_artifacts: [], governance_requirements: [] }
    ], permissions: [], side_effects: "None", retry_policy: "retry", observability: { logs: "", metrics: "", traces: "" }, apiEndpoint: "https://api.internal/beh", inputSchema: "{}", outputSchema: "{}", latencyBenchmarkMs: 200
  }
];

const canonicalArtifacts: Artifact[] = [
  { id: "spend_profile", name: "Spend Profile", description: "User's spending habits", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "budget_plan", name: "Budget Plan", description: "User's budget allocation", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "transaction_summary", name: "Transaction Summary", description: "Summarized banking transactions", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "onboarding_state", name: "Onboarding State", description: "Tracks onboarding progress", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "recommendation_plan", name: "Recommendation Plan", description: "List of personalized actions", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "financial_health_summary", name: "Financial Health Summary", description: "Overall holistic health", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "risk_assessment", name: "Risk Assessment", description: "Vulnerability and risk exposure", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "coaching_plan", name: "Coaching Plan", description: "Structured behavioral goals", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "user_preference_graph", name: "User Preference Graph", description: "Contextual affinity matrix", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "savings_projection", name: "Savings Projection", description: "Forward looking balances", category: "persistent", family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "financial_anxiety_detected", name: "Financial Anxiety Detected", description: "Detected stress spike while reviewing liabilities or unexpected debits.", category: "moment", trigger_conditions: "Anxiety phrases, rapid back-and-forth on risk screens, and delayed confirmations", ttl: "20m", behavioral_significance: "Switch to reassurance-first execution with reduced cognitive load.", influences: { strategies: ["reassurance_loops"], tactics: ["risk_reframing"], tone: ["empathetic"], journeys: ["budget_confidence"], pacing: ["slower_pacing"] }, influenced_strategies: ["reassurance_loops", "progressive_disclosure"], influenced_tactics: ["risk_reframing", "one_step_guidance"], tone_modifiers: ["calm", "reassuring"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "onboarding_excitement", name: "Onboarding Excitement", description: "User is progressing rapidly through consent and setup tasks.", category: "moment", trigger_conditions: "Fast completion of onboarding steps and low hesitation dwell time", ttl: "15m", behavioral_significance: "Increase pacing while preserving compliance checks.", influences: { strategies: ["momentum_building"], tactics: ["smart_prefill"], tone: ["encouraging"], journeys: ["improve_savings_discipline"], pacing: ["faster_pacing"] }, influenced_strategies: ["momentum_building"], influenced_tactics: ["smart_prefill", "micro_celebration"], tone_modifiers: ["encouraging"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "hesitation_detected", name: "Hesitation Detected", description: "User pauses repeatedly before committing to a recommendation or plan.", category: "moment", trigger_conditions: "Long dwell on CTA, repeated reopen of detail panes, unresolved clarification asks", ttl: "30m", behavioral_significance: "Introduce smaller commitment steps and explicit tradeoff clarity.", influences: { strategies: ["progressive_disclosure"], tactics: ["clarification_prompt"], tone: ["patient"], journeys: ["large_purchase_evaluation"], pacing: ["slower_pacing"] }, influenced_strategies: ["progressive_disclosure", "evidence_layering"], influenced_tactics: ["clarification_prompt", "micro_commitment"], tone_modifiers: ["patient"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "trust_breakthrough", name: "Trust Breakthrough", description: "User demonstrates trust by sharing sensitive financial context.", category: "moment", trigger_conditions: "Linked account success, consent refresh completion, explicit trust statements", ttl: "2h", behavioral_significance: "Safely deepen personalization and coaching depth.", influences: { strategies: ["evidence_layering"], tactics: ["affirmation"], tone: ["warm"], journeys: ["hesitation_to_commitment"], pacing: ["normal_pacing"] }, influenced_strategies: ["evidence_layering", "momentum_building"], influenced_tactics: ["affirmation", "next_best_action"], tone_modifiers: ["warm", "trustworthy"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "savings_milestone_achieved", name: "Savings Milestone Achieved", description: "User crossed a meaningful savings milestone against plan.", category: "moment", trigger_conditions: "Savings projection checkpoint reached and verified contribution streak", ttl: "24h", behavioral_significance: "Reinforce discipline loop and expand next achievable target.", influences: { strategies: ["momentum_building"], tactics: ["milestone_celebration"], tone: ["celebratory"], journeys: ["improve_savings_discipline"], pacing: ["faster_pacing"] }, influenced_strategies: ["momentum_building", "behavioral_spend_awareness"], influenced_tactics: ["milestone_celebration", "goal_laddering"], tone_modifiers: ["celebratory"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "overspending_alert", name: "Overspending Alert", description: "Spending velocity exceeded adaptive budget threshold for current cycle.", category: "moment", trigger_conditions: "Category spend crosses dynamic threshold versus plan within billing cycle", ttl: "3h", behavioral_significance: "Activate intervention and spending awareness workflows.", influences: { strategies: ["behavioral_spend_awareness"], tactics: ["category_guardrail"], tone: ["serious"], journeys: ["improve_savings_discipline", "spending_awareness"], pacing: ["normal_pacing"] }, influenced_strategies: ["behavioral_spend_awareness", "progressive_disclosure"], influenced_tactics: ["category_guardrail", "spend_pause_prompt"], tone_modifiers: ["clear", "non_judgmental"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "confusion_detected", name: "Confusion Detected", description: "User is unable to map recommendations to concrete action.", category: "moment", trigger_conditions: "Repeated clarification asks and reversal of completed steps", ttl: "20m", behavioral_significance: "Simplify output structure and reduce option branching.", influences: { strategies: ["progressive_disclosure"], tactics: ["step_by_step"], tone: ["clear"], journeys: ["budget_confidence"], pacing: ["slower_pacing"] }, influenced_strategies: ["progressive_disclosure"], influenced_tactics: ["step_by_step", "single_choice_prompt"], tone_modifiers: ["clear", "supportive"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "recommendation_resistance", name: "Recommendation Resistance", description: "User repeatedly rejects generated savings recommendations.", category: "moment", trigger_conditions: "Three or more consecutive recommendation dismissals in session", ttl: "24h", behavioral_significance: "Shift from prescriptive to exploratory coaching.", influences: { strategies: ["evidence_layering"], tactics: ["preference_elicitation"], tone: ["neutral"], journeys: ["improve_savings_discipline"], pacing: ["slower_pacing"] }, influenced_strategies: ["evidence_layering", "behavioral_spend_awareness"], influenced_tactics: ["preference_elicitation", "option_reframing"], tone_modifiers: ["neutral", "curious"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "high_confidence_detected", name: "High Confidence Detected", description: "User is making decisive, low-friction financial choices.", category: "moment", trigger_conditions: "Fast completion and minimal clarification overhead in decision flows", ttl: "45m", behavioral_significance: "Offer accelerated paths with optional detail expansion.", influences: { strategies: ["momentum_building"], tactics: ["fast_path"], tone: ["efficient"], journeys: ["hesitation_to_commitment"], pacing: ["faster_pacing"] }, influenced_strategies: ["momentum_building"], influenced_tactics: ["fast_path", "one_tap_confirm"], tone_modifiers: ["efficient"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "goal_commitment_detected", name: "Goal Commitment Detected", description: "User explicitly commits to a savings or budget objective.", category: "moment", trigger_conditions: "Goal confirmation with target amount and timeline set", ttl: "48h", behavioral_significance: "Start adherence tracking and scheduled accountability loops.", influences: { strategies: ["behavioral_spend_awareness"], tactics: ["accountability_nudge"], tone: ["supportive"], journeys: ["improve_savings_discipline"], pacing: ["normal_pacing"] }, influenced_strategies: ["behavioral_spend_awareness", "momentum_building"], influenced_tactics: ["accountability_nudge", "weekly_checkin"], tone_modifiers: ["supportive"], family: "Moments Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "temporary" },
  { id: "onboarding_momentum", name: "Onboarding Momentum", description: "Net momentum score for onboarding completion consistency.", category: "momentum", score_range: "0-100", contributors: ["consent_completion_speed", "step_dropoff_rate", "onboarding_excitement"], decay_rules: "Decay by 4 points per day without onboarding progress.", update_frequency: "daily", influenced_journeys: ["improve_savings_discipline", "budget_confidence"], influenced_strategies_momentum: ["momentum_building", "progressive_disclosure"], pacing_modifiers: ["accelerate_onboarding_when_score_above_70", "slowdown_when_score_below_40"], family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "savings_momentum", name: "Savings Momentum", description: "Longitudinal indicator of savings behavior consistency.", category: "momentum", score_range: "0-100", contributors: ["monthly_savings_rate", "budget_adherence", "overspending_alert", "savings_milestone_achieved"], decay_rules: "Decay by 2 points weekly when savings contribution is missed.", update_frequency: "weekly", influenced_journeys: ["improve_savings_discipline", "spending_awareness"], influenced_strategies_momentum: ["behavioral_spend_awareness", "momentum_building"], pacing_modifiers: ["increase_nudging_when_score_below_45", "shift_to_celebratory_reinforcement_when_score_above_75"], family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "trust_momentum", name: "Trust Momentum", description: "Composite trust signal across transparency and consistency touchpoints.", category: "momentum", score_range: "0-100", contributors: ["consent_acceptance", "trust_breakthrough", "recommendation_followthrough"], decay_rules: "Decay by 3 points every 14 days without positive trust interactions.", update_frequency: "biweekly", influenced_journeys: ["hesitation_to_commitment", "large_purchase_evaluation"], influenced_strategies_momentum: ["evidence_layering", "reassurance_loops"], pacing_modifiers: ["add_explainability_blocks_when_score_below_50"], family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "engagement_momentum", name: "Engagement Momentum", description: "Measures sustainable engagement quality, not just frequency.", category: "momentum", score_range: "0-100", contributors: ["session_depth", "feature_return_rate", "high_confidence_detected"], decay_rules: "Decay by 1 point per day after 3 days of inactivity.", update_frequency: "daily", influenced_journeys: ["passive_to_engaged", "improve_savings_discipline"], influenced_strategies_momentum: ["momentum_building", "behavioral_spend_awareness"], pacing_modifiers: ["trigger_reactivation_prompt_when_score_below_40"], family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" },
  { id: "goal_completion_momentum", name: "Goal Completion Momentum", description: "Measures progress toward user-committed financial goals.", category: "momentum", score_range: "0-100", contributors: ["goal_milestone_rate", "goal_commitment_detected", "savings_milestone_achieved"], decay_rules: "No passive decay; decreases only on missed critical milestone windows.", update_frequency: "monthly", influenced_journeys: ["improve_savings_discipline", "hesitation_to_commitment"], influenced_strategies_momentum: ["momentum_building", "behavioral_spend_awareness"], pacing_modifiers: ["surface_next_milestone_plan_when_score_above_60"], family: "Momentum Artifacts", apiEndpoint: "", schemaContract: "{}", lifecycleStatus: "persisted" }
];

const initialJourneys: Journey[] = [
  {
    id: "improve_savings_discipline",
    name: "Improve Savings Discipline",
    category: "Financial Intelligence",
    purpose: "Help users convert spend awareness into repeatable savings behavior.",
    commonSituations: ["month-end cash shortfall", "frequent discretionary overspend", "inconsistent savings transfers"],
    guidancePriorities: ["behavioral spend awareness", "budget calibration", "non-judgmental accountability", "momentum reinforcement"],
    guidanceStyles: ["behavioral_spend_awareness", "progressive_disclosure", "momentum_building"],
    successIndicators: ["decline in overspending alerts", "weekly savings consistency", "positive savings momentum trend"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["fetch_financial_data", "analyze_spending", "categorize_transactions", "generate_budget_plan", "generate_savings_recommendations", "summarize_financial_health"],
    preferredBehaviors: ["focus on one actionable recommendation at a time", "tie advice to observed transaction patterns", "celebrate measurable progress"],
    restrictedCapabilities: ["no autonomous money movement", "no high-pressure upsell messaging"],
    artifactsCanCreate: ["transaction_summary", "spend_profile", "budget_plan", "recommendation_plan", "financial_health_summary"],
    artifactsCanUpdate: ["savings_projection", "user_preference_graph"],
    artifactImportance: {
      transaction_summary: "primary",
      spend_profile: "primary",
      budget_plan: "primary",
      recommendation_plan: "supporting",
      financial_health_summary: "supporting",
      savings_projection: "milestone",
      user_preference_graph: "supporting"
    },
    goal: "Increase savings discipline",
    desiredMovement: "From reactive spending to proactive savings execution.",
    applicableStates: ["anxious", "confused", "highly_motivated", "newly_onboarded"],
    preferredStrategies: ["behavioral_spend_awareness", "progressive_disclosure", "momentum_building"],
    successSignals: ["decline in overspending alerts", "weekly savings consistency", "positive savings momentum trend"]
  },
  {
    id: "spending_awareness",
    name: "Spending Awareness",
    category: "Mindfulness",
    purpose: "Help users become more conscious of spending behavior.",
    commonSituations: ["impulsive spending", "recurring discretionary purchases", "unclear monthly expense patterns"],
    guidancePriorities: ["awareness", "reflection", "simplification", "non-judgmental coaching"],
    guidanceStyles: ["reflective_questioning", "spending_summaries", "gentle_nudging", "pattern_highlighting"],
    successIndicators: ["increased budgeting activity", "reduced discretionary spending", "engagement with spending insights"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["spending_analysis", "subscription_detection", "spending_categorization", "trend_summaries"],
    preferredBehaviors: ["prioritize reflection over pressure", "emphasize awareness first", "avoid guilt framing"],
    restrictedCapabilities: ["avoid autonomous actions", "require user confirmation before alerts"],
    artifactsCanCreate: ["monthly_spending_summary", "discretionary_spending_insights"],
    artifactsCanUpdate: ["spending_trend_history", "financial_awareness_tracker"],
    artifactImportance: { 
      monthly_spending_summary: "primary", 
      discretionary_spending_insights: "optional", 
      spending_trend_history: "supporting", 
      financial_awareness_tracker: "milestone" 
    },
    goal: "Raise spending consciousness",
    desiredMovement: "Prompts reflection on impulse patterns to promote mindful spending awareness.",
    applicableStates: ["impulsive", "distracted", "overloaded"],
    preferredStrategies: ["reflective_questioning", "spending_summaries"],
    successSignals: ["increased budgeting activity", "reduced discretionary spending"]
  },
  {
    id: "budget_confidence",
    name: "Budget Confidence",
    category: "Coaching",
    purpose: "Help users feel capable and confident managing budgets.",
    commonSituations: ["financial anxiety", "first-time budgeting", "uncertainty about planning"],
    guidancePriorities: ["reassurance", "clarity", "progressive guidance", "reducing overwhelm"],
    guidanceStyles: ["step_by_step_planning", "educational_scaffolding", "encouragement", "simplification"],
    successIndicators: ["completed budgets", "recurring usage", "increased financial confidence"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["budgeting_assistance", "affordability_estimation", "savings_forecasting", "educational_explanations"],
    preferredBehaviors: ["prioritize reassurance", "favor coaching over automation", "step-by-step guidance"],
    restrictedCapabilities: ["avoid autonomous transfers", "require user confirmation for budget changes"],
    artifactsCanCreate: ["starter_budget", "savings_plan", "budgeting_checklist"],
    artifactsCanUpdate: ["budget_progress", "savings_milestones"],
    artifactImportance: { 
      starter_budget: "primary", 
      savings_plan: "primary", 
      budgeting_checklist: "supporting", 
      budget_progress: "milestone", 
      savings_milestones: "milestone" 
    },
    goal: "Build budgeting capability",
    desiredMovement: "Reduce overwhelm and build first-time planning confidence through reassurance.",
    applicableStates: ["anxious", "confused", "hesitant"],
    preferredStrategies: ["step_by_step_planning", "educational_scaffolding"],
    successSignals: ["completed budgets", "increased financial confidence"]
  },
  {
    id: "large_purchase_evaluation",
    name: "Large Purchase Evaluation",
    category: "Decision Support",
    purpose: "Help users make thoughtful high-value purchase decisions.",
    commonSituations: ["evaluating expensive purchases", "uncertainty about affordability", "comparing financing options"],
    guidancePriorities: ["tradeoff clarity", "financial confidence", "pacing reduction", "transparency"],
    guidanceStyles: ["comparison_framing", "affordability_explanation", "tradeoff_structuring", "reassurance"],
    successIndicators: ["narrowed options", "reduced uncertainty", "financially healthier decisions"],
    version: "1.1.0",
    status: "production",
    allowedCapabilities: ["affordability_analysis", "financing_comparison", "tradeoff_explanation", "scenario_simulation"],
    preferredBehaviors: ["structure tradeoff options", "slow communication pacing", "prioritize tradeoff clarity"],
    restrictedCapabilities: ["avoid aggressive upsell recommendations", "require user confirmation before committing"],
    artifactsCanCreate: ["purchase_comparison_report", "affordability_breakdown", "financing_evaluation"],
    artifactsCanUpdate: ["decision_shortlist", "evaluation_notes"],
    artifactImportance: { 
      purchase_comparison_report: "primary", 
      affordability_breakdown: "primary", 
      financing_evaluation: "optional", 
      decision_shortlist: "supporting", 
      evaluation_notes: "supporting" 
    },
    goal: "Analyze expensive purchases",
    desiredMovement: "Structure tradeoff options and slow communication pacing during high-value evaluations.",
    applicableStates: ["evaluating", "hesitant", "trust_evaluating"],
    preferredStrategies: ["comparison_framing", "affordability_explanation"],
    successSignals: ["narrowed options", "reduced uncertainty"]
  },
  {
    id: "uncertainty_to_confidence",
    name: "Uncertainty to Confidence",
    category: "Decision Support",
    purpose: "Move users from uncertainty toward confident exploration and decision readiness.",
    commonSituations: ["confused", "overwhelmed", "hesitant"],
    guidancePriorities: ["reassurance", "progressive disclosure", "simplify choices"],
    guidanceStyles: ["reassurance", "progressive_disclosure", "simplify_choices"],
    successIndicators: ["reduced clarification requests", "confident option selection"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["educational_explanations", "simplify_terminology", "answer_questions"],
    preferredBehaviors: ["prioritize educational explanations", "use proactive insights sparingly"],
    restrictedCapabilities: ["avoid aggressive upsell recommendations"],
    artifactsCanCreate: ["learning_plans", "decision_comparisons"],
    artifactsCanUpdate: ["onboarding_checklist"],
    artifactImportance: { 
      learning_plans: "primary", 
      decision_comparisons: "optional", 
      onboarding_checklist: "supporting" 
    },
    goal: "Increase confidence",
    desiredMovement: "Move users from uncertainty toward confident exploration and decision readiness.",
    applicableStates: ["confused", "overwhelmed", "hesitant"],
    preferredStrategies: ["reassurance", "progressive_disclosure", "simplify_choices"],
    successSignals: ["reduced clarification requests", "confident option selection"]
  },
  {
    id: "hesitation_to_commitment",
    name: "Hesitation to Commitment",
    category: "Activation",
    purpose: "Guide skeptical users toward high intent by providing verifiable social proof.",
    commonSituations: ["skeptical", "trust_evaluating", "hesitant"],
    guidancePriorities: ["evidence layering", "social validation", "transparency first"],
    guidanceStyles: ["evidence_layering", "social_validation", "transparency_first"],
    successIndicators: ["successful activation", "explicit agreement"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["financing_comparison", "generate_recommendations", "prioritize_actions"],
    preferredBehaviors: ["favor coaching over automation", "require user confirmation"],
    restrictedCapabilities: ["avoid autonomous actions"],
    artifactsCanCreate: ["action_plans", "recommendation_summaries"],
    artifactsCanUpdate: ["goal_states"],
    artifactImportance: { 
      action_plans: "primary", 
      recommendation_summaries: "primary", 
      goal_states: "milestone" 
    },
    goal: "Encourage commitment",
    desiredMovement: "Guide skeptical users toward high intent by providing verifiable social proof.",
    applicableStates: ["skeptical", "trust_evaluating", "hesitant"],
    preferredStrategies: ["evidence_layering", "social_validation", "transparency_first"],
    successSignals: ["successful activation", "explicit agreement"]
  },
  {
    id: "passive_to_engaged",
    name: "Passive to Engaged",
    category: "Habit Formation",
    purpose: "Shift user from passive consumption to deep conversational investment.",
    commonSituations: ["passive_consumption", "distracted", "low_intent"],
    guidancePriorities: ["curiosity expansion", "guided exploration", "momentum building"],
    guidanceStyles: ["curiosity_expansion", "guided_exploration", "momentum_building"],
    successIndicators: ["deeper exploration", "repeated querying"],
    version: "1.0.0",
    status: "production",
    allowedCapabilities: ["simulate_scenarios", "explain_concepts", "generate_learning_paths"],
    preferredBehaviors: ["prioritize reflection over pressure"],
    restrictedCapabilities: ["avoid autonomous actions"],
    artifactsCanCreate: ["progress_trackers", "engagement_summaries"],
    artifactsCanUpdate: ["milestone_histories"],
    artifactImportance: { 
      progress_trackers: "primary", 
      engagement_summaries: "optional", 
      milestone_histories: "milestone" 
    },
    goal: "Deepen engagement",
    desiredMovement: "Shift user from passive consumption to deep conversational investment.",
    applicableStates: ["passive_consumption", "distracted", "low_intent"],
    preferredStrategies: ["curiosity_expansion", "guided_exploration", "momentum_building"],
    successSignals: ["deeper exploration", "repeated querying"]
  }
];

const initialJourneyModifiers: Record<string, Record<string, number>> = {
  uncertainty_to_confidence: {
    trustworthy: 0.25,
    conversational: 0.15
  },
  hesitation_to_commitment: {
    expert: 0.30,
    friendly: 0.10
  },
  overwhelm_to_control: {
    concise: 0.40,
    calm: 0.20
  }
};

const initialMockUsers: MockUser[] = [
  {
    id: "user_kiara",
    name: "Kiara Mehta (Gen Z)",
    age: 23,
    location: "Bangalore",
    anxietyLevel: "high",
    upiUsage: "heavy",
    salaryStatus: "delayed",
    preferredLanguage: "hinglish"
  },
  {
    id: "user_rahul",
    name: "Rahul Sharma (Conservative)",
    age: 42,
    location: "Mumbai",
    anxietyLevel: "low",
    upiUsage: "low",
    salaryStatus: "credited",
    preferredLanguage: "english"
  }
];

const initialExperiments: Experiment[] = [
  {
    id: "exp_supportive_vs_analytical",
    name: "Tone Split A/B Run",
    targetRegion: "India",
    rolloutPercentage: 50,
    status: "active",
    variantASegmentId: "style_supportive",
    variantBSegmentId: "style_analytical"
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    timestamp: "2026-05-18T10:15:00Z",
    author: "John Doe (Marketing Director)",
    actionType: "update_base",
    description: "Restructured baseline configurations to align with the canonical semantic contract."
  },
  {
    id: "log_002",
    timestamp: "2026-05-18T14:45:00Z",
    author: "Compliance Bot",
    actionType: "modify_governance",
    description: "Enforced absolute anxiety limits on empathy and friendly metrics."
  }
];

const initialOrganizations: Organization[] = [
  {
    id: "org_marketing",
    name: "Marketing Domain",
    description: "Controls the brand persona, linguistic foundations, and behavioral primitives.",
    ownedFamilies: ["Identity", "Voice", "Tone", "Style", "Emotional", "Trust", "Motivation", "Engagement", "Persuasion Preferences"]
  },
  {
    id: "org_product",
    name: "Product Domain",
    description: "Owns behavioral strategies, user journey maps, and cognitive load mitigations.",
    ownedFamilies: ["Journey States", "Cognitive States", "Emotional States", "Intent States", "Engagement States", "Readiness States", "Friction States", "Escalation States", "Workflow States"]
  },
  {
    id: "org_governance",
    name: "Governance Domain",
    description: "Enforces legal restrictions, structural compliance caps, and safety overrides.",
    ownedFamilies: ["Emotional Safety Constraints", "Persuasion Constraints", "Transparency Constraints", "Escalation Constraints", "Compliance Constraints", "Explainability Constraints"]
  },
  {
    id: "org_engineering",
    name: "Engineering Runtime Domain",
    description: "Decides layout and resolution execution, telemetry tracking, and tool orchestration.",
    ownedFamilies: ["Signal Resolution", "Context Resolution", "User State Resolution", "Primitive Resolution", "Strategy Resolution", "Tool Resolution", "Execution Resolution", "Explainability Resolution", "Observability Resolution"]
  }
];

export interface RegistrySlice {
  userStates: Record<string, UserState>;
  resolutions: Record<string, RuntimeResolution>;
  journeys: Journey[];
  journeyModifiers: Record<string, Record<string, number>>;
  tools: Tool[];
  capabilities: Capability[];
  artifacts: Artifact[];
  executionSemanticsRegistry: ExecutionSemanticsRegistry;
  capabilityContractsRegistry: CapabilityContractsRegistry;
  governanceShields: GovernanceShield[];
  forbiddenBehaviors: ForbiddenBehavior[];
  illegalCombinations: IllegalCombination[];
  experiments: Experiment[];
  auditLogs: AuditLog[];
  mockUsers: MockUser[];
  organizations: Organization[];

  createUserState: (state: UserState) => void;
  deleteUserState: (id: string) => void;
  updateUserState: (id: string, updates: Partial<UserState>) => void;
  updateResolution: (id: string, status: "active" | "standby") => void;
  toggleMockUserContext: <K extends keyof MockUser>(userId: string, key: K, value: MockUser[K]) => void;
  triggerAuditLog: (action: AuditLog["actionType"], desc: string) => void;
  createOrganization: (org: Organization) => void;
  deleteOrganization: (id: string) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  updateJourneyModifier: (journeyId: string, primitiveId: string, value: number) => void;
  createJourney: (journey: Journey) => void;
  updateJourney: (id: string, updates: Partial<Journey>) => void;
  deleteJourney: (id: string) => void;
  cloneJourney: (id: string, newId: string, newName: string) => void;
  publishJourney: (id: string, status: "draft" | "staging" | "production" | "archived") => void;
  createTool: (tool: Tool) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  createCapability: (capability: Capability) => void;
  updateCapability: (id: string, updates: Partial<Capability>) => void;
  deleteCapability: (id: string) => void;
  createArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
  createExecutionSemantic: (semantic: ExecutionTypeSemantic) => void;
  updateExecutionSemantic: (id: string, updates: Partial<ExecutionTypeSemantic>) => void;
  deleteExecutionSemantic: (id: string) => void;
  createInputContract: (contract: InputContract) => void;
  updateInputContract: (id: string, updates: Partial<InputContract>) => void;
  deleteInputContract: (id: string) => void;
  createOutputContract: (contract: OutputContract) => void;
  updateOutputContract: (id: string, updates: Partial<OutputContract>) => void;
  deleteOutputContract: (id: string) => void;
  createRuntimeContract: (contract: RuntimeContract) => void;
  updateRuntimeContract: (id: string, updates: Partial<RuntimeContract>) => void;
  deleteRuntimeContract: (id: string) => void;
  addGovernanceShield: (shield: GovernanceShield) => void;
  deleteGovernanceShield: (id: string) => void;
  toggleForbiddenBehavior: (id: string) => void;
  addIllegalCombination: (comb: IllegalCombination) => void;
}

export const createRegistrySlice: StateCreator<
  BehaviorState,
  [],
  [],
  RegistrySlice
> = (set) => ({
  userStates: canonicalUserStates,
  resolutions: canonicalResolutions,
  governanceShields: initialShields,
  forbiddenBehaviors: initialForbiddenBehaviors,
  illegalCombinations: initialIllegalCombinations,
  executionSemanticsRegistry: canonicalExecutionSemanticsRegistry,
  capabilityContractsRegistry: canonicalCapabilityContractsRegistry,
  capabilities: canonicalCapabilities,
  tools: canonicalTools,
  artifacts: canonicalArtifacts,
  journeys: initialJourneys,
  journeyModifiers: initialJourneyModifiers,
  mockUsers: initialMockUsers,
  experiments: initialExperiments,
  auditLogs: initialAuditLogs,
  organizations: initialOrganizations,

  createUserState: (state) =>
    set((s) => ({ userStates: { ...s.userStates, [state.id]: state } })),

  deleteUserState: (id) =>
    set((s) => {
      const updated = { ...s.userStates };
      delete updated[id];
      return { userStates: updated };
    }),

  updateUserState: (id, updates) =>
    set((s) => ({
      userStates: {
        ...s.userStates,
        [id]: { ...s.userStates[id], ...updates }
      }
    })),

  updateResolution: (id, status) =>
    set((s) => ({
      resolutions: {
        ...s.resolutions,
        [id]: { ...s.resolutions[id], status }
      }
    })),

  toggleMockUserContext: (userId, key, value) =>
    set((state) => ({
      mockUsers: state.mockUsers.map((user) => 
        user.id === userId ? { ...user, [key]: value } : user
      )
    })),

  triggerAuditLog: (actionType, description) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "John Doe (Marketing Director)",
        actionType,
        description
      };
      return { auditLogs: [log, ...state.auditLogs] };
    }),

  createOrganization: (org) =>
    set((s) => ({ organizations: [...s.organizations, org] })),

  deleteOrganization: (id) =>
    set((s) => ({ organizations: s.organizations.filter((o) => o.id !== id) })),

  updateOrganization: (id, updates) =>
    set((s) => ({
      organizations: s.organizations.map((o) => o.id === id ? { ...o, ...updates } : o)
    })),

  updateJourneyModifier: (journeyId, primId, value) =>
    set((state) => {
      const journeyMods = state.journeyModifiers[journeyId] ? { ...state.journeyModifiers[journeyId] } : {};
      if (value === 0) {
        delete journeyMods[primId];
      } else {
        journeyMods[primId] = parseFloat(value.toFixed(2));
      }
      return {
        journeyModifiers: {
          ...state.journeyModifiers,
          [journeyId]: journeyMods
        }
      };
    }),

  createJourney: (journey) =>
    set((state) => ({
      journeys: [...state.journeys, {
        ...journey,
        allowedCapabilities: journey.allowedCapabilities || [],
        preferredBehaviors: journey.preferredBehaviors || [],
        restrictedCapabilities: journey.restrictedCapabilities || [],
        artifactsCanCreate: journey.artifactsCanCreate || [],
        artifactsCanUpdate: journey.artifactsCanUpdate || [],
        artifactImportance: journey.artifactImportance || {},
        goal: journey.goal || journey.purpose || "Custom Goal",
        desiredMovement: journey.desiredMovement || journey.purpose || "Custom Movement",
        applicableStates: journey.applicableStates || journey.commonSituations || [],
        preferredStrategies: journey.preferredStrategies || journey.guidanceStyles || [],
        successSignals: journey.successSignals || journey.successIndicators || []
      }]
    })),

  updateJourney: (id, updates) =>
    set((state) => ({
      journeys: state.journeys.map((j) => {
        if (j.id === id) {
          const merged = { ...j, ...updates };
          return {
            ...merged,
            goal: updates.goal || updates.purpose || merged.goal,
            desiredMovement: updates.desiredMovement || updates.purpose || merged.desiredMovement,
            applicableStates: updates.applicableStates || updates.commonSituations || merged.applicableStates,
            preferredStrategies: updates.preferredStrategies || updates.guidanceStyles || merged.preferredStrategies,
            successSignals: updates.successSignals || updates.successIndicators || merged.successSignals
          };
        }
        return j;
      })
    })),

  deleteJourney: (id) =>
    set((state) => ({
      journeys: state.journeys.filter((j) => j.id !== id)
    })),

  cloneJourney: (id, newId, newName) =>
    set((state) => {
      const original = state.journeys.find((j) => j.id === id);
      if (!original) return {};
      const cloned = {
        ...original,
        id: newId,
        name: newName,
        version: "1.0.0",
        status: "draft" as const
      };
      return {
        journeys: [...state.journeys, cloned]
      };
    }),

  publishJourney: (id, status) =>
    set((state) => ({
      journeys: state.journeys.map((j) => {
        if (j.id === id) {
          let nextVer = j.version;
          if (status === "production") {
            const parts = j.version.split(".");
            const last = parseInt(parts[parts.length - 1]) || 0;
            parts[parts.length - 1] = (last + 1).toString();
            nextVer = parts.join(".");
          }
          return { ...j, status, version: nextVer };
        }
        return j;
      })
    })),

  createTool: (tool) =>
    set((state) => ({ tools: [...state.tools, tool] })),

  updateTool: (id, updates) =>
    set((state) => ({
      tools: state.tools.map((t) => t.id === id ? { ...t, ...updates } : t)
    })),

  deleteTool: (id) =>
    set((state) => ({ tools: state.tools.filter((t) => t.id !== id) })),

  createCapability: (capability) =>
    set((state) => ({ capabilities: [...state.capabilities, capability] })),

  updateCapability: (id, updates) =>
    set((state) => ({
      capabilities: state.capabilities.map((c) => c.id === id ? { ...c, ...updates } : c)
    })),

  deleteCapability: (id) =>
    set((state) => ({ capabilities: state.capabilities.filter((c) => c.id !== id) })),

  createArtifact: (artifact) =>
    set((state) => ({ artifacts: [...state.artifacts, artifact] })),

  updateArtifact: (id, updates) =>
    set((state) => ({
      artifacts: state.artifacts.map((a) => a.id === id ? { ...a, ...updates } : a)
    })),

  deleteArtifact: (id) =>
    set((state) => ({ artifacts: state.artifacts.filter((a) => a.id !== id) })),

  createExecutionSemantic: (semantic) =>
    set((state) => ({
      executionSemanticsRegistry: {
        ...state.executionSemanticsRegistry,
        execution_types: [...state.executionSemanticsRegistry.execution_types, semantic]
      }
    })),

  updateExecutionSemantic: (id, updates) =>
    set((state) => ({
      executionSemanticsRegistry: {
        ...state.executionSemanticsRegistry,
        execution_types: state.executionSemanticsRegistry.execution_types.map((s) => s.id === id ? { ...s, ...updates } : s)
      }
    })),

  deleteExecutionSemantic: (id) =>
    set((state) => ({
      executionSemanticsRegistry: {
        ...state.executionSemanticsRegistry,
        execution_types: state.executionSemanticsRegistry.execution_types.filter((s) => s.id !== id)
      }
    })),

  createInputContract: (contract) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        input_contracts: [...state.capabilityContractsRegistry.input_contracts, contract]
      }
    })),

  updateInputContract: (id, updates) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        input_contracts: state.capabilityContractsRegistry.input_contracts.map((c) => c.id === id ? { ...c, ...updates } : c)
      }
    })),

  deleteInputContract: (id) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        input_contracts: state.capabilityContractsRegistry.input_contracts.filter((c) => c.id !== id)
      }
    })),

  createOutputContract: (contract) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        output_contracts: [...state.capabilityContractsRegistry.output_contracts, contract]
      }
    })),

  updateOutputContract: (id, updates) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        output_contracts: state.capabilityContractsRegistry.output_contracts.map((c) => c.id === id ? { ...c, ...updates } : c)
      }
    })),

  deleteOutputContract: (id) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        output_contracts: state.capabilityContractsRegistry.output_contracts.filter((c) => c.id !== id)
      }
    })),

  createRuntimeContract: (contract) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        runtime_contracts: [...state.capabilityContractsRegistry.runtime_contracts, contract]
      }
    })),

  updateRuntimeContract: (id, updates) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        runtime_contracts: state.capabilityContractsRegistry.runtime_contracts.map((c) => c.id === id ? { ...c, ...updates } : c)
      }
    })),

  deleteRuntimeContract: (id) =>
    set((state) => ({
      capabilityContractsRegistry: {
        ...state.capabilityContractsRegistry,
        runtime_contracts: state.capabilityContractsRegistry.runtime_contracts.filter((c) => c.id !== id)
      }
    })),

  addGovernanceShield: (shield) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Governance Officer",
        actionType: "modify_governance",
        description: `Created new safety shield cap: "${shield.name}"`
      };
      return {
        governanceShields: [...state.governanceShields, shield],
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  deleteGovernanceShield: (id) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Governance Officer",
        actionType: "modify_governance",
        description: `Permanently removed safety shield rule: "${id}"`
      };
      return {
        governanceShields: state.governanceShields.filter((s) => s.id !== id),
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  toggleForbiddenBehavior: (id) =>
    set((state) => {
      const updated = state.forbiddenBehaviors.map((b) => 
        b.id === id ? { ...b, isActive: !b.isActive } : b
      );
      const target = updated.find(b => b.id === id);
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Governance Officer",
        actionType: "toggle_prohibition",
        description: `Set forbidden behavior "${id}" to: ${target?.isActive ? "ACTIVE LAW" : "DISABLED"}`
      };
      return {
        forbiddenBehaviors: updated,
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  addIllegalCombination: (comb) =>
    set((state) => {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Governance Officer",
        actionType: "modify_governance",
        description: `Registered illegal composite combination: "${comb.name}"`
      };
      return {
        illegalCombinations: [...state.illegalCombinations, comb],
        auditLogs: [log, ...state.auditLogs]
      };
    })
});
