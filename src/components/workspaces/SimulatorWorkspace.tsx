"use client";

import { useBehaviorStore, resolveCascade, GovernanceViolation } from "@/store/useBehaviorStore";
import { 
  Tv, 
  Sparkles, 
  User, 
  ShieldAlert, 
  ArrowRight, 
  CheckSquare, 
  Square,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import { useState, useMemo } from "react";

export default function SimulatorWorkspace() {
  const { 
    primitives, 
    mockUsers, 
    selectedUserId, 
    setSelectedUser, 
    segments, 
    governanceShields, 
    illegalCombinations,
    toggleMockUserContext 
  } = useBehaviorStore();

  const [activeSegmentIds, setActiveSegmentIds] = useState<string[]>(["india_genz", "bangalore_urban", "mode_financial_anxiety"]);
  const [selectedPrimId, setSelectedPrimId] = useState<string>("warmth");

  const user = mockUsers.find(u => u.id === selectedUserId) || mockUsers[0];
  const activePrimitive = primitives[selectedPrimId] || Object.values(primitives)[0];

  const toggleSegmentSelection = (sId: string) => {
    setActiveSegmentIds(prev => 
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
  };

  // 1. Resolve selected primitive cascade trace
  const cascade = resolveCascade(activePrimitive, activeSegmentIds, segments, user, governanceShields, illegalCombinations);

  // 2. Resolve all primitives to detect global active safety combination violations
  const globalViolations = useMemo(() => {
    const resolvedPostures: Record<string, number> = {};
    
    // Resolve final scalar for each primitive
    Object.values(primitives).forEach(prim => {
      const { finalValue } = resolveCascade(prim, activeSegmentIds, segments, user, governanceShields, []);
      resolvedPostures[prim.id] = finalValue;
    });

    const activeViolations: GovernanceViolation[] = [];

    // Verify combinations
    illegalCombinations.forEach(comb => {
      let isTriggered = true;
      const offendingValues: Record<string, number> = {};

      for (const rule of comb.primitives) {
        const currentVal = resolvedPostures[rule.primitiveId] ?? 0;
        const isViolated = rule.operator === "greater_than"
          ? currentVal > rule.value
          : currentVal < rule.value;

        if (!isViolated) {
          isTriggered = false;
          break;
        }
        offendingValues[rule.primitiveId] = currentVal;
      }

      if (isTriggered) {
        activeViolations.push({
          combinationId: comb.id,
          name: comb.name,
          explanation: comb.explanation,
          category: comb.category,
          offendingValues
        });
      }
    });

    return activeViolations;
  }, [primitives, activeSegmentIds, segments, user, governanceShields, illegalCombinations]);

  return (
    <div className="flex h-full bg-[#09090b] text-zinc-100 font-mono overflow-hidden">
      
      {/* Simulation Controls Panel */}
      <div className="w-80 border-r border-zinc-800/60 bg-[#0c0c0e] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
            <Tv className="w-3.5 h-3.5 mr-1 text-indigo-400 shrink-0 animate-pulse" /> Simulation Sandbox
          </span>
        </div>

        {/* User Selection */}
        <div className="p-4 border-b border-zinc-900 space-y-2">
          <label className="block text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Select Mock User Context</label>
          <div className="space-y-1.5">
            {mockUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors border ${
                  user.id === u.id 
                    ? "bg-indigo-500/5 border-indigo-500/40 text-indigo-300 font-semibold shadow-[0_0_6px_rgba(99,102,241,0.1)]" 
                    : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="truncate">{u.name} (Age {u.age})</span>
                <User className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* User Dynamic Attributes toggler */}
        <div className="p-4 border-b border-zinc-900 space-y-3">
          <label className="block text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Mock User Attributes</label>
          <div className="space-y-2.5">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">Anxiety Level</span>
              <select
                value={user.anxietyLevel}
                onChange={(e) => toggleMockUserContext(user.id, "anxietyLevel", e.target.value as "low" | "medium" | "high")}
                className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">UPI Usage</span>
              <select
                value={user.upiUsage}
                onChange={(e) => toggleMockUserContext(user.id, "upiUsage", e.target.value as "low" | "heavy")}
                className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">Salary Status</span>
              <select
                value={user.salaryStatus}
                onChange={(e) => toggleMockUserContext(user.id, "salaryStatus", e.target.value as "credited" | "delayed")}
                className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
              >
                <option value="credited">Credited</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

          </div>
        </div>

        {/* Fused Segment eligibility toggles */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
          <label className="block text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Active Segment Overlays</label>
          <div className="space-y-1.5">
            {segments.map((s) => {
              const isSelected = activeSegmentIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSegmentSelection(s.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left text-[11px] transition-colors ${
                    isSelected 
                      ? "bg-[#111113] border-zinc-850 text-zinc-200" 
                      : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Cascade Debugger Area */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        
        <div>
          <div className="flex items-center space-x-1.5 text-zinc-600 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Resolution Cascade Engine</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Live Cascade Resolution
          </h2>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-sans">
            Inspect the step-by-step stacking order of active cohorts and policy shields that build the resolved state.
          </p>
        </div>

        {/* Primitive selector chips */}
        <div className="flex flex-wrap gap-1.5 bg-[#0b0b0d] border border-zinc-900 rounded-xl p-3.5">
          {Object.values(primitives).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrimId(p.id)}
              className={`text-[10px] px-2.5 py-1 rounded transition-all font-mono font-semibold border ${
                selectedPrimId === p.id 
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
                  : "bg-zinc-950 text-zinc-500 border-zinc-850/40 hover:text-zinc-300"
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Live Safety violation board */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1 text-rose-500" /> Dynamic Governance Audit ({globalViolations.length} Warnings)
            </span>
          </div>

          {globalViolations.length === 0 ? (
            <div className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[10px] text-emerald-400 font-sans">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Perfect Alignment. Active resolved posture perfectly complies with all constitutional safety shields.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {globalViolations.map((violation) => (
                <div 
                  key={violation.combinationId} 
                  className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-[0_0_12px_rgba(244,63,94,0.02)]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                      <span className="text-xs font-bold text-rose-300">{violation.name}</span>
                    </div>
                    <p className="text-[10px] text-rose-400/80 font-sans leading-relaxed">
                      {violation.explanation}
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 space-y-1 text-[9px] font-mono text-zinc-500">
                    <span className="text-rose-400 uppercase font-bold block mb-1">Violation Parameters</span>
                    {Object.entries(violation.offendingValues).map(([pId, val]) => (
                      <div key={pId} className="flex justify-between items-center">
                        <span>resolved.{pId}:</span>
                        <span className="text-rose-400 font-bold">{val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cascade Visual Stacking Timeline */}
        <div className="bg-[#111113] border border-zinc-800/80 rounded-xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{activePrimitive.id} Cascade Tree</span>
            <span className="text-[9px] text-zinc-500">{activePrimitive.path}</span>
          </div>

          <div className="space-y-3">
            {cascade.steps.map((step, idx) => {
              const isBase = step.sourceType === "base";
              const isGov = step.sourceType === "governance";
              const isPositive = step.delta > 0;

              return (
                <div key={idx} className="flex items-center justify-between bg-zinc-950/40 border border-zinc-900 rounded-lg p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {isGov && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />}
                      <span className={`text-xs font-semibold ${
                        isGov ? "text-rose-400" : 
                        step.category === "product" ? "text-indigo-350" :
                        isBase ? "text-zinc-400" : "text-zinc-200"
                      }`}>
                        {step.sourceName}
                      </span>
                      {step.category !== undefined && (
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase border ${
                          step.category === "product"
                            ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                            : step.category === "governance"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          {step.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!isBase && (
                      <span className={`text-[10px] font-mono ${isGov ? "text-rose-400" : isPositive ? "text-emerald-400" : "text-amber-400"}`}>
                        {isPositive ? "+" : ""}{step.delta.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 font-mono">
                      {step.runningValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Resolution Bar */}
          <div className="border-t border-zinc-800/60 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-xs text-zinc-400 font-mono">Resolved Output Value</div>
              <ArrowRight className="w-4 h-4 text-zinc-600" />
              <div className="text-sm text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.15)] font-mono">
                {cascade.finalValue.toFixed(2)}
              </div>
            </div>
            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Cascade Complete</span>
          </div>
        </div>

      </div>
    </div>
  );
}
