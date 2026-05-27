"use client";

import { useBehaviorStore, GovernanceShield, ShieldCategory } from "@/store/useBehaviorStore";
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Lock, 
  AlertOctagon, 
  Scale, 
  ShieldX
} from "lucide-react";
import { useState } from "react";

// Categorized allowed guidelines
interface CategoryUiDef {
  title: string;
  description: string;
  badgeColor: string;
  glowColor: string;
}

const SHIELD_UI_MAP: Record<ShieldCategory, CategoryUiDef> = {
  emotional_harm: {
    title: "Emotional Harm Guard",
    description: "Blocks shaming, guilt-tripping, or playing on customer anxieties.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    glowColor: "shadow-[0_0_12px_rgba(244,63,94,0.15)] border-rose-500/30"
  },
  financial_safety: {
    title: "Financial Safety Shield",
    description: "Clamps aggressive recommendations, sales pushes, and transaction traps.",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glowColor: "shadow-[0_0_12px_rgba(99,102,241,0.15)] border-indigo-500/30"
  },
  identity_dignity: {
    title: "Dignity Protection Unit",
    description: "Prevents conversational pretense of human identity or consciousness.",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glowColor: "shadow-[0_0_12px_rgba(14,165,233,0.15)] border-sky-500/30"
  },
  relationship_boundary: {
    title: "Relationship Boundary Block",
    description: "Limits artificial companion loops and synthetic attachments.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowColor: "shadow-[0_0_12px_rgba(168,85,247,0.15)] border-purple-500/30"
  },
  cultural_safety: {
    title: "Cultural Safety Filter",
    description: "Enforces tone gravity, filters slang, and clamps levity in crisis.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "shadow-[0_0_12px_rgba(245,158,11,0.15)] border-amber-500/30"
  },
  behavioral_manipulation: {
    title: "Manipulation Sentinel",
    description: "Prevents dark pattern pacing, artificial urgency, and nudge limits.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowColor: "shadow-[0_0_12px_rgba(16,185,129,0.15)] border-emerald-500/30"
  },
  compliance: {
    title: "Regulatory Compliance Shield",
    description: "Hard clamp limits on legal validation, explanation transparency, and policy metrics.",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    glowColor: "shadow-[0_0_12px_rgba(239,68,68,0.15)] border-red-500/30"
  }
};

