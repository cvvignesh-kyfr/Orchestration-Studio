"use client";

import Sidebar from "@/components/layout/Sidebar";
import WorkspaceArea from "@/components/layout/WorkspaceArea";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden relative">
      {/* Ambient background glow for psychological warmth */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/8 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. Navigation Sidebar */}
      <Sidebar />

      {/* 2. Primary Workspace Center */}
      <section className="flex-1 h-full overflow-hidden flex flex-col relative z-10">
        <WorkspaceArea />
      </section>
    </main>
  );
}
