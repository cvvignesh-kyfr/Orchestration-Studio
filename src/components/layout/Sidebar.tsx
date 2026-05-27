"use client";

import { 
  Sliders, 
  Tv, 
  ShieldCheck, 
  Compass,
  Layers,
  GitBranch,
  Wrench,
  Cpu,
  Code,
  FileCheck,
  Terminal,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Lock,
  Database,
  Settings2
} from "lucide-react";
import { useBehaviorStore } from "@/store/useBehaviorStore";
import clsx from "clsx";

export default function Sidebar() {
  const { 
    activeL1Domain, 
    activeL2Section, 
    setActiveL1Domain, 
    setActiveL2Section 
  } = useBehaviorStore();

  // Definition of domains following STRICT Organizational Separation Architecture
  const domains = [
    { 
      id: "marketing", 
      label: "Marketing", 
      role: "Behavioral Definition",
      principle: "Defines WHAT the assistant should feel like",
      icon: Sparkles, 
      color: "shadow-[0_0_12px_rgba(236,72,153,0.3)] text-pink-400 border-pink-500/30 bg-pink-500/5" 
    },
    { 
      id: "product", 
      label: "Product", 
      role: "Behavioral Execution",
      principle: "Defines HOW the assistant behaves",
      icon: Compass, 
      color: "shadow-[0_0_12px_rgba(99,102,241,0.3)] text-indigo-400 border-indigo-500/30 bg-indigo-500/5" 
    },
    { 
      id: "governance", 
      label: "Governance", 
      role: "Governance Enforcement",
      principle: "Defines WHAT is allowed",
      icon: ShieldCheck, 
      color: "shadow-[0_0_12px_rgba(239,68,68,0.3)] text-rose-450 border-rose-550/30 bg-rose-550/5" 
    },
    { 
      id: "capabilities", 
      label: "Capabilities", 
      role: "Shared Organizational Registry",
      principle: "Unified capability and tool registry",
      icon: Wrench, 
      color: "shadow-[0_0_12px_rgba(255,165,0,0.3)] text-orange-400 border-orange-500/30 bg-orange-500/5" 
    },
    {
      id: "settings",
      label: "Settings",
      role: "Configuration",
      principle: "Manage LLM and Git publishing configuration",
      icon: Settings2,
      color: "shadow-[0_0_12px_rgba(148,163,184,0.3)] text-slate-300 border-slate-500/30 bg-slate-500/5"
    },
  ] as const;

  // L2 structure generator based on active L1 domain
  const getL2Items = () => {
    if (activeL1Domain === "engineering") {
      return [
        { id: "contracts", label: "Contracts", icon: Code },
        { id: "runtime_targets", label: "Runtime Targets", icon: Cpu },
        { id: "validation", label: "Validation", icon: FileCheck },
        { id: "compiler", label: "Compiler", icon: Terminal }
      ];
    }

    if (activeL1Domain === "product") {
      return [
        { id: "understanding", label: "1. Understanding", icon: Sliders },
        { id: "direction", label: "2. Direction", icon: GitBranch },
        { id: "behavior", label: "3. Behavior", icon: Zap },
        { id: "execution", label: "4. Execution", icon: Wrench },
        { id: "control", label: "5. Control", icon: ShieldCheck }
      ];
    }

    if (activeL1Domain === "capabilities") {
      return [
        { id: "capabilities", label: "Capability Registry", icon: Wrench },
        { id: "tools", label: "Tools & Actions", icon: Wrench },
        { id: "artifacts", label: "Artifacts", icon: Database },
        { id: "execution_semantics", label: "Execution Semantics", icon: Terminal },
        { id: "input_contracts", label: "Input Contracts", icon: Code },
        { id: "output_contracts", label: "Output Contracts", icon: Layers },
        { id: "runtime_contracts", label: "Runtime Contracts", icon: FileCheck },
        { id: "resolver", label: "Capability Resolver", icon: Sliders },
        { id: "event_triggers", label: "Event Triggers", icon: Target },
        { id: "permissions", label: "Permissions", icon: Lock },
        { id: "observability", label: "Observability", icon: BarChart3 },
        { id: "execution_policies", label: "Execution Policies", icon: ShieldCheck }
      ];
    }
    if (activeL1Domain === "settings") {
      return [
        { id: "llm_settings", label: "LLM Settings", icon: Settings2 },
        { id: "git_settings", label: "GIT Settings", icon: GitBranch }
      ];
    }

    const behaviorLabel = 
      activeL1Domain === "marketing" ? "Modifiers" : "Policies";

    const behaviorIcon = 
      activeL1Domain === "marketing" ? Layers : ShieldCheck;

    const items = [
      { id: "foundations", label: "Foundations", icon: Sliders },
      { id: "behaviors", label: behaviorLabel, icon: behaviorIcon }
    ];

    if (activeL1Domain !== "marketing") {
      items.push(
        { id: "capabilities", label: "Capability Registry", icon: Wrench }
      );
    }
    if (activeL1Domain === "marketing") {
      items.push({ id: "simulation", label: "Simulation", icon: Tv });
    } else {
      items.push({ id: "resolution", label: "Resolution", icon: Tv });
    }

    return items;
  };

  const l2Items = getL2Items();

  return (
    <div className="w-64 h-full bg-[#070709] border-r border-zinc-900/60 flex z-10 shadow-xl shrink-0 select-none overflow-hidden font-mono">
      
      {/* 1. Far Left L1 Icon Strip */}
      <div className="w-16 h-full bg-[#050507] border-r border-zinc-900/50 flex flex-col items-center py-6 justify-between shrink-0">
        
        <div className="flex flex-col items-center">
          {/* Brand Logo (2x size) */}
          <img
            src="/kyfr-logo.png"
            alt="KYFR"
            className="w-[72px] h-[72px] object-contain rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-transform hover:scale-105"
          />
        </div>

        {/* L1 Switcher Buttons */}
        <div className="flex flex-col space-y-4 my-auto">
          {domains.map((dom) => {
            const isActive = activeL1Domain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveL1Domain(dom.id)}
                title={`${dom.label} Ownership Domain`}
                className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 relative group",
                  isActive 
                    ? dom.color
                    : "border-transparent text-zinc-550 hover:text-zinc-300"
                )}
              >
                <dom.icon className="w-4.5 h-4.5 shrink-0" />
                
                {/* High-Fidelity Enterprise Tooltip */}
                <div className="absolute left-14 bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col space-y-1 min-w-[160px] select-none">
                  <span className="text-[9px] uppercase font-black text-zinc-150 tracking-wider">{dom.label}</span>
                  <span className="text-[7.5px] uppercase font-black text-indigo-400">{dom.role}</span>
                  <span className="text-[7.5px] font-sans text-zinc-500 max-w-[150px] whitespace-normal leading-normal">{dom.principle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Operational Indicator */}
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="System Engine Online" />
      </div>

      {/* 2. Right L2 Menu Tree */}
      <div className="flex-1 h-full bg-[#09090c]/40 backdrop-blur-xl flex flex-col py-6 px-3.5 justify-between text-left">
        
        {/* Navigation Group */}
        <div className="space-y-4">
          <div className="px-3 border-l-2 border-indigo-500/20 pl-2.5 py-0.5 space-y-0.5">
            <span className="text-[7.5px] text-indigo-400 font-black uppercase tracking-widest block mb-0.5 animate-pulse">
              {activeL1Domain === "marketing" ? "Behavioral Definition" :
               activeL1Domain === "product" ? "Behavioral Execution" :
               activeL1Domain === "governance" ? "Governance Enforcement" : "Runtime Resolution"}
            </span>
            <span className="text-[10px] text-zinc-200 font-bold uppercase tracking-wider block">
              {activeL1Domain === "engineering" ? "Runtime" : activeL1Domain} DOMAIN
            </span>
            <span className="text-[8px] text-zinc-500 font-sans leading-snug block">
              {activeL1Domain === "marketing" ? "Defines WHAT the assistant should feel like" :
               activeL1Domain === "product" ? "Defines HOW the assistant behaves" :
               activeL1Domain === "governance" ? "Defines WHAT is allowed" : "Decides WHAT executes now"}
            </span>
          </div>

          <div className="space-y-1">
            {l2Items.map((item) => {
              const isActive = activeL2Section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveL2Section(item.id)}
                  className={clsx(
                    "w-full flex items-center justify-start space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all relative group overflow-hidden border text-left",
                    isActive 
                      ? "text-indigo-300 bg-indigo-500/5 border-indigo-500/20 font-semibold" 
                      : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/20"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User profile capsule */}
        <div className="p-3 border border-zinc-900/60 rounded-xl bg-zinc-950/20 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-300 truncate">John Doe</p>
            <p className="text-[7.5px] text-zinc-600 truncate uppercase font-bold tracking-wider">
              {activeL1Domain === "marketing" ? "Behavioral Definition Lead" :
               activeL1Domain === "product" ? "Behavioral Execution Lead" :
               activeL1Domain === "governance" ? "Governance Officer" : "Runtime Resolution Arch"}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
