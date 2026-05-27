/* eslint-disable */
"use client";

import { useBehaviorStore, Segment, SegmentRule } from "@/store/useBehaviorStore";
import { 
  Users, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Check, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  FileCode,
  Tag
} from "lucide-react";
import { useState } from "react";

// Categorized allowed guidelines
interface CategoryRuleDef {
  allowedPrimitives: string[];
  allowedFamilies: string[];
  title: string;
  description: string;
  badgeColor: string;
}

const CATEGORY_RULES: Record<Segment["category"], CategoryRuleDef> = {
  style: {
    allowedPrimitives: ["warmth", "humor", "enthusiasm", "optimism", "seriousness"],
    allowedFamilies: ["Tone"],
    title: "Conversational Styles",
    description: "Preset baseline tone bundle. Dictates primary expression character.",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20"
  },
  demographic: {
    allowedPrimitives: ["relatability", "authenticity", "companionness", "professionalism"],
    allowedFamilies: ["Identity"],
    title: "Demographic Segments",
    description: "Stable profile traits (age, income level). Forms long-term social indexing.",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  },
  regional: {
    allowedPrimitives: ["code_switching", "slang_density", "cultural_localization"],
    allowedFamilies: ["Regional & Cultural"],
    title: "Regional Segments",
    description: "Active location coordinates. Governs colloquial and linguistic localization.",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20"
  },
  behavioral: {
    allowedPrimitives: ["empathy", "emotional_mirroring", "reassurance", "non_judgment"],
    allowedFamilies: ["Emotional Intelligence"],
    title: "Behavioral Segments",
    description: "Observed financial habits and transaction markers. Drives empathy postures.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  lifecycle: {
    allowedPrimitives: ["encouragement", "delight", "momentum_building"],
    allowedFamilies: ["Engagement"],
    title: "Lifecycle Segments",
    description: "Tenure on system platform. Adapts positive milestones and motivation.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  relationship: {
    allowedPrimitives: ["assertiveness", "proactiveness", "accountability_pressure", "coaching_behavior"],
    allowedFamilies: ["Guidance"],
    title: "Relationship Modes",
    description: "Dynamic brand affinity level. Governs proactive check-ins and direct feedback.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  contextual: {
    allowedPrimitives: ["pacing", "clarity"],
    allowedFamilies: ["Communication"],
    title: "Contextual Modes",
    description: "Real-time situational events (payday, transaction failure). Adapts speed and detail.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  intent: {
    allowedPrimitives: ["brevity", "structure", "directness"],
    allowedFamilies: ["Communication"],
    title: "NLP Intent Modes",
    description: "Turn-level acknowledged user query goals. Adjusts directness and brevity.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  governance: {
    allowedPrimitives: ["compliance_rigidity", "escalation_sensitivity", "transparency"],
    allowedFamilies: ["Safety & Governance"],
    title: "Safety Governance",
    description: "Absolute safety/compliance bounds. Stacks last to clamp any marketing deltas.",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20"
  }
};

