import { StateCreator } from "zustand";
import { BehaviorState, Primitive, AuditLog } from "../types";
import { storePrimitives } from "@/constants/primitiveRegistry";

export interface PrimitivesSlice {
  primitives: Record<string, Primitive>;
  selectedPrimitiveId: string;
  updatePrimitiveBase: (id: string, value: number) => void;
  createPrimitive: (primitive: Primitive) => void;
  deletePrimitive: (id: string) => void;
  updatePrimitive: (id: string, updates: Partial<Primitive>) => void;
  setSelectedPrimitive: (id: string) => void;
}

export const createPrimitivesSlice: StateCreator<
  BehaviorState,
  [],
  [],
  PrimitivesSlice
> = (set) => ({
  primitives: storePrimitives,
  selectedPrimitiveId: "expert",

  setSelectedPrimitive: (id) => set({ selectedPrimitiveId: id }),

  updatePrimitiveBase: (id, value) =>
    set((state) => {
      const updated = {
        ...state.primitives,
        [id]: { ...state.primitives[id], base: value }
      };
      
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "John Doe (Marketing Director)",
        actionType: "update_base",
        description: `Modified default base value of ${id} to ${value.toFixed(2)}`
      };

      return {
        primitives: updated,
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  createPrimitive: (primitive) =>
    set((state) => {
      const updated = {
        ...state.primitives,
        [primitive.id]: primitive
      };
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Team Author",
        actionType: "update_base",
        description: `Created new behavioral primitive: "${primitive.id}"`
      };
      return {
        primitives: updated,
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  deletePrimitive: (id) =>
    set((state) => {
      const updated = { ...state.primitives };
      delete updated[id];
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Team Author",
        actionType: "update_base",
        description: `Deleted behavioral primitive: "${id}"`
      };
      return {
        primitives: updated,
        auditLogs: [log, ...state.auditLogs]
      };
    }),

  updatePrimitive: (id, updates) =>
    set((state) => {
      const updated = {
        ...state.primitives,
        [id]: { ...state.primitives[id], ...updates }
      };
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Product Team Author",
        actionType: "update_base",
        description: `Updated metadata for primitive: "${id}"`
      };
      return {
        primitives: updated,
        auditLogs: [log, ...state.auditLogs]
      };
    })
});
