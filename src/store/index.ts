import { create } from "zustand";
import { BehaviorState } from "./types";
import { createPrimitivesSlice } from "./slices/primitivesSlice";
import { createSegmentsSlice } from "./slices/segmentsSlice";
import { createStrategiesSlice } from "./slices/strategiesSlice";
import { createRegistrySlice } from "./slices/registrySlice";
import { createUiSlice } from "./slices/uiSlice";

export const useBehaviorStore = create<BehaviorState>((...a) => ({
  ...createPrimitivesSlice(...a),
  ...createSegmentsSlice(...a),
  ...createStrategiesSlice(...a),
  ...createRegistrySlice(...a),
  ...createUiSlice(...a),
}));

export { resolveCascade } from "./helpers/resolveCascade";
export type { GovernanceViolation } from "./types";
