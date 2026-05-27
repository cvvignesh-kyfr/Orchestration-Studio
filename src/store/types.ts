export interface IntentSpec {
  id: string;
  name: string;
  category: string;
  description: string;
  signals: string[];
  confidenceThreshold: number;
  examples: string[];
  negativeExamples: string[];
  requiredEntities: string[];
  optionalEntities: string[];
  eligibleJourneys: string[];
  eligibleTools: string[];
  defaultGoals: string[];
  responseContracts: string[];
  clarificationPolicy: string;
  status: "Draft" | "Review" | "Published" | "Archived";
  version: string;
  owner: string;
  tags: string[];
  versionHistory?: { version: string; timestamp: string; author: string; data: unknown }[];
}

export interface CognitiveStateSpec {
  id: string;
  name: string;
  category: string;
  definition: string;
  signals: string[];
  strategyAffinities: string[];
  colorHsl: string;
  status: "Draft" | "Review" | "Published" | "Archived";
  version: string;
  owner: string;
  tags: string[];
  versionHistory?: { version: string; timestamp: string; author: string; data: unknown }[];
}

export interface EntitySpec {
  id: string;
  name: string;
  mode: "Authored" | "External" | "Runtime";
  type: "Merchant" | "Category" | "UserAccount" | "Transaction" | "Artifact" | "SystemContext";
  aliases?: string[];
  canonicalId?: string;
  relationships?: string[];
  authoredValues?: string[];
  externalConfig?: {
    sourceProvider: string;
    cardinality: "High" | "Medium";
    resolutionContract: {
      inputs: string[];
      outputs: string[];
    };
    confidencePolicy: {
      autoResolveAbove: number;
      askClarificationBelow: number;
      proceedWithDisclosureRange: string;
    };
    fallbackPolicy: {
      noMatch: string;
      multipleMatches: string;
      providerDown: string;
    };
    exposedFields: string[];
  };
  runtimeDerivationContext?: string;
  bindings: {
    intents: string[];
    journeys: string[];
    tools: string[];
    artifacts: string[];
    contracts: string[];
  };
  status: "Draft" | "Review" | "Published" | "Archived";
  version: string;
  owner: string;
  tags: string[];
  versionHistory?: { version: string; timestamp: string; author: string; data: unknown }[];
}

export interface EntityProviderSpec {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  authType: "Bearer Token" | "OAuth 2.0" | "HMAC Signature" | "API Key" | "mTLS" | "Internal IPC";
  rateLimit: string;
  latencySla: string;
  status: "Draft" | "Review" | "Published" | "Archived";
  version: string;
  owner: string;
  tags: string[];
  versionHistory?: { version: string; timestamp: string; author: string; data: unknown }[];
}

export interface Primitive {
  readonly id: string;
  readonly name: string;
  readonly category: "Identity" | "Voice" | "Tone" | "Style" | "Emotional" | "Trust" | "Motivation" | "Engagement" | "Persuasion Preferences";
  readonly path: string;
  readonly base: number;
  readonly definition: string;
  readonly principle: string;
  readonly owner: string;
  readonly range: { min: number; max: number };
  readonly semanticInterpretation: { min: string; mid: string; max: string };
  
  readonly resolutionSignals?: string[];
  readonly inferenceRules?: string[];
  readonly compatibleStrategies?: string[];
  readonly incompatibleStrategies?: string[];
  readonly governanceConstraints?: {
    cap?: number;
    floor?: number;
    excludedContexts?: string[];
  };
  readonly linguisticImplications?: {
    promptDirective?: string;
    examplePhrasing?: string;
  };
}

export interface UserState {
  readonly id: string;
  readonly name: string;
  readonly category: "Cognitive States" | "Emotional States" | "Motivational States" | "Decision-Making States" | "Engagement States" | "Trust & Confidence States" | "Behavioral Friction States" | "Journey Progression States";
  readonly description: string;
  readonly owner: "Product" | string;
  readonly observableSignals: readonly string[];
  readonly suggestedStrategies: readonly string[];
  readonly compatibleJourneys: readonly string[];
  readonly adaptiveGuidance: readonly string[];
  readonly isActive?: boolean;
}

export interface RuntimeResolution {
  readonly id: string;
  readonly name: string;
  readonly category: "Signal Resolution" | "Context Resolution" | "User State Resolution" | "Primitive Resolution" | "Strategy Resolution" | "Tool Resolution" | "Execution Resolution" | "Explainability Resolution" | "Observability Resolution" | string;
  readonly description: string;
  readonly status: "active" | "standby";
}

