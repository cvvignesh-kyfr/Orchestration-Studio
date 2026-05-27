import { StateCreator } from "zustand";
import { BehaviorState } from "../types";

export interface UiSlice {
  activeTab: "defaults" | "segments" | "product" | "simulator" | "governance" | "experiments" | "audit" | "publishing";
  selectedUserId: string;
  activeDomainId: string;
  activeJourneyId: string;
  activeProductPage: "domains" | "behavioral" | "interaction" | "tools" | "artifacts" | "scenarios" | "policies" | "simulations" | "publishing" | "insights";
  activeL1Domain: "marketing" | "product" | "governance" | "engineering" | "capabilities" | "settings";
  activeL2Section: string;

  setActiveTab: (tab: BehaviorState["activeTab"]) => void;
  setSelectedUser: (id: string) => void;
  setActiveDomain: (id: string) => void;
  setActiveJourney: (id: string) => void;
  setActiveProductPage: (page: BehaviorState["activeProductPage"]) => void;
  setActiveL1Domain: (domain: BehaviorState["activeL1Domain"]) => void;
  setActiveL2Section: (section: string) => void;
}

export const createUiSlice: StateCreator<
  BehaviorState,
  [],
  [],
  UiSlice
> = (set) => ({
  activeTab: "simulator",
  selectedUserId: "user_kiara",
  activeDomainId: "financial_decisioning",
  activeJourneyId: "uncertainty_to_confidence",
  activeProductPage: "domains",
  activeL1Domain: "marketing",
  activeL2Section: "foundations",

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (id) => set({ selectedUserId: id }),
  setActiveDomain: (id) => set({ activeDomainId: id }),
  setActiveJourney: (id) => set({ activeJourneyId: id }),
  setActiveProductPage: (page) => set({ activeProductPage: page }),
  
  setActiveL1Domain: (domain) => set({
    activeL1Domain: domain,
    activeL2Section:
      domain === "engineering"
        ? "contracts"
        : domain === "settings"
          ? "llm_settings"
        : domain === "marketing"
          ? "simulation"
        : domain === "product"
          ? "foundations"
          : "foundations"
  }),
  
  setActiveL2Section: (section) => set({ activeL2Section: section })
});
