/* eslint-disable */
"use client";

import { useBehaviorStore } from "@/store/useBehaviorStore";
import { 
  Compass, 
  Layers, 
  GitBranch, 
  Sliders, 
  Check, 
  Copy, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  Target,
  BookOpen,
  MessageSquare,
  Wrench,
  Zap,
  Terminal,
  Send,
  BarChart3,
  Search,
  Lock,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  Share2,
  FileText,
  Activity,
  RefreshCw,
  Play,
  Volume2
} from "lucide-react";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { DomainStrategies } from "./DomainWorkspaces";

import {
  IntentSpec,
  CognitiveStateSpec,
  EntitySpec,
  EntityProviderSpec
} from "@/store/types";
import {
  seededIntents,
  seededUserStates,
  seededEntities,
  seededProviders
} from "@/data/seedUnderstanding";

interface GoalSpec {
  id: string;
  name: string;
  priority: number; // 1-100
  targetOutcome: string;
  successCondition: string;
}

interface JourneySpec {
  id: string;
  name: string;
  triggerState: string;
  targetState: string;
  milestones: { name: string; targetValue: string; status: "completed" | "active" | "pending" }[];
  startCondition: string;
  completionCondition: string;
}

interface JourneyArbitrationRule {
  id: string;
  primaryJourneyId: string;
  secondaryJourneyId: string;
  suppressJourneyId: string;
  suppressCondition: string; // e.g. "userState == 'financial_anxiety'"
  relevanceWeight: number; // 0.0 to 1.0
  priorityLevel: "High" | "Medium" | "Low";
}

interface StrategyMixerSpec {
  stateId: string;
  directAnswerWeight: number; // e.g. 0.70
  reassuranceWeight: number;  // e.g. 0.20
  educationWeight: number;    // e.g. 0.10
  conflictResolutionPolicy: string;
}

interface TacticSpec {
  id: string;
  name: string;
  family: string;
  linguisticPattern: string;
  exampleText: string;
  intensity: "Low" | "Medium" | "High";
  successSignals: string[];
}

interface ToolSpec {
  id: string;
  name: string;
  description: string;
  apiEndpoint: string;
  inputs: { name: string; type: string; required: boolean }[];
  outputs: { name: string; type: string }[];
  failureFallback: string;
}

interface ArtifactSpec {
  id: string;
  name: string;
  schema: string; // JSON-stringified schema summary
  persistence: "Ephemeral" | "Session" | "Durable";
  ttlSeconds: number;
}

interface PermissionPolicySpec {
  id: string;
  action: string;
  requiredConsent: string;
  securityClearance: "None" | "UserConfirm" | "ParentSweeps" | "BiometricDoubleOptIn";
}

interface FailurePolicySpec {
  id: string;
  toolOrJourney: string;
  retryLimit: number;
  timeoutMs: number;
  recoveryTactic: string;
}

interface ResponseContractSpec {
  id: string;
  targetScope: string; // Intent ID or Journey ID or State ID
  mustRules: string[];
  shouldRules: string[];
  mustNotRules: string[];
  disclosureRequirement: string;
}

interface EvaluationMetricSpec {
  id: string;
  name: string;
  level: "Turn" | "Journey" | "Session";
  successThreshold: number; // e.g. 0.85
  hallucinationCheckEnabled: boolean;
  cognitiveLoadCheckEnabled: boolean;
}

