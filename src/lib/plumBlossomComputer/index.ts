/**
 * Plum Blossom Computer (梅花電腦)
 * Public API
 */

export { computePlumBlossom } from "./engine/compute";
export { recomputeWithToggles } from "./engine/synthesis";

// Types
export type {
  PlumBlossomComputerResult,
  CosmologyResult,
  ReasoningGraph,
  ReasoningBranch,
  Observation,
  Interpretation,
  Synthesis,
  SensitivityNote,
  PlanetaryPosition,
  MoonPhaseInfo,
  FourPillars,
  Pillar,
  OperationalScaleResult,
  AgreementState,
  ScenarioBias,
  MacroCycleContext,
} from "./core/types";