export default function SegmentWorkspace() {
  const { 
    segments, 
    createSegment, 
    deleteSegment, 
    addSegmentRule, 
    deleteSegmentRule,
    primitives,
    updateSegmentModifier
  } = useBehaviorStore();

  const [expandedSegId, setExpandedSegId] = useState<string | null>(null);
  
  // Segment creation modal helper
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSegName, setNewSegName] = useState("");
  const [newSegCategory, setNewSegCategory] = useState<Segment["category"]>("style");
  const [newSegDesc, setNewSegDesc] = useState("");

  // Rule construction helpers
  const [newRuleField, setNewRuleField] = useState("age");
  const [newRuleOperator, setNewRuleOperator] = useState<SegmentRule["operator"]>("equals");
  const [newRuleValue, setNewRuleValue] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedSegId(prev => prev === id ? null : id);
  };

  const handleCreateSegment = () => {
    if (!newSegName.trim()) return;

    const id = `${newSegCategory}_${newSegName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
    const description = newSegDesc.trim() || `Custom Segment within ${CATEGORY_RULES[newSegCategory].title}`;
    
    const newSeg: Segment = {
      id,
      name: newSegName.trim(),
      description,
      category: newSegCategory,
      rules: [
        { field: "age", operator: "less_than", value: "30" }
      ],
      modifiers: {}
    };

    // Pre-seed first allowed modifier
    const firstAllowed = CATEGORY_RULES[newSegCategory].allowedPrimitives[0];
    if (firstAllowed) {
      newSeg.modifiers[firstAllowed] = { value: 0.15 };
    }

    createSegment(newSeg);
    setExpandedSegId(id);
    setNewSegName("");
    setNewSegDesc("");
    setShowCreateModal(false);
  };

  const handleAddConstraint = (segId: string) => {
    if (!newRuleValue.trim()) return;

    addSegmentRule(segId, {
      field: newRuleField,
      operator: newRuleOperator,
      value: newRuleValue.trim()
    });
    setNewRuleValue("");
  };

  // Groups list
  const categoryKeys = Object.keys(CATEGORY_RULES) as Segment["category"][];

  return (
    <div className="h-full text-zinc-100 p-8 overflow-y-auto max-w-5xl font-mono space-y-6 bg-transparent relative z-10">
      
      {/* Workspace Header */}
      <div className="flex justify-between items-start border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest mb-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Behavioral Composition Workspace</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Segment & Overlay Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl">
            Configure dynamic audience targeting rules alongside strictly isolated behavioral modifiers. Primitives are 100% disjointly assigned to ensure zero cross-layer compounding overlap.
          </p>
        </div>
        
        <button 
          onClick={() => {
            setNewSegCategory("style");
            setShowCreateModal(true);
          }}
          className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md font-bold uppercase flex items-center shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all"
        >
          <Plus className="w-4 h-4 mr-1 shrink-0" /> New Segment
        </button>
      </div>

      {/* Accordion Categories Grid */}
      <div className="space-y-6">
        {categoryKeys.map((catKey) => {
          const ruleDef = CATEGORY_RULES[catKey];
          const filteredSegments = segments.filter(s => s.category === catKey);

          return (
            <div key={catKey} className="space-y-3 glass rounded-[22px] p-5">
              
              {/* Category Header */}
              <div className="flex items-start justify-between border-b border-zinc-800/40 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-zinc-200 font-sans tracking-tight">
                      {ruleDef.title}
                    </span>
                    <span className={`text-[8px] font-mono border px-2 py-0.2 rounded-full font-bold uppercase ${ruleDef.badgeColor}`}>
                      {filteredSegments.length} Segments
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    {ruleDef.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewSegCategory(catKey);
                    setShowCreateModal(true);
                  }}
                  className="text-[8px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded uppercase flex items-center font-mono"
                >
                  <Plus className="w-3 h-3 mr-0.5" /> Add Segment
                </button>
              </div>

              {/* Segments accordion cards */}
              {filteredSegments.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-zinc-900 rounded-lg text-zinc-600 text-[10px] font-sans">
                  No segments configured in this category.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredSegments.map((seg) => {
                    const isExpanded = expandedSegId === seg.id;
                    const ruleCount = seg.rules.length;
                    const modifierCount = Object.keys(seg.modifiers).length;

                    return (
                      <div 
                        key={seg.id} 
                        className={`transition-all rounded-[22px] ${
                          isExpanded 
                            ? "glass-elevated border border-indigo-500/30 shadow-md" 
                            : "glass hover:border-zinc-700/60"
                        }`}
                      >
                        
                        {/* Segment Card Summary Row */}
                        <div 
                          onClick={() => toggleExpand(seg.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="space-y-1 min-w-0 flex-1 pr-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-zinc-200 hover:text-indigo-400 transition-colors">
                                {seg.name}
                              </span>
                              <span className="text-[8px] text-zinc-500 truncate max-w-xs font-sans">
                                — {seg.description}
                              </span>
                            </div>
                            
                            {/* Summary Metadata Badge */}
                            <div className="flex flex-wrap gap-2 pt-1 items-center">
                              <span className="text-[9px] text-zinc-500 flex items-center font-mono">
                                <Tag className="w-2.5 h-2.5 mr-1 text-zinc-600" />
                                Rules: {ruleCount > 0 ? `${ruleCount} AND filters` : "0 (Always Active)"}
                              </span>
                              
                              {modifierCount > 0 && (
                                <>
                                  <span className="text-[9px] text-zinc-600 font-mono">•</span>
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(seg.modifiers).map(([primId, mod]) => (
                                      <span 
                                        key={primId} 
                                        className="text-[8px] bg-zinc-900 border border-zinc-850 px-1.5 py-0.2 rounded text-zinc-400 font-mono"
                                      >
                                        {primId}: {mod.value > 0 ? "+" : ""}{mod.value.toFixed(2)}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => deleteSegment(seg.id)}
                              className="p-1 hover:text-rose-400 text-zinc-600 transition-colors"
                              title="Delete segment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleExpand(seg.id)}
                              className="p-1 text-zinc-500 hover:text-zinc-300"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Inline Edit Workspace */}
                        {isExpanded && (
                          <div className="border-t border-zinc-900 p-5 bg-black/30 grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-b-[22px]">
                            
                            {/* Logic Rules Creator */}
                            <div className="space-y-4">
                              <div className="flex items-center space-x-1.5 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Dynamic Target Rules (AND-Logic)</span>
                              </div>
                              
                              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                {seg.rules.length === 0 ? (
                                  <div className="text-[10px] text-zinc-600 bg-zinc-950/40 border border-zinc-900 rounded-lg p-3 text-center font-sans">
                                    No targeting criteria set. Applies globally by default.
                                  </div>
                                ) : (
                                  seg.rules.map((rule, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-[10px]">
                                      <div className="flex items-center space-x-2 text-zinc-300">
                                        <span className="text-zinc-500 font-mono">user.{rule.field}</span>
                                        <span className="text-indigo-400 font-mono font-bold uppercase">{rule.operator.replace("_", " ")}</span>
                                        <span className="text-emerald-400">"{rule.value}"</span>
                                      </div>
                                      <button 
                                        onClick={() => deleteSegmentRule(seg.id, idx)}
                                        className="text-zinc-600 hover:text-rose-400 transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* New Rule Input Section */}
                              <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3 space-y-2">
                                <span className="text-[8px] text-zinc-500 font-bold uppercase block tracking-wider">Add Rule Filter</span>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <select 
                                    value={newRuleField}
                                    onChange={(e) => setNewRuleField(e.target.value)}
                                    className="bg-[#09090b] border border-zinc-800 rounded px-2 py-1 text-[9px] text-zinc-300 outline-none"
                                  >
                                    <option value="age">Age</option>
                                    <option value="location">Location</option>
                                    <option value="anxietyLevel">Anxiety Level</option>
                                    <option value="upiUsage">UPI Usage</option>
                                    <option value="preferredLanguage">Language</option>
                                    <option value="salaryStatus">Salary Status</option>
                                  </select>
                                  
                                  <select 
                                    value={newRuleOperator}
                                    onChange={(e) => setNewRuleOperator(e.target.value as any)}
                                    className="bg-[#09090b] border border-zinc-800 rounded px-2 py-1 text-[9px] text-zinc-300 outline-none"
                                  >
                                    <option value="equals">Equals</option>
                                    <option value="greater_than">&gt; Greater</option>
                                    <option value="less_than">&lt; Less</option>
                                    <option value="contains">Contains</option>
                                  </select>

                                  <input 
                                    type="text" 
                                    placeholder="Value"
                                    value={newRuleValue}
                                    onChange={(e) => setNewRuleValue(e.target.value)}
                                    className="bg-[#09090b] border border-zinc-800 rounded px-2 py-1 text-[9px] text-zinc-200 placeholder-zinc-700 outline-none focus:border-indigo-500"
                                  />
                                </div>
                                
                                <button 
                                  onClick={() => handleAddConstraint(seg.id)}
                                  className="w-full py-1 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold uppercase tracking-wider transition-colors"
                                >
                                  + Add Rule filter
                                </button>
                              </div>
                            </div>

                            {/* Behavioral Modifiers Editor */}
                            <div className="space-y-4">
                              <div className="flex items-center space-x-1.5 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Behavioral Modifiers ({ruleDef.allowedFamilies[0]})</span>
                              </div>

                              <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                {Object.values(primitives)
                                  .filter((prim) => ruleDef.allowedPrimitives.includes(prim.id))
                                  .map((prim) => {
                                    const modifier = seg.modifiers[prim.id] || { value: 0.0 };
                                    const newValue = Math.max(0, Math.min(1, prim.base + modifier.value));

                                    return (
                                      <div 
                                        key={prim.id} 
                                        className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all"
                                      >
                                        <div className="min-w-0 pr-2">
                                          <span className="text-xs font-semibold text-zinc-200 block">
                                            {prim.id}
                                          </span>
                                          <div className="flex items-center space-x-2 mt-0.5 text-[8px] text-zinc-500 font-mono">
                                            <span>Default: {prim.base.toFixed(2)}</span>
                                            <span>•</span>
                                            <span className="text-indigo-400 font-bold">New: {newValue.toFixed(2)}</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-2 shrink-0">
                                          <div className="flex flex-col items-end">
                                            <span className="text-[7px] text-zinc-600 font-mono">Delta</span>
                                            <input
                                              type="number"
                                              step="0.01"
                                              min="-1"
                                              max="1"
                                              value={modifier.value}
                                              onChange={(e) => updateSegmentModifier(seg.id, prim.id, parseFloat(e.target.value) || 0)}
                                              className="bg-[#09090b] border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-300 font-mono text-[10px] w-14 text-center focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>

                            {/* tone_contract.yaml Schema Exporter */}
                            <div className="space-y-4 lg:col-span-1 lg:border-l lg:border-zinc-900 lg:pl-6 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-1.5 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>tone_contract.yaml Exporter</span>
                                </div>
                                <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">
                                  Compile this cohort's target logic and active modifiers into a standard, structured tone contract block.
                                </p>

                                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 relative group">
                                  <pre className="text-[9px] text-indigo-300/80 font-mono overflow-x-auto whitespace-pre-wrap select-all leading-relaxed max-h-[170px] custom-scrollbar">
{`contract_type: tone_layer

segment:
  id: "${seg.id}"
  name: "${seg.name}"
  category: "${seg.category}"

targeting_rules:
${seg.rules.map(r => `  - field: "${r.field}"
    operator: "${r.operator}"
    value: "${r.value}"`).join("\n") || "  []"}

behavioral_modifiers:
${Object.entries(seg.modifiers).map(([k, v]) => `  ${k}: ${v.value > 0 ? "+" : ""}${v.value.toFixed(2)}`).join("\n") || "  []"}`}
                                  </pre>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const yamlText = `contract_type: tone_layer\n\nsegment:\n  id: "${seg.id}"\n  name: "${seg.name}"\n  category: "${seg.category}"\n\ntargeting_rules:\n${seg.rules.map(r => `  - field: "${r.field}"\n    operator: "${r.operator}"\n    value: "${r.value}"`).join("\n") || "  []"}\n\nbehavioral_modifiers:\n${Object.entries(seg.modifiers).map(([k, v]) => `  ${k}: ${v.value > 0 ? "+" : ""}${v.value.toFixed(2)}`).join("\n") || "  []"}`;
                                  navigator.clipboard.writeText(yamlText);
                                }}
                                className="w-full text-center py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all"
                              >
                                Copy YAML Schema
                              </button>
                            </div>

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

      {/* Segment Creation modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-elevated rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-xl font-mono">
            <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
              <Users className="w-5 h-5 text-indigo-400 shrink-0" />
              <h3 className="text-sm font-bold text-zinc-100 font-sans">Create Unified Segment</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Segment Category
                </label>
                <select
                  value={newSegCategory}
                  onChange={(e) => setNewSegCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="style">Conversational Style Preset</option>
                  <option value="demographic">Demographic Segment</option>
                  <option value="regional">Regional Segment</option>
                  <option value="behavioral">Behavioral Segment</option>
                  <option value="lifecycle">Lifecycle Segment</option>
                  <option value="relationship">Relationship Affinity Mode</option>
                  <option value="contextual">Contextual Mode</option>
                  <option value="intent">NLP Intent Mode</option>
                  <option value="governance">Safety Governance Mode</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Segment Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. India Gen Z Students"
                  value={newSegName}
                  onChange={(e) => setNewSegName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Explain intent of this cohort segment..."
                  value={newSegDesc}
                  onChange={(e) => setNewSegDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-800 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800/80">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg text-[10px] text-zinc-400 font-bold uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSegment}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] text-white font-bold uppercase shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-pulse"
              >
                Create Segment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
