"use client";

import { useBehaviorStore } from "@/store/useBehaviorStore";
import { History, GitCommit, User } from "lucide-react";

export default function AuditWorkspace() {
  const { auditLogs } = useBehaviorStore();

  return (
    <div className="h-full bg-[#09090b] text-zinc-100 p-8 overflow-y-auto max-w-4xl font-mono">
      <div className="mb-6">
        <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase tracking-widest mb-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Studio Changelog</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          Audit & Version Control
        </h2>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl">
          Track a complete immutable ledger of behavioral system adjustments. Audit delta creations, compliance limits, and active rollout variants.
        </p>
      </div>

      <div className="space-y-1">
        {auditLogs.map((log) => {
          const formattedDate = new Date(log.timestamp).toLocaleTimeString();
          
          return (
            <div key={log.id} className="relative pl-6 pb-6 last:pb-0 border-l border-zinc-800">
              {/* Timeline dot */}
              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-zinc-950 flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.6)]" />

              <div className="bg-[#111113] border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-800 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-indigo-300 font-mono flex items-center">
                      <GitCommit className="w-3.5 h-3.5 mr-1" /> {log.id}
                    </span>
                    <span className="text-[8px] bg-zinc-800 px-1.5 py-0.2 rounded font-bold uppercase text-zinc-500">
                      {log.actionType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-600 font-mono">{formattedDate}</span>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed">{log.description}</p>

                <div className="flex items-center space-x-1.5 text-[9px] text-zinc-500 font-mono">
                  <User className="w-3 h-3 text-zinc-600" />
                  <span>Author: {log.author}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
