"use client";

import { useState, useMemo } from "react";
import { useBehaviorStore, Capability, Tool, ToolAction, Artifact } from "@/store/useBehaviorStore";
import clsx from "clsx";
import { 
  Cpu, Wrench, Zap, Database, Terminal, Code, Layers, 
  Target, BarChart3, ShieldCheck, Search, Plus, Edit2, Trash2, 
  Compass, CheckCircle2, ArrowRight, X, Activity
} from "lucide-react";
import { MENU } from "@/constants/registryMenu";

export default function RegistryWorkspace() {
  const store = useBehaviorStore();
  const {
    capabilities = [],
    tools = [],
    artifacts = [],
    activeL2Section,
    createTool,
    updateTool,
    deleteTool,
    createArtifact,
    updateArtifact,
    deleteArtifact,
    createExecutionSemantic,
    updateExecutionSemantic,
    deleteExecutionSemantic,
    createInputContract,
    updateInputContract,
    deleteInputContract,
    createOutputContract,
    updateOutputContract,
    deleteOutputContract,
    createRuntimeContract,
    updateRuntimeContract,
    deleteRuntimeContract
  } = store;
  const executionSemanticsRegistry = store.executionSemanticsRegistry;
  const capabilityContractsRegistry = store.capabilityContractsRegistry;

  const activeMenu = activeL2Section || "capabilities";
  const [activeArtifactTab, setActiveArtifactTab] = useState<"persistent" | "moment" | "momentum">("persistent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapId, setSelectedCapId] = useState<string | null>(null);

  const activeCap = useMemo(() => capabilities.find(c => c.id === selectedCapId) || capabilities[0], [capabilities, selectedCapId]);

  const filteredCapabilities = useMemo(() => {
    return capabilities.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [capabilities, searchQuery]);

  // Form States - Capability
  const [showCapModal, setShowCapModal] = useState(false);
  const [editingCapability, setEditingCapability] = useState<Capability | null>(null);
  const [capName, setCapName] = useState("");
  const [capDesc, setCapDesc] = useState("");
  const [capCategory, setCapCategory] = useState("Intelligence");
  const [capExecType, setCapExecType] = useState<Capability["execution_type"]>("retrieval");
  const [capReqInputs, setCapReqInputs] = useState("");
  const [capOptInputs, setCapOptInputs] = useState("");
  const [capMissingStrategy, setCapMissingStrategy] = useState<Capability["missing_input_strategy"]["mode"]>("conversational_collection");
  const [capOutputs, setCapOutputs] = useState("");
  const [capReqArtifacts, setCapReqArtifacts] = useState("");
  const [capProdArtifacts, setCapProdArtifacts] = useState("");
  const [capProdMoments, setCapProdMoments] = useState("");
  const [capModMomentum, setCapModMomentum] = useState("");
  const [capToolsList, setCapToolsList] = useState("");
  const [capPriority, setCapPriority] = useState<Capability["priority"]>("medium");
  const [capLatency, setCapLatency] = useState("near_realtime");
  const [capCost, setCapCost] = useState("low");
  const [capGovConstraints, setCapGovConstraints] = useState("Audit schema limits, Check access grants");
  const [capPermissions, setCapPermissions] = useState("user");
  const [capFallbacks, setCapFallbacks] = useState("");
  const [showToolModal, setShowToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolName, setToolName] = useState("");
  const [toolDesc, setToolDesc] = useState("");
  const [toolCategory, setToolCategory] = useState("");
  const [toolLatency, setToolLatency] = useState("near_realtime");
  const [toolCost, setToolCost] = useState("low");
  const [toolActions, setToolActions] = useState<ToolAction[]>([]);
  const [activeLocalActionIndex, setActiveLocalActionIndex] = useState<number | null>(null);
  const [localActionName, setLocalActionName] = useState("");
  const [localActionDesc, setLocalActionDesc] = useState("");
  const [localActionExecType, setLocalActionExecType] = useState("analysis");
  const [localActionInputs, setLocalActionInputs] = useState("");
  const [localActionOutputs, setLocalActionOutputs] = useState("");

  const [showToolActionModal, setShowToolActionModal] = useState(false);
  const [targetToolId, setTargetToolId] = useState<string | null>(null);
  const [editingToolAction, setEditingToolAction] = useState<ToolAction | null>(null);
  const [toolActionName, setToolActionName] = useState("");
  const [toolActionDescription, setToolActionDescription] = useState("");
  const [toolActionExecutionType, setToolActionExecutionType] = useState("analysis");
  const [toolActionTimeoutMs, setToolActionTimeoutMs] = useState("1000");

  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [artifactName, setArtifactName] = useState("");
  const [artifactDescription, setArtifactDescription] = useState("");
  const [artifactCategory, setArtifactCategory] = useState<"persistent" | "moment" | "momentum">("persistent");
  const [artifactTtl, setArtifactTtl] = useState("");
  const [artifactTrigger, setArtifactTrigger] = useState("");
  const [artifactScoreRange, setArtifactScoreRange] = useState("");
  const [artifactUpdateFreq, setArtifactUpdateFreq] = useState("");

  const handleOpenCapCreate = () => {
    setEditingCapability(null);
    setCapName(""); setCapDesc(""); setCapCategory("Intelligence"); setCapExecType("retrieval");
    setCapReqInputs(""); setCapOptInputs(""); setCapMissingStrategy("conversational_collection");
    setCapOutputs(""); setCapReqArtifacts(""); setCapProdArtifacts(""); setCapProdMoments("");
    setCapModMomentum(""); setCapToolsList(""); setCapPriority("medium"); setCapLatency("near_realtime");
    setCapCost("low"); setCapGovConstraints("Audit schema limits, Check access grants");
    setCapPermissions("user"); setCapFallbacks("");
    setShowCapModal(true);
  };

  const handleSaveCapability = () => {
    if (!capName.trim()) return;
    const cid = editingCapability ? editingCapability.id : capName.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    const payload: Capability = {
      id: cid, name: capName, description: capDesc, category: capCategory, execution_type: capExecType,
      required_inputs: capReqInputs.split(",").map(i => i.trim()).filter(Boolean),
      optional_inputs: capOptInputs.split(",").map(i => i.trim()).filter(Boolean),
      input_sources: { userId: ["runtime_context"] },
      missing_input_strategy: { mode: capMissingStrategy },
      output_types: capOutputs.split(",").map(i => i.trim()).filter(Boolean),
      required_artifacts: capReqArtifacts.split(",").map(i => i.trim()).filter(Boolean),
      produced_artifacts: capProdArtifacts.split(",").map(i => i.trim()).filter(Boolean),
      produced_moments: capProdMoments.split(",").map(i => i.trim()).filter(Boolean),
      modified_momentum: capModMomentum.split(",").map(i => i.trim()).filter(Boolean),
      implemented_by_tools: capToolsList.split(",").map(i => i.trim()).filter(Boolean),
      implemented_by_actions: [],
      governance_constraints: capGovConstraints.split(",").map(i => i.trim()).filter(Boolean),
      permissions_required: capPermissions.split(",").map(i => i.trim()).filter(Boolean),
      fallback_capabilities: capFallbacks.split(",").map(i => i.trim()).filter(Boolean),
      priority: capPriority, latency_tier: capLatency, cost_tier: capCost
    };
    if (editingCapability) store.updateCapability(editingCapability.id, payload);
    else store.createCapability(payload);
    setShowCapModal(false);
  };

  const handleOpenToolCreate = () => {
    setEditingTool(null);
    setToolName("");
    setToolDesc("");
    setToolCategory("orchestration");
    setToolLatency("near_realtime");
    setToolCost("low");
    setToolActions([]);
    setActiveLocalActionIndex(null);
    setShowToolModal(true);
  };

  const handleOpenToolEdit = (tool: Tool) => {
    setEditingTool(tool);
    setToolName(tool.name);
    setToolDesc(tool.description);
    setToolCategory(tool.category);
    setToolLatency(tool.latency_tier);
    setToolCost(tool.cost_tier);
    setToolActions(tool.actions || []);
    setActiveLocalActionIndex(null);
    setShowToolModal(true);
  };

  const handleSaveTool = () => {
    if (!toolName.trim()) return;
    const toolId = editingTool?.id || toolName.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    const payload: Tool = {
      id: toolId,
      name: toolName,
      description: toolDesc,
      category: toolCategory,
      status: editingTool?.status || "active",
      owner_team: editingTool?.owner_team || "Platform",
      authentication: editingTool?.authentication || "Internal",
      rate_limits: editingTool?.rate_limits || "100/s",
      sla: editingTool?.sla || "99.9%",
      latency_tier: toolLatency,
      cost_tier: toolCost,
      actions: toolActions,
      permissions: editingTool?.permissions || [],
      side_effects: editingTool?.side_effects || "External side-effects",
      retry_policy: editingTool?.retry_policy || "retry",
      observability: editingTool?.observability || { logs: "", metrics: "", traces: "" },
      apiEndpoint: editingTool?.apiEndpoint || "",
      inputSchema: editingTool?.inputSchema || "{}",
      outputSchema: editingTool?.outputSchema || "{}",
      latencyBenchmarkMs: editingTool?.latencyBenchmarkMs || 100
    };
    if (editingTool) updateTool(editingTool.id, payload);
    else createTool(payload);
    setShowToolModal(false);
  };

  const handleAddLocalAction = () => {
    setActiveLocalActionIndex(-1);
    setLocalActionName("");
    setLocalActionDesc("");
    setLocalActionExecType("analysis");
    setLocalActionInputs("");
    setLocalActionOutputs("");
  };

  const handleEditLocalAction = (index: number) => {
    const act = toolActions[index];
    setActiveLocalActionIndex(index);
    setLocalActionName(act.name);
    setLocalActionDesc(act.description);
    setLocalActionExecType(act.execution_type);
    setLocalActionInputs(act.inputs.join(", "));
    setLocalActionOutputs(act.outputs.join(", "));
  };

  const handleDeleteLocalAction = (index: number) => {
    setToolActions(prev => prev.filter((_, idx) => idx !== index));
    if (activeLocalActionIndex === index) {
      setActiveLocalActionIndex(null);
    }
  };

  const handleSaveLocalAction = () => {
    if (!localActionName.trim()) return;
    const isNew = activeLocalActionIndex === -1;
    const actionId = isNew 
      ? `${(editingTool?.id || toolName.toLowerCase().replace(/[^a-z0-9_]+/g, "_"))}.${localActionName.toLowerCase().replace(/[^a-z0-9_]+/g, "_")}`
      : toolActions[activeLocalActionIndex!].id;

    const payload: ToolAction = {
      id: actionId,
      tool_id: editingTool?.id || toolName.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
      name: localActionName,
      description: localActionDesc,
      inputs: localActionInputs.split(",").map(i => i.trim()).filter(Boolean),
      outputs: localActionOutputs.split(",").map(i => i.trim()).filter(Boolean),
      execution_type: localActionExecType,
      side_effects: isNew ? "None" : toolActions[activeLocalActionIndex!].side_effects || "None",
      timeout_ms: isNew ? 1000 : toolActions[activeLocalActionIndex!].timeout_ms || 1000,
      retryable: isNew ? true : toolActions[activeLocalActionIndex!].retryable ?? true,
      produces_artifacts: isNew ? [] : toolActions[activeLocalActionIndex!].produces_artifacts || [],
      consumes_artifacts: isNew ? [] : toolActions[activeLocalActionIndex!].consumes_artifacts || [],
      governance_requirements: isNew ? [] : toolActions[activeLocalActionIndex!].governance_requirements || []
    };

    if (isNew) {
      setToolActions(prev => [...prev, payload]);
    } else {
      setToolActions(prev => prev.map((act, idx) => idx === activeLocalActionIndex ? payload : act));
    }
    setActiveLocalActionIndex(null);
  };

  const handleDeleteTool = (toolId: string) => {
    if (!confirm("Delete this tool and all nested actions?")) return;
    deleteTool(toolId);
  };

  const handleOpenToolActionCreate = (toolId: string) => {
    setTargetToolId(toolId);
    setEditingToolAction(null);
    setToolActionName("");
    setToolActionDescription("");
    setToolActionExecutionType("analysis");
    setToolActionTimeoutMs("1000");
    setShowToolActionModal(true);
  };

  const handleOpenToolActionEdit = (toolId: string, action: ToolAction) => {
    setTargetToolId(toolId);
    setEditingToolAction(action);
    setToolActionName(action.name);
    setToolActionDescription(action.description);
    setToolActionExecutionType(action.execution_type);
    setToolActionTimeoutMs(String(action.timeout_ms || 1000));
    setShowToolActionModal(true);
  };

  const handleSaveToolAction = () => {
    if (!targetToolId || !toolActionName.trim()) return;
    const tool = tools.find((t) => t.id === targetToolId);
    if (!tool) return;
    const actionId = editingToolAction?.id || `${tool.id}.${toolActionName.toLowerCase().replace(/[^a-z0-9_]+/g, "_")}`;
    const actionPayload: ToolAction = {
      id: actionId,
      tool_id: tool.id,
      name: toolActionName,
      description: toolActionDescription,
      inputs: editingToolAction?.inputs || [],
      outputs: editingToolAction?.outputs || [],
      execution_type: toolActionExecutionType,
      side_effects: editingToolAction?.side_effects || "None",
      timeout_ms: Number(toolActionTimeoutMs) || 1000,
      retryable: editingToolAction?.retryable ?? true,
      produces_artifacts: editingToolAction?.produces_artifacts || [],
      consumes_artifacts: editingToolAction?.consumes_artifacts || [],
      governance_requirements: editingToolAction?.governance_requirements || []
    };
    const nextActions = editingToolAction
      ? tool.actions.map((a) => (a.id === editingToolAction.id ? actionPayload : a))
      : [...tool.actions, actionPayload];
    updateTool(tool.id, { actions: nextActions });
    setShowToolActionModal(false);
  };

  const handleDeleteToolAction = (toolId: string, actionId: string) => {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;
    if (!confirm("Delete this tool action?")) return;
    updateTool(tool.id, { actions: tool.actions.filter((a) => a.id !== actionId) });
  };

  const handleOpenArtifactCreate = () => {
    setEditingArtifact(null);
    setArtifactName("");
    setArtifactDescription("");
    setArtifactCategory(activeArtifactTab);
    setArtifactTtl("");
    setArtifactTrigger("");
    setArtifactScoreRange("");
    setArtifactUpdateFreq("");
    setShowArtifactModal(true);
  };

  const handleOpenArtifactEdit = (artifact: Artifact) => {
    setEditingArtifact(artifact);
    setArtifactName(artifact.name);
    setArtifactDescription(artifact.description);
    setArtifactCategory(artifact.category);
    setArtifactTtl(artifact.ttl || "");
    setArtifactTrigger(artifact.trigger_conditions || "");
    setArtifactScoreRange(artifact.score_range || "");
    setArtifactUpdateFreq(artifact.update_frequency || "");
    setShowArtifactModal(true);
  };

  const handleSaveArtifact = () => {
    if (!artifactName.trim()) return;
    const artifactId = editingArtifact?.id || artifactName.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    const payload: Artifact = {
      id: artifactId,
      name: artifactName,
      description: artifactDescription,
      category: artifactCategory,
      family: artifactCategory === "moment" ? "Moments Artifacts" : "Momentum Artifacts",
      apiEndpoint: editingArtifact?.apiEndpoint || "",
      schemaContract: editingArtifact?.schemaContract || "{}",
      lifecycleStatus: editingArtifact?.lifecycleStatus || (artifactCategory === "moment" ? "temporary" : "persisted"),
      ttl: artifactCategory === "moment" ? artifactTtl : undefined,
      trigger_conditions: artifactCategory === "moment" ? artifactTrigger : undefined,
      score_range: artifactCategory === "momentum" ? artifactScoreRange : undefined,
      update_frequency: artifactCategory === "momentum" ? artifactUpdateFreq : undefined
    };
    if (editingArtifact) updateArtifact(editingArtifact.id, payload);
    else createArtifact(payload);
    setShowArtifactModal(false);
  };

  const handleDeleteArtifact = (artifactId: string) => {
    if (!confirm("Delete this artifact?")) return;
    deleteArtifact(artifactId);
  };

  const openJsonPrompt = (title: string, initial: unknown) => {
    const raw = prompt(title, JSON.stringify(initial, null, 2));
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      alert("Invalid JSON");
      return null;
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/10 min-h-[400px]">
       <Activity className="w-8 h-8 text-zinc-700 opacity-50 mb-3" />
       <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{MENU.find(m => m.id === activeMenu)?.label} Configured Globally</h3>
       <p className="text-zinc-600 text-[11px] mt-2 font-sans max-w-sm text-center">
         Global matrices for {activeMenu.replace("_", " ")} are loaded dynamically from capabilities schema.
       </p>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden text-zinc-200 font-mono z-10 relative bg-[#08080a]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900/80 pb-5">
            <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-tight flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-purple-500" />
              <span>{MENU.find(m => m.id === activeMenu)?.label}</span>
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-black/40 border border-zinc-900/60 rounded-xl px-3 py-2 w-64">
                <Search className="w-4 h-4 text-zinc-550" />
                <input
                  type="text"
                  placeholder={`Search ${activeMenu}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-zinc-200 outline-none w-full placeholder:text-zinc-650"
                />
              </div>
              
              {activeMenu === "capabilities" && (
                <button
                  onClick={handleOpenCapCreate}
                  className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>REGISTER CAPABILITY</span>
                </button>
              )}
              {activeMenu === "tools" && (
                <button
                  onClick={handleOpenToolCreate}
                  className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD TOOL</span>
                </button>
              )}
              {activeMenu === "artifacts" && (
                <button
                  onClick={handleOpenArtifactCreate}
                  className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 active:scale-95 transition-all text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-teal-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD ARTIFACT</span>
                </button>
              )}
              {activeMenu === "execution_semantics" && (
                <button
                  onClick={() => {
                    const created = openJsonPrompt("Create Execution Semantic JSON", {
                      id: "new_execution_type",
                      orchestration_behavior: "",
                      execution_expectations: "",
                      latency_profile: "near_realtime",
                      conversational_style: "",
                      state_persistence_requirements: "",
                      retry_behavior: "",
                      UI_rendering_hints: []
                    });
                    if (created) createExecutionSemantic(created);
                  }}
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD EXECUTION TYPE</span>
                </button>
              )}
              {activeMenu === "input_contracts" && (
                <button
                  onClick={() => {
                    const created = openJsonPrompt("Create Input Contract JSON", {
                      id: "new_input_contract",
                      capability_id: "",
                      required_inputs: [],
                      optional_inputs: [],
                      input_schema: {},
                      validation_rules: {},
                      input_sources: {},
                      acquisition_strategy: { mode: "conversational_collection" },
                      inference_rules: {},
                      fallback_behavior: {},
                      confidence_thresholds: {},
                      governance_constraints: [],
                      persistence_behavior: {}
                    });
                    if (created) createInputContract(created);
                  }}
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD INPUT CONTRACT</span>
                </button>
              )}
              {activeMenu === "output_contracts" && (
                <button
                  onClick={() => {
                    const created = openJsonPrompt("Create Output Contract JSON", {
                      id: "new_output_contract",
                      capability_id: "",
                      output_types: [],
                      output_schema: {},
                      produced_artifacts: [],
                      produced_moments: [],
                      modified_momentum: [],
                      persistence_rules: {},
                      rendering_hints: { preferred: [] },
                      downstream_dependencies: [],
                      governance_classification: {}
                    });
                    if (created) createOutputContract(created);
                  }}
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD OUTPUT CONTRACT</span>
                </button>
              )}
              {activeMenu === "runtime_contracts" && (
                <button
                  onClick={() => {
                    const created = openJsonPrompt("Create Runtime Contract JSON", {
                      id: "new_runtime_contract",
                      capability_id: "",
                      execution_semantic: "retrieval",
                      orchestration_policy: {},
                      retry_policy: { strategy: "no_retry" },
                      timeout_policy: { max_timeout_ms: 10000 },
                      fallback_policy: { strategy: "degraded_execution" },
                      continuation_policy: { mode: "immediate_completion" },
                      concurrency_policy: {},
                      observability: {},
                      governance_bindings: {},
                      persistence_contract: {},
                      failure_behavior: {},
                      execution_priority: "medium"
                    });
                    if (created) createRuntimeContract(created);
                  }}
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD RUNTIME CONTRACT</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Active View Router */}
          {activeMenu === "capabilities" ? (
            <div className="flex gap-6 h-[75vh]">
              {/* List Pane */}
              <div className="w-1/3 flex flex-col space-y-3 overflow-y-auto custom-scrollbar pr-2">
                {filteredCapabilities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCapId(c.id)}
                    className={clsx(
                      "w-full text-left p-4 rounded-2xl border transition-all space-y-2",
                      activeCap?.id === c.id
                        ? "bg-purple-950/20 border-purple-500 shadow-lg shadow-purple-500/5"
                        : "bg-zinc-950/50 border-zinc-900 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">{c.name}</span>
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                        {c.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans line-clamp-2">{c.description}</p>
                  </button>
                ))}
              </div>
              
              {/* Detail Pane (Tree View) */}
              <div className="w-2/3 bg-black/40 border border-zinc-900/60 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
                {activeCap ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-purple-400">{activeCap.name}</h2>
                        <div className="text-[10px] text-zinc-500 mt-1 flex items-center space-x-2">
                          <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{activeCap.id}</span>
                          <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Priority: {activeCap.priority}</span>
                        </div>
                      </div>
                      <button onClick={() => {
                        setEditingCapability(activeCap);
                        setCapName(activeCap.name); setCapDesc(activeCap.description);
                        setCapCategory(activeCap.category); setCapExecType(activeCap.execution_type);
                        setCapReqInputs(activeCap.required_inputs.join(", "));
                        setCapOptInputs(activeCap.optional_inputs.join(", "));
                        setCapMissingStrategy(activeCap.missing_input_strategy?.mode || "conversational_collection");
                        setCapOutputs(activeCap.output_types.join(", "));
                        setCapReqArtifacts(activeCap.required_artifacts.join(", "));
                        setCapProdArtifacts(activeCap.produced_artifacts.join(", "));
                        setCapProdMoments(activeCap.produced_moments.join(", "));
                        setCapModMomentum(activeCap.modified_momentum.join(", "));
                        setCapToolsList(activeCap.implemented_by_tools.join(", "));
                        setCapPriority(activeCap.priority); setCapLatency(activeCap.latency_tier);
                        setCapCost(activeCap.cost_tier);
                        setCapGovConstraints(activeCap.governance_constraints.join(", "));
                        setCapPermissions(activeCap.permissions_required.join(", "));
                        setCapFallbacks(activeCap.fallback_capabilities.join(", "));
                        setShowCapModal(true);
                      }} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center space-x-1.5">
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Blueprint</span>
                      </button>
                    </div>

                    <div className="space-y-4 text-xs font-mono pl-2 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-900">
                      
                      {/* Input Contracts */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-violet-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Code className="w-3.5 h-3.5" />
                          <span>Input Contracts</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Required:</span> <span className="text-zinc-200">{activeCap.required_inputs.join(", ") || "None"}</span></div>
                          <div><span className="text-zinc-500">Optional:</span> <span className="text-zinc-200">{activeCap.optional_inputs.join(", ") || "None"}</span></div>
                          <div><span className="text-zinc-500">Missing Input Strategy:</span> <span className="text-zinc-300">{activeCap.missing_input_strategy?.mode}</span></div>
                        </div>
                      </div>

                      {/* Execution Semantics */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Execution Semantics</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Execution Type:</span> <span className="text-zinc-200">{activeCap.execution_type}</span></div>
                          <div><span className="text-zinc-500">Latency / Cost:</span> <span className="text-zinc-200">{activeCap.latency_tier} / {activeCap.cost_tier}</span></div>
                          <div><span className="text-zinc-500">Implemented By Tools:</span> <span className="text-zinc-200">{activeCap.implemented_by_tools.join(", ") || "Native Engine"}</span></div>
                        </div>
                      </div>

                      {/* Output Contracts */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Output Contracts</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Return Formats:</span> <span className="text-zinc-200">{activeCap.output_types.join(", ") || "Any"}</span></div>
                        </div>
                      </div>

                      {/* Artifact Production */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-teal-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Database className="w-3.5 h-3.5" />
                          <span>Artifact Production</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Required State:</span> <span className="text-zinc-200">{activeCap.required_artifacts.join(", ") || "None"}</span></div>
                          <div><span className="text-zinc-500">Produced/Modified State:</span> <span className="text-zinc-200">{activeCap.produced_artifacts.join(", ") || "None"}</span></div>
                        </div>
                      </div>

                      {/* Moment Production */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-fuchsia-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Moment Production</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Generated Real-time Triggers:</span> <span className="text-zinc-200">{activeCap.produced_moments.join(", ") || "None"}</span></div>
                        </div>
                      </div>

                      {/* Momentum Effects */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Momentum Effects</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Longitudinal Vectors Updated:</span> <span className="text-zinc-200">{activeCap.modified_momentum.join(", ") || "None"}</span></div>
                        </div>
                      </div>

                      {/* Runtime Policies */}
                      <div className="relative pl-6">
                        <div className="absolute left-[-11px] top-1.5 w-[22px] h-px bg-zinc-900"></div>
                        <div className="flex items-center space-x-2 text-rose-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Runtime Policies</span>
                        </div>
                        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-[10.5px]">
                          <div><span className="text-zinc-500">Governance Constraints:</span> <span className="text-zinc-200">{activeCap.governance_constraints.join(", ") || "None"}</span></div>
                          <div><span className="text-zinc-500">Permissions Required:</span> <span className="text-zinc-200">{activeCap.permissions_required.join(", ") || "None"}</span></div>
                          <div><span className="text-zinc-500">Fallback Overrides:</span> <span className="text-zinc-200">{activeCap.fallback_capabilities.join(", ") || "None"}</span></div>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-3">
                    <Search className="w-8 h-8 opacity-50" />
                    <span className="text-xs">Select a capability to inspect its execution blueprint</span>
                  </div>
                )}
              </div>
            </div>
          ) : activeMenu === "tools" || activeMenu === "tool_actions" ? (
            <div className="h-[75vh] flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                  <div key={tool.id} className="bg-black/40 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-zinc-400" />
                        <h4 className="text-sm font-bold text-zinc-200">{tool.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenToolEdit(tool)} className="text-zinc-400 hover:text-zinc-200">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTool(tool.id)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans mb-4">{tool.description}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 block">Functions (Tool Actions)</span>
                        <button
                          onClick={() => handleOpenToolActionCreate(tool.id)}
                          className="text-[9px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        >
                          + Add Function
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 border-l border-zinc-800 pl-2">
                        {tool.actions.map(act => (
                          <div key={act.id} className="bg-zinc-900/50 border border-zinc-800 px-2 py-1.5 rounded-md text-[9px] text-zinc-400">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span className="text-zinc-200">{act.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleOpenToolActionEdit(tool.id, act)} className="text-zinc-400 hover:text-zinc-200">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleDeleteToolAction(tool.id, act.id)} className="text-rose-400 hover:text-rose-300">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-1 text-zinc-500 font-mono">{act.id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeMenu === "artifacts" ? (
             <div className="h-[75vh] flex flex-col overflow-hidden">
               {/* Tab Navigation for Artifacts */}
               <div className="flex space-x-4 mb-6 border-b border-zinc-900/50 pb-2">
                 {["persistent", "moment", "momentum"].map(tab => (
                   <button
                     key={tab}
                     onClick={() => setActiveArtifactTab(tab as "persistent" | "moment" | "momentum")}
                     className={clsx(
                       "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all",
                       activeArtifactTab === tab ? "bg-zinc-900 text-purple-400" : "text-zinc-500 hover:text-zinc-300"
                     )}
                   >
                     {tab}
                   </button>
                 ))}
               </div>

               {/* Artifact List */}
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {artifacts.filter(a => a.category === activeArtifactTab).map(artifact => (
                     <div key={artifact.id} className="bg-black/40 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                       <div className="flex items-start justify-between mb-2">
                         <h4 className="text-sm font-bold text-zinc-200">{artifact.name}</h4>
                         <div className="flex items-center gap-2">
                           <span className="text-[9px] uppercase font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                             {artifact.category}
                           </span>
                           <button onClick={() => handleOpenArtifactEdit(artifact)} className="text-zinc-400 hover:text-zinc-200">
                             <Edit2 className="w-3.5 h-3.5" />
                           </button>
                           <button onClick={() => handleDeleteArtifact(artifact.id)} className="text-rose-400 hover:text-rose-300">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       </div>
                       <p className="text-[10px] text-zinc-500 font-sans mb-3">{artifact.description}</p>
                       
                       {/* Artifact Specific Details */}
                       <div className="space-y-2 text-[10px] font-mono border-t border-zinc-900 pt-3">
                         {artifact.category === "moment" && (
                           <>
                             <div className="flex justify-between"><span className="text-zinc-600">TTL:</span> <span className="text-purple-400">{artifact.ttl}</span></div>
                             <div className="flex justify-between"><span className="text-zinc-600">Trigger:</span> <span className="text-zinc-300 truncate w-32 text-right" title={artifact.trigger_conditions}>{artifact.trigger_conditions}</span></div>
                           </>
                         )}
                         {artifact.category === "momentum" && (
                           <>
                             <div className="flex justify-between"><span className="text-zinc-600">Score Range:</span> <span className="text-emerald-400">{artifact.score_range}</span></div>
                             <div className="flex justify-between"><span className="text-zinc-600">Update Freq:</span> <span className="text-zinc-300">{artifact.update_frequency}</span></div>
                           </>
                         )}
                         {artifact.category === "persistent" && (
                           <>
                             <div className="flex justify-between"><span className="text-zinc-600">Status:</span> <span className="text-teal-400">{artifact.lifecycleStatus}</span></div>
                           </>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          ) : activeMenu === "execution_semantics" ? (
            <div className="h-[75vh] overflow-y-auto custom-scrollbar pr-2 space-y-6">
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Execution Types</h3>
                <p className="text-[11px] text-zinc-500 mb-4">Defines runtime behavior, orchestration style, input/output handling, retries, persistence and UI hints.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {executionSemanticsRegistry.execution_types.map((et) => (
                    <div key={et.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 uppercase">{et.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500">{et.latency_profile}</span>
                          <button onClick={() => { const next = openJsonPrompt("Edit Execution Semantic JSON", et); if (next) updateExecutionSemantic(et.id, next); }} className="text-zinc-400 hover:text-zinc-200"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => { if (confirm("Delete execution semantic?")) deleteExecutionSemantic(et.id); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-400">{et.orchestration_behavior}</div>
                      <div className="text-[10px] text-zinc-500">Execution: {et.execution_expectations}</div>
                      <div className="text-[10px] text-zinc-500">Conversation: {et.conversational_style}</div>
                      <div className="text-[10px] text-zinc-500">Persistence: {et.state_persistence_requirements}</div>
                      <div className="text-[10px] text-zinc-500">Retry: {et.retry_behavior}</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {et.UI_rendering_hints.map((hint) => (
                          <span key={`${et.id}-${hint}`} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{hint}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-3">Input Acquisition Models</h3>
                  <div className="space-y-2">
                    {executionSemanticsRegistry.input_acquisition_models.map((model) => (
                      <div key={model.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 text-[10px] space-y-1">
                        <div className="text-zinc-200 font-bold">{model.id}</div>
                        <div className="text-zinc-500">Interruption: {model.user_interruption_behavior}</div>
                        <div className="text-zinc-500">Orchestration: {model.orchestration_impact}</div>
                        <div className="text-zinc-500">Fallback: {model.fallback_handling}</div>
                        <div className="text-zinc-500">Memory: {model.memory_usage}</div>
                        <div className="text-zinc-500">Confidence: {model.confidence_thresholds}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-3">Execution Semantics Taxonomy</h3>
                  {[
                    { title: "Output Behaviors", items: executionSemanticsRegistry.output_behaviors },
                    { title: "Orchestration Patterns", items: executionSemanticsRegistry.orchestration_patterns },
                    { title: "Persistence Models", items: executionSemanticsRegistry.persistence_models },
                    { title: "Runtime Policies", items: executionSemanticsRegistry.runtime_policies },
                    { title: "Interaction Models", items: executionSemanticsRegistry.interaction_models },
                    { title: "Failure Behaviors", items: executionSemanticsRegistry.failure_behaviors },
                    { title: "Continuation Policies", items: executionSemanticsRegistry.continuation_policies },
                    { title: "UX Rendering Hints", items: executionSemanticsRegistry.UX_rendering_hints }
                  ].map((group) => (
                    <div key={group.title} className="mb-3">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">{group.title}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span key={`${group.title}-${item}`} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeMenu === "input_contracts" ? (
            <div className="h-[75vh] overflow-y-auto custom-scrollbar pr-2 space-y-4">
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-3">Input Contracts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilityContractsRegistry.input_contracts.map((c) => (
                    <div key={c.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-[10px] space-y-1.5">
                      <div className="text-zinc-200 font-bold flex items-center justify-between">
                        <span>{c.id}</span>
                        <span className="flex items-center gap-1.5">
                          <button onClick={() => { const next = openJsonPrompt("Edit Input Contract JSON", c); if (next) updateInputContract(c.id, next); }} className="text-zinc-400 hover:text-zinc-200"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => { if (confirm("Delete input contract?")) deleteInputContract(c.id); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      </div>
                      <div className="text-zinc-500">Capability: {c.capability_id}</div>
                      <div className="text-zinc-500">Required: {c.required_inputs.join(", ") || "None"}</div>
                      <div className="text-zinc-500">Optional: {c.optional_inputs.join(", ") || "None"}</div>
                      <div className="text-zinc-500">Acquisition: {c.acquisition_strategy.mode}</div>
                      <div className="text-zinc-500">Sources: {Object.entries(c.input_sources).map(([k, v]) => `${k}←${v.join("|")}`).join("; ")}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Input Source Types & Acquisition Strategies</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {capabilityContractsRegistry.input_sources.map((s) => <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{s}</span>)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {capabilityContractsRegistry.acquisition_strategies.map((s) => <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{s}</span>)}
                </div>
              </div>
            </div>
          ) : activeMenu === "output_contracts" ? (
            <div className="h-[75vh] overflow-y-auto custom-scrollbar pr-2 space-y-4">
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-3">Output Contracts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilityContractsRegistry.output_contracts.map((c) => (
                    <div key={c.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-[10px] space-y-1.5">
                      <div className="text-zinc-200 font-bold flex items-center justify-between">
                        <span>{c.id}</span>
                        <span className="flex items-center gap-1.5">
                          <button onClick={() => { const next = openJsonPrompt("Edit Output Contract JSON", c); if (next) updateOutputContract(c.id, next); }} className="text-zinc-400 hover:text-zinc-200"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => { if (confirm("Delete output contract?")) deleteOutputContract(c.id); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      </div>
                      <div className="text-zinc-500">Capability: {c.capability_id}</div>
                      <div className="text-zinc-500">Output Types: {c.output_types.join(", ")}</div>
                      <div className="text-zinc-500">Artifacts: {c.produced_artifacts.join(", ") || "None"}</div>
                      <div className="text-zinc-500">Moments: {c.produced_moments.join(", ") || "None"}</div>
                      <div className="text-zinc-500">Momentum: {c.modified_momentum.join(", ") || "None"}</div>
                      <div className="text-zinc-500">Render: {c.rendering_hints.preferred.join(", ")}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Output Types</h3>
                <div className="flex flex-wrap gap-2">
                  {capabilityContractsRegistry.output_types.map((s) => <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{s}</span>)}
                </div>
              </div>
            </div>
          ) : activeMenu === "runtime_contracts" ? (
            <div className="h-[75vh] overflow-y-auto custom-scrollbar pr-2 space-y-4">
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-3">Runtime Contracts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilityContractsRegistry.runtime_contracts.map((c) => (
                    <div key={c.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-[10px] space-y-1.5">
                      <div className="text-zinc-200 font-bold flex items-center justify-between">
                        <span>{c.id}</span>
                        <span className="flex items-center gap-1.5">
                          <button onClick={() => { const next = openJsonPrompt("Edit Runtime Contract JSON", c); if (next) updateRuntimeContract(c.id, next); }} className="text-zinc-400 hover:text-zinc-200"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => { if (confirm("Delete runtime contract?")) deleteRuntimeContract(c.id); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      </div>
                      <div className="text-zinc-500">Capability: {c.capability_id}</div>
                      <div className="text-zinc-500">Execution Semantic: {c.execution_semantic}</div>
                      <div className="text-zinc-500">Retry: {c.retry_policy.strategy}</div>
                      <div className="text-zinc-500">Fallback: {c.fallback_policy.strategy}</div>
                      <div className="text-zinc-500">Continuation: {c.continuation_policy.mode}</div>
                      <div className="text-zinc-500">Timeout: {c.timeout_policy.max_timeout_ms}ms</div>
                      <div className="text-zinc-500">Priority: {c.execution_priority}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Policies</h3>
                  {[
                    { label: "Retry Policies", items: capabilityContractsRegistry.retry_policies },
                    { label: "Fallback Policies", items: capabilityContractsRegistry.fallback_policies },
                    { label: "Continuation Policies", items: capabilityContractsRegistry.continuation_policies }
                  ].map((g) => (
                    <div key={g.label} className="mb-2">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">{g.label}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((item) => <span key={item} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{item}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Validation & Governance</h3>
                  {[
                    { label: "Validation Rules", items: capabilityContractsRegistry.validation_rules },
                    { label: "Resolution Policies", items: capabilityContractsRegistry.resolution_policies },
                    { label: "State Persistence Contracts", items: capabilityContractsRegistry.state_persistence_contracts },
                    { label: "Governance Bindings", items: capabilityContractsRegistry.governance_bindings },
                    { label: "Continuation Contracts", items: capabilityContractsRegistry.continuation_contracts }
                  ].map((g) => (
                    <div key={g.label} className="mb-2">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">{g.label}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((item) => <span key={item} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">{item}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeMenu === "resolver" ? (
            <div className="h-[75vh] flex flex-col items-center justify-start p-10 border border-zinc-900 rounded-3xl bg-zinc-950/20 overflow-y-auto custom-scrollbar relative">
              
              <div className="text-center mb-10">
                <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest flex items-center justify-center space-x-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <span>Capability Resolution Graph</span>
                </h3>
                <p className="text-zinc-500 text-xs mt-2 font-mono">Live telemetry trace: Improve Savings Discipline</p>
              </div>

              {/* Graph Container */}
              <div className="w-full max-w-4xl relative">
                {/* Connecting Line (Vertical) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-900 transform -translate-x-1/2 z-0"></div>

                {/* Level 1: Context & Strategy */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4 mb-12">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 w-72 text-center shadow-2xl">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Active Journey</span>
                    <span className="text-sm text-zinc-200 font-bold">Improve Savings Discipline</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-700 transform rotate-90" />
                  <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 w-72 text-center shadow-2xl shadow-purple-900/10">
                    <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider mb-1 block">Active Strategy</span>
                    <span className="text-sm text-purple-200 font-bold">Behavioral Spend Awareness</span>
                  </div>
                </div>

                {/* Level 2: Capability Resolution */}
                <div className="relative z-10 flex flex-col items-center justify-center mb-12">
                  <div className="bg-purple-600 border border-purple-500 rounded-3xl p-5 w-80 text-center shadow-lg shadow-purple-500/20 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-[9px] uppercase font-bold px-2 py-0.5 rounded border border-purple-500 text-purple-400">Triggered Capability</div>
                    <h4 className="text-lg font-bold text-white mb-1 mt-2">Analyze Spending</h4>
                    <p className="text-purple-200 text-[11px] font-sans">Resolving execution semantics & tools...</p>
                  </div>
                </div>

                {/* Level 3: Resolved Tool Actions (Branching) */}
                <div className="relative z-10 grid grid-cols-3 gap-6 mb-12 px-6">
                  {/* Branching Lines Horizontal */}
                  <div className="absolute top-1/2 left-[15%] right-[15%] h-px bg-zinc-900 -z-10"></div>
                  
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
                    <Wrench className="w-4 h-4 text-zinc-500 mx-auto mb-2" />
                    <span className="text-[10px] text-zinc-400 uppercase block mb-1">Action 1</span>
                    <span className="text-xs text-zinc-200 font-mono">fetch_transactions</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
                    <Zap className="w-4 h-4 text-amber-500 mx-auto mb-2" />
                    <span className="text-[10px] text-zinc-400 uppercase block mb-1">Action 2</span>
                    <span className="text-xs text-zinc-200 font-mono">categorize_transactions</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
                    <Terminal className="w-4 h-4 text-cyan-500 mx-auto mb-2" />
                    <span className="text-[10px] text-zinc-400 uppercase block mb-1">Action 3</span>
                    <span className="text-xs text-zinc-200 font-mono">generate_spend_summary</span>
                  </div>
                </div>

                {/* Level 4: Produced State (Artifacts & Moments) */}
                <div className="relative z-10 grid grid-cols-2 gap-8 px-12 mb-12">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-900 pb-2">
                      <Database className="w-3.5 h-3.5" />
                      <span>Persistent Artifacts Produced</span>
                    </div>
                    <div className="bg-zinc-950/60 border border-teal-900/30 rounded-xl p-3 flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      <span className="text-xs text-teal-200 font-mono">transaction_summary</span>
                    </div>
                    <div className="bg-zinc-950/60 border border-teal-900/30 rounded-xl p-3 flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      <span className="text-xs text-teal-200 font-mono">spend_profile</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-900 pb-2">
                      <Target className="w-3.5 h-3.5" />
                      <span>Runtime Moments Fired</span>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 flex items-center space-x-3">
                      <Activity className="w-4 h-4 text-rose-500" />
                      <span className="text-xs text-rose-200 font-mono">overspending_alert</span>
                    </div>
                  </div>
                </div>

                {/* Level 5: Momentum Impact */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="bg-zinc-950 border border-emerald-900/50 rounded-2xl p-5 w-80 text-center shadow-lg shadow-emerald-900/10">
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mb-2 block flex items-center justify-center space-x-1.5">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Modified Momentum</span>
                    </span>
                    <span className="text-sm text-emerald-200 font-bold">savings_momentum</span>
                    <div className="mt-2 text-[10px] text-zinc-500 font-sans">
                      Impacts tracking vector for budget adherence.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
      
      {showCapModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button
              onClick={() => setShowCapModal(false)}
              className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                {editingCapability ? "EDIT RUNTIME CAPABILITY" : "CREATE NEW CAPABILITY"}
              </h3>
              <p className="text-[11px] text-zinc-500 font-sans mt-1">Define execution contracts and state outcomes for modular strategies.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Name</label>
                  <input
                    type="text"
                    value={capName}
                    onChange={(e) => setCapName(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Category</label>
                  <input
                    type="text"
                    value={capCategory}
                    onChange={(e) => setCapCategory(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Required Inputs</label>
                  <input
                    type="text"
                    value={capReqInputs}
                    onChange={(e) => setCapReqInputs(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Produced Artifacts</label>
                  <input
                    type="text"
                    value={capProdArtifacts}
                    onChange={(e) => setCapProdArtifacts(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Produced Moments</label>
                  <input
                    type="text"
                    value={capProdMoments}
                    onChange={(e) => setCapProdMoments(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Modified Momentum</label>
                  <input
                    type="text"
                    value={capModMomentum}
                    onChange={(e) => setCapModMomentum(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Governance Constraints</label>
                <input
                  type="text"
                  value={capGovConstraints}
                  onChange={(e) => setCapGovConstraints(e.target.value)}
                  className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                />
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900/65">
              <button
                onClick={() => setShowCapModal(false)}
                className="bg-transparent border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveCapability}
                className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all font-mono"
              >
                SAVE CAPABILITY
              </button>
            </div>
          </div>
        </div>
      )}
      {showToolModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowToolModal(false)} className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-200"><X className="w-5 h-5" /></button>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">{editingTool ? "Edit Tool" : "Create Tool"}</h3>
            <div className="space-y-3">
              <input value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="Tool name" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <input value={toolCategory} onChange={(e) => setToolCategory(e.target.value)} placeholder="Category" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <textarea value={toolDesc} onChange={(e) => setToolDesc(e.target.value)} placeholder="Description" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full min-h-[90px]" />
              <div className="grid grid-cols-2 gap-3">
                <input value={toolLatency} onChange={(e) => setToolLatency(e.target.value)} placeholder="Latency tier" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
                <input value={toolCost} onChange={(e) => setToolCost(e.target.value)} placeholder="Cost tier" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              </div>
            </div>

            {/* Nested Tool Actions Section */}
            <div className="border-t border-zinc-900 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Nested Actions ({toolActions.length})</label>
                <button
                  type="button"
                  onClick={handleAddLocalAction}
                  className="text-[9px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-amber-400 hover:text-amber-300 px-2 py-1 rounded font-bold uppercase transition-all"
                >
                  + Add Action
                </button>
              </div>

              {activeLocalActionIndex !== null && (
                <div className="bg-zinc-950 border border-amber-500/20 rounded-2xl p-4 mb-4 space-y-3">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    {activeLocalActionIndex === -1 ? "New Tool Action" : "Edit Tool Action"}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-550 font-bold">Action Name</label>
                      <input
                        value={localActionName}
                        onChange={(e) => setLocalActionName(e.target.value)}
                        placeholder="e.g. fetch_data"
                        className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2 rounded-lg outline-none w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-550 font-bold">Execution Type</label>
                      <input
                        value={localActionExecType}
                        onChange={(e) => setLocalActionExecType(e.target.value)}
                        placeholder="e.g. retrieval"
                        className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2 rounded-lg outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-550 font-bold">Description</label>
                    <input
                      value={localActionDesc}
                      onChange={(e) => setLocalActionDesc(e.target.value)}
                      placeholder="Describe what this action does..."
                      className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2 rounded-lg outline-none w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-550 font-bold">Inputs (comma-separated)</label>
                      <input
                        value={localActionInputs}
                        onChange={(e) => setLocalActionInputs(e.target.value)}
                        placeholder="e.g. userId, limit"
                        className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2 rounded-lg outline-none w-full font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-550 font-bold">Outputs (comma-separated)</label>
                      <input
                        value={localActionOutputs}
                        onChange={(e) => setLocalActionOutputs(e.target.value)}
                        placeholder="e.g. data_summary"
                        className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2 rounded-lg outline-none w-full font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveLocalActionIndex(null)}
                      className="border border-zinc-900 text-zinc-400 text-[10px] px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLocalAction}
                      className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      Apply Action
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {toolActions.map((action, idx) => (
                  <div key={action.id || idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-250">{action.name || "Unnamed Action"}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditLocalAction(idx)}
                          className="text-zinc-450 hover:text-zinc-200"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLocalAction(idx)}
                          className="text-rose-450 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{action.description}</p>
                  </div>
                ))}
                {toolActions.length === 0 && (
                  <p className="text-[10px] text-zinc-600 italic">No actions defined for this tool yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-900">
              <button onClick={() => setShowToolModal(false)} className="border border-zinc-900 text-zinc-300 text-xs px-4 py-2 rounded-xl">Cancel</button>
              <button onClick={handleSaveTool} className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded-xl">Save Tool</button>
            </div>
          </div>
        </div>
      )}
      {showToolActionModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-lg w-full p-6 space-y-5 relative">
            <button onClick={() => setShowToolActionModal(false)} className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-200"><X className="w-5 h-5" /></button>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">{editingToolAction ? "Edit Tool Action" : "Add Tool Action"}</h3>
            <div className="space-y-3">
              <input value={toolActionName} onChange={(e) => setToolActionName(e.target.value)} placeholder="Action function name" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <input value={toolActionExecutionType} onChange={(e) => setToolActionExecutionType(e.target.value)} placeholder="Execution type" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <input value={toolActionTimeoutMs} onChange={(e) => setToolActionTimeoutMs(e.target.value)} placeholder="Timeout ms" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <textarea value={toolActionDescription} onChange={(e) => setToolActionDescription(e.target.value)} placeholder="Description" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowToolActionModal(false)} className="border border-zinc-900 text-zinc-300 text-xs px-4 py-2 rounded-xl">Cancel</button>
              <button onClick={handleSaveToolAction} className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded-xl">Save Action</button>
            </div>
          </div>
        </div>
      )}
      {showArtifactModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative">
            <button onClick={() => setShowArtifactModal(false)} className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-200"><X className="w-5 h-5" /></button>
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest">{editingArtifact ? "Edit Artifact" : "Create Artifact"}</h3>
            <div className="space-y-3">
              <input value={artifactName} onChange={(e) => setArtifactName(e.target.value)} placeholder="Artifact name" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
              <textarea value={artifactDescription} onChange={(e) => setArtifactDescription(e.target.value)} placeholder="Description" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full min-h-[80px]" />
              <select value={artifactCategory} onChange={(e) => setArtifactCategory(e.target.value as "persistent" | "moment" | "momentum")} className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full">
                <option value="persistent">persistent</option>
                <option value="moment">moment</option>
                <option value="momentum">momentum</option>
              </select>
              {artifactCategory === "moment" && (
                <>
                  <input value={artifactTrigger} onChange={(e) => setArtifactTrigger(e.target.value)} placeholder="Trigger conditions" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
                  <input value={artifactTtl} onChange={(e) => setArtifactTtl(e.target.value)} placeholder="TTL" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
                </>
              )}
              {artifactCategory === "momentum" && (
                <>
                  <input value={artifactScoreRange} onChange={(e) => setArtifactScoreRange(e.target.value)} placeholder="Score range" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
                  <input value={artifactUpdateFreq} onChange={(e) => setArtifactUpdateFreq(e.target.value)} placeholder="Update frequency" className="bg-black/40 border border-zinc-900 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full" />
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowArtifactModal(false)} className="border border-zinc-900 text-zinc-300 text-xs px-4 py-2 rounded-xl">Cancel</button>
              <button onClick={handleSaveArtifact} className="bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold px-4 py-2 rounded-xl">Save Artifact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
