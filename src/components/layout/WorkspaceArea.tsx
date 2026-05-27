"use client";
import { useBehaviorStore } from "@/store/useBehaviorStore";
import { 
  DomainFoundations, 
  DomainLayeredBehaviors, 
  DomainResolution, 
  DomainStrategies,
  EngineeringContracts,
  EngineeringRuntimeTargets,
  EngineeringValidation
} from "@/components/workspaces/DomainWorkspaces";
import RegistryWorkspace from "@/components/workspaces/RegistryWorkspace";
import ProductWorkspace from "@/components/workspaces/ProductWorkspace";

const workspaceMap: Record<string, React.ComponentType> = {
  foundations: DomainFoundations,
  strategies: DomainStrategies,
  capabilities: RegistryWorkspace,
  outputs: RegistryWorkspace,
  compiler: RegistryWorkspace,
  simulation: DomainResolution,
  llm_settings: DomainResolution,
  git_settings: DomainResolution,
  resolution: DomainResolution,
  contracts: EngineeringContracts,
  runtime_targets: EngineeringRuntimeTargets,
  validation: EngineeringValidation,
};

export default function WorkspaceArea() {
  const { activeL1Domain, activeL2Section } = useBehaviorStore();

  if (activeL1Domain === "capabilities") {
    return <RegistryWorkspace />;
  }

  if (activeL1Domain === "product") {
    return <ProductWorkspace />;
  }

  const SelectedComponent = workspaceMap[activeL2Section] || DomainLayeredBehaviors;
  return <SelectedComponent />;
}