export default function GovernanceWorkspace() {
  const { 
    governanceShields, 
    forbiddenBehaviors, 
    illegalCombinations, 
    primitives,
    addGovernanceShield,
    deleteGovernanceShield,
    toggleForbiddenBehavior
  } = useBehaviorStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShieldName, setNewShieldName] = useState("");
  const [newShieldPrimitive, setNewShieldPrimitive] = useState("warmth");
  const [newShieldType, setNewShieldType] = useState<"cap" | "floor">("cap");
  const [newShieldValue, setNewShieldValue] = useState("0.50");
  const [newShieldCondition, setNewShieldCondition] = useState("always");
  const [newShieldCategory, setNewShieldCategory] = useState<ShieldCategory>("financial_safety");
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
      category: newShieldCategory,
      description: newShieldDesc.trim() || `Constitutional boundary limiting ${newShieldPrimitive} output.`
    };

    addGovernanceShield(newShield);
    setNewShieldName("");
    setNewShieldDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="h-full text-zinc-100 p-8 overflow-y-auto max-w-5xl font-mono space-y-8 relative z-10">
      
      {/* Workspace Header */}
      <div className="flex justify-between items-start border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-rose-500 text-[10px] uppercase tracking-widest mb-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Constitutional Sovereignty Center</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Governance & Safety Policy Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl">
            Establish absolute, immutable constraints that operate ABOVE marketing layers, style templates, and user segmentation. All restrictions are validated in-engine to guarantee safe dynamic behavior.
          </p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-md font-bold uppercase flex items-center shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all"
        >
          <Plus className="w-4 h-4 mr-1 shrink-0" /> Add Policy Shield
        </button>
      </div>

      {/* Top Warning Alert */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex items-start space-x-3 max-w-3xl">
        <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-300">Constitutional Precedence: Governance Always Wins</span>
          <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
            Safety boundaries apply strictly at the final step of cascade resolution. If an aggressive marketing preset shifts `assertiveness` to `0.85` inside a financial advice context, the system silently enforces the `0.54` safety cap, maintaining explainability logs at every turn.
          </p>
        </div>
      </div>

      {/* Section 1: Hard Runtime NOs (Prohibitions) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
          <AlertOctagon className="w-4.5 h-4.5 text-rose-500" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Hard Runtime Prohibitions (Immutable Prohibitions)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forbiddenBehaviors.map((behavior) => {
            const uiDef = SHIELD_UI_MAP[behavior.category];
            return (
              <div 
                key={behavior.id} 
                className={`flex items-start justify-between p-4 bg-zinc-950 border rounded-xl transition-all ${
                  behavior.isActive 
                    ? "border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.03)]" 
                    : "border-zinc-900 opacity-60"
                }`}
              >
                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-bold uppercase">
                      NO: {behavior.id}
                    </span>
                    <span className={`text-[8px] border px-1.5 rounded-full font-sans ${uiDef.badgeColor}`}>
                      {uiDef.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                    {behavior.description}
                  </p>
                </div>
                
                {/* Secure Toggle indicator */}
                <button 
                  onClick={() => toggleForbiddenBehavior(behavior.id)}
                  className={`px-2.5 py-1 rounded text-[8px] font-bold uppercase shrink-0 tracking-wider ${
                    behavior.isActive 
                      ? "bg-rose-600 hover:bg-rose-500 text-white" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {behavior.isActive ? "Active Law" : "Disabled"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Policy Shields (Caps and Floors) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
          <Scale className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Primitive Safety Caps & Floors
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {governanceShields.map((shield) => {
            const uiDef = SHIELD_UI_MAP[shield.category];
            return (
              <div 
                key={shield.id} 
                className={`glass rounded-[22px] p-5 flex flex-col justify-between space-y-4 ${uiDef.glowColor}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{shield.name}</h4>
                      <span className={`text-[8px] border px-1.5 py-0.2 rounded-full inline-block mt-1 font-sans ${uiDef.badgeColor}`}>
                        {uiDef.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteGovernanceShield(shield.id)}
                      className="p-1 text-zinc-650 hover:text-rose-400 transition-colors"
                      title="Revoke shield rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                    {shield.description}
                  </p>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-600">Target Variable:</span>
                    <span className="text-zinc-300 font-bold">{shield.targetPrimitiveId}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-600">Enforcement Action:</span>
                    <span className="text-indigo-400 uppercase font-bold">{shield.limitType} limit</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-600">Threshold Bound:</span>
                    <span className="text-rose-400 font-bold font-mono">{shield.thresholdValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-t border-zinc-900 pt-1.5">
                    <span className="text-zinc-600">Active Rule Trigger:</span>
                    <span className="text-emerald-400 font-mono text-[9px] bg-[#050507] border border-zinc-900/80 px-1.5 py-0.2 rounded">
                      {shield.condition}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Illegal Primitive Combinations */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
          <ShieldX className="w-4.5 h-4.5 text-purple-400" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Illegal Primitive Composition Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {illegalCombinations.map((comb) => {
            const uiDef = SHIELD_UI_MAP[comb.category];
            return (
              <div 
                key={comb.id} 
                className="glass hover:border-zinc-700/30 rounded-[22px] p-5 flex flex-col justify-between space-y-3 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-zinc-200">{comb.name}</span>
                    <span className={`text-[8px] border px-1.5 rounded-full font-sans ${uiDef.badgeColor}`}>
                      {uiDef.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                    {comb.explanation}
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 space-y-2">
                  <span className="text-[8px] text-zinc-600 font-bold uppercase block tracking-wider">Unsafe Composition Pattern</span>
                  <div className="flex items-center space-x-2.5">
                    {comb.primitives.map((prim, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[9px]">
                        {idx > 0 && <span className="text-zinc-600 font-bold font-sans">+</span>}
                        <span className="bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400 font-mono">
                          {prim.primitiveId} {prim.operator === "greater_than" ? ">" : "<"} {prim.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-elevated rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <h3 className="text-sm font-bold text-zinc-100 font-sans">Assemble Governance Limit</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                    Shield Category
                  </label>
                  <select
                    value={newShieldCategory}
                    onChange={(e) => setNewShieldCategory(e.target.value as ShieldCategory)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-rose-500 outline-none"
                  >
                    <option value="financial_safety">Financial Safety</option>
                    <option value="emotional_harm">Emotional Harm Guard</option>
                    <option value="identity_dignity">Dignity Protection</option>
                    <option value="relationship_boundary">Relationship Boundary</option>
                    <option value="cultural_safety">Cultural Safety</option>
                    <option value="behavioral_manipulation">Manipulation Sentinel</option>
                    <option value="compliance">Compliance Shield</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                    Target Primitive
                  </label>
                  <select
                    value={newShieldPrimitive}
                    onChange={(e) => setNewShieldPrimitive(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-rose-500 outline-none"
                  >
                    {Object.keys(primitives).map((primId) => (
                      <option key={primId} value={primId}>{primId}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Policy Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Extreme Slang Limit"
                  value={newShieldName}
                  onChange={(e) => setNewShieldName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-800 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                    Action Type
                  </label>
                  <select
                    value={newShieldType}
                    onChange={(e) => setNewShieldType(e.target.value as "cap" | "floor")}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-rose-500 outline-none"
                  >
                    <option value="cap">CAP (Upper Boundary)</option>
                    <option value="floor">FLOOR (Lower Boundary)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                    Limit Bound (0.0 - 1.0)
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={newShieldValue}
                    onChange={(e) => setNewShieldValue(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Active Context Trigger
                </label>
                <select
                  value={newShieldCondition}
                  onChange={(e) => setNewShieldCondition(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-rose-500 outline-none"
                >
                  <option value="always">Always Active (Universal Cap)</option>
                  <option value="anxietyLevel == high">High Anxiety State</option>
                  <option value="upiUsage == heavy">Heavy Transaction Context</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Policy Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Explain why this constitutional law limit is required..."
                  value={newShieldDesc}
                  onChange={(e) => setNewShieldDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-800 focus:ring-1 focus:ring-rose-500 outline-none resize-none font-sans"
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
                onClick={handleCreateShield}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-[10px] text-white font-bold uppercase shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              >
                Enforce Shield
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