export interface BehavioralStrategy {
  id: string;
  name: string;
  description: string;
  intent?: string;
  bestAppliedWhen?: string;
  conversationalBehaviors?: string[];
  compatibleStates?: string[];
  compatibleJourneys?: string[];
  owner?: string;
  family?: string;
  targetPrimitives?: Record<string, number>;
  isGovernanceApproved?: boolean;
  explainabilityMetrics?: {
    authorTeam: string;
    performanceScore: number;
  };
  targetGoalState?: string;
  attachedTactics?: string[];
  phrasingExample?: string;
  triggeredToolFlow?: string;
  producedArtifactFlow?: string;
}

export interface Journey {
  id: string;
  name: string;
  category: string;
  purpose: string;
  commonSituations: string[];
  guidancePriorities: string[];
  guidanceStyles: string[];
  successIndicators: string[];
  version: string;
  status: "draft" | "staging" | "production" | "archived";
  
  // Capabilities Awareness
  allowedCapabilities: string[];
  preferredBehaviors: string[];
  restrictedCapabilities: string[];

  // Artifacts Awareness
  artifactsCanCreate: string[];
  artifactsCanUpdate: string[];
  artifactImportance: Record<string, string>;

  // Compatibility fields
  goal: string;
  desiredMovement: string;
  applicableStates: string[];
  preferredStrategies: string[];
  successSignals: string[];
}

export interface ToolAction {
  id: string;
  tool_id: string;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  execution_type: string;
  side_effects: string;
  timeout_ms: number;
  retryable: boolean;
  produces_artifacts: string[];
  consumes_artifacts: string[];
  governance_requirements: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "degraded";
  owner_team: string;
  authentication: string;
  rate_limits: string;
  sla: string;
  latency_tier: "instant" | "near_realtime" | "batch" | string;
  cost_tier: "free" | "low" | "high" | string;
  actions: ToolAction[];
  permissions: string[];
  side_effects: string;
  retry_policy: string;
  observability: {
    logs: string;
    metrics: string;
    traces: string;
  };
  
  // Compatibility fields
  apiEndpoint: string;
  inputSchema: string;
  outputSchema: string;
  latencyBenchmarkMs: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  category: "persistent" | "moment" | "momentum";
  
  // Persistent category properties
  schema?: string;
  ownership?: string;
  mutability?: "mutable" | "immutable";
  lifecycle?: string;
  governance?: string;
  produced_by_capabilities?: string[];
  consumed_by_capabilities?: string[];

  // Moment category properties
  trigger_conditions?: string;
  behavioral_significance?: string;
  severity?: "low" | "medium" | "high" | "critical";
  ttl?: string;
  influences?: {
    strategies?: string[];
    tactics?: string[];
    tone?: string[];
    journeys?: string[];
    pacing?: string[];
    recommendations?: string[];
  };
  influenced_strategies?: string[];
  influenced_tactics?: string[];
  tone_modifiers?: string[];

  // Momentum category properties
  score_range?: string;
  contributors?: string[];
  decay_rules?: string;
  update_frequency?: string;
  influenced_journeys?: string[];
  influenced_strategies_momentum?: string[];
  pacing_modifiers?: string[];

  // Compatibility fields
  family: "Momentum Artifacts" | "Moments Artifacts";
  apiEndpoint: string;
  schemaContract: string;
  lifecycleStatus: "temporary" | "persisted" | "archived" | string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  category: string;
  execution_type: "calculator" | "retrieval" | "analysis" | "generator" | "workflow" | "agentic_flow" | "mutation" | "recommendation" | "simulation" | "decisioning" | "trigger" | "notification";
  required_inputs: string[];
  optional_inputs: string[];
  input_sources: Record<string, string[]>;
  missing_input_strategy: {
    mode: "conversational_collection" | "silent_inference" | "best_effort_execution" | "block_execution" | "human_handoff";
  };
  output_types: string[];
  required_artifacts: string[];
  produced_artifacts: string[];
  produced_moments: string[];
  modified_momentum: string[];
  implemented_by_tools: string[];
  implemented_by_actions: string[];
  governance_constraints: string[];
  permissions_required: string[];
  fallback_capabilities: string[];
  priority: "low" | "medium" | "high" | "critical";
  latency_tier: string;
  cost_tier: string;
}

export interface ExecutionTypeSemantic {
  id: string;
  orchestration_behavior: string;
  execution_expectations: string;
  latency_profile: string;
  conversational_style: string;
  state_persistence_requirements: string;
  retry_behavior: string;
  UI_rendering_hints: string[];
  runtime_behavior?: Record<string, string | boolean>;
  input_behavior?: Record<string, string | boolean>;
  output_behavior?: Record<string, string | boolean>;
  persistence_behavior?: Record<string, string | boolean>;
  UX_behavior?: Record<string, string | boolean>;
}

