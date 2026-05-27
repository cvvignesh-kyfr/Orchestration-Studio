import { 
  Cpu, Wrench, Database, Terminal, Code, Layers, FileCheck, Sliders, 
  Target, Lock, BarChart3, ShieldCheck 
} from "lucide-react";

export const MENU = [
  { id: "capabilities", label: "Capabilities", icon: Cpu },
  { id: "tools", label: "Tools & Actions", icon: Wrench },
  { id: "artifacts", label: "Artifacts", icon: Database, sub: [
    { id: "persistent", label: "Persistent Artifacts" },
    { id: "moment", label: "Moment Artifacts" },
    { id: "momentum", label: "Momentum Artifacts" }
  ]},
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
