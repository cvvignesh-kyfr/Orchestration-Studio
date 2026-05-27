/* eslint-disable */
import { useState } from "react";
import { Sparkles, Hash, AlertCircle, Target, Users } from "lucide-react";

export default function NarrativeWorkspace() {
  const [content, setContent] = useState(
    "The user just missed their third EMI payment. They are likely feeling extremely anxious and avoiding our calls. We need to approach this not as a collection agency, but as a financial partner. Let's use a soft, empathetic tone to understand the root cause before suggesting a restructuring plan."
  );

  return (
    <div className="h-full flex text-foreground">
      {/* Main Editor Area */}
      <div className="flex-1 max-w-4xl mx-auto py-12 px-8 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <input
            type="text"
            defaultValue="Late Payment - 90 DPD Recovery"
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-600 focus:ring-0 p-0 text-zinc-100"
            placeholder="Untitled Narrative..."
          />
        </div>

        <div className="relative group flex-1">
          <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-surface rounded-md text-zinc-400 hover:text-white border border-border">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[500px] resize-none bg-transparent border-none outline-none text-lg text-zinc-300 leading-relaxed placeholder:text-zinc-600"
            placeholder="Start typing your narrative..."
          />
        </div>
      </div>

      {/* Right Sidebar - Emotional & Context Tagging */}
      <div className="w-80 bg-surface/50 border-l border-border p-6 overflow-y-auto hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Semantic Context</h3>
          <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium hover:bg-primary/20 transition-colors">
            Auto-Extract
          </button>
        </div>

        <div className="space-y-6">
          <ContextSection title="Audience" icon={Users} items={["Gen Z", "Tier 1 City", "Startup Employee"]} />
          <ContextSection title="Emotional State" icon={AlertCircle} items={["Anxious", "Avoidant", "Guilty"]} />
          <ContextSection title="Trust Strategy" icon={Target} items={["Empathetic", "De-escalation", "Partner"]} />
          <ContextSection title="Cultural Tags" icon={Hash} items={["Hinglish", "Salary Cycle", "UPI Native"]} />
        </div>
      </div>
    </div>
  );
}

function ContextSection({ title, icon: Icon, items }: { title: string, icon: any, items: string[] }) {
  return (
    <div>
      <div className="flex items-center text-zinc-400 mb-3">
        <Icon className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className="px-2.5 py-1 bg-surface-hover border border-border text-xs rounded-full text-zinc-300">
            {item}
          </span>
        ))}
        <button className="px-2.5 py-1 border border-dashed border-border text-xs rounded-full text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors">
          + Add
        </button>
      </div>
    </div>
  );
}