export interface SemanticsModel {
  id: string;
  user_interruption_behavior: string;
  orchestration_impact: string;
  fallback_handling: string;
  memory_usage: string;
  confidence_thresholds: string;
}

export interface ExecutionSemanticsRegistry {
  execution_types: ExecutionTypeSemantic[];
  input_acquisition_models: SemanticsModel[];
  output_behaviors: string[];
  orchestration_patterns: string[];
  persistence_models: string[];
  runtime_policies: string[];
  interaction_models: string[];
  failure_behaviors: string[];
  continuation_policies: string[];
  UX_rendering_hints: string[];
}

export interface InputContract {
  id: string;
  capability_id: string;
  required_inputs: string[];
  optional_inputs: string[];
  input_schema: Record<string, Record<string, string | number | boolean>>;
  validation_rules: Record<string, Record<string, string | number | boolean>>;
  input_sources: Record<string, string[]>;
  acquisition_strategy: { mode: string };
  inference_rules: Record<string, Record<string, string | number | boolean>>;
  fallback_behavior: Record<string, string | Record<string, string>>;
  confidence_thresholds: Record<string, number | string>;
  governance_constraints: string[];
  persistence_behavior: Record<string, string | boolean>;
}

export interface OutputContract {
  id: string;
  capability_id: string;
  output_types: string[];
  output_schema: Record<string, Record<string, string | number | boolean>>;
  produced_artifacts: string[];
  produced_moments: string[];
  modified_momentum: string[];
  persistence_rules: Record<string, boolean | string>;
  rendering_hints: { preferred: string[] };
  downstream_dependencies: string[];
  governance_classification: Record<string, boolean | string>;
}

export interface RuntimeContract {
  id: string;
  capability_id: string;
  execution_semantic: string;
  orchestration_policy: Record<string, string | boolean | number>;
  retry_policy: { strategy: string };
  timeout_policy: { max_timeout_ms: number };
  fallback_policy: { strategy: string };
  continuation_policy: { mode: string };
  concurrency_policy: Record<string, string | boolean | number>;
  observability: Record<string, boolean | string>;
  governance_bindings: Record<string, boolean | string>;
  persistence_contract: Record<string, boolean | string>;
  failure_behavior: Record<string, string>;
  execution_priority: "low" | "medium" | "high" | "critical";
}

export interface CapabilityContractsRegistry {
  input_sources: string[];
  acquisition_strategies: string[];
  output_types: string[];
  retry_policies: string[];
  continuation_policies: string[];
  fallback_policies: string[];
  input_contracts: InputContract[];
  output_contracts: OutputContract[];
  runtime_contracts: RuntimeContract[];
  validation_rules: string[];
  resolution_policies: string[];
  state_persistence_contracts: string[];
  governance_bindings: string[];
  continuation_contracts: string[];
}

export interface OverlayModifier {
  value: number;
  condition?: string;
}

export interface SegmentRule {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "contains";
  value: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  category: "demographic" | "regional" | "behavioral" | "lifecycle" | "contextual" | "relationship" | "style" | "intent" | "governance";
  rules: SegmentRule[];
  modifiers: Record<string, OverlayModifier>;
}

export interface MockUser {
  id: string;
  name: string;
  age: number;
  location: string;
  anxietyLevel: "low" | "medium" | "high";
  upiUsage: "low" | "heavy";
  salaryStatus: "delayed" | "credited";
  preferredLanguage: "english" | "hinglish" | "tamil_english";
}

export type ShieldCategory = 
  | "Emotional Safety Constraints"
  | "Persuasion Constraints"
  | "Transparency Constraints"
  | "Escalation Constraints"
  | "Compliance Constraints"
  | "Explainability Constraints"
  | string;

export interface GovernanceShield {
  id: string;
  name: string;
  targetPrimitiveId: string;
  limitType: "cap" | "floor";
  thresholdValue: number;
  condition: string;
  category: ShieldCategory;
  description: string;
}

export interface ForbiddenBehavior {
  id: string;
  description: string;
  category: ShieldCategory;
  isActive: boolean;
}

export interface IllegalCombination {
  id: string;
  name: string;
  primitives: {
    primitiveId: string;
    operator: "greater_than" | "less_than";
    value: number;
  }[];
  explanation: string;
  category: ShieldCategory;
}

export interface Experiment {
  id: string;
  name: string;
  targetRegion: string;
  rolloutPercentage: number;
  status: "draft" | "active" | "completed";
  variantASegmentId: string;
  variantBSegmentId: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  ownedFamilies: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  author: string;
  actionType: "update_base" | "create_segment" | "modify_governance" | "deploy_experiment" | "toggle_prohibition" | "create_strategy" | "delete_strategy" | "update_strategy";
  description: string;
}

