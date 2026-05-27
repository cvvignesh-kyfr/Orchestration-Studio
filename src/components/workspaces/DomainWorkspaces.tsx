/* eslint-disable */
"use client";

import { useBehaviorStore, Primitive, Segment, MockUser, GovernanceShield, resolveCascade, GovernanceViolation, Capability, Tool, Journey } from "@/store/useBehaviorStore";
import { 
  Sliders, 
  HelpCircle, 
  Lock, 
  User, 
  AlertCircle, 
  Info, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  ShieldAlert, 
  AlertOctagon, 
  Eye, 
  Scale, 
  ShieldX, 
  RefreshCw, 
  FileCheck, 
  Tv, 
  Sparkles, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Database, 
  Code, 
  Cpu, 
  Terminal, 
  Compass, 
  Layers, 
  GitBranch, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Wrench, 
  Zap, 
  Send, 
  BarChart3, 
  Search, 
  Save,
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle2
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import SirViewer from "@/components/modules/SirViewer";

// ==========================================
// 1. DOMAIN FOUNDATIONS WORKSPACE
// ==========================================
export function DomainFoundations() {
  const { 
    primitives, 
    userStates = {},
    resolutions = {},
    governanceShields = [],
    forbiddenBehaviors = [],
    illegalCombinations = [],
    activeL1Domain,
    organizations = [],
    updatePrimitiveBase,
    createPrimitive,
    deletePrimitive,
    updatePrimitive,
    createUserState,
    deleteUserState,
    updateUserState,
    updateResolution,
    addGovernanceShield,
    deleteGovernanceShield,
    toggleForbiddenBehavior
  } = useBehaviorStore();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collapsedFamilies, setCollapsedFamilies] = useState<Set<string>>(new Set());

  // Modal Creation States for Primitives
  const [newPrimId, setNewPrimId] = useState("");
  const [newPrimBase, setNewPrimBase] = useState(0.50);
  const [newPrimPrinciple, setNewPrimPrinciple] = useState("");
  const [newPrimDefinition, setNewPrimDefinition] = useState("");
  const [newPrimMinInterpretation, setNewPrimMinInterpretation] = useState("Low Intensity");
  const [newPrimMidInterpretation, setNewPrimMidInterpretation] = useState("Moderate Expression");
  const [newPrimMaxInterpretation, setNewPrimMaxInterpretation] = useState("Max Intensity");
  const [newPrimOwner, setNewPrimOwner] = useState("");
  const [newPrimCategory, setNewPrimCategory] = useState("");

  // Modal Creation States for User States
  const [newUserStateId, setNewUserStateId] = useState("");
  const [newUserStateName, setNewUserStateName] = useState("");
  const [newUserStateCategory, setNewUserStateCategory] = useState("Journey States");
  const [newUserStateDesc, setNewUserStateDesc] = useState("");
  const [newUserStateScenarios, setNewUserStateScenarios] = useState("");
  const [newUserStateExamples, setNewUserStateExamples] = useState("");

  const activeOrg = useMemo(() => {
    return organizations.find(o => o.id === `org_${activeL1Domain}`);
  }, [organizations, activeL1Domain]);

  useEffect(() => {
    if (activeL1Domain === "marketing") {
      setNewPrimOwner("Marketing Squad");
      if (activeOrg && activeOrg.ownedFamilies?.length > 0) {
        setNewPrimCategory(activeOrg.ownedFamilies[0]);
      }
    } else if (activeL1Domain === "product") {
      setNewUserStateCategory("Journey States");
    }
  }, [activeL1Domain, showCreateModal, activeOrg]);

  const toggleFamily = (familyName: string) => {
    setCollapsedFamilies(prev => {
      const next = new Set(prev);
      if (next.has(familyName)) {
        next.delete(familyName);
      } else {
        next.add(familyName);
      }
      return next;
    });
  };

  const toggleExpand = (itemId: string) => {
    const next = new Set(expandedItems);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    setExpandedItems(next);
  };

  // --- RENDERING HANDLERS ---

  // 1. MARKETING DOMAIN: PRIMITIVES
  const renderMarketingFoundations = () => {
    const ownedPrimitives = Object.values(primitives).filter(p => p.owner.toLowerCase().includes("marketing") || p.owner.toLowerCase().includes("squad"));
    const groups: Record<string, any[]> = {};
    
    ownedPrimitives.forEach(prim => {
      const family = prim.category;
      if (!groups[family]) groups[family] = [];
      groups[family].push(prim);
    });

    const handleCreatePrimitive = () => {
      if (!newPrimId.trim()) return;
      const formattedId = newPrimId.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
      const selectedCategory = newPrimCategory || "Identity";
      
      const newPrim = {
        id: formattedId,
        name: newPrimId.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        category: selectedCategory as any,
        path: `global_foundation.${selectedCategory.toLowerCase()}.${formattedId}`,
        base: newPrimBase,
        definition: newPrimDefinition.trim() || "Dynamic behavioral modifier.",
        principle: newPrimPrinciple.trim() || "Linguistic alignment optimization.",
        owner: "Marketing Squad",
        range: { min: 0.0, max: 1.0 },
        semanticInterpretation: {
          min: newPrimMinInterpretation.trim(),
          mid: newPrimMidInterpretation.trim(),
          max: newPrimMaxInterpretation.trim()
        }
      };

      createPrimitive(newPrim);
      setNewPrimId("");
      setNewPrimBase(0.50);
      setNewPrimPrinciple("");
      setNewPrimDefinition("");
      setShowCreateModal(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-zinc-800/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5" />
              <span>Marketing Domain Foundations</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase font-mono">
              Tone Parameters & Behavioral Primitives
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
              Author baseline defaults for brand voice, tone layers, and personality posture. Under the organizational separation model, Marketing owns the exact stylistic guidelines that define what the assistant feels like.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[10px] bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500/20 text-white px-3.5 py-2 rounded-lg font-bold uppercase flex items-center shadow-lg transition-transform hover:scale-[1.02] font-mono shrink-0"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Define Primitive
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groups).map(([family, prims]) => {
            const isCollapsed = collapsedFamilies.has(family);
            return (
              <div key={family} className={clsx("bg-zinc-950/25 border rounded-[28px] p-5 transition-all duration-200", isCollapsed ? "border-zinc-900/60" : "border-indigo-500/10")}>
                <button onClick={() => toggleFamily(family)} className="w-full flex items-center justify-between hover:text-indigo-400 transition-colors text-left focus:outline-none">
                  <div className="flex items-center space-x-3.5">
                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300", isCollapsed ? "bg-zinc-900/50 border-zinc-800 text-zinc-500" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400")}>
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-150 font-mono">{family}</h3>
                      <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5 block leading-snug">Brand persona baseline parameters and overlays</span>
                    </div>
                  </div>
                  <span className="text-[8px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                    {prims.length} {prims.length === 1 ? "Primitive" : "Primitives"}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-zinc-900/50 mt-4 animate-fadeIn">
                    {prims.map(prim => {
                      const isExpanded = expandedItems.has(prim.id);
                      return (
                        <div key={prim.id} className={clsx("rounded-[22px] p-5 flex flex-col justify-between transition-all duration-200 border bg-zinc-950/40 backdrop-blur-md relative font-mono", isExpanded ? "border-indigo-500/30" : "border-zinc-900/60")}>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <button onClick={() => toggleExpand(prim.id)} className="flex items-center space-x-1.5 hover:text-indigo-400 text-left transition-colors">
                                <span className="text-xs font-bold text-zinc-100 uppercase">{prim.name}</span>
                                <Info className="w-3.5 h-3.5 text-zinc-650" />
                              </button>
                              
                              <div className="flex items-center space-x-1.5">
                                <button onClick={() => deletePrimitive(prim.id)} className="p-1 hover:text-rose-450 text-zinc-650" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                <div className="bg-black/50 border border-zinc-900 px-2 py-0.5 rounded flex items-center shrink-0">
                                  <span className="text-[7.5px] text-zinc-500 font-bold uppercase mr-1">Base</span>
                                  <span className="text-zinc-200 text-[10px] w-9 text-right font-bold">{(prim.base || 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed mb-4">{prim.definition}</p>
                            
                            {isExpanded && (
                              <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-3.5 mb-4 text-[9px] text-zinc-400 space-y-2 font-mono">
                                <div>
                                  <span className="text-zinc-650 uppercase font-bold text-[7.5px] block">Principle Contract</span>
                                  <span className="text-zinc-300 font-sans">{prim.principle}</span>
                                </div>
                                <div className="flex justify-between items-center text-[7.5px] text-zinc-500 border-t border-zinc-900/60 pt-1.5">
                                  <span>Owner: {prim.owner}</span>
                                  <span>Path: {prim.path}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="relative pt-1">
                            <input 
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={prim.base}
                              onChange={(e) => updatePrimitiveBase(prim.id, parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                            />
                            <div className="flex justify-between text-[8px] text-zinc-500 mt-1.5">
                              <span className="truncate max-w-[120px]">0.0: {prim.semanticInterpretation.min}</span>
                              <span className="truncate max-w-[120px] text-right">1.0: {prim.semanticInterpretation.max}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#0b0b0d] border border-zinc-800/80 rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Sliders className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-zinc-150 uppercase tracking-wider">Define New Primitive</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">PRIMITIVE ID</label>
                    <input type="text" placeholder="e.g. slang_density" value={newPrimId} onChange={(e) => setNewPrimId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">FAMILY CATEGORY</label>
                    <select value={newPrimCategory} onChange={(e) => setNewPrimCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500">
                      {activeOrg?.ownedFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">PRINCIPLE CONTRACT</label>
                  <input type="text" placeholder="e.g. Tone adaptation directive" value={newPrimPrinciple} onChange={(e) => setNewPrimPrinciple(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none" />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">DEFINITION</label>
                  <textarea rows={2} placeholder="Explain what this primitive controls..." value={newPrimDefinition} onChange={(e) => setNewPrimDefinition(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-zinc-900 pt-3">
                  <div>
                    <label className="text-[7px] text-zinc-500 block mb-1">0.0 MIN</label>
                    <input type="text" value={newPrimMinInterpretation} onChange={(e) => setNewPrimMinInterpretation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-[9px] text-zinc-300" />
                  </div>
                  <div>
                    <label className="text-[7px] text-zinc-500 block mb-1">0.5 MID</label>
                    <input type="text" value={newPrimMidInterpretation} onChange={(e) => setNewPrimMidInterpretation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-[9px] text-zinc-300" />
                  </div>
                  <div>
                    <label className="text-[7px] text-zinc-500 block mb-1">1.0 MAX</label>
                    <input type="text" value={newPrimMaxInterpretation} onChange={(e) => setNewPrimMaxInterpretation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-[9px] text-zinc-300" />
                  </div>
                </div>
                <div className="border-t border-zinc-900 pt-3">
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1 font-mono">BASE VALUE: {newPrimBase.toFixed(2)}</label>
                  <input type="range" min="0" max="1" step="0.01" value={newPrimBase} onChange={(e) => setNewPrimBase(parseFloat(e.target.value))} className="w-full h-1 bg-zinc-800 accent-indigo-500 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-900">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-855 rounded-lg text-[10px] text-zinc-400 font-bold uppercase">Cancel</button>
                <button onClick={handleCreatePrimitive} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] text-white font-bold uppercase font-mono">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. PRODUCT DOMAIN: USER STATES
  const renderProductFoundations = () => {
    const states = Object.values(userStates);
    const groups: Record<string, any[]> = {};
    
    states.forEach(state => {
      const family = state.category;
      if (!groups[family]) groups[family] = [];
      groups[family].push(state);
    });

    const handleCreateState = () => {
      if (!newUserStateId.trim() || !newUserStateName.trim()) return;
      const stateObj = {
        id: newUserStateId.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
        name: newUserStateName,
        category: newUserStateCategory,
        scenarios: newUserStateScenarios.split("\n").map(s => s.trim()).filter(Boolean),
        examples: newUserStateExamples.split("\n").map(s => s.trim()).filter(Boolean),
        description: newUserStateDesc.trim() || "Active product journey or cognitive user state dimension.",
        owner: "Product"
      };

      createUserState(stateObj as any);
      setNewUserStateId("");
      setNewUserStateName("");
      setNewUserStateDesc("");
      setNewUserStateScenarios("");
      setNewUserStateExamples("");
      setShowCreateModal(false);
    };

    const targetGoalStates = [
      { id: "confident", name: "Confident State", definition: "Trust-affirmed, clear on next steps, ready to proceed.", verification: "Completes purchase evaluation or moves to payment without hesitation loops.", journeys: ["uncertainty_to_confidence"], color: "border-emerald-500/20 text-emerald-450 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.15)]" },
      { id: "calm", name: "Calm State", definition: "Lowered cognitive load, balanced focus, low informational stress.", verification: "Standard dwell time on screens, scroll speed is uniform and slow.", journeys: ["overwhelm_to_control"], color: "border-sky-500/20 text-sky-400 bg-sky-500/5 shadow-[0_0_12px_rgba(14,165,233,0.15)]" },
      { id: "informed", name: "Informed State", definition: "Clear comprehension of tradeoffs, eligibility terms, and pricing matrices.", journeys: ["hesitation_to_commitment"], verification: "Interacts with comparison lists, does not repeat clarification prompts.", color: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.15)]" },
      { id: "committed", name: "Committed State", definition: "Clear high intent, complete alignment, ready for instant action execution.", journeys: ["hesitation_to_commitment"], verification: "Completes primary flow checkout or triggers secondary credential setup.", color: "border-purple-500/20 text-purple-400 bg-purple-500/5 shadow-[0_0_12px_rgba(168,85,247,0.15)]" },
      { id: "resolved", name: "Resolved State", definition: "Dynamic workflow variables and ambiguous form errors fully settled.", journeys: [], verification: "Form inputs verified successfully with zero syntax errors.", color: "border-teal-500/20 text-teal-400 bg-teal-500/5 shadow-[0_0_12px_rgba(20,184,166,0.15)]" }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-zinc-800/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Agentic Product Foundations</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase font-mono">
              Sensed User States & Target Goal States
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
              Calibrate user trigger points and target emotional/cognitive outcomes. Journeys dynamically transition users from a sensed state to a target goal state by running strategies.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[10px] bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500/20 text-white px-3.5 py-2 rounded-lg font-bold uppercase flex items-center shadow-lg transition-transform hover:scale-[1.02] font-mono shrink-0"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Define State
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          {/* Left Column: Sensed User States (Trigger points) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400">1. Sensed User States (Triggers)</span>
              <span className="text-[8px] text-zinc-650 uppercase">Evaluated Telemetry Triggers</span>
            </div>

            <div className="space-y-6">
              {Object.entries(groups).map(([family, items]) => {
                const isCollapsed = collapsedFamilies.has(family);
                return (
                  <div key={family} className={clsx("bg-zinc-950/25 border rounded-[28px] p-5 transition-all duration-200", isCollapsed ? "border-zinc-900/60" : "border-indigo-500/10")}>
                    <button onClick={() => toggleFamily(family)} className="w-full flex items-center justify-between hover:text-indigo-400 transition-colors text-left focus:outline-none">
                      <div className="flex items-center space-x-3.5">
                        <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300", isCollapsed ? "bg-zinc-900/50 border-zinc-800 text-zinc-500" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400")}>
                          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-150">{family}</h3>
                          <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5 block leading-snug">Dynamic user segments and cognitive states evaluation</span>
                        </div>
                      </div>
                      <span className="text-[8px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {items.length} {items.length === 1 ? "State" : "States"}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div className="grid grid-cols-1 gap-4 pt-5 border-t border-zinc-900/50 mt-4 animate-fadeIn">
                        {items.map(state => {
                          const isExpanded = expandedItems.has(state.id);
                          return (
                            <div key={state.id} className={clsx("rounded-[22px] p-5 flex flex-col justify-between transition-all duration-200 border bg-zinc-950/40 backdrop-blur-md relative", isExpanded ? "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.03)]" : "border-zinc-900/60")}>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                                  <button onClick={() => toggleExpand(state.id)} className="flex items-center space-x-1.5 hover:text-indigo-400 text-left transition-colors">
                                    <span className="text-xs font-bold text-zinc-100 uppercase">{state.name}</span>
                                    <Info className="w-3.5 h-3.5 text-zinc-650" />
                                  </button>
                                  <button onClick={() => deleteUserState(state.id)} className="p-1 hover:text-rose-400 text-zinc-655" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{state.description}</p>

                                {/* Multidimensional State UI */}
                                <div className="space-y-4 pt-2">
                                  
                                  {/* Observable Signals */}
                                  <div className="space-y-1.5">
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Observable Signals</span>
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                      {(state.observableSignals || []).map((sc: string, scIdx: number) => (
                                        <div key={scIdx} className="bg-rose-500/10 border border-rose-500/20 rounded-md px-2 py-0.5 text-[9px] text-rose-400 font-sans flex items-center space-x-1">
                                          <span>{sc}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Suggested Strategies */}
                                  <div className="space-y-1.5 border-t border-zinc-900/60 pt-3">
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Suggested Strategies</span>
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                      {(state.suggestedStrategies || []).map((ex: string, exIdx: number) => (
                                        <div key={exIdx} className="bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-0.5 text-[9px] text-indigo-400 font-bold uppercase tracking-wide flex items-center space-x-1">
                                          <span>{ex.replace(/_/g, " ")}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Compatible Journeys */}
                                  <div className="space-y-1.5 border-t border-zinc-900/60 pt-3">
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Compatible Journeys (Goal Paths)</span>
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                      {(state.compatibleJourneys || []).map((cj: string, cjIdx: number) => (
                                        <div key={cjIdx} className="bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-0.5 text-[9px] text-amber-400 font-bold uppercase tracking-wide flex items-center space-x-1">
                                          <span>{cj.replace(/_/g, " ")}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Adaptive Guidance */}
                                  <div className="space-y-1.5 border-t border-zinc-900/60 pt-3">
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Runtime Adaptive Guidance</span>
                                    <div className="flex flex-col gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                                      {(state.adaptiveGuidance || []).map((ag: string, agIdx: number) => (
                                        <div key={agIdx} className="bg-emerald-500/5 border border-emerald-500/10 rounded px-2 py-1 text-[9.5px] text-emerald-400 font-sans flex items-center space-x-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mr-1.5 shrink-0"></span>
                                          <span>{ag}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Desired Target Goal States */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400">2. Target Goal States (Outcomes)</span>
              <span className="text-[8px] text-emerald-450 uppercase">Outcome Demographics</span>
            </div>

            <div className="space-y-4">
              {targetGoalStates.map(goal => (
                <div key={goal.id} className={clsx("rounded-[24px] border p-5 space-y-3.5 backdrop-blur-md relative overflow-hidden transition-all duration-300 group hover:border-zinc-800", goal.color)}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{goal.name}</span>
                    <span className="text-[7.5px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 px-2 py-0.5 rounded font-extrabold uppercase">Outcome Target</span>
                  </div>

                  <p className="text-[10.5px] text-zinc-350 leading-relaxed font-sans font-medium">{goal.definition}</p>

                  <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-2">
                    <span className="text-[7.5px] text-zinc-550 uppercase tracking-widest block font-bold">Goal Verification Rule</span>
                    <p className="text-[9.5px] text-zinc-300 font-sans italic">"{goal.verification}"</p>
                  </div>

                  <div className="flex justify-between items-center text-[8.5px] text-zinc-500 pt-1">
                    <span>Attached Journeys:</span>
                    <div className="flex gap-1">
                      {goal.journeys.map(j => (
                        <span key={j} className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{j.replace(/_/g, " ")}</span>
                      ))}
                      {goal.journeys.length === 0 && <span className="italic text-zinc-650">No static journeys</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#0b0b0d] border border-zinc-800/80 rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Sliders className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-zinc-150 uppercase tracking-wider">Define New Product User State</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">USER STATE ID</label>
                    <input type="text" placeholder="e.g. decision_fatigue" value={newUserStateId} onChange={(e) => setNewUserStateId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">STATE CATEGORY</label>
                    <select value={newUserStateCategory} onChange={(e) => setNewUserStateCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500">
                      {activeOrg?.ownedFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">STATE DISPLAY NAME</label>
                  <input type="text" placeholder="e.g. High Decision Fatigue" value={newUserStateName} onChange={(e) => setNewUserStateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none" />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">STATE DESCRIPTION</label>
                  <textarea rows={2} placeholder="Explain how the system senses or evaluates this state..." value={newUserStateDesc} onChange={(e) => setNewUserStateDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none outline-none" />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">TARGET SCENARIOS & SITUATIONS (ONE PER LINE)</label>
                  <textarea rows={2} placeholder="e.g. Initial login to platform&#10;Setting up UPI credentials" value={newUserStateScenarios} onChange={(e) => setNewUserStateScenarios(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">BEHAVIORAL EXAMPLES & INDICATORS (ONE PER LINE)</label>
                  <textarea rows={2} placeholder="e.g. User prompts 'how do I start?'&#10;Taps back button three times" value={newUserStateExamples} onChange={(e) => setNewUserStateExamples(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-900">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-[10px] text-zinc-400 font-bold uppercase">Cancel</button>
                <button onClick={handleCreateState} className="px-4 py-2 bg-indigo-650 hover:bg-indigo-500 rounded-lg text-[10px] text-white font-bold uppercase">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. GOVERNANCE DOMAIN: CONSTRAINTS
  const renderGovernanceFoundations = () => {
    const shieldGroups: Record<string, any[]> = {};
    governanceShields.forEach(s => {
      const family = s.category;
      if (!family) return;
      if (!shieldGroups[family]) shieldGroups[family] = [];
      shieldGroups[family].push(s);
    });

    return (
      <div className="space-y-6">
        <div className="border-b border-zinc-800/60 pb-6">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>Governance Domain Foundations</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase font-mono">
            Compliance Constraints & Active System Safety Caps
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Review and adjust baseline security laws. Under the platform separation policy, Governance constraints always act as absolute constraints that override all active Marketing defaults and Product strategy values at runtime.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(shieldGroups).map(([family, shields]) => {
            const isCollapsed = collapsedFamilies.has(family);
            return (
              <div key={family} className={clsx("bg-zinc-950/25 border rounded-[28px] p-5 transition-all duration-200", isCollapsed ? "border-zinc-900/60" : "border-amber-500/10")}>
                <button onClick={() => toggleFamily(family)} className="w-full flex items-center justify-between hover:text-amber-450 transition-colors text-left focus:outline-none">
                  <div className="flex items-center space-x-3.5">
                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300", isCollapsed ? "bg-zinc-900/50 border-zinc-800 text-zinc-500" : "bg-amber-500/10 border-amber-500/30 text-amber-400")}>
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-150 font-mono">{family}</h3>
                      <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5 block leading-snug">Hard clamps protecting users from behavioral manipulation and predatory pacing</span>
                    </div>
                  </div>
                  <span className="text-[8px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                    {shields.length} {shields.length === 1 ? "Constraint" : "Constraints"}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-zinc-900/50 mt-4 animate-fadeIn font-mono">
                    {shields.map(shield => (
                      <div key={shield.id} className="rounded-[22px] p-5 border border-zinc-900/60 bg-zinc-950/40 backdrop-blur-md relative flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-100 uppercase">{shield.name}</span>
                            <span className="text-[8px] bg-amber-500/10 border border-amber-550/30 text-amber-400 px-2 py-0.5 rounded font-mono uppercase font-bold shrink-0">
                              {shield.limitType === "cap" ? "MAX LIMIT" : "MIN LIMIT"}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-sans leading-relaxed mb-4">{shield.description}</p>
                        </div>
                        <div className="bg-black/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500">Target:</span>
                          <span className="text-zinc-200 font-bold uppercase">{shield.targetPrimitiveId}</span>
                          <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/60">{(shield.thresholdValue || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. RUNTIME DOMAIN: RESOLUTION ENGINE & TRACING TELEMETRY
  const renderRuntimeFoundations = () => {
    const resList = Object.values(resolutions);
    const groups: Record<string, any[]> = {};
    resList.forEach(r => {
      const family = r.category;
      if (!groups[family]) groups[family] = [];
      groups[family].push(r);
    });

    return (
      <div className="space-y-6">
        <div className="border-b border-zinc-800/60 pb-6">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>Runtime Observability & Engine telemetry</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase font-mono">
            Deterministic Vector kernel & Resolution Stack
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Engineering Telemetry console. Observe the 5-layer resolution stack dynamically compiling conversational parameters in real-time. Watch overlays merge, user states score, and safety constraints override active strategies synchronously.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-300">Active Resolution Stack</h3>
            <div className="space-y-3.5">
              {Object.entries(groups).map(([family, items]) => (
                <div key={family} className="bg-zinc-950/30 border border-zinc-900 rounded-[22px] p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{family}</span>
                    <span className="text-[7.5px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold">Layer Resolver</span>
                  </div>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start border-t border-zinc-900/60 pt-2.5 mt-2 text-[10px]">
                      <div>
                        <span className="text-zinc-200 font-bold block">{item.name}</span>
                        <span className="text-zinc-500 text-[9px] font-sans mt-0.5 block leading-normal">{item.description}</span>
                      </div>
                      <button 
                        onClick={() => updateResolution(item.id, item.status === "active" ? "standby" : "active")} 
                        className={clsx(
                          "px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all duration-200 border",
                          item.status === "active" 
                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.1)]" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}
                      >
                        {item.status}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-300">Live Tracing Telemetry</h3>
            <div className="bg-black/90 border border-zinc-900 rounded-[24px] p-5 h-[380px] overflow-y-auto custom-scrollbar flex flex-col space-y-3.5 text-[9px] leading-relaxed text-zinc-400">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <span className="text-zinc-500 uppercase text-[8px] font-bold tracking-wide">Tracer Status: Streaming</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-indigo-400 font-bold block">[01] INTENT RESOLVED</span>
                  <span className="text-zinc-500 text-[8px]">Token: "Delayed salary support transfer error"</span>
                  <span className="text-zinc-300 block">UPI intent vector identified with confidence: 0.98.</span>
                </div>
                <div className="border-t border-zinc-900 pt-1.5">
                  <span className="text-emerald-400 font-bold block">[02] USER STATES SCORED</span>
                  <span className="text-zinc-500 text-[8px]">Cognitive: 0.85 (overloaded) | Emotional: 0.70 (frustrated)</span>
                  <span className="text-zinc-300 block">Psychological status triggers dynamic strategy selection loops.</span>
                </div>
                <div className="border-t border-zinc-900 pt-1.5">
                  <span className="text-purple-400 font-bold block">[03] STRATEGY ACTIVATED</span>
                  <span className="text-zinc-500 text-[8px]">Attention Strategies: Cognitive Chunking</span>
                  <span className="text-zinc-300 block">Applying modifier overrides: concise +0.30, friendly +0.10.</span>
                </div>
                <div className="border-t border-zinc-900 pt-1.5">
                  <span className="text-amber-500 font-bold block">[04] GOVERNANCE OVERRIDE CLAMP</span>
                  <span className="text-zinc-500 text-[8px]">Constraint: Emotional Safety Cap (empathetic max 0.85)</span>
                  <span className="text-rose-400 block">Active clamp applied! Empathetic modifier truncated from 0.90 to 0.85.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-8 overflow-y-auto max-w-5xl font-mono text-zinc-200 custom-scrollbar space-y-6 relative z-10">
      {activeL1Domain === "marketing" && renderMarketingFoundations()}
      {activeL1Domain === "product" && renderProductFoundations()}
      {activeL1Domain === "governance" && renderGovernanceFoundations()}
      {activeL1Domain === "engineering" && renderRuntimeFoundations()}
    </div>
  );
}

export function DomainLayeredBehaviors() {
  const { 
    activeL1Domain,
    segments,
    primitives,
    governanceShields,
    forbiddenBehaviors,
    illegalCombinations,
    updateSegmentModifier,
    addGovernanceShield,
    deleteGovernanceShield,
    toggleForbiddenBehavior,
    journeys,
    journeyModifiers,
    updateJourneyModifier,
    createJourney,
    updateJourney,
    deleteJourney,
    cloneJourney,
    publishJourney,
    tools,
    artifacts
  } = useBehaviorStore();

  const [selectedSegId, setSelectedSegId] = useState<string>("style_supportive");
  const selectedSegment = segments.find(s => s.id === selectedSegId) || segments[0];

  // Journey States & Authoring Controls
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("spending_awareness");
  const selectedJourney = journeys.find(j => j.id === selectedJourneyId) || journeys[0] || {
    id: "",
    name: "No Active Journey",
    category: "General",
    purpose: "",
    commonSituations: [],
    guidancePriorities: [],
    guidanceStyles: [],
    successIndicators: [],
    version: "0.0.0",
    status: "draft"
  };

  const [searchJourneyQuery, setSearchJourneyQuery] = useState("");
  const [showCreateJourneyModal, setShowCreateJourneyModal] = useState(false);
  const [showCloneJourneyModal, setShowCloneJourneyModal] = useState(false);
  
  // Create state inputs
  const [newJourneyName, setNewJourneyName] = useState("");
  const [newJourneyId, setNewJourneyId] = useState("");
  const [newJourneyCategory, setNewJourneyCategory] = useState("Mindfulness");
  const [newJourneyPurpose, setNewJourneyPurpose] = useState("");

  // Clone state inputs
  const [cloneName, setCloneName] = useState("");
  const [cloneId, setCloneId] = useState("");

  // Tag inputs
  const [newSituationInput, setNewSituationInput] = useState("");
  const [newPriorityInput, setNewPriorityInput] = useState("");
  const [newIndicatorInput, setNewIndicatorInput] = useState("");
  const [newPreferredBehaviorInput, setNewPreferredBehaviorInput] = useState("");
  const [newRestrictedCapabilityInput, setNewRestrictedCapabilityInput] = useState("");
  const [simulationLogs, setSimulationLogs] = useState<Array<{ timestamp: string; message: string; type: string }>>([]);
  const [isSimulatingAssistance, setIsSimulatingAssistance] = useState<string | null>(null);

  // Governance variables
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [newShieldName, setNewShieldName] = useState("");
  const [newShieldPrimitive, setNewShieldPrimitive] = useState("warmth");
  const [newShieldType, setNewShieldType] = useState<"cap" | "floor">("cap");
  const [newShieldValue, setNewShieldValue] = useState("0.50");
  const [newShieldCondition, setNewShieldCondition] = useState("always");
  const [newShieldDesc, setNewShieldDesc] = useState("");

  const handleCreateShield = () => {
    if (!newShieldName.trim()) return;
    const newShield: GovernanceShield = {
      id: `gov_${newShieldName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
      name: newShieldName.trim(),
      targetPrimitiveId: newShieldPrimitive,
      limitType: newShieldType,
      thresholdValue: parseFloat(newShieldValue) || 0.50,
      condition: newShieldCondition,
      category: "financial_safety",
      description: newShieldDesc.trim() || `Clamps ${newShieldPrimitive} output.`
    };
    addGovernanceShield(newShield);
    setNewShieldName("");
    setNewShieldDesc("");
    setShowShieldModal(false);
  };

  if (activeL1Domain === "marketing") {
    return (
      <div className="h-full flex text-zinc-100 font-mono relative z-10 overflow-hidden">
        
        {/* Left Segment List */}
        <div className="w-80 border-r border-zinc-900 bg-zinc-950/30 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/80 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Active Overlay Files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 pr-1 custom-scrollbar">
            {segments.map(seg => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegId(seg.id)}
                className={clsx(
                  "w-full text-left px-4 py-3 text-xs flex flex-col space-y-1 border-l-2 transition-all",
                  selectedSegment.id === seg.id 
                    ? "bg-indigo-500/5 border-indigo-500 text-indigo-300 font-semibold" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10"
                )}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold truncate text-[11px]">{seg.name}</span>
                  <span className="text-[7.5px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-850">{seg.category}</span>
                </div>
                <p className="text-[9.5px] font-sans font-normal text-zinc-550 leading-snug line-clamp-2">{seg.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Details (Delta modifiers editing) */}
        <div className="flex-1 p-8 overflow-y-auto max-w-4xl custom-scrollbar space-y-6">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span>Delta-Based Modifier Editor</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-150">
              {selectedSegment.name} Behavior Modifier Delta Set
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
              Modifiers represent **Deltas** stacked dynamically onto global foundations. **Enforce Additive Layering**: Define overrides strictly as positive or negative adjustments (e.g. `+0.25`, `-0.10`). Unmodified parameters inherit downward.
            </p>
          </div>

          {/* Rules / Targeting */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 space-y-2">
            <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">Context Targeting Filters</span>
            <div className="flex items-center flex-wrap gap-2">
              {selectedSegment.rules.map((rule, idx) => (
                <div key={idx} className="bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-lg text-[10px] text-indigo-300 font-mono">
                  {rule.field} <span className="text-zinc-650">{rule.operator.replace("_", " ")}</span> "{rule.value}"
                </div>
              ))}
            </div>
          </div>

          {/* Delta Sliders */}
          <div className="space-y-4">
            <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">Layer Delta Adjustments</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(primitives)
                .filter(p => {
                  const ownerLower = (p.owner || "").toLowerCase();
                  return ownerLower.includes("marketing");
                })
                .map(prim => {
                  const modifier = selectedSegment.modifiers[prim.id];
                  const deltaValue = modifier ? modifier.value : 0;
                  const isModified = modifier !== undefined;

                  return (
                    <div 
                      key={prim.id}
                      className={clsx(
                        "rounded-2xl p-4 border transition-all",
                        isModified ? "bg-indigo-500/5 border-indigo-500/20" : "bg-transparent border-zinc-900/60 opacity-60"
                      )}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-zinc-200">{prim.id}</span>
                          <span className="text-[7.5px] text-zinc-600 font-mono">Base defaults: {prim.base.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={clsx(
                            "text-[10px] font-mono font-bold px-2 py-0.5 rounded",
                            isModified 
                              ? deltaValue > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              : "bg-zinc-900 text-zinc-600"
                          )}>
                            {isModified ? (deltaValue > 0 ? "+" : "") + deltaValue.toFixed(2) : "Inherited"}
                          </span>

                          <button
                            onClick={() => updateSegmentModifier(selectedSegment.id, prim.id, isModified ? 0 : 0.1)}
                            className="text-[8px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold"
                          >
                            {isModified ? "Clear" : "Override"}
                          </button>
                        </div>
                      </div>

                      {isModified && (
                        <div className="relative pt-1">
                          <input 
                            type="range"
                            min="-0.50"
                            max="0.50"
                            step="0.01"
                            value={deltaValue}
                            onChange={(e) => updateSegmentModifier(selectedSegment.id, prim.id, parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded appearance-none accent-indigo-500 focus:outline-none"
                          />
                          <div className="flex justify-between text-[7px] text-zinc-500 mt-1 font-mono">
                            <span>-0.50 clamp</span>
                            <span>+0.50 clamp</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // --- RENDER PRODUCT INTERACTIONS ---
  if (activeL1Domain === "product") {
    const currentJourney = selectedJourney;

    // Filter journeys based on search query
    const filteredJourneys = journeys.filter(j => 
      j.name.toLowerCase().includes(searchJourneyQuery.toLowerCase()) ||
      j.category.toLowerCase().includes(searchJourneyQuery.toLowerCase())
    );

    const guidanceStylesCatalog = [
      { id: "reflective_questioning", label: "Reflective Questioning", desc: "Prompts mindfulness and self-evaluation of expenses." },
      { id: "spending_summaries", label: "Spending Summaries", desc: "Synthesizes monthly category details concisely." },
      { id: "gentle_nudging", label: "Gentle Nudging", desc: "Softly redirects behaviors without friction." },
      { id: "pattern_highlighting", label: "Pattern Highlighting", desc: "Reveals discretionary anomalies dynamically." },
      { id: "step_by_step_planning", label: "Step-by-Step Planning", desc: "Guides the user node-by-node sequentially." },
      { id: "educational_scaffolding", label: "Educational Scaffolding", desc: "Provides structural definitions and tradeoff explanations." },
      { id: "encouragement", label: "Encouragement & Coaching", desc: "Validates budgeting progression positively." },
      { id: "simplification", label: "Extreme Simplification", desc: "Clips unnecessary variables and clutter." },
      { id: "comparison_framing", label: "Comparison Framing", desc: "Structures choices side-by-side cleanly." },
      { id: "affordability_explanation", label: "Affordability Explanation", desc: "Explains terms and thresholds clearly." },
      { id: "reassurance", label: "Emotional Reassurance", desc: "Lowers anxiety and anchors system trust." }
    ];

    const toggleGuidanceStyle = (styleId: string) => {
      const activeStyles = currentJourney.guidanceStyles || [];
      const nextStyles = activeStyles.includes(styleId)
        ? activeStyles.filter(s => s !== styleId)
        : [...activeStyles, styleId];
      updateJourney(currentJourney.id, { guidanceStyles: nextStyles });
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "production":
          return "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
        case "staging":
          return "border-amber-500/20 text-amber-400 bg-amber-500/5";
        case "archived":
          return "border-rose-500/20 text-rose-450 bg-rose-500/5";
        default:
          return "border-zinc-800 text-zinc-400 bg-zinc-900/50";
      }
    };
    const recommendations = (() => {
      const cat = (currentJourney.category || "").toLowerCase();
      if (cat.includes("mind") || cat.includes("aware")) {
        return {
          caps: ["spending_analysis", "subscription_detection", "spending_categorization", "trend_summaries"],
          arts: ["monthly_spending_summary", "discretionary_spending_insights"],
          msg: "Mindfulness matches 'Financial Analysis' capabilities and 'Spending Summary' artifacts."
        };
      } else if (cat.includes("coach") || cat.includes("confid")) {
        return {
          caps: ["budgeting_assistance", "affordability_estimation", "savings_forecasting", "educational_explanations"],
          arts: ["starter_budget", "savings_plan", "budgeting_checklist"],
          msg: "Coaching matches 'Guidance & Planning' capabilities and 'Budget Plans' artifacts."
        };
      } else if (cat.includes("decision") || cat.includes("eval")) {
        return {
          caps: ["affordability_analysis", "financing_comparison", "scenario_simulation", "generate_summaries"],
          arts: ["purchase_comparison_report", "affordability_breakdown"],
          msg: "Decision support matches 'Tradeoff Analysis' capabilities and 'Comparison Reports'."
        };
      }
      return {
        caps: ["educational_explanations", "answer_questions"],
        arts: ["learning_plans"],
        msg: "General category matches 'Education' capabilities and 'Learning Plans'."
      };
    })();

    const handleApplyRecommendations = () => {
      const importanceMap = { ...(currentJourney.artifactImportance || {}) };
      recommendations.arts.forEach(a => {
        if (!importanceMap[a]) {
          importanceMap[a] = "primary";
        }
      });
      updateJourney(currentJourney.id, {
        allowedCapabilities: Array.from(new Set([...(currentJourney.allowedCapabilities || []), ...recommendations.caps])),
        artifactsCanCreate: Array.from(new Set([...(currentJourney.artifactsCanCreate || []), ...recommendations.arts])),
        artifactImportance: importanceMap
      });
      
      setSimulationLogs(prev => [
        { timestamp: new Date().toLocaleTimeString(), message: `Applied category-optimized capability recommendation for "${currentJourney.category}"`, type: "info" },
        ...prev
      ]);
    };

    return (
      <div className="h-full flex text-zinc-100 font-mono relative z-10 overflow-hidden animate-fadeIn">
        
        {/* Left Column: Adaptive Journeys Archetypes List */}
        <div className="w-80 border-r border-zinc-900 bg-zinc-950/30 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-zinc-850 bg-zinc-950/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <GitBranch className="w-3.5 h-3.5 mr-1 text-indigo-400 animate-pulse" /> Adaptive Journeys
              </span>
              <button
                onClick={() => setShowCreateJourneyModal(true)}
                className="p-1 hover:text-indigo-400 text-zinc-400 transition-colors"
                title="Create New Journey"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchJourneyQuery}
                onChange={(e) => setSearchJourneyQuery(e.target.value)}
                placeholder="Search journey goals..."
                className="w-full bg-zinc-900/60 border border-zinc-800 text-[10px] text-zinc-300 rounded-lg pl-8 pr-3 py-1.5 focus:border-indigo-500/50 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            <div className="px-3 py-1 text-[8px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Active Archetypes</div>
            {filteredJourneys.map(j => {
              const isSelected = j.id === selectedJourneyId;
              return (
                <button
                  key={j.id}
                  onClick={() => setSelectedJourneyId(j.id)}
                  className={clsx(
                    "w-full text-left px-4 py-3.5 text-xs flex flex-col space-y-1.5 border-l-2 transition-all",
                    isSelected 
                      ? "border-indigo-500 bg-indigo-500/5 text-indigo-300 font-semibold" 
                      : "border-transparent text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/10"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold truncate text-[11px]">{j.name}</span>
                    <span className="text-[7.5px] uppercase font-mono px-1 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-850">v{j.version}</span>
                  </div>
                  <span className="text-[9px] text-zinc-550 leading-snug font-sans block line-clamp-1">
                    {j.purpose || "No goal defined."}
                  </span>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[8px] text-zinc-600 font-bold uppercase">{j.category}</span>
                    <span className={clsx("text-[7.5px] uppercase px-1.5 py-0.2 rounded-md border font-bold", getStatusColor(j.status))}>
                      {j.status}
                    </span>
                  </div>
                </button>
              );
            })}
            {filteredJourneys.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-[10px]">No Journeys Found</div>
            )}
          </div>
        </div>

        {/* Right Details Panel: Journey Composition Studio */}
        <div className="flex-1 p-8 overflow-y-auto max-w-4xl custom-scrollbar space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
            <div>
              <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Journey Composition Studio</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-150 flex items-center">
                {currentJourney.name}
                <span className="text-[9px] text-zinc-500 font-mono font-medium ml-3 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  Version {currentJourney.version}
                </span>
              </h2>
              <p className="text-[10px] text-zinc-400 mt-2 font-sans max-w-2xl leading-relaxed">
                Configure user experience guidance paradigms. Journeys prioritize system behaviors and guidance patterns dynamically compiled by the orchestration engine.
              </p>
            </div>

            {/* Actions */}
            {currentJourney.id && (
              <div className="flex items-center space-x-2 shrink-0">
                {/* Publish Status Dropdown */}
                <div className="flex items-center space-x-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase px-2">STATUS:</span>
                  <select
                    value={currentJourney.status}
                    onChange={(e) => publishJourney(currentJourney.id, e.target.value as any)}
                    className="bg-zinc-900 border-none text-[9.5px] font-bold text-zinc-300 outline-none rounded px-2 py-1 uppercase cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Clone Journey */}
                <button
                  onClick={() => {
                    setCloneId(`${currentJourney.id}_copy`);
                    setCloneName(`${currentJourney.name} (Clone)`);
                    setShowCloneJourneyModal(true);
                  }}
                  className="bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-[9px] uppercase font-bold flex items-center transition-colors"
                  title="Clone this journey configuration"
                >
                  <Layers className="w-3.5 h-3.5 mr-1" /> Clone
                </button>

                {/* Archive / Delete */}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this journey?")) {
                      deleteJourney(currentJourney.id);
                      setSelectedJourneyId("");
                    }
                  }}
                  className="bg-zinc-950 border border-zinc-850 hover:border-rose-900/50 text-zinc-400 hover:text-rose-400 px-3 py-2 rounded-lg text-[9px] uppercase font-bold flex items-center transition-colors"
                  title="Remove this journey"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </button>
              </div>
            )}
          </div>

          {currentJourney.id ? (
            <div className="space-y-6">
              
              {/* Question 1: What is this journey trying to help the user achieve? */}
              <div className="bg-zinc-950/45 border border-zinc-900 rounded-[24px] p-5 space-y-3">
                <div className="flex items-center space-x-2 border-b border-zinc-900/60 pb-2">
                  <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">1</div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">What is this journey trying to help the user achieve?</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-550 uppercase font-mono block">Intended Goal Purpose</label>
                  <textarea
                    value={currentJourney.purpose || ""}
                    onChange={(e) => updateJourney(currentJourney.id, { purpose: e.target.value })}
                    placeholder="e.g. Help users become more conscious of spending behavior and discretionary patterns."
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-xs text-zinc-300 font-sans leading-relaxed focus:border-indigo-500 outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Grid for Questions 2, 3, 5 (Tag lists) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Question 2: What kinds of users commonly benefit from this journey? */}
                <div className="bg-zinc-950/45 border border-zinc-900 rounded-[24px] p-5 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-zinc-900/60 pb-2">
                    <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">2</div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Who benefits from this journey?</span>
                  </div>
                  
                  <div className="space-y-3">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Common User Situations</span>
                    <div className="flex flex-wrap gap-1.5 min-h-12 align-top">
                      {(currentJourney.commonSituations || []).map((sit, idx) => (
                        <div key={idx} className="bg-rose-500/5 border border-rose-500/20 rounded-md px-2 py-1 text-[9.5px] text-rose-455 font-sans flex items-center space-x-1.5">
                          <span>{sit}</span>
                          <button
                            onClick={() => {
                              const list = (currentJourney.commonSituations || []).filter(s => s !== sit);
                              updateJourney(currentJourney.id, { commonSituations: list });
                            }}
                            className="hover:text-rose-300 text-rose-600 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add situation */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={newSituationInput}
                        onChange={(e) => setNewSituationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSituationInput.trim()) {
                            e.preventDefault();
                            const list = currentJourney.commonSituations || [];
                            if (!list.includes(newSituationInput.trim())) {
                              updateJourney(currentJourney.id, { commonSituations: [...list, newSituationInput.trim()] });
                            }
                            setNewSituationInput("");
                          }
                        }}
                        placeholder="+ Add user situation..."
                        className="bg-zinc-900 border border-zinc-850 focus:border-indigo-500 text-[10px] text-zinc-300 px-3 py-1.5 rounded-lg outline-none w-full"
                      />
                      <span className="text-[7.5px] text-zinc-600 block mt-1">Press Enter to add tag. E.g. "impulsive spending"</span>
                    </div>
                  </div>
                </div>

                {/* Question 3: What behaviors should the system prioritize? */}
                <div className="bg-zinc-950/45 border border-zinc-900 rounded-[24px] p-5 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-zinc-900/60 pb-2">
                    <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">3</div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">What behaviors to prioritize?</span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Guidance Priorities</span>
                    <div className="flex flex-wrap gap-1.5 min-h-12 align-top">
                      {(currentJourney.guidancePriorities || []).map((prio, idx) => (
                        <div key={idx} className="bg-indigo-500/5 border border-indigo-500/20 rounded-md px-2 py-1 text-[9.5px] text-indigo-400 font-sans flex items-center space-x-1.5">
                          <span>{prio}</span>
                          <button
                            onClick={() => {
                              const list = (currentJourney.guidancePriorities || []).filter(p => p !== prio);
                              updateJourney(currentJourney.id, { guidancePriorities: list });
                            }}
                            className="hover:text-indigo-300 text-indigo-650 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add priority */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={newPriorityInput}
                        onChange={(e) => setNewPriorityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newPriorityInput.trim()) {
                            e.preventDefault();
                            const list = currentJourney.guidancePriorities || [];
                            if (!list.includes(newPriorityInput.trim())) {
                              updateJourney(currentJourney.id, { guidancePriorities: [...list, newPriorityInput.trim()] });
                            }
                            setNewPriorityInput("");
                          }
                        }}
                        placeholder="+ Add behavioral priority..."
                        className="bg-zinc-900 border border-zinc-850 focus:border-indigo-500 text-[10px] text-zinc-300 px-3 py-1.5 rounded-lg outline-none w-full"
                      />
                      <span className="text-[7.5px] text-zinc-600 block mt-1">Press Enter to add tag. E.g. "reassure uncertainty"</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Question 4: What kinds of guidance styles work best? (Composition Area) */}
              <div className="bg-zinc-950/45 border border-zinc-900 rounded-[28px] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">4</div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">What guidance styles work best?</span>
                  </div>
                  <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">Compose Primitives</span>
                </div>
                <p className="text-[9.5px] text-zinc-400 font-sans leading-snug">
                  Select and link reusable guidance building blocks. These styles are dynamically composed at runtime by the adaptive engine to modulate tone, structure, and conversation pacing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {guidanceStylesCatalog.map(style => {
                    const isSelected = (currentJourney.guidanceStyles || []).includes(style.id);
                    return (
                      <button
                        key={style.id}
                        onClick={() => toggleGuidanceStyle(style.id)}
                        className={clsx(
                          "w-full text-left p-3 rounded-xl border flex items-start space-x-3 transition-all duration-200 relative overflow-hidden",
                          isSelected 
                            ? "bg-indigo-500/5 border-indigo-500/35 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.06)]"
                            : "bg-zinc-900/30 border-zinc-900/80 text-zinc-500 hover:border-zinc-800"
                        )}
                      >
                        <div className={clsx(
                          "w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors",
                          isSelected ? "bg-indigo-550 border-indigo-400 text-white" : "border-zinc-800 bg-zinc-900/80 text-transparent"
                        )}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className={clsx("text-[10.5px] font-bold block", isSelected ? "text-zinc-200" : "text-zinc-450")}>
                            {style.label}
                          </span>
                          <p className="text-[9px] font-sans leading-normal text-zinc-500 font-normal">
                            {style.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: What signals indicate the journey is helping? */}
              <div className="bg-zinc-950/45 border border-zinc-900 rounded-[24px] p-5 space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-900/60 pb-2">
                  <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">5</div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">What signals indicate the journey is helping?</span>
                </div>

                <div className="space-y-3">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Success Indicators & Outcomes</span>
                  <div className="flex flex-wrap gap-1.5 min-h-12 align-top">
                    {(currentJourney.successIndicators || []).map((ind, idx) => (
                      <div key={idx} className="bg-emerald-500/5 border border-emerald-500/20 rounded-md px-2 py-1 text-[9.5px] text-emerald-450 font-sans flex items-center space-x-1.5">
                        <span>{ind}</span>
                        <button
                          onClick={() => {
                            const list = (currentJourney.successIndicators || []).filter(i => i !== ind);
                            updateJourney(currentJourney.id, { successIndicators: list });
                          }}
                          className="hover:text-emerald-350 text-emerald-650 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Add indicator */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={newIndicatorInput}
                      onChange={(e) => setNewIndicatorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newIndicatorInput.trim()) {
                          e.preventDefault();
                          const list = currentJourney.successIndicators || [];
                          if (!list.includes(newIndicatorInput.trim())) {
                            updateJourney(currentJourney.id, { successIndicators: [...list, newIndicatorInput.trim()] });
                          }
                          setNewIndicatorInput("");
                        }
                      }}
                      placeholder="+ Add success indicator outcome..."
                      className="bg-zinc-900 border border-zinc-850 focus:border-indigo-500 text-[10px] text-zinc-300 px-3 py-1.5 rounded-lg outline-none w-full"
                    />
                    <span className="text-[7.5px] text-zinc-600 block mt-1">Press Enter to add tag. E.g. "reduced discretionary spending"</span>
                  </div>
                </div>
              </div>

              {/* Guidance Alignment Map (Visual Alignment) */}
              <div className="bg-zinc-950 border border-indigo-500/10 rounded-[28px] p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Visual Guidance Alignment Map</span>
                </div>
                <p className="text-[9.5px] text-zinc-555 font-sans leading-snug">
                  This blueprint details how the journey's user needs feed into composed guidance models, showing operational flow without exposing complex vector mathematics or arbitration logs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-stretch pt-2">
                  {/* Step 1: Situations */}
                  <div className="bg-zinc-900/30 border border-zinc-850 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[7.5px] text-rose-455 font-bold uppercase tracking-widest block mb-1">1. User Context</span>
                      <span className="text-[9.5px] text-zinc-300 block font-sans truncate font-bold">
                        {(currentJourney.commonSituations || []).length > 0 
                          ? (currentJourney.commonSituations || [])[0]
                          : "Any User Context"}
                      </span>
                    </div>
                    <span className="text-[7.5px] text-zinc-600 block font-sans">
                      {((currentJourney.commonSituations || []).length - 1) > 0 
                        ? `+${(currentJourney.commonSituations || []).length - 1} more conditions` 
                        : "Focus trigger"}
                    </span>
                  </div>

                  {/* Step 2: Guidance Styles */}
                  <div className="bg-zinc-900/30 border border-indigo-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[7.5px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">2. Primitives</span>
                      <span className="text-[9.5px] text-indigo-300 block font-sans truncate font-bold">
                        {(currentJourney.guidanceStyles || []).length > 0 
                          ? (currentJourney.guidanceStyles || [])[0].replace(/_/g, " ")
                          : "No styles"}
                      </span>
                    </div>
                    <span className="text-[7.5px] text-zinc-650 block font-sans">
                      {(currentJourney.guidanceStyles || []).length} active styles
                    </span>
                  </div>

                  {/* Step 3: Allowed Capabilities */}
                  <div className="bg-zinc-900/30 border border-amber-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[7.5px] text-amber-500 font-bold uppercase tracking-widest block mb-1">3. Capabilities</span>
                      <span className="text-[9.5px] text-amber-400 block font-sans truncate font-bold">
                        {(currentJourney.allowedCapabilities || []).length > 0 
                          ? (currentJourney.allowedCapabilities || [])[0].replace(/_/g, " ")
                          : "None allowed"}
                      </span>
                    </div>
                    <span className="text-[7.5px] text-zinc-650 block font-sans">
                      {(currentJourney.allowedCapabilities || []).length} tools enabled
                    </span>
                  </div>

                  {/* Step 4: Persistent Artifacts */}
                  <div className="bg-zinc-900/30 border border-purple-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[7.5px] text-purple-400 font-bold uppercase tracking-widest block mb-1">4. Outputs</span>
                      <span className="text-[9.5px] text-purple-300 block font-sans truncate font-bold">
                        {(currentJourney.artifactsCanCreate || []).length > 0 
                          ? (currentJourney.artifactsCanCreate || [])[0].replace(/_/g, " ")
                          : "No artifacts"}
                      </span>
                    </div>
                    <span className="text-[7.5px] text-zinc-650 block font-sans">
                      {((currentJourney.artifactsCanCreate || []).length + (currentJourney.artifactsCanUpdate || []).length)} items
                    </span>
                  </div>

                  {/* Step 5: Success Outcome */}
                  <div className="bg-zinc-900/30 border border-emerald-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[7.5px] text-emerald-455 font-bold uppercase tracking-widest block mb-1">5. Outcome</span>
                      <span className="text-[9.5px] text-zinc-300 block font-sans truncate font-bold">
                        {(currentJourney.successIndicators || []).length > 0 
                          ? (currentJourney.successIndicators || [])[0]
                          : "Successful check"}
                      </span>
                    </div>
                    <span className="text-[7.5px] text-zinc-650 block font-sans">
                      {((currentJourney.successIndicators || []).length - 1) > 0 
                        ? `+${(currentJourney.successIndicators || []).length - 1} indicators` 
                        : "Primary target"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. Journey Capabilities Panel (Tool Awareness) */}
              <div className="bg-zinc-950/45 border border-zinc-900 rounded-[28px] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-[10px]">6</div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Available Capabilities & Assistance Rules</span>
                  </div>
                  <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">Tool Awareness</span>
                </div>
                <p className="text-[9.5px] text-zinc-450 font-sans leading-snug">
                  Configure what kinds of assistance capabilities the runtime is allowed to leverage during this journey. The system dynamically decides when to query them.
                </p>

                {/* Capabilities Catalog Header */}
                <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Configure Permitted Capabilities</span>
                    <span className="text-[7.5px] text-zinc-600 font-sans">Hover for non-technical usage explanations</span>
                  </div>

                  <div className="bg-black/35 border border-zinc-900 rounded-2xl p-4.5 space-y-3">
                    <span className="text-[8.5px] text-amber-500 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5 font-mono">Registered Capabilities & APIs</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {tools.map(t => {
                        const isChecked = (currentJourney.allowedCapabilities || []).includes(t.id);
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              const list = currentJourney.allowedCapabilities || [];
                              const updated = list.includes(t.id) ? list.filter(id => id !== t.id) : [...list, t.id];
                              updateJourney(currentJourney.id, { allowedCapabilities: updated });
                            }}
                            className="text-left group flex items-start space-x-2.5 p-2 bg-zinc-950/20 border border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800 rounded-xl transition-all"
                          >
                            <div className={clsx("w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors", isChecked ? "bg-amber-500 border-amber-400 text-black" : "border-zinc-800 bg-zinc-950 text-transparent")}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <div className="min-w-0">
                              <span className={clsx("text-[10px] font-bold block", isChecked ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-350")}>{t.name}</span>
                              <span className="text-[8.5px] font-sans text-zinc-550 block leading-normal mt-0.5">{t.description}</span>
                              <span className="text-[7.5px] text-indigo-400 block mt-1 break-all font-mono">{t.apiEndpoint}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Assistance Preferences & Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Preferred Behaviors */}
                  <div className="space-y-3">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Preferred Assistance Behaviors</span>
                    <div className="flex flex-wrap gap-1.5 min-h-12 align-top">
                      {(currentJourney.preferredBehaviors || []).map((pb, idx) => (
                        <div key={idx} className="bg-amber-500/5 border border-amber-500/20 rounded-md px-2 py-1 text-[9.5px] text-amber-400 font-sans flex items-center space-x-1.5">
                          <span>{pb}</span>
                          <button
                            onClick={() => {
                              const list = (currentJourney.preferredBehaviors || []).filter(item => item !== pb);
                              updateJourney(currentJourney.id, { preferredBehaviors: list });
                            }}
                            className="hover:text-amber-300 text-amber-650 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add preference */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={newPreferredBehaviorInput}
                        onChange={(e) => setNewPreferredBehaviorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newPreferredBehaviorInput.trim()) {
                            e.preventDefault();
                            const list = currentJourney.preferredBehaviors || [];
                            if (!list.includes(newPreferredBehaviorInput.trim())) {
                              updateJourney(currentJourney.id, { preferredBehaviors: [...list, newPreferredBehaviorInput.trim()] });
                            }
                            setNewPreferredBehaviorInput("");
                          }
                        }}
                        placeholder="+ Add assistance preference..."
                        className="bg-zinc-900 border border-zinc-850 focus:border-amber-500 text-[10px] text-zinc-300 px-3 py-1.5 rounded-lg outline-none w-full"
                      />
                      <span className="text-[7.5px] text-zinc-600 block mt-1">E.g. "prioritize explanation before recommendation"</span>
                    </div>
                  </div>

                  {/* Restricted Capabilities */}
                  <div className="space-y-3">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Restricted Capabilities (Constraints)</span>
                    <div className="flex flex-wrap gap-1.5 min-h-12 align-top">
                      {(currentJourney.restrictedCapabilities || []).map((rc, idx) => (
                        <div key={idx} className="bg-rose-500/5 border border-rose-500/20 rounded-md px-2 py-1 text-[9.5px] text-rose-400 font-sans flex items-center space-x-1.5">
                          <span>{rc}</span>
                          <button
                            onClick={() => {
                              const list = (currentJourney.restrictedCapabilities || []).filter(item => item !== rc);
                              updateJourney(currentJourney.id, { restrictedCapabilities: list });
                            }}
                            className="hover:text-rose-300 text-rose-600 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add restriction */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={newRestrictedCapabilityInput}
                        onChange={(e) => setNewRestrictedCapabilityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newRestrictedCapabilityInput.trim()) {
                            e.preventDefault();
                            const list = currentJourney.restrictedCapabilities || [];
                            if (!list.includes(newRestrictedCapabilityInput.trim())) {
                              updateJourney(currentJourney.id, { restrictedCapabilities: [...list, newRestrictedCapabilityInput.trim()] });
                            }
                            setNewRestrictedCapabilityInput("");
                          }
                        }}
                        placeholder="+ Add capability restriction..."
                        className="bg-zinc-900 border border-zinc-850 focus:border-rose-500 text-[10px] text-zinc-300 px-3 py-1.5 rounded-lg outline-none w-full"
                      />
                      <span className="text-[7.5px] text-zinc-600 block mt-1">E.g. "require user confirmation for budget changes"</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Artifact Permissions Panel & Lifecycle Visualization */}
              <div className="bg-zinc-950/45 border border-zinc-900 rounded-[28px] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-[10px]">7</div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Persisted Journey Outputs & Artifacts</span>
                  </div>
                  <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase">Artifact Awareness</span>
                </div>
                <p className="text-[9.5px] text-zinc-450 font-sans leading-snug">
                  Define what long-lived documents, budgets, or trackers this journey is authorized to initialize (Create) or modify (Update).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Create Permissions */}
                  <div className="bg-black/35 border border-zinc-900 rounded-2xl p-4.5 space-y-3">
                    <span className="text-[8.5px] text-purple-450 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5 font-mono">Authorized to Create</span>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1.5 custom-scrollbar">
                      {artifacts.map(art => {
                        const isChecked = (currentJourney.artifactsCanCreate || []).includes(art.id);
                        return (
                          <div key={art.id} className="space-y-1.5 p-1 rounded-lg hover:bg-zinc-900/30">
                            <button
                              onClick={() => {
                                const list = currentJourney.artifactsCanCreate || [];
                                const updated = list.includes(art.id) ? list.filter(id => id !== art.id) : [...list, art.id];
                                const currentImp = { ...currentJourney.artifactImportance };
                                if (!updated.includes(art.id)) {
                                  delete currentImp[art.id];
                                } else if (!currentImp[art.id]) {
                                  currentImp[art.id] = "primary";
                                }
                                updateJourney(currentJourney.id, { artifactsCanCreate: updated, artifactImportance: currentImp });
                              }}
                              className="w-full text-left group flex items-start space-x-2.5"
                            >
                              <div className={clsx("w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors", isChecked ? "bg-purple-500 border-purple-400 text-white" : "border-zinc-800 bg-zinc-950 text-transparent")}>
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className={clsx("text-[10px] font-bold block", isChecked ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-450")}>{art.name}</span>
                                  <span className="text-[7px] font-mono px-1 rounded bg-zinc-900 text-purple-400 border border-zinc-850 uppercase tracking-widest">{art.family === "Momentum Artifacts" ? "Momentum" : "Moments"}</span>
                                </div>
                                <span className="text-[8.5px] font-sans text-zinc-550 block leading-normal mt-0.5">{art.description}</span>
                              </div>
                            </button>
                            {isChecked && (
                              <div className="pl-6 flex items-center space-x-2 text-[9px] animate-fadeIn">
                                <span className="text-zinc-555 font-sans">Role Importance:</span>
                                <select
                                  value={currentJourney.artifactImportance?.[art.id] || "primary"}
                                  onChange={(e) => {
                                    const currentImp = { ...currentJourney.artifactImportance, [art.id]: e.target.value };
                                    updateJourney(currentJourney.id, { artifactImportance: currentImp });
                                  }}
                                  className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[8.5px] text-purple-300 outline-none font-mono"
                                >
                                  <option value="primary">Primary Output</option>
                                  <option value="supporting">Supporting Context</option>
                                  <option value="optional">Optional Recommendation</option>
                                  <option value="milestone">Milestone Target</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Update Permissions */}
                  <div className="bg-black/35 border border-zinc-900 rounded-2xl p-4.5 space-y-3">
                    <span className="text-[8.5px] text-purple-450 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5 font-mono">Authorized to Update</span>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1.5 custom-scrollbar">
                      {artifacts.map(art => {
                        const isChecked = (currentJourney.artifactsCanUpdate || []).includes(art.id);
                        return (
                          <div key={art.id} className="space-y-1.5 p-1 rounded-lg hover:bg-zinc-900/30">
                            <button
                              onClick={() => {
                                const list = currentJourney.artifactsCanUpdate || [];
                                const updated = list.includes(art.id) ? list.filter(id => id !== art.id) : [...list, art.id];
                                const currentImp = { ...currentJourney.artifactImportance };
                                if (!updated.includes(art.id)) {
                                  delete currentImp[art.id];
                                } else if (!currentImp[art.id]) {
                                  currentImp[art.id] = "supporting";
                                }
                                updateJourney(currentJourney.id, { artifactsCanUpdate: updated, artifactImportance: currentImp });
                              }}
                              className="w-full text-left group flex items-start space-x-2.5"
                            >
                              <div className={clsx("w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors", isChecked ? "bg-purple-500 border-purple-400 text-white" : "border-zinc-800 bg-zinc-950 text-transparent")}>
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className={clsx("text-[10px] font-bold block", isChecked ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-450")}>{art.name}</span>
                                  <span className="text-[7px] font-mono px-1 rounded bg-zinc-900 text-purple-400 border border-zinc-850 uppercase tracking-widest">{art.family === "Momentum Artifacts" ? "Momentum" : "Moments"}</span>
                                </div>
                                <span className="text-[8.5px] font-sans text-zinc-555 block leading-normal mt-0.5">{art.description}</span>
                              </div>
                            </button>
                            {isChecked && (
                              <div className="pl-6 flex items-center space-x-2 text-[9px] animate-fadeIn">
                                <span className="text-zinc-555 font-sans">Role Importance:</span>
                                <select
                                  value={currentJourney.artifactImportance?.[art.id] || "supporting"}
                                  onChange={(e) => {
                                    const currentImp = { ...currentJourney.artifactImportance, [art.id]: e.target.value };
                                    updateJourney(currentJourney.id, { artifactImportance: currentImp });
                                  }}
                                  className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[8.5px] text-purple-300 outline-none font-mono"
                                >
                                  <option value="primary">Primary Output</option>
                                  <option value="supporting">Supporting Context</option>
                                  <option value="optional">Optional Recommendation</option>
                                  <option value="milestone">Milestone Target</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Artifact Lifecycle Visualization */}
                <div className="border border-zinc-900 rounded-2xl p-4.5 bg-black/20 space-y-3">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Output Artifact Lifecycle Path</span>
                  <div className="flex flex-col md:flex-row md:items-center justify-between text-[9px] text-zinc-450 gap-4 pt-1">
                    <div className="flex-1 bg-zinc-900/50 border border-zinc-900 p-3 rounded-xl space-y-1">
                      <span className="text-[7.5px] uppercase font-bold text-rose-500">1. Journey Triggered</span>
                      <p className="font-sans text-[8.5px] leading-relaxed text-zinc-500">User behavior triggers situation constraints. Session telemetry initializes state context.</p>
                    </div>
                    <div className="hidden md:block text-zinc-700 text-sm">➔</div>
                    <div className="flex-1 bg-zinc-900/50 border border-indigo-900/35 p-3 rounded-xl space-y-1">
                      <span className="text-[7.5px] uppercase font-bold text-indigo-400">2. Artifact Creation</span>
                      <p className="font-sans text-[8.5px] leading-relaxed text-zinc-500">
                        {currentJourney.artifactsCanCreate?.length ? `Initializes: ${currentJourney.artifactsCanCreate.map(a => a.replace(/_/g, " ")).join(", ")}` : "No create permissions configured."}
                      </p>
                    </div>
                    <div className="hidden md:block text-zinc-700 text-sm">➔</div>
                    <div className="flex-1 bg-zinc-900/50 border border-purple-900/35 p-3 rounded-xl space-y-1">
                      <span className="text-[7.5px] uppercase font-bold text-purple-400">3. Persisted Progression</span>
                      <p className="font-sans text-[8.5px] leading-relaxed text-zinc-500">
                        {currentJourney.artifactsCanUpdate?.length ? `Modifies: ${currentJourney.artifactsCanUpdate.map(a => a.replace(/_/g, " ")).join(", ")}` : "No update permissions configured."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Assistance Simulator Workbench & Recommendations */}
              <div className="bg-zinc-950 border border-indigo-500/10 rounded-[28px] p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Assistance Simulator Workbench & Design Recommendations</span>
                </div>

                {/* Recommendations Banner */}
                <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-2xl p-4.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[7.5px] bg-indigo-550/20 border border-indigo-500/35 text-indigo-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Category Optimization</span>
                      <p className="text-[9.5px] font-sans text-zinc-300 mt-1.5 leading-snug">
                        {recommendations.msg}
                      </p>
                    </div>
                    <button
                      onClick={handleApplyRecommendations}
                      className="bg-indigo-650 hover:bg-indigo-600 text-white border border-indigo-500/20 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                    >
                      Apply Setup
                    </button>
                  </div>
                </div>

                {/* Test workbench capabilities simulation */}
                <div className="space-y-3">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Test Allowed Journey Capabilities</span>
                  <div className="flex flex-wrap gap-2.5">
                    {currentJourney.allowedCapabilities?.map(capId => {
                      const label = [
                        { id: "spending_analysis", label: "Analyze Spending" },
                        { id: "subscription_detection", label: "Detect Subscriptions" },
                        { id: "spending_categorization", label: "Categorize Expense" },
                        { id: "trend_summaries", label: "Trend Summary" },
                        { id: "budgeting_assistance", label: "Budgeting Help" },
                        { id: "affordability_estimation", label: "Evaluate Affordability" },
                        { id: "savings_forecasting", label: "Forecast Savings" },
                        { id: "scenario_simulation", label: "Simulate Scenarios" },
                        { id: "educational_explanations", label: "Concept Explanations" }
                      ].find(item => item.id === capId)?.label || capId;

                      const isLoading = isSimulatingAssistance === capId;

                      return (
                        <button
                          key={capId}
                          onClick={() => {
                            // Run simulation
                            setIsSimulatingAssistance(capId);
                            setTimeout(() => {
                              setIsSimulatingAssistance(null);
                              const timestamp = new Date().toLocaleTimeString();
                              const logs = [
                                { timestamp, message: `[SIM] Running capability validator policy for "${currentJourney.name}"`, type: "info" },
                                { timestamp, message: `[SIM] Evaluated Restrictions: ${currentJourney.restrictedCapabilities?.length ? currentJourney.restrictedCapabilities.join(", ") : "None"}`, type: "warn" },
                                { timestamp, message: `[SIM] Executed Dynamic Assistance: ${label}`, type: "success" }
                              ];

                              currentJourney.artifactsCanCreate?.forEach(art => {
                                logs.push({ timestamp, message: `[SIM] Generated Output Artifact: [${art.replace(/_/g, " ")}] (Importance: ${currentJourney.artifactImportance?.[art] || "primary"})`, type: "artifact" });
                              });

                              setSimulationLogs(prev => [...logs, ...prev]);
                            }, 600);
                          }}
                          disabled={isSimulatingAssistance !== null}
                          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 disabled:opacity-50 text-zinc-300 px-3 py-2 rounded-xl text-[9.5px] uppercase font-bold flex items-center transition-colors"
                        >
                          <Tv className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                          {isLoading ? "Running..." : `Simulate ${label}`}
                        </button>
                      );
                    })}
                    {!currentJourney.allowedCapabilities?.length && (
                      <span className="text-[9px] text-zinc-600 italic">No allowed capabilities selected yet. Turn some on under Section 6.</span>
                    )}
                  </div>
                </div>

                {/* Simulation Logs Viewer */}
                {simulationLogs.length > 0 && (
                  <div className="border border-zinc-900 rounded-xl bg-black/40 overflow-hidden">
                    <div className="p-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80">
                      <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                        <Terminal className="w-3.5 h-3.5 mr-1 text-amber-500" /> WORKBENCH SIMULATOR TELEMETRY
                      </span>
                      <button
                        onClick={() => setSimulationLogs([])}
                        className="text-[8px] text-zinc-650 hover:text-zinc-450 uppercase font-bold"
                      >
                        Clear Console
                      </button>
                    </div>
                    <div className="p-3.5 max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar text-[9px] leading-relaxed">
                      {simulationLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                          <span className={clsx(
                            log.type === "success" ? "text-emerald-450 font-bold" :
                            log.type === "warn" ? "text-amber-400" :
                            log.type === "artifact" ? "text-purple-300" : "text-zinc-450"
                          )}>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-2">
              <GitBranch className="w-8 h-8 text-zinc-700" />
              <span className="text-xs">No active journey selected. Define one in the sidebar.</span>
            </div>
          )}
        </div>

        {/* Create Journey Modal */}
        {showCreateJourneyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowCreateJourneyModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Create Adaptive Guidance</span>
                <h3 className="text-base font-bold text-zinc-150 uppercase">New Journey Archetype</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">Journey ID (lowercase, snake_case)</label>
                  <input
                    type="text"
                    value={newJourneyId}
                    onChange={(e) => setNewJourneyId(e.target.value)}
                    placeholder="e.g. investment_confidence"
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">Journey Name</label>
                  <input
                    type="text"
                    value={newJourneyName}
                    onChange={(e) => setNewJourneyName(e.target.value)}
                    placeholder="e.g. Investment Confidence"
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">Primary Category</label>
                  <input
                    type="text"
                    value={newJourneyCategory}
                    onChange={(e) => setNewJourneyCategory(e.target.value)}
                    placeholder="e.g. Wealth Planning"
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">Intended Purpose (What should this help achieve?)</label>
                  <textarea
                    value={newJourneyPurpose}
                    onChange={(e) => setNewJourneyPurpose(e.target.value)}
                    placeholder="e.g. Help users feel capable and secure making investment choices."
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none resize-none font-sans"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowCreateJourneyModal(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-4 py-2 rounded-lg text-[10px] uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newJourneyId.trim() || !newJourneyName.trim()) return;
                    const journeyObj: Journey = {
                      id: newJourneyId.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
                      name: newJourneyName.trim(),
                      category: newJourneyCategory.trim() || "General",
                      purpose: newJourneyPurpose.trim() || "Help users navigate financial choices.",
                      commonSituations: [],
                      guidancePriorities: [],
                      guidanceStyles: [],
                      successIndicators: [],
                      version: "1.0.0",
                      status: "draft" as const,
                      allowedCapabilities: [],
                      preferredBehaviors: [],
                      restrictedCapabilities: [],
                      artifactsCanCreate: [],
                      artifactsCanUpdate: [],
                      artifactImportance: {},
                      goal: "",
                      desiredMovement: "",
                      applicableStates: [],
                      preferredStrategies: [],
                      successSignals: []
                    };
                    createJourney(journeyObj);
                    setSelectedJourneyId(journeyObj.id);
                    setNewJourneyId("");
                    setNewJourneyName("");
                    setNewJourneyPurpose("");
                    setShowCreateJourneyModal(false);
                  }}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-[10px] uppercase font-bold"
                >
                  Create Journey
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clone Journey Modal */}
        {showCloneJourneyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowCloneJourneyModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Clone Active Pattern</span>
                <h3 className="text-base font-bold text-zinc-150 uppercase">Clone "{selectedJourney.name}"</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">New Journey ID (lowercase, snake_case)</label>
                  <input
                    type="text"
                    value={cloneId}
                    onChange={(e) => setCloneId(e.target.value)}
                    placeholder="e.g. investment_confidence"
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-550 uppercase block mb-1">New Journey Name</label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder="e.g. Investment Confidence Journey"
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowCloneJourneyModal(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-4 py-2 rounded-lg text-[10px] uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!cloneId.trim() || !cloneName.trim()) return;
                    const cleanId = cloneId.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
                    cloneJourney(selectedJourney.id, cleanId, cloneName.trim());
                    setSelectedJourneyId(cleanId);
                    setCloneId("");
                    setCloneName("");
                    setShowCloneJourneyModal(false);
                  }}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-[10px] uppercase font-bold"
                >
                  Clone
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- RENDER GOVERNANCE POLICIES ---
  if (activeL1Domain === "governance") {
    return (
      <div className="h-full p-8 overflow-y-auto max-w-5xl font-mono text-zinc-200 space-y-6 relative z-10 custom-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-zinc-800/60 pb-6">
          <div>
            <div className="flex items-center space-x-1.5 text-rose-500 text-[10px] uppercase tracking-widest font-bold mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Governance Constitutional Laws</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">
              Safety Boundaries & Compliance Enforcements
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
              Governance Policies sit at the absolute top of the resolution compiler stack. **Constitutional Law Overrides**: Define safety constraints (Caps and Floors) and toggle **Hard Runtime Prohibitions** that clamp marketing adjustments and product strategies automatically.
            </p>
          </div>

          <button
            onClick={() => setShowShieldModal(true)}
            className="text-[10px] bg-rose-600/90 hover:bg-rose-600 border border-rose-500/20 text-white px-3.5 py-2 rounded-lg font-bold uppercase flex items-center shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Add Policy Shield
          </button>
        </div>

        {/* Top Precedence Alert */}
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex items-start space-x-3 max-w-3xl">
          <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-300">Constitutional Precedence Clamping</span>
            <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
              If Marketing delta-modifiers push tone `warmth` to `0.92` inside a high-anxiety context, the compliance compiler silences the overlay and clamps the parameter strictly to the defined `0.90` safety threshold.
            </p>
          </div>
        </div>

        {/* Section 1: Forbidden Behaviors */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
            <AlertOctagon className="w-4.5 h-4.5 text-rose-550 shrink-0" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Hard Runtime Prohibitions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forbiddenBehaviors.map(behavior => (
              <div 
                key={behavior.id}
                className={clsx(
                  "p-4 rounded-xl border flex items-start justify-between transition-all bg-zinc-950/40",
                  behavior.isActive ? "border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.02)]" : "border-zinc-900 opacity-50"
                )}
              >
                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[8.5px] bg-rose-500/10 text-rose-450 border border-rose-500/25 px-1.5 py-0.2 rounded font-bold uppercase">NO: {behavior.id}</span>
                    <span className="text-[7.5px] border border-zinc-800 text-zinc-500 px-1.5 rounded-full uppercase">{behavior.category}</span>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 font-sans leading-relaxed">{behavior.description}</p>
                </div>

                <button 
                  onClick={() => toggleForbiddenBehavior(behavior.id)}
                  className={clsx(
                    "px-2.5 py-1 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 transition-colors",
                    behavior.isActive ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {behavior.isActive ? "Active Law" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Caps and Floors */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
            <Scale className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Active Threshold Caps & Floors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {governanceShields.map(shield => (
              <div key={shield.id} className="rounded-2xl p-5 border border-zinc-900 bg-zinc-950/20 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{shield.name}</h4>
                      <span className="text-[7.5px] border border-zinc-850 px-2 py-0.2 rounded-full inline-block mt-1 bg-zinc-900 text-zinc-500 uppercase">{shield.category}</span>
                    </div>
                    <button 
                      onClick={() => deleteGovernanceShield(shield.id)}
                      className="text-zinc-650 hover:text-rose-450 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{shield.description}</p>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 space-y-1.5 text-[9.5px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Target primitive:</span>
                    <span className="text-zinc-300 font-semibold">{shield.targetPrimitiveId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Action:</span>
                    <span className="text-indigo-400 uppercase font-bold">{shield.limitType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Threshold:</span>
                    <span className="text-rose-400 font-bold">{shield.thresholdValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-900 pt-1.5">
                    <span className="text-zinc-600">Trigger:</span>
                    <span className="text-emerald-400 px-1.5 py-0.2 bg-[#050507] border border-zinc-900 rounded text-[8.5px] font-mono">{shield.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shield Policy Modal */}
        {showShieldModal && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#0b0b0d] border border-zinc-800/80 rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <h3 className="text-xs font-bold text-zinc-150 uppercase tracking-wider">Create Safety Policy Shield</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">TARGET PRIMITIVE</label>
                    <select
                      value={newShieldPrimitive}
                      onChange={(e) => setNewShieldPrimitive(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-zinc-200 outline-none"
                    >
                      {Object.keys(primitives).map(pId => (
                        <option key={pId} value={pId}>{pId}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">ACTION TYPE</label>
                    <select
                      value={newShieldType}
                      onChange={(e) => setNewShieldType(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-zinc-200 outline-none"
                    >
                      <option value="cap">CAP (Max limit)</option>
                      <option value="floor">FLOOR (Min limit)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">LIMIT BOUND (0.0 - 1.0)</label>
                  <input type="number" step="0.01" min="0" max="1" value={newShieldValue} onChange={(e) => setNewShieldValue(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none" />
                </div>

                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">POLICY NAME</label>
                  <input type="text" placeholder="e.g. Slang rigid limit" value={newShieldName} onChange={(e) => setNewShieldName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none" />
                </div>

                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">CONTEXT TRIGGER</label>
                  <select
                    value={newShieldCondition}
                    onChange={(e) => setNewShieldCondition(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-zinc-200 outline-none"
                  >
                    <option value="always">Always Active (Universal Clamp)</option>
                    <option value="anxietyLevel == high">High Anxiety User Context</option>
                    <option value="upiUsage == heavy">Heavy Transaction Context</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">POLICY DESCRIPTION</label>
                  <textarea rows={2} placeholder="Why is this constitutional limit required?..." value={newShieldDesc} onChange={(e) => setNewShieldDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 resize-none outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-900">
                <button onClick={() => setShowShieldModal(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg text-[10px] font-bold uppercase">Cancel</button>
                <button onClick={handleCreateShield} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-[10px] text-white font-bold uppercase">Enforce</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER ENGINEERING CONTRACTS ---
  if (activeL1Domain === "engineering") {
    return (
      <div className="h-full p-8 overflow-y-auto max-w-5xl font-mono text-zinc-200 space-y-6 relative z-10 custom-scrollbar">
        <div className="border-b border-zinc-800/60 pb-6">
          <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">
            <Code className="w-4 h-4" />
            <span>Engineering Primitive Contracts</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Hard Schema Boundaries & Interface Contracts
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Declare the exact structural interfaces that the compilation engine compiles down to. Establish hard schema locks on range vectors and define strictly structured properties that LLM runtimes compile into runtime manifests.
          </p>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-200 uppercase">Canonical Mechanical Contracts</span>
            <span className="text-[8.5px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono font-bold">ALL SCHEMA LINT CHECKS OK</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-zinc-300">primitives.schema.json</span>
                <span className="text-[8px] text-zinc-550 uppercase font-mono">Structural Lock</span>
              </div>
              <pre className="text-[9px] text-zinc-500 bg-[#070709] border border-zinc-900 p-2.5 rounded overflow-x-auto text-indigo-300/85">
{`{
  "type": "object",
  "patternProperties": {
    "^[a-z_]+$": {
      "type": "object",
      "required": ["id", "path", "base", "range"],
      "properties": {
        "base": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    }
  }
}`}
              </pre>
            </div>

            <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-zinc-300">system_instructions.md.tmpl</span>
                <span className="text-[8px] text-zinc-550 uppercase font-mono">Prompt Target</span>
              </div>
              <pre className="text-[9px] text-zinc-500 bg-[#070709] border border-zinc-900 p-2.5 rounded overflow-x-auto text-emerald-300/85">
{`# Bounded Behavioral Posture State
You must strictly align to the resolved delta vectors:
- companionness: \${resolved.companionness}
- warmth: \${resolved.warmth}
- compliance: \${resolved.compliance_rigidity}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ==========================================
// 3. DOMAIN CAPABILITIES WORKSPACE
// ==========================================
interface CapabilityItem {
  name: string;
  type: "tool" | "api" | "connector" | "artifact" | "memory" | "evaluator";
  owner: string;
  scope: "session" | "universal" | "tenant";
  desc: string;
  latency?: string;
  inputSchema?: string;
  outputSchema?: string;
}

const mockCapabilities: CapabilityItem[] = [
  { 
    name: "affordability_projection()", 
    type: "tool", 
    owner: "Product Squad", 
    scope: "session", 
    desc: "Performs real-time projection metrics of future repayment rates based on dynamic cash flows.",
    latency: "~450ms",
    inputSchema: "{ user_id: string, proposed_emi: number }",
    outputSchema: "{ viable: boolean, risk_score: number, max_emi: number }"
  },
  { 
    name: "liquid_cash_check()", 
    type: "api", 
    owner: "Product Squad", 
    scope: "session", 
    desc: "Validates current disposable balance in linked primary deposit account.",
    latency: "~200ms",
    inputSchema: "{ account_token: string }",
    outputSchema: "{ available_balance: number, currency: 'INR' }"
  },
  { 
    name: "rollback_support()", 
    type: "tool", 
    owner: "Core Engine", 
    scope: "session", 
    desc: "Pauses current transaction validation loops and forces a state rollback to pre-verification.",
    latency: "~120ms",
    inputSchema: "{ transaction_id: string, reason: string }",
    outputSchema: "{ status: 'paused' | 'aborted' | 'cleared' }"
  },
  { 
    name: "comparison_matrix.json", 
    type: "artifact", 
    owner: "Product Squad", 
    scope: "tenant", 
    desc: "Persistent schema block holding evaluated purchase alternatives.",
    latency: "O(1)",
    inputSchema: "{ options: Array<CardOption> }",
    outputSchema: "ComparisonMatrixNode"
  },
  { 
    name: "compliance_guard_detector", 
    type: "evaluator", 
    owner: "Governance Team", 
    scope: "universal", 
    desc: "Audits outgoing tokens against absolute semantic threshold laws." 
  },
  { 
    name: "dialectical_probing_memory", 
    type: "memory", 
    owner: "Product Squad", 
    scope: "session", 
    desc: "Continuous context vault tracking user doubts and confidence curves." 
  }
];

export function DomainCapabilities() {
  const { 
    tools = [], 
    capabilities = [], 
    createTool, 
    updateTool, 
    deleteTool, 
    createCapability, 
    updateCapability, 
    deleteCapability,
    journeys = [],
    strategies = [],
    artifacts = []
  } = useBehaviorStore();

  const [activePanel, setActivePanel] = useState<"capabilities" | "tools" | "resolver">("capabilities");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCapModal, setShowCapModal] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);
  const [editingCapability, setEditingCapability] = useState<any | null>(null);
  const [editingTool, setEditingTool] = useState<any | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Capability Form State
  const [capId, setCapId] = useState("");
  const [capName, setCapName] = useState("");
  const [capDesc, setCapDesc] = useState("");
  const [capCategory, setCapCategory] = useState("Intelligence");
  const [capExecType, setCapExecType] = useState<any>("retrieval");
  const [capReqInputs, setCapReqInputs] = useState("");
  const [capOptInputs, setCapOptInputs] = useState("");
  const [capMissingStrategy, setCapMissingStrategy] = useState<any>("conversational_collection");
  const [capOutputs, setCapOutputs] = useState("");
  const [capReqArtifacts, setCapReqArtifacts] = useState("");
  const [capProdArtifacts, setCapProdArtifacts] = useState("");
  const [capProdMoments, setCapProdMoments] = useState("");
  const [capModMomentum, setCapModMomentum] = useState("");
  const [capToolsList, setCapToolsList] = useState("");
  const [capPriority, setCapPriority] = useState<any>("medium");
  const [capLatency, setCapLatency] = useState("near_realtime");
  const [capCost, setCapCost] = useState("low");

  // Tool Form State
  const [toolName, setToolName] = useState("");
  const [toolDesc, setToolDesc] = useState("");
  const [toolCategory, setToolCategory] = useState("Notification");
  const [toolStatus, setToolStatus] = useState<any>("active");
  const [toolOwner, setToolOwner] = useState("Product Squad");
  const [toolAuth, setToolAuth] = useState("None");
  const [toolRateLimit, setToolRateLimit] = useState("100 req/sec");
  const [toolSla, setToolSla] = useState("99.9%");
  const [toolLatencyTier, setToolLatencyTier] = useState("instant");
  const [toolCostTier, setToolCostTier] = useState("free");
  const [toolEndpoint, setToolEndpoint] = useState("https://api.kyfr.internal/tools/custom");
  const [toolActionsRaw, setToolActionsRaw] = useState("[]");

  // Resolver Simulation State
  const [selJourney, setSelJourney] = useState(journeys[0]?.id || "spending_awareness");
  const [selStrategy, setSelStrategy] = useState(strategies[0]?.id || "calm_reflection");
  const [simStep, setSimStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simHighlightNode, setSimHighlightNode] = useState<string | null>(null);

  const filteredCapabilities = useMemo(() => {
    return (capabilities || []).filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [capabilities, searchQuery]);

  const filteredTools = useMemo(() => {
    return (tools || []).filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tools, searchQuery]);

  // Modals Open
  const handleOpenCapCreate = () => {
    setEditingCapability(null);
    setCapId("");
    setCapName("");
    setCapDesc("");
    setCapCategory("Intelligence");
    setCapExecType("retrieval");
    setCapReqInputs("userId");
    setCapOptInputs("");
    setCapMissingStrategy("conversational_collection");
    setCapOutputs("transaction_summary");
    setCapReqArtifacts("");
    setCapProdArtifacts("transaction_summary");
    setCapProdMoments("");
    setCapModMomentum("");
    setCapToolsList("aa_provider");
    setCapPriority("medium");
    setCapLatency("near_realtime");
    setCapCost("low");
    setShowCapModal(true);
  };

  const handleOpenCapEdit = (c: Capability) => {
    setEditingCapability(c);
    setCapId(c.id);
    setCapName(c.name);
    setCapDesc(c.description);
    setCapCategory(c.category);
    setCapExecType(c.execution_type);
    setCapReqInputs(c.required_inputs.join(", "));
    setCapOptInputs(c.optional_inputs.join(", "));
    setCapMissingStrategy(c.missing_input_strategy?.mode || "conversational_collection");
    setCapOutputs(c.output_types.join(", "));
    setCapReqArtifacts(c.required_artifacts.join(", "));
    setCapProdArtifacts(c.produced_artifacts.join(", "));
    setCapProdMoments(c.produced_moments.join(", "));
    setCapModMomentum(c.modified_momentum.join(", "));
    setCapToolsList(c.implemented_by_tools.join(", "));
    setCapPriority(c.priority);
    setCapLatency(c.latency_tier);
    setCapCost(c.cost_tier);
    setShowCapModal(true);
  };

  const handleOpenToolCreate = () => {
    setEditingTool(null);
    setToolName("");
    setToolDesc("");
    setToolCategory("Notification");
    setToolStatus("active");
    setToolOwner("Platform Team");
    setToolAuth("Bearer Token");
    setToolRateLimit("100 req/sec");
    setToolSla("99.9%");
    setToolLatencyTier("instant");
    setToolCostTier("low");
    setToolEndpoint("https://api.kyfr.internal/tools/custom-gateway");
    setToolActionsRaw("[\n  {\n    \"id\": \"custom_action\",\n    \"name\": \"Custom Action\",\n    \"description\": \"Triggers custom webhook payload\",\n    \"inputs\": [\"userId\"],\n    \"outputs\": [\"status\"]\n  }\n]");
    setShowToolModal(true);
  };

  const handleOpenToolEdit = (t: Tool) => {
    setEditingTool(t);
    setToolName(t.name);
    setToolDesc(t.description);
    setToolCategory(t.category);
    setToolStatus(t.status);
    setToolOwner(t.owner_team);
    setToolAuth(t.authentication);
    setToolRateLimit(t.rate_limits);
    setToolSla(t.sla);
    setToolLatencyTier(t.latency_tier);
    setToolCostTier(t.cost_tier);
    setToolEndpoint(t.apiEndpoint);
    setToolActionsRaw(JSON.stringify(t.actions || [], null, 2));
    setShowToolModal(true);
  };

  // Saves
  const handleSaveCapability = () => {
    if (!capName.trim()) return;
    const cid = editingCapability ? editingCapability.id : capName.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    
    const payload: Capability = {
      id: cid,
      name: capName,
      description: capDesc,
      category: capCategory,
      execution_type: capExecType,
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
      governance_constraints: ["Audit schema limits", "Check access grants"],
      permissions_required: [],
      fallback_capabilities: [],
      priority: capPriority,
      latency_tier: capLatency,
      cost_tier: capCost
    };

    if (editingCapability) {
      updateCapability(editingCapability.id, payload);
    } else {
      createCapability(payload);
    }
    setShowCapModal(false);
  };

  const handleSaveTool = () => {
    if (!toolName.trim()) return;
    const tid = editingTool ? editingTool.id : toolName.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    let parsedActions = [];
    try {
      parsedActions = JSON.parse(toolActionsRaw);
    } catch(e) {
      alert("Invalid JSON actions array format");
      return;
    }

    const payload: Tool = {
      id: tid,
      name: toolName,
      description: toolDesc,
      category: toolCategory,
      status: toolStatus,
      owner_team: toolOwner,
      authentication: toolAuth,
      rate_limits: toolRateLimit,
      sla: toolSla,
      latency_tier: toolLatencyTier,
      cost_tier: toolCostTier,
      actions: parsedActions,
      permissions: [],
      side_effects: "External calls",
      retry_policy: "no_retry",
      observability: { logs: "", metrics: "", traces: "" },
      apiEndpoint: toolEndpoint,
      inputSchema: "{}",
      outputSchema: "{}",
      latencyBenchmarkMs: 150
    };

    if (editingTool) {
      updateTool(editingTool.id, payload);
    } else {
      createTool(payload);
    }
    setShowToolModal(false);
  };

  // Run Simulation
  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs([
      "⚙️ Initiating Cognitive operating system kernel context...",
      `📍 Setting Active Journey Target: '${selJourney}'`,
      `🧠 Selected Behavioral Strategy: '${selStrategy}'`
    ]);
    setSimHighlightNode("journey");

    const steps = [
      {
        step: 2,
        highlight: "strategy",
        log: "⚡ Strategy active. Running capability resolution matrix. Required capabilities resolved: ['fetch_financial_data', 'analyze_spending']"
      },
      {
        step: 3,
        highlight: "capability",
        log: "📂 Input systems check. Requisitioning required input contracts: 'userId' (acquired from user context), 'consentId' (checked and found active)."
      },
      {
        step: 4,
        highlight: "tool",
        log: "⚖️ Executing Tool arbitration engine. Found tools matching capabilities: ['aa_provider', 'spend_ai']. Selected tool 'aa_provider' based on latency tier instant and cost tier free."
      },
      {
        step: 5,
        highlight: "action",
        log: "🔗 Invoking target action 'fetch_bank_statements' on tool 'aa_provider'. Mock payload returned Status 200 OK. Decrypted statements received."
      },
      {
        step: 6,
        highlight: "artifacts",
        log: "💾 Serializing persistent output artifacts. Created 'transaction_summary' contract in vault. Updated 'spend_profile'."
      },
      {
        step: 7,
        highlight: "moments",
        log: "🔮 Sensed high cognitive tension on checkout. Generated emotional moment hook: 'financial_anxiety_detected' (Severity: High)."
      },
      {
        step: 8,
        highlight: "momentum",
        log: "🚀 Adjusting longitudinal trust metrics. Savings momentum adjusted: +15, Trust momentum updated: +10. Pipeline completed successfully."
      }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setSimStep(s.step);
        setSimHighlightNode(s.highlight);
        setSimLogs(prev => [...prev, s.log]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 1000);
    });
  };

  return (
    <div className="h-full p-8 overflow-y-auto max-w-5xl font-mono text-zinc-200 space-y-6 relative z-10 custom-scrollbar">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-900/80 pb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">Cognitive Orchestration Layer</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
            Capability & Execution Registry
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Journeys operate on abstract capabilities, moments, and momentum. The runtime resolves tool implementations and governs execution policies.
          </p>
        </div>

        {activePanel === "capabilities" && (
          <button
            onClick={handleOpenCapCreate}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE CAPABILITY</span>
          </button>
        )}

        {activePanel === "tools" && (
          <button
            onClick={handleOpenToolCreate}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>REGISTER TOOL</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-zinc-900">
        <button
          onClick={() => { setActivePanel("capabilities"); setSearchQuery(""); }}
          className={clsx(
            "px-4 py-2 text-xs font-bold transition-all border-b-2 uppercase tracking-wide",
            activePanel === "capabilities"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          )}
        >
          Capabilities Catalog ({capabilities.length})
        </button>
        <button
          onClick={() => { setActivePanel("tools"); setSearchQuery(""); }}
          className={clsx(
            "px-4 py-2 text-xs font-bold transition-all border-b-2 uppercase tracking-wide",
            activePanel === "tools"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          )}
        >
          Tool Actions Explorer ({tools.length})
        </button>
        <button
          onClick={() => { setActivePanel("resolver"); }}
          className={clsx(
            "px-4 py-2 text-xs font-bold transition-all border-b-2 uppercase tracking-wide flex items-center space-x-1.5",
            activePanel === "resolver"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          )}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Resolver Sandbox Trace</span>
        </button>
      </div>

      {/* SEARCH (for catalog panels) */}
      {activePanel !== "resolver" && (
        <div className="flex items-center space-x-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3">
          <div className="flex-1 flex items-center space-x-3 bg-black/40 border border-zinc-900/60 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-zinc-550 shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activePanel}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-zinc-250 outline-none w-full font-mono placeholder:text-zinc-650"
            />
          </div>
        </div>
      )}

      {/* PANEL 1: CAPABILITIES */}
      {activePanel === "capabilities" && (
        <div className="grid grid-cols-1 gap-4">
          {filteredCapabilities.map(c => {
            const isExpanded = !!expandedDetails[c.id];
            return (
              <div
                key={c.id}
                className="bg-zinc-950/60 border border-zinc-900/80 hover:border-zinc-800 rounded-2xl p-5 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-100 font-bold text-sm">{c.name}</span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded font-mono">
                        {c.id}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-900/50">
                        {c.execution_type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedDetails(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                      className="text-zinc-500 hover:text-zinc-350 p-1.5 rounded-lg border border-zinc-900/60 hover:bg-zinc-900/40 transition-all text-[10px] flex items-center space-x-1"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? "Hide Blueprint" : "Show Blueprint"}</span>
                    </button>
                    <button
                      onClick={() => handleOpenCapEdit(c)}
                      className="text-zinc-500 hover:text-purple-400 p-1.5 rounded-lg border border-zinc-900/60 hover:bg-zinc-900/40 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCapability(c.id)}
                      className="text-zinc-650 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:bg-red-950/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-4 border-t border-zinc-900/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-3 bg-black/40 border border-zinc-900/40 p-4 rounded-xl">
                      <h4 className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">Input Requirements</h4>
                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-zinc-450">Required Inputs: </span>
                          <span className="text-zinc-200">
                            {c.required_inputs.length > 0 ? c.required_inputs.join(", ") : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-450">Optional Inputs: </span>
                          <span className="text-zinc-200">
                            {c.optional_inputs.length > 0 ? c.optional_inputs.join(", ") : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-450">Missing Input Strategy: </span>
                          <span className="text-amber-500 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/20">
                            {c.missing_input_strategy?.mode || "conversational_collection"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-black/40 border border-zinc-900/40 p-4 rounded-xl">
                      <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Outcome & Influence Mapping</h4>
                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-zinc-450">Produced Artifacts: </span>
                          <span className="text-zinc-200">
                            {c.produced_artifacts.length > 0 ? c.produced_artifacts.join(", ") : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-450">Produced Moments: </span>
                          <span className="text-purple-300 font-bold">
                            {c.produced_moments.length > 0 ? c.produced_moments.join(", ") : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-450">Modified Momentum: </span>
                          <span className="text-cyan-300 font-bold">
                            {c.modified_momentum.length > 0 ? c.modified_momentum.join(", ") : "None"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-black/40 border border-zinc-900/40 p-4 rounded-xl md:col-span-2">
                      <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Resolution Implementations & Governance</h4>
                      <div className="space-y-2 text-[11px]">
                        <div>
                          <span className="text-zinc-450">Target Tools: </span>
                          <span className="text-zinc-200">
                            {c.implemented_by_tools.join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-450">Governance Constraints: </span>
                          <ul className="list-disc pl-4 text-zinc-400 space-y-1 mt-1 font-sans">
                            {c.governance_constraints.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PANEL 2: TOOLS & ACTIONS */}
      {activePanel === "tools" && (
        <div className="grid grid-cols-1 gap-6">
          {filteredTools.map(t => {
            const isExpanded = !!expandedDetails[t.id];
            return (
              <div
                key={t.id}
                className="bg-zinc-950/60 border border-zinc-900/80 hover:border-zinc-800 rounded-2xl p-5 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-100 font-bold text-sm">{t.name}</span>
                      <span className="text-[10px] text-zinc-550 bg-zinc-900 px-2 py-0.5 rounded font-mono">
                        {t.id}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className={clsx(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          t.status === "active" ? "bg-emerald-400" : "bg-red-400"
                        )}></span>
                        <span className={clsx(
                          "relative inline-flex rounded-full h-2 w-2",
                          t.status === "active" ? "bg-emerald-500" : "bg-red-500"
                        )}></span>
                      </span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedDetails(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                      className="text-zinc-500 hover:text-zinc-350 p-1.5 rounded-lg border border-zinc-900/60 hover:bg-zinc-900/40 transition-all text-[10px] flex items-center space-x-1"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? "Hide Actions" : "Show Actions"}</span>
                    </button>
                    <button
                      onClick={() => handleOpenToolEdit(t)}
                      className="text-zinc-500 hover:text-amber-400 p-1.5 rounded-lg border border-zinc-900/60 hover:bg-zinc-900/40 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTool(t.id)}
                      className="text-zinc-650 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:bg-red-950/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-[10.5px] text-zinc-455 font-mono">
                  <div>
                    <span>SLA: </span>
                    <span className="text-zinc-250 font-bold">{t.sla}</span>
                  </div>
                  <div>
                    <span>Rate Limits: </span>
                    <span className="text-zinc-250 font-bold">{t.rate_limits}</span>
                  </div>
                  <div>
                    <span>Latency Tier: </span>
                    <span className="text-zinc-250 font-bold uppercase">{t.latency_tier}</span>
                  </div>
                  <div>
                    <span>Cost: </span>
                    <span className="text-zinc-250 font-bold uppercase">{t.cost_tier}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-4 border-t border-zinc-900/60 space-y-4">
                    <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Action Schemas & Interfaces</h4>
                    
                    {t.actions && t.actions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {t.actions.map(act => (
                          <div key={act.id} className="bg-black/50 border border-zinc-900 p-4 rounded-xl space-y-3 font-mono text-[11px]">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                              <span className="text-zinc-200 font-bold">{act.name}</span>
                              <span className="text-[9px] text-zinc-550 font-bold">{act.id}</span>
                            </div>
                            <p className="text-zinc-400 text-xs font-sans">{act.description}</p>
                            
                            <div className="space-y-1 text-zinc-455">
                              <div>Inputs: <span className="text-zinc-300">[{act.inputs.join(", ")}]</span></div>
                              <div>Outputs: <span className="text-zinc-300">[{act.outputs.join(", ")}]</span></div>
                              {act.produces_artifacts.length > 0 && (
                                <div>Produces: <span className="text-emerald-400">[{act.produces_artifacts.join(", ")}]</span></div>
                              )}
                              {act.consumes_artifacts.length > 0 && (
                                <div>Consumes: <span className="text-amber-400">[{act.consumes_artifacts.join(", ")}]</span></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-550 font-sans italic">No structured actions defined. Using fallback direct endpoint binding.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PANEL 3: RESOLVER SANDBOX */}
      {activePanel === "resolver" && (
        <div className="space-y-6">
          <div className="bg-zinc-955/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Sliders className="w-4 h-4" />
              <span>Configure Resolution Scenario</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Journey Target</label>
                <select
                  value={selJourney}
                  onChange={(e) => setSelJourney(e.target.value)}
                  className="bg-black/60 border border-zinc-900 focus:border-cyan-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                >
                  {journeys.map(j => (
                    <option key={j.id} value={j.id}>{j.name} ({j.category})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Behavioral Strategy</label>
                <select
                  value={selStrategy}
                  onChange={(e) => setSelStrategy(e.target.value)}
                  className="bg-black/60 border border-zinc-900 focus:border-cyan-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                >
                  {strategies.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.family})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:opacity-50 text-black text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/10"
              >
                <Play className="w-4 h-4 stroke-[3]" />
                <span>{isSimulating ? "RUNNING RESOLUTION..." : "RUN RESOLVER PIPELINE"}</span>
              </button>
            </div>
          </div>

          {/* SIMULATION TRACE VISUALIZER */}
          {simStep > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Node graph flow */}
              <div className="lg:col-span-2 bg-zinc-955/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resolution Blueprint Trace</h4>
                
                {/* Horizontal / Vertical Nodes representation */}
                <div className="flex flex-col space-y-3 pt-3">
                  
                  {/* Journey Node */}
                  <div className={clsx(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    simHighlightNode === "journey" ? "bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/5 text-purple-300" : "bg-black/40 border-zinc-900 text-zinc-400"
                  )}>
                    <div className="flex items-center space-x-2.5">
                      <Compass className="w-4 h-4" />
                      <div>
                        <div className="text-[9px] uppercase text-zinc-550 font-bold">Resolved Journey</div>
                        <div className="font-bold">{journeys.find(j => j.id === selJourney)?.name || selJourney}</div>
                      </div>
                    </div>
                    {simStep > 1 && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </div>

                  <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-800 rotate-90" /></div>

                  {/* Strategy Node */}
                  <div className={clsx(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    simHighlightNode === "strategy" ? "bg-amber-955/40 border-amber-500 shadow-lg shadow-amber-500/5 text-amber-300" : "bg-black/40 border-zinc-900 text-zinc-400"
                  )}>
                    <div className="flex items-center space-x-2.5">
                      <Target className="w-4 h-4" />
                      <div>
                        <div className="text-[9px] uppercase text-zinc-550 font-bold">Active Strategy</div>
                        <div className="font-bold">{strategies.find(s => s.id === selStrategy)?.name || selStrategy}</div>
                      </div>
                    </div>
                    {simStep > 2 && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>

                  <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-800 rotate-90" /></div>

                  {/* Capability Node */}
                  <div className={clsx(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    simHighlightNode === "capability" ? "bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/5 text-purple-200" : "bg-black/40 border-zinc-900 text-zinc-400"
                  )}>
                    <div className="flex items-center space-x-2.5">
                      <Cpu className="w-4 h-4" />
                      <div>
                        <div className="text-[9px] uppercase text-zinc-550 font-bold">Resolved Capability</div>
                        <div className="font-bold">fetch_financial_data & analyze_spending</div>
                      </div>
                    </div>
                    {simStep > 3 && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </div>

                  <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-800 rotate-90" /></div>

                  {/* Tool & Action Node */}
                  <div className={clsx(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    (simHighlightNode === "tool" || simHighlightNode === "action") ? "bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/5 text-emerald-300" : "bg-black/40 border-zinc-900 text-zinc-400"
                  )}>
                    <div className="flex items-center space-x-2.5">
                      <Wrench className="w-4 h-4" />
                      <div>
                        <div className="text-[9px] uppercase text-zinc-550 font-bold">Selected Tool & Action</div>
                        <div className="font-bold">aa_provider ➔ fetch_bank_statements</div>
                      </div>
                    </div>
                    {simStep > 5 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-800 rotate-90" /></div>

                  {/* Produced Artifact / Moments Node */}
                  <div className={clsx(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    simHighlightNode === "artifacts" || simHighlightNode === "moments" || simHighlightNode === "momentum" ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/5 text-cyan-300" : "bg-black/40 border-zinc-900 text-zinc-400"
                  )}>
                    <div className="flex items-center space-x-2.5">
                      <Database className="w-4 h-4" />
                      <div>
                        <div className="text-[9px] uppercase text-zinc-550 font-bold">Generated State & Influence Output</div>
                        <div className="font-bold">
                          Artifact: transaction_summary | Moment: financial_anxiety_detected
                        </div>
                      </div>
                    </div>
                    {simStep > 7 && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>

                </div>
              </div>

              {/* Logs output */}
              <div className="bg-black border border-zinc-900 rounded-2xl p-5 flex flex-col h-[400px]">
                <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-3">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Resolution Kernel Console</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar text-[10.5px] leading-relaxed">
                  {simLogs.map((log, i) => (
                    <div key={i} className="font-mono text-zinc-300">
                      {log}
                    </div>
                  ))}
                  {isSimulating && (
                    <div className="text-zinc-500 animate-pulse italic">Connecting endpoints...</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* CAPABILITY REGISTRATION MODAL */}
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
                    placeholder="e.g. Ingest Bank Statement"
                    value={capName}
                    onChange={(e) => setCapName(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Ingestion"
                    value={capCategory}
                    onChange={(e) => setCapCategory(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Description</label>
                <textarea
                  placeholder="What does this capability do?"
                  value={capDesc}
                  onChange={(e) => setCapDesc(e.target.value)}
                  rows={2}
                  className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Execution Type</label>
                  <select
                    value={capExecType}
                    onChange={(e) => setCapExecType(e.target.value as any)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="retrieval">Retrieval</option>
                    <option value="analysis">Analysis</option>
                    <option value="generator">Generator</option>
                    <option value="notification">Notification</option>
                    <option value="decisioning">Decisioning</option>
                    <option value="workflow">Workflow</option>
                    <option value="agentic_flow">Agentic Flow</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Priority</label>
                  <select
                    value={capPriority}
                    onChange={(e) => setCapPriority(e.target.value as any)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Missing Input Mode</label>
                  <select
                    value={capMissingStrategy}
                    onChange={(e) => setCapMissingStrategy(e.target.value as any)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="conversational_collection">Conversational Collection</option>
                    <option value="silent_inference">Silent Inference</option>
                    <option value="best_effort_execution">Best Effort Execution</option>
                    <option value="block_execution">Block Execution</option>
                    <option value="human_handoff">Human Handoff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Required Inputs (comma separated)</label>
                  <input
                    type="text"
                    placeholder="userId, consentId"
                    value={capReqInputs}
                    onChange={(e) => setCapReqInputs(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Produced Artifacts (comma separated)</label>
                  <input
                    type="text"
                    placeholder="transaction_summary"
                    value={capProdArtifacts}
                    onChange={(e) => setCapProdArtifacts(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Produced Moments (comma separated)</label>
                  <input
                    type="text"
                    placeholder="financial_anxiety_detected"
                    value={capProdMoments}
                    onChange={(e) => setCapProdMoments(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Modified Momentum (comma separated)</label>
                  <input
                    type="text"
                    placeholder="savings_momentum"
                    value={capModMomentum}
                    onChange={(e) => setCapModMomentum(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Implemented By Tools (comma separated IDs)</label>
                <input
                  type="text"
                  placeholder="aa_provider, spend_ai"
                  value={capToolsList}
                  onChange={(e) => setCapToolsList(e.target.value)}
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

      {/* TOOL REGISTRATION MODAL */}
      {showToolModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button
              onClick={() => setShowToolModal(false)}
              className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                {editingTool ? "EDIT TOOL REGISTRY ENTRY" : "REGISTER NEW AGENTIC TOOL"}
              </h3>
              <p className="text-[11px] text-zinc-500 font-sans mt-1">Bind live REST endpoints, credentials, retry rules, and structured action manifests.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp Gateway"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Notification"
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Description</label>
                <textarea
                  placeholder="How does this tool serve journeys?"
                  value={toolDesc}
                  onChange={(e) => setToolDesc(e.target.value)}
                  rows={2}
                  className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Owner Team</label>
                  <input
                    type="text"
                    value={toolOwner}
                    onChange={(e) => setToolOwner(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Authentication Mode</label>
                  <input
                    type="text"
                    value={toolAuth}
                    onChange={(e) => setToolAuth(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Rate Limit</label>
                  <input
                    type="text"
                    value={toolRateLimit}
                    onChange={(e) => setToolRateLimit(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">SLA</label>
                  <input
                    type="text"
                    value={toolSla}
                    onChange={(e) => setToolSla(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Latency Tier</label>
                  <select
                    value={toolLatencyTier}
                    onChange={(e) => setToolLatencyTier(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="instant">Instant (&lt; 200ms)</option>
                    <option value="near_realtime">Near Realtime (&lt; 2s)</option>
                    <option value="batch">Batch / Scheduled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-455 font-bold uppercase">Cost Tier</label>
                  <select
                    value={toolCostTier}
                    onChange={(e) => setToolCostTier(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-300 p-2.5 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="free">Free</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">API Gateway Endpoint URL</label>
                <input
                  type="text"
                  value={toolEndpoint}
                  onChange={(e) => setToolEndpoint(e.target.value)}
                  className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-455 font-bold uppercase">Actions Contract Manifest (JSON Array)</label>
                <textarea
                  placeholder="[]"
                  value={toolActionsRaw}
                  onChange={(e) => setToolActionsRaw(e.target.value)}
                  rows={4}
                  className="bg-black/40 border border-zinc-900 focus:border-amber-500 text-xs text-zinc-200 p-2.5 rounded-xl outline-none w-full font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900/65 font-mono">
              <button
                onClick={() => setShowToolModal(false)}
                className="bg-transparent border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveTool}
                className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                SAVE TOOL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. DOMAIN RESOLUTION (LAYER STACK UI)
// ==========================================
export function DomainResolution() {
  const { 
    activeL1Domain,
    activeL2Section,
    primitives, 
    updatePrimitiveBase,
    mockUsers, 
    selectedUserId, 
    setSelectedUser, 
    segments, 
    governanceShields, 
    illegalCombinations,
    toggleMockUserContext,
    journeys,
    journeyModifiers,
    strategies,
    organizations,
    tools,
    capabilities,
    artifacts,
    forbiddenBehaviors
  } = useBehaviorStore();

  const [activeSegmentIds, setActiveSegmentIds] = useState<string[]>(["india_genz", "bangalore_urban", "mode_financial_anxiety"]);
  const [selectedPrimId, setSelectedPrimId] = useState<string>("warmth");
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"stack" | "sir">("stack");

  // Product Simulation Studio states
  const [marketingInput, setMarketingInput] = useState("Get our high-yield savings plan with zero risk! Sign up in 5 minutes!");
  const [marketingPreset, setMarketingPreset] = useState<"empathetic" | "direct" | "fomo" | "trust" | "custom">("empathetic");
  const [marketingSliders, setMarketingSliders] = useState<Record<string, number>>(
    () =>
      Object.entries(primitives).reduce((acc, [id, prim]) => {
        acc[id] = prim.base;
        return acc;
      }, {} as Record<string, number>)
  );
  const [marketingCompiling, setMarketingCompiling] = useState(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [llmConfigs, setLlmConfigs] = useState<Array<{ id: string; name: string; provider: "gpt-4o" | "claude-sonnet" | "gemini-pro"; apiKey: string }>>([]);
  const [selectedLlmId, setSelectedLlmId] = useState("");
  const [newLlmName, setNewLlmName] = useState("");
  const [newLlmProvider, setNewLlmProvider] = useState<"gpt-4o" | "claude-sonnet" | "gemini-pro">("gpt-4o");
  const [newLlmApiKey, setNewLlmApiKey] = useState("");
  const [liveSimulationOutput, setLiveSimulationOutput] = useState("");
  const [marketingShellLogs, setMarketingShellLogs] = useState<string[]>([]);
  const [marketingPublishSuccess, setMarketingPublishSuccess] = useState(false);
  const [marketingGitVersion, setMarketingGitVersion] = useState("v1.4.12");
  const [marketingGitCommit, setMarketingGitCommit] = useState("");
  const [gitRemote, setGitRemote] = useState("origin");
  const [gitBranch, setGitBranch] = useState("");
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [gitUsername, setGitUsername] = useState("x-access-token");
  const [gitToken, setGitToken] = useState("");
  const [gitConnectStatus, setGitConnectStatus] = useState("");
  const [marketingHistory, setMarketingHistory] = useState<{version: string, commit: string, timestamp: string}[]>([
    { version: "v1.4.11", commit: "b7e45c2", timestamp: "1 hour ago" },
    { version: "v1.4.12", commit: "aef982c", timestamp: "30 mins ago" }
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("marketing_simulation_settings_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.llmConfigs)) setLlmConfigs(parsed.llmConfigs);
      if (typeof parsed.selectedLlmId === "string") setSelectedLlmId(parsed.selectedLlmId);
      if (typeof parsed.gitRepoUrl === "string") setGitRepoUrl(parsed.gitRepoUrl);
      if (typeof parsed.gitUsername === "string") setGitUsername(parsed.gitUsername);
      if (typeof parsed.gitToken === "string") setGitToken(parsed.gitToken);
      if (typeof parsed.gitRemote === "string") setGitRemote(parsed.gitRemote);
      if (typeof parsed.gitBranch === "string") setGitBranch(parsed.gitBranch);
    } catch {
      // Ignore corrupted local settings
    }
  }, []);

  useEffect(() => {
    const payload = {
      llmConfigs,
      selectedLlmId,
      gitRepoUrl,
      gitUsername,
      gitToken,
      gitRemote,
      gitBranch
    };
    localStorage.setItem("marketing_simulation_settings_v1", JSON.stringify(payload));
  }, [llmConfigs, selectedLlmId, gitRepoUrl, gitUsername, gitToken, gitRemote, gitBranch]);

  const applyMarketingPreset = (preset: "empathetic" | "direct" | "fomo" | "trust") => {
    setMarketingPreset(preset);
    let values = {};
    if (preset === "empathetic") {
      values = { expert: 0.50, mentor: 0.90, conversational: 0.85, formal: 0.30, friendly: 0.85, calm: 0.80, empathetic: 0.95, reassuring: 0.90, concise: 0.40, exhaustive: 0.50 };
    } else if (preset === "direct") {
      values = { expert: 0.70, mentor: 0.30, conversational: 0.50, formal: 0.60, friendly: 0.40, calm: 0.30, empathetic: 0.30, reassuring: 0.50, concise: 0.85, exhaustive: 0.20 };
    } else if (preset === "fomo") {
      values = { expert: 0.40, mentor: 0.20, conversational: 0.70, formal: 0.20, friendly: 0.80, calm: 0.20, empathetic: 0.40, reassuring: 0.30, concise: 0.90, exhaustive: 0.10 };
    } else {
      values = { expert: 0.95, mentor: 0.60, conversational: 0.30, formal: 0.95, friendly: 0.30, calm: 0.70, empathetic: 0.55, reassuring: 0.75, concise: 0.20, exhaustive: 0.85 };
    }
    setMarketingSliders(values);
  };

  const handleMarketingSlider = (key: string, val: number) => {
    setMarketingSliders(prev => ({ ...prev, [key]: val }));
    setMarketingPreset("custom");
  };

  const simulationPrimitiveFamilies = useMemo(() => {
    const families: Record<string, Primitive[]> = {};
    Object.values(primitives).forEach((prim) => {
      const family = prim.category || "Uncategorized";
      if (!families[family]) families[family] = [];
      families[family].push(prim);
    });
    return families;
  }, [primitives]);

  const simulatedMarketingOutput = useMemo(() => {
    let result = marketingInput.trim();
    if (!result) return "";

    const formality = (marketingSliders.formal + marketingSliders.expert) / 2;
    const warmth = (marketingSliders.friendly + marketingSliders.empathetic + marketingSliders.mentor) / 3;
    const confidence = (marketingSliders.reassuring + marketingSliders.calm) / 2;
    const brevity = marketingSliders.concise - marketingSliders.exhaustive;

    if (formality > 0.45) {
      result = result
        .replace(/\bget\b/gi, "acquire")
        .replace(/\bsign up\b/gi, "register")
        .replace(/\bzero risk\b/gi, "controlled risk profile")
        .replace(/\bminutes\b/gi, "minutes");
    }

    if (warmth > 0.7) {
      result = "We understand this decision matters. " + result;
    } else if (warmth > 0.5) {
      result = "You’re in the right place. " + result;
    } else if (warmth < 0.35) {
      result = "Recommendation: " + result;
    }

    if (confidence > 0.7) {
      result += " Rest assured, safeguards and compliance checks are in place.";
    } else if (confidence < 0.35) {
      result += " Please review details carefully before proceeding.";
    }

    if (brevity > 0.25) {
      result = result
        .replace(/\bhigh-yield savings plan\b/gi, "savings plan")
        .replace(/\bin 5 minutes\b/gi, "quickly");
    } else if (brevity < -0.25) {
      result += " This includes clear eligibility checks, transparent terms, and monitored execution thresholds.";
    }

    return result;
  }, [marketingInput, marketingSliders]);

  const simulationDiagnostics = useMemo(() => {
    const formality = (marketingSliders.formal + marketingSliders.expert) / 2;
    const warmth = (marketingSliders.friendly + marketingSliders.empathetic + marketingSliders.mentor) / 3;
    const confidence = (marketingSliders.reassuring + marketingSliders.calm) / 2;
    const brevity = marketingSliders.concise - marketingSliders.exhaustive;
    return {
      formality: formality.toFixed(2),
      warmth: warmth.toFixed(2),
      confidence: confidence.toFixed(2),
      brevity: brevity.toFixed(2)
    };
  }, [marketingSliders]);

  const compiledMarketingYaml = useMemo(() => {
    return `# Baseline Global Defaults
contract_type: global_defaults
compiled_at: "${new Date().toISOString().split("T")[0]}T12:00:00.000Z"

defaults:
${Object.entries(marketingSliders).map(([k, v]) => `  ${k}: ${v.toFixed(2)}`).join("\n")}`;
  }, [marketingSliders]);

  const publishMarketingGit = async () => {
    setMarketingCompiling(true);
    setMarketingPublishSuccess(false);
    setMarketingShellLogs([]);

    Object.entries(marketingSliders).forEach(([key, val]) => {
      updatePrimitiveBase(key, val);
    });

    try {
      const compilePayload = {
        primitives: Object.entries(primitives).reduce((acc: any, [k, v]) => {
          acc[k] = { ...v, base: marketingSliders[k] ?? v.base };
          return acc;
        }, {}),
        segments,
        governanceShields,
        forbiddenBehaviors,
        illegalCombinations,
        journeys,
        journeyModifiers,
        strategies,
        organizations,
        tools,
        capabilities,
        artifacts
      };

      const compileResponse = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compilePayload)
      });
      const compileData = await compileResponse.json();
      if (!compileResponse.ok || !compileData.success) {
        throw new Error(compileData.error || "Failed to execute compiler on system host.");
      }

      const publishResponse = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitMessage: `chore(simulation): publish runtime bundle (${marketingPreset} preset)`,
          source: "simulation_studio",
          remote: gitRemote,
          branch: gitBranch,
          repoUrl: gitRepoUrl,
          username: gitUsername,
          token: gitToken
        })
      });
      const publishData = await publishResponse.json();
      if (!publishResponse.ok || !publishData.success) {
        throw new Error(publishData.error || "Git publish pipeline failed.");
      }

      setMarketingShellLogs([...(compileData.logs || []), "", ...(publishData.logs || [])]);
      setMarketingCompiling(false);

      if (publishData.status === "published" && publishData.commitHash) {
        const nextVerMajorMinor = "v1.4.";
        const nextVerPatch = parseInt(marketingGitVersion.split(".")[2]) + 1;
        const newVersion = nextVerMajorMinor + nextVerPatch;
        const newCommit = String(publishData.commitHash).slice(0, 7);
        setMarketingPublishSuccess(true);
        setMarketingGitVersion(newVersion);
        setMarketingGitCommit(newCommit);
        setMarketingHistory(prev => [{ version: newVersion, commit: newCommit, timestamp: "Just now" }, ...prev]);
      } else {
        setMarketingPublishSuccess(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Compilation/Git push pipeline failed.";
      setMarketingShellLogs(prev => [...prev, `❌ ${errorMessage}`]);
      setMarketingCompiling(false);
    }
  };

  const runLiveSimulation = async () => {
    setIsLiveSimulating(true);
    try {
      const selectedConfig = llmConfigs.find((cfg) => cfg.id === selectedLlmId);
      if (!selectedConfig) {
        throw new Error("Please choose an LLM from Settings before running simulation.");
      }

      const payload = {
        provider: selectedConfig.provider,
        apiKey: selectedConfig.apiKey,
        scenario: {
          baseText: marketingInput
        },
        compiledPrims: marketingSliders,
        enforceGov: true
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Live simulation failed.");
      }
      setLiveSimulationOutput(data.text || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Live simulation failed.";
      setLiveSimulationOutput(`Simulation error: ${message}`);
    } finally {
      setIsLiveSimulating(false);
    }
  };

  const addLlmConfig = () => {
    const name = newLlmName.trim();
    const key = newLlmApiKey.trim();
    if (!name || !key) return;
    const id = `${Date.now()}`;
    setLlmConfigs((prev) => [...prev, { id, name, provider: newLlmProvider, apiKey: key }]);
    setSelectedLlmId(id);
    setNewLlmName("");
    setNewLlmApiKey("");
  };

  const deleteLlmConfig = (id: string) => {
    setLlmConfigs((prev) => prev.filter((cfg) => cfg.id !== id));
    if (selectedLlmId === id) {
      setSelectedLlmId("");
    }
  };

  const connectGitRemote = async () => {
    setGitConnectStatus("Connecting...");
    try {
      const response = await fetch("/api/git/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remote: gitRemote,
          repoUrl: gitRepoUrl,
          username: gitUsername,
          token: gitToken
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to connect git remote.");
      }
      setGitConnectStatus(`Connected: ${data.remote} -> ${data.repoUrl}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect git remote.";
      setGitConnectStatus(`Connection failed: ${message}`);
    }
  };

  const user = mockUsers.find(u => u.id === selectedUserId) || mockUsers[0];
  const activePrimitive = primitives[selectedPrimId] || Object.values(primitives)[0];

  const toggleSegmentSelection = (sId: string) => {
    setActiveSegmentIds(prev => 
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
  };

  // Resolve cascade
  const cascade = resolveCascade(activePrimitive, activeSegmentIds, segments, user, governanceShields, illegalCombinations);

  if (activeL2Section === "llm_settings") {
    return (
      <div className="h-full p-8 overflow-y-auto bg-[#08080a] text-zinc-200 font-mono">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-300">Configurations</h2>
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">LLM Settings</div>
          <input type="text" value={newLlmName} onChange={(e) => setNewLlmName(e.target.value)} placeholder="LLM Name (e.g. Team OpenAI)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <select className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" value={newLlmProvider} onChange={(e) => setNewLlmProvider(e.target.value as "gpt-4o" | "claude-sonnet" | "gemini-pro")}>
            <option value="gpt-4o">OpenAI (gpt-4o-mini)</option>
            <option value="claude-sonnet">Anthropic (Claude Sonnet)</option>
            <option value="gemini-pro">Google (Gemini)</option>
          </select>
          <input type="password" value={newLlmApiKey} onChange={(e) => setNewLlmApiKey(e.target.value)} placeholder="Paste API key (BYOK)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <button onClick={addLlmConfig} className="rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider border bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-900">Add LLM</button>
          <div className="space-y-2">
            {llmConfigs.map((cfg) => (
              <div key={cfg.id} className="flex items-center justify-between border border-zinc-900 rounded-lg px-3 py-2">
                <button onClick={() => setSelectedLlmId(cfg.id)} className={clsx("text-left flex-1", selectedLlmId === cfg.id ? "text-indigo-300" : "text-zinc-350")}>
                  <div className="text-[11px] font-bold">{cfg.name}</div>
                  <div className="text-[9px] text-zinc-600">{cfg.provider}</div>
                </button>
                <button onClick={() => deleteLlmConfig(cfg.id)} className="text-[10px] text-rose-400 hover:text-rose-300">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeL2Section === "git_settings") {
    return (
      <div className="h-full p-8 overflow-y-auto bg-[#08080a] text-zinc-200 font-mono">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-300">Configurations</h2>
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">GIT Settings</div>
          <input type="text" value={gitRepoUrl} onChange={(e) => setGitRepoUrl(e.target.value)} placeholder="Repository URL (https://github.com/org/repo.git)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <input type="text" value={gitUsername} onChange={(e) => setGitUsername(e.target.value)} placeholder="Git username (default: x-access-token)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <input type="password" value={gitToken} onChange={(e) => setGitToken(e.target.value)} placeholder="Access token (optional for private repos)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <input type="text" value={gitRemote} onChange={(e) => setGitRemote(e.target.value)} placeholder="Remote (default: origin)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <input type="text" value={gitBranch} onChange={(e) => setGitBranch(e.target.value)} placeholder="Branch (optional; defaults to current branch)" className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[12px] text-zinc-300" />
          <button onClick={connectGitRemote} className="rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider border bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-900">Connect Git</button>
          {gitConnectStatus && <div className="text-[11px] text-zinc-400">{gitConnectStatus}</div>}
          <div className="text-[11px] text-zinc-500">These settings are used by the Simulation publish action.</div>
        </div>
      </div>
    );
  }

  if (activeL1Domain === "marketing") {
    return (
      <div className="flex h-full bg-[#08080a] text-zinc-200 font-mono overflow-hidden z-10 relative">
        <div className="w-[380px] border-r border-zinc-900 bg-[#0b0b0e]/75 backdrop-blur-xl flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Simulation Foundations
            </span>
          </div>

          <div className="p-5 border-b border-zinc-900/80 space-y-2.5">
            <label className="block text-[8px] text-zinc-450 font-bold uppercase tracking-wider">Input Sentence</label>
            <textarea
              className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-3 text-[11px] leading-relaxed text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 font-mono resize-none transition-colors"
              rows={4}
              value={marketingInput}
              onChange={(e) => setMarketingInput(e.target.value)}
              placeholder="Enter a sentence to simulate primitive application..."
            />
          </div>

          <div className="p-5 border-b border-zinc-900/80 space-y-3">
            <label className="block text-[8px] text-zinc-450 font-bold uppercase tracking-wider">Preset Library</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyMarketingPreset("empathetic")}
                className={clsx(
                  "border rounded-xl p-3 text-left transition-all duration-300",
                  marketingPreset === "empathetic"
                    ? "border-indigo-500/40 bg-indigo-500/5 text-indigo-250"
                    : "border-zinc-900 bg-[#0e0e12]/30 hover:border-zinc-800 text-zinc-300"
                )}
              >
                <div className="text-[10px] font-bold">Supportive</div>
                <div className="text-[8px] text-zinc-550 mt-1 leading-normal font-sans">High empathy and reassurance</div>
              </button>
              <button
                onClick={() => applyMarketingPreset("direct")}
                className={clsx(
                  "border rounded-xl p-3 text-left transition-all duration-300",
                  marketingPreset === "direct"
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-250"
                    : "border-zinc-900 bg-[#0e0e12]/30 hover:border-zinc-800 text-zinc-300"
                )}
              >
                <div className="text-[10px] font-bold">Direct</div>
                <div className="text-[8px] text-zinc-550 mt-1 leading-normal font-sans">Concise and action-forward</div>
              </button>
              <button
                onClick={() => applyMarketingPreset("fomo")}
                className={clsx(
                  "border rounded-xl p-3 text-left transition-all duration-300",
                  marketingPreset === "fomo"
                    ? "border-amber-500/40 bg-amber-500/5 text-amber-250"
                    : "border-zinc-900 bg-[#0e0e12]/30 hover:border-zinc-800 text-zinc-300"
                )}
              >
                <div className="text-[10px] font-bold">Urgency</div>
                <div className="text-[8px] text-zinc-550 mt-1 leading-normal font-sans">Short, energetic conversion push</div>
              </button>
              <button
                onClick={() => applyMarketingPreset("trust")}
                className={clsx(
                  "border rounded-xl p-3 text-left transition-all duration-300",
                  marketingPreset === "trust"
                    ? "border-sky-500/40 bg-sky-500/5 text-sky-250"
                    : "border-zinc-900 bg-[#0e0e12]/30 hover:border-zinc-800 text-zinc-300"
                )}
              >
                <div className="text-[10px] font-bold">Trust</div>
                <div className="text-[8px] text-zinc-550 mt-1 leading-normal font-sans">Formal and compliance-oriented</div>
              </button>
            </div>
          </div>

          <div className="p-5 border-b border-zinc-900/80 space-y-3">
            <label className="block text-[8px] text-zinc-450 font-bold uppercase tracking-wider">Live Simulation Model</label>
            <select
              className="w-full bg-[#050507] border border-zinc-900 rounded-xl p-2.5 text-[11px] text-zinc-300"
              value={selectedLlmId}
              onChange={(e) => setSelectedLlmId(e.target.value)}
            >
              <option value="">Select Added LLM</option>
              {llmConfigs.map((cfg) => (
                <option key={cfg.id} value={cfg.id}>{cfg.name} ({cfg.provider})</option>
              ))}
            </select>
            <button
              onClick={runLiveSimulation}
              disabled={isLiveSimulating || !marketingInput.trim()}
              className={clsx(
                "w-full rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-wider border",
                isLiveSimulating
                  ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
              )}
            >
              {isLiveSimulating ? "Running Live Simulation..." : "Run Live Simulation"}
            </button>
          </div>

          <div className="p-5 space-y-4">
            <label className="block text-[8px] text-zinc-450 font-bold uppercase tracking-wider">Foundations</label>
            <div className="space-y-4">
              {Object.entries(simulationPrimitiveFamilies).map(([family, familyPrims]) => (
                <div key={family} className="border border-zinc-900 rounded-xl p-3 bg-[#0c0c10]/40">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-2">{family}</div>
                  <div className="space-y-3">
                    {familyPrims.map((prim) => {
                      const value = marketingSliders[prim.id] ?? prim.base;
                      return (
                        <div key={prim.id} className="space-y-1">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-zinc-350 font-bold">{prim.name}</span>
                            <span className="text-zinc-500 text-[8px]">{value.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min={prim.range.min}
                            max={prim.range.max}
                            step="0.05"
                            value={value}
                            onChange={(e) => handleMarketingSlider(prim.id, parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-colors"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 border-r border-zinc-900 bg-[#08080a] flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Simulation Output
            </span>
            <span className="text-[8px] text-zinc-550 uppercase font-bold tracking-widest">Preset: {marketingPreset}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-[#0c0c11] to-[#0e0e14] border border-indigo-500/10 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
              <div className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider mb-2">AI-Transformed Sentence</div>
              <div className="text-[15px] font-medium leading-relaxed text-zinc-100 font-sans tracking-wide min-h-[80px] select-all">
                {simulatedMarketingOutput}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c11] to-[#0e0e14] border border-emerald-500/20 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
              <div className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider mb-2">Live LLM Response</div>
              <div className="text-[15px] font-medium leading-relaxed text-zinc-100 font-sans tracking-wide min-h-[80px] select-all">
                {liveSimulationOutput || "Run live simulation to see model output with current primitives."}
              </div>
            </div>

            <div className="border border-zinc-850 bg-[#0b0b0e]/50 rounded-[16px] px-4 py-3 text-[10px] text-zinc-400 font-mono">
              formality={simulationDiagnostics.formality} | warmth={simulationDiagnostics.warmth} | confidence={simulationDiagnostics.confidence} | brevity={simulationDiagnostics.brevity}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="border border-zinc-850 bg-[#0b0b0e]/50 rounded-[20px] p-5 space-y-4">
                <div className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider flex items-center">
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Foundation Weights
                </div>
                <div className="space-y-2">
                  {Object.entries(marketingSliders).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-[8px]">
                        <span className="text-zinc-400 font-medium capitalize font-sans">{key}</span>
                        <span className="text-zinc-550 font-mono">{Math.round(val * 100)}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-900">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                          style={{ width: (val * 100) + "%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-zinc-850 bg-[#0b0b0e]/50 rounded-[20px] p-5 flex flex-col">
                <div className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider flex items-center mb-4">
                  <Code className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> runtime/marketing/global_defaults.yaml
                </div>
                <div className="flex-1 bg-[#050507] border border-zinc-900 rounded-xl p-3 font-mono text-[9px] text-zinc-400 whitespace-pre overflow-x-auto leading-relaxed select-text select-all">
                  {compiledMarketingYaml}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[360px] border-l border-zinc-900 bg-[#0b0b0e]/75 backdrop-blur-xl flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <GitBranch className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Finalize & Publish
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col overflow-hidden space-y-5">
            <button
              disabled={marketingCompiling}
              onClick={publishMarketingGit}
              className={clsx(
                "w-full rounded-2xl py-4 flex items-center justify-center font-bold text-[11px] tracking-wider uppercase transition-all duration-300 shadow-xl",
                marketingCompiling
                  ? "bg-zinc-900 border border-zinc-850 text-zinc-550 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-black border border-indigo-400/20"
              )}
            >
              {marketingCompiling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin text-zinc-550" />
                  Publishing...
                </>
              ) : (
                <>
                  <GitBranch className="w-3.5 h-3.5 mr-2 text-white/95" />
                  Publish YAML Runtime Bundle
                </>
              )}
            </button>

            <div className="flex-1 bg-[#050507] border border-zinc-900 rounded-[20px] p-4 font-mono text-[9px] flex flex-col overflow-hidden relative shadow-inner">
              <div className="text-[7.5px] text-zinc-550 font-bold uppercase tracking-wider mb-2.5 flex items-center">
                <Terminal className="w-3 h-3 mr-1 text-zinc-500" /> Publish Console
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 text-zinc-400 select-text pr-1 custom-scrollbar">
                {marketingShellLogs.length === 0 ? (
                  <div className="text-zinc-650 italic">Ready. Publishing will compile YAML files and push a git commit.</div>
                ) : (
                  marketingShellLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        log.startsWith("$") ? "text-indigo-400 font-bold" :
                        log.startsWith("❌") ? "text-rose-500" :
                        log.startsWith("✅") || log.startsWith("✓") ? "text-emerald-400" :
                        "text-zinc-400"
                      )}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Published History</label>
              <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1 custom-scrollbar">
                {marketingHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      "flex items-center justify-between border rounded-xl p-2.5 bg-zinc-950/20 backdrop-blur-md transition-all duration-300",
                      idx === 0 && marketingPublishSuccess
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-zinc-900"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-zinc-250 flex items-center">
                        <GitBranch className="w-3 h-3 mr-1 text-zinc-500" /> {item.version}
                      </span>
                      <span className="text-[8px] font-mono px-1 rounded bg-zinc-900 text-zinc-555 border border-zinc-800">
                        {item.commit}
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-650">{item.timestamp}</span>
                  </div>
                ))}
              </div>
              {marketingGitCommit && (
                <div className="text-[8px] text-zinc-550 font-mono">Latest commit: {marketingGitCommit}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#08080a] text-zinc-200 font-mono overflow-hidden z-10 relative">
      
      {/* Left controls sidebar */}
      <div className="w-80 border-r border-zinc-900 bg-[#0b0b0e]/75 backdrop-blur-xl flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-950">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
            <Tv className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Resolution Sandbox
          </span>
        </div>

        {/* User Context selection */}
        <div className="p-4 border-b border-zinc-900 space-y-2">
          <label className="block text-[8px] text-zinc-650 font-bold uppercase tracking-wider">Select Mock User Context</label>
          <div className="space-y-1">
            {mockUsers.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u.id)}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-colors border",
                  user.id === u.id 
                    ? "bg-indigo-500/5 border-indigo-500/30 text-indigo-300 font-semibold" 
                    : "bg-zinc-950/20 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                )}
              >
                <span className="truncate">{u.name}</span>
                <User className="w-3 h-3 text-zinc-600" />
              </button>
            ))}
          </div>
        </div>

        {/* User Context state factors */}
        <div className="p-4 border-b border-zinc-900 space-y-3">
          <label className="block text-[8px] text-zinc-650 font-bold uppercase tracking-wider">Mock User Attributes</label>
          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Anxiety level</span>
              <select
                value={user.anxietyLevel}
                onChange={(e) => toggleMockUserContext(user.id, "anxietyLevel", e.target.value as "low" | "medium" | "high")}
                className="bg-zinc-950 border border-zinc-850 rounded px-1 py-0.5 text-zinc-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">UPI usage intensity</span>
              <select
                value={user.upiUsage}
                onChange={(e) => toggleMockUserContext(user.id, "upiUsage", e.target.value as "low" | "heavy")}
                className="bg-zinc-950 border border-zinc-850 rounded px-1 py-0.5 text-zinc-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active segments overlay switcher */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2">
          <label className="block text-[8px] text-zinc-650 font-bold uppercase tracking-wider">Segment Overlays</label>
          <div className="space-y-1.5">
            {segments.map(seg => {
              const isSelected = activeSegmentIds.includes(seg.id);
              return (
                <button
                  key={seg.id}
                  onClick={() => toggleSegmentSelection(seg.id)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left text-[11px] transition-colors",
                    isSelected ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-450"
                  )}
                >
                  <span className="truncate">{seg.name}</span>
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Resolution Explorer */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resolution Cascade Engine</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-150">
              Physical Resolution Layer Stacking
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
              The platform visualizes **layered composition**, not simple workflow arrow trees. Select any primitive below to inspect the vertical compiler cascade.
            </p>
          </div>
          
          <div className="flex bg-[#0a0a0d] border border-zinc-850 p-1 rounded-lg self-start md:self-center shrink-0">
            <button 
              onClick={() => setViewMode("stack")}
              className={clsx(
                "text-[9px] px-3.5 py-1.5 rounded-md transition-all font-bold uppercase",
                viewMode === "stack" ? "bg-indigo-650/20 text-indigo-400 border border-indigo-500/10 font-black" : "text-zinc-500 hover:text-zinc-350"
              )}
            >
              Layer Stack
            </button>
            <button 
              onClick={() => setViewMode("sir")}
              className={clsx(
                "text-[9px] px-3.5 py-1.5 rounded-md transition-all font-bold uppercase",
                viewMode === "sir" ? "bg-indigo-650/20 text-indigo-400 border border-indigo-500/10 font-black" : "text-zinc-500 hover:text-zinc-350"
              )}
            >
              SIR Model
            </button>
          </div>
        </div>

        {viewMode === "sir" ? (
          <div className="animate-fadeIn p-2 bg-[#09090b]/40 border border-zinc-900/60 rounded-2xl p-6">
            <SirViewer />
          </div>
        ) : (
          <>
            {/* Primitive selectors */}
            <div className="flex flex-wrap gap-1.5 bg-zinc-950/60 border border-zinc-900 rounded-xl p-3">
          {Object.values(primitives).map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPrimId(p.id);
                setSelectedLayerIdx(null);
              }}
              className={clsx(
                "text-[10px] px-2.5 py-1 rounded transition-all font-bold",
                selectedPrimId === p.id 
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/25" 
                  : "bg-transparent text-zinc-500 hover:text-zinc-350"
              )}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Physical Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Vertical Stack UI (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">Resolved Cascade Stack</span>
            
            <div className="flex flex-col-reverse space-y-2 space-y-reverse relative">
              {cascade.steps.map((step, idx) => {
                const isBase = step.sourceType === "base";
                const isGov = step.sourceType === "governance";
                const isStrat = step.sourceName.includes("Strategy Tactic");
                const isSelected = selectedLayerIdx === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedLayerIdx(idx)}
                    className={clsx(
                      "w-full text-left p-4 rounded-xl border transition-all duration-150 flex justify-between items-center relative hover:scale-[1.01]",
                      isGov 
                        ? "bg-rose-500/5 border-rose-500/25 text-rose-300" 
                        : isStrat
                        ? "bg-purple-650/10 border-purple-550/30 text-purple-300"
                        : step.category === "product"
                        ? "bg-indigo-500/5 border-indigo-500/25 text-indigo-350"
                        : isBase
                        ? "bg-zinc-950/60 border-zinc-900 text-zinc-450"
                        : "bg-purple-500/5 border-purple-500/20 text-purple-300",
                      isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-black" : ""
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      {isGov && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      {isStrat && <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 animate-pulse" />}
                      <span className="text-xs font-bold font-mono">{step.sourceName}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px]">
                      {!isBase && (
                        <span className={clsx(
                          "font-bold",
                          step.delta > 0 ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {(step.delta > 0 ? "+" : "") + step.delta.toFixed(2)}
                        </span>
                      )}
                      <span className="bg-[#050507] border border-zinc-900 px-2 py-0.5 rounded text-zinc-300 font-bold font-mono text-[10px]">
                        {step.runningValue.toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Resolved Outcome Bar */}
            <div className="border-t border-zinc-900 pt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-zinc-500">Resolved Manifest Output</span>
                <ArrowRight className="w-4 h-4 text-zinc-650" />
                <span className="bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded text-emerald-400 font-bold text-sm shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                  {cascade.finalValue.toFixed(2)}
                </span>
              </div>
              <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">COMPILATION CASCADE OK</span>
            </div>
          </div>

          {/* Layer debugger details (Right 5 Columns) */}
          <div className="lg:col-span-5">
            <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block mb-4">Cascade Inspector</span>

            {selectedLayerIdx !== null ? (() => {
              const step = cascade.steps[selectedLayerIdx];
              const isBase = step.sourceType === "base";
              const isGov = step.sourceType === "governance";
              const isStrat = step.sourceName.includes("Strategy Tactic");

              return (
                <div className="bg-[#0b0b0d] border border-zinc-900 rounded-[22px] p-5 space-y-4 text-[10.5px]">
                  <div>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">AUDIT LAYER</span>
                    <span className="text-xs font-bold text-zinc-200">{step.sourceName}</span>
                  </div>

                  <div className="space-y-2 border-t border-zinc-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-650">Domain Owner:</span>
                      <span className="text-indigo-400 font-bold uppercase font-mono text-[9px]">
                        {isGov 
                          ? "GOVERNANCE" 
                          : isStrat 
                          ? "PRODUCT (Strategy)" 
                          : step.category === "product" 
                          ? "PRODUCT" 
                          : isBase 
                          ? "ENGINEERING" 
                          : "MARKETING"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-650">Inherited Value:</span>
                      <span className="text-zinc-400">{isBase ? "0.00" : cascade.steps[selectedLayerIdx - 1]?.runningValue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-650">Layer Delta Override:</span>
                      <span className="text-zinc-400">{isBase ? "N/A" : (step.delta > 0 ? "+" : "") + step.delta.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-650">Resulting Vector:</span>
                      <span className="text-emerald-400 font-bold">{step.runningValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 space-y-1.5 text-[9px] text-zinc-500">
                    <span className="font-bold text-zinc-450 uppercase block mb-1">Inheritance Logs</span>
                    {isBase ? (
                      <p className="font-sans">L1 Default baseline settings inherited by all overlay segment modifications.</p>
                    ) : isGov ? (
                      <p className="font-sans">Constitutional safety policy clamped the resolved parameters to guarantee alignment.</p>
                    ) : (
                      <p className="font-sans">Segment delta modifier applied an additive adjustment to baseline variables.</p>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="border border-dashed border-zinc-850 rounded-[22px] p-6 text-center text-zinc-500 text-xs font-sans">
                Click any layer in the resolved cascade stack to inspect variables, delta details, and ownership inheritance parameters.
              </div>
            )}
          </div>

        </div>
        </>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 5. DOMAIN OUTPUTS WORKSPACE
export function DomainOutputs() {
  const { 
    primitives = [], 
    segments = [], 
    governanceShields = [], 
    forbiddenBehaviors = [], 
    illegalCombinations = [],
    journeys = [],
    journeyModifiers = [],
    strategies = [],
    organizations = [],
    triggerAuditLog,
    tools = [],
    capabilities = [],
    artifacts = [],
    createArtifact,
    updateArtifact,
    deleteArtifact
  } = useBehaviorStore();

  const [activeTab, setActiveTab] = useState<"registry" | "lineage" | "compiler">("registry");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<"all" | "persistent" | "moment" | "momentum">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"persistent" | "moment" | "momentum">("persistent");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [schemaContract, setSchemaContract] = useState("");
  const [lifecycleStatus, setLifecycleStatus] = useState("draft");

  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({});
  const [selectedGraphNode, setSelectedGraphNode] = useState<{ type: "capability" | "artifact"; id: string } | null>(null);

  // Compiler states
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("runtime_manifest.yaml");
  const [compiledFiles, setCompiledFiles] = useState<Record<string, string>>({});

  const filteredArtifacts = useMemo(() => {
    return (artifacts || []).filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategoryFilter === "all" || 
        a.category === selectedCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [artifacts, searchQuery, selectedCategoryFilter]);

  const handleOpenCreate = () => {
    setEditingArtifact(null);
    setName("");
    setDescription("");
    setCategory("persistent");
    setApiEndpoint("https://api.kyfr.internal/artifacts/custom");
    setSchemaContract("{\n  \"payloadId\": \"string\",\n  \"data\": {}\n}");
    setLifecycleStatus("draft");
    setShowModal(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditingArtifact(a);
    setName(a.name);
    setDescription(a.description);
    setCategory(a.category || "persistent");
    setApiEndpoint(a.apiEndpoint);
    setSchemaContract(a.schemaContract);
    setLifecycleStatus(a.lifecycleStatus);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    try {
      JSON.parse(schemaContract);
    } catch (e) {
      alert("Invalid JSON schema contract format");
      return;
    }

    const artId = editingArtifact ? editingArtifact.id : name.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    const payload = {
      id: artId,
      name,
      description,
      category,
      family: (category === "moment" ? "Moments Artifacts" : "Momentum Artifacts") as any,
      apiEndpoint,
      schemaContract: JSON.stringify(JSON.parse(schemaContract), null, 2),
      lifecycleStatus
    };

    if (editingArtifact) {
      updateArtifact(editingArtifact.id, payload);
    } else {
      createArtifact(payload);
    }
    setShowModal(false);
  };

  const runCompiler = async () => {
    setIsCompiling(true);
    setLogs(["Initializing client-side sandbox serialization..."]);
    
    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primitives,
          segments,
          governanceShields,
          forbiddenBehaviors,
          illegalCombinations,
          journeys,
          journeyModifiers,
          strategies,
          organizations,
          tools,
          capabilities,
          artifacts
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to execute compiler on system host.");

      // Stream the compiled logs trace for retro look
      let currentLogIdx = 0;
      setLogs([]);
      const interval = setInterval(() => {
        if (currentLogIdx < data.logs.length) {
          setLogs(prev => [...prev, data.logs[currentLogIdx]]);
          currentLogIdx++;
        } else {
          clearInterval(interval);
          setCompiledFiles(data.compiledFiles);
          // Auto-select first compiled file or keep manifest
          if (data.compiledFiles["runtime_manifest.yaml"]) {
            setSelectedFile("runtime_manifest.yaml");
          } else {
            setSelectedFile(Object.keys(data.compiledFiles)[0] || "");
          }
          setIsCompiling(false);
          triggerAuditLog("deploy_experiment", "Successfully compiled custom authoring state to local workspace.");
        }
      }, 90);

    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] Compiler crashed: ${err.message}`]);
      setIsCompiling(false);
    }
  };

  const toggleContract = (id: string) => {
    setExpandedContracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full p-8 overflow-y-auto max-w-5xl font-mono text-zinc-200 space-y-6 relative z-10 custom-scrollbar">
      {/* Header */}
      <div className="border-b border-zinc-900/80 pb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-1.5 text-purple-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">Product & Behavioral State Outputs</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
            Goal-Outcome Artifact Workspace
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Design and compile persistent schemas, real-time trigger moments, and longitudinal progress indicators representing behavioral outcomes.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-955 border border-zinc-900 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab("registry")}
            className={clsx(
              "text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all",
              activeTab === "registry" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" : "text-zinc-550 hover:text-zinc-300"
            )}
          >
            Registry Catalog
          </button>
          <button
            onClick={() => setActiveTab("lineage")}
            className={clsx(
              "text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all",
              activeTab === "lineage" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" : "text-zinc-550 hover:text-zinc-300"
            )}
          >
            Lineage Flow
          </button>
          <button
            onClick={() => setActiveTab("compiler")}
            className={clsx(
              "text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all",
              activeTab === "compiler" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" : "text-zinc-550 hover:text-zinc-300"
            )}
          >
            Compiler Console
          </button>
        </div>
      </div>

      {/* TAB 1: REGISTRY CATALOG */}
      {activeTab === "registry" && (
        <div className="space-y-6">
          {/* Registry Toolbar & Filter buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4">
            <div className="flex-1 flex items-center space-x-3 bg-black/40 border border-zinc-900/60 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-zinc-550 shrink-0" />
              <input
                type="text"
                placeholder="Search outputs by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-zinc-200 outline-none w-full placeholder-zinc-650"
              />
            </div>

            <div className="flex items-center space-x-1 bg-black/40 border border-zinc-900/60 rounded-xl p-1 shrink-0">
              {(["all", "persistent", "moment", "momentum"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={clsx(
                    "text-[8.5px] uppercase font-bold px-2.5 py-1.5 rounded-lg transition-all",
                    selectedCategoryFilter === cat 
                      ? "bg-zinc-900 text-zinc-100" 
                      : "text-zinc-550 hover:text-zinc-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/10 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>REGISTER ARTIFACT</span>
            </button>
          </div>

          {/* Registry Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredArtifacts.map(art => {
              const isExpanded = !!expandedContracts[art.id];
              return (
                <div 
                  key={art.id} 
                  className={clsx(
                    "border bg-zinc-950/20 rounded-2xl hover:border-zinc-800 transition-all overflow-hidden flex flex-col justify-between",
                    art.category === "persistent" ? "border-zinc-900/80" :
                    art.category === "moment" ? "border-purple-950/80" : "border-cyan-950/80"
                  )}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-sm font-bold text-zinc-100">{art.name}</span>
                          <span className={clsx(
                            "text-[8px] uppercase font-mono px-2 py-0.5 rounded-lg border font-bold",
                            art.category === "persistent" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            art.category === "moment" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                            "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                          )}>
                            {art.category || "persistent"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-450 font-sans leading-relaxed">{art.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[8px] font-mono text-zinc-550 bg-zinc-900 px-2 py-1 rounded border border-zinc-850">
                          ID: {art.id}
                        </span>
                        <span className={clsx(
                          "text-[8px] uppercase font-bold px-2 py-1 rounded-lg border",
                          art.lifecycleStatus === "active" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                          art.lifecycleStatus === "deprecated" ? "bg-rose-500/15 border-rose-500/30 text-rose-400" :
                          "bg-zinc-900 border-zinc-800 text-zinc-450"
                        )}>
                          {art.lifecycleStatus}
                        </span>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-2 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-850 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteArtifact(art.id)}
                          className="p-2 hover:bg-rose-500/10 border border-zinc-900 hover:border-rose-500/25 rounded-xl text-zinc-550 hover:text-rose-450 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Momentum indicator details (e.g. sparkline chart placeholders) */}
                    {art.category === "momentum" && (
                      <div className="bg-black/45 border border-zinc-900/60 p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[9.5px]">
                          <span className="text-zinc-450">LONGITUDINAL SCORE METRIC:</span>
                          <span className="text-cyan-400 font-bold">78/100 (HIGH TRUST STAGE)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] text-zinc-550 font-bold uppercase shrink-0">Progress: </span>
                          <div className="h-2 w-full bg-zinc-900 rounded overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: "78%" }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Moment indicator details (simulated triggers) */}
                    {art.category === "moment" && (
                      <div className="bg-black/45 border border-purple-950/40 p-3.5 rounded-xl space-y-1.5 flex items-center justify-between text-[9.5px]">
                        <div className="flex items-center space-x-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                          </span>
                          <span className="text-purple-300 font-bold uppercase">Dynamic Emotional Listener active</span>
                        </div>
                        <span className="text-zinc-500 font-mono">Trigger Threshold: &gt; 0.85 Tension</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[9px] pt-1">
                      <div className="flex items-center space-x-2 text-zinc-450">
                        <span className="text-zinc-600 uppercase font-bold">API Endpoint:</span>
                        <span className="bg-black/30 border border-zinc-900/60 rounded px-2 py-0.5 font-mono text-purple-450 text-[8.5px] max-w-sm truncate">
                          {art.apiEndpoint}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleContract(art.id)}
                        className="flex items-center space-x-1.5 hover:text-zinc-200 text-zinc-450 border border-zinc-900 hover:border-zinc-800 bg-zinc-955/40 rounded-lg px-2.5 py-1.5 transition-all"
                      >
                        <span>{isExpanded ? "Hide Schema" : "View Schema Contract"}</span>
                        {isExpanded ? <ChevronDown className="w-3 h-3 rotate-180 transition-transform duration-200" /> : <ChevronDown className="w-3 h-3 transition-transform duration-200" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-900 bg-black/30 p-5 space-y-2 animate-slideDown">
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Structured JSON Contract Interface</span>
                      <pre className="bg-[#050507] border border-zinc-900/80 rounded-xl p-3.5 text-[9.5px] text-zinc-300 overflow-x-auto max-h-56 custom-scrollbar font-mono leading-relaxed">
                        {art.schemaContract}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LINEAGE & DEPENDENCY GRAPH */}
      {activeTab === "lineage" && (
        <div className="space-y-6">
          <div className="bg-zinc-955/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              State Flow Lineage Explorer
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
              Click a capability or outcome artifact below to view direct operational lineage, resolving upstream required inputs and downstream state modifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Column 1: Capabilities */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider pb-1 border-b border-zinc-900">
                Capabilities (Upstream Producers)
              </h4>
              
              <div className="space-y-3">
                {capabilities.map(c => {
                  const isSelected = selectedGraphNode?.type === "capability" && selectedGraphNode?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedGraphNode({ type: "capability", id: c.id })}
                      className={clsx(
                        "p-4 rounded-xl border transition-all cursor-pointer space-y-2.5",
                        isSelected 
                          ? "bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/5 text-zinc-200" 
                          : "bg-black/30 border-zinc-900 hover:border-zinc-800 text-zinc-400"
                      )}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-300">{c.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">{c.id}</span>
                      </div>
                      
                      <div className="text-[10px] space-y-1 text-zinc-500">
                        <div>Required Inputs: <span className="text-zinc-400">[{c.required_inputs.join(", ")}]</span></div>
                        <div>Produced Artifacts: <span className="text-emerald-400">[{c.produced_artifacts.join(", ")}]</span></div>
                        {c.produced_moments.length > 0 && (
                          <div>Produced Moments: <span className="text-purple-400">[{c.produced_moments.join(", ")}]</span></div>
                        )}
                        {c.modified_momentum.length > 0 && (
                          <div>Modified Momentum: <span className="text-cyan-400">[{c.modified_momentum.join(", ")}]</span></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Artifacts/State Outcomes */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pb-1 border-b border-zinc-900">
                Artifact Outcomes (Downstream Vault)
              </h4>
              
              <div className="space-y-3">
                {artifacts.map(a => {
                  const isSelected = selectedGraphNode?.type === "artifact" && selectedGraphNode?.id === a.id;
                  
                  // Find producing capabilities
                  const producingCaps = capabilities.filter(c => 
                    c.produced_artifacts.includes(a.id) ||
                    c.produced_moments.includes(a.id) ||
                    c.modified_momentum.includes(a.id)
                  );

                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedGraphNode({ type: "artifact", id: a.id })}
                      className={clsx(
                        "p-4 rounded-xl border transition-all cursor-pointer space-y-2.5",
                        isSelected 
                          ? "bg-emerald-955/30 border-emerald-500 shadow-md shadow-emerald-500/5 text-zinc-200" 
                          : "bg-black/30 border-zinc-900 hover:border-zinc-800 text-zinc-400"
                      )}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-300">{a.name}</span>
                        <span className={clsx(
                          "text-[8px] uppercase font-mono px-1.5 py-0.5 rounded",
                          a.category === "persistent" ? "bg-emerald-950 text-emerald-400" :
                          a.category === "moment" ? "bg-purple-955 text-purple-400" : "bg-cyan-955 text-cyan-400"
                        )}>
                          {a.category}
                        </span>
                      </div>

                      <div className="text-[10px] space-y-1 text-zinc-500">
                        <div>Produced Upstream By: <span className="text-zinc-400">
                          {producingCaps.length > 0 ? producingCaps.map(c => c.id).join(", ") : "None defined"}
                        </span></div>
                        <div>Lifecycle Stage: <span className="text-zinc-400 font-bold uppercase">{a.lifecycleStatus}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: MANIFEST COMPILER */}
      {activeTab === "compiler" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-200 uppercase">Compile Local Manifest Configuration</span>
              <p className="text-[10px] text-zinc-500 font-sans max-w-xl">
                Compiles the dynamic registries, capabilities contracts, and hard governance prohibitions to local YAML files in `/runtime` and `/manifests`.
              </p>
            </div>
            <button
              onClick={runCompiler}
              disabled={isCompiling}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 transition-all text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 uppercase"
            >
              {isCompiling ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Terminal className="w-4 h-4" />
              )}
              <span>{isCompiling ? "Compiling..." : "Run Synthesizer"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Compiler Console Log */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider block">Terminal Build Logs</span>
              <div className="bg-[#070709] border border-zinc-900 rounded-2xl p-4 flex-1 min-h-[360px] font-mono text-[9px] text-zinc-500 space-y-2 overflow-y-auto custom-scrollbar">
                {logs.length === 0 ? (
                  <span className="text-zinc-700 italic text-[10px]">No active compilation processes. Click "Run Synthesizer" above to start.</span>
                ) : (
                  logs.map((log, idx) => {
                    if (!log || typeof log !== "string") return null;
                    return (
                      <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                        <span className="text-indigo-400 font-bold shrink-0">&gt;</span>
                        <span className={clsx(
                          log.includes("successfully") || log.includes("✓") || log.includes("🎉") ? "text-emerald-450 font-semibold" :
                          log.includes("[ERROR]") ? "text-rose-450 font-bold" :
                          log.includes("Compiled") || log.includes("Created") ? "text-zinc-450" : "text-zinc-650"
                        )}>{log}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Compiled explorer */}
            <div className="lg:col-span-7 flex flex-col bg-[#070709] border border-zinc-900 rounded-2xl overflow-hidden shadow-sm min-h-[360px]">
              <div className="px-4 py-3 border-b border-zinc-900/60 bg-zinc-955 flex items-center justify-between shrink-0">
                <span className="text-[8.5px] font-bold text-zinc-450 uppercase tracking-widest flex items-center">
                  <Code className="w-3.5 h-3.5 mr-1.5 text-emerald-450" /> Compiled Config Explorer
                </span>
              </div>

              {Object.keys(compiledFiles).length > 0 ? (
                <div className="flex flex-1 overflow-hidden min-h-[320px]">
                  {/* File list sidebar */}
                  <div className="w-48 border-r border-zinc-900 bg-zinc-950/20 overflow-y-auto custom-scrollbar flex flex-col py-1.5 shrink-0">
                    {Object.keys(compiledFiles).map(fileName => {
                      const isSelected = selectedFile === fileName;
                      return (
                        <button
                          key={fileName}
                          onClick={() => setSelectedFile(fileName)}
                          className={clsx(
                            "w-full text-left px-4 py-2 text-[9.5px] font-mono transition-colors border-b border-zinc-950/40",
                            isSelected 
                              ? "bg-indigo-500/5 text-indigo-450 font-bold border-r-2 border-indigo-500" 
                              : "text-zinc-650 hover:text-zinc-450"
                          )}
                        >
                          📄 {fileName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Code viewer panel */}
                  <div className="flex-1 p-5 bg-zinc-955 overflow-auto custom-scrollbar select-text text-[9.5px] leading-relaxed">
                    <pre className="text-emerald-400/90 whitespace-pre font-mono">
                      {compiledFiles[selectedFile]}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-600 text-xs font-sans">
                  <Code className="w-8 h-8 opacity-45 mb-2 text-zinc-700 animate-pulse" />
                  <span className="text-[10px]">Compiled configuration files will render here upon successful compilation.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Artifact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#08080b] border border-zinc-900 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-zinc-550 hover:text-zinc-300 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-900/60 pb-4">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                {editingArtifact ? "Edit Registered Artifact" : "Register New Artifact"}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Artifact Name */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] text-zinc-450 font-bold uppercase block">Artifact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Spending Summary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-250 p-3 rounded-xl outline-none w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] text-zinc-455 font-bold uppercase block">Description</label>
                <textarea
                  placeholder="Explain what physical or logical summary/plan this artifact generates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-250 p-3 rounded-xl outline-none w-full font-sans resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-zinc-450 font-bold uppercase block">Artifact Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-250 p-3 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="persistent">Persistent Schema</option>
                    <option value="moment">Moment Alert Trigger</option>
                    <option value="momentum">Momentum Trend Tracker</option>
                  </select>
                </div>

                {/* API Endpoint */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9.5px] text-zinc-450 font-bold uppercase block">API Persistence Endpoint</label>
                  <input
                    type="text"
                    placeholder="https://api.kyfr.internal/..."
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-255 p-3 rounded-xl outline-none w-full"
                  />
                </div>
              </div>

              {/* Status & Schema */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-[9.5px] text-zinc-450 font-bold uppercase block">Lifecycle Status</label>
                  <select
                    value={lifecycleStatus}
                    onChange={(e) => setLifecycleStatus(e.target.value)}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-xs text-zinc-250 p-3 rounded-xl outline-none w-full font-mono"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="deprecated">Deprecated</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9.5px] text-zinc-450 font-bold uppercase block">JSON Schema Contract</label>
                  <textarea
                    placeholder="{}"
                    value={schemaContract}
                    onChange={(e) => setSchemaContract(e.target.value)}
                    rows={6}
                    className="bg-black/40 border border-zinc-900 focus:border-purple-500 text-[10px] text-zinc-300 p-3 rounded-xl outline-none w-full font-mono resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900/60 font-mono">
              <button
                onClick={() => setShowModal(false)}
                className="bg-transparent border border-zinc-900 hover:border-zinc-800 text-zinc-450 hover:text-zinc-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                SAVE ARTIFACT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. DOMAIN STRATEGIES STUDIO WO// ==========================================
// 6. DOMAIN STRATEGIES STUDIO WORKSPACE (REDESIGNED)
// ==========================================

export interface StrategyFamily {
  id: string;
  name: string;
  description: string;
  behavioralDomain: string;
  primaryGoal: string;
  applicableUserStates: string[];
  incompatibleUserStates: string[];
  strategies: string[];
}

export interface Strategy {
  id: string;
  familyId: string;
  name: string;
  description: string;
  intent: string;
  desiredOutcomes: string[];
  bestAppliedWhen: string;
  avoidWhen: string;
  applicableUserStates: string[];
  targetUserStates: string[];
  behavioralPrinciples: string[];
  expectedUserEffects: string[];
  complexity: "Low" | "Medium" | "High";
  interactionStyle: "Implicit" | "Explicit" | "Conversational";
  recommendedFor: string[];
  antiPatterns: string[];
  requiredCapabilities: string[];
  supportedArtifacts: string[];
  governanceConstraints: string[];
  tacticFamilies: string[];
}

export interface TacticFamily {
  id: string;
  strategyId: string;
  name: string;
  description: string;
  purpose: string;
  tactics: string[];
}

export interface Tactic {
  id: string;
  tacticFamilyId: string;
  name: string;
  description: string;
  intent: string;
  behavioralEffect: string;
  bestUsedWhen: string;
  avoidWhen: string;
  expectedInputs: string[];
  expectedOutputs: string[];
  requiredCapabilities: string[];
  producedArtifacts: string[];
  runtimeSemantics: string;
  successSignals: string[];
  failureSignals: string[];
  recoveryBehaviors: string[];
  governanceConstraints: string[];
}

export interface RegistryState {
  families: Record<string, StrategyFamily>;
  strategies: Record<string, Strategy>;
  tacticFamilies: Record<string, TacticFamily>;
  tactics: Record<string, Tactic>;
}

const SEED_FAMILIES = [
  { id: "cognitive_load_management", name: "Cognitive Load Management", domain: "Cognitive", goal: "Minimize cognitive friction and user overload" },
  { id: "trust_building", name: "Trust Building", domain: "Emotional", goal: "Establish system credibility and transparent explanations" },
  { id: "decision_support", name: "Decision Support", domain: "Cognitive", goal: "Facilitate informed decision making and option tradeoffs" },
  { id: "motivation_and_momentum", name: "Motivation & Momentum", domain: "Cognitive", goal: "Reinforce small wins and maintain execution momentum" },
  { id: "exploration_and_discovery", name: "Exploration & Discovery", domain: "Cognitive", goal: "Encourage user discovery of adjacent system capabilities" },
  { id: "onboarding_and_activation", name: "Onboarding & Activation", domain: "Operational", goal: "Accelerate first value realization and setup success" },
  { id: "education_and_learning", name: "Education & Learning", domain: "Cognitive", goal: "Deploy progressive and just-in-time concept education" },
  { id: "emotional_regulation", name: "Emotional Regulation", domain: "Emotional", goal: "Diffuse anxiety and reframe concern into controllable actions" },
  { id: "behavioral_change", name: "Behavioral Change", domain: "Social", goal: "Establish sustainable habit loops and healthy behavior nudges" },
  { id: "retention_and_reengagement", name: "Retention & Reengagement", domain: "Operational", goal: "Prevent drift and re-engage dormant or slipping users" },
  { id: "recovery_and_error_handling", name: "Recovery & Error Handling", domain: "Operational", goal: "Gracefully resolve exceptions and maintain active state" },
  { id: "goal_progression", name: "Goal Progression", domain: "Cognitive", goal: "Guide user through long-term milestone tracking and sub-goals" },
  { id: "urgency_management", name: "Urgency Management", domain: "Operational", goal: "Facilitate rapid resolutions and time-bound action windowing" },
  { id: "personalization_and_adaptation", name: "Personalization & Adaptation", domain: "Agentic", goal: "Adapt experiences to dynamic user profiles and state changes" },
  { id: "execution_guidance", name: "Execution Guidance", domain: "Operational", goal: "Guide user step-by-step through complex transactional executions" },
  { id: "conversational_control", name: "Conversational Control", domain: "Cognitive", goal: "Steer and balance initiative during open dialog flows" },
  { id: "social_and_identity_dynamics", name: "Social & Identity Dynamics", domain: "Social", goal: "Align suggestions with user identity and social proofing" },
  { id: "persuasion_and_conversion", name: "Persuasion & Conversion", domain: "Social", goal: "Frame benefit statements to minimize commitment anxiety" },
  { id: "financial_behavior_guidance", name: "Financial Behavior Guidance", domain: "Financial", goal: "Promote healthy spending limits and savings habits" },
  { id: "agentic_orchestration", name: "Agentic Orchestration", domain: "Agentic", goal: "Enable delegated planning and safe autonomous execution" }
];

const USER_STATES = [
  "confusion", "overload", "hesitation", "anxiety", "distrust",
  "curiosity", "urgency", "low_motivation", "high_intent", "exploration",
  "indecision", "goal_drift", "execution_blocked", "recovery_needed", "confidence_gap",
  "spending_anxiety", "impulse_risk", "budget_pressure", "savings_intent", "transaction_intent"
];

const CAPABILITIES = ["fetch_financial_data", "analyze_spending", "suggest_nudges", "trigger_auth_verification", "chain_api_calls", "persist_state"];
const GOVERNANCE = ["regulatory_compliance", "user_consent_required", "spending_limit_check", "privacy_protection", "transaction_limit_check"];
const ARTIFACTS = ["spending_summary_persistent", "momentum_trend_alert", "budget_health_report", "investment_risk_profile"];

function getRandomStatesForDomain(domain: string, count = 2): string[] {
  switch(domain) {
    case "Cognitive":
      return ["overload", "confusion", "indecision"].slice(0, count);
    case "Emotional":
      return ["anxiety", "distrust", "hesitation"].slice(0, count);
    case "Social":
      return ["curiosity", "low_motivation"].slice(0, count);
    case "Financial":
      return ["spending_anxiety", "impulse_risk", "budget_pressure"].slice(0, count);
    case "Agentic":
      return ["exploration", "indecision"].slice(0, count);
    case "Operational":
      return ["execution_blocked", "recovery_needed"].slice(0, count);
    default:
      return ["confusion", "hesitation"].slice(0, count);
  }
}

function getIncompatibleStatesForDomain(domain: string, count = 1): string[] {
  switch(domain) {
    case "Cognitive":
      return ["high_intent"].slice(0, count);
    case "Emotional":
      return ["curiosity"].slice(0, count);
    case "Financial":
      return ["savings_intent"].slice(0, count);
    default:
      return ["urgency"].slice(0, count);
  }
}

// Custom zero-dependency YAML converter
function jsToYaml(obj: any, indent = 0): string {
  if (obj === null || obj === undefined) return "";
  const spaces = " ".repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return " []\n";
    let yaml = "\n";
    for (const item of obj) {
      if (typeof item === "object") {
        yaml += `${spaces}- ${jsToYaml(item, indent + 2).trimStart()}`;
      } else {
        yaml += `${spaces}- "${String(item).replace(/"/g, '\\"')}"\n`;
      }
    }
    return yaml;
  }
  if (typeof obj === "object") {
    let yaml = "";
    const keys = Object.keys(obj);
    for (const key of keys) {
      const val = obj[key];
      if (val === null || val === undefined) continue;
      if (Array.isArray(val)) {
        yaml += `${spaces}${key}:${jsToYaml(val, indent + 2)}`;
      } else if (typeof val === "object") {
        yaml += `${spaces}${key}:\n${jsToYaml(val, indent + 2)}`;
      } else if (typeof val === "string") {
        yaml += `${spaces}${key}: "${val.replace(/"/g, '\\"')}"\n`;
      } else {
        yaml += `${spaces}${key}: ${val}\n`;
      }
    }
    return yaml;
  }
  return `${spaces}${String(obj)}\n`;
}

function initializeRegistry(): RegistryState {
  const families: Record<string, StrategyFamily> = {};
  const strategies: Record<string, Strategy> = {};
  const tacticFamilies: Record<string, TacticFamily> = {};
  const tactics: Record<string, Tactic> = {};

  SEED_FAMILIES.forEach(f => {
    families[f.id] = {
      id: f.id,
      name: f.name,
      description: `${f.goal}. Supports fine-grained user adaptive routing workflows.`,
      behavioralDomain: f.domain,
      primaryGoal: f.goal,
      applicableUserStates: getRandomStatesForDomain(f.domain, 2),
      incompatibleUserStates: getIncompatibleStatesForDomain(f.domain, 1),
      strategies: []
    };
  });

  const requiredStrategiesDefs: Record<string, { familyId: string, name: string, description: string, intent: string, bestApplied: string, avoid: string, appStates: string[], targetStates: string[], reqTactics: Array<{ id: string, name: string, description: string }> }> = {
    progressive_disclosure: {
      familyId: "cognitive_load_management",
      name: "Progressive Disclosure",
      description: "Sequentially reveal detail only as needed by the user to prevent overload.",
      intent: "Prevent cognitive exhaustion and sensory overload by pacing information presentation.",
      bestApplied: "When complex configurations, extensive data summaries, or multi-step execution flows are presented.",
      avoid: "For simple alerts, low-complexity feedback messages, or critical immediate error warnings.",
      appStates: ["overload", "confusion"],
      targetStates: ["high_intent", "exploration"],
      reqTactics: [
        { id: "reveal_next_step_only", name: "Reveal Next Step Only", description: "Only render the absolute next action in the active workflow, keeping all future steps collapsed." },
        { id: "collapse_secondary_information", name: "Collapse Secondary Information", description: "Automatically hide secondary parameters or advanced settings inside expander panels." },
        { id: "gated_detail_expansion", name: "Gated Detail Expansion", description: "Require explicit user confirmation (e.g. click or hover) to reveal advanced technical documentation." }
      ]
    },
    guided_narrowing: {
      familyId: "cognitive_load_management",
      name: "Guided Narrowing",
      description: "Filter down option sets progressively based on clear user choices.",
      intent: "Reduce decision paralysis by shrinking options down to highly relevant choices.",
      bestApplied: "When selecting investment funds, budget categories, or savings targets with high options count.",
      avoid: "When the user explicitly requests raw unfiltered data searches or advanced queries.",
      appStates: ["overload", "indecision"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "binary_questions", name: "Binary Questions", description: "Format complex decision criteria into simple, conversational yes/no queries." },
        { id: "top_3_selection", name: "Top 3 Selection", description: "Filter the recommendation matrix to present exactly the top 3 best-fit options." },
        { id: "compare_only_two_options", name: "Compare Only Two Options", description: "Allow users to lock and side-by-side compare only two options to avoid comparison fatigue." },
        { id: "eliminate_low_relevance_options", name: "Eliminate Low Relevance Options", description: "Instantly hide options that do not match the primary goal parameters." }
      ]
    },
    chunking: {
      familyId: "cognitive_load_management",
      name: "Information Chunking",
      description: "Break information into small, digestible semantic clusters.",
      intent: "Increase working memory capacity by organizing raw data into logical groups.",
      bestApplied: "When presenting transaction histories, multi-account summaries, or legal disclosures.",
      avoid: "When displaying continuous real-time streaming charts where continuous trends are essential.",
      appStates: ["overload", "confusion"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    simplification: {
      familyId: "cognitive_load_management",
      name: "Simplification",
      description: "Remove non-essential visual elements and complex language structures.",
      intent: "Maximize visual clarity and speed up comprehension.",
      bestApplied: "When user is facing high stress or complexity in transaction reviews.",
      avoid: "In regulatory disclosures where exact legal terminology is mandated by compliance.",
      appStates: ["confusion", "overload"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    prioritization: {
      familyId: "cognitive_load_management",
      name: "Prioritization Strategy",
      description: "Highlight high-impact options and actions visually.",
      intent: "Guide user attention dynamically to the highest ROI tasks.",
      bestApplied: "In goal drift or dashboard states where action list is long.",
      avoid: "When all options are of equal importance or require equal regulatory weight.",
      appStates: ["overload", "goal_drift"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    action_compression: {
      familyId: "cognitive_load_management",
      name: "Action Compression",
      description: "Reduce physical steps or clicks required to complete a task.",
      intent: "Minimize transactional friction and accelerate conversions.",
      bestApplied: "In recurring monthly transfers, safe automated reinvestments.",
      avoid: "For high-risk, irreversible transfers or initial setup choices.",
      appStates: ["hesitation", "low_motivation"],
      targetStates: ["transaction_intent"],
      reqTactics: [
        { id: "prefill_inputs", name: "Prefill Inputs", description: "Pre-populate input form fields using historical pattern analysis." },
        { id: "suggest_defaults", name: "Suggest Defaults", description: "Highlight the recommended or safest default parameters clearly in the UI." },
        { id: "one_tap_execution", name: "One Tap Execution", description: "Provide a direct, one-tap trigger button to execute the pre-configured workflow." }
      ]
    },
    evidence_first: {
      familyId: "trust_building",
      name: "Evidence First",
      description: "Present supporting data, security, and verification metrics upfront.",
      intent: "Mitigate initial skepticism and establish system credibility.",
      bestApplied: "When introducing autonomous planning, external integrations, or high-value transfers.",
      avoid: "When the user is in an extreme urgency state and requires immediate error recovery.",
      appStates: ["distrust", "anxiety"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "show_supporting_data", name: "Show Supporting Data", description: "Display aggregate performance statistics or historical return data upfront." },
        { id: "summarize_key_observations", name: "Summarize Key Observations", description: "Generate a bulleted summary of key data observations supporting the advice." }
      ]
    },
    transparency_explanations: {
      familyId: "trust_building",
      name: "Transparency Explanations",
      description: "Explain the logical 'why' behind system recommendations.",
      intent: "Foster shared understanding and system accountability.",
      bestApplied: "When suggesting portfolio rebalancing or dynamic budget adjustments.",
      avoid: "For simple, trivial user requests where explanations add cognitive noise.",
      appStates: ["distrust", "confusion"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "explain_reasoning", name: "Explain Reasoning", description: "Provide a natural language breakdown of the variables leading to this choice." },
        { id: "explain_tradeoffs", name: "Explain Tradeoffs", description: "State potential downsides or side-effects of this action transparently." },
        { id: "disclose_uncertainty", name: "Disclose Uncertainty", description: "Explicitly communicate boundary limits or standard deviation variables in forecasts." }
      ]
    },
    confidence_scaffolding: {
      familyId: "trust_building",
      name: "Confidence Scaffolding",
      description: "Provide supportive framing and step validation to build confidence.",
      intent: "Empower users who feel under-qualified for complex tasks.",
      bestApplied: "For first-time investors or users configuring long-term retirement budgets.",
      avoid: "For expert power users who find hand-holding paternalistic.",
      appStates: ["confidence_gap", "hesitation"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    expectation_setting: {
      familyId: "trust_building",
      name: "Expectation Setting",
      description: "Clearly state timelines, fees, and next steps before execution.",
      intent: "Prevent post-transaction shock and reduce customer service friction.",
      bestApplied: "For operations with asynchronous completion like ACH bank transfers.",
      avoid: "For instantaneous, synchronous local operations.",
      appStates: ["anxiety", "distrust"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    verification_loops: {
      familyId: "trust_building",
      name: "Verification Loops",
      description: "Require explicit reviews of high-impact parameters.",
      intent: "Establish safety checkpoints to eliminate fat-finger errors.",
      bestApplied: "Before wire transfers, account closures, or automation rule deployments.",
      avoid: "For low-risk actions like editing dashboard layouts or updating notification emails.",
      appStates: ["hesitation", "anxiety"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "ask_confirmation", name: "Ask Confirmation", description: "Render a structured confirmation dialogue displaying critical parameters before committing." }
      ]
    },
    tradeoff_matrixing: {
      familyId: "decision_support",
      name: "Tradeoff Matrixing",
      description: "Compare multiple options side-by-side along dimensions.",
      intent: "Clarify differences between complex financial choices.",
      bestApplied: "When user is choosing between credit cards, insurance plans, or loan repayment terms.",
      avoid: "When a single option is clearly dominant along all relevant dimensions.",
      appStates: ["indecision", "overload"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "side_by_side_options", name: "Side by Side Options", description: "Arrange competing option vectors in columns for comparative inspection." },
        { id: "pros_cons_comparison", name: "Pros & Cons Comparison", description: "Generate a list of structured positive and negative attributes for each choice." }
      ]
    },
    default_recommendation: {
      familyId: "decision_support",
      name: "Default Recommendation",
      description: "Pre-select the safest or most popular path.",
      intent: "Leverage choice architecture to guide users toward high-benefit paths.",
      bestApplied: "For basic auto-savings percentages or safe mutual fund selections.",
      avoid: "For complex estate planning or highly custom tax shelter setups.",
      appStates: ["indecision", "hesitation"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    consequence_projection: {
      familyId: "decision_support",
      name: "Consequence Projection",
      description: "Project outcomes of current options into the long-term future.",
      intent: "Mitigate present bias and encourage long-term planning.",
      bestApplied: "When comparing early retirement savings rates vs current spending.",
      avoid: "When predictive variables are highly volatile or completely unknown.",
      appStates: ["goal_drift", "indecision"],
      targetStates: ["savings_intent"],
      reqTactics: [
        { id: "future_impact_estimation", name: "Future Impact Estimation", description: "Calculate compound growth or loss metrics based on choice vectors and project onto graphs." }
      ]
    },
    scenario_simulation: {
      familyId: "decision_support",
      name: "Scenario Simulation",
      description: "Allow interactive adjustments of variables to see live impacts.",
      intent: "Build mental models of complex systems through sandbox testing.",
      bestApplied: "For simulating home mortgage durations or debt payoff speeds.",
      avoid: "When the calculation engine requires slow batch runs or offline compilation.",
      appStates: ["curiosity", "indecision"],
      targetStates: ["exploration"],
      reqTactics: []
    },
    momentum_reinforcement: {
      familyId: "motivation_and_momentum",
      name: "Momentum Reinforcement",
      description: "Remind user of past progress to encourage continuity.",
      intent: "Leverage the endowed progress effect to maintain habit streaks.",
      bestApplied: "When user reaches 50% of savings goal or completes a streak.",
      avoid: "When user is facing severe financial distress or budget overrun.",
      appStates: ["low_motivation", "goal_drift"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "visualize_progress", name: "Visualize Progress", description: "Render progress bars, timeline highlights, or metric tracking boards." },
        { id: "celebrate_progress", name: "Celebrate Progress", description: "Trigger micro-animations or congratulations badges upon reaching milestones." }
      ]
    },
    small_win_amplification: {
      familyId: "motivation_and_momentum",
      name: "Small Win Amplification",
      description: "Highlight minor positive achievements extensively.",
      intent: "Boost self-efficacy by validating initial micro-steps.",
      bestApplied: "When user links their first bank account or saves their first $10.",
      avoid: "When the user expects deep technical progress summaries and finds minor celebrations patronizing.",
      appStates: ["low_motivation", "confidence_gap"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "suggest_easy_next_step", name: "Suggest Easy Next Step", description: "Propose a quick next action requiring very low mental effort." },
        { id: "provide_quick_wins", name: "Provide Quick Wins", description: "Design task vectors to yield positive, visible status updates within seconds." }
      ]
    },
    progress_visibility: {
      familyId: "motivation_and_momentum",
      name: "Progress Visibility",
      description: "Maintain a prominent, visual representation of goal trajectory.",
      intent: "Increase saliency of long-term milestones.",
      bestApplied: "For retirement timelines, home down-payment trackers, or debt paydowns.",
      avoid: "When user's progress is negative or stagnant, to prevent demotivation.",
      appStates: ["goal_drift", "low_motivation"],
      targetStates: ["savings_intent"],
      reqTactics: []
    },
    exploratory_branching: {
      familyId: "exploration_and_discovery",
      name: "Exploratory Branching",
      description: "Provide safe, low-commitment exploration paths.",
      intent: "Encourage user-directed learning without affecting core data states.",
      bestApplied: "For simulating alternative investment portfolio compositions.",
      avoid: "During hard transactional checks where execution correctness is paramount.",
      appStates: ["curiosity", "exploration"],
      targetStates: ["exploration"],
      reqTactics: []
    },
    adjacent_recommendation: {
      familyId: "exploration_and_discovery",
      name: "Adjacent Recommendation",
      description: "Suggest related tools and capabilities based on context.",
      intent: "Cross-promote functional primitives to solve compound problems.",
      bestApplied: "When user finishes creating a budget, recommend automated savings rules.",
      avoid: "When user is already experiencing heavy cognitive overload.",
      appStates: ["exploration", "curiosity"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    first_value_acceleration: {
      familyId: "onboarding_and_activation",
      name: "First Value Acceleration",
      description: "Minimize time-to-first-value during initial sessions.",
      intent: "Deliver immediate utility to prevent early dropout.",
      bestApplied: "During the first 2 minutes of a user's sign-up session.",
      avoid: "When regulatory compliance requires extensive verification before any value can be shown.",
      appStates: ["hesitation", "low_motivation"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    guided_setup: {
      familyId: "onboarding_and_activation",
      name: "Guided Setup",
      description: "Scaffold initial account configuration step-by-step.",
      intent: "Ensure correct system configuration and build setup confidence.",
      bestApplied: "When user is linking external banks, establishing budgets, or selecting default settings.",
      avoid: "For simple single-form onboarding updates.",
      appStates: ["confusion", "hesitation"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "scaffold_initial_actions", name: "Scaffold Initial Actions", description: "Guide the user step-by-step through configuring their initial profile parameters." }
      ]
    },
    layered_education: {
      familyId: "education_and_learning",
      name: "Layered Education",
      description: "Provide basic explanations with nested, optional deep-dives.",
      intent: "Support both novice comprehension and expert validation.",
      bestApplied: "When explaining tax implications, asset allocations, or regulatory rules.",
      avoid: "When displaying immediate warning alerts or simple transaction receipts.",
      appStates: ["confusion", "curiosity"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "simplify_explanations", name: "Simplify Explanations", description: "Translate technical jargon into simple, natural language terms." },
        { id: "provide_examples", name: "Provide Examples", description: "Illustrate complex concepts using concrete, hypothetical user scenarios." }
      ]
    },
    just_in_time_learning: {
      familyId: "education_and_learning",
      name: "Just in Time Learning",
      description: "Deliver small, hyper-relevant learning bites precisely at friction points.",
      intent: "Explain mechanisms only when the user is actively using them.",
      bestApplied: "Next to complex dropdowns, risk sliders, or transaction buttons.",
      avoid: "As a massive initial help center file that users must read beforehand.",
      appStates: ["confusion", "hesitation"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    reassurance: {
      familyId: "emotional_regulation",
      name: "Reassurance Strategy",
      description: "Validate safety parameters and offer calming contextual feedback.",
      intent: "Alleviate temporary user stress and anxiety.",
      bestApplied: "Immediately after market volatility drops or when a transaction is pending.",
      avoid: "When a real security breach occurs, to prevent false security feelings.",
      appStates: ["anxiety", "spending_anxiety"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    anxiety_diffusion: {
      familyId: "emotional_regulation",
      name: "Anxiety Diffusion",
      description: "Refocus anxious energy onto small, controllable operations.",
      intent: "De-escalate panic reactions by anchoring on solvable actions.",
      bestApplied: "During market drops or after a budget limit warning is triggered.",
      avoid: "When immediate, major technical recovery actions are mandatory.",
      appStates: ["anxiety", "spending_anxiety"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "normalize_concern", name: "Normalize Concern", description: "Reassure the user that their concern is typical and structurally solvable." },
        { id: "focus_on_controllables", name: "Focus on Controllables", description: "Redirect visual focus from external macro-variables to immediate micro-tasks." }
      ]
    },
    emotional_reframing: {
      familyId: "emotional_regulation",
      name: "Emotional Reframing",
      description: "Frame financial events as learning iterations or long-term growth phases.",
      intent: "Help users view short-term setbacks as manageable data points.",
      bestApplied: "When a user fails to meet a monthly savings goal or overspends slightly.",
      avoid: "When the user is facing extreme, systematic financial distress.",
      appStates: ["anxiety", "goal_drift"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    habit_formation: {
      familyId: "behavioral_change",
      name: "Habit Formation",
      description: "Establish strong, repeatable prompt-action-reward loops.",
      intent: "Automate healthy long-term financial routines.",
      bestApplied: "For setting up weekly micro-savings or automated round-ups.",
      avoid: "For irregular, one-off large transactions.",
      appStates: ["low_motivation", "goal_drift"],
      targetStates: ["savings_intent"],
      reqTactics: []
    },
    nudge_based_guidance: {
      familyId: "behavioral_change",
      name: "Nudge-based Guidance",
      description: "Inject small, non-coercive prompts at critical decision times.",
      intent: "Gently push users toward pre-configured goals.",
      bestApplied: "When a salary deposit is detected, or at the start of a weekend.",
      avoid: "For spamming users with constant notifications, preventing banner blindness.",
      appStates: ["goal_drift", "low_motivation"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "contextual_nudges", name: "Contextual Nudges", description: "Render tiny, context-aware tips or status cards directly within relevant workspace flows." }
      ]
    },
    trigger_awareness: {
      familyId: "behavioral_change",
      name: "Trigger Awareness",
      description: "Help users identify the environmental triggers causing impulse spending.",
      intent: "Increase self-awareness at critical impulse points.",
      bestApplied: "When transaction history flags repeated late-night impulse buys.",
      avoid: "For users with excellent spending discipline who do not require behavioral monitoring.",
      appStates: ["impulse_risk", "spending_anxiety"],
      targetStates: ["budget_pressure"],
      reqTactics: []
    },
    recovery_reframing: {
      familyId: "recovery_and_error_handling",
      name: "Recovery Reframing",
      description: "Present system exceptions as straightforward, actionable recovery routes.",
      intent: "Convert technical errors into positive problem-solving flows.",
      bestApplied: "When credit card links fail, or bank auth expires.",
      avoid: "When systematic API downtime is unrecoverable, where honest system outage warnings are required.",
      appStates: ["recovery_needed", "execution_blocked"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    graceful_failure_handling: {
      familyId: "recovery_and_error_handling",
      name: "Graceful Failure Handling",
      description: "Preemptively catch failures and suggest instant next best actions.",
      intent: "Maintain user trust and continuity during systemic outages.",
      bestApplied: "When a transaction fails validation checks or external APIs error out.",
      avoid: "For minor display glitches where normal UI fallbacks suffice.",
      appStates: ["recovery_needed", "execution_blocked"],
      targetStates: ["confidence_gap"],
      reqTactics: [
        { id: "explain_failure_clearly", name: "Explain Failure Clearly", description: "Translate technical API error schemas into helpful natural language explanations." },
        { id: "suggest_next_best_action", name: "Suggest Next Best Action", description: "Recommend an alternate, immediate action to bypass or repair the failure." },
        { id: "preserve_user_progress", name: "Preserve User Progress", description: "Retain all user inputs in the client-side state so they can re-attempt the task instantly." }
      ]
    },
    milestone_tracking: {
      familyId: "goal_progression",
      name: "Milestone Tracking",
      description: "Subdivide large objectives into discrete, visual subgoals.",
      intent: "Maintain progress salience across long timelines.",
      bestApplied: "For goals extending beyond 3 months, like emergency fund accumulation.",
      avoid: "For ultra-short term transfers or simple single-payee configurations.",
      appStates: ["goal_drift", "low_motivation"],
      targetStates: ["savings_intent"],
      reqTactics: [
        { id: "estimate_time_to_goal", name: "Estimate Time to Goal", description: "Perform dynamic trend calculations to show when the user will achieve their objective." },
        { id: "break_large_goal_into_steps", name: "Break Large Goal Into Steps", description: "Automatically split a major goal into 3-5 manageable, sequential checkpoints." }
      ]
    },
    adaptive_goaling: {
      familyId: "goal_progression",
      name: "Adaptive Goaling",
      description: "Dynamically adjust subgoal sizes based on historical user performance.",
      intent: "Ensure target feasibility to prevent user discouragement.",
      bestApplied: "When a user consistently misses or exceeds their monthly budget goals.",
      avoid: "When fixed external constraints (e.g. debt repayment schedules) cannot be changed.",
      appStates: ["goal_drift", "indecision"],
      targetStates: ["savings_intent"],
      reqTactics: []
    },
    deterministic_execution: {
      familyId: "urgency_management",
      name: "Deterministic Execution",
      description: "Guarantee transaction completion along a strict, predictable path.",
      intent: "Diffuse anxiety in critical, time-bound financial situations.",
      bestApplied: "For late rent payments, margin call coverages, or immediate overdraft preventions.",
      avoid: "For low-priority, long-term wealth accumulations.",
      appStates: ["urgency", "anxiety"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    rapid_resolution: {
      familyId: "urgency_management",
      name: "Rapid Resolution",
      description: "Suppress secondary options and reviews to prioritize instant action.",
      intent: "Resolve urgent blockers with absolute speed.",
      bestApplied: "When a user's account is locked or a fraud warning requires instant resolution.",
      avoid: "When high-risk, large-sum transfers require strict, deliberate verification.",
      appStates: ["urgency", "overload"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "prioritize_action_over_exploration", name: "Prioritize Action Over Exploration", description: "Hide cross-promotional sidebar components and secondary links to keep attention locked." },
        { id: "shortcut_confirmation", name: "Shortcut Confirmation", description: "Bypass secondary verification reviews if security thresholds are fully met." }
      ]
    },
    checkpointing: {
      familyId: "personalization_and_adaptation",
      name: "Checkpointing Strategy",
      description: "Automatically save rich state snapshots during complex tasks.",
      intent: "Allow users to resume long setup sequences across devices.",
      bestApplied: "For multi-stage configurations like estate planning or investment profiling.",
      avoid: "For simple actions that require under 15 seconds to complete.",
      appStates: ["overload", "hesitation"],
      targetStates: ["confidence_gap"],
      reqTactics: []
    },
    ambiguity_resolution: {
      familyId: "personalization_and_adaptation",
      name: "Ambiguity Resolution",
      description: "Prompt clarify loops when user inputs contain semantic conflict.",
      intent: "Ensure absolute alignment between user intent and system execution.",
      bestApplied: "When user's text requests contradict their configured system safety thresholds.",
      avoid: "When user intent is clear and fits structured API parameters perfectly.",
      appStates: ["confusion", "indecision"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "summarize_understanding", name: "Summarize Understanding", description: "Rephrase and echo the user's request, asking for instant confirmation of system comprehension." }
      ]
    },
    spending_awareness: {
      familyId: "financial_behavior_guidance",
      name: "Spending Awareness",
      description: "Increase cognitive visibility of daily spending categories.",
      intent: "Reduce mindless spending through real-time feedback loops.",
      bestApplied: "When a user's weekly transaction volume spikes significantly.",
      avoid: "When a user is actively dealing with severe spending anxiety, to prevent panic.",
      appStates: ["spending_anxiety", "impulse_risk"],
      targetStates: ["budget_pressure"],
      reqTactics: [
        { id: "spending_limit_alerts", name: "Spending Limit Alerts", description: "Trigger proactive warning flags when current transaction pushes spending near limits." },
        { id: "identify_spending_patterns", name: "Identify Spending Patterns", description: "Categorize recurring impulse expenditures and present trends clearly in the workspace." }
      ]
    },
    impulse_control: {
      familyId: "financial_behavior_guidance",
      name: "Impulse Control",
      description: "Introduce small, friction checkpoints at shopping trigger times.",
      intent: "Create a cooling-off window between impulse triggers and transactional actions.",
      bestApplied: "During late-night shopping hours or at high-risk merchant categories.",
      avoid: "For recurring utility payments, investments, or debt paydowns.",
      appStates: ["impulse_risk", "spending_anxiety"],
      targetStates: ["budget_pressure"],
      reqTactics: []
    },
    budget_alignment: {
      familyId: "financial_behavior_guidance",
      name: "Budget Alignment",
      description: "Evaluate transactional intentions against configured monthly budget limits.",
      intent: "Maintain strict user adherence to their long-term budget commitments.",
      bestApplied: "When user is proposing a purchase that exceeds categories allocations.",
      avoid: "When a purchase is categorized as an emergency or critical health expense.",
      appStates: ["budget_pressure", "spending_anxiety"],
      targetStates: ["savings_intent"],
      reqTactics: [
        { id: "compare_to_budget", name: "Compare to Budget", description: "Generate a visual comparison chart of monthly budget allocations vs current spending." },
        { id: "suggest_savings_opportunities", name: "Suggest Savings Opportunities", description: "Recommend specific minor cost reductions based on transaction insights." }
      ]
    },
    autonomous_task_execution: {
      familyId: "agentic_orchestration",
      name: "Autonomous Task Execution",
      description: "Delegate sequential financial operations to backend agents safely.",
      intent: "Automate complex optimizations without user hand-holding.",
      bestApplied: "For tax-loss harvesting, automated savings sweeping, or subscription cancellations.",
      avoid: "When the execution parameters involve significant financial risk and variable thresholds.",
      appStates: ["high_intent", "exploration"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "auto_chain_capabilities", name: "Auto Chain Capabilities", description: "Sequentially chain multiple backend tools and API endpoints to fulfill complex requests." },
        { id: "persist_intermediate_artifacts", name: "Persist Intermediate Artifacts", description: "Save full transactional state records at each step of the autonomous chain." }
      ]
    },
    delegated_planning: {
      familyId: "agentic_orchestration",
      name: "Delegated Planning",
      description: "Allow system agents to compose proposed plans for user review.",
      intent: "Co-create customized financial action plans efficiently.",
      bestApplied: "For structuring mortgage paydown paths or investment strategies.",
      avoid: "For immediate, single-step operations.",
      appStates: ["exploration", "indecision"],
      targetStates: ["high_intent"],
      reqTactics: []
    },
    proactive_assistance: {
      familyId: "agentic_orchestration",
      name: "Proactive Assistance",
      description: "Predict next user needs and prepare workspaces pre-emptively.",
      intent: "Exceed user expectations by presenting solutions before blockers occur.",
      bestApplied: "When a recurring bill value increases or bank link needs re-verification.",
      avoid: "When the proactive suggestion is highly invasive or irrelevant to current state.",
      appStates: ["goal_drift", "hesitation"],
      targetStates: ["high_intent"],
      reqTactics: [
        { id: "resume_interrupted_workflows", name: "Resume Interrupted Workflows", description: "Detect uncompleted forms and prompt the user to continue where they left off." },
        { id: "infer_missing_parameters", name: "Infer Missing Parameters", description: "Deduce unstated input values based on semantic similarity to past user patterns." }
      ]
    }
  };

  Object.keys(requiredStrategiesDefs).forEach(strategyId => {
    const sDef = requiredStrategiesDefs[strategyId];
    strategies[strategyId] = {
      id: strategyId,
      familyId: sDef.familyId,
      name: sDef.name,
      description: sDef.description,
      intent: sDef.intent,
      desiredOutcomes: ["Optimize operational safety", "Accelerate task completion", "Minimize user friction"],
      bestAppliedWhen: sDef.bestApplied,
      avoidWhen: sDef.avoid,
      applicableUserStates: sDef.appStates,
      targetUserStates: sDef.targetStates,
      behavioralPrinciples: ["Saliency Effect", "Choice Architecture", "Loss Aversion"],
      expectedUserEffects: ["Reduced sensory overload", "Increased action commitment", "Enhanced control feelings"],
      complexity: "Medium",
      interactionStyle: "Implicit",
      recommendedFor: ["High-intent users", "Overloaded users"],
      antiPatterns: ["Forcing excessive confirmation gates"],
      requiredCapabilities: [CAPABILITIES[0], CAPABILITIES[1]],
      supportedArtifacts: [ARTIFACTS[0]],
      governanceConstraints: [GOVERNANCE[0]],
      tacticFamilies: []
    };

    families[sDef.familyId].strategies.push(strategyId);

    const tf1Id = `${strategyId}_tf_primary`;
    const tf1Name = `${sDef.name} Primary Tactic Family`;
    const tf1Desc = `Primary execution mechanisms for the ${sDef.name} strategy.`;
    const tf1Purpose = `Fulfill essential UI and behavior prompts for ${sDef.name}.`;

    const tf1Tactics: string[] = [];
    sDef.reqTactics.forEach((tDef) => {
      const tId = tDef.id;
      tactics[tId] = {
        id: tId,
        tacticFamilyId: tf1Id,
        name: tDef.name,
        description: tDef.description,
        intent: `Facilitate the core goal of ${sDef.name} through direct UI execution.`,
        behavioralEffect: `Increases action processing speed by reducing cognitive load steps.`,
        bestUsedWhen: `When user experiences ${sDef.appStates[0] || 'overload'}.`,
        avoidWhen: `When user explicitly requests complete unfiltered parameter details.`,
        expectedInputs: ["User state profile data", "Active workspace view parameters"],
        expectedOutputs: ["Filtered UI layout node", "Update interaction state record"],
        requiredCapabilities: [CAPABILITIES[2]],
        producedArtifacts: [ARTIFACTS[1]],
        runtimeSemantics: `Renders custom React overlay, updates layout states, registers click listener, sweeps state.`,
        successSignals: ["Click-through rate above 40%", "Action completion under 20 seconds"],
        failureSignals: ["User collapses parent card immediately", "Workflow abandoned at this gate"],
        recoveryBehaviors: ["Revert layout view to basic list", "Suggest natural language explanation modal"],
        governanceConstraints: [GOVERNANCE[1]]
      };
      tf1Tactics.push(tId);
    });

    let padCount = 1;
    while (tf1Tactics.length < 3) {
      const tId = `${strategyId}_t_primary_pad_${padCount}`;
      const tName = `${sDef.name} Primary Execution Tactic ${padCount}`;
      tactics[tId] = {
        id: tId,
        tacticFamilyId: tf1Id,
        name: tName,
        description: `Themed programmatic mechanism to support the execution of ${sDef.name}.`,
        intent: `Execute secondary actions supporting ${sDef.name}.`,
        behavioralEffect: `Reduces cognitive friction by providing clear interface support.`,
        bestUsedWhen: sDef.bestApplied,
        avoidWhen: sDef.avoid,
        expectedInputs: ["Client workspace parameters"],
        expectedOutputs: ["Successful layout state update"],
        requiredCapabilities: [CAPABILITIES[1]],
        producedArtifacts: [],
        runtimeSemantics: `Evaluates parameter inputs, updates visual components dynamically, registers interaction event logs.`,
        successSignals: ["Completed interaction"],
        failureSignals: ["Interaction timeout"],
        recoveryBehaviors: ["Fallback to standard dialog options"],
        governanceConstraints: []
      };
      tf1Tactics.push(tId);
      padCount++;
    }

    tacticFamilies[tf1Id] = {
      id: tf1Id,
      strategyId: strategyId,
      name: tf1Name,
      description: tf1Desc,
      purpose: tf1Purpose,
      tactics: tf1Tactics
    };
    strategies[strategyId].tacticFamilies.push(tf1Id);

    const tf2Id = `${strategyId}_tf_secondary`;
    const tf2Name = `${sDef.name} Support Tactic Family`;
    const tf2Desc = `Supporting and adaptive mechanisms for the ${sDef.name} strategy.`;
    const tf2Purpose = `Provide secondary fallbacks, feedback loops, and personalization adapters for ${sDef.name}.`;

    const tf2Tactics: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const tId = `${strategyId}_t_secondary_${i}`;
      const tName = `${sDef.name} Adaptive Support Tactic ${i}`;
      tactics[tId] = {
        id: tId,
        tacticFamilyId: tf2Id,
        name: tName,
        description: `Highly responsive support tactic that adapts the ${sDef.name} workflow based on live interaction.`,
        intent: `Provide contextual support during ${sDef.name} interactions.`,
        behavioralEffect: `Nudges the user toward completing the selected goal by clarifying inputs.`,
        bestUsedWhen: `When user spends more than 15 seconds reviewing options.`,
        avoidWhen: `When user is proceeding rapidly through the steps.`,
        expectedInputs: ["User state telemetry", "Form fields data"],
        expectedOutputs: ["Context tooltip card", "Dynamic default parameters"],
        requiredCapabilities: [CAPABILITIES[3]],
        producedArtifacts: [],
        runtimeSemantics: `Monitors scroll depth and idle durations, renders visual highlights near unresolved items.`,
        successSignals: ["User hovers/clicks tooltip", "Successful form validation"],
        failureSignals: ["User ignores hint", "Workflow closed without save"],
        recoveryBehaviors: ["Suppress further hints for 5 minutes", "Trigger voice guide option"],
        governanceConstraints: [GOVERNANCE[3]]
      };
      tf2Tactics.push(tId);
    }

    tacticFamilies[tf2Id] = {
      id: tf2Id,
      strategyId: strategyId,
      name: tf2Name,
      description: tf2Desc,
      purpose: tf2Purpose,
      tactics: tf2Tactics
    };
    strategies[strategyId].tacticFamilies.push(tf2Id);
  });

  SEED_FAMILIES.forEach(fam => {
    const currentStrategies = families[fam.id].strategies;
    let padIndex = 1;
    while (currentStrategies.length < 5) {
      const strategyId = `${fam.id}_strategy_pad_${padIndex}`;
      const strategyName = `${fam.name} Adaptive Method ${padIndex}`;
      const strategyDesc = `Adaptive dynamic overlay that implements a specialized method for ${fam.name.toLowerCase()} in financial contexts.`;

      strategies[strategyId] = {
        id: strategyId,
        familyId: fam.id,
        name: strategyName,
        description: strategyDesc,
        intent: `Optimize behavioral outcomes related to ${fam.name.toLowerCase()}.`,
        desiredOutcomes: ["Improve operational speed by 10%", "Decrease error rates", "Enhance visual path clarity"],
        bestAppliedWhen: `When user requires assistance with ${fam.name.toLowerCase()} during transaction steps.`,
        avoidWhen: `When user context exhibits conflicting state profiles.`,
        applicableUserStates: getRandomStatesForDomain(fam.domain, 2),
        targetUserStates: getRandomStatesForDomain(fam.domain, 1),
        behavioralPrinciples: ["Framing Effect", "Status Quo Bias"],
        expectedUserEffects: ["Clarity of intent", "Accelerated progression"],
        complexity: "Medium",
        interactionStyle: "Implicit",
        recommendedFor: ["Active users"],
        antiPatterns: ["Spamming tips"],
        requiredCapabilities: [CAPABILITIES[1], CAPABILITIES[4]],
        supportedArtifacts: [],
        governanceConstraints: [],
        tacticFamilies: []
      };

      currentStrategies.push(strategyId);

      for (let j = 1; j <= 2; j++) {
        const tfId = `${strategyId}_tf_${j}`;
        const tfName = `${strategyName} Component Family ${j}`;
        const tfDesc = `Component tactics designed to implement ${strategyName}.`;
        const tfPurpose = `Provide distinct operational vectors to execute ${strategyName}.`;

        const tfTactics: string[] = [];
        for (let k = 1; k <= 3; k++) {
          const tId = `${strategyId}_t_${j}_${k}`;
          const tName = `${strategyName} Execution Tactic ${j}.${k}`;
          tactics[tId] = {
            id: tId,
            tacticFamilyId: tfId,
            name: tName,
            description: `Procedural interaction node that executes specialized UI prompts or triggers.`,
            intent: `Execute prompt behaviors supporting ${strategyName}.`,
            behavioralEffect: `Reduces dropoffs at critical transaction friction points.`,
            bestUsedWhen: `When current transaction requires immediate behavioral steering.`,
            avoidWhen: `When user shows extreme confidence and fast movement.`,
            expectedInputs: ["Interaction parameters"],
            expectedOutputs: ["Workspace state modification"],
            requiredCapabilities: [CAPABILITIES[5]],
            producedArtifacts: [],
            runtimeSemantics: `Programmatically updates component configuration maps and schedules notifications.`,
            successSignals: ["User commits step successfully"],
            failureSignals: ["Validation error triggered"],
            recoveryBehaviors: ["Re-prompt with safe defaults"],
            governanceConstraints: []
          };
          tfTactics.push(tId);
        }

        tacticFamilies[tfId] = {
          id: tfId,
          strategyId: strategyId,
          name: tfName,
          description: tfDesc,
          purpose: tfPurpose,
          tactics: tfTactics
        };
        strategies[strategyId].tacticFamilies.push(tfId);
      }

      padIndex++;
    }
  });

  return { families, strategies, tacticFamilies, tactics };
}

function compileExportFiles(registry: RegistryState): Record<string, string> {
  const version = "1.0.0";
  const compiled_at = new Date().toISOString();

  const strategy_families = jsToYaml({
    version,
    compiled_at,
    strategy_families: Object.values(registry.families).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      behavioral_domain: f.behavioralDomain,
      primary_goal: f.primaryGoal,
      applicable_user_states: f.applicableUserStates,
      incompatible_user_states: f.incompatibleUserStates
    }))
  });

  const strategies = jsToYaml({
    version,
    compiled_at,
    strategies: Object.values(registry.strategies).map(s => ({
      id: s.id,
      family_id: s.familyId,
      name: s.name,
      description: s.description,
      intent: s.intent,
      desired_outcomes: s.desiredOutcomes,
      best_applied_when: s.bestAppliedWhen,
      avoid_when: s.avoidWhen,
      applicable_user_states: s.applicableUserStates,
      target_user_states: s.targetUserStates,
      behavioral_principles: s.behavioralPrinciples,
      expected_user_effects: s.expectedUserEffects,
      complexity: s.complexity,
      interaction_style: s.interactionStyle,
      recommended_for: s.recommendedFor,
      anti_patterns: s.antiPatterns,
      required_capabilities: s.requiredCapabilities,
      supported_artifacts: s.supportedArtifacts,
      governance_constraints: s.governanceConstraints
    }))
  });

  const tactic_families = jsToYaml({
    version,
    compiled_at,
    tactic_families: Object.values(registry.tacticFamilies).map(tf => ({
      id: tf.id,
      strategy_id: tf.strategyId,
      name: tf.name,
      description: tf.description,
      purpose: tf.purpose
    }))
  });

  const tactics = jsToYaml({
    version,
    compiled_at,
    tactics: Object.values(registry.tactics).map(t => ({
      id: t.id,
      tactic_family_id: t.tacticFamilyId,
      name: t.name,
      description: t.description,
      intent: t.intent,
      behavioral_effect: t.behavioralEffect,
      best_used_when: t.bestUsedWhen,
      avoid_when: t.avoidWhen,
      expected_inputs: t.expectedInputs,
      expected_outputs: t.expectedOutputs,
      required_capabilities: t.requiredCapabilities,
      produced_artifacts: t.producedArtifacts,
      runtime_semantics: t.runtimeSemantics,
      success_signals: t.successSignals,
      failure_signals: t.failureSignals,
      recovery_behaviors: t.recoveryBehaviors,
      governance_constraints: t.governanceConstraints
    }))
  });

  const state_strategy_mappings_data: Record<string, { applicable_strategies: string[], target_strategies: string[], incompatible_strategies: string[] }> = {};
  USER_STATES.forEach(state => {
    state_strategy_mappings_data[state] = {
      applicable_strategies: [],
      target_strategies: [],
      incompatible_strategies: []
    };
  });
  Object.values(registry.strategies).forEach(s => {
    (s.applicableUserStates || []).forEach(st => {
      if (state_strategy_mappings_data[st]) state_strategy_mappings_data[st].applicable_strategies.push(s.id);
    });
    (s.targetUserStates || []).forEach(st => {
      if (state_strategy_mappings_data[st]) state_strategy_mappings_data[st].target_strategies.push(s.id);
    });
  });
  Object.values(registry.families).forEach(fam => {
    (fam.incompatibleUserStates || []).forEach(st => {
      if (state_strategy_mappings_data[st]) {
        fam.strategies.forEach(sId => {
          if (!state_strategy_mappings_data[st].incompatible_strategies.includes(sId)) {
            state_strategy_mappings_data[st].incompatible_strategies.push(sId);
          }
        });
      }
    });
  });
  const state_strategy_mappings = jsToYaml({
    version,
    compiled_at,
    state_strategy_mappings: state_strategy_mappings_data
  });

  const strategy_tactic_mappings_data: Record<string, any> = {};
  Object.values(registry.strategies).forEach(s => {
    strategy_tactic_mappings_data[s.id] = {
      name: s.name,
      tactic_families: s.tacticFamilies.map(tfId => {
        const tf = registry.tacticFamilies[tfId];
        return {
          id: tfId,
          name: tf ? tf.name : "Unknown",
          tactics: tf ? tf.tactics.map(tId => {
            const t = registry.tactics[tId];
            return {
              id: tId,
              name: t ? t.name : "Unknown"
            };
          }) : []
        };
      })
    };
  });
  const strategy_tactic_mappings = jsToYaml({
    version,
    compiled_at,
    strategy_tactic_mappings: strategy_tactic_mappings_data
  });

  const capability_dependencies_data: Record<string, { required_capabilities: string[], dependents: string[] }> = {};
  CAPABILITIES.forEach(cap => {
    capability_dependencies_data[cap] = {
      required_capabilities: [cap],
      dependents: []
    };
  });
  Object.values(registry.strategies).forEach(s => {
    s.requiredCapabilities.forEach(cap => {
      if (capability_dependencies_data[cap]) capability_dependencies_data[cap].dependents.push(`strategy:${s.id}`);
    });
  });
  Object.values(registry.tactics).forEach(t => {
    t.requiredCapabilities.forEach(cap => {
      if (capability_dependencies_data[cap]) capability_dependencies_data[cap].dependents.push(`tactic:${t.id}`);
    });
  });
  const capability_dependencies = jsToYaml({
    version,
    compiled_at,
    capability_dependencies: capability_dependencies_data
  });

  const governance_constraints_data: Record<string, { applied_governance_rules: string[], constrained_nodes: string[] }> = {};
  GOVERNANCE.forEach(gov => {
    governance_constraints_data[gov] = {
      applied_governance_rules: [gov],
      constrained_nodes: []
    };
  });
  Object.values(registry.strategies).forEach(s => {
    s.governanceConstraints.forEach(gov => {
      if (governance_constraints_data[gov]) governance_constraints_data[gov].constrained_nodes.push(`strategy:${s.id}`);
    });
  });
  Object.values(registry.tactics).forEach(t => {
    t.governanceConstraints.forEach(gov => {
      if (governance_constraints_data[gov]) governance_constraints_data[gov].constrained_nodes.push(`tactic:${t.id}`);
    });
  });
  const governance_constraints = jsToYaml({
    version,
    compiled_at,
    governance_constraints: governance_constraints_data
  });

  return {
    strategy_families,
    strategies,
    tactic_families,
    tactics,
    state_strategy_mappings,
    strategy_tactic_mappings,
    capability_dependencies,
    governance_constraints
  };
}

export function DomainStrategies() {
  const [registry, setRegistry] = useState<RegistryState>(() => initializeRegistry());
  const [selectedId, setSelectedId] = useState<string | null>("progressive_disclosure");
  const [selectedType, setSelectedType] = useState<"family" | "strategy" | "tactic_family" | "tactic" | null>("strategy");
  
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "cognitive_load_management": true,
    "progressive_disclosure": true
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterCapability, setFilterCapability] = useState("");
  const [filterRisk, setFilterRisk] = useState("");

  const [showAddModal, setShowAddModal] = useState<"family" | "strategy" | "tactic_family" | "tactic" | null>(null);
  const [parentSelectionId, setParentSelectionId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    id: "",
    name: "",
    description: "",
    domain: "Cognitive",
    primaryGoal: "",
    purpose: "",
    intent: "",
    bestAppliedWhen: "",
    avoidWhen: "",
    complexity: "Medium" as "Low" | "Medium" | "High",
    interactionStyle: "Implicit" as "Implicit" | "Explicit" | "Conversational",
    runtimeSemantics: ""
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportActiveTab, setExportActiveTab] = useState("strategy_families");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [editingNode, setEditingNode] = useState<any>(null);

  useEffect(() => {
    if (!selectedId || !selectedType) {
      setEditingNode(null);
      return;
    }
    if (selectedType === "family") {
      setEditingNode(registry.families[selectedId] ? { ...registry.families[selectedId] } : null);
    } else if (selectedType === "strategy") {
      setEditingNode(registry.strategies[selectedId] ? { ...registry.strategies[selectedId] } : null);
    } else if (selectedType === "tactic_family") {
      setEditingNode(registry.tacticFamilies[selectedId] ? { ...registry.tacticFamilies[selectedId] } : null);
    } else if (selectedType === "tactic") {
      setEditingNode(registry.tactics[selectedId] ? { ...registry.tactics[selectedId] } : null);
    }
  }, [selectedId, selectedType, registry]);

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNode = () => {
    if (!editingNode || !selectedId || !selectedType) return;
    
    setRegistry(prev => {
      const next = {
        families: { ...prev.families },
        strategies: { ...prev.strategies },
        tacticFamilies: { ...prev.tacticFamilies },
        tactics: { ...prev.tactics }
      };

      if (selectedType === "family") {
        next.families[selectedId] = { ...editingNode };
      } else if (selectedType === "strategy") {
        const oldStr = prev.strategies[selectedId];
        const newFamId = editingNode.familyId;
        if (oldStr && oldStr.familyId !== newFamId) {
          const oldFam = next.families[oldStr.familyId];
          if (oldFam) {
            oldFam.strategies = oldFam.strategies.filter(sId => sId !== selectedId);
          }
          const newFam = next.families[newFamId];
          if (newFam) {
            newFam.strategies.push(selectedId);
          }
        }
        next.strategies[selectedId] = { ...editingNode };
      } else if (selectedType === "tactic_family") {
        const oldTf = prev.tacticFamilies[selectedId];
        const newStrId = editingNode.strategyId;
        if (oldTf && oldTf.strategyId !== newStrId) {
          const oldStr = next.strategies[oldTf.strategyId];
          if (oldStr) {
            oldStr.tacticFamilies = oldStr.tacticFamilies.filter(tfId => tfId !== selectedId);
          }
          const newStr = next.strategies[newStrId];
          if (newStr) {
            newStr.tacticFamilies.push(selectedId);
          }
        }
        next.tacticFamilies[selectedId] = { ...editingNode };
      } else if (selectedType === "tactic") {
        const oldT = prev.tactics[selectedId];
        const newTfId = editingNode.tacticFamilyId;
        if (oldT && oldT.tacticFamilyId !== newTfId) {
          const oldTf = next.tacticFamilies[oldT.tacticFamilyId];
          if (oldTf) {
            oldTf.tactics = oldTf.tactics.filter(tId => tId !== selectedId);
          }
          const newTf = next.tacticFamilies[newTfId];
          if (newTf) {
            newTf.tactics.push(selectedId);
          }
        }
        next.tactics[selectedId] = { ...editingNode };
      }

      return next;
    });

    showToast("Changes saved successfully.");
  };

  const handleDeleteNode = (id: string, type: "family" | "strategy" | "tactic_family" | "tactic") => {
    setRegistry(prev => {
      const next = {
        families: { ...prev.families },
        strategies: { ...prev.strategies },
        tacticFamilies: { ...prev.tacticFamilies },
        tactics: { ...prev.tactics }
      };

      if (type === "family") {
        const f = next.families[id];
        if (f) {
          f.strategies.forEach(sId => {
            const s = next.strategies[sId];
            if (s) {
              s.tacticFamilies.forEach(tfId => {
                const tf = next.tacticFamilies[tfId];
                if (tf) {
                  tf.tactics.forEach(tId => { delete next.tactics[tId]; });
                  delete next.tacticFamilies[tfId];
                }
              });
              delete next.strategies[sId];
            }
          });
          delete next.families[id];
        }
      } else if (type === "strategy") {
        const s = next.strategies[id];
        if (s) {
          const parentFam = next.families[s.familyId];
          if (parentFam) {
            parentFam.strategies = parentFam.strategies.filter(sId => sId !== id);
          }
          s.tacticFamilies.forEach(tfId => {
            const tf = next.tacticFamilies[tfId];
            if (tf) {
              tf.tactics.forEach(tId => { delete next.tactics[tId]; });
              delete next.tacticFamilies[tfId];
            }
          });
          delete next.strategies[id];
        }
      } else if (type === "tactic_family") {
        const tf = next.tacticFamilies[id];
        if (tf) {
          const parentStr = next.strategies[tf.strategyId];
          if (parentStr) {
            parentStr.tacticFamilies = parentStr.tacticFamilies.filter(tfId => tfId !== id);
          }
          tf.tactics.forEach(tId => { delete next.tactics[tId]; });
          delete next.tacticFamilies[id];
        }
      } else if (type === "tactic") {
        const t = next.tactics[id];
        if (t) {
          const parentTf = next.tacticFamilies[t.tacticFamilyId];
          if (parentTf) {
            parentTf.tactics = parentTf.tactics.filter(tId => tId !== id);
          }
          delete next.tactics[id];
        }
      }

      return next;
    });

    setSelectedId(null);
    setSelectedType(null);
    showToast("Registry node deleted successfully.");
  };

  const handleAddNode = () => {
    if (!addForm.id.trim() || !addForm.name.trim()) {
      alert("Please fill in ID and Name.");
      return;
    }

    const formattedId = addForm.id.toLowerCase().replace(/[^a-z0-9_]+/g, "_");

    if (showAddModal === "family") {
      if (registry.families[formattedId]) {
        alert("A family with this ID already exists.");
        return;
      }
      const newFam: StrategyFamily = {
        id: formattedId,
        name: addForm.name,
        description: addForm.description || "Custom behavior strategy family.",
        behavioralDomain: addForm.domain,
        primaryGoal: addForm.primaryGoal || "Define family behavior goal.",
        applicableUserStates: [],
        incompatibleUserStates: [],
        strategies: []
      };
      setRegistry(prev => ({
        ...prev,
        families: { ...prev.families, [formattedId]: newFam }
      }));
      setSelectedId(formattedId);
      setSelectedType("family");
    } 
    else if (showAddModal === "strategy") {
      const pId = parentSelectionId || Object.keys(registry.families)[0];
      if (!pId) return;
      if (registry.strategies[formattedId]) {
        alert("A strategy with this ID already exists.");
        return;
      }
      const newStr: Strategy = {
        id: formattedId,
        familyId: pId,
        name: addForm.name,
        description: addForm.description || "Custom behavior strategy blueprint.",
        intent: addForm.intent || "Define intent.",
        desiredOutcomes: ["Optimize user execution"],
        bestAppliedWhen: addForm.bestAppliedWhen || "Define conditions.",
        avoidWhen: addForm.avoidWhen || "Define avoid factors.",
        applicableUserStates: ["confusion"],
        targetUserStates: ["high_intent"],
        behavioralPrinciples: ["Choice Architecture"],
        expectedUserEffects: ["Reduced friction"],
        complexity: addForm.complexity,
        interactionStyle: addForm.interactionStyle,
        recommendedFor: [],
        antiPatterns: [],
        requiredCapabilities: [],
        supportedArtifacts: [],
        governanceConstraints: [],
        tacticFamilies: []
      };
      setRegistry(prev => {
        const next = { ...prev };
        next.strategies[formattedId] = newStr;
        next.families[pId].strategies.push(formattedId);
        return next;
      });
      setSelectedId(formattedId);
      setSelectedType("strategy");
      setExpandedNodes(prev => ({ ...prev, [pId]: true }));
    } 
    else if (showAddModal === "tactic_family") {
      const pId = parentSelectionId || Object.keys(registry.strategies)[0];
      if (!pId) return;
      if (registry.tacticFamilies[formattedId]) {
        alert("A tactic family with this ID already exists.");
        return;
      }
      const newTf: TacticFamily = {
        id: formattedId,
        strategyId: pId,
        name: addForm.name,
        description: addForm.description || "Custom tactic family.",
        purpose: addForm.purpose || "Define purpose.",
        tactics: []
      };
      setRegistry(prev => {
        const next = { ...prev };
        next.tacticFamilies[formattedId] = newTf;
        next.strategies[pId].tacticFamilies.push(formattedId);
        return next;
      });
      setSelectedId(formattedId);
      setSelectedType("tactic_family");
      setExpandedNodes(prev => ({ ...prev, [pId]: true }));
    } 
    else if (showAddModal === "tactic") {
      const pId = parentSelectionId || Object.keys(registry.tacticFamilies)[0];
      if (!pId) return;
      if (registry.tactics[formattedId]) {
        alert("A tactic with this ID already exists.");
        return;
      }
      const newTac: Tactic = {
        id: formattedId,
        tacticFamilyId: pId,
        name: addForm.name,
        description: addForm.description || "Custom tactic mechanism.",
        intent: addForm.intent || "Define intent.",
        behavioralEffect: "Dynamic UI support overlay.",
        bestUsedWhen: "When friction occurs.",
        avoidWhen: "When rapid checkout is needed.",
        expectedInputs: [],
        expectedOutputs: [],
        requiredCapabilities: [],
        producedArtifacts: [],
        runtimeSemantics: addForm.runtimeSemantics || "Renders custom DOM component.",
        successSignals: ["User interaction committed"],
        failureSignals: ["Validation fails"],
        recoveryBehaviors: ["Standard system fallbacks"],
        governanceConstraints: []
      };
      setRegistry(prev => {
        const next = { ...prev };
        next.tactics[formattedId] = newTac;
        next.tacticFamilies[pId].tactics.push(formattedId);
        return next;
      });
      setSelectedId(formattedId);
      setSelectedType("tactic");
      setExpandedNodes(prev => ({ ...prev, [pId]: true }));
    }

    setAddForm({
      id: "",
      name: "",
      description: "",
      domain: "Cognitive",
      primaryGoal: "",
      purpose: "",
      intent: "",
      bestAppliedWhen: "",
      avoidWhen: "",
      complexity: "Medium",
      interactionStyle: "Implicit",
      runtimeSemantics: ""
    });
    setShowAddModal(null);
    showToast("New registry node created successfully.");
  };

  const getFilteredStrategies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return Object.values(registry.strategies).filter(s => {
      const matchesSearch = q === "" ||
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.intent.toLowerCase().includes(q);

      if (!matchesSearch) {
        const hasMatchingTactic = s.tacticFamilies.some(tfId => {
          const tf = registry.tacticFamilies[tfId];
          if (!tf) return false;
          if (tf.name.toLowerCase().includes(q) || tf.id.toLowerCase().includes(q)) return true;
          return tf.tactics.some(tId => {
            const t = registry.tactics[tId];
            if (!t) return false;
            return t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
          });
        });
        if (!hasMatchingTactic) return false;
      }

      if (filterState !== "") {
        const matchesState = (s.applicableUserStates || []).includes(filterState) || (s.targetUserStates || []).includes(filterState);
        if (!matchesState) return false;
      }

      if (filterDomain !== "") {
        const parentFam = registry.families[s.familyId];
        if (!parentFam || parentFam.behavioralDomain !== filterDomain) return false;
      }

      if (filterCapability !== "") {
        const hasCapability = s.requiredCapabilities.includes(filterCapability) || s.tacticFamilies.some(tfId => {
          const tf = registry.tacticFamilies[tfId];
          if (!tf) return false;
          return tf.tactics.some(tId => {
            const t = registry.tactics[tId];
            return t && t.requiredCapabilities.includes(filterCapability);
          });
        });
        if (!hasCapability) return false;
      }

      if (filterRisk !== "") {
        const constraintCount = s.governanceConstraints.length + s.tacticFamilies.reduce((acc, tfId) => {
          const tf = registry.tacticFamilies[tfId];
          if (!tf) return acc;
          return acc + tf.tactics.reduce((tAcc, tId) => {
            const t = registry.tactics[tId];
            return tAcc + (t ? t.governanceConstraints.length : 0);
          }, 0);
        }, 0);

        let riskCategory = "Low";
        if (constraintCount >= 3) riskCategory = "High";
        else if (constraintCount > 0) riskCategory = "Medium";

        if (riskCategory !== filterRisk) return false;
      }

      return true;
    });
  }, [registry, searchQuery, filterState, filterDomain, filterCapability, filterRisk]);

  const getVisibleFamilies = useMemo(() => {
    const visibleFamIds = new Set(getFilteredStrategies.map(s => s.familyId));
    return Object.values(registry.families).filter(f => visibleFamIds.has(f.id));
  }, [registry.families, getFilteredStrategies]);

  const getWarnings = (id: string | null, type: string | null) => {
    const warnings: Array<{ type: "error" | "warning"; message: string }> = [];
    if (!id || !type) return { warnings, score: 100 };

    let totalPoints = 0;
    let earnedPoints = 0;

    const addPoint = (earned: boolean) => {
      totalPoints++;
      if (earned) earnedPoints++;
    };

    if (type === "family") {
      const f = registry.families[id];
      if (f) {
        addPoint(!!f.description.trim());
        if (!f.description.trim()) warnings.push({ type: "warning", message: "Missing description for strategy family." });

        addPoint(!!f.behavioralDomain);
        if (!f.behavioralDomain) warnings.push({ type: "warning", message: "Missing behavioral domain classification." });

        addPoint(!!f.primaryGoal.trim());
        if (!f.primaryGoal.trim()) warnings.push({ type: "warning", message: "Primary goal is not defined." });

        const overlaps = (f.applicableUserStates || []).filter(s => (f.incompatibleUserStates || []).includes(s));
        addPoint(overlaps.length === 0);
        if (overlaps.length > 0) {
          warnings.push({ type: "error", message: `Applicable state overlaps with incompatible state: ${overlaps.join(", ")}` });
        }

        addPoint(f.strategies.length > 0);
        if (f.strategies.length === 0) warnings.push({ type: "warning", message: "No strategies registered in this family." });
      }
    } else if (type === "strategy") {
      const s = registry.strategies[id];
      if (s) {
        addPoint(!!s.intent.trim());
        if (!s.intent.trim()) warnings.push({ type: "error", message: "Strategy must have a defined intent." });

        addPoint(!!s.bestAppliedWhen.trim());
        if (!s.bestAppliedWhen.trim()) warnings.push({ type: "error", message: "Strategy must define 'Best Applied When' conditions." });

        addPoint((s.applicableUserStates || []).length > 0);
        if ((s.applicableUserStates || []).length === 0) warnings.push({ type: "error", message: "Must define at least one applicable user state." });

        addPoint((s.targetUserStates || []).length > 0);
        if ((s.targetUserStates || []).length === 0) warnings.push({ type: "error", message: "Must define at least one target user state." });

        const overlapsAppTarget = (s.applicableUserStates || []).filter(st => (s.targetUserStates || []).includes(st));
        addPoint(overlapsAppTarget.length === 0);
        if (overlapsAppTarget.length > 0) {
          warnings.push({ type: "warning", message: `State matches both applicable and target list: ${overlapsAppTarget.join(", ")}` });
        }

        const hasPlaceholder = [s.name, s.description, s.intent, s.bestAppliedWhen].some(text =>
          text.toLowerCase().includes("placeholder") || text.toLowerCase().includes("define")
        );
        addPoint(!hasPlaceholder);
        if (hasPlaceholder) warnings.push({ type: "error", message: "Strategy contains placeholder or unconfigured template text." });

        const tacticCount = s.tacticFamilies.reduce((acc, tfId) => {
          const tf = registry.tacticFamilies[tfId];
          return acc + (tf ? tf.tactics.length : 0);
        }, 0);
        addPoint(tacticCount >= 3);
        if (tacticCount < 3) warnings.push({ type: "error", message: `Strategy has only ${tacticCount} tactics. Requires at least 3.` });

        const parentFam = registry.families[s.familyId];
        addPoint(!!parentFam);
        if (!parentFam) warnings.push({ type: "error", message: "Orphan Strategy: Parent family does not exist or has been deleted." });
      }
    } else if (type === "tactic_family") {
      const tf = registry.tacticFamilies[id];
      if (tf) {
        addPoint(!!tf.description.trim());
        if (!tf.description.trim()) warnings.push({ type: "warning", message: "Missing description for tactic family." });

        addPoint(!!tf.purpose.trim());
        if (!tf.purpose.trim()) warnings.push({ type: "warning", message: "Missing purpose statement." });

        addPoint(tf.tactics.length > 0);
        if (tf.tactics.length === 0) warnings.push({ type: "warning", message: "Tactic family contains no tactics." });

        const parentStr = registry.strategies[tf.strategyId];
        addPoint(!!parentStr);
        if (!parentStr) warnings.push({ type: "error", message: "Orphan Tactic Family: Parent strategy does not exist." });
      }
    } else if (type === "tactic") {
      const t = registry.tactics[id];
      if (t) {
        addPoint(!!t.description.trim());
        if (!t.description.trim()) warnings.push({ type: "warning", message: "Missing description for tactic." });

        addPoint(!!t.intent.trim());
        if (!t.intent.trim()) warnings.push({ type: "warning", message: "Missing intent statement." });

        addPoint(!!t.runtimeSemantics.trim());
        if (!t.runtimeSemantics.trim()) warnings.push({ type: "error", message: "Missing required 'Runtime Semantics' definition." });

        addPoint(t.successSignals.length > 0);
        if (t.successSignals.length === 0) warnings.push({ type: "error", message: "Tactic must define success signals." });

        addPoint(t.failureSignals.length > 0);
        if (t.failureSignals.length === 0) warnings.push({ type: "error", message: "Tactic must define failure signals." });

        addPoint(t.recoveryBehaviors.length > 0);
        if (t.recoveryBehaviors.length === 0) warnings.push({ type: "warning", message: "Tactic should define recovery behaviors." });

        const parentTf = registry.tacticFamilies[t.tacticFamilyId];
        addPoint(!!parentTf);
        if (!parentTf) warnings.push({ type: "error", message: "Orphan Tactic: Parent tactic family does not exist." });
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    return { warnings, score };
  };

  const getGlobalScore = useMemo(() => {
    let sum = 0;
    let count = 0;
    Object.keys(registry.strategies).forEach(id => {
      sum += getWarnings(id, "strategy").score;
      count++;
    });
    Object.keys(registry.tactics).forEach(id => {
      sum += getWarnings(id, "tactic").score;
      count++;
    });
    return count > 0 ? Math.round(sum / count) : 100;
  }, [registry]);

  const activeWarningsAndScore = useMemo(() => {
    return getWarnings(selectedId, selectedType);
  }, [selectedId, selectedType, registry]);

  const activeYamlPreview = useMemo(() => {
    if (!selectedId || !selectedType) return "";
    if (selectedType === "family") return jsToYaml(registry.families[selectedId]);
    if (selectedType === "strategy") return jsToYaml(registry.strategies[selectedId]);
    if (selectedType === "tactic_family") return jsToYaml(registry.tacticFamilies[selectedId]);
    if (selectedType === "tactic") return jsToYaml(registry.tactics[selectedId]);
    return "";
  }, [selectedId, selectedType, registry]);

  const compiledExport = useMemo(() => {
    return compileExportFiles(registry);
  }, [registry]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Configuration copied successfully!");
  };

  const downloadYaml = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} downloaded!`);
  };

  return (
    <div className="h-full p-6 overflow-hidden flex flex-col font-mono text-zinc-200 bg-zinc-950 relative z-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-indigo-600/90 border border-indigo-500/30 text-white text-xs px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 z-50 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-start items-start border-b border-zinc-900 pb-4 mb-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-[9px] uppercase tracking-widest text-indigo-400 font-bold mb-1">
            <Zap className="w-3 h-3" />
            <span>Strategies & Tactics Registry Manager</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 uppercase">
            Goal-Oriented Orchestration & Scaffolding
          </h2>
        </div>

        <div className="flex items-center space-x-3 mt-3 md:mt-0 font-bold text-[9px] uppercase">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center space-x-2">
            <span className="text-zinc-500">Registry Health:</span>
            <span className={clsx(
              "font-black px-1.5 py-0.5 rounded",
              getGlobalScore >= 90 ? "bg-emerald-950/60 border border-emerald-900 text-emerald-400" : "bg-amber-950/60 border border-amber-900 text-amber-400"
            )}>
              {getGlobalScore}% COMPLETE
            </span>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl border border-indigo-500/30 flex items-center shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Terminal className="w-4.5 h-4.5 mr-1.5 shrink-0" /> Export Runtime
          </button>
        </div>
      </div>

      {/* 3-Panel Flex Workspace */}
      <div className="flex-1 flex gap-4 min-h-0 relative items-stretch">
        
        {/* PANEL 1: Left Panel - Registry Explorer */}
        <div className="w-[28%] shrink-0 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-4 flex flex-col min-h-0 h-full relative">
          
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Behavioral Tree Catalog
            </span>
            <button
              onClick={() => {
                setShowAddModal("family");
                setAddForm(prev => ({ ...prev, id: "new_family", name: "New Family" }));
              }}
              className="text-[8.5px] font-black border border-indigo-900 hover:border-indigo-600 text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/80 px-2 py-1 rounded transition-colors uppercase flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-0.5" /> Family
            </button>
          </div>

          {/* Search Inputs */}
          <div className="space-y-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-550" />
              <input
                type="text"
                placeholder="Search strategies or tactics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 border border-zinc-800 text-[10px] text-zinc-300 p-2.5 pl-9 rounded-xl outline-none w-full font-mono placeholder-zinc-650 focus:border-indigo-600 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-zinc-550 hover:text-zinc-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tree Filters */}
            <div className="grid grid-cols-2 gap-2 text-[8px] font-bold font-mono">
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-1.5 text-zinc-400 outline-none focus:border-zinc-700"
              >
                <option value="">All States</option>
                {USER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-1.5 text-zinc-400 outline-none focus:border-zinc-700"
              >
                <option value="">All Domains</option>
                <option value="Cognitive">Cognitive</option>
                <option value="Emotional">Emotional</option>
                <option value="Social">Social</option>
                <option value="Financial">Financial</option>
                <option value="Agentic">Agentic</option>
                <option value="Operational">Operational</option>
              </select>
            </div>
          </div>

          {/* Collapsible Tree Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 mt-4 min-h-0 text-[10px]">
            {getVisibleFamilies.length === 0 ? (
              <div className="p-8 text-center text-zinc-650 font-sans text-[10px]">
                No matching strategy nodes found. Adjust filters or search criteria.
              </div>
            ) : (
              getVisibleFamilies.map(fam => {
                const isFamExpanded = !!expandedNodes[fam.id];
                const famStrategies = getFilteredStrategies.filter(s => s.familyId === fam.id);
                const isSelected = selectedId === fam.id && selectedType === "family";

                return (
                  <div key={fam.id} className="border border-zinc-900/40 rounded-xl overflow-hidden bg-black/10">
                    {/* Family Header */}
                    <div
                      className={clsx(
                        "flex items-center justify-between p-2 cursor-pointer transition-all hover:bg-zinc-900/30 group",
                        isSelected ? "bg-indigo-950/20 border-l-2 border-indigo-500" : ""
                      )}
                      onClick={() => {
                        setSelectedId(fam.id);
                        setSelectedType("family");
                      }}
                    >
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(fam.id);
                          }}
                          className="text-zinc-650 hover:text-zinc-300 p-0.5 shrink-0"
                        >
                          {isFamExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                        <span className="text-[7.5px] font-black tracking-wide shrink-0 px-1 py-0.5 rounded bg-indigo-950/40 border border-indigo-900/60 text-indigo-400">
                          FAM
                        </span>
                        <span className="font-bold text-zinc-300 truncate tracking-tight">{fam.name}</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setParentSelectionId(fam.id);
                          setShowAddModal("strategy");
                          setAddForm(prev => ({ ...prev, id: `${fam.id}_strategy`, name: `New Strategy` }));
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-indigo-400 p-0.5 text-zinc-550 shrink-0 transition-opacity"
                        title="Add Strategy"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isFamExpanded && (
                      <div className="pl-4 pr-1.5 pb-2 border-t border-zinc-900/20 pt-1.5 space-y-1">
                        {famStrategies.map(str => {
                          const isStrExpanded = !!expandedNodes[str.id];
                          const isSelectedStr = selectedId === str.id && selectedType === "strategy";

                          return (
                            <div key={str.id} className="border-l border-zinc-800/80 pl-1 space-y-1">
                              <div
                                className={clsx(
                                  "flex items-center justify-between p-1.5 cursor-pointer rounded-lg transition-all hover:bg-zinc-900/20 group",
                                  isSelectedStr ? "bg-purple-950/20 text-purple-300 border border-purple-900/50" : "text-zinc-350"
                                )}
                                onClick={() => {
                                  setSelectedId(str.id);
                                  setSelectedType("strategy");
                                }}
                              >
                                <div className="flex items-center space-x-1 shrink-0 min-w-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpand(str.id);
                                    }}
                                    className="text-zinc-650 hover:text-zinc-300 p-0.5 shrink-0"
                                  >
                                    {isStrExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </button>
                                  <span className="text-[7px] font-black px-1 rounded bg-purple-950/40 text-purple-400 border border-purple-900/60 shrink-0">
                                    STR
                                  </span>
                                  <span className="font-semibold truncate tracking-tight">{str.name}</span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setParentSelectionId(str.id);
                                    setShowAddModal("tactic_family");
                                    setAddForm(prev => ({ ...prev, id: `${str.id}_tf`, name: `New Tactic Family` }));
                                  }}
                                  className="opacity-0 group-hover:opacity-100 hover:text-purple-400 p-0.5 text-zinc-550 shrink-0 transition-opacity"
                                  title="Add Tactic Family"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {isStrExpanded && (
                                <div className="pl-4 space-y-1">
                                  {str.tacticFamilies.map(tfId => {
                                    const tf = registry.tacticFamilies[tfId];
                                    if (!tf) return null;
                                    const isTfExpanded = !!expandedNodes[tf.id];
                                    const isSelectedTf = selectedId === tf.id && selectedType === "tactic_family";

                                    return (
                                      <div key={tf.id} className="border-l border-zinc-800/40 pl-1 space-y-1">
                                        <div
                                          className={clsx(
                                            "flex items-center justify-between p-1 cursor-pointer rounded transition-all hover:bg-zinc-900/20 group",
                                            isSelectedTf ? "bg-rose-950/20 text-rose-300 border border-rose-900/50" : "text-zinc-400"
                                          )}
                                          onClick={() => {
                                            setSelectedId(tf.id);
                                            setSelectedType("tactic_family");
                                          }}
                                        >
                                          <div className="flex items-center space-x-1 shrink-0 min-w-0">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(tf.id);
                                              }}
                                              className="text-zinc-650 hover:text-zinc-300 p-0.5 shrink-0"
                                            >
                                              {isTfExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            </button>
                                            <span className="text-[6.5px] font-black px-1 rounded bg-rose-950/40 text-rose-400 border border-rose-900/60 shrink-0">
                                              TF
                                            </span>
                                            <span className="truncate tracking-tight">{tf.name}</span>
                                          </div>

                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setParentSelectionId(tf.id);
                                              setShowAddModal("tactic");
                                              setAddForm(prev => ({ ...prev, id: `${tf.id}_tactic`, name: `New Tactic` }));
                                            }}
                                            className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 text-zinc-550 shrink-0 transition-opacity"
                                            title="Add Tactic"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {isTfExpanded && (
                                          <div className="pl-4 space-y-0.5">
                                            {tf.tactics.map(tId => {
                                              const t = registry.tactics[tId];
                                              if (!t) return null;
                                              const isSelectedT = selectedId === t.id && selectedType === "tactic";

                                              return (
                                                <div
                                                  key={t.id}
                                                  className={clsx(
                                                    "flex items-center space-x-1.5 p-1 cursor-pointer rounded transition-all hover:bg-zinc-900/20 text-[9.5px]",
                                                    isSelectedT ? "bg-emerald-950/20 text-emerald-300 border border-emerald-900/50" : "text-zinc-450"
                                                  )}
                                                  onClick={() => {
                                                    setSelectedId(t.id);
                                                    setSelectedType("tactic");
                                                  }}
                                                >
                                                  <span className="text-[6px] font-extrabold px-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 shrink-0">
                                                    TAC
                                                  </span>
                                                  <span className="truncate tracking-tight">{t.name}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 2: Center Panel - Detail Editor */}
        <div className="flex-1 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-5 flex flex-col min-h-0 h-full relative overflow-y-auto custom-scrollbar">
          {!editingNode || editingNode.id !== selectedId ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
              <Compass className="w-12 h-12 text-zinc-700 animate-pulse mb-4" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Node Details</h3>
              <p className="text-[10px] text-zinc-550 font-sans mt-2 max-w-sm leading-relaxed">
                Synchronizing registry workspace context...
              </p>

              <div className="border border-zinc-900 bg-zinc-950/30 rounded-2xl p-4.5 mt-8 w-full max-w-lg text-left space-y-3">
                <span className="text-[8.5px] text-indigo-400 font-bold uppercase tracking-wider block">Registry Diagnostics</span>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-900">
                    <span className="text-zinc-550 block text-[8px] uppercase">Families Count</span>
                    <span className="font-bold text-zinc-300 text-sm">{Object.keys(registry.families).length} Active</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-900">
                    <span className="text-zinc-550 block text-[8px] uppercase">Strategies Count</span>
                    <span className="font-bold text-zinc-300 text-sm">{Object.keys(registry.strategies).length} Seeded</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-900">
                    <span className="text-zinc-550 block text-[8px] uppercase">Tactic Families</span>
                    <span className="font-bold text-zinc-300 text-sm">{Object.keys(registry.tacticFamilies).length} Linked</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-900">
                    <span className="text-zinc-550 block text-[8px] uppercase">Tactics Count</span>
                    <span className="font-bold text-zinc-300 text-sm">{Object.keys(registry.tactics).length} Compiled</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Form Content */}
              <div className="space-y-4">
                
                {/* Header details */}
                <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                  <div>
                    <span className="text-[7.5px] uppercase font-black px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Editing {selectedType?.replace("_", " ")}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-150 uppercase tracking-tight mt-1">
                      {editingNode.name || editingNode.id}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteNode(selectedId!, selectedType!)}
                    className="text-zinc-550 hover:text-rose-450 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/60 p-2 rounded-xl transition-all"
                    title="Delete Node"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* FORM FIELDS PER TYPE */}
                {selectedType === "family" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">FAMILY ID</label>
                        <input
                          type="text"
                          value={editingNode.id}
                          disabled
                          className="w-full bg-zinc-950 border border-zinc-900 text-zinc-550 p-2.5 rounded-xl font-mono text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DISPLAY NAME</label>
                        <input
                          type="text"
                          value={editingNode.name || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DESCRIPTION</label>
                      <textarea
                        value={editingNode.description || ""}
                        onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                        className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-16 resize-none outline-none leading-normal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">BEHAVIORAL DOMAIN</label>
                        <select
                          value={editingNode.behavioralDomain || "Cognitive"}
                          onChange={(e) => setEditingNode({ ...editingNode, behavioralDomain: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="Cognitive">Cognitive</option>
                          <option value="Emotional">Emotional</option>
                          <option value="Social">Social</option>
                          <option value="Financial">Financial</option>
                          <option value="Agentic">Agentic</option>
                          <option value="Operational">Operational</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">PRIMARY BEHAVIORAL GOAL</label>
                        <input
                          type="text"
                          value={editingNode.primaryGoal || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, primaryGoal: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1.5">APPLICABLE STATES</label>
                        <div className="flex flex-wrap gap-1 bg-black/40 border border-zinc-800/80 rounded-xl p-2 h-24 overflow-y-auto custom-scrollbar">
                          {USER_STATES.map(state => {
                            const arr = editingNode.applicableUserStates || [];
                            const active = arr.includes(state);
                            return (
                              <button
                                key={state}
                                type="button"
                                onClick={() => {
                                  const updated = active
                                    ? arr.filter((s: string) => s !== state)
                                    : [...arr, state];
                                  setEditingNode({ ...editingNode, applicableUserStates: updated });
                                }}
                                className={clsx(
                                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors shrink-0",
                                  active ? "bg-indigo-950 text-indigo-400 border border-indigo-900" : "bg-zinc-900/40 text-zinc-550 border border-transparent"
                                )}
                              >
                                {state.replace("_", " ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1.5">INCOMPATIBLE STATES</label>
                        <div className="flex flex-wrap gap-1 bg-black/40 border border-zinc-800/80 rounded-xl p-2 h-24 overflow-y-auto custom-scrollbar">
                          {USER_STATES.map(state => {
                            const arr = editingNode.incompatibleUserStates || [];
                            const active = arr.includes(state);
                            return (
                              <button
                                key={state}
                                type="button"
                                onClick={() => {
                                  const updated = active
                                    ? arr.filter((s: string) => s !== state)
                                    : [...arr, state];
                                  setEditingNode({ ...editingNode, incompatibleUserStates: updated });
                                }}
                                className={clsx(
                                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors shrink-0",
                                  active ? "bg-rose-950 text-rose-450 border border-rose-900" : "bg-zinc-900/40 text-zinc-550 border border-transparent"
                                )}
                              >
                                {state.replace("_", " ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "strategy" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">STRATEGY ID</label>
                        <input
                          type="text"
                          value={editingNode.id}
                          disabled
                          className="w-full bg-zinc-950 border border-zinc-900 text-zinc-550 p-2 rounded-xl font-mono text-[9.5px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DISPLAY NAME</label>
                        <input
                          type="text"
                          value={editingNode.name || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">PARENT FAMILY</label>
                        <select
                          value={editingNode.familyId || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, familyId: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none font-mono text-[10px]"
                        >
                          {Object.values(registry.families).map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DESCRIPTION</label>
                        <textarea
                          value={editingNode.description || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-14 resize-none outline-none leading-normal"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">STRATEGIC INTENT</label>
                        <textarea
                          value={editingNode.intent || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, intent: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-14 resize-none outline-none leading-normal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">BEST APPLIED WHEN</label>
                        <textarea
                          value={editingNode.bestAppliedWhen || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, bestAppliedWhen: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-14 resize-none outline-none leading-normal"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">AVOID IN CONTEXTS</label>
                        <textarea
                          value={editingNode.avoidWhen || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, avoidWhen: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-14 resize-none outline-none leading-normal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">APPLICABLE STATES</label>
                        <div className="flex flex-wrap gap-1 bg-black/40 border border-zinc-800 rounded-xl p-2 h-20 overflow-y-auto custom-scrollbar">
                          {USER_STATES.map(st => {
                            const arr = editingNode.applicableUserStates || [];
                            const active = arr.includes(st);
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  const updated = active
                                    ? arr.filter((s: string) => s !== st)
                                    : [...arr, st];
                                  setEditingNode({ ...editingNode, applicableUserStates: updated });
                                }}
                                className={clsx(
                                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors shrink-0",
                                  active ? "bg-purple-950 text-purple-400 border border-purple-900" : "bg-zinc-900/45 text-zinc-550 border border-transparent"
                                )}
                              >
                                {st.replace("_", " ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">TARGET TRANSITION STATES</label>
                        <div className="flex flex-wrap gap-1 bg-black/40 border border-zinc-800 rounded-xl p-2 h-20 overflow-y-auto custom-scrollbar">
                          {USER_STATES.map(st => {
                            const arr = editingNode.targetUserStates || [];
                            const active = arr.includes(st);
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  const updated = active
                                    ? arr.filter((s: string) => s !== st)
                                    : [...arr, st];
                                  setEditingNode({ ...editingNode, targetUserStates: updated });
                                }}
                                className={clsx(
                                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors shrink-0",
                                  active ? "bg-emerald-950 text-emerald-450 border border-emerald-900" : "bg-zinc-900/45 text-zinc-550 border border-transparent"
                                )}
                              >
                                {st.replace("_", " ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">COMPLEXITY</label>
                        <select
                          value={editingNode.complexity || "Medium"}
                          onChange={(e) => setEditingNode({ ...editingNode, complexity: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">INTERACTION STYLE</label>
                        <select
                          value={editingNode.interactionStyle || "Implicit"}
                          onChange={(e) => setEditingNode({ ...editingNode, interactionStyle: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="Implicit">Implicit</option>
                          <option value="Explicit">Explicit</option>
                          <option value="Conversational">Conversational</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">REQUIRED CAPABILITY</label>
                        <div className="flex flex-wrap gap-1 bg-black/40 border border-zinc-800 rounded-xl p-1.5 h-11 overflow-y-auto custom-scrollbar">
                          {CAPABILITIES.map(cap => {
                            const arr = editingNode.requiredCapabilities || [];
                            const active = arr.includes(cap);
                            return (
                              <button
                                key={cap}
                                type="button"
                                onClick={() => {
                                  const updated = active
                                    ? arr.filter((c: string) => c !== cap)
                                    : [...arr, cap];
                                  setEditingNode({ ...editingNode, requiredCapabilities: updated });
                                }}
                                className={clsx(
                                  "px-1.5 py-0.5 rounded text-[7px] font-bold uppercase transition-colors shrink-0",
                                  active ? "bg-amber-950 text-amber-400 border border-amber-900" : "bg-zinc-900/40 text-zinc-550"
                                )}
                              >
                                {cap.replace(/_/g, " ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "tactic_family" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">FAMILY UNIQUE ID</label>
                        <input
                          type="text"
                          value={editingNode.id}
                          disabled
                          className="w-full bg-zinc-950 border border-zinc-900 text-zinc-550 p-2.5 rounded-xl font-mono text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-550 font-bold block mb-1">DISPLAY NAME</label>
                        <input
                          type="text"
                          value={editingNode.name || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DESCRIPTION</label>
                        <textarea
                          value={editingNode.description || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-18 resize-none outline-none leading-normal"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">TACTICAL PURPOSE</label>
                        <textarea
                          value={editingNode.purpose || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, purpose: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-18 resize-none outline-none leading-normal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">PARENT STRATEGY</label>
                      <select
                        value={editingNode.strategyId || ""}
                        onChange={(e) => setEditingNode({ ...editingNode, strategyId: e.target.value })}
                        className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none font-mono text-[10px]"
                      >
                        {Object.values(registry.strategies).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {selectedType === "tactic" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">TACTIC ID</label>
                        <input
                          type="text"
                          value={editingNode.id}
                          disabled
                          className="w-full bg-zinc-950 border border-zinc-900 text-zinc-550 p-2 rounded-xl font-mono text-[9px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">TACTIC DISPLAY NAME</label>
                        <input
                          type="text"
                          value={editingNode.name || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">PARENT TAC FAMILY</label>
                        <select
                          value={editingNode.tacticFamilyId || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, tacticFamilyId: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none font-mono text-[9.5px]"
                        >
                          {Object.values(registry.tacticFamilies).map(tf => (
                            <option key={tf.id} value={tf.id}>{tf.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">DESCRIPTION</label>
                        <textarea
                          value={editingNode.description || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-12 resize-none outline-none leading-normal"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">TACTICAL INTENT</label>
                        <textarea
                          value={editingNode.intent || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, intent: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-12 resize-none outline-none leading-normal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">BEHAVIORAL EFFECT</label>
                        <textarea
                          value={editingNode.behavioralEffect || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, behavioralEffect: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl h-12 resize-none outline-none leading-normal"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">RUNTIME SEMANTICS (DSL EXECUTION CODE)</label>
                        <textarea
                          value={editingNode.runtimeSemantics || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, runtimeSemantics: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-[10px] text-zinc-300 font-mono p-2.5 rounded-xl h-12 resize-none outline-none leading-relaxed"
                          placeholder="e.g. renderOverlay(stepNode), updateLayout(gated)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">BEST USED WHEN</label>
                        <input
                          type="text"
                          value={editingNode.bestUsedWhen || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, bestUsedWhen: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">AVOID WHEN</label>
                        <input
                          type="text"
                          value={editingNode.avoidWhen || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, avoidWhen: e.target.value })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">REQUIRED CAPABILITY</label>
                        <select
                          value={(editingNode.requiredCapabilities || [])[0] || ""}
                          onChange={(e) => setEditingNode({ ...editingNode, requiredCapabilities: e.target.value ? [e.target.value] : [] })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none font-mono"
                        >
                          <option value="">None</option>
                          {CAPABILITIES.map(cap => <option key={cap} value={cap}>{cap}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">SUCCESS SIGNALS (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={(editingNode.successSignals || []).join(", ")}
                          onChange={(e) => setEditingNode({ ...editingNode, successSignals: (e.target.value || "").split(",").map(s => s.trim()).filter(Boolean) })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none font-mono text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-500 font-bold block mb-1">FAILURE SIGNALS (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={(editingNode.failureSignals || []).join(", ")}
                          onChange={(e) => setEditingNode({ ...editingNode, failureSignals: (e.target.value || "").split(",").map(s => s.trim()).filter(Boolean) })}
                          className="w-full bg-black border border-zinc-800 focus:border-indigo-650 text-zinc-200 p-2.5 rounded-xl outline-none font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons sticky footer */}
              <div className="flex justify-end items-center space-x-3 pt-3 border-t border-zinc-900 shrink-0 font-bold text-[9px] uppercase tracking-wider">
                <button
                  onClick={() => {
                    if (selectedType === "family") setEditingNode({ ...registry.families[selectedId!] });
                    else if (selectedType === "strategy") setEditingNode({ ...registry.strategies[selectedId!] });
                    else if (selectedType === "tactic_family") setEditingNode({ ...registry.tacticFamilies[selectedId!] });
                    else if (selectedType === "tactic") setEditingNode({ ...registry.tactics[selectedId!] });
                  }}
                  className="bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-xl transition-all"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveNode}
                  className="bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 text-white px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Save Changes
                </button>
              </div>

            </div>
          )}

        </div>

        {/* PANEL 3: Right Panel - Intelligence & Validation */}
        <div className="w-[24%] shrink-0 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-4 flex flex-col min-h-0 h-full space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Dynamic completeness score */}
          {selectedId && selectedType ? (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-2">
              <span className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block">
                Verification Dashboard
              </span>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  {/* Radial completeness circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#18181b" strokeWidth="3" fill="transparent" />
                    <circle cx="24" cy="24" r="20" stroke={activeWarningsAndScore.score >= 90 ? "#10b981" : "#f59e0b"} strokeWidth="3.5" fill="transparent" 
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 - (125.6 * activeWarningsAndScore.score) / 100}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black text-zinc-200">{activeWarningsAndScore.score}%</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-bold text-zinc-300 block uppercase">Node Completeness</span>
                  <span className="text-[8.5px] text-zinc-500 font-sans block leading-none mt-1">
                    {activeWarningsAndScore.warnings.filter(w => w.type === 'error').length} Errors • {activeWarningsAndScore.warnings.filter(w => w.type === 'warning').length} Warnings
                  </span>
                </div>
              </div>

              {/* Warnings listing */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-900/60 max-h-36 overflow-y-auto custom-scrollbar">
                {activeWarningsAndScore.warnings.length === 0 ? (
                  <div className="flex items-center space-x-1.5 text-[8.5px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-1.5 rounded-lg font-bold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>ALL VERIFICATION CHECKS COMPLETED</span>
                  </div>
                ) : (
                  activeWarningsAndScore.warnings.map((w, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        "flex items-start space-x-1.5 text-[8px] p-1.5 rounded-lg border font-bold leading-normal",
                        w.type === "error" 
                          ? "bg-rose-950/30 border-rose-900/50 text-rose-400" 
                          : "bg-amber-950/30 border-amber-900/50 text-amber-400"
                      )}
                    >
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{w.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 text-center py-6 text-zinc-650 text-[10px]">
              No active node telemetry loaded.
            </div>
          )}

          {/* Section 2: Visual relationship trace breadcrumbs */}
          {selectedId && selectedType && (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-2">
              <span className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block">Lineage Validation Path</span>
              <div className="flex flex-col space-y-1.5 text-[9px] text-zinc-400 font-semibold font-mono">
                {selectedType === "family" && (
                  <span className="text-indigo-400 bg-indigo-950/20 border border-indigo-900/40 px-2 py-1 rounded-lg truncate">
                    FAM: {selectedId}
                  </span>
                )}
                {selectedType === "strategy" && (
                  <>
                    <span className="text-zinc-550 truncate pl-1">FAM: {registry.strategies[selectedId]?.familyId}</span>
                    <span className="text-zinc-600 pl-2">↓</span>
                    <span className="text-purple-400 bg-purple-950/20 border border-purple-900/40 px-2 py-1 rounded-lg truncate">
                      STR: {selectedId}
                    </span>
                  </>
                )}
                {selectedType === "tactic_family" && (
                  <>
                    <span className="text-zinc-550 truncate pl-1">STR: {registry.tacticFamilies[selectedId]?.strategyId}</span>
                    <span className="text-zinc-600 pl-2">↓</span>
                    <span className="text-rose-400 bg-rose-950/20 border border-rose-900/40 px-2 py-1 rounded-lg truncate">
                      TF: {selectedId}
                    </span>
                  </>
                )}
                {selectedType === "tactic" && (
                  <>
                    <span className="text-zinc-550 truncate pl-1">TF: {registry.tactics[selectedId]?.tacticFamilyId}</span>
                    <span className="text-zinc-600 pl-2">↓</span>
                    <span className="text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-1 rounded-lg truncate font-bold">
                      TAC: {selectedId}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Section 3: live YAML preview */}
          {selectedId && selectedType && (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-wider block">YAML AST Preview</span>
                <button
                  onClick={() => copyToClipboard(activeYamlPreview)}
                  className="text-[8px] font-black text-indigo-400 hover:text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded transition-all uppercase"
                >
                  Copy
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-all">
                <pre className="text-[9.5px] text-zinc-350 font-mono leading-relaxed bg-black/40 p-2.5 rounded-xl border border-zinc-900/80 h-full whitespace-pre-wrap overflow-x-hidden">
                  {activeYamlPreview}
                </pre>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CREATE NEW NODE MODALS */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Plus className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                Create New {showAddModal.replace("_", " ")}
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">UNIQUE SYSTEM ID (LOWERCASE, NO SPACES)</label>
                  <input
                    type="text"
                    placeholder="e.g. stress_mitigation"
                    value={addForm.id}
                    onChange={(e) => setAddForm({ ...addForm, id: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-650"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">DISPLAY DISPLAY NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Stress Mitigation Strategy"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] text-zinc-500 font-bold block mb-1">DESCRIPTION</label>
                <textarea
                  placeholder="Describe the operational intention or execution flow of this node..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 resize-none outline-none"
                />
              </div>

              {showAddModal === "family" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">BEHAVIORAL DOMAIN</label>
                    <select
                      value={addForm.domain}
                      onChange={(e) => setAddForm({ ...addForm, domain: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                    >
                      <option value="Cognitive">Cognitive</option>
                      <option value="Emotional">Emotional</option>
                      <option value="Social">Social</option>
                      <option value="Financial">Financial</option>
                      <option value="Agentic">Agentic</option>
                      <option value="Operational">Operational</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">PRIMARY GOAL</label>
                    <input
                      type="text"
                      placeholder="e.g. Mitigate sensory overload spikes"
                      value={addForm.primaryGoal}
                      onChange={(e) => setAddForm({ ...addForm, primaryGoal: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              )}

              {showAddModal === "strategy" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">INTENT STATEMENT</label>
                    <input
                      type="text"
                      placeholder="e.g. Deliver structured step-by-step disclosures"
                      value={addForm.intent}
                      onChange={(e) => setAddForm({ ...addForm, intent: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">BEST APPLIED SITUATIONS</label>
                    <input
                      type="text"
                      placeholder="e.g. High parameter configuration dashboards"
                      value={addForm.bestAppliedWhen}
                      onChange={(e) => setAddForm({ ...addForm, bestAppliedWhen: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              )}

              {showAddModal === "tactic_family" && (
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">TACTICAL PURPOSE</label>
                  <input
                    type="text"
                    placeholder="e.g. Pace layout elements dynamically"
                    value={addForm.purpose}
                    onChange={(e) => setAddForm({ ...addForm, purpose: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 outline-none"
                  />
                </div>
              )}

              {showAddModal === "tactic" && (
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold block mb-1">RUNTIME SEMANTICS (DSL INTERACTION CODE)</label>
                  <input
                    type="text"
                    placeholder="e.g. triggerOverlay(stepId), saveDraft()"
                    value={addForm.runtimeSemantics}
                    onChange={(e) => setAddForm({ ...addForm, runtimeSemantics: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono text-[10px] outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-900 font-bold text-[9px] uppercase">
              <button
                onClick={() => setShowAddModal(null)}
                className="px-3.5 py-2 border border-zinc-900 hover:border-zinc-800 text-zinc-550 hover:text-zinc-350 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                className="px-3.5 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg shadow-lg"
              >
                Deploy Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT / PUBLISH RUNTIME MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fadeIn">
          <div className="bg-[#0b0b0d] border border-zinc-900 rounded-[32px] max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-900 shrink-0 flex justify-between items-center bg-black/40">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">Compile & Publish Runtime Assets</h3>
                  <p className="text-[9px] text-zinc-500 font-sans mt-0.5 leading-none">Compile PM registries into structured engineering configuration blueprints</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-zinc-550 hover:text-zinc-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Workspace layout */}
            <div className="flex-1 flex min-h-0">
              {/* Tab Selector sidebar */}
              <div className="w-[28%] border-r border-zinc-900 bg-zinc-950/20 p-4 space-y-1.5 overflow-y-auto custom-scrollbar shrink-0 text-[10px] font-bold">
                <span className="text-[8px] text-zinc-650 uppercase tracking-wider block mb-2 px-1">Compiled Configuration Files</span>
                {[
                  { id: "strategy_families", label: "strategy_families.yaml", desc: "Strategy group domains & goals" },
                  { id: "strategies", label: "strategies.yaml", desc: "Core behavioral strategies" },
                  { id: "tactic_families", label: "tactic_families.yaml", desc: "Tactic family groupings" },
                  { id: "tactics", label: "tactics.yaml", desc: "Detailed micro UI tactics" },
                  { id: "state_strategy_mappings", label: "state_strategy_mappings.yaml", desc: "Context state trigger maps" },
                  { id: "strategy_tactic_mappings", label: "strategy_tactic_mappings.yaml", desc: "Strategy to tactic hierarchy" },
                  { id: "capability_dependencies", label: "capability_dependencies.yaml", desc: "Required API & AI integrations" },
                  { id: "governance_constraints", label: "governance_constraints.yaml", desc: "Security and compliance rules" }
                ].map((tab) => {
                  const isActive = exportActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setExportActiveTab(tab.id)}
                      className={clsx(
                        "w-full text-left p-3 rounded-xl transition-all border flex flex-col relative",
                        isActive 
                          ? "bg-indigo-950/30 border-indigo-900/60 text-indigo-400"
                          : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10"
                      )}
                    >
                      <span className="text-[10px] tracking-tight">{tab.label}</span>
                      <span className="text-[7.5px] font-medium font-sans text-zinc-600 block mt-0.5 leading-none">{tab.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Code viewer viewport */}
              <div className="flex-1 flex flex-col bg-[#070708] min-h-0 relative p-4">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <span className="text-[8.5px] text-zinc-500 uppercase tracking-wider block">YAML Code Blueprint Output</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(compiledExport[exportActiveTab])}
                      className="text-[8.5px] font-black border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-zinc-300 px-3 py-1 rounded-lg uppercase transition-all"
                    >
                      Copy File
                    </button>
                    <button
                      onClick={() => downloadYaml(`${exportActiveTab}.yaml`, compiledExport[exportActiveTab])}
                      className="text-[8.5px] font-black bg-indigo-650 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg uppercase transition-all shadow-md"
                    >
                      Download
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-all border border-zinc-900/80 rounded-2xl bg-black/35 p-4">
                  <pre className="text-[10px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-hidden">
                    {compiledExport[exportActiveTab]}
                  </pre>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-zinc-900 bg-black/40 flex justify-between items-center shrink-0">
              <span className="text-[8px] text-zinc-550 font-sans leading-none">All registry nodes have been compiled and verified into production configuration maps.</span>
              <div className="flex items-center space-x-3 font-bold text-[9px] uppercase">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-zinc-450 hover:text-zinc-300 transition-colors"
                >
                  Close View
                </button>
                <button
                  onClick={() => {
                    // Trigger mock publish event
                    setShowExportModal(false);
                    showToast("Registry published successfully to adaptive orchestrator runtime!");
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Publish to Runtime
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 7. ENGINEERING CONTRACTS (ORGANIZATION REGISTRY)
// ==========================================
export function EngineeringContracts() {
  const {
    organizations = [],
    createOrganization,
    deleteOrganization,
    updateOrganization,
    primitives = {},
    strategies = [],
    governanceShields = []
  } = useBehaviorStore();

  const ALL_FAMILIES = [
    "Cognitive", "Emotional", "Trust", "Decision", "Communication", 
    "Motivation", "Friction", "Persuasion", "Learning", "Temporal", 
    "Identity", "Control", "Context", "Meta-Orchestration"
  ];

  interface UnifiedAsset {
    id: string;
    name: string;
    type: "primitive" | "strategy" | "policy";
    family: string;
    description: string;
    details: string;
  }

  const [selectedOrgId, setSelectedOrgId] = useState<string>("product_org");
  const activeOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  // Modal Registry state
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [newOrgId, setNewOrgId] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  
  // Re-assignment state
  const [isEditingFamilies, setIsEditingFamilies] = useState(false);

  const handleRegisterOrg = () => {
    if (!newOrgId.trim() || !newOrgName.trim()) return;
    const formattedId = newOrgId.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    createOrganization({
      id: formattedId,
      name: newOrgName.trim(),
      description: newOrgDesc.trim() || "No description provided.",
      ownedFamilies: []
    });
    setNewOrgId("");
    setNewOrgName("");
    setNewOrgDesc("");
    setShowOrgModal(false);
    setSelectedOrgId(formattedId);
  };

  const handleToggleFamily = (family: string) => {
    if (!activeOrg) return;
    const current = [...(activeOrg.ownedFamilies || [])];
    const updated = current.includes(family)
      ? current.filter(f => f !== family)
      : [...current, family];
    updateOrganization(activeOrg.id, { ownedFamilies: updated });
  };

  // Group all dynamic architectural assets (Primitives, Strategies, and Policies) by active owned families
  const ownedAssets = useMemo<UnifiedAsset[]>(() => {
    if (!activeOrg) return [];
    const ownedFamilies = activeOrg.ownedFamilies || [];
    const assets: UnifiedAsset[] = [];

    // 1. Primitive Assets
    Object.values(primitives).forEach((prim) => {
      if (ownedFamilies.includes(prim.category)) {
        assets.push({
          id: prim.id,
          name: prim.name,
          type: "primitive",
          family: prim.category,
          description: prim.definition,
          details: `Base Default: ${prim.base.toFixed(2)} | Principle: ${prim.principle}`
        });
      }
    });

    // 2. Strategy Assets
    strategies.forEach((strat) => {
      const stratFamilyNormalized = strat.family === "guidance" ? "Motivation" : "Decision";
      if (ownedFamilies.includes(stratFamilyNormalized)) {
        assets.push({
          id: strat.id,
          name: strat.name,
          type: "strategy",
          family: stratFamilyNormalized,
          description: strat.description,
          details: `Intent: ${strat.intent || "Not specified"}`
        });
      }
    });

    // 3. Policy Assets
    governanceShields.forEach((shield) => {
      const targetPrim = primitives[shield.targetPrimitiveId];
      const shieldFamily = targetPrim ? targetPrim.category : "Trust";
      if (ownedFamilies.includes(shieldFamily)) {
        assets.push({
          id: shield.id,
          name: shield.name,
          type: "policy",
          family: shieldFamily,
          description: shield.description || `Safety clamp override bounding ${shield.targetPrimitiveId}`,
          details: `Limits: ${shield.limitType} (${shield.thresholdValue})`
        });
      }
    });

    return assets;
  }, [activeOrg, primitives, strategies, governanceShields]);

  return (
    <div className="h-full p-8 overflow-y-auto max-w-6xl font-mono text-zinc-200 custom-scrollbar space-y-6 relative z-10">
      
      {/* Structural Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Database className="w-4 h-4 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Architectural Separation Protocol</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
            ORGANIZATION & FAMILY REGISTRY
          </h2>
          <p className="text-[10px] text-zinc-450 font-sans leading-relaxed max-w-2xl">
            Enforces structural boundaries showing that organizations ONLY own base primitive families. Organizations DO NOT author dynamic runtime resolved states or behavior parameters.
          </p>
        </div>

        <button
          onClick={() => setShowOrgModal(true)}
          className="bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-xl text-[9px] uppercase font-bold text-white flex items-center shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Register Organization
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Organization Directory */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-zinc-900 rounded-[24px] overflow-hidden">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/80 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider">Registered Orgs</span>
            <span className="text-[7.5px] bg-zinc-900 border border-zinc-800 text-zinc-450 px-2 py-0.5 rounded uppercase font-bold">
              {organizations.length} Active
            </span>
          </div>

          <div className="divide-y divide-zinc-900">
            {organizations.map((org) => {
              const isActive = activeOrg && activeOrg.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrgId(org.id);
                    setIsEditingFamilies(false);
                  }}
                  className={clsx(
                    "w-full text-left p-4 transition-all hover:bg-zinc-900/10 flex flex-col space-y-1.5 border-l-2",
                    isActive
                      ? "bg-indigo-950/5 border-indigo-500 text-zinc-100 font-semibold"
                      : "border-transparent text-zinc-500"
                  )}
                >
                  <span className="text-xs uppercase font-bold tracking-wide truncate">{org.name}</span>
                  <span className="text-[8px] text-zinc-650 truncate block uppercase font-sans">
                    {org.id} • {org.ownedFamilies?.length || 0} Families Owned
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Organization Details & Primitive Mapping */}
        {activeOrg && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Org Metadata & Boundaries */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div className="space-y-1">
                  <span className="text-[8px] text-indigo-400 font-bold uppercase block tracking-wider">
                    Ownership Boundary Details
                  </span>
                  <h3 className="text-sm font-bold text-zinc-150 uppercase">{activeOrg.name}</h3>
                  <p className="text-[9.5px] text-zinc-450 font-sans mt-2 leading-relaxed">
                    {activeOrg.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete organization '${activeOrg.name}'?`)) {
                      deleteOrganization(activeOrg.id);
                      setSelectedOrgId("product_org");
                    }
                  }}
                  className="text-[8px] text-rose-500 border border-rose-900/40 hover:bg-rose-950/25 hover:text-rose-400 px-2 py-1 rounded transition-colors uppercase font-bold"
                >
                  Delete Org
                </button>
              </div>

              {/* Owned Primitive Families */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">
                    Owned Primitive Families (MECE Clusters)
                  </span>
                  <button
                    onClick={() => setIsEditingFamilies(!isEditingFamilies)}
                    className="text-[8.5px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-350 px-2.5 py-1 rounded uppercase font-bold flex items-center"
                  >
                    <Edit2 className="w-3 h-3 mr-1" /> {isEditingFamilies ? "Done Mapping" : "Re-Map Families"}
                  </button>
                </div>

                {isEditingFamilies ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black/25 p-4 border border-zinc-900 rounded-2xl">
                    {ALL_FAMILIES.map((family) => {
                      const isOwned = activeOrg.ownedFamilies?.includes(family);
                      return (
                        <button
                          key={family}
                          onClick={() => handleToggleFamily(family)}
                          className={clsx(
                            "flex items-center space-x-2 p-2 rounded-xl border text-[9.5px] transition-all text-left uppercase",
                            isOwned
                              ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-300 font-bold"
                              : "bg-zinc-900/30 border-zinc-850/60 text-zinc-650 hover:border-zinc-800 hover:text-zinc-400"
                          )}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isOwned ? "#818cf8" : "#27272a" }} />
                          <span className="truncate">{family}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(!activeOrg.ownedFamilies || activeOrg.ownedFamilies.length === 0) ? (
                      <span className="text-[9px] text-zinc-600 italic">No primitive families assigned yet. Click Re-Map to assign categories.</span>
                    ) : (
                      activeOrg.ownedFamilies.map((family) => (
                        <span
                          key={family}
                          className="bg-indigo-950/25 border border-indigo-900/60 rounded-full px-3 py-1 text-[9px] font-bold text-indigo-300 uppercase tracking-wide flex items-center"
                        >
                          {family}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contained Assets Registry */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">
                    Contained Assets Registry ({ownedAssets.length})
                  </span>
                </div>
                <span className="text-[8px] bg-indigo-950 border border-indigo-900 text-indigo-400 px-2 py-0.5 rounded font-black uppercase">
                  Locked Semantics
                </span>
              </div>

              {ownedAssets.length === 0 ? (
                <div className="p-8 border border-dashed border-zinc-900 rounded-[20px] text-center text-[10px] text-zinc-600 font-sans italic">
                  Assign Primitive Families above to preview the dynamic assets managed by this organization.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {ownedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-black/20 border border-zinc-900 rounded-[20px] p-4 flex flex-col justify-between space-y-3 relative group overflow-hidden"
                    >
                      {/* Decorative background aura */}
                      <div className={clsx(
                        "absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20",
                        asset.type === "primitive" ? "bg-blue-500" :
                        asset.type === "strategy" ? "bg-amber-500" : "bg-rose-500"
                      )} />

                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            {asset.type === "primitive" && <Sliders className="w-3.5 h-3.5 text-blue-400" />}
                            {asset.type === "strategy" && <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />}
                            {asset.type === "policy" && <Scale className="w-3.5 h-3.5 text-rose-450" />}
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
                              {asset.id.replace(/_/g, " ")}
                            </span>
                          </div>
                          
                          <span className={clsx(
                            "text-[6.5px] border rounded px-1.5 py-0.5 font-bold uppercase tracking-wider",
                            asset.type === "primitive" ? "bg-blue-950/20 border-blue-900/60 text-blue-450" :
                            asset.type === "strategy" ? "bg-amber-950/20 border-amber-900/60 text-amber-450" :
                            "bg-rose-950/20 border-rose-900/60 text-rose-450"
                          )}>
                            {asset.type}
                          </span>
                        </div>
                        <p className="text-[8.5px] text-zinc-500 font-sans leading-relaxed">
                          {asset.description}
                        </p>
                      </div>

                      <div className="bg-zinc-950/60 rounded-xl px-2.5 py-1.5 text-[7px] text-zinc-650 font-sans italic leading-relaxed border border-zinc-900 flex justify-between items-center relative z-10">
                        <span>{asset.details}</span>
                        <span className="text-[6px] uppercase font-semibold text-zinc-700 bg-zinc-900 px-1 py-0.5 rounded ml-2 shrink-0">
                          {asset.family}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Register Organization Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#09090c] border border-zinc-800 rounded-[30px] p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowOrgModal(false)}
              className="absolute top-4 right-4 text-zinc-550 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest block">
                Platform Architecture
              </span>
              <h3 className="text-sm font-bold text-zinc-150 uppercase">Register New Organization</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[8px] text-zinc-550 font-bold block mb-1">ORGANIZATION ID (LOWERCASE, NO SPACES)</label>
                <input
                  type="text"
                  placeholder="e.g. risk_mitigation_org"
                  value={newOrgId}
                  onChange={(e) => setNewOrgId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-zinc-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[8px] text-zinc-550 font-bold block mb-1">ORGANIZATION DISPLAY NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Risk & Security Ops"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-zinc-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[8px] text-zinc-550 font-bold block mb-1">BOUNDARY RESPONSIBILITY DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Describe the clear ownership scope of this organizational boundary..."
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-zinc-200 text-xs resize-none outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-900">
              <button
                onClick={() => setShowOrgModal(false)}
                className="px-3.5 py-2 border border-zinc-900 rounded-lg text-zinc-550 uppercase font-bold text-[9px] hover:text-zinc-350"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterOrg}
                className="px-3.5 py-2 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white uppercase font-bold text-[9px] shadow-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 8. ENGINEERING RUNTIME TARGETS (5-LAYER ARCHITECTURAL FLOW)
// ==========================================
export function EngineeringRuntimeTargets() {
  const {
    organizations = [],
    primitives = {},
    strategies = [],
    governanceShields = []
  } = useBehaviorStore();

  const [selectedOrgId, setSelectedOrgId] = useState<string>("product_org");
  const activeOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);

  // Derive downstream mapping layers based on active Organization selection
  const activeFamilies = activeOrg ? activeOrg.ownedFamilies || [] : [];
  
  const activeAssets = useMemo(() => {
    const assets: { id: string; name: string; type: "primitive" | "strategy" | "policy"; val: string }[] = [];
    
    // Primitives
    Object.values(primitives).forEach(prim => {
      if (activeFamilies.includes(prim.category)) {
        assets.push({ id: prim.id, name: prim.name, type: "primitive", val: `Base: ${prim.base.toFixed(2)}` });
      }
    });

    // Strategies
    strategies.forEach(strat => {
      const normalizedFam = strat.family === "guidance" ? "Motivation" : "Decision";
      if (activeFamilies.includes(normalizedFam)) {
        assets.push({ id: strat.id, name: strat.name, type: "strategy", val: `Behaviors: ${(strat.conversationalBehaviors || []).length}` });
      }
    });

    // Policies
    governanceShields.forEach(shield => {
      const targetPrim = primitives[shield.targetPrimitiveId];
      const shieldFamily = targetPrim ? targetPrim.category : "Trust";
      if (activeFamilies.includes(shieldFamily)) {
        assets.push({ id: shield.id, name: shield.name, type: "policy", val: `Cap: ${shield.limitType}` });
      }
    });

    return assets;
  }, [activeFamilies, primitives, strategies, governanceShields]);

  const activeTriggers = useMemo(() => {
    const triggers: string[] = [];
    strategies.forEach(s => {
      const normalizedFam = s.family === "guidance" ? "Motivation" : "Decision";
      if (activeFamilies.includes(normalizedFam)) {
        (s.conversationalBehaviors || []).forEach(b => triggers.push(`behavior: ${b}`));
      }
    });
    governanceShields.forEach(sh => {
      const targetPrim = primitives[sh.targetPrimitiveId];
      const shieldFamily = targetPrim ? targetPrim.category : "Trust";
      if (activeFamilies.includes(shieldFamily) && sh.condition) {
        triggers.push(sh.condition);
      }
    });
    return triggers.length > 0 ? triggers : ["No dynamic conditions met. Operating on default limits."];
  }, [activeFamilies, strategies, governanceShields, primitives]);

  return (
    <div className="h-full p-8 overflow-y-auto max-w-6xl font-mono text-zinc-200 custom-scrollbar space-y-6 relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <GitBranch className="w-4 h-4 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest">Architectural Dependency Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
            5-LAYER RUNTIME RESOLUTION MAP
          </h2>
          <p className="text-[10px] text-zinc-450 font-sans leading-relaxed max-w-2xl">
            Click on different Organizations to trace how structural definitions cascade downstream into dynamic strategy actions, linguistic tactics, and final resolved engine outputs.
          </p>
        </div>
      </div>

      {/* Selector Strip */}
      <div className="flex items-center space-x-3 bg-zinc-950/20 border border-zinc-900/60 p-2.5 rounded-[22px]">
        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider pl-3">Filter Pipeline:</span>
        {organizations.map((org) => {
          const isActive = org.id === selectedOrgId;
          return (
            <button
              key={org.id}
              onClick={() => setSelectedOrgId(org.id)}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl text-[9px] uppercase font-bold transition-all border",
                isActive
                  ? "bg-indigo-950/30 border-indigo-500/20 text-indigo-300 font-black shadow-md scale-105"
                  : "bg-transparent border-transparent text-zinc-650 hover:text-zinc-400"
              )}
            >
              {org.name.replace(" Org", "")}
            </button>
          );
        })}
      </div>

      {/* Horizontal Interactive Dependency Graph */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-stretch">
        
        {/* Layer 1: Organization */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-5 space-y-4 flex flex-col">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[7.5px] text-indigo-400 font-bold uppercase block tracking-wider">Layer 01</span>
            <span className="text-[9.5px] font-black text-zinc-200 uppercase tracking-wide block">ORGANIZATION</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {activeOrg && (
              <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-[20px] p-4 text-center space-y-2 relative shadow-lg">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping absolute -top-1 left-1/2 -translate-x-1/2" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide block">{activeOrg.name}</span>
                <p className="text-[8px] text-zinc-550 font-sans leading-relaxed">
                  Enterprise owner establishing strict MECE boundary contracts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Layer 2: Families */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-5 space-y-4 flex flex-col">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[7.5px] text-indigo-400 font-bold uppercase block tracking-wider">Layer 02</span>
            <span className="text-[9.5px] font-black text-zinc-200 uppercase tracking-wide block">MAPPED FAMILIES</span>
          </div>

          <div className="flex-grow flex flex-col justify-center space-y-2">
            {activeFamilies.length === 0 ? (
              <div className="text-[8px] text-zinc-650 italic text-center">No families owned</div>
            ) : (
              activeFamilies.map((family) => (
                <div
                  key={family}
                  onMouseEnter={() => setHoveredFamily(family)}
                  onMouseLeave={() => setHoveredFamily(null)}
                  className="bg-black/20 border border-zinc-850 hover:border-zinc-800 rounded-xl p-2.5 text-center text-[9px] uppercase font-bold text-zinc-300 cursor-help transition-all"
                >
                  {family}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Layer 3: Contained Assets */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-5 space-y-4 flex flex-col">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[7.5px] text-indigo-400 font-bold uppercase block tracking-wider">Layer 03</span>
            <span className="text-[9.5px] font-black text-zinc-200 uppercase tracking-wide block">CONTAINED ASSETS</span>
          </div>

          <div className="flex-grow flex flex-col justify-start space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            {activeAssets.length === 0 ? (
              <div className="text-[8px] text-zinc-650 italic text-center py-4">No assets available</div>
            ) : (
              activeAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-black/25 border border-zinc-900 rounded-xl p-2 flex flex-col space-y-1 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[8.5px] text-zinc-300 uppercase truncate font-bold">{asset.id.replace(/_/g, " ")}</span>
                    <span className={clsx(
                      "text-[5.5px] font-bold uppercase px-1 rounded",
                      asset.type === "primitive" ? "bg-blue-950/45 text-blue-400" :
                      asset.type === "strategy" ? "bg-amber-950/45 text-amber-400" :
                      "bg-rose-950/45 text-rose-400"
                    )}>
                      {asset.type.substring(0, 4)}
                    </span>
                  </div>
                  <span className="text-[6.5px] text-zinc-600 font-mono">
                    {asset.val}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Layer 4: Strategy Orchestration */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-5 space-y-4 flex flex-col">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[7.5px] text-indigo-400 font-bold uppercase block tracking-wider">Layer 04</span>
            <span className="text-[9.5px] font-black text-zinc-200 uppercase tracking-wide block">RUNTIME ENGINE</span>
          </div>

          <div className="flex-grow flex flex-col justify-start space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            <span className="text-[7px] text-zinc-600 uppercase font-black tracking-wide block mb-1">Cascade Triggers</span>
            {activeTriggers.map((trig, idx) => (
              <div
                key={idx}
                className="bg-purple-950/10 border border-purple-500/25 rounded-xl p-2.5 space-y-1 relative shadow"
              >
                <div className="flex items-center space-x-1">
                  <Zap className="w-2.5 h-2.5 text-purple-400 animate-pulse shrink-0" />
                  <span className="text-[7.5px] font-black text-purple-300 uppercase truncate leading-none">Trigger {idx + 1}</span>
                </div>
                <p className="text-[7.5px] text-zinc-500 leading-normal font-sans">
                  {trig}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 5: Output Manifest */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-5 space-y-4 flex flex-col">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[7.5px] text-indigo-400 font-bold uppercase block tracking-wider">Layer 05</span>
            <span className="text-[9.5px] font-black text-zinc-200 uppercase tracking-wide block">OUTPUT MANIFEST</span>
          </div>

          <div className="flex-grow flex flex-col justify-between space-y-2.5">
            <div className="bg-black/45 border border-zinc-900 rounded-xl p-3 font-mono text-[7px] leading-relaxed text-zinc-450 overflow-x-auto select-all max-h-80 custom-scrollbar relative">
              <span className="text-[6.5px] text-emerald-450 font-black uppercase block border-b border-zinc-900/60 pb-1 mb-1">resolved_matrix.yaml</span>
              <pre className="text-zinc-500 font-mono">
                {`contract_owner: "${activeOrg.id}"\n`}
                {`active_families:\n`}
                {activeFamilies.map(f => `  - "${f}"`).join("\n") || "  - none"}
                {`\ncompiled_assets:\n`}
                {activeAssets.map(a => `  - id: "${a.id}"\n    type: "${a.type}"`).join("\n") || "  - none"}
              </pre>
            </div>
            
            <div className="bg-emerald-950/15 border border-emerald-900/35 rounded-xl p-2 text-center">
              <span className="text-[7px] font-black uppercase text-emerald-400 block tracking-wider">Validation Confirmed</span>
              <span className="text-[6px] text-emerald-650 block uppercase font-sans mt-0.5">Asset Pipeline Synchronized</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// 9. ENGINEERING VALIDATION (SAFETY OVERRIDE & MECE ENGINE)
// ==========================================
export function EngineeringValidation() {
  const {
    organizations = [],
    primitives = {},
    governanceShields = []
  } = useBehaviorStore();

  const ALL_FAMILIES = [
    "Cognitive", "Emotional", "Trust", "Decision", "Communication", 
    "Motivation", "Friction", "Persuasion", "Learning", "Temporal", 
    "Identity", "Control", "Context", "Meta-Orchestration"
  ];

  // 1. MECE Verification
  const validationLogs = useMemo(() => {
    const logs: { type: "success" | "warning" | "error"; text: string; details?: string }[] = [];
    
    // Count family mappings
    const familyCounts: Record<string, string[]> = {};
    ALL_FAMILIES.forEach(f => {
      familyCounts[f] = [];
    });

    organizations.forEach(org => {
      (org.ownedFamilies || []).forEach(f => {
        if (familyCounts[f] !== undefined) {
          familyCounts[f].push(org.name);
        }
      });
    });

    // Evaluate maps
    let fullyDisjoint = true;
    let unmappedCount = 0;

    Object.entries(familyCounts).forEach(([family, owners]) => {
      if (owners.length === 0) {
        unmappedCount++;
        fullyDisjoint = false;
        logs.push({
          type: "warning",
          text: `Family '${family}' is unowned.`,
          details: "Structural definitions are temporarily detached from administrative boundary owners."
        });
      } else if (owners.length > 1) {
        fullyDisjoint = false;
        logs.push({
          type: "error",
          text: `Family '${family}' has multiple owners: ${owners.join(", ")}`,
          details: "Resource ownership overlap violates the strict MECE separation model."
        });
      } else {
        logs.push({
          type: "success",
          text: `Family '${family}' mapped cleanly to '${owners[0]}'.`
        });
      }
    });

    return { logs, fullyDisjoint, unmappedCount };
  }, [organizations]);

  return (
    <div className="h-full p-8 overflow-y-auto max-w-6xl font-mono text-zinc-200 custom-scrollbar space-y-6 relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Scale className="w-4 h-4 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest">Architectural Verification Protocol</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
            SEPARATION & GOVERNANCE COMPLIANCE
          </h2>
          <p className="text-[10px] text-zinc-450 font-sans leading-relaxed max-w-2xl">
            Validates ownership MECE uniqueness across Families, ensuring all contained Assets are cleanly partitioned, and proves that Governance Policy limitations always clamp and override organizational inputs at runtime resolution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: MECE Map Verification */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                1. MECE CLUSTER INTEGRITY STATUS
              </span>
              {validationLogs.fullyDisjoint ? (
                <span className="text-[8px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-2.5 py-0.5 rounded font-black uppercase">
                  100% Validated
                </span>
              ) : (
                <span className="text-[8px] bg-amber-950 border border-amber-900 text-amber-400 px-2.5 py-0.5 rounded font-black uppercase animate-pulse">
                  Boundaries Out of Sync
                </span>
              )}
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {validationLogs.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "rounded-xl border p-3 flex items-start space-x-3 text-[9px] leading-relaxed",
                    log.type === "success" && "bg-emerald-950/5 border-emerald-500/10 text-emerald-400/90",
                    log.type === "warning" && "bg-amber-950/5 border-amber-500/10 text-amber-450",
                    log.type === "error" && "bg-rose-950/5 border-rose-500/10 text-rose-450"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{
                    backgroundColor: log.type === "success" ? "#34d399" : log.type === "warning" ? "#fbbf24" : "#f87171"
                  }} />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase block">{log.text}</span>
                    {log.details && <p className="text-[8px] text-zinc-550 font-sans leading-normal">{log.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 flex items-center space-x-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400 opacity-70 shrink-0" />
            <p className="text-[8.5px] text-zinc-500 font-sans leading-relaxed">
              MECE validation ensures zero conflict in state parameter ownership. If overlaps exist, compile routing will halt automatically to prevent operational overrides.
            </p>
          </div>
        </div>

        {/* Right Column: Independent Governance Enforcement Trace */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[24px] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                2. GOVERNANCE SHIELD RESOLUTION COMPLIANCE
              </span>
              <span className="text-[8px] bg-indigo-950 border border-indigo-900 text-indigo-400 px-2 py-0.5 rounded font-black uppercase">
                Clamp Active
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs text-zinc-450 leading-relaxed leading-normal">
              <p>
                To prevent malicious or accidental overrides where an organization modifies a primitive value beyond tolerable human standards, the **Platform Resolution Engine** runs a strict post-resolution override filter.
              </p>

              <div className="bg-black/35 border border-zinc-900 rounded-2xl p-4 space-y-3 font-mono text-[9px] leading-relaxed">
                <span className="text-zinc-650 font-bold block uppercase border-b border-zinc-900 pb-1.5 text-[7px] tracking-wider">
                  Post-Resolution Evaluation Simulation log:
                </span>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-600">
                    <span>1. Base definition ('product_org')</span>
                    <span>brevity = 0.50</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>2. Segment overlay modifier ('marketing_org')</span>
                    <span>brevity ➔ +0.25 (0.75)</span>
                  </div>
                  <div className="flex justify-between text-purple-400">
                    <span>3. Dynamic Strategy ('stress_mitigation')</span>
                    <span>brevity ➔ +0.20 (0.95)</span>
                  </div>
                  
                  <div className="border-t border-dashed border-zinc-900 my-1 pt-1.5 flex justify-between text-rose-400 font-bold">
                    <span className="flex items-center">
                      <AlertOctagon className="w-3 h-3 mr-1 shrink-0" />
                      4. Clamp: Policy 'anti_anxiety_brevity_limit'
                    </span>
                    <span>brevity ➔ CLAMPED at 0.70</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-black border-t border-zinc-900 pt-1.5">
                    <span>Engine Output Resolution Value</span>
                    <span>0.70 (PASSED)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 flex items-center space-x-3">
            <Lock className="w-8 h-8 text-rose-500 opacity-60 shrink-0" />
            <p className="text-[8.5px] text-zinc-500 font-sans leading-relaxed">
              Governance controls run **at the kernel edge**, sandboxing organizational inputs. No organization can bypass a governance policy shield or access the compiler directly without auditing.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