export default function ProductWorkspace() {
  const { activeL2Section, triggerAuditLog } = useBehaviorStore();

  // Active L3 Horizontal Subsection tab selector
  const [activeSubsection, setActiveSubsection] = useState<string>("intents");

  // Detail panel sub-tab states for the 4 understanding tabs
  const [activeIntentDetailTab, setActiveIntentDetailTab] = useState<"configure" | "history">("configure");
  const [activeStateDetailTab, setActiveStateDetailTab] = useState<"configure" | "history">("configure");
  const [activeEntityDetailTab, setActiveEntityDetailTab] = useState<"configure" | "history">("configure");
  const [activeProviderDetailTab, setActiveProviderDetailTab] = useState<"configure" | "history">("configure");

  const [newAuthoredValue, setNewAuthoredValue] = useState<string>("");
  const [newResolverInput, setNewResolverInput] = useState<string>("");
  const [newResolverOutput, setNewResolverOutput] = useState<string>("");
  const [newExposedField, setNewExposedField] = useState<string>("");

  // Transient edit state helpers
  const [newIntentExample, setNewIntentExample] = useState<string>("");
  const [newIntentNegativeExample, setNewIntentNegativeExample] = useState<string>("");
  const [newIntentSignal, setNewIntentSignal] = useState<string>("");
  const [newIntentJourney, setNewIntentJourney] = useState<string>("");
  const [newIntentTool, setNewIntentTool] = useState<string>("");
  const [newIntentGoal, setNewIntentGoal] = useState<string>("");
  const [newIntentContract, setNewIntentContract] = useState<string>("");

  const [newStateSignal, setNewStateSignal] = useState<string>("");
  const [newStateStrategyAffinity, setNewStateStrategyAffinity] = useState<string>("");

  const [newEntityAlias, setNewEntityAlias] = useState<string>("");
  const [newEntityRelationship, setNewEntityRelationship] = useState<string>("");
  const [newProviderTag, setNewProviderTag] = useState<string>("");

  // ==========================================
  // LOCAL STATES (SANDBOX CONFIGURATIONS)
  // ==========================================

  // 1. Intents
  const [intents, setIntents] = useState<IntentSpec[]>(seededIntents);
  const [selectedIntentId, setSelectedIntentId] = useState<string>("merchant_spend_query");
  const [intentSearchQuery, setIntentSearchQuery] = useState<string>("");
  const [intentStatusFilter, setIntentStatusFilter] = useState<string>("All");
  const [intentCategoryFilter, setIntentCategoryFilter] = useState<string>("All");
  const [compareIntentVersion, setCompareIntentVersion] = useState<string | null>(null);

  // 2. User States
  const [userStates, setUserStates] = useState<CognitiveStateSpec[]>(seededUserStates);
  const [selectedStateId, setSelectedStateId] = useState<string>("low_cognitive_load");
  const [stateSearchQuery, setStateSearchQuery] = useState<string>("");
  const [stateStatusFilter, setStateStatusFilter] = useState<string>("All");
  const [stateCategoryFilter, setStateCategoryFilter] = useState<string>("All");
  const [compareStateVersion, setCompareStateVersion] = useState<string | null>(null);

  // 3. Entity Ontology
  const [entities, setEntities] = useState<EntitySpec[]>(seededEntities);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("merchant");
  const [entitySearchQuery, setEntitySearchQuery] = useState<string>("");
  const [entityStatusFilter, setEntityStatusFilter] = useState<string>("All");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("All");
  const [entityModeFilter, setEntityModeFilter] = useState<string>("All");
  const [compareEntityVersion, setCompareEntityVersion] = useState<string | null>(null);

  // 4. Entity Providers
  const [providers, setProviders] = useState<EntityProviderSpec[]>(seededProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("merchant_resolution_service");
  const [providerSearchQuery, setProviderSearchQuery] = useState<string>("");
  const [providerStatusFilter, setProviderStatusFilter] = useState<string>("All");
  const [compareProviderVersion, setCompareProviderVersion] = useState<string | null>(null);

  // ==========================================
  // RUNTIME CRUD ACTIONS FOR UNDERSTANDING
  // ==========================================

  // INTENT HANDLERS
  const handleRegisterIntent = () => {
    const newId = `custom_intent_${Date.now().toString().slice(-4)}`;
    const newIt: IntentSpec = {
      id: newId,
      name: "Custom Intent",
      category: "Spend & Transaction Intents",
      description: "A custom user intent designed for conversational execution pathways.",
      signals: ["user_query"],
      confidenceThreshold: 0.75,
      examples: ["Query example"],
      negativeExamples: ["Negative query example"],
      requiredEntities: [],
      optionalEntities: [],
      eligibleJourneys: [],
      eligibleTools: [],
      defaultGoals: [],
      responseContracts: [],
      clarificationPolicy: "Ask clarification if confidence is below threshold.",
      status: "Draft",
      version: "v1.0.0",
      owner: "Product Studio Team",
      tags: ["custom"],
      versionHistory: []
    };
    setIntents([...intents, newIt]);
    setSelectedIntentId(newId);
    triggerAuditLog("update_strategy", `Created new custom intent: ${newId}`);
  };

  const handleDuplicateIntent = (it: IntentSpec) => {
    const newId = `${it.id}_copy_${Date.now().toString().slice(-4)}`;
    const newIt: IntentSpec = {
      ...it,
      id: newId,
      name: `${it.name} (Cloned)`,
      status: "Draft",
      version: "v1.0.0",
      versionHistory: []
    };
    setIntents([...intents, newIt]);
    setSelectedIntentId(newId);
    triggerAuditLog("update_strategy", `Duplicated intent: ${it.id} as ${newId}`);
  };

  const handleArchiveIntent = (it: IntentSpec) => {
    const updated = { ...it, status: "Archived" as const };
    setIntents(intents.map(x => x.id === it.id ? updated : x));
    triggerAuditLog("update_strategy", `Archived intent: ${it.id}`);
  };

  const handleRestoreIntent = (it: IntentSpec) => {
    const updated = { ...it, status: "Draft" as const };
    setIntents(intents.map(x => x.id === it.id ? updated : x));
    triggerAuditLog("update_strategy", `Restored intent: ${it.id} to Draft`);
  };

  const handleDeleteIntent = (id: string) => {
    const remaining = intents.filter(x => x.id !== id);
    setIntents(remaining);
    if (selectedIntentId === id && remaining.length > 0) {
      setSelectedIntentId(remaining[0].id);
    }
    triggerAuditLog("update_strategy", `Deleted intent spec: ${id}`);
  };

  const handlePublishIntent = (it: IntentSpec) => {
    const currentVer = it.version;
    const parts = currentVer.replace("v", "").split(".");
    let nextVer = "v1.1.0";
    if (parts.length === 3) {
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1], 10) + 1;
      const patch = 0;
      nextVer = `v${major}.${minor}.${patch}`;
    }
    const snapshot = {
      version: it.version,
      timestamp: new Date().toISOString(),
      author: "Product Studio Team",
      data: JSON.parse(JSON.stringify(it))
    };
    const updated: IntentSpec = {
      ...it,
      version: nextVer,
      status: "Published",
      versionHistory: [...(it.versionHistory || []), snapshot]
    };
    setIntents(intents.map(x => x.id === it.id ? updated : x));
    triggerAuditLog("update_strategy", `Published intent ${it.id} version ${nextVer}`);
  };

  const handleRollbackIntent = (it: IntentSpec, snapshotData: any) => {
    const updated: IntentSpec = {
      ...snapshotData,
      versionHistory: it.versionHistory
    };
    setIntents(intents.map(x => x.id === it.id ? updated : x));
    triggerAuditLog("update_strategy", `Rolled back intent ${it.id} to version ${snapshotData.version}`);
  };

  // STATE HANDLERS
  const handleRegisterState = () => {
    const newId = `custom_state_${Date.now().toString().slice(-4)}`;
    const newSt: CognitiveStateSpec = {
      id: newId,
      name: "Custom State",
      category: "Cognitive Load States",
      definition: "A custom state reflecting the user's cognitive or behavioral threshold.",
      signals: ["pattern_detected"],
      strategyAffinities: ["reassurance"],
      colorHsl: "260 80% 60%",
      status: "Draft",
      version: "v1.0.0",
      owner: "Product Studio Team",
      tags: ["custom"],
      versionHistory: []
    };
    setUserStates([...userStates, newSt]);
    setSelectedStateId(newId);
    triggerAuditLog("update_strategy", `Created new custom state: ${newId}`);
  };

  const handleDuplicateState = (st: CognitiveStateSpec) => {
    const newId = `${st.id}_copy_${Date.now().toString().slice(-4)}`;
    const newSt: CognitiveStateSpec = {
      ...st,
      id: newId,
      name: `${st.name} (Cloned)`,
      status: "Draft",
      version: "v1.0.0",
      versionHistory: []
    };
    setUserStates([...userStates, newSt]);
    setSelectedStateId(newId);
    triggerAuditLog("update_strategy", `Duplicated state: ${st.id} as ${newId}`);
  };

  const handleArchiveState = (st: CognitiveStateSpec) => {
    const updated = { ...st, status: "Archived" as const };
    setUserStates(userStates.map(x => x.id === st.id ? updated : x));
    triggerAuditLog("update_strategy", `Archived state: ${st.id}`);
  };

  const handleRestoreState = (st: CognitiveStateSpec) => {
    const updated = { ...st, status: "Draft" as const };
    setUserStates(userStates.map(x => x.id === st.id ? updated : x));
    triggerAuditLog("update_strategy", `Restored state: ${st.id} to Draft`);
  };

  const handleDeleteState = (id: string) => {
    const remaining = userStates.filter(x => x.id !== id);
    setUserStates(remaining);
    if (selectedStateId === id && remaining.length > 0) {
      setSelectedStateId(remaining[0].id);
    }
    triggerAuditLog("update_strategy", `Deleted state spec: ${id}`);
  };

  const handlePublishState = (st: CognitiveStateSpec) => {
    const currentVer = st.version;
    const parts = currentVer.replace("v", "").split(".");
    let nextVer = "v1.1.0";
    if (parts.length === 3) {
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1], 10) + 1;
      const patch = 0;
      nextVer = `v${major}.${minor}.${patch}`;
    }
    const snapshot = {
      version: st.version,
      timestamp: new Date().toISOString(),
      author: "Product Studio Team",
      data: JSON.parse(JSON.stringify(st))
    };
    const updated: CognitiveStateSpec = {
      ...st,
      version: nextVer,
      status: "Published",
      versionHistory: [...(st.versionHistory || []), snapshot]
    };
    setUserStates(userStates.map(x => x.id === st.id ? updated : x));
    triggerAuditLog("update_strategy", `Published state ${st.id} version ${nextVer}`);
  };

  const handleRollbackState = (st: CognitiveStateSpec, snapshotData: any) => {
    const updated: CognitiveStateSpec = {
      ...snapshotData,
      versionHistory: st.versionHistory
    };
    setUserStates(userStates.map(x => x.id === st.id ? updated : x));
    triggerAuditLog("update_strategy", `Rolled back state ${st.id} to version ${snapshotData.version}`);
  };

  // ENTITY HANDLERS
  const handleRegisterEntity = () => {
    const newId = `custom_entity_${Date.now().toString().slice(-4)}`;
    const newEnt: EntitySpec = {
      id: newId,
      name: "Custom Entity",
      mode: "Authored",
      type: "Category",
      authoredValues: ["Default Value"],
      bindings: {
        intents: [],
        journeys: [],
        tools: [],
        artifacts: [],
        contracts: []
      },
      status: "Draft",
      version: "v1.0.0",
      owner: "Product Studio Team",
      tags: ["custom"],
      versionHistory: []
    };
    setEntities([...entities, newEnt]);
    setSelectedEntityId(newId);
    triggerAuditLog("update_strategy", `Created new custom entity: ${newId}`);
  };

  const handleDuplicateEntity = (ent: EntitySpec) => {
    const newId = `${ent.id}_copy_${Date.now().toString().slice(-4)}`;
    const newEnt: EntitySpec = {
      ...ent,
      id: newId,
      name: `${ent.name} (Cloned)`,
      status: "Draft",
      version: "v1.0.0",
      versionHistory: []
    };
    setEntities([...entities, newEnt]);
    setSelectedEntityId(newId);
    triggerAuditLog("update_strategy", `Duplicated entity: ${ent.id} as ${newId}`);
  };

  const handleArchiveEntity = (ent: EntitySpec) => {
    const updated = { ...ent, status: "Archived" as const };
    setEntities(entities.map(x => x.id === ent.id ? updated : x));
    triggerAuditLog("update_strategy", `Archived entity: ${ent.id}`);
  };

  const handleRestoreEntity = (ent: EntitySpec) => {
    const updated = { ...ent, status: "Draft" as const };
    setEntities(entities.map(x => x.id === ent.id ? updated : x));
    triggerAuditLog("update_strategy", `Restored entity: ${ent.id} to Draft`);
  };

  const handleDeleteEntity = (id: string) => {
    const remaining = entities.filter(x => x.id !== id);
    setEntities(remaining);
    if (selectedEntityId === id && remaining.length > 0) {
      setSelectedEntityId(remaining[0].id);
    }
    triggerAuditLog("update_strategy", `Deleted entity spec: ${id}`);
  };

  const handlePublishEntity = (ent: EntitySpec) => {
    const currentVer = ent.version;
    const parts = currentVer.replace("v", "").split(".");
    let nextVer = "v1.1.0";
    if (parts.length === 3) {
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1], 10) + 1;
      const patch = 0;
      nextVer = `v${major}.${minor}.${patch}`;
    }
    const snapshot = {
      version: ent.version,
      timestamp: new Date().toISOString(),
      author: "Product Studio Team",
      data: JSON.parse(JSON.stringify(ent))
    };
    const updated: EntitySpec = {
      ...ent,
      version: nextVer,
      status: "Published",
      versionHistory: [...(ent.versionHistory || []), snapshot]
    };
    setEntities(entities.map(x => x.id === ent.id ? updated : x));
    triggerAuditLog("update_strategy", `Published entity ${ent.id} version ${nextVer}`);
  };

  const handleRollbackEntity = (ent: EntitySpec, snapshotData: any) => {
    const updated: EntitySpec = {
      ...snapshotData,
      versionHistory: ent.versionHistory
    };
    setEntities(entities.map(x => x.id === ent.id ? updated : x));
    triggerAuditLog("update_strategy", `Rolled back entity ${ent.id} to version ${snapshotData.version}`);
  };

  // PROVIDER HANDLERS
  const handleRegisterProvider = () => {
    const newId = `custom_provider_${Date.now().toString().slice(-4)}`;
    const newPr: EntityProviderSpec = {
      id: newId,
      name: "Custom Service Provider",
      description: "A custom microservice resolver endpoint for external lookups.",
      endpoint: "https://api.kyfr-runtime.in/v1/custom/resolve",
      authType: "Bearer Token",
      rateLimit: "100 req/sec",
      latencySla: "120ms",
      status: "Draft",
      version: "v1.0.0",
      owner: "Product Studio Team",
      tags: ["custom"],
      versionHistory: []
    };
    setProviders([...providers, newPr]);
    setSelectedProviderId(newId);
    triggerAuditLog("update_strategy", `Created new custom provider: ${newId}`);
  };

  const handleDuplicateProvider = (pr: EntityProviderSpec) => {
    const newId = `${pr.id}_copy_${Date.now().toString().slice(-4)}`;
    const newPr: EntityProviderSpec = {
      ...pr,
      id: newId,
      name: `${pr.name} (Cloned)`,
      status: "Draft",
      version: "v1.0.0",
      versionHistory: []
    };
    setProviders([...providers, newPr]);
    setSelectedProviderId(newId);
    triggerAuditLog("update_strategy", `Duplicated provider: ${pr.id} as ${newId}`);
  };

  const handleArchiveProvider = (pr: EntityProviderSpec) => {
    const updated = { ...pr, status: "Archived" as const };
    setProviders(providers.map(x => x.id === pr.id ? updated : x));
    triggerAuditLog("update_strategy", `Archived provider: ${pr.id}`);
  };

  const handleRestoreProvider = (pr: EntityProviderSpec) => {
    const updated = { ...pr, status: "Draft" as const };
    setProviders(providers.map(x => x.id === pr.id ? updated : x));
    triggerAuditLog("update_strategy", `Restored provider: ${pr.id} to Draft`);
  };

  const handleDeleteProvider = (id: string) => {
    const remaining = providers.filter(x => x.id !== id);
    setProviders(remaining);
    if (selectedProviderId === id && remaining.length > 0) {
      setSelectedProviderId(remaining[0].id);
    }
    triggerAuditLog("update_strategy", `Deleted provider spec: ${id}`);
  };

  const handlePublishProvider = (pr: EntityProviderSpec) => {
    const currentVer = pr.version;
    const parts = currentVer.replace("v", "").split(".");
    let nextVer = "v1.1.0";
    if (parts.length === 3) {
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1], 10) + 1;
      const patch = 0;
      nextVer = `v${major}.${minor}.${patch}`;
    }
    const snapshot = {
      version: pr.version,
      timestamp: new Date().toISOString(),
      author: "Product Studio Team",
      data: JSON.parse(JSON.stringify(pr))
    };
    const updated: EntityProviderSpec = {
      ...pr,
      version: nextVer,
      status: "Published",
      versionHistory: [...(pr.versionHistory || []), snapshot]
    };
    setProviders(providers.map(x => x.id === pr.id ? updated : x));
    triggerAuditLog("update_strategy", `Published provider ${pr.id} version ${nextVer}`);
  };

  const handleRollbackProvider = (pr: EntityProviderSpec, snapshotData: any) => {
    const updated: EntityProviderSpec = {
      ...snapshotData,
      versionHistory: pr.versionHistory
    };
    setProviders(providers.map(x => x.id === pr.id ? updated : x));
    triggerAuditLog("update_strategy", `Rolled back provider ${pr.id} to version ${snapshotData.version}`);
  };

  // 4. Goals
  const [goals, setGoals] = useState<GoalSpec[]>([
    {
      id: "prevent_debt_spiral",
      name: "Prevent Debt Spirals",
      priority: 95,
      targetOutcome: "Prevent anxious Gen Z users from selecting high-interest EMIs without understanding repayment.",
      successCondition: "User reviews affordability warning index prior to completing credit transactions."
    },
    {
      id: "maximize_savings_sweep",
      name: "Auto Cashback Sweeps",
      priority: 78,
      targetOutcome: "Encourage user to sweep idle cashback refunds into fractional index funds automatically.",
      successCondition: "At least 30% of user refunds are converted to auto savings sweep contracts."
    }
  ]);

  // 5. Journeys
  const [journeys, setJourneys] = useState<JourneySpec[]>([
    {
      id: "uncertainty_to_confidence",
      name: "EMI Uncertainty to Confident Checkout",
      triggerState: "financial_anxiety",
      targetState: "confident",
      milestones: [
        { name: "Trigger Detection", targetValue: "Intent: emi_tradeoff_inquiry", status: "completed" },
        { name: "Affordability Scaffold", targetValue: "Render: Interactive affordability budget map", status: "active" },
        { name: "Risk Disclosure Verification", targetValue: "Consent: Parent Biometric Sweeps check", status: "pending" }
      ],
      startCondition: "userState == 'financial_anxiety' AND intent == 'emi_tradeoff_inquiry'",
      completionCondition: "affordability_index_checked == true AND userConfirm == true"
    }
  ]);

  // 6. Journey Arbitration
  const [arbitrationRules, setArbitrationRules] = useState<JourneyArbitrationRule[]>([
    {
      id: "suppress_cross_sell_on_anxiety",
      primaryJourneyId: "uncertainty_to_confidence",
      secondaryJourneyId: "auto_savings_sweep",
      suppressJourneyId: "credit_card_upsell",
      suppressCondition: "userState == 'financial_anxiety'",
      relevanceWeight: 0.90,
      priorityLevel: "High"
    }
  ]);

  // 7. Strategy Mixer (Allocations sum up to 1.00 or behave like blend sliders)
  const [strategyMixers, setStrategyMixers] = useState<StrategyMixerSpec[]>([
    {
      stateId: "financial_anxiety",
      directAnswerWeight: 0.50,
      reassuranceWeight: 0.40,
      educationWeight: 0.10,
      conflictResolutionPolicy: "Prioritize Reassurance overlay triggers to stabilize cognitive friction first."
    },
    {
      stateId: "overloaded",
      directAnswerWeight: 0.30,
      reassuranceWeight: 0.10,
      educationWeight: 0.60,
      conflictResolutionPolicy: "Trigger progressive disclosure immediately, collapsing complex parameters."
    }
  ]);

  // 8. Tactics
  const [tactics, setTactics] = useState<TacticSpec[]>([
    {
      id: "conversational_reassurance",
      name: "Micro Reassurance Validation",
      family: "Trust Building",
      linguisticPattern: "Validate user choice + offer safety metrics without manipulative urgency.",
      exampleText: "Hey, that Rs 1,500 EMI fits comfortably within your previous Swiggy spend average. No stress, you have got a Rs 2,300 surplus this month.",
      intensity: "Medium",
      successSignals: ["User proceeds with low latency", "Positive sentiment token detected"]
    }
  ]);

  // 9. Tools
  const [tools, setTools] = useState<ToolSpec[]>([
    {
      id: "affordability_projection",
      name: "Budget Affordability Projection Engine",
      description: "Projects cashflow and liquidity averages to determine if EMIs will overload user.",
      apiEndpoint: "https://api.kyfr-runtime.in/v1/liquidity/affordability",
      inputs: [
        { name: "userId", type: "string", required: true },
        { name: "itemCost", type: "number", required: true },
        { name: "tenureMonths", type: "number", required: true }
      ],
      outputs: [
        { name: "affordabilityIndex", type: "number" },
        { name: "surplusScore", type: "number" }
      ],
      failureFallback: "Render static reassuring budget overlay + trigger safe callback trigger."
    }
  ]);

  // 10. Artifacts
  const [artifacts, setArtifacts] = useState<ArtifactSpec[]>([
    {
      id: "ConsentToken",
      name: "UPI Consent Token",
      schema: "{'consentId': 'string', 'expiresAt': 'timestamp', 'scopes': 'array'}",
      persistence: "Session",
      ttlSeconds: 1800
    }
  ]);

  // 11. Permissions
  const [permissions, setPermissions] = useState<PermissionPolicySpec[]>([
    {
      id: "parental_consent_sweep",
      action: "UPI sweep transfer > Rs 5,000",
      requiredConsent: "Biometric parental approval sweep signature check",
      securityClearance: "ParentSweeps"
    }
  ]);

  // 12. Failure Policies
  const [failurePolicies, setFailurePolicies] = useState<FailurePolicySpec[]>([
    {
      id: "affordability_projection_fallback",
      toolOrJourney: "affordability_projection",
      retryLimit: 3,
      timeoutMs: 800,
      recoveryTactic: "Transition to fallback static cash balance assessment UI"
    }
  ]);

  // 13. Response Contracts
  const [responseContracts, setResponseContracts] = useState<ResponseContractSpec[]>([
    {
      id: "anxious_user_emi_contract",
      targetScope: "financial_anxiety",
      mustRules: [
        "Answer the user's affordability query first before displaying payment triggers.",
        "Include budget surplus figures explicitly to anchor cognitive estimation."
      ],
      shouldRules: [
        "Mention the repayment schedule timeline clearly."
      ],
      mustNotRules: [
        "Never use manipulative timers, FOMO triggers, or fake purchase counts.",
        "Never invent financial interest rates or make up arbitrary cash reserves."
      ],
      disclosureRequirement: "Explicitly declare that this is an interest-bearing credit calculation."
    }
  ]);

  // 14. Evaluation Metrics
  const [evalMetrics, setEvalMetrics] = useState<EvaluationMetricSpec[]>([
    {
      id: "hallucination_index",
      name: "Hallucination Compliance Quotient",
      level: "Turn",
      successThreshold: 0.98,
      hallucinationCheckEnabled: true,
      cognitiveLoadCheckEnabled: false
    }
  ]);

  // ==========================================
  // TRACE OBSERVABILITY & SIMULATOR DATA
  // ==========================================

  const [activePersona, setActivePersona] = useState<string>("Riya: Anxious UPI Spender");
  const [simulationPrompt, setSimulationPrompt] = useState<string>("Should I buy the gaming chair of Rs 15,000 using my Zomato EMI option? Will it ruin my pocket money budget?");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const triggerSimulation = () => {
    setIsSimulating(true);
    triggerAuditLog("deploy_experiment", `Triggered Turn Simulation for prompt: "${simulationPrompt}" under persona "${activePersona}"`);
    setTimeout(() => {
      setSimulationResult({
        detectedIntent: { id: "emi_tradeoff_inquiry", score: 0.94 },
        stateVector: { financial_anxiety: 0.88, deal_hunting: 0.12, overloaded: 0.45 },
        resolvedEntities: [
          { value: "Zomato EMI", canonical: "merchant_zomato", type: "Merchant" },
          { value: "Rs 15,000", canonical: "transaction_amount", type: "Transaction" }
        ],
        selectedGoals: ["prevent_debt_spiral"],
        activeJourneys: [
          { id: "uncertainty_to_confidence", arbitrationWeight: 0.95, priority: "High (Primary)" }
        ],
        selectedStrategies: [
          { id: "progressive_disclosure", weight: 0.50 },
          { id: "conversational_reassurance", weight: 0.40 },
          { id: "structured_co_design", weight: 0.10 }
        ],
        selectedTactics: ["conversational_reassurance"],
        toolCalls: [
          { tool: "affordability_projection", inputs: { UserId: "riya_2004", itemCost: 15000, tenureMonths: 6 }, status: "Success", latency: "140ms" }
        ],
        artifactUpdates: [
          { artifact: "ConsentToken", update: "Created Session Token for sweep verification" }
        ],
        responseContracts: {
          adheredRules: [
            "Answered affordability first",
            "Included surplus figures (Rs 2,300)",
            "Stated repayment timeline clearly"
          ],
          violatedRules: []
        },
        evaluations: {
          hallucinationScore: "0.99 (Compliant)",
          cognitiveLoadIndex: "0.22 (Low)",
          strategyAdherence: "100%"
        },
        responseGenerated: "Hey Riya, buying that gaming chair for Rs 15,000 on EMI is safe. It will cost you Rs 2,500/month for 6 months. Since your Swiggy spend surplus is Rs 4,800/month, you'll still have Rs 2,300 in savings each month. Would you like to check out safely?",
        observabilityLogs: [
          "Received turn input prompt",
          "Calculated user state vector: financial_anxiety = 0.88",
          "Arbitrated journey 'uncertainty_to_confidence' as primary pathway",
          "Loaded strategy mixer allocations for 'financial_anxiety'",
          "Evaluated compliance metrics - Hallucination Index passed",
          "Response contract validated - 0 errors, 1 warning (disclosure missing context, auto-appended)"
        ]
      });
      setIsSimulating(false);
    }, 1500);
  };

  // ==========================================
  // YAML COMPILER GENERATOR (THE 16-spec CONTRACT)
  // ==========================================

  const [activeYamlTab, setActiveYamlTab] = useState<string>("intents");
  const [showYamlModal, setShowYamlModal] = useState<boolean>(false);

  const compiledYamlSpecs = useMemo(() => {
    const compileArray = (arr: string[] | undefined, indentLevel = 6) => {
      if (!arr || arr.length === 0) return " []";
      const spaces = " ".repeat(indentLevel);
      return "\n" + arr.map(item => `${spaces}- "${item.replace(/"/g, '\\"')}"`).join("\n");
    };

    return {
      intents: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nintents:\n` + 
        intents.map(i => 
          `  - id: ${i.id}\n` +
          `    name: "${i.name}"\n` +
          `    category: "${i.category}"\n` +
          `    description: "${i.description.replace(/"/g, '\\"')}"\n` +
          `    confidence_threshold: ${i.confidenceThreshold}\n` +
          `    clarification_policy: "${i.clarificationPolicy.replace(/"/g, '\\"')}"\n` +
          `    status: "${i.status}"\n` +
          `    version: "${i.version}"\n` +
          `    owner: "${i.owner}"\n` +
          `    signals:${compileArray(i.signals)}\n` +
          `    examples:${compileArray(i.examples)}\n` +
          `    negative_examples:${compileArray(i.negativeExamples)}\n` +
          `    required_entities:${compileArray(i.requiredEntities)}\n` +
          `    optional_entities:${compileArray(i.optionalEntities)}\n` +
          `    eligible_journeys:${compileArray(i.eligibleJourneys)}\n` +
          `    eligible_tools:${compileArray(i.eligibleTools)}\n` +
          `    default_goals:${compileArray(i.defaultGoals)}\n` +
          `    response_contracts:${compileArray(i.responseContracts)}\n` +
          `    tags:${compileArray(i.tags)}`
        ).join("\n"),
      
      states: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nstates:\n` + 
        userStates.map(s => 
          `  - id: ${s.id}\n` +
          `    name: "${s.name}"\n` +
          `    category: "${s.category}"\n` +
          `    definition: "${s.definition.replace(/"/g, '\\"')}"\n` +
          `    color_hsl: "${s.colorHsl}"\n` +
          `    status: "${s.status}"\n` +
          `    version: "${s.version}"\n` +
          `    owner: "${s.owner}"\n` +
          `    signals:${compileArray(s.signals)}\n` +
          `    strategy_affinities:${compileArray(s.strategyAffinities || [])}\n` +
          `    tags:${compileArray(s.tags)}`
        ).join("\n"),
      
      entities: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nentities:\n` + 
        entities.map(e => {
          let y = `  - id: ${e.id}\n    name: "${e.name}"\n    mode: "${e.mode}"\n    type: "${e.type}"\n    status: "${e.status}"\n    version: "${e.version}"\n    owner: "${e.owner}"\n`;
          if (e.mode === "Authored" && e.authoredValues) {
            y += `    authored_values:${compileArray(e.authoredValues, 6)}\n`;
          } else if (e.mode === "External" && e.externalConfig) {
            const cfg = e.externalConfig;
            y += `    source_provider: "${cfg.sourceProvider}"\n` +
                 `    cardinality: "${cfg.cardinality}"\n` +
                 `    resolution_contract:\n` +
                 `      inputs:${compileArray(cfg.resolutionContract.inputs, 8)}\n` +
                 `      outputs:${compileArray(cfg.resolutionContract.outputs, 8)}\n` +
                 `    confidence_policy:\n` +
                 `      auto_resolve_above: ${cfg.confidencePolicy.autoResolveAbove}\n` +
                 `      ask_clarification_below: ${cfg.confidencePolicy.askClarificationBelow}\n` +
                 `      proceed_with_disclosure_between: "${cfg.confidencePolicy.proceedWithDisclosureRange}"\n` +
                 `    fallback_policy:\n` +
                 `      no_match: "${cfg.fallbackPolicy.noMatch}"\n` +
                 `      multiple_matches: "${cfg.fallbackPolicy.multipleMatches}"\n` +
                 `      provider_down: "${cfg.fallbackPolicy.providerDown}"\n` +
                 `    exposed_fields:${compileArray(cfg.exposedFields, 6)}\n`;
          } else if (e.mode === "Runtime" && e.runtimeDerivationContext) {
            y += `    runtime_derivation_context: "${e.runtimeDerivationContext.replace(/"/g, '\\"')}"\n`;
          }
          y += `    bindings:\n` +
               `      intents: ${JSON.stringify(e.bindings.intents)}\n` +
               `      journeys: ${JSON.stringify(e.bindings.journeys)}\n` +
               `      tools: ${JSON.stringify(e.bindings.tools)}\n` +
               `      artifacts: ${JSON.stringify(e.bindings.artifacts)}\n` +
               `    tags:${compileArray(e.tags)}`;
          return y;
        }).join("\n"),
      
      entity_providers: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nentity_providers:\n` + 
        providers.map(p => 
          `  - id: ${p.id}\n` +
          `    name: "${p.name}"\n` +
          `    description: "${p.description.replace(/"/g, '\\"')}"\n` +
          `    endpoint: "${p.endpoint}"\n` +
          `    auth_type: "${p.authType}"\n` +
          `    rate_limit: "${p.rateLimit}"\n` +
          `    latency_sla: "${p.latencySla}"\n` +
          `    status: "${p.status}"\n` +
          `    version: "${p.version}"\n` +
          `    owner: "${p.owner}"\n` +
          `    tags:${compileArray(p.tags)}`
        ).join("\n"),

      goals: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\ngoals:\n` + 
        goals.map(g => `  - id: ${g.id}\n    name: "${g.name}"\n    priority_weight: ${g.priority}\n    target_outcome: "${g.targetOutcome}"\n    success_condition: "${g.successCondition}"`).join("\n"),
      
      journeys: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\njourneys:\n` + 
        journeys.map(j => `  - id: ${j.id}\n    name: "${j.name}"\n    trigger_state: "${j.triggerState}"\n    target_state: "${j.targetState}"\n    start_condition: "${j.startCondition}"\n    completion_condition: "${j.completionCondition}"\n    milestones:\n` + 
        j.milestones.map(m => `      - name: "${m.name}"\n        target: "${m.targetValue}"`).join("\n")).join("\n"),
      
      arbitration: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\narbitration_policies:\n` + 
        arbitrationRules.map(r => `  - id: ${r.id}\n    primary: "${r.primaryJourneyId}"\n    secondary: "${r.secondaryJourneyId}"\n    suppress: "${r.suppressJourneyId}"\n    condition: "${r.suppressCondition}"\n    weight: ${r.relevanceWeight}\n    priority: "${r.priorityLevel}"`).join("\n"),
      
      strategies: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nstrategies:\n` + 
        strategyMixers.map(sm => `  - state_id: ${sm.stateId}\n    conflict_resolution: "${sm.conflictResolutionPolicy}"`).join("\n"),
      
      tactics: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\ntactics:\n` + 
        tactics.map(t => `  - id: ${t.id}\n    name: "${t.name}"\n    family: "${t.family}"\n    pattern: "${t.linguisticPattern}"\n    intensity: "${t.intensity}"`).join("\n"),
      
      tools: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\ntools:\n` + 
        tools.map(t => `  - id: ${t.id}\n    name: "${t.name}"\n    endpoint: "${t.apiEndpoint}"\n    inputs: ${JSON.stringify(t.inputs)}\n    outputs: ${JSON.stringify(t.outputs)}\n    fallback: "${t.failureFallback}"`).join("\n"),
      
      artifacts: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nartifacts:\n` + 
        artifacts.map(a => `  - id: ${a.id}\n    name: "${a.name}"\n    schema: "${a.schema}"\n    persistence: "${a.persistence}"\n    ttl: ${a.ttlSeconds}`).join("\n"),
      
      permissions: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\npermission_rules:\n` + 
        permissions.map(p => `  - id: ${p.id}\n    action: "${p.action}"\n    required_consent: "${p.requiredConsent}"\n    security_level: "${p.securityClearance}"`).join("\n"),
      
      memory_policy: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nmemory_policy:\n  durability: "Session"\n  forbidden_patterns:\n    - "(?i)(card|cvv|pin|pass)\\d{3,4}"\n    - "\\b\\d{16}\\b"`,
      
      response_contracts: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nresponse_contracts:\n` + 
        responseContracts.map(rc => `  - id: ${rc.id}\n    scope: "${rc.targetScope}"\n    must:\n` + 
        rc.mustRules.map(m => `      - "${m}"`).join("\n") + "\n    should:\n" + 
        rc.shouldRules.map(s => `      - "${s}"`).join("\n") + "\n    must_not:\n" + 
        rc.mustNotRules.map(mn => `      - "${mn}"`).join("\n") + `\n    disclosure: "${rc.disclosureRequirement}"`).join("\n"),
      
      evaluation: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nevaluation_policies:\n` + 
        evalMetrics.map(e => `  - id: ${e.id}\n    name: "${e.name}"\n    level: "${e.level}"\n    threshold: ${e.successThreshold}\n    hallucination_check: ${e.hallucinationCheckEnabled}`).join("\n"),
      
      observability: `version: 1.0.0\ncompiled_at: ${new Date().toISOString()}\nobservability_policy:\n  trace_level: "Verbose"\n  replay_enabled: true\n  persist_traces: true\n  explainability: "TurnLevel"`
    };
  }, [intents, userStates, entities, providers, goals, journeys, arbitrationRules, strategyMixers, tactics, tools, artifacts, permissions, responseContracts, evalMetrics]);

  return (
    <div className="h-full text-zinc-100 p-8 overflow-y-auto max-w-none font-sans space-y-6 select-none relative overflow-x-hidden bg-transparent z-10 custom-scrollbar">
      
      {/* Ambient background glow */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900/60 pb-5">
        <div>
          <div className="flex items-center space-x-1.5 text-indigo-400 text-[10.5px] uppercase tracking-widest mb-1.5 font-bold font-mono">
            <Compass className="w-4 h-4 text-indigo-455 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Product Studio Runtime Authoring System</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight capitalize">
            {activeL2Section ? activeL2Section.replace(/_/g, " ") : "Understanding"} Studio
          </h2>
          <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl font-medium">
            Design and orchestrate conversational understanding layers, state vectors, journey progression models, behavior strategies, execution semantics, and constitutional guardrails.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowYamlModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all active:scale-95"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Compile DSL Spec (16 Files)</span>
          </button>
        </div>
      </div>

      {/* Psychological Alignment Banner */}
      <div className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-emerald-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start space-x-3.5 animate-fadeIn backdrop-blur-sm">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono">Conversational Runtime Orchestration Dashboard</div>
          <p className="text-[11.5px] text-zinc-350 leading-relaxed font-sans font-medium">
            Design and author runtime conversational components without writing code or prompts. High-fidelity declarative policies map execution pathways for state-aware conversation systems dynamically.
          </p>
        </div>
      </div>

      {/* Main Page Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Subsections Selector & Details Editor */}
        <div className="lg:col-span-12 space-y-6">
          
          {/* Subsections pills */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-3">
            {activeL2Section === "understanding" && (
              <>
                <button onClick={() => setActiveSubsection("intents")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "intents" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Intents</button>
                <button onClick={() => setActiveSubsection("user_states")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "user_states" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>User States</button>
                <button onClick={() => setActiveSubsection("entities")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "entities" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Entities & Ontology</button>
                <button onClick={() => setActiveSubsection("providers")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "providers" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Entity Providers</button>
              </>
            )}
            {activeL2Section === "direction" && (
              <>
                <button onClick={() => setActiveSubsection("goals")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "goals" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Goals</button>
                <button onClick={() => setActiveSubsection("journeys")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "journeys" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Journeys</button>
                <button onClick={() => setActiveSubsection("arbitration")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "arbitration" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Journey Arbitration</button>
              </>
            )}
            {activeL2Section === "behavior" && (
              <>
                <button onClick={() => setActiveSubsection("strategies")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "strategies" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Strategies</button>
                <button onClick={() => setActiveSubsection("mixer")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "mixer" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Strategy Mixer</button>
                <button onClick={() => setActiveSubsection("tactics")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "tactics" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Tactics</button>
              </>
            )}
            {activeL2Section === "execution" && (
              <>
                <button onClick={() => setActiveSubsection("tools")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "tools" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Tools & Capabilities</button>
                <button onClick={() => setActiveSubsection("artifacts")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "artifacts" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Artifacts</button>
                <button onClick={() => setActiveSubsection("permissions")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "permissions" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Permissions & Consent</button>
                <button onClick={() => setActiveSubsection("failure")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "failure" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Failure Policies</button>
              </>
            )}
            {activeL2Section === "control" && (
              <>
                <button onClick={() => setActiveSubsection("memory")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "memory" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Memory Policy</button>
                <button onClick={() => setActiveSubsection("contracts")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "contracts" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Response Contracts</button>
                <button onClick={() => setActiveSubsection("evaluation")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "evaluation" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Evaluation</button>
                <button onClick={() => setActiveSubsection("observability")} className={clsx("px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider", activeSubsection === "observability" ? "bg-indigo-950 text-indigo-400 border-indigo-500/30" : "bg-transparent text-zinc-400 border-zinc-900 hover:text-zinc-200")}>Observability</button>
              </>
            )}
          </div>

          {/* ==========================================
              PANELS RENDERING (Layered Progressive Disclosures)
              ========================================== */}

          {/* 1. UNDERSTANDING SECTION */}
          {activeL2Section === "understanding" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* INTENTS SUBSECTION */}
              {activeSubsection === "intents" && (() => {
                const activeIntent = intents.find(i => i.id === selectedIntentId) || intents[0];
                
                const filteredIntents = intents.filter(i => {
                  const matchesStatus = intentStatusFilter === "All" || i.status === intentStatusFilter;
                  const matchesCategory = intentCategoryFilter === "All" || i.category === intentCategoryFilter;
                  const matchesSearch = i.name.toLowerCase().includes(intentSearchQuery.toLowerCase()) || 
                                        i.id.toLowerCase().includes(intentSearchQuery.toLowerCase()) ||
                                        i.description.toLowerCase().includes(intentSearchQuery.toLowerCase());
                  return matchesStatus && matchesCategory && matchesSearch;
                });

                const updateIntent = (updated: IntentSpec) => {
                  setIntents(intents.map(i => i.id === updated.id ? updated : i));
                };

                const handleIdChange = (oldId: string, newId: string) => {
                  const sanitized = newId.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  if (!sanitized || sanitized === oldId) return;
                  if (intents.some(i => i.id === sanitized)) return; // prevent duplicate IDs
                  setIntents(intents.map(i => i.id === oldId ? { ...i, id: sanitized } : i));
                  setSelectedIntentId(sanitized);
                };

                const isLocked = activeIntent && (activeIntent.status === "Published" || activeIntent.status === "Archived");

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Registry Search & Selector */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="glass p-4.5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Intent Library</span>
                          <button 
                            onClick={handleRegisterIntent}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] rounded-lg text-zinc-300 font-bold transition-all"
                          >
                            <Plus className="w-3 h-3 text-indigo-400" />
                            <span>Add Intent</span>
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-550" />
                          <input 
                            type="text"
                            placeholder="Search intents..."
                            value={intentSearchQuery}
                            onChange={(e) => setIntentSearchQuery(e.target.value)}
                            className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                          />
                        </div>

                        {/* Category Dropdown */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-550 uppercase tracking-widest font-black block">Intent Family</label>
                          <select 
                            value={intentCategoryFilter}
                            onChange={(e) => setIntentCategoryFilter(e.target.value)}
                            className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-medium focus:outline-none focus:border-indigo-500/50"
                          >
                            <option value="All">All Families</option>
                            <option value="Spend & Transaction Intents">Spend & Transaction</option>
                            <option value="Budgeting & Control Intents">Budgeting & Control</option>
                            <option value="Goals & Planning Intents">Goals & Planning</option>
                            <option value="Account & Data Connection Intents">Account & Connection</option>
                            <option value="Insights & Advice Intents">Insights & Advice</option>
                            <option value="Commerce / Agentic Action Intents">Commerce & Action</option>
                            <option value="Investment Intents">Investments</option>
                            <option value="Credit / Loan Intents">Credit & Loans</option>
                            <option value="Support / Recovery Intents">Support & Recovery</option>
                            <option value="Meta / Conversation Control Intents">Meta & Control</option>
                          </select>
                        </div>

                        {/* Status Pills */}
                        <div className="flex gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-900/40">
                          {["All", "Draft", "Published", "Archived"].map((st) => (
                            <button
                              key={st}
                              onClick={() => setIntentStatusFilter(st)}
                              className={clsx(
                                "flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                                intentStatusFilter === st 
                                  ? "bg-indigo-950 text-indigo-400 font-black border border-indigo-900/30" 
                                  : "text-zinc-500 hover:text-zinc-300"
                              )}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Selection List */}
                      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredIntents.length === 0 ? (
                          <div className="p-6 text-center text-zinc-650 text-[11px] font-medium">No intents match query</div>
                        ) : (
                          filteredIntents.map(intent => {
                            const active = activeIntent && activeIntent.id === intent.id;
                            return (
                              <div
                                key={intent.id}
                                onClick={() => setSelectedIntentId(intent.id)}
                                className={clsx(
                                  "p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none",
                                  active 
                                    ? "bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.05)]" 
                                    : "bg-zinc-950/40 border-zinc-900/50 hover:bg-zinc-900/20 hover:border-zinc-800"
                                )}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-black/60 border border-zinc-900 text-zinc-400 font-mono tracking-tight leading-none uppercase">{intent.category.split(" ")[0]}</span>
                                    <span className={clsx(
                                      "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono leading-none border",
                                      intent.status === "Published" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" :
                                      intent.status === "Archived" ? "bg-zinc-900 text-zinc-500 border-zinc-800" :
                                      "bg-amber-950/20 text-amber-400 border-amber-900/30"
                                    )}>
                                      {intent.status}
                                    </span>
                                  </div>
                                  <h5 className={clsx("text-xs font-bold font-mono transition-all", active ? "text-indigo-300" : "text-zinc-300")}>{intent.id}</h5>
                                  <p className="text-[10.5px] text-zinc-500 line-clamp-1 leading-normal font-sans">{intent.description}</p>
                                </div>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-550 border-t border-zinc-900/40 pt-1.5">
                                  <span>v{intent.version}</span>
                                  <span>{intent.signals.length} Signals</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right Column: Spec Details Editor Workspace */}
                    <div className="lg:col-span-8">
                      {activeIntent ? (
                        <div className="glass rounded-2xl border border-zinc-900/60 overflow-hidden flex flex-col">
                          
                          {/* Upper header action bar */}
                          <div className="p-4.5 bg-black/40 border-b border-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-black text-zinc-200 font-mono tracking-tight leading-none">{activeIntent.id}</h4>
                                  <span className={clsx(
                                    "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono leading-none border",
                                    activeIntent.status === "Published" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30 shadow-[0_0_8px_rgba(16,185,129,0.05)]" :
                                    activeIntent.status === "Archived" ? "bg-zinc-900 text-zinc-500 border-zinc-800" :
                                    "bg-amber-950/20 text-amber-400 border-amber-900/30"
                                  )}>
                                    {activeIntent.status}
                                  </span>
                                </div>
                                <span className="text-[9px] text-zinc-550 block font-mono">Intent Spec Schema v{activeIntent.version} • Owner: {activeIntent.owner}</span>
                              </div>
                            </div>

                            {/* CRUD Control Actions */}
                            <div className="flex items-center flex-wrap gap-2 shrink-0">
                              {/* Sub-tab selection */}
                              <div className="flex gap-0.5 bg-zinc-950 border border-zinc-900 rounded-lg p-0.5 mr-2">
                                <button
                                  onClick={() => setActiveIntentDetailTab("configure")}
                                  className={clsx(
                                    "px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-wider rounded transition-all",
                                    activeIntentDetailTab === "configure" ? "bg-indigo-950 text-indigo-400 font-black" : "text-zinc-500 hover:text-zinc-300"
                                  )}
                                >
                                  Configure
                                </button>
                                <button
                                  onClick={() => setActiveIntentDetailTab("history")}
                                  className={clsx(
                                    "px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-wider rounded transition-all",
                                    activeIntentDetailTab === "history" ? "bg-indigo-950 text-indigo-400 font-black" : "text-zinc-500 hover:text-zinc-300"
                                  )}
                                >
                                  Version History ({activeIntent.versionHistory?.length || 0})
                                </button>
                              </div>

                              <button 
                                onClick={() => handleDuplicateIntent(activeIntent)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                title="Duplicate Spec"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase font-bold hidden md:inline">Clone</span>
                              </button>

                              {activeIntent.status === "Archived" ? (
                                <button 
                                  onClick={() => handleRestoreIntent(activeIntent)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                  title="Restore spec as Draft"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span className="text-[10px] uppercase font-bold hidden md:inline">Restore</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleArchiveIntent(activeIntent)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                  title="Archive Spec (Readonly Mode)"
                                >
                                  <Save className="w-3.5 h-3.5 text-zinc-500" />
                                  <span className="text-[10px] uppercase font-bold hidden md:inline">Archive</span>
                                </button>
                              )}

                              <button 
                                onClick={() => handlePublishIntent(activeIntent)}
                                className={clsx(
                                  "px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all active:scale-95 flex items-center space-x-1 border",
                                  activeIntent.status === "Published" 
                                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30 cursor-default" 
                                    : "bg-indigo-650 hover:bg-indigo-600 text-white border-indigo-500"
                                )}
                                disabled={activeIntent.status === "Published"}
                                title="Publish current configuration specs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Publish</span>
                              </button>

                              <button 
                                onClick={() => {
                                  if (confirm("Are you sure you want to completely delete this intent spec? This action is irreversible.")) {
                                    handleDeleteIntent(activeIntent.id);
                                  }
                                }}
                                className={clsx(
                                  "p-1.5 rounded-lg border transition-all text-xs font-medium active:scale-95 flex items-center space-x-1",
                                  isLocked 
                                    ? "bg-zinc-950 text-zinc-700 border-zinc-950 cursor-not-allowed" 
                                    : "bg-red-950/20 hover:bg-red-900/20 text-red-400 border-red-900/30"
                                )}
                                disabled={isLocked}
                                title="Delete Spec Draft"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Spec Lock Banner when Published/Archived */}
                          {isLocked && (
                            <div className="px-4.5 py-2.5 bg-indigo-950/20 border-b border-indigo-900/20 flex items-center space-x-2 text-[10.5px] text-indigo-400 font-mono">
                              <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>SPEC LOCK: This specification version is <b>{activeIntent.status.toUpperCase()}</b> and read-only. Duplicate this spec or release a new draft to edit.</span>
                            </div>
                          )}

                          {activeIntentDetailTab === "configure" ? (
                            <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar max-h-[580px]">
                              {/* Metadata editor grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Intent ID (Slug)</label>
                                  <input 
                                    type="text"
                                    value={activeIntent.id}
                                    onChange={(e) => handleIdChange(activeIntent.id, e.target.value)}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Intent Display Name</label>
                                  <input 
                                    type="text"
                                    value={activeIntent.name}
                                    onChange={(e) => updateIntent({ ...activeIntent, name: e.target.value })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Intent Family Category</label>
                                <select 
                                  value={activeIntent.category}
                                  onChange={(e) => updateIntent({ ...activeIntent, category: e.target.value })}
                                  disabled={isLocked}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-medium focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                >
                                  <option value="Spend & Transaction Intents">Spend & Transaction</option>
                                  <option value="Budgeting & Control Intents">Budgeting & Control</option>
                                  <option value="Goals & Planning Intents">Goals & Planning</option>
                                  <option value="Account & Data Connection Intents">Account & Connection</option>
                                  <option value="Insights & Advice Intents">Insights & Advice</option>
                                  <option value="Commerce / Agentic Action Intents">Commerce & Action</option>
                                  <option value="Investment Intents">Investments</option>
                                  <option value="Credit / Loan Intents">Credit & Loans</option>
                                  <option value="Support / Recovery Intents">Support & Recovery</option>
                                  <option value="Meta / Conversation Control Intents">Meta & Control</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Description</label>
                                <textarea 
                                  value={activeIntent.description}
                                  onChange={(e) => updateIntent({ ...activeIntent, description: e.target.value })}
                                  disabled={isLocked}
                                  rows={2}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 resize-none font-medium leading-normal"
                                />
                              </div>

                              <div className="space-y-1.5 p-4 bg-zinc-950/40 border border-zinc-900/60 rounded-xl">
                                <div className="flex items-center justify-between text-xs font-bold">
                                  <span className="text-zinc-400">Trigger Confidence Threshold</span>
                                  <span className="text-indigo-400 font-mono">{(activeIntent.confidenceThreshold * 100).toFixed(0)}%</span>
                                </div>
                                <p className="text-[10px] text-zinc-550 leading-relaxed">
                                  Minimum NLU classifier probability before this intent is routed. Below this, the clarification policy is executed.
                                </p>
                                <div className="flex items-center space-x-4">
                                  <input 
                                    type="range"
                                    min="0.00"
                                    max="1.00"
                                    step="0.05"
                                    value={activeIntent.confidenceThreshold}
                                    onChange={(e) => updateIntent({ ...activeIntent, confidenceThreshold: parseFloat(e.target.value) })}
                                    disabled={isLocked}
                                    className="flex-1 accent-indigo-500 bg-zinc-900 h-1 rounded-full cursor-pointer disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Clarification Policy</label>
                                <input 
                                  type="text"
                                  value={activeIntent.clarificationPolicy}
                                  onChange={(e) => updateIntent({ ...activeIntent, clarificationPolicy: e.target.value })}
                                  disabled={isLocked}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 font-medium"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Owner Team</label>
                                <input 
                                  type="text"
                                  value={activeIntent.owner}
                                  onChange={(e) => updateIntent({ ...activeIntent, owner: e.target.value })}
                                  disabled={isLocked}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 font-mono"
                                />
                              </div>

                              {/* Array Managers */}
                              <div className="border-t border-zinc-950 pt-4 space-y-4">
                                <h4 className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Intent Signal & Context Mapping</h4>

                                {/* Signals Array */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">State Signals / Context Keys</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.signals.map((sig, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-indigo-400 font-mono">
                                        <span>{sig}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, signals: activeIntent.signals.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-450 transition-all font-black text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Signal..."
                                          value={newIntentSignal}
                                          onChange={(e) => setNewIntentSignal(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentSignal.trim()) {
                                              updateIntent({ ...activeIntent, signals: [...activeIntent.signals, newIntentSignal.trim()] });
                                              setNewIntentSignal("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none focus:border-indigo-500/40"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentSignal.trim()) {
                                              updateIntent({ ...activeIntent, signals: [...activeIntent.signals, newIntentSignal.trim()] });
                                              setNewIntentSignal("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Examples Array */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Positive Training Examples</label>
                                  <div className="space-y-1.5">
                                    {activeIntent.examples.map((ex, idx) => (
                                      <div key={idx} className="flex items-start justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-900/60 text-xs text-zinc-300 leading-normal font-medium">
                                        <span className="flex-1 pr-4">“{ex}”</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, examples: activeIntent.examples.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold shrink-0 text-[10px]"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex space-x-2">
                                        <input 
                                          type="text"
                                          placeholder="Type a query training example..."
                                          value={newIntentExample}
                                          onChange={(e) => setNewIntentExample(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentExample.trim()) {
                                              updateIntent({ ...activeIntent, examples: [...activeIntent.examples, newIntentExample.trim()] });
                                              setNewIntentExample("");
                                            }
                                          }}
                                          className="flex-1 bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentExample.trim()) {
                                              updateIntent({ ...activeIntent, examples: [...activeIntent.examples, newIntentExample.trim()] });
                                              setNewIntentExample("");
                                            }
                                          }}
                                          className="px-3 bg-zinc-900 border border-zinc-800 text-zinc-350 hover:text-zinc-150 rounded-xl text-xs font-bold"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Negative Examples */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Negative Ambiguous Examples</label>
                                  <div className="space-y-1.5">
                                    {activeIntent.negativeExamples?.map((ex, idx) => (
                                      <div key={idx} className="flex items-start justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-900/60 text-xs text-zinc-400 leading-normal font-mono">
                                        <span className="flex-1 pr-4">“{ex}”</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, negativeExamples: activeIntent.negativeExamples.filter((_, i) => i !== idx) })}
                                            className="text-zinc-655 hover:text-red-455 font-bold shrink-0 text-[10px]"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex space-x-2">
                                        <input 
                                          type="text"
                                          placeholder="Type a negative example/phrase that should NOT trigger..."
                                          value={newIntentNegativeExample}
                                          onChange={(e) => setNewIntentNegativeExample(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentNegativeExample.trim()) {
                                              updateIntent({ ...activeIntent, negativeExamples: [...(activeIntent.negativeExamples || []), newIntentNegativeExample.trim()] });
                                              setNewIntentNegativeExample("");
                                            }
                                          }}
                                          className="flex-1 bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentNegativeExample.trim()) {
                                              updateIntent({ ...activeIntent, negativeExamples: [...(activeIntent.negativeExamples || []), newIntentNegativeExample.trim()] });
                                              setNewIntentNegativeExample("");
                                            }
                                          }}
                                          className="px-3 bg-zinc-900 border border-zinc-800 text-zinc-355 hover:text-zinc-155 rounded-xl text-xs font-bold"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Required Entities */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Required Entity Class Bindings</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.requiredEntities.map((ent, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 font-mono">
                                        <span className="text-zinc-500 font-black">@</span><span>{ent}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, requiredEntities: activeIntent.requiredEntities.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <select 
                                        onChange={(e) => {
                                          if (e.target.value && !activeIntent.requiredEntities.includes(e.target.value)) {
                                            updateIntent({ ...activeIntent, requiredEntities: [...activeIntent.requiredEntities, e.target.value] });
                                          }
                                          e.target.value = "";
                                        }}
                                        className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 w-32 focus:outline-none"
                                      >
                                        <option value="">+ Bind Entity...</option>
                                        {entities.map(e => (
                                          <option key={e.id} value={e.id}>{e.id}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                </div>

                                {/* Optional Entities */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Optional Entity Class Bindings</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.optionalEntities.map((ent, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-500 font-mono">
                                        <span className="text-zinc-600 font-black">@</span><span>{ent}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, optionalEntities: activeIntent.optionalEntities.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <select 
                                        onChange={(e) => {
                                          if (e.target.value && !activeIntent.optionalEntities.includes(e.target.value)) {
                                            updateIntent({ ...activeIntent, optionalEntities: [...activeIntent.optionalEntities, e.target.value] });
                                          }
                                          e.target.value = "";
                                        }}
                                        className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 w-32 focus:outline-none"
                                      >
                                        <option value="">+ Bind Entity...</option>
                                        {entities.map(e => (
                                          <option key={e.id} value={e.id}>{e.id}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                </div>

                                {/* Eligible Journeys */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Eligible Milestone Journeys</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.eligibleJourneys.map((j, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-indigo-400 font-mono">
                                        <span>{j}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, eligibleJourneys: activeIntent.eligibleJourneys.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Journey..."
                                          value={newIntentJourney}
                                          onChange={(e) => setNewIntentJourney(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentJourney.trim()) {
                                              updateIntent({ ...activeIntent, eligibleJourneys: [...activeIntent.eligibleJourneys, newIntentJourney.trim()] });
                                              setNewIntentJourney("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentJourney.trim()) {
                                              updateIntent({ ...activeIntent, eligibleJourneys: [...activeIntent.eligibleJourneys, newIntentJourney.trim()] });
                                              setNewIntentJourney("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Eligible Tools */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Eligible Tool Capabilities</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.eligibleTools.map((t, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-indigo-400 font-mono">
                                        <span>{t}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, eligibleTools: activeIntent.eligibleTools.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Tool..."
                                          value={newIntentTool}
                                          onChange={(e) => setNewIntentTool(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentTool.trim()) {
                                              updateIntent({ ...activeIntent, eligibleTools: [...activeIntent.eligibleTools, newIntentTool.trim()] });
                                              setNewIntentTool("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentTool.trim()) {
                                              updateIntent({ ...activeIntent, eligibleTools: [...activeIntent.eligibleTools, newIntentTool.trim()] });
                                              setNewIntentTool("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Default Goals */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Default Operational Goals</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.defaultGoals.map((g, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-emerald-400 font-mono">
                                        <span>{g}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, defaultGoals: activeIntent.defaultGoals.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Goal..."
                                          value={newIntentGoal}
                                          onChange={(e) => setNewIntentGoal(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentGoal.trim()) {
                                              updateIntent({ ...activeIntent, defaultGoals: [...activeIntent.defaultGoals, newIntentGoal.trim()] });
                                              setNewIntentGoal("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentGoal.trim()) {
                                              updateIntent({ ...activeIntent, defaultGoals: [...activeIntent.defaultGoals, newIntentGoal.trim()] });
                                              setNewIntentGoal("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Response Contracts */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Constitutional Response Contracts</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeIntent.responseContracts.map((rc, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-amber-400 font-mono">
                                        <span>{rc}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateIntent({ ...activeIntent, responseContracts: activeIntent.responseContracts.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Contract..."
                                          value={newIntentContract}
                                          onChange={(e) => setNewIntentContract(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newIntentContract.trim()) {
                                              updateIntent({ ...activeIntent, responseContracts: [...activeIntent.responseContracts, newIntentContract.trim()] });
                                              setNewIntentContract("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newIntentContract.trim()) {
                                              updateIntent({ ...activeIntent, responseContracts: [...activeIntent.responseContracts, newIntentContract.trim()] });
                                              setNewIntentContract("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Timeline & Rollback controls */
                            <div className="p-5 space-y-6 overflow-y-auto max-h-[580px] custom-scrollbar">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Historical Publish Snapshot Log</h5>
                                <p className="text-[11px] text-zinc-550 leading-relaxed font-sans">
                                  Every version change creates an immutable snapshot entry log. Compare past revisions side-by-side and roll back with a single click.
                                </p>
                              </div>

                              {(!activeIntent.versionHistory || activeIntent.versionHistory.length === 0) ? (
                                <div className="p-8 text-center text-zinc-650 text-xs border border-zinc-900/60 border-dashed rounded-xl font-medium">
                                  No historical versions published yet. Publish this intent to start version history logs.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                  {/* Left list of history entries */}
                                  <div className="space-y-3.5">
                                    {activeIntent.versionHistory.map((snap, idx) => {
                                      const active = compareIntentVersion === snap.version;
                                      return (
                                        <div 
                                          key={idx}
                                          onClick={() => setCompareIntentVersion(active ? null : snap.version)}
                                          className={clsx(
                                            "p-3.5 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-2.5",
                                            active 
                                              ? "bg-indigo-950/20 border-indigo-500/30" 
                                              : "bg-zinc-950/40 border-zinc-900/50 hover:bg-zinc-900/10 hover:border-zinc-800"
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold font-mono text-indigo-400">{snap.version}</span>
                                            <span className="text-[9px] text-zinc-550 font-mono">{new Date(snap.timestamp).toLocaleString()}</span>
                                          </div>
                                          <span className="text-[9.5px] text-zinc-400 font-mono">Released by: {snap.author}</span>
                                          {active && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Are you sure you want to rollback to ${snap.version}? This will overwrite active configuration draft.`)) {
                                                  handleRollbackIntent(activeIntent, snap.data);
                                                  setCompareIntentVersion(null);
                                                }
                                              }}
                                              className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white font-bold text-[9.5px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                                            >
                                              <RefreshCw className="w-3 h-3 animate-pulse" />
                                              <span>Rollback to this version</span>
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right side comparative preview */}
                                  <div className="space-y-3.5">
                                    <div className="p-3 bg-zinc-950 border border-zinc-900/60 rounded-xl">
                                      <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest block mb-2 font-black">Comparative Spec Difference View</span>
                                      <pre className="font-mono text-[9px] text-zinc-550 overflow-x-auto max-h-[300px] leading-relaxed custom-scrollbar whitespace-pre select-text p-2 rounded bg-black/60 border border-zinc-900/40">
                                        {compareIntentVersion ? (() => {
                                          const snap = activeIntent.versionHistory?.find(s => s.version === compareIntentVersion);
                                          if (!snap) return "";
                                          return JSON.stringify(snap.data, null, 2);
                                        })() : (
                                          `Select a snapshot version on the left to review its configuration details.`
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="glass p-12 rounded-[22px] border border-zinc-900/60 text-center space-y-2">
                          <Cpu className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
                          <h4 className="text-zinc-300 font-bold text-xs">No Intent Selected</h4>
                          <p className="text-[11px] text-zinc-550 max-w-sm mx-auto">
                            Select an intent from the registry library on the left, or register a new one to define its conversational execution pathways.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {activeSubsection === "user_states" && (() => {
                const activeState = userStates.find(s => s.id === selectedStateId) || userStates[0];

                const filteredStates = userStates.filter(s => {
                  const matchesStatus = stateStatusFilter === "All" || s.status === stateStatusFilter;
                  const matchesCategory = stateCategoryFilter === "All" || s.category === stateCategoryFilter;
                  const matchesSearch = s.name.toLowerCase().includes(stateSearchQuery.toLowerCase()) || 
                                        s.id.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
                                        s.definition.toLowerCase().includes(stateSearchQuery.toLowerCase());
                  return matchesStatus && matchesCategory && matchesSearch;
                });

                const updateState = (updated: CognitiveStateSpec) => {
                  setUserStates(userStates.map(s => s.id === updated.id ? updated : s));
                };

                const handleIdChange = (oldId: string, newId: string) => {
                  const sanitized = newId.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  if (!sanitized || sanitized === oldId) return;
                  if (userStates.some(s => s.id === sanitized)) return;
                  setUserStates(userStates.map(s => s.id === oldId ? { ...s, id: sanitized } : s));
                  setSelectedStateId(sanitized);
                };

                const isLocked = activeState && (activeState.status === "Published" || activeState.status === "Archived");

                const getHue = (hslStr: string) => {
                  const match = hslStr.match(/^(\d+)/);
                  return match ? parseInt(match[1], 10) : 200;
                };

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Registry Search & Selector */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="glass p-4.5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Cognitive User States</span>
                          <button 
                            onClick={handleRegisterState}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] rounded-lg text-zinc-300 font-bold transition-all"
                          >
                            <Plus className="w-3 h-3 text-indigo-400" />
                            <span>Add State</span>
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-550" />
                          <input 
                            type="text"
                            placeholder="Search states..."
                            value={stateSearchQuery}
                            onChange={(e) => setStateSearchQuery(e.target.value)}
                            className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                          />
                        </div>

                        {/* Category Dropdown */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-550 uppercase tracking-widest font-black block">State Family</label>
                          <select 
                            value={stateCategoryFilter}
                            onChange={(e) => setStateCategoryFilter(e.target.value)}
                            className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-medium focus:outline-none focus:border-indigo-500/50"
                          >
                            <option value="All">All Families</option>
                            <option value="Cognitive Load States">Cognitive Load</option>
                            <option value="Confidence States">Confidence</option>
                            <option value="Trust States">Trust</option>
                            <option value="Urgency States">Urgency</option>
                            <option value="Readiness States">Readiness</option>
                            <option value="Financial Awareness States">Financial Awareness</option>
                            <option value="Emotional States">Emotional</option>
                            <option value="Decision States">Decision Boundaries</option>
                            <option value="Conversation Progress States">Conversation Progress</option>
                            <option value="Data / Permission States">Data / Permission</option>
                            <option value="Behavioral Finance States">Behavioral Finance</option>
                            <option value="Learning States">Learning & Education</option>
                          </select>
                        </div>

                        {/* Status Pills */}
                        <div className="flex gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-900/40">
                          {["All", "Draft", "Published", "Archived"].map((st) => (
                            <button
                              key={st}
                              onClick={() => setStateStatusFilter(st)}
                              className={clsx(
                                "flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                                stateStatusFilter === st 
                                  ? "bg-indigo-950 text-indigo-400 font-black border border-indigo-900/30" 
                                  : "text-zinc-500 hover:text-zinc-300"
                              )}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Selection List */}
                      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredStates.length === 0 ? (
                          <div className="p-6 text-center text-zinc-655 text-[11px] font-medium font-sans">No states match query</div>
                        ) : (
                          filteredStates.map(state => {
                            const active = activeState && activeState.id === state.id;
                            return (
                              <div
                                key={state.id}
                                onClick={() => setSelectedStateId(state.id)}
                                className={clsx(
                                  "p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 select-none relative overflow-hidden",
                                  active 
                                    ? "bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.05)]" 
                                    : "bg-zinc-950/40 border-zinc-900/50 hover:bg-zinc-900/20 hover:border-zinc-800"
                                )}
                              >
                                {/* Active subtle color bar left indicator */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 transition-all" style={{ backgroundColor: `hsl(${state.colorHsl})` }} />
                                
                                <div className="space-y-1 pl-1.5">
                                  <div className="flex items-center justify-between">
                                    <span 
                                      style={{ backgroundColor: `hsl(${state.colorHsl} / 0.1)`, color: `hsl(${state.colorHsl})`, borderColor: `hsl(${state.colorHsl} / 0.25)` }}
                                      className="text-[8px] px-1.5 py-0.5 rounded uppercase font-bold border tracking-wider font-mono leading-none"
                                    >
                                      {state.category.split(" ")[0]}
                                    </span>
                                    <span className={clsx(
                                      "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono leading-none border",
                                      state.status === "Published" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" :
                                      state.status === "Archived" ? "bg-zinc-900 text-zinc-500 border-zinc-800" :
                                      "bg-amber-950/20 text-amber-400 border-amber-900/30"
                                    )}>
                                      {state.status}
                                    </span>
                                  </div>
                                  <h5 className={clsx("text-xs font-bold font-mono transition-all", active ? "text-zinc-200" : "text-zinc-450")}>{state.id}</h5>
                                  <p className="text-[10.5px] text-zinc-500 line-clamp-1 leading-normal font-sans">{state.definition}</p>
                                </div>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-550 border-t border-zinc-900/40 pt-1.5 pl-1.5">
                                  <span>v{state.version}</span>
                                  <span>{state.signals.length} Signals</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right Column: Spec Details Editor Workspace */}
                    <div className="lg:col-span-8">
                      {activeState ? (
                        <div className="glass rounded-2xl border border-zinc-900/60 overflow-hidden flex flex-col">
                          
                          {/* Upper header action bar */}
                          <div className="p-4.5 bg-black/40 border-b border-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                style={{ backgroundColor: `hsl(${activeState.colorHsl} / 0.1)`, borderColor: `hsl(${activeState.colorHsl} / 0.25)`, color: `hsl(${activeState.colorHsl})` }}
                                className="p-2 rounded-xl border shrink-0 shadow-sm"
                              >
                                <Activity className="w-4 h-4 animate-pulse" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-black text-zinc-200 font-mono tracking-tight leading-none">{activeState.id}</h4>
                                  <span className={clsx(
                                    "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono leading-none border",
                                    activeState.status === "Published" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30 shadow-[0_0_8px_rgba(16,185,129,0.05)]" :
                                    activeState.status === "Archived" ? "bg-zinc-900 text-zinc-500 border-zinc-800" :
                                    "bg-amber-950/20 text-amber-400 border-amber-900/30"
                                  )}>
                                    {activeState.status}
                                  </span>
                                </div>
                                <span className="text-[9px] text-zinc-550 block font-mono">Cognitive State Spec Schema v{activeState.version} • Owner: {activeState.owner}</span>
                              </div>
                            </div>

                            {/* CRUD Control Actions */}
                            <div className="flex items-center flex-wrap gap-2 shrink-0">
                              {/* Sub-tab selection */}
                              <div className="flex gap-0.5 bg-zinc-950 border border-zinc-900 rounded-lg p-0.5 mr-2">
                                <button
                                  onClick={() => setActiveStateDetailTab("configure")}
                                  className={clsx(
                                    "px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-wider rounded transition-all",
                                    activeStateDetailTab === "configure" ? "bg-indigo-950 text-indigo-400 font-black" : "text-zinc-500 hover:text-zinc-300"
                                  )}
                                >
                                  Configure
                                </button>
                                <button
                                  onClick={() => setActiveStateDetailTab("history")}
                                  className={clsx(
                                    "px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-wider rounded transition-all",
                                    activeStateDetailTab === "history" ? "bg-indigo-950 text-indigo-400 font-black" : "text-zinc-500 hover:text-zinc-300"
                                  )}
                                >
                                  Version History ({activeState.versionHistory?.length || 0})
                                </button>
                              </div>

                              <button 
                                onClick={() => handleDuplicateState(activeState)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                title="Duplicate Spec"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase font-bold hidden md:inline">Clone</span>
                              </button>

                              {activeState.status === "Archived" ? (
                                <button 
                                  onClick={() => handleRestoreState(activeState)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                  title="Restore spec as Draft"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span className="text-[10px] uppercase font-bold hidden md:inline">Restore</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleArchiveState(activeState)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-all font-medium active:scale-95 text-xs flex items-center space-x-1"
                                  title="Archive Spec (Readonly Mode)"
                                >
                                  <Save className="w-3.5 h-3.5 text-zinc-500" />
                                  <span className="text-[10px] uppercase font-bold hidden md:inline">Archive</span>
                                </button>
                              )}

                              <button 
                                onClick={() => handlePublishState(activeState)}
                                className={clsx(
                                  "px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all active:scale-95 flex items-center space-x-1 border",
                                  activeState.status === "Published" 
                                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30 cursor-default" 
                                    : "bg-indigo-650 hover:bg-indigo-600 text-white border-indigo-500"
                                )}
                                disabled={activeState.status === "Published"}
                                title="Publish current configuration specs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Publish</span>
                              </button>

                              <button 
                                onClick={() => {
                                  if (confirm("Are you sure you want to completely delete this state spec? This action is irreversible.")) {
                                    handleDeleteState(activeState.id);
                                  }
                                }}
                                className={clsx(
                                  "p-1.5 rounded-lg border transition-all text-xs font-medium active:scale-95 flex items-center space-x-1",
                                  isLocked 
                                    ? "bg-zinc-950 text-zinc-700 border-zinc-950 cursor-not-allowed" 
                                    : "bg-red-950/20 hover:bg-red-900/20 text-red-400 border-red-900/30"
                                )}
                                disabled={isLocked}
                                title="Delete Spec Draft"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Spec Lock Banner when Published/Archived */}
                          {isLocked && (
                            <div className="px-4.5 py-2.5 bg-indigo-950/20 border-b border-indigo-900/20 flex items-center space-x-2 text-[10.5px] text-indigo-400 font-mono">
                              <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>SPEC LOCK: This specification version is <b>{activeState.status.toUpperCase()}</b> and read-only. Duplicate this spec or release a new draft to edit.</span>
                            </div>
                          )}

                          {activeStateDetailTab === "configure" ? (
                            <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar max-h-[580px]">
                              {/* Metadata editor grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">User State ID (Slug)</label>
                                  <input 
                                    type="text"
                                    value={activeState.id}
                                    onChange={(e) => handleIdChange(activeState.id, e.target.value)}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">State Display Name</label>
                                  <input 
                                    type="text"
                                    value={activeState.name}
                                    onChange={(e) => updateState({ ...activeState, name: e.target.value })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">State Family Category</label>
                                <select 
                                  value={activeState.category}
                                  onChange={(e) => updateState({ ...activeState, category: e.target.value })}
                                  disabled={isLocked}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-medium focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                >
                                  <option value="Cognitive Load States">Cognitive Load</option>
                                  <option value="Confidence States">Confidence</option>
                                  <option value="Trust States">Trust</option>
                                  <option value="Urgency States">Urgency</option>
                                  <option value="Readiness States">Readiness</option>
                                  <option value="Financial Awareness States">Financial Awareness</option>
                                  <option value="Emotional States">Emotional</option>
                                  <option value="Decision States">Decision Boundaries</option>
                                  <option value="Conversation Progress States">Conversation Progress</option>
                                  <option value="Data / Permission States">Data / Permission</option>
                                  <option value="Behavioral Finance States">Behavioral Finance</option>
                                  <option value="Learning States">Learning & Education</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Definition & Purpose</label>
                                <textarea 
                                  value={activeState.definition}
                                  onChange={(e) => updateState({ ...activeState, definition: e.target.value })}
                                  disabled={isLocked}
                                  rows={3}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 resize-none font-medium leading-normal"
                                />
                              </div>

                              {/* Interactive HSL Hue Slider & Glowing Preview */}
                              <div className="p-4 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-zinc-400">Cognitive HSL Spectrum Hue</span>
                                    <span className="font-mono text-zinc-300" style={{ color: `hsl(${activeState.colorHsl})` }}>{getHue(activeState.colorHsl)}° Hue</span>
                                  </div>
                                  <p className="text-[10px] text-zinc-550 leading-relaxed max-w-sm font-sans">
                                    Visual state indicator color. Drag hue range slider to update HSL color map variables dynamically.
                                  </p>
                                  <input 
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={getHue(activeState.colorHsl)}
                                    onChange={(e) => updateState({ ...activeState, colorHsl: `${e.target.value} 80% 60%` })}
                                    disabled={isLocked}
                                    className="w-full accent-indigo-500 bg-zinc-900 h-1 rounded-full cursor-pointer disabled:opacity-50"
                                  />
                                </div>
                                <div className="flex flex-col items-center justify-center shrink-0">
                                  <div 
                                    style={{ 
                                      backgroundColor: `hsl(${activeState.colorHsl})`, 
                                      boxShadow: `0 0 24px hsl(${activeState.colorHsl} / 0.45)`,
                                      borderColor: `hsl(${activeState.colorHsl} / 0.6)`
                                    }} 
                                    className="w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center text-zinc-950"
                                  >
                                    <Activity className="w-6 h-6 animate-pulse" />
                                  </div>
                                  <span className="text-[8px] font-mono text-zinc-500 font-bold uppercase mt-2.5">Spectrum Preview</span>
                                </div>
                              </div>

                              <div className="space-y-1 font-mono">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Owner Team</label>
                                <input 
                                  type="text"
                                  value={activeState.owner}
                                  onChange={(e) => updateState({ ...activeState, owner: e.target.value })}
                                  disabled={isLocked}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 font-mono"
                                />
                              </div>

                              {/* Array Managers */}
                              <div className="border-t border-zinc-950 pt-4 space-y-4">
                                <h4 className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">State Triggers & Strategy Affinity Mapping</h4>

                                {/* Signals Array */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">State Signals / Context Keys</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeState.signals.map((sig, idx) => (
                                      <span 
                                        key={idx} 
                                        style={{ backgroundColor: `hsl(${activeState.colorHsl} / 0.05)`, borderColor: `hsl(${activeState.colorHsl} / 0.25)`, color: `hsl(${activeState.colorHsl})` }}
                                        className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg border font-mono"
                                      >
                                        <span>{sig}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateState({ ...activeState, signals: activeState.signals.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 transition-all font-black text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Signal..."
                                          value={newStateSignal}
                                          onChange={(e) => setNewStateSignal(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newStateSignal.trim()) {
                                              updateState({ ...activeState, signals: [...activeState.signals, newStateSignal.trim()] });
                                              setNewStateSignal("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-28 focus:outline-none focus:border-indigo-500/40"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newStateSignal.trim()) {
                                              updateState({ ...activeState, signals: [...activeState.signals, newStateSignal.trim()] });
                                              setNewStateSignal("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Strategy Affinities Array */}
                                <div className="space-y-2">
                                  <label className="text-[9.5px] text-zinc-500 uppercase font-black font-mono block">Suggested Strategy Affinities / Tactics</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(activeState.strategyAffinities || []).map((strat, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 text-[10.5px] rounded-lg bg-zinc-950 border border-zinc-900 text-indigo-400 font-mono">
                                        <span>{strat}</span>
                                        {!isLocked && (
                                          <button 
                                            onClick={() => updateState({ ...activeState, strategyAffinities: activeState.strategyAffinities.filter((_, i) => i !== idx) })}
                                            className="text-zinc-650 hover:text-red-400 font-bold text-[9px] ml-1"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1">
                                        <input 
                                          type="text"
                                          placeholder="Add Strategy..."
                                          value={newStateStrategyAffinity}
                                          onChange={(e) => setNewStateStrategyAffinity(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newStateStrategyAffinity.trim()) {
                                              updateState({ ...activeState, strategyAffinities: [...(activeState.strategyAffinities || []), newStateStrategyAffinity.trim()] });
                                              setNewStateStrategyAffinity("");
                                            }
                                          }}
                                          className="bg-black/60 border border-zinc-900 rounded-lg py-1 px-2.5 text-[10.5px] text-zinc-300 placeholder-zinc-700 w-32 focus:outline-none"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newStateStrategyAffinity.trim()) {
                                              updateState({ ...activeState, strategyAffinities: [...(activeState.strategyAffinities || []), newStateStrategyAffinity.trim()] });
                                              setNewStateStrategyAffinity("");
                                            }
                                          }}
                                          className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </div>
                          ) : (
                            /* Timeline & Rollback controls */
                            <div className="p-5 space-y-6 overflow-y-auto max-h-[580px] custom-scrollbar">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Historical Publish Snapshot Log</h5>
                                <p className="text-[11px] text-zinc-550 leading-relaxed font-sans">
                                  Every version change creates an immutable snapshot entry log. Compare past revisions side-by-side and roll back with a single click.
                                </p>
                              </div>

                              {(!activeState.versionHistory || activeState.versionHistory.length === 0) ? (
                                <div className="p-8 text-center text-zinc-650 text-xs border border-zinc-900/60 border-dashed rounded-xl font-medium">
                                  No historical versions published yet. Publish this state to start version history logs.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                  {/* Left list of history entries */}
                                  <div className="space-y-3.5">
                                    {activeState.versionHistory.map((snap, idx) => {
                                      const active = compareStateVersion === snap.version;
                                      return (
                                        <div 
                                          key={idx}
                                          onClick={() => setCompareStateVersion(active ? null : snap.version)}
                                          className={clsx(
                                            "p-3.5 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-2.5",
                                            active 
                                              ? "bg-indigo-950/20 border-indigo-500/30" 
                                              : "bg-zinc-950/40 border-zinc-900/50 hover:bg-zinc-900/10 hover:border-zinc-800"
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold font-mono text-indigo-400">{snap.version}</span>
                                            <span className="text-[9px] text-zinc-550 font-mono">{new Date(snap.timestamp).toLocaleString()}</span>
                                          </div>
                                          <span className="text-[9.5px] text-zinc-400 font-mono">Released by: {snap.author}</span>
                                          {active && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Are you sure you want to rollback to ${snap.version}? This will overwrite active configuration draft.`)) {
                                                  handleRollbackState(activeState, snap.data);
                                                  setCompareStateVersion(null);
                                                }
                                              }}
                                              className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white font-bold text-[9.5px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                                            >
                                              <RefreshCw className="w-3 h-3" />
                                              <span>Rollback to this version</span>
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right side comparative preview */}
                                  <div className="space-y-3.5">
                                    <div className="p-3 bg-zinc-950 border border-zinc-900/60 rounded-xl">
                                      <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest block mb-2 font-black">Comparative Spec Difference View</span>
                                      <pre className="font-mono text-[9px] text-zinc-550 overflow-x-auto max-h-[300px] leading-relaxed custom-scrollbar whitespace-pre select-text p-2 rounded bg-black/60 border border-zinc-900/40">
                                        {compareStateVersion ? (() => {
                                          const snap = activeState.versionHistory?.find(s => s.version === compareStateVersion);
                                          if (!snap) return "";
                                          return JSON.stringify(snap.data, null, 2);
                                        })() : (
                                          `Select a snapshot version on the left to review its configuration details.`
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="glass p-12 rounded-[22px] border border-zinc-900/60 text-center space-y-2">
                          <Activity className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
                          <h4 className="text-zinc-300 font-bold text-xs">No State Selected</h4>
                          <p className="text-[11px] text-zinc-550 max-w-sm mx-auto font-sans">
                            Select a user state from the registry on the left, or register a new one to define dynamic strategy mapping parameters.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ENTITIES & ONTOLOGY SUBSECTION */}
              {activeSubsection === "entities" && (() => {
                const activeEntity = entities.find(e => e.id === selectedEntityId) || entities[0];

                const filteredEntities = entities.filter(ent => {
                  const matchesMode = entityModeFilter === "All" || ent.mode === entityModeFilter;
                  const matchesSearch = ent.name.toLowerCase().includes(entitySearchQuery.toLowerCase()) || 
                                        ent.id.toLowerCase().includes(entitySearchQuery.toLowerCase());
                  return matchesMode && matchesSearch;
                });

                const updateEntity = (updated: EntitySpec) => {
                  setEntities(entities.map(e => e.id === updated.id ? updated : e));
                };

                const handleIdChange = (oldId: string, newId: string) => {
                  const sanitized = newId.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  if (!sanitized || sanitized === oldId) return;
                  if (entities.some(e => e.id === sanitized)) return; // prevent duplicate IDs
                  setEntities(entities.map(e => e.id === oldId ? { ...e, id: sanitized } : e));
                  setSelectedEntityId(sanitized);
                };

                const handleModeChange = (newMode: "Authored" | "External" | "Runtime") => {
                  const updated: EntitySpec = { ...activeEntity, mode: newMode };
                  if (newMode === "Authored" && !updated.authoredValues) {
                    updated.authoredValues = ["Default Value"];
                  }
                  if (newMode === "External" && !updated.externalConfig) {
                    updated.externalConfig = {
                      sourceProvider: "default_provider",
                      cardinality: "High",
                      resolutionContract: {
                        inputs: ["raw_entity_text"],
                        outputs: ["canonical_id", "confidence"]
                      },
                      confidencePolicy: {
                        autoResolveAbove: 0.80,
                        askClarificationBelow: 0.50,
                        proceedWithDisclosureRange: "0.50-0.80"
                      },
                      fallbackPolicy: {
                        noMatch: "ask_user",
                        multipleMatches: "disambiguate",
                        providerDown: "degrade_gracefully"
                      },
                      exposedFields: ["canonical_id"]
                    };
                  }
                  if (newMode === "Runtime" && !updated.runtimeDerivationContext) {
                    updated.runtimeDerivationContext = "Derived context description...";
                  }
                  updateEntity(updated);
                };

                const handleRegisterEntity = () => {
                  const newId = `new_entity_${Date.now().toString().slice(-4)}`;
                  const newEnt: EntitySpec = {
                    id: newId,
                    name: "New Custom Entity",
                    mode: "Authored",
                    type: "Category",
                    authoredValues: ["Default Value"],
                    bindings: {
                      intents: [],
                      journeys: [],
                      tools: [],
                      artifacts: [],
                      contracts: []
                    },
                    status: "Draft",
                    version: "v1.0.0",
                    owner: "Product Studio Team",
                    tags: ["custom"],
                    versionHistory: []
                  };
                  setEntities([...entities, newEnt]);
                  setSelectedEntityId(newId);
                  triggerAuditLog("update_strategy", `Registered new entity: ${newId}`);
                };

                const handleDeleteEntity = (id: string) => {
                  const remaining = entities.filter(e => e.id !== id);
                  setEntities(remaining);
                  if (selectedEntityId === id && remaining.length > 0) {
                    setSelectedEntityId(remaining[0].id);
                  }
                  triggerAuditLog("update_strategy", `Deleted entity: ${id}`);
                };

                const handleTypeChange = (newType: EntitySpec["type"]) => {
                  updateEntity({ ...activeEntity, type: newType });
                };

                return (
                  <div className="space-y-5">
                    {/* Header and Filter Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-bold text-zinc-200">Entity Source Orchestrator</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 max-w-xl">
                          Configure low-cardinality direct lists, high-cardinality external resolver microservices with fallbacks, or dynamic runtime extracted variables.
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search entities..."
                            value={entitySearchQuery}
                            onChange={(e) => setEntitySearchQuery(e.target.value)}
                            className="bg-black/80 border border-zinc-850 pl-8 pr-3 py-1.5 rounded-xl text-xs text-zinc-350 placeholder-zinc-500 outline-none w-44 focus:border-zinc-700 transition-colors"
                          />
                          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                          {entitySearchQuery && (
                            <button onClick={() => setEntitySearchQuery("")} className="text-zinc-500 hover:text-zinc-350 absolute right-2.5 top-2.5">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Add Entity Button */}
                        <button 
                          onClick={handleRegisterEntity}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-98"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Register Entity</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode Segmented Controls */}
                    <div className="flex border-b border-zinc-900 pb-2 gap-1.5">
                      {["All", "Authored", "External", "Runtime"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setEntityModeFilter(m)}
                          className={clsx(
                            "px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                            entityModeFilter === m
                              ? "bg-indigo-950 text-indigo-400 border-indigo-500/30"
                              : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-900"
                          )}
                        >
                          {m === "All" ? "All Modes" : `${m} Mode`}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left side list */}
                      <div className="lg:col-span-4 space-y-3.5 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-1">
                          <span>Registry ({filteredEntities.length})</span>
                          <span>Select to Configure</span>
                        </div>

                        {filteredEntities.map((ent) => {
                          const isActive = ent.id === selectedEntityId;
                          const modeColors = 
                            ent.mode === "Authored" ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" :
                            ent.mode === "External" ? "bg-purple-950/40 border-purple-500/20 text-purple-400" :
                            "bg-amber-950/40 border-amber-500/20 text-amber-400";
                          
                          return (
                            <div 
                              key={ent.id}
                              onClick={() => setSelectedEntityId(ent.id)}
                              className={clsx(
                                "p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 text-left relative overflow-hidden",
                                isActive 
                                  ? "bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/5" 
                                  : "bg-zinc-950/20 border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-200 truncate pr-2">{ent.name}</span>
                                <span className={clsx("text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border", modeColors)}>
                                  {ent.mode}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                                <span>id: {ent.id}</span>
                                <span>Type: {ent.type}</span>
                              </div>

                              {/* Preview Info */}
                              <div className="text-[10px] text-zinc-400 bg-black/30 p-1.5 rounded-lg font-mono truncate">
                                {ent.mode === "Authored" && `Values: ${ent.authoredValues?.length || 0}`}
                                {ent.mode === "External" && `Provider: ${ent.externalConfig?.sourceProvider}`}
                                {ent.mode === "Runtime" && "Context-derived"}
                              </div>
                            </div>
                          );
                        })}

                        {filteredEntities.length === 0 && (
                          <div className="p-8 bg-zinc-950/10 border border-zinc-900/60 rounded-2xl text-center space-y-1">
                            <AlertCircle className="w-5 h-5 text-zinc-650 mx-auto" />
                            <p className="text-xs text-zinc-500 font-medium">No matching entities found</p>
                          </div>
                        )}
                      </div>

                      {/* Right side details card */}
                      <div className="lg:col-span-8">
                        {activeEntity ? (
                          <div className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-5">
                            
                            {/* Card Header & Controls */}
                            <div className="flex items-center justify-between border-b border-zinc-950 pb-3">
                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-550 uppercase tracking-widest block font-bold font-mono">Entity Configuration Panel</span>
                                <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-1.5">
                                  <span>{activeEntity.name}</span>
                                  <span className="text-xs font-mono font-normal text-zinc-500">(id: {activeEntity.id})</span>
                                </h3>
                              </div>
                              
                              <button 
                                onClick={() => handleDeleteEntity(activeEntity.id)}
                                className="flex items-center space-x-1 px-2.5 py-1.5 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-xs transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Spec</span>
                              </button>
                            </div>

                            {/* Identity Fields Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Entity Name</label>
                                <input 
                                  type="text"
                                  value={activeEntity.name}
                                  onChange={(e) => updateEntity({ ...activeEntity, name: e.target.value })}
                                  className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Entity ID (Runtime key)</label>
                                <input 
                                  type="text"
                                  value={activeEntity.id}
                                  onChange={(e) => handleIdChange(activeEntity.id, e.target.value)}
                                  className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-300 font-mono outline-none focus:border-zinc-700 transition-colors"
                                  placeholder="e.g. merchant_biller"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Entity Mode</label>
                                <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-xl border border-zinc-850">
                                  {["Authored", "External", "Runtime"].map((modeVal) => (
                                    <button
                                      key={modeVal}
                                      onClick={() => handleModeChange(modeVal as "Authored" | "External" | "Runtime")}
                                      className={clsx(
                                        "py-1.5 text-[10.5px] font-bold rounded-lg transition-all",
                                        activeEntity.mode === modeVal
                                          ? "bg-zinc-900 text-indigo-400 font-extrabold"
                                          : "text-zinc-500 hover:text-zinc-300"
                                      )}
                                    >
                                      {modeVal}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Ontology Classification Type</label>
                                <select 
                                  value={activeEntity.type}
                                  onChange={(e) => handleTypeChange(e.target.value as EntitySpec["type"])}
                                  className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-300 outline-none focus:border-zinc-700 transition-colors font-mono"
                                >
                                  {["Merchant", "Category", "UserAccount", "Transaction", "Artifact", "SystemContext"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Mode Specific Dynamic Forms */}
                            <div className="border-t border-zinc-900 pt-4 space-y-4">
                              <span className="text-[10.5px] text-zinc-400 font-bold uppercase tracking-wide block">
                                {activeEntity.mode} Mode Parameters
                              </span>

                              {activeEntity.mode === "Authored" && (
                                <div className="space-y-3">
                                  <p className="text-[10.5px] text-zinc-500 italic">
                                    Authored entities are small lists managed entirely within the studio (e.g. goal types, stages).
                                  </p>

                                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl min-h-[46px] items-center">
                                    {(activeEntity.authoredValues || []).map((val, idx) => (
                                      <span key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                                        <span>{val}</span>
                                        <button 
                                          onClick={() => {
                                            const vals = (activeEntity.authoredValues || []).filter((_, i) => i !== idx);
                                            updateEntity({ ...activeEntity, authoredValues: vals });
                                          }}
                                          className="text-zinc-500 hover:text-red-400 focus:outline-none text-[10px] ml-1"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                    {(!activeEntity.authoredValues || activeEntity.authoredValues.length === 0) && (
                                      <span className="text-zinc-500 italic text-[11px]">No authored values registered yet.</span>
                                    )}
                                  </div>

                                  <div className="flex space-x-2">
                                    <input 
                                      type="text"
                                      placeholder="Type custom value and press enter..."
                                      value={newAuthoredValue}
                                      onChange={(e) => setNewAuthoredValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (newAuthoredValue.trim()) {
                                            const vals = [...(activeEntity.authoredValues || []), newAuthoredValue.trim()];
                                            updateEntity({ ...activeEntity, authoredValues: vals });
                                            setNewAuthoredValue("");
                                          }
                                        }
                                      }}
                                      className="bg-black border border-zinc-850 px-3 py-2 rounded-xl text-xs text-zinc-350 outline-none flex-1 focus:border-zinc-700 transition-colors"
                                    />
                                    <button 
                                      onClick={() => {
                                        if (newAuthoredValue.trim()) {
                                          const vals = [...(activeEntity.authoredValues || []), newAuthoredValue.trim()];
                                          updateEntity({ ...activeEntity, authoredValues: vals });
                                          setNewAuthoredValue("");
                                        }
                                      }}
                                      className="px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-200 transition-colors"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              )}

                              {activeEntity.mode === "External" && activeEntity.externalConfig && (
                                <div className="space-y-4">
                                  <p className="text-[10.5px] text-zinc-500 italic">
                                    Configure connection contracts for external lookups (APIs, BBPS directory, vectors). Do not write list entries manually.
                                  </p>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Source Provider Reference</label>
                                      <input 
                                        type="text"
                                        placeholder="e.g. bbps_biller_directory"
                                        value={activeEntity.externalConfig.sourceProvider}
                                        onChange={(e) => {
                                          updateEntity({
                                            ...activeEntity,
                                            externalConfig: { ...activeEntity.externalConfig!, sourceProvider: e.target.value }
                                          });
                                        }}
                                        className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-200 outline-none focus:border-zinc-700 transition-colors font-mono"
                                      />
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Cardinality Scale</label>
                                      <select 
                                        value={activeEntity.externalConfig.cardinality}
                                        onChange={(e) => {
                                          updateEntity({
                                            ...activeEntity,
                                            externalConfig: { ...activeEntity.externalConfig!, cardinality: e.target.value as "High" | "Medium" }
                                          });
                                        }}
                                        className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-350 outline-none focus:border-zinc-700 transition-colors font-mono"
                                      >
                                        <option value="High">High Cardinality (e.g. merchants, banks)</option>
                                        <option value="Medium">Medium Cardinality (e.g. instruments, products)</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Resolution Contract */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-950 pt-3">
                                    {/* Inputs contract */}
                                    <div className="space-y-2">
                                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Resolution Inputs Contract</span>
                                      <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950/40 border border-zinc-900 rounded-xl min-h-[40px] items-center">
                                        {activeEntity.externalConfig.resolutionContract.inputs.map((inp, idx) => (
                                          <span key={idx} className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10.5px] font-mono text-zinc-300">
                                            <span>{inp}</span>
                                            <button 
                                              onClick={() => {
                                                const inputs = activeEntity.externalConfig!.resolutionContract.inputs.filter((_, i) => i !== idx);
                                                updateEntity({
                                                  ...activeEntity,
                                                  externalConfig: {
                                                    ...activeEntity.externalConfig!,
                                                    resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, inputs }
                                                  }
                                                });
                                              }}
                                              className="text-zinc-500 hover:text-red-400 focus:outline-none"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex space-x-1.5">
                                        <input 
                                          type="text"
                                          placeholder="Add input parameter..."
                                          value={newResolverInput}
                                          onChange={(e) => setNewResolverInput(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              if (newResolverInput.trim()) {
                                                const inputs = [...activeEntity.externalConfig!.resolutionContract.inputs, newResolverInput.trim()];
                                                updateEntity({
                                                  ...activeEntity,
                                                  externalConfig: {
                                                    ...activeEntity.externalConfig!,
                                                    resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, inputs }
                                                  }
                                                });
                                                setNewResolverInput("");
                                              }
                                            }
                                          }}
                                          className="bg-black border border-zinc-850 px-2.5 py-1.5 rounded-lg text-xs text-zinc-350 outline-none flex-1 font-mono"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newResolverInput.trim()) {
                                              const inputs = [...activeEntity.externalConfig!.resolutionContract.inputs, newResolverInput.trim()];
                                              updateEntity({
                                                ...activeEntity,
                                                externalConfig: {
                                                  ...activeEntity.externalConfig!,
                                                  resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, inputs }
                                                }
                                              });
                                              setNewResolverInput("");
                                            }
                                          }}
                                          className="px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 hover:text-zinc-200"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    {/* Outputs contract */}
                                    <div className="space-y-2">
                                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Resolution Outputs Contract</span>
                                      <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950/40 border border-zinc-900 rounded-xl min-h-[40px] items-center">
                                        {activeEntity.externalConfig.resolutionContract.outputs.map((out, idx) => (
                                          <span key={idx} className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10.5px] font-mono text-zinc-300">
                                            <span>{out}</span>
                                            <button 
                                              onClick={() => {
                                                const outputs = activeEntity.externalConfig!.resolutionContract.outputs.filter((_, i) => i !== idx);
                                                updateEntity({
                                                  ...activeEntity,
                                                  externalConfig: {
                                                    ...activeEntity.externalConfig!,
                                                    resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, outputs }
                                                  }
                                                });
                                              }}
                                              className="text-zinc-500 hover:text-red-400 focus:outline-none"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex space-x-1.5">
                                        <input 
                                          type="text"
                                          placeholder="Add output parameter..."
                                          value={newResolverOutput}
                                          onChange={(e) => setNewResolverOutput(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              if (newResolverOutput.trim()) {
                                                const outputs = [...activeEntity.externalConfig!.resolutionContract.outputs, newResolverOutput.trim()];
                                                updateEntity({
                                                  ...activeEntity,
                                                  externalConfig: {
                                                    ...activeEntity.externalConfig!,
                                                    resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, outputs }
                                                  }
                                                });
                                                setNewResolverOutput("");
                                              }
                                            }
                                          }}
                                          className="bg-black border border-zinc-850 px-2.5 py-1.5 rounded-lg text-xs text-zinc-350 outline-none flex-1 font-mono"
                                        />
                                        <button 
                                          onClick={() => {
                                            if (newResolverOutput.trim()) {
                                              const outputs = [...activeEntity.externalConfig!.resolutionContract.outputs, newResolverOutput.trim()];
                                              updateEntity({
                                                ...activeEntity,
                                                externalConfig: {
                                                  ...activeEntity.externalConfig!,
                                                  resolutionContract: { ...activeEntity.externalConfig!.resolutionContract, outputs }
                                                }
                                              });
                                              setNewResolverOutput("");
                                            }
                                          }}
                                          className="px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 hover:text-zinc-200"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Confidence Policies */}
                                  <div className="border-t border-zinc-950 pt-3 space-y-3.5">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Confidence Threshold Policies</span>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                          <label className="text-[10.5px] text-zinc-400">Auto Resolve Above</label>
                                          <span className="text-xs font-mono font-bold text-indigo-400">{activeEntity.externalConfig.confidencePolicy.autoResolveAbove.toFixed(2)}</span>
                                        </div>
                                        <input 
                                          type="range"
                                          min="0.0"
                                          max="1.0"
                                          step="0.05"
                                          value={activeEntity.externalConfig.confidencePolicy.autoResolveAbove}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            const askBelow = activeEntity.externalConfig!.confidencePolicy.askClarificationBelow;
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: {
                                                ...activeEntity.externalConfig!,
                                                confidencePolicy: {
                                                  ...activeEntity.externalConfig!.confidencePolicy,
                                                  autoResolveAbove: val,
                                                  proceedWithDisclosureRange: `${askBelow.toFixed(2)}-${val.toFixed(2)}`
                                                }
                                              }
                                            });
                                          }}
                                          className="w-full accent-indigo-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                                        />
                                      </div>
                                      
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                          <label className="text-[10.5px] text-zinc-400">Clarify/Disambiguate Below</label>
                                          <span className="text-xs font-mono font-bold text-amber-400">{activeEntity.externalConfig.confidencePolicy.askClarificationBelow.toFixed(2)}</span>
                                        </div>
                                        <input 
                                          type="range"
                                          min="0.0"
                                          max="1.0"
                                          step="0.05"
                                          value={activeEntity.externalConfig.confidencePolicy.askClarificationBelow}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            const autoAbove = activeEntity.externalConfig!.confidencePolicy.autoResolveAbove;
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: {
                                                ...activeEntity.externalConfig!,
                                                confidencePolicy: {
                                                  ...activeEntity.externalConfig!.confidencePolicy,
                                                  askClarificationBelow: val,
                                                  proceedWithDisclosureRange: `${val.toFixed(2)}-${autoAbove.toFixed(2)}`
                                                }
                                              }
                                            });
                                          }}
                                          className="w-full accent-amber-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl flex items-center justify-between text-xs">
                                      <span className="text-zinc-400 font-medium">Auto proceed with active disclosures between:</span>
                                      <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-indigo-400 font-mono font-semibold">
                                        {activeEntity.externalConfig.confidencePolicy.proceedWithDisclosureRange}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Fallback Behavior */}
                                  <div className="border-t border-zinc-950 pt-3 space-y-3">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Orchestrator Fallback Behavior</span>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[9.5px] text-zinc-550 uppercase font-black font-mono block">No Match Policy</label>
                                        <input 
                                          type="text"
                                          value={activeEntity.externalConfig.fallbackPolicy.noMatch}
                                          onChange={(e) => {
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: {
                                                ...activeEntity.externalConfig!,
                                                fallbackPolicy: { ...activeEntity.externalConfig!.fallbackPolicy, noMatch: e.target.value }
                                              }
                                            });
                                          }}
                                          className="w-full bg-black border border-zinc-850 p-2 rounded-lg text-xs text-zinc-300 font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9.5px] text-zinc-550 uppercase font-black font-mono block">Multi Match Policy</label>
                                        <input 
                                          type="text"
                                          value={activeEntity.externalConfig.fallbackPolicy.multipleMatches}
                                          onChange={(e) => {
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: {
                                                ...activeEntity.externalConfig!,
                                                fallbackPolicy: { ...activeEntity.externalConfig!.fallbackPolicy, multipleMatches: e.target.value }
                                              }
                                            });
                                          }}
                                          className="w-full bg-black border border-zinc-850 p-2 rounded-lg text-xs text-zinc-300 font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9.5px] text-zinc-550 uppercase font-black font-mono block">Provider Offline</label>
                                        <input 
                                          type="text"
                                          value={activeEntity.externalConfig.fallbackPolicy.providerDown}
                                          onChange={(e) => {
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: {
                                                ...activeEntity.externalConfig!,
                                                fallbackPolicy: { ...activeEntity.externalConfig!.fallbackPolicy, providerDown: e.target.value }
                                              }
                                            });
                                          }}
                                          className="w-full bg-black border border-zinc-850 p-2 rounded-lg text-xs text-zinc-300 font-mono"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Fields exposed to runtime */}
                                  <div className="border-t border-zinc-950 pt-3 space-y-2">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Fields Exposed to Chat Runtime</span>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950/40 border border-zinc-900 rounded-xl min-h-[40px] items-center">
                                      {activeEntity.externalConfig.exposedFields.map((f, idx) => (
                                        <span key={idx} className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10.5px] font-mono text-zinc-300">
                                          <span>{f}</span>
                                          <button 
                                            onClick={() => {
                                              const exposedFields = activeEntity.externalConfig!.exposedFields.filter((_, i) => i !== idx);
                                              updateEntity({
                                                ...activeEntity,
                                                externalConfig: { ...activeEntity.externalConfig!, exposedFields }
                                              });
                                            }}
                                            className="text-zinc-500 hover:text-red-400 focus:outline-none"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex space-x-1.5">
                                      <input 
                                        type="text"
                                        placeholder="Add exposed field key..."
                                        value={newExposedField}
                                        onChange={(e) => setNewExposedField(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (newExposedField.trim()) {
                                              const exposedFields = [...activeEntity.externalConfig!.exposedFields, newExposedField.trim()];
                                              updateEntity({
                                                ...activeEntity,
                                                externalConfig: { ...activeEntity.externalConfig!, exposedFields }
                                              });
                                              setNewExposedField("");
                                            }
                                          }
                                        }}
                                        className="bg-black border border-zinc-850 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 outline-none flex-1 font-mono"
                                      />
                                      <button 
                                        onClick={() => {
                                          if (newExposedField.trim()) {
                                            const exposedFields = [...activeEntity.externalConfig!.exposedFields, newExposedField.trim()];
                                            updateEntity({
                                              ...activeEntity,
                                              externalConfig: { ...activeEntity.externalConfig!, exposedFields }
                                            });
                                            setNewExposedField("");
                                          }
                                        }}
                                        className="px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 hover:text-zinc-200"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeEntity.mode === "Runtime" && (
                                <div className="space-y-2">
                                  <p className="text-[10.5px] text-zinc-500 italic">
                                    Runtime entities are contextually parsed by prompt extraction logic or conversational state filters (e.g. "last month", "yesterday", "it", "that").
                                  </p>
                                  
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Extraction & Resolution Context Rule</label>
                                    <textarea 
                                      rows={4}
                                      value={activeEntity.runtimeDerivationContext || ""}
                                      onChange={(e) => updateEntity({ ...activeEntity, runtimeDerivationContext: e.target.value })}
                                      placeholder="Describe runtime instructions..."
                                      className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-xs text-zinc-300 font-mono outline-none focus:border-zinc-700 leading-relaxed"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Bindings Matrix */}
                            <div className="space-y-3.5 border-t border-zinc-900 pt-4">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block">Ontology Dependency Bindings Matrix</span>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Intents */}
                                <div className="space-y-1.5">
                                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Bound Intents</span>
                                  <div className="max-h-[120px] overflow-y-auto p-2 bg-black/60 border border-zinc-900 rounded-xl space-y-1.5 custom-scrollbar">
                                    {intents.map((int) => {
                                      const checked = activeEntity.bindings.intents.includes(int.id);
                                      return (
                                        <label key={int.id} className="flex items-center space-x-2 text-[10.5px] text-zinc-400 hover:text-zinc-200 cursor-pointer">
                                          <input 
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                              const list = checked 
                                                ? activeEntity.bindings.intents.filter(id => id !== int.id)
                                                : [...activeEntity.bindings.intents, int.id];
                                              updateEntity({
                                                ...activeEntity,
                                                bindings: { ...activeEntity.bindings, intents: list }
                                              });
                                            }}
                                            className="rounded border-zinc-800 bg-black text-indigo-650 focus:ring-0 w-3 h-3"
                                          />
                                          <span className="truncate">{int.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Journeys */}
                                <div className="space-y-1.5">
                                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Bound Journeys</span>
                                  <div className="max-h-[120px] overflow-y-auto p-2 bg-black/60 border border-zinc-900 rounded-xl space-y-1.5 custom-scrollbar">
                                    {journeys.map((j) => {
                                      const checked = activeEntity.bindings.journeys.includes(j.id);
                                      return (
                                        <label key={j.id} className="flex items-center space-x-2 text-[10.5px] text-zinc-400 hover:text-zinc-200 cursor-pointer">
                                          <input 
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                              const list = checked 
                                                ? activeEntity.bindings.journeys.filter(id => id !== j.id)
                                                : [...activeEntity.bindings.journeys, j.id];
                                              updateEntity({
                                                ...activeEntity,
                                                bindings: { ...activeEntity.bindings, journeys: list }
                                              });
                                            }}
                                            className="rounded border-zinc-800 bg-black text-indigo-650 focus:ring-0 w-3 h-3"
                                          />
                                          <span className="truncate">{j.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Tools */}
                                <div className="space-y-1.5">
                                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Bound Tools</span>
                                  <div className="max-h-[120px] overflow-y-auto p-2 bg-black/60 border border-zinc-900 rounded-xl space-y-1.5 custom-scrollbar">
                                    {tools.map((t) => {
                                      const checked = activeEntity.bindings.tools.includes(t.id);
                                      return (
                                        <label key={t.id} className="flex items-center space-x-2 text-[10.5px] text-zinc-400 hover:text-zinc-200 cursor-pointer">
                                          <input 
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                              const list = checked 
                                                ? activeEntity.bindings.tools.filter(id => id !== t.id)
                                                : [...activeEntity.bindings.tools, t.id];
                                              updateEntity({
                                                ...activeEntity,
                                                bindings: { ...activeEntity.bindings, tools: list }
                                              });
                                            }}
                                            className="rounded border-zinc-800 bg-black text-indigo-650 focus:ring-0 w-3 h-3"
                                          />
                                          <span className="truncate">{t.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Artifacts */}
                                <div className="space-y-1.5">
                                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Bound Artifacts</span>
                                  <div className="max-h-[120px] overflow-y-auto p-2 bg-black/60 border border-zinc-900 rounded-xl space-y-1.5 custom-scrollbar">
                                    {artifacts.map((a) => {
                                      const checked = activeEntity.bindings.artifacts.includes(a.id);
                                      return (
                                        <label key={a.id} className="flex items-center space-x-2 text-[10.5px] text-zinc-400 hover:text-zinc-200 cursor-pointer">
                                          <input 
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                              const list = checked 
                                                ? activeEntity.bindings.artifacts.filter(id => id !== a.id)
                                                : [...activeEntity.bindings.artifacts, a.id];
                                              updateEntity({
                                                ...activeEntity,
                                                bindings: { ...activeEntity.bindings, artifacts: list }
                                              });
                                            }}
                                            className="rounded border-zinc-800 bg-black text-indigo-650 focus:ring-0 w-3 h-3"
                                          />
                                          <span className="truncate">{a.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        ) : (
                          <div className="glass p-12 rounded-[22px] border border-zinc-900/60 text-center space-y-2">
                            <Database className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
                            <h4 className="text-zinc-300 font-bold text-xs">No Entity Selected</h4>
                            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                              Select an entity from the registry on the left, or register a new one to define its resolution behaviors.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ENTITY PROVIDERS SUBSECTION */}
              {activeSubsection === "providers" && (() => {
                const activeProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

                const filteredProviders = providers.filter(p => {
                  const matchesStatus = providerStatusFilter === "All" || p.status === providerStatusFilter;
                  const matchesSearch = p.name.toLowerCase().includes(providerSearchQuery.toLowerCase()) || 
                                        p.id.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
                                        p.endpoint.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
                                        p.description.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
                                        p.owner.toLowerCase().includes(providerSearchQuery.toLowerCase());
                  return matchesStatus && matchesSearch;
                });

                const updateProvider = (updated: EntityProviderSpec) => {
                  setProviders(providers.map(p => p.id === updated.id ? updated : p));
                };

                const handleIdChange = (oldId: string, newId: string) => {
                  const sanitized = newId.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  if (!sanitized || sanitized === oldId) return;
                  if (providers.some(p => p.id === sanitized)) return;
                  setProviders(providers.map(p => p.id === oldId ? { ...p, id: sanitized } : p));
                  setSelectedProviderId(sanitized);
                };

                const isLocked = activeProvider && (activeProvider.status === "Published" || activeProvider.status === "Archived");

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: List & Filters */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="glass p-4.5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Resolution Providers</span>
                          <button 
                            onClick={handleRegisterProvider}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] rounded-lg text-zinc-300 font-bold transition-all"
                          >
                            <Plus className="w-3 h-3 text-indigo-400" />
                            <span>Add Provider</span>
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-550" />
                          <input 
                            type="text"
                            placeholder="Search providers..."
                            value={providerSearchQuery}
                            onChange={(e) => setProviderSearchQuery(e.target.value)}
                            className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                          />
                        </div>

                        {/* Status Filter Tab links */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-550 uppercase tracking-widest font-black block">Status Filter</label>
                          <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-950/80 border border-zinc-900/40 rounded-xl">
                            {["All", "Draft", "Published", "Archived"].map(st => (
                              <button
                                key={st}
                                onClick={() => setProviderStatusFilter(st)}
                                className={clsx(
                                  "py-1 text-[9.5px] rounded-lg font-bold transition-all select-none",
                                  providerStatusFilter === st 
                                    ? "bg-zinc-900 text-zinc-200 shadow-sm" 
                                    : "text-zinc-550 hover:text-zinc-400 bg-transparent"
                                )}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Providers Cards List */}
                      <div className="space-y-2 overflow-y-auto max-h-[550px] custom-scrollbar pr-1">
                        {filteredProviders.length === 0 ? (
                          <div className="p-8 text-center text-zinc-650 text-xs border border-zinc-900/60 border-dashed rounded-2xl">
                            No providers match the active filters.
                          </div>
                        ) : (
                          filteredProviders.map(p => {
                            const isSelected = p.id === selectedProviderId;
                            return (
                              <div
                                key={p.id}
                                onClick={() => {
                                  setSelectedProviderId(p.id);
                                  setCompareProviderVersion(null);
                                }}
                                className={clsx(
                                  "p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-2.5",
                                  isSelected 
                                    ? "bg-indigo-950/20 border-indigo-500/30 shadow-md shadow-indigo-950/10" 
                                    : "bg-zinc-950/30 border-zinc-900/55 hover:bg-zinc-900/5 hover:border-zinc-800"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-0.5 max-w-[70%]">
                                    <span className="text-[11.5px] font-bold text-zinc-255 block truncate leading-tight">{p.name}</span>
                                    <span className="text-[9.5px] font-mono text-zinc-500 block truncate">{p.id}</span>
                                  </div>
                                  <span className={clsx(
                                    "text-[8.5px] font-mono px-2 py-0.5 rounded font-bold uppercase",
                                    p.status === "Published" ? "bg-emerald-950/20 text-emerald-450 border border-emerald-900/30" :
                                    p.status === "Archived" ? "bg-zinc-900 text-zinc-500 border border-zinc-800" :
                                    "bg-amber-950/20 text-amber-450 border border-amber-900/30"
                                  )}>
                                    {p.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed font-sans">{p.description}</p>
                                <div className="flex items-center justify-between border-t border-zinc-950/40 pt-2.5 text-[9px] text-zinc-550 font-mono">
                                  <span>{p.authType}</span>
                                  <span className="text-zinc-400 font-bold">{p.version}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right Column: Configuration & History Editor Workspace */}
                    <div className="lg:col-span-8 space-y-4">
                      {activeProvider ? (
                        <div className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-5">
                          {/* Locked/Spec Lock Banner */}
                          {isLocked && (
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex items-center space-x-3 text-xs text-zinc-450">
                              <Lock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                              <div className="flex-1">
                                <span className="font-bold text-zinc-300 uppercase tracking-wide block text-[10px]">Spec Locked ({activeProvider.status})</span>
                                <span className="text-[10.5px]">This provider registry is currently {activeProvider.status.toLowerCase()} and cannot be modified. Restore to Draft to edit.</span>
                              </div>
                              <button 
                                onClick={() => handleRestoreProvider(activeProvider)}
                                className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 rounded-lg text-[9.5px] font-bold text-zinc-300 transition-all border border-zinc-800 active:scale-95"
                              >
                                Restore to Draft
                              </button>
                            </div>
                          )}

                          {/* Detail Header & Action Panel */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-950 pb-4 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2.5">
                                <h3 className="text-sm font-bold text-zinc-200 leading-none">{activeProvider.name}</h3>
                                <span className="text-[9.5px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/35 px-2 py-0.5 rounded">
                                  {activeProvider.version}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500 block">{activeProvider.id}</span>
                            </div>

                            {/* Details Action buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={() => handleDuplicateProvider(activeProvider)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[10.5px] font-bold text-zinc-300 active:scale-95 transition-all"
                              >
                                <Copy className="w-3.5 h-3.5 text-zinc-450" />
                                <span>Duplicate</span>
                              </button>

                              {activeProvider.status !== "Archived" ? (
                                <button
                                  onClick={() => handleArchiveProvider(activeProvider)}
                                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[10.5px] font-bold text-zinc-400 active:scale-95 transition-all"
                                >
                                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>Archive</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRestoreProvider(activeProvider)}
                                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[10.5px] font-bold text-indigo-400 active:scale-95 transition-all"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                                  <span>Restore</span>
                                </button>
                              )}

                              {activeProvider.status !== "Published" && (
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this provider spec permanently?")) {
                                      handleDeleteProvider(activeProvider.id);
                                    }
                                  }}
                                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-red-955/20 border border-zinc-800 hover:border-red-900/30 rounded-lg text-[10.5px] font-bold text-red-455 active:scale-95 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Delete</span>
                                </button>
                              )}

                              <button
                                onClick={() => handlePublishProvider(activeProvider)}
                                disabled={activeProvider.status === "Published"}
                                className={clsx(
                                  "flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold active:scale-95 transition-all shadow-md shadow-indigo-950/15",
                                  activeProvider.status === "Published"
                                    ? "bg-zinc-900 border border-zinc-800 text-zinc-550 opacity-60 cursor-not-allowed"
                                    : "bg-indigo-655 hover:bg-indigo-600 text-white"
                                )}
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Publish spec</span>
                              </button>
                            </div>
                          </div>

                          {/* Inner Tabs Selector */}
                          <div className="flex border-b border-zinc-950 p-0.5 bg-zinc-950/40 rounded-xl w-fit">
                            <button
                              onClick={() => setActiveProviderDetailTab("configure")}
                              className={clsx(
                                "px-3.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all",
                                activeProviderDetailTab === "configure"
                                  ? "bg-indigo-950 text-indigo-400 font-black"
                                  : "text-zinc-500 hover:text-zinc-300 bg-transparent"
                              )}
                            >
                              Configure
                            </button>
                            <button
                              onClick={() => setActiveProviderDetailTab("history")}
                              className={clsx(
                                "px-3.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all",
                                activeProviderDetailTab === "history"
                                  ? "bg-indigo-950 text-indigo-400 font-black"
                                  : "text-zinc-500 hover:text-zinc-300 bg-transparent"
                              )}
                            >
                              History
                            </button>
                          </div>

                          {/* Tab Content Display */}
                          {activeProviderDetailTab === "configure" ? (
                            <div className="space-y-4 font-sans text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Provider Unique ID</label>
                                  <input 
                                    type="text"
                                    value={activeProvider.id}
                                    onChange={(e) => handleIdChange(activeProvider.id, e.target.value)}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Display Name</label>
                                  <input 
                                    type="text"
                                    value={activeProvider.name}
                                    onChange={(e) => updateProvider({ ...activeProvider, name: e.target.value })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Description</label>
                                <textarea 
                                  value={activeProvider.description}
                                  onChange={(e) => updateProvider({ ...activeProvider, description: e.target.value })}
                                  disabled={isLocked}
                                  rows={2}
                                  className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 resize-none leading-relaxed font-medium"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Endpoint URL</label>
                                  <input 
                                    type="text"
                                    value={activeProvider.endpoint}
                                    onChange={(e) => updateProvider({ ...activeProvider, endpoint: e.target.value })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-350 font-mono focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Authentication Method</label>
                                  <select 
                                    value={activeProvider.authType}
                                    onChange={(e) => updateProvider({ ...activeProvider, authType: e.target.value as any })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-medium focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  >
                                    <option value="Bearer Token">Bearer Token</option>
                                    <option value="OAuth 2.0">OAuth 2.0</option>
                                    <option value="mTLS">mTLS</option>
                                    <option value="HMAC Signature">HMAC Signature</option>
                                    <option value="API Key">API Key</option>
                                    <option value="Internal IPC">Internal IPC</option>
                                    <option value="None">None</option>
                                  </select>
                                </div>
                              </div>

                              {/* Rate Limit and Latency SLA Sliders / Presets for Maximum Aesthetics */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-900/60 rounded-xl">
                                  <div className="flex items-center justify-between font-bold text-zinc-400">
                                    <span>Rate Limit Capability</span>
                                    <span className="text-indigo-400 font-mono">{activeProvider.rateLimit}</span>
                                  </div>
                                  <p className="text-[9.5px] text-zinc-550 leading-relaxed font-sans">
                                    Throttling policy applied to resolvers before degrading gracefully.
                                  </p>
                                  <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="50"
                                    value={activeProvider.rateLimit.includes("req") ? parseInt(activeProvider.rateLimit) : 100}
                                    disabled={isLocked || activeProvider.rateLimit.includes("Unlimited") || activeProvider.rateLimit.includes("Local")}
                                    onChange={(e) => updateProvider({ ...activeProvider, rateLimit: `${e.target.value} requests/sec` })}
                                    className="w-full accent-indigo-500 bg-zinc-900 h-1 rounded-full cursor-pointer disabled:opacity-40"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => updateProvider({ ...activeProvider, rateLimit: "Unlimited (Local)" })}
                                      className={clsx(
                                        "px-2 py-0.5 rounded text-[8.5px] font-mono border",
                                        activeProvider.rateLimit.includes("Unlimited") 
                                          ? "bg-indigo-950 text-indigo-400 border-indigo-900/50" 
                                          : "bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-400"
                                      )}
                                    >
                                      Set Unlimited (Local)
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => updateProvider({ ...activeProvider, rateLimit: "250 requests/sec" })}
                                      className={clsx(
                                        "px-2 py-0.5 rounded text-[8.5px] font-mono border",
                                        activeProvider.rateLimit === "250 requests/sec" 
                                          ? "bg-indigo-950 text-indigo-400 border-indigo-900/50" 
                                          : "bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-400"
                                      )}
                                    >
                                      Set standard
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-900/60 rounded-xl">
                                  <div className="flex items-center justify-between font-bold text-zinc-400">
                                    <span>Latency SLA Contract</span>
                                    <span className="text-indigo-400 font-mono">{activeProvider.latencySla}</span>
                                  </div>
                                  <p className="text-[9.5px] text-zinc-550 leading-relaxed font-sans">
                                    Maximum expected response times before fallback timeout is triggered.
                                  </p>
                                  <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    step="10"
                                    value={parseInt(activeProvider.latencySla) || 120}
                                    disabled={isLocked}
                                    onChange={(e) => updateProvider({ ...activeProvider, latencySla: `${e.target.value}ms SLA` })}
                                    className="w-full accent-indigo-500 bg-zinc-900 h-1 rounded-full cursor-pointer disabled:opacity-40"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => updateProvider({ ...activeProvider, latencySla: "15ms instant SLA" })}
                                      className={clsx(
                                        "px-2 py-0.5 rounded text-[8.5px] font-mono border",
                                        activeProvider.latencySla.includes("15ms") 
                                          ? "bg-indigo-950 text-indigo-400 border-indigo-900/50" 
                                          : "bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-400"
                                      )}
                                    >
                                      Set instant (mTLS/IPC)
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => updateProvider({ ...activeProvider, latencySla: "120ms standard SLA" })}
                                      className={clsx(
                                        "px-2 py-0.5 rounded text-[8.5px] font-mono border",
                                        activeProvider.latencySla.includes("120ms") 
                                          ? "bg-indigo-950 text-indigo-400 border-indigo-900/50" 
                                          : "bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-400"
                                      )}
                                    >
                                      Set standard (Cloud Gateway)
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Squad Owner</label>
                                  <input 
                                    type="text"
                                    value={activeProvider.owner}
                                    onChange={(e) => updateProvider({ ...activeProvider, owner: e.target.value })}
                                    disabled={isLocked}
                                    className="w-full bg-black/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                  />
                                </div>

                                <div className="space-y-2 p-3 bg-zinc-950/20 border border-zinc-900/50 rounded-xl">
                                  <label className="text-[10px] text-zinc-550 uppercase tracking-wider font-bold block">Tags</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeProvider.tags.map((tag, tIdx) => (
                                      <span 
                                        key={tIdx}
                                        className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-indigo-300 font-medium select-none"
                                      >
                                        <span>{tag}</span>
                                        {!isLocked && (
                                          <button
                                            type="button"
                                            onClick={() => updateProvider({ ...activeProvider, tags: activeProvider.tags.filter(t => t !== tag) })}
                                            className="text-zinc-550 hover:text-zinc-300 transition-all font-bold"
                                          >
                                            &times;
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                    {!isLocked && (
                                      <div className="flex items-center space-x-1 border border-zinc-900 bg-black/40 rounded-lg px-2">
                                        <input
                                          type="text"
                                          placeholder="New tag..."
                                          value={newProviderTag}
                                          onChange={(e) => setNewProviderTag(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newProviderTag.trim()) {
                                              e.preventDefault();
                                              const cleaned = newProviderTag.trim().toLowerCase();
                                              if (!activeProvider.tags.includes(cleaned)) {
                                                updateProvider({ ...activeProvider, tags: [...activeProvider.tags, cleaned] });
                                              }
                                              setNewProviderTag("");
                                            }
                                          }}
                                          className="bg-transparent border-none focus:outline-none text-[10px] w-14 font-medium text-zinc-400 placeholder-zinc-700"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Historical Publish Snapshot Log</h5>
                                <p className="text-[11px] text-zinc-550 leading-relaxed font-sans">
                                  Every version change creates an immutable snapshot entry log. Compare past revisions side-by-side and roll back with a single click.
                                </p>
                              </div>

                              {(!activeProvider.versionHistory || activeProvider.versionHistory.length === 0) ? (
                                <div className="p-8 text-center text-zinc-650 text-xs border border-zinc-900/60 border-dashed rounded-xl font-medium">
                                  No historical versions published yet. Publish this provider to start version history logs.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                  {/* Left list of history entries */}
                                  <div className="space-y-3.5">
                                    {activeProvider.versionHistory.map((snap, idx) => {
                                      const active = compareProviderVersion === snap.version;
                                      return (
                                        <div 
                                          key={idx}
                                          onClick={() => setCompareProviderVersion(active ? null : snap.version)}
                                          className={clsx(
                                            "p-3.5 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-2.5",
                                            active 
                                              ? "bg-indigo-950/20 border-indigo-500/30" 
                                              : "bg-zinc-950/40 border-zinc-900/50 hover:bg-zinc-900/10 hover:border-zinc-800"
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold font-mono text-indigo-400">{snap.version}</span>
                                            <span className="text-[9px] text-zinc-550 font-mono">{new Date(snap.timestamp).toLocaleString()}</span>
                                          </div>
                                          <span className="text-[9.5px] text-zinc-400 font-mono">Released by: {snap.author}</span>
                                          {active && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Are you sure you want to rollback to ${snap.version}? This will overwrite active configuration draft.`)) {
                                                  handleRollbackProvider(activeProvider, snap.data);
                                                  setCompareProviderVersion(null);
                                                }
                                              }}
                                              className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white font-bold text-[9.5px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                                            >
                                              <RefreshCw className="w-3 h-3 animate-pulse" />
                                              <span>Rollback to this version</span>
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right side comparative preview */}
                                  <div className="space-y-3.5">
                                    <div className="p-3 bg-zinc-950 border border-zinc-900/60 rounded-xl">
                                      <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest block mb-2 font-black">Comparative Spec Difference View</span>
                                      <pre className="font-mono text-[9px] text-zinc-550 overflow-x-auto max-h-[300px] leading-relaxed custom-scrollbar whitespace-pre select-text p-2 rounded bg-black/60 border border-zinc-900/40">
                                        {compareProviderVersion ? (() => {
                                          const snap = activeProvider.versionHistory?.find(s => s.version === compareProviderVersion);
                                          if (!snap) return "";
                                          return JSON.stringify(snap.data, null, 2);
                                        })() : (
                                          `Select a snapshot version on the left to review its configuration details.`
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="glass p-12 rounded-[22px] border border-zinc-900/60 text-center space-y-2">
                          <Database className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
                          <h4 className="text-zinc-300 font-bold text-xs">No Provider Selected</h4>
                          <p className="text-[11px] text-zinc-550 max-w-sm mx-auto">
                            Select an entity provider from the registry list on the left, or register a new custom provider.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* 2. DIRECTION SECTION */}
          {activeL2Section === "direction" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* GOALS SUBSECTION */}
              {activeSubsection === "goals" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Progression Targets</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map(goal => (
                      <div key={goal.id} className="glass p-4 rounded-2xl border border-zinc-900/60 space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                          <span className="text-xs font-bold text-zinc-200">{goal.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-indigo-400">Priority: {goal.priority}</span>
                        </div>
                        <p className="text-[11.5px] text-zinc-400 leading-normal">{goal.targetOutcome}</p>
                        <div className="pt-2 text-[10px] text-zinc-500 font-mono border-t border-zinc-950">
                          <span className="text-[8px] text-zinc-650 uppercase font-black block">Success Verification Condition</span>
                          {goal.successCondition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JOURNEYS SUBSECTION */}
              {activeSubsection === "journeys" && (
                <div className="space-y-5">
                  <div className="p-3 bg-zinc-950/40 border border-zinc-900/50 rounded-xl space-y-1 text-xs">
                    <div className="font-bold text-zinc-300">Milestone Progression state machine graphs (Not Static Flows)</div>
                    <p className="text-[11px] text-zinc-400">Conversations progress based on completed milestone targets. Define start constraints and dynamic transitions.</p>
                  </div>

                  {journeys.map(j => (
                    <div key={j.id} className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2.5">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-zinc-200">{j.name}</h4>
                          <div className="flex space-x-3 text-[9.5px] text-zinc-500 font-mono">
                            <span>Trigger State: <span className="text-rose-400">{j.triggerState}</span></span>
                            <span>Target State: <span className="text-emerald-450">{j.targetState}</span></span>
                          </div>
                        </div>
                        <button className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-[10px] text-zinc-400 rounded"><Edit2 className="w-3 h-3" /> <span>Edit Journey</span></button>
                      </div>

                      {/* Milestone pathway map */}
                      <div className="space-y-2">
                        <span className="text-[8px] text-zinc-600 uppercase font-black font-mono">Progression Milestone Graph</span>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                          {j.milestones.map((ms, idx) => (
                            <div key={idx} className="flex-1 flex items-center space-x-2 bg-zinc-950/40 border border-zinc-900 p-2.5 rounded-xl relative">
                              <div className={clsx("w-2 h-2 rounded-full", ms.status === "completed" ? "bg-emerald-500" : ms.status === "active" ? "bg-indigo-500 animate-pulse" : "bg-zinc-800")} />
                              <div className="flex-1 text-[11px]">
                                <div className="font-bold text-zinc-300">{ms.name}</div>
                                <div className="text-[8.5px] text-zinc-550 font-mono truncate max-w-[120px]" title={ms.targetValue}>{ms.targetValue}</div>
                              </div>
                              {idx < j.milestones.length - 1 && (
                                <ChevronRight className="hidden md:block w-4 h-4 text-zinc-800 absolute -right-3 top-[35%] z-20" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[10px] border-t border-zinc-950 pt-3 text-zinc-500 font-mono">
                        <div>
                          <span className="text-[7.5px] text-zinc-600 uppercase font-bold block mb-0.5">Start Constraint Rule</span>
                          {j.startCondition}
                        </div>
                        <div>
                          <span className="text-[7.5px] text-zinc-600 uppercase font-bold block mb-0.5">Completion Target Rule</span>
                          {j.completionCondition}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* JOURNEY ARBITRATION SUBSECTION */}
              {activeSubsection === "arbitration" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Arbitration policies & Suppression Matrices</span>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-[10.5px] rounded-lg text-zinc-300 font-bold transition-all"><Plus className="w-3 h-3" /> <span>Add Arbitration Rule</span></button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {arbitrationRules.map(rule => (
                      <div key={rule.id} className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-950 pb-2.5">
                          <span className="text-xs font-bold text-zinc-200">{rule.id.replace(/_/g, " ")}</span>
                          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-900/40 text-rose-400 uppercase font-black">Active Suppression</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                          <div className="space-y-1">
                            <span className="text-[8px] text-zinc-600 uppercase font-black font-mono">Primary Active Path</span>
                            <div className="bg-zinc-950/60 border border-zinc-900 p-2 rounded-lg font-mono text-[10.5px] text-zinc-350">{rule.primaryJourneyId}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] text-zinc-650 uppercase font-black font-mono">Suppressed Pathway</span>
                            <div className="bg-zinc-950/60 border border-zinc-900 p-2 rounded-lg font-mono text-[10.5px] text-zinc-350">{rule.suppressJourneyId}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] text-zinc-600 uppercase font-black font-mono">Suppression Constraint Condition</span>
                            <div className="bg-zinc-950/60 border border-zinc-900 p-2 rounded-lg font-mono text-[10.5px] text-zinc-350">{rule.suppressCondition}</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-zinc-950 pt-3.5">
                          <div className="flex-1 space-y-1 text-xs">
                            <div className="flex justify-between text-[10.5px]">
                              <span className="text-zinc-550">Relevance Arbitration Weight</span>
                              <span className="text-indigo-400 font-bold font-mono">{(rule.relevanceWeight * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rule.relevanceWeight * 100}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-[10.5px] text-zinc-550 shrink-0 font-mono">
                            <span>Priority Threshold:</span>
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-350 font-bold">{rule.priorityLevel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 3. BEHAVIOR SECTION */}
          {activeL2Section === "behavior" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* STRATEGIES REGISTRY SUBSECTION */}
              {activeSubsection === "strategies" && (
                <DomainStrategies />
              )}

              {/* STRATEGY MIXER SUBSECTION */}
              {activeSubsection === "mixer" && (
                <div className="space-y-5">
                  <div className="p-3 bg-zinc-950/40 border border-zinc-900/50 rounded-xl space-y-1 text-xs">
                    <div className="font-bold text-zinc-300">Strategy Mixer (Weighted Strategy Blending)</div>
                    <p className="text-[11px] text-zinc-400">Do not hard-route one single strategy. Calibrate weighted percentage blends of strategy families conditioned to user state vectors.</p>
                  </div>

                  {strategyMixers.map((mixer, idx) => (
                    <div key={idx} className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <span className="text-xs font-bold text-zinc-200">State Vector: {mixer.stateId.replace(/_/g, " ").toUpperCase()}</span>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">Blend Allocations</span>
                      </div>

                      {/* Blending Sliders */}
                      <div className="space-y-3.5 text-xs">
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-zinc-400 font-medium">Direct Answer Strategy</span>
                            <span className="text-indigo-400 font-bold font-mono">{(mixer.directAnswerWeight * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={mixer.directAnswerWeight * 100}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) / 100;
                                const nextMixers = [...strategyMixers];
                                nextMixers[idx].directAnswerWeight = val;
                                // Simple auto-balances weights sum
                                const remaining = 1 - val;
                                nextMixers[idx].reassuranceWeight = remaining * 0.7;
                                nextMixers[idx].educationWeight = remaining * 0.3;
                                setStrategyMixers(nextMixers);
                              }}
                              className="flex-1 accent-indigo-500 bg-zinc-900 h-1.5 rounded-lg appearance-none outline-none" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-zinc-400 font-medium">Conversational Reassurance Strategy</span>
                            <span className="text-indigo-400 font-bold font-mono">{(mixer.reassuranceWeight * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={mixer.reassuranceWeight * 100}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) / 100;
                                const nextMixers = [...strategyMixers];
                                nextMixers[idx].reassuranceWeight = val;
                                const remaining = 1 - val;
                                nextMixers[idx].directAnswerWeight = remaining * 0.8;
                                nextMixers[idx].educationWeight = remaining * 0.2;
                                setStrategyMixers(nextMixers);
                              }}
                              className="flex-1 accent-indigo-500 bg-zinc-900 h-1.5 rounded-lg appearance-none outline-none" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-zinc-400 font-medium">Educational Value Articulation</span>
                            <span className="text-indigo-400 font-bold font-mono">{(mixer.educationWeight * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={mixer.educationWeight * 100}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) / 100;
                                const nextMixers = [...strategyMixers];
                                nextMixers[idx].educationWeight = val;
                                const remaining = 1 - val;
                                nextMixers[idx].directAnswerWeight = remaining * 0.6;
                                nextMixers[idx].reassuranceWeight = remaining * 0.4;
                                setStrategyMixers(nextMixers);
                              }}
                              className="flex-1 accent-indigo-500 bg-zinc-900 h-1.5 rounded-lg appearance-none outline-none" 
                            />
                          </div>
                        </div>

                      </div>

                      {/* Visual blending representation bar */}
                      <div className="space-y-1.5 text-[9.5px]">
                        <span className="text-zinc-550 block font-mono uppercase font-bold">Live Blended allocation Preview</span>
                        <div className="h-5 rounded-xl bg-zinc-950 overflow-hidden flex text-center font-bold text-[8.5px] leading-[20px] text-zinc-150 font-mono border border-zinc-900">
                          <div className="bg-indigo-650/80 transition-all border-r border-zinc-950/60" style={{ width: `${mixer.directAnswerWeight * 100}%` }}>DIRECT: {(mixer.directAnswerWeight * 100).toFixed(0)}%</div>
                          <div className="bg-purple-650/80 transition-all border-r border-zinc-950/60" style={{ width: `${mixer.reassuranceWeight * 100}%` }}>REASSURE: {(mixer.reassuranceWeight * 100).toFixed(0)}%</div>
                          <div className="bg-amber-650/80 transition-all" style={{ width: `${mixer.educationWeight * 100}%` }}>EDUCATE: {(mixer.educationWeight * 100).toFixed(0)}%</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-950 text-[10px] text-zinc-500 font-mono">
                        <span className="text-[7.5px] text-zinc-650 uppercase font-black block mb-0.5">Conflict Resolution policy</span>
                        {mixer.conflictResolutionPolicy}
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* TACTICS SUBSECTION */}
              {activeSubsection === "tactics" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Conversational Tactics Library</span>
                  {tactics.map(t => (
                    <div key={t.id} className="glass p-4.5 rounded-2xl border border-zinc-900/60 space-y-3.5">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-zinc-200">{t.name}</h4>
                          <span className="text-[8.5px] text-zinc-500 font-mono">Family: {t.family}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-indigo-400 border border-zinc-800 text-[8.5px] font-mono">Intensity: {t.intensity}</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="text-[8px] text-zinc-600 font-bold block uppercase font-mono">Linguistic Pattern Definition</span>
                        <p className="text-zinc-350 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-zinc-900/60">{t.linguisticPattern}</p>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="text-[8px] text-zinc-600 font-bold block uppercase font-mono">Conversational Real-World Example</span>
                        <p className="text-emerald-450 italic bg-black/40 p-2.5 rounded-xl border border-zinc-900/60">"{t.exampleText}"</p>
                      </div>

                      <div className="pt-2.5 border-t border-zinc-950 text-[9.5px] text-zinc-550 font-mono">
                        Expected Success Signals: {t.successSignals.join(" | ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 4. EXECUTION SECTION */}
          {activeL2Section === "execution" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* TOOLS SUBSECTION */}
              {activeSubsection === "tools" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Executable Capabilities Spec Contracts</span>
                  {tools.map(tool => (
                    <div key={tool.id} className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">{tool.name}</h4>
                          <span className="text-[8.5px] text-zinc-550 font-mono">API Target: {tool.apiEndpoint}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-indigo-400 border border-zinc-800 text-[8.5px] font-mono font-bold uppercase">{tool.id}</span>
                      </div>

                      <p className="text-xs text-zinc-450">{tool.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[8px] text-zinc-600 uppercase font-black font-mono block">Inputs Parameters Contract</span>
                          <div className="bg-black/40 border border-zinc-900 p-2 rounded-xl text-[9px] font-mono text-zinc-400 space-y-1">
                            {tool.inputs.map(inp => (
                              <div key={inp.name} className="flex justify-between">
                                <span>{inp.name} ({inp.type})</span>
                                <span className={inp.required ? "text-rose-500 font-bold text-[7.5px] uppercase" : "text-zinc-600 text-[7.5px] uppercase"}>{inp.required ? "required" : "optional"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] text-zinc-600 uppercase font-black font-mono block">Outputs Return Contract</span>
                          <div className="bg-black/40 border border-zinc-900 p-2 rounded-xl text-[9px] font-mono text-zinc-400 space-y-1">
                            {tool.outputs.map(out => (
                              <div key={out.name} className="flex justify-between">
                                <span>{out.name}</span>
                                <span className="text-indigo-500 font-mono text-[7.5px]">{out.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-950 text-[10px] text-zinc-550 font-mono">
                        <span className="text-[7.5px] text-zinc-600 uppercase font-black block mb-0.5">Failure Fallback Strategy</span>
                        {tool.failureFallback}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ARTIFACTS SUBSECTION */}
              {activeSubsection === "artifacts" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Persistent Runtime Objects</span>
                  {artifacts.map(a => (
                    <div key={a.id} className="glass p-4 rounded-xl border border-zinc-900/60 space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <span className="text-xs font-bold text-zinc-200">{a.name} ({a.id})</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8.5px] text-indigo-400 font-mono font-bold uppercase">{a.persistence} Memory</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[8px] text-zinc-650 uppercase font-black font-mono block">JSON Spec Schema Definition</span>
                        <pre className="bg-black/40 border border-zinc-900 p-2.5 rounded-xl font-mono text-[9px] text-zinc-400 leading-normal">{a.schema}</pre>
                      </div>
                      <div className="pt-2 text-[9.5px] text-zinc-550 font-mono border-t border-zinc-950">
                        TTL Retention Limit: {a.ttlSeconds} seconds ({a.ttlSeconds / 60} minutes)
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PERMISSIONS SUBSECTION */}
              {activeSubsection === "permissions" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Action Security Restrictions</span>
                  {permissions.map(p => (
                    <div key={p.id} className="glass p-4 rounded-xl border border-zinc-900/60 space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <span className="text-xs font-bold text-zinc-200">Rule: {p.id.replace(/_/g, " ").toUpperCase()}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/40 text-[8.5px] text-amber-400 font-mono font-black uppercase tracking-wider">{p.securityClearance}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[7.5px] text-zinc-650 uppercase block font-bold mb-0.5">Target Action Scopes</span>
                          <span className="text-zinc-350">{p.action}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-zinc-650 uppercase block font-bold mb-0.5">Consent Requirement sweeps</span>
                          <span className="text-zinc-350">{p.requiredConsent}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FAILURE POLICIES SUBSECTION */}
              {activeSubsection === "failure" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Failsafe Recovery Policies</span>
                  {failurePolicies.map(policy => (
                    <div key={policy.id} className="glass p-4 rounded-xl border border-zinc-900/60 space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <span className="text-xs font-bold text-zinc-200">Policy: {policy.id.replace(/_/g, " ").toUpperCase()}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-rose-500 border border-zinc-800 text-[8.5px] font-mono font-bold">FAILSAFE ACTIVE</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs font-mono text-zinc-450">
                        <div>
                          <span className="text-[7.5px] text-zinc-650 uppercase block font-bold mb-0.5">Retry Limit Cap</span>
                          <span>{policy.retryLimit} Retries max</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-zinc-650 uppercase block font-bold mb-0.5">Timeout Threshold</span>
                          <span>{policy.timeoutMs} milliseconds</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-zinc-650 uppercase block font-bold mb-0.5">Graceful Fallback</span>
                          <span>{policy.recoveryTactic}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 5. CONTROL SECTION */}
          {activeL2Section === "control" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* MEMORY POLICY SUBSECTION */}
              {activeSubsection === "memory" && (
                <div className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block border-b border-zinc-950 pb-2">Durable & Ephemeral Memory Boundaries</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                      <span className="text-[8.5px] text-zinc-600 uppercase font-black font-mono block">Memory Retention Policies</span>
                      <div className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-2 text-zinc-350 leading-relaxed font-sans">
                        <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-350">
                          <input type="checkbox" defaultChecked className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5" />
                          <span>Retain user UPI preference tag across session scopes</span>
                        </label>
                        <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-350">
                          <input type="checkbox" className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5" />
                          <span>Retain budget EMI projection history durably (30 days)</span>
                        </label>
                        <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-450">
                          <input type="checkbox" defaultChecked disabled className="rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 opacity-50" />
                          <span>Delete ephemeral transaction sweep parameters instantly</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[8.5px] text-zinc-600 uppercase font-black font-mono block">Forbidden Memory Regex Blockers</span>
                      <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl font-mono text-[10px] text-rose-450 space-y-1">
                        <div>{"(?i)(card|cvv|pin|pass)\\d{3,4}"}</div>
                        <div className="text-[8.5px] text-zinc-550 italic mb-2">→ Redacts card security numbers, CVVs, and account passwords automatically.</div>
                        <div>{"\\b\\d{16}\\b"}</div>
                        <div className="text-[8.5px] text-zinc-550 italic">→ Redacts 16-digit raw bank credit card numbers before storing traces.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESPONSE CONTRACTS SUBSECTION */}
              {activeSubsection === "contracts" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Response compliance rules (MUST/SHOULD/AVOID)</span>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-[10.5px] rounded-lg text-zinc-300 font-bold transition-all"><Plus className="w-3 h-3" /> <span>Add Response Contract</span></button>
                  </div>

                  {responseContracts.map(contract => (
                    <div key={contract.id} className="glass p-5 rounded-[22px] border border-zinc-900/60 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                        <span className="text-xs font-bold text-zinc-200">Scope: {contract.targetScope.replace(/_/g, " ").toUpperCase()} Contract</span>
                        <span className="text-[8.5px] text-indigo-400 font-mono font-bold uppercase">{contract.id}</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed">
                        
                        <div className="space-y-1">
                          <span className="text-[8.5px] text-emerald-450 font-black font-mono uppercase block">MUST RULES (Strict compliance)</span>
                          <div className="space-y-1">
                            {contract.mustRules.map((rule, idx) => (
                              <div key={idx} className="flex items-start space-x-2 text-zinc-300">
                                <span className="text-emerald-500 font-mono font-bold">✓</span>
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-950">
                          <span className="text-[8.5px] text-indigo-400 font-black font-mono uppercase block">SHOULD RULES (Guidance parameters)</span>
                          <div className="space-y-1 text-zinc-350">
                            {contract.shouldRules.map((rule, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="text-indigo-400">•</span>
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-950">
                          <span className="text-[8.5px] text-rose-450 font-black font-mono uppercase block">MUST NOT RULES (Governance prohibitions)</span>
                          <div className="space-y-1 text-zinc-400">
                            {contract.mustNotRules.map((rule, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="text-rose-500 font-bold font-mono">✗</span>
                                <span className="line-through decoration-zinc-800">{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="pt-3 border-t border-zinc-950 text-[10px] text-zinc-550 font-mono flex items-center justify-between">
                        <span>Frictionless Disclosure sweep:</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-300 font-medium italic">"{contract.disclosureRequirement}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EVALUATION SUBSECTION */}
              {activeSubsection === "evaluation" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Safety & Quality turn evaluations</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {evalMetrics.map(metric => (
                      <div key={metric.id} className="glass p-4 rounded-xl border border-zinc-900/60 space-y-3 text-zinc-450">
                        <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                          <span className="text-xs font-bold text-zinc-200">{metric.name}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8.5px] text-indigo-400 font-bold uppercase">{metric.level} Level</span>
                        </div>
                        <div className="space-y-2 text-[10.5px]">
                          <div className="flex justify-between">
                            <span>Compliance Threshold Cap</span>
                            <span className="text-emerald-450 font-bold">{(metric.successThreshold * 100).toFixed(0)}% accuracy</span>
                          </div>
                          <div className="flex justify-between">
                            <span>LLM Hallucination Auditing</span>
                            <span className={metric.hallucinationCheckEnabled ? "text-indigo-400 font-bold" : "text-zinc-650"}>{metric.hallucinationCheckEnabled ? "ENABLED" : "DISABLED"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cognitive Load Limit Alerting</span>
                            <span className={metric.cognitiveLoadCheckEnabled ? "text-indigo-400 font-bold" : "text-zinc-650"}>{metric.cognitiveLoadCheckEnabled ? "ENABLED" : "DISABLED"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OBSERVABILITY SUBSECTION & TURN SIMULATOR */}
              {activeSubsection === "observability" && (
                <div className="space-y-5">
                  <div className="p-3 bg-zinc-950/40 border border-zinc-900/50 rounded-xl space-y-1 text-xs">
                    <div className="font-bold text-zinc-300">Observability Trace explorer & Simulator</div>
                    <p className="text-[11px] text-zinc-400 font-medium">Verify how the conversational runtime behaves by running simulated turns, assessing active mixers, and checking trace pipelines.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                    
                    {/* Left simulator form */}
                    <div className="md:col-span-5 glass p-5 rounded-[22px] border border-zinc-900/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-3 text-xs">
                        <span className="text-[9.5px] text-zinc-450 uppercase tracking-widest block font-bold border-b border-zinc-950 pb-2">Simulator Workspace</span>
                        
                        <div className="space-y-1">
                          <label className="text-[8.5px] text-zinc-550 uppercase font-black font-mono block">1. Select Target User Persona</label>
                          <select 
                            value={activePersona}
                            onChange={(e) => {
                              setActivePersona(e.target.value);
                              if (e.target.value.includes("Riya")) {
                                setSimulationPrompt("Should I buy the gaming chair of Rs 15,000 using my Zomato EMI option? Will it ruin my pocket money budget?");
                              } else {
                                setSimulationPrompt("Check if Swiggy refunded my money. If yes, sweep it to my fractional savings portfolio.");
                              }
                            }}
                            className="w-full bg-black border border-zinc-850 p-2.5 rounded-xl text-zinc-300 outline-none"
                          >
                            <option value="Riya: Anxious UPI Spender">Riya: Anxious UPI Spender (financial_anxiety: 0.88)</option>
                            <option value="Aarav: Auto Savings deal hunter">Aarav: Cashback round-up Sweep seeker (deal_hunting: 0.92)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8.5px] text-zinc-550 uppercase font-black font-mono block">2. Conversational prompt turn</label>
                          <textarea 
                            value={simulationPrompt}
                            onChange={(e) => setSimulationPrompt(e.target.value)}
                            className="w-full h-24 bg-black border border-zinc-850 p-3 rounded-xl text-zinc-300 leading-normal resize-none outline-none focus:border-indigo-600" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-zinc-950">
                        <button 
                          onClick={triggerSimulation}
                          disabled={isSimulating}
                          className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-900 border border-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 active:scale-98"
                        >
                          {isSimulating ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Simulating Pipeline...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Simulate Turn Execution</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            triggerSimulation();
                            triggerAuditLog("modify_governance", "Injected simulator pipeline failure fallback execution trigger");
                          }}
                          className="w-full py-2 bg-transparent hover:bg-rose-950/10 border border-zinc-900 hover:border-rose-900/30 text-zinc-500 hover:text-rose-400 rounded-lg text-[9.5px] uppercase font-mono tracking-wider transition-all"
                        >
                          Inject API Timeout Fallback
                        </button>
                      </div>
                    </div>

                    {/* Right trace logs explorer */}
                    <div className="md:col-span-7 glass p-5 rounded-[22px] border border-zinc-900/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
                          <span className="text-[9.5px] text-zinc-450 uppercase tracking-widest font-bold">Explainable Pipeline Trace Output</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-zinc-850 text-[8px] font-mono font-bold uppercase">Trace Stream</span>
                        </div>

                        {isSimulating && (
                          <div className="h-72 flex flex-col items-center justify-center space-y-2 text-zinc-550 animate-pulse text-xs">
                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                            <span>Computing turn-level state vector & running arbitration weights...</span>
                          </div>
                        )}

                        {!isSimulating && !simulationResult && (
                          <div className="h-72 flex flex-col items-center justify-center text-zinc-650 text-xs italic">
                            <Terminal className="w-8 h-8 text-zinc-800 mb-2" />
                            <span>Select a persona, adjust weights, and click 'Simulate Turn Execution' to view active traces.</span>
                          </div>
                        )}

                        {!isSimulating && simulationResult && (
                          <div className="space-y-3 h-72 overflow-y-auto pr-1.5 custom-scrollbar text-[11px] leading-relaxed">
                            
                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">1. Cognitive State Vector</span>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(simulationResult.stateVector).map(([stName, val]: [string, any]) => (
                                  <span key={stName} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-350 text-[8.5px] font-mono border border-zinc-850">
                                    {stName.replace(/_/g, " ")}: <span className="text-indigo-400 font-bold">{(val * 100).toFixed(0)}%</span>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">2. Entity Resolution Aliasing</span>
                              <div className="space-y-1 text-zinc-350 font-mono text-[9.5px]">
                                {simulationResult.resolvedEntities.map((ent: any, idx: number) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>Alias: "{ent.value}"</span>
                                    <span className="text-indigo-400">Canonical: {ent.canonical} ({ent.type})</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">3. Journey Arbitration weights</span>
                              {simulationResult.activeJourneys.map((j: any) => (
                                <div key={j.id} className="flex justify-between text-zinc-350">
                                  <span>Path: {j.id.replace(/_/g, " ")}</span>
                                  <span className="text-indigo-400 font-bold">{j.priority} (Relevance: {(j.arbitrationWeight * 100).toFixed(0)}%)</span>
                                </div>
                              ))}
                            </div>

                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">4. Blended Strategy Allocations (Mixer)</span>
                              <div className="h-4 rounded bg-zinc-900 overflow-hidden flex text-[8px] leading-[16px] text-zinc-200 font-mono">
                                {simulationResult.selectedStrategies.map((strat: any) => (
                                  <div 
                                    key={strat.id} 
                                    style={{ width: `${strat.weight * 100}%` }}
                                    className="bg-indigo-650/80 border-r border-zinc-950/60 truncate pl-1"
                                  >
                                    {strat.id.replace(/_/g, " ")}: {(strat.weight * 100).toFixed(0)}%
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">5. Response Compliance Contracts checks</span>
                              <div className="space-y-0.5 text-zinc-350">
                                {simulationResult.responseContracts.adheredRules.map((rule: string, idx: number) => (
                                  <div key={idx} className="flex items-center space-x-1.5">
                                    <span className="text-emerald-500">✓</span>
                                    <span>Adhered: {rule}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-zinc-950/50 border border-zinc-900 p-2.5 rounded-xl space-y-1">
                              <span className="text-[8px] text-zinc-600 block uppercase font-bold font-mono">6. Compliance Metric Scorecard</span>
                              <div className="grid grid-cols-3 gap-2 text-zinc-350 font-mono text-[9px]">
                                <div>Hallucination: <span className="text-emerald-500">{simulationResult.evaluations.hallucinationScore}</span></div>
                                <div>Cognitive Load: <span className="text-emerald-500">{simulationResult.evaluations.cognitiveLoadIndex}</span></div>
                                <div>Strategy Adherence: <span className="text-emerald-500">{simulationResult.evaluations.strategyAdherence}</span></div>
                              </div>
                            </div>

                            <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl space-y-1 text-zinc-200">
                              <span className="text-[8px] text-emerald-400 block uppercase font-bold font-mono">7. Generated Response</span>
                              <p className="italic">"{simulationResult.responseGenerated}"</p>
                            </div>

                          </div>
                        )}
                      </div>

                      {!isSimulating && simulationResult && (
                        <div className="flex space-x-3 pt-3 border-t border-zinc-950">
                          <button onClick={triggerSimulation} className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-150 rounded-lg text-xs font-bold uppercase transition-all tracking-wider active:scale-98">Replay Turn</button>
                          <button onClick={() => setSimulationResult(null)} className="py-2 px-3 bg-zinc-950 border border-zinc-900 text-zinc-550 hover:text-zinc-450 rounded-lg text-xs transition-all"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ==========================================
          THE 16-SPEC DSL COMPILER DRAWER MODAL
          ========================================== */}
      {showYamlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 select-text">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-5xl h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-zoomIn">
            
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-zinc-950 shrink-0">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Compiled Conversational Runtime Specs</h3>
                  <span className="text-[9px] text-zinc-550 font-mono uppercase tracking-wider block mt-0.5">Composed from sandbox dashboard states directly</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(compiledYamlSpecs[activeYamlTab as keyof typeof compiledYamlSpecs]);
                    triggerAuditLog("update_strategy", `Copied compiled spec tab: ${activeYamlTab}`);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 rounded-lg text-xs font-bold text-zinc-350 active:scale-95 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Active Spec</span>
                </button>
                
                <button 
                  onClick={() => {
                    triggerAuditLog("update_strategy", "Exported 16-spec bundle zip configuration.");
                    alert("16-spec YAML bundle compiled successfully. Config directory ready for active deployment.");
                  }}
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white active:scale-95 transition-all shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Download spec bundle</span>
                </button>
                
                <button 
                  onClick={() => setShowYamlModal(false)}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all border border-transparent hover:border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab links for exactly 15 specs */}
            <div className="flex flex-wrap gap-1 px-4 py-2 border-b border-zinc-950 bg-black/40 overflow-x-auto shrink-0 custom-scrollbar font-mono text-[9px]">
              {Object.keys(compiledYamlSpecs).map(specName => (
                <button
                  key={specName}
                  onClick={() => setActiveYamlTab(specName)}
                  className={clsx(
                    "px-2.5 py-1.5 rounded transition-all tracking-wider uppercase font-semibold shrink-0 border",
                    activeYamlTab === specName 
                      ? "bg-indigo-950/80 text-indigo-400 border-indigo-900/50 font-bold" 
                      : "bg-transparent text-zinc-550 border-transparent hover:text-zinc-350"
                  )}
                >
                  {specName.replace(/_/g, ".yaml")}
                </button>
              ))}
            </div>

            {/* Spec editor viewport */}
            <div className="flex-1 bg-black/40 p-5 overflow-y-auto custom-scrollbar relative">
              <pre className="font-mono text-[10.5px] text-indigo-300 leading-normal select-text whitespace-pre bg-[#040406]/80 p-4.5 rounded-xl border border-zinc-950/80 shadow-inner min-h-full">
                {compiledYamlSpecs[activeYamlTab as keyof typeof compiledYamlSpecs]}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
