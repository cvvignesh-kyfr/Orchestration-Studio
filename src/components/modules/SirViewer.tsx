"use client";

import { Braces, Copy, Play, Check } from "lucide-react";
import { useState } from "react";

const mockSIR = {
  version: "1.0.0",
  narrative_id: "late_payment_90dpd",
  emotional_model: {
    user_state: ["anxious", "avoidant", "guilty"],
    target_state: ["reassured", "accountable", "collaborative"],
    intensity: 0.8,
  },
  trust_strategy: {
    stance: "empathetic_partner",
    de_escalation: true,
    intervention_type: "soft_restructure",
  },
  cultural_overlays: {
    language_mode: "hinglish_primary",
    salary_cycle_awareness: true,
    upi_native: true,
  },
  communication_constraints: {
    humor_level: "none",
    pacing: "slow",
    slang_allowance: "minimal",
  },
};

export default function SirViewer() {
  const [copied, setCopied] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockSIR, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompile = () => {
    setCompiling(true);
    setCompileStatus("Parsing intermediate nodes...");
    setTimeout(() => {
      setCompileStatus("Resolving safety boundaries...");
      setTimeout(() => {
        setCompileStatus("Successfully compiled to Antigravity DSL manifest!");
        setCompiling(false);
        setTimeout(() => setCompileStatus(null), 3000);
      }, 1000);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col font-mono text-zinc-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-900/60 pb-5">
        <div>
          <h2 className="text-sm font-bold flex items-center text-zinc-150 uppercase tracking-wider">
            <Braces className="w-4 h-4 mr-2 text-indigo-400" />
            Semantic Intermediate Representation (SIR)
          </h2>
          <p className="text-[11px] text-zinc-500 mt-1 font-sans leading-relaxed">
            The compiled **Semantic Intermediate Representation (SIR)** maps psychological constraints, cultural markers, and pacing rules before resolving to active target runtimes.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleCopy}
            className="flex items-center px-3 py-1.5 bg-[#0f0f13] border border-zinc-850 hover:border-zinc-800 text-[10px] text-zinc-300 rounded-lg transition-all font-bold uppercase shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />}
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          
          <button 
            onClick={handleCompile}
            disabled={compiling}
            className="flex items-center px-3 py-1.5 bg-indigo-650/80 hover:bg-indigo-650 border border-indigo-500/20 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {compiling ? "Compiling..." : "Compile to DSL"}
          </button>
        </div>
      </div>

      {compileStatus && (
        <div className="mb-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 text-[10px] text-indigo-350 animate-fadeIn">
          {compileStatus}
        </div>
      )}

      <div className="flex-1 bg-[#050507] rounded-2xl border border-zinc-900 p-5 overflow-auto custom-scrollbar shadow-inner">
        <pre className="text-[11px] text-zinc-400 font-mono leading-relaxed select-text">
          {JSON.stringify(mockSIR, null, 2).split('\n').map((line, i) => {
            const isKey = line.match(/"([^"]+)":/);
            const isString = line.match(/: "([^"]+)"/);
            const isBoolean = line.match(/: (true|false)/);
            const isNumber = line.match(/: ([0-9.]+)/);
            
            let formattedLine = line;
            if (isKey) formattedLine = formattedLine.replace(/"([^"]+)":/, '<span class="text-indigo-400 font-semibold">"$1"</span>:');
            if (isString) formattedLine = formattedLine.replace(/: "([^"]+)"/, ': <span class="text-emerald-400">"$1"</span>');
            if (isBoolean) formattedLine = formattedLine.replace(/: (true|false)/, ': <span class="text-amber-400 font-bold">$1</span>');
            if (isNumber) formattedLine = formattedLine.replace(/: ([0-9.]+)/, ': <span class="text-blue-400 font-bold">$1</span>');

            return (
              <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
            );
          })}
        </pre>
      </div>
    </div>
  );
}