export interface GovernanceViolation {
  combinationId: string;
  name: string;
  explanation: string;
  category: string;
  offendingValues: Record<string, number>;
}

export interface CascadeStep {
  sourceName: string;
  sourceType: "base" | "overlay" | "segment" | "governance";
  runningValue: number;
  delta: number;
  category?: string;
}

export interface CascadeResult {
  steps: CascadeStep[];
  finalValue: number;
}

// Unified Zustand Store interface composing all slices
export interface BehaviorState {
  activeTab: "defaults" | "segments" | "product" | "simulator" | "governance" | "experiments" | "audit" | "publishing";
  primitives: Record<string, Primitive>;
  userStates: Record<string, UserState>;
  resolutions: Record<string, RuntimeResolution>;
  segments: Segment[];
  mockUsers: MockUser[];
  
  organizations: Organization[];
  createOrganization: (org: Organization) => void;
  deleteOrganization: (id: string) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;

  governanceShields: GovernanceShield[];
  forbiddenBehaviors: ForbiddenBehavior[];
  illegalCombinations: IllegalCombination[];
  
  strategies: BehavioralStrategy[];
  createStrategy: (strategy: BehavioralStrategy) => void;
  deleteStrategy: (id: string) => void;
  updateStrategy: (id: string, updates: Partial<BehavioralStrategy>) => void;
  selectedStrategyId: string;
  setSelectedStrategy: (id: string) => void;
  
  journeys: Journey[];
  journeyModifiers: Record<string, Record<string, number>>;
  updateJourneyModifier: (journeyId: string, primitiveId: string, value: number) => void;
  createJourney: (journey: Journey) => void;
  updateJourney: (id: string, updates: Partial<Journey>) => void;
  deleteJourney: (id: string) => void;
  cloneJourney: (id: string, newId: string, newName: string) => void;
  publishJourney: (id: string, status: "draft" | "staging" | "production" | "archived") => void;

  tools: Tool[];
  createTool: (tool: Tool) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;

  capabilities: Capability[];
  createCapability: (capability: Capability) => void;
  updateCapability: (id: string, updates: Partial<Capability>) => void;
  deleteCapability: (id: string) => void;

  artifacts: Artifact[];
  createArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
  executionSemanticsRegistry: ExecutionSemanticsRegistry;
  capabilityContractsRegistry: CapabilityContractsRegistry;
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

  experiments: Experiment[];
  auditLogs: AuditLog[];
  
  selectedPrimitiveId: string;
  selectedSegmentId: string;
  selectedUserId: string;

  activeDomainId: string;
  activeJourneyId: string;
  activeProductPage: "domains" | "behavioral" | "interaction" | "tools" | "artifacts" | "scenarios" | "policies" | "simulations" | "publishing" | "insights";
  setActiveDomain: (id: string) => void;
  setActiveJourney: (id: string) => void;
  setActiveProductPage: (page: BehaviorState["activeProductPage"]) => void;

  activeL1Domain: "marketing" | "product" | "governance" | "engineering" | "capabilities" | "settings";
  activeL2Section: string;
  setActiveL1Domain: (domain: "marketing" | "product" | "governance" | "engineering" | "capabilities" | "settings") => void;
  setActiveL2Section: (section: string) => void;
  
  updatePrimitiveBase: (id: string, value: number) => void;
  createPrimitive: (primitive: Primitive) => void;
  deletePrimitive: (id: string) => void;
  updatePrimitive: (id: string, updates: Partial<Primitive>) => void;
  
  createUserState: (state: UserState) => void;
  deleteUserState: (id: string) => void;
  updateUserState: (id: string, updates: Partial<UserState>) => void;

  updateResolution: (id: string, status: "active" | "standby") => void;

  toggleMockUserContext: <K extends keyof MockUser>(userId: string, key: K, value: MockUser[K]) => void;
  triggerAuditLog: (action: AuditLog["actionType"], desc: string) => void;
  setActiveTab: (tab: BehaviorState["activeTab"]) => void;
  setSelectedPrimitive: (id: string) => void;
  setSelectedSegment: (id: string) => void;
  setSelectedUser: (id: string) => void;

  createSegment: (segment: Segment) => void;
  deleteSegment: (id: string) => void;
  updateSegment: (id: string, name: string, description: string, category: Segment["category"]) => void;
  addSegmentRule: (segmentId: string, rule: SegmentRule) => void;
  deleteSegmentRule: (segmentId: string, ruleIndex: number) => void;
  updateSegmentModifier: (segmentId: string, primitiveId: string, value: number) => void;

  addGovernanceShield: (shield: GovernanceShield) => void;
  deleteGovernanceShield: (id: string) => void;
  toggleForbiddenBehavior: (id: string) => void;
  addIllegalCombination: (comb: IllegalCombination) => void;
}
