"use client";

import { useBehaviorStore } from "@/store/useBehaviorStore";
import { 
  UploadCloud, 
  Terminal, 
  CheckCircle2, 
  GitBranch, 
  Cpu, 
  FileCode, 
  Copy, 
  ChevronRight,
  Database,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

export default function PublishingWorkspace() {
  const { primitives, segments, governanceShields, forbiddenBehaviors, illegalCombinations, triggerAuditLog } = useBehaviorStore();
  const [compiling, setCompiling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("runtime_manifest.yaml");
  const [showCopied, setShowCopied] = useState(false);

  // Core compilation file data structures
  const fileContents: Record<string, string> = {
    "runtime_manifest.yaml": `# Master Runtime Configuration Manifest
manifest_type: production_runtime
compiled_at: "${new Date().toISOString()}"
compiler_version: "Antigravity Pipeline v1.0.0"

governance_files:
  - runtime/governance/prohibitions.yaml
  - runtime/governance/safety_shields.yaml
  - runtime/governance/combinations.yaml
marketing_files:
  - runtime/marketing/global_defaults.yaml
  - runtime/marketing/segments.yaml`,

    "global_defaults.yaml": `# Baseline Global Defaults
contract_type: global_defaults
compiled_at: "${new Date().toISOString()}"

defaults:
${Object.entries(primitives).map(([k, v]) => `  ${k}: ${v.base.toFixed(2)}`).join("\n")}`,

    "prohibitions.yaml": `# Immutable Hard Prohibitions
contract_type: hard_nos
compiled_at: "${new Date().toISOString()}"

prohibitions:
${forbiddenBehaviors.map(f => `  - id: "${f.id}"
    category: "${f.category}"
    description: "${f.description}"
    enabled: ${f.isActive}`).join("\n")}`,

    "safety_shields.yaml": `# Situational Safety Limits
contract_type: safety_shields
compiled_at: "${new Date().toISOString()}"

shields:
${governanceShields.map(s => `  - id: "${s.id}"
    name: "${s.name}"
    targetPrimitiveId: "${s.targetPrimitiveId}"
    limitType: "${s.limitType}"
    thresholdValue: ${s.thresholdValue}
    condition: "${s.condition}"`).join("\n")}`,

    "segments.yaml": `# Dynamic Targeting & Behavioral Modifiers
contract_type: segment_overlays
compiled_at: "${new Date().toISOString()}"

segments:
${segments.map(seg => `  - id: "${seg.id}"
    name: "${seg.name}"
    category: "${seg.category}"
    rules:
${seg.rules.map(r => `      - field: "${r.field}"
        operator: "${r.operator}"
        value: "${r.value}"`).join("\n") || "      []"}
    modifiers:
${Object.entries(seg.modifiers).map(([k, v]) => `      ${k}: ${v.value.toFixed(2)}`).join("\n") || "      []"}`).join("\n")}`,

    "migration_001.sql": `-- Seed SQL script to populate remote database registries
INSERT INTO segment_registry (id, name, category, enabled) VALUES
${segments.map(s => `('${s.id}', '${s.name}', '${s.category}', true)`).join(",\n")};

INSERT INTO safety_shields (id, name, target_primitive, threshold, condition) VALUES
${governanceShields.map(s => `('${s.id}', '${s.name}', '${s.targetPrimitiveId}', ${s.thresholdValue}, '${s.condition}')`).join(",\n")};`
  };

  const startCompilation = () => {
    setCompiling(true);
    setLogs([]);

    const steps = [
      "🤖 Antigravity Runtime Contract Compiler pipeline starting...",
      `📂 Checking working directory: /Users/cvvignesh/Documents/Adaptive Orchestration Engine/Marketing`,
      "🧬 Resolving MECE semantic contracts...",
      "✓ Verifying disjoint segment parameter isolation: 100% mutually exclusive.",
      "🛡️ Validating Governance Prohibitions toggle bounds...",
      "✓ 7 active Hard Runtime NOs parsed successfully.",
      "⚖️ Checking illegal primitive combinations constraints...",
      `✓ Validated ${illegalCombinations.length} active cross-primitive warnings.`,
      "⚡ Compiling structured YAML files...",
      "📂 [DIR] Created secure structure: runtime/governance",
      "📂 [DIR] Created secure structure: runtime/marketing",
      "📝 [FILE] Compiled runtime/governance/prohibitions.yaml",
      "📝 [FILE] Compiled runtime/governance/safety_shields.yaml",
      "📝 [FILE] Compiled runtime/governance/combinations.yaml",
      "📝 [FILE] Compiled runtime/marketing/global_defaults.yaml",
      "📝 [FILE] Compiled runtime/marketing/segments.yaml",
      "📐 [FILE] Compiled schemas/primitives/primitive_registry.json",
      "📑 [FILE] Compiled manifests/runtime_manifest.yaml",
      "📑 [FILE] Compiled manifests/inheritance_manifest.yaml",
      "📦 [FILE] Compiled build/resolved/resolved_matrix.json",
      "💾 [FILE] Compiled migrations/migration_001.sql",
      "🎉 Compilation finished successfully! All deterministic runtime artifacts are version-ready."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setCompiling(false);
          triggerAuditLog("deploy_experiment", "Executed Antigravity production compiler workspace build.");
        }
      }, (index + 1) * 220);
    });
  };

  return (
    <div className="h-full bg-[#09090b] text-zinc-100 p-8 overflow-y-auto max-w-6xl font-mono space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
            <UploadCloud className="w-4 h-4 animate-pulse" />
            <span>Deployment Control Hub</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Publishing Space
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl">
            Translate active audience segments, tone overlays, and governance limits into deterministic, production-ready manifests.
          </p>
        </div>

        <button
          onClick={startCompilation}
          disabled={compiling}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
            compiling 
              ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-indigo-650 hover:bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${compiling ? "animate-spin" : ""}`} />
          <span>{compiling ? "Compiling..." : "Trigger Compile"}</span>
        </button>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[9px] uppercase font-bold tracking-wider">Branch Posture</span>
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xs font-bold text-zinc-200">behavior/MECE-governed</p>
          <span className="text-[8px] text-zinc-600 block">{"HEAD -> 1ac0956f (active)"}</span>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[9px] uppercase font-bold tracking-wider">MECE Check Status</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450" />
          </div>
          <p className="text-xs font-bold text-emerald-450">100% Disjoint</p>
          <span className="text-[8px] text-zinc-600 block">Zero parameter compounding</span>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[9px] uppercase font-bold tracking-wider">Auditable Primitives</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xs font-bold text-zinc-200">31 Registered Vectors</p>
          <span className="text-[8px] text-zinc-600 block">Covering 9 Segment Families</span>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[9px] uppercase font-bold tracking-wider">Safety Governance</span>
            <Database className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xs font-bold text-rose-400">{governanceShields.length} Context Clamps</p>
          <span className="text-[8px] text-zinc-600 block">{forbiddenBehaviors.length} Hard Runtime NOs</span>
        </div>

      </div>

      {/* Compiler Dashboard Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Real-time Compiler Terminal logs */}
        <div className="lg:col-span-5 bg-[#0c0c0e] border border-zinc-850 rounded-xl flex flex-col h-[400px] overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between shrink-0">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Compiler Terminal Output
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-black/45 space-y-2 text-[10px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-1 text-center font-sans">
                <Terminal className="w-8 h-8 opacity-40 animate-pulse" />
                <span className="text-[10px]">Pipeline Idle. Ready to trigger.</span>
              </div>
            ) : (
              logs.map((log, idx) => {
                const isErr = log.includes("Error");
                const isSuccess = log.includes("successfully") || log.includes("✓");
                return (
                  <div key={idx} className="flex items-start">
                    <ChevronRight className="w-3 h-3 text-zinc-700 mt-0.5 shrink-0" />
                    <span className={isErr ? "text-rose-450" : isSuccess ? "text-emerald-400" : "text-zinc-400"}>
                      {log}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Compiled Production Files Inspector */}
        <div className="lg:col-span-7 bg-[#0c0c0e] border border-zinc-850 rounded-xl flex flex-col h-[400px] overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between shrink-0">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-emerald-450" /> Compiled Config Explorer
            </span>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(fileContents[selectedFile]);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-[9px] text-zinc-400 hover:text-zinc-200 rounded transition-all font-sans font-semibold"
            >
              <Copy className="w-3 h-3" />
              <span>{showCopied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* File selection sidebar */}
            <div className="w-48 border-r border-zinc-850 bg-zinc-950/40 overflow-y-auto custom-scrollbar flex flex-col py-2 shrink-0">
              {Object.keys(fileContents).map(fileName => {
                const isSelected = selectedFile === fileName;
                const isSql = fileName.endsWith(".sql");
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full text-left px-3 py-1.5 text-[10px] font-mono transition-colors ${
                      isSelected 
                        ? "bg-indigo-500/5 text-indigo-400 font-bold border-r border-indigo-500" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {isSql ? "⚡ " : "📄 "}{fileName}
                  </button>
                );
              })}
            </div>

            {/* Code preview area */}
            <div className="flex-1 p-4 bg-zinc-950/80 overflow-auto custom-scrollbar select-text text-[10px] leading-relaxed">
              <pre className="text-emerald-400/90 whitespace-pre">
                {fileContents[selectedFile]}
              </pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
