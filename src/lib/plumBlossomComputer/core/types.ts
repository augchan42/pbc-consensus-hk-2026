/**
 * Plum Blossom Computer Types
 * All TypeScript interfaces for the cosmological computation + reasoning system
 */

import type { PlumBlossomResult } from "@/lib/plumBlossom";
import type { ShaoYongYearResult } from "@/lib/shaoYongCalendar";
import type { MacroCycleContext } from "@/lib/plumBlossomCorrespondences/macroCycles";
import type { CelestialStem, TerrestrialBranch } from "@/lib/plumBlossomCorrespondences/stemsBranches";

// Re-export for convenience
export type { PlumBlossomResult, ShaoYongYearResult, MacroCycleContext, CelestialStem, TerrestrialBranch };

// --- Layer 4: Astronomy ---

export type ZodiacSign =
  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type ZodiacElement = "fire" | "earth" | "air" | "water";

export type PlanetName = "sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn";

export interface PlanetaryPosition {
  planet: PlanetName;
  longitude: number;
  zodiacSign: ZodiacSign;
  element: ZodiacElement;
  degree: number; // degree within sign (0-30)
  isRetrograde: boolean;
}

export type MoonPhaseName =
  | "new" | "waxing_crescent" | "first_quarter" | "waxing_gibbous"
  | "full" | "waning_gibbous" | "third_quarter" | "waning_crescent";

export interface MoonPhaseInfo {
  phase: MoonPhaseName;
  illumination: number; // 0-1
  angle: number; // Sun-Moon angle 0-360
}

// --- Layer 2 extended: Four Pillars ---

export interface Pillar {
  stem: CelestialStem;
  branch: TerrestrialBranch;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

// --- Layer 5: Operational Formulas ---

export type OperationalScale = "\u5341" | "\u767e" | "\u5343" | "\u842c" | "\u5104"; // 十 百 千 萬 億

export type ObservationLevel = "\u76ee" | "\u5fc3" | "\u7406"; // 目 心 理

export interface OperationalScaleResult {
  scale: OperationalScale;
  scaleEnglish: string;
  observationLevel: ObservationLevel;
  observationEnglish: string;
  derivation: string;
}

// --- Reasoning: Branched Model ---

export type AgreementState = "accepted" | "rejected" | "neutral";
export type ScenarioBias = "observe" | "act" | "avoid" | "neutral";

/** A factual observation derived from the timestamp — not toggleable */
export interface Observation {
  label: string;
  detail?: string;
}

/** An interpretive rule that maps observations → bias — toggleable at branch level */
export interface Interpretation {
  bias: ScenarioBias;
  confidence: number;
  rationale: string;
}

/** A semantic group of related observations + their shared interpretation */
export interface ReasoningBranch {
  id: string;
  label: string;
  helpText: string;
  userAgreement: AgreementState;
  observations: Observation[];
  interpretation: Interpretation;
}

/** The combined outcome of all accepted branches */
export interface Synthesis {
  overallBias: ScenarioBias;
  confidence: number;
  rationale: string;
  /** What would change the outcome — computed per-branch */
  sensitivities: SensitivityNote[];
}

/** Describes how rejecting/accepting a branch changes the synthesis */
export interface SensitivityNote {
  branchId: string;
  branchLabel: string;
  currentState: AgreementState;
  /** The bias the synthesis would shift to if this branch were toggled */
  ifToggled: ScenarioBias;
}

export interface ReasoningGraph {
  branches: ReasoningBranch[];
  synthesis: Synthesis;
}

// --- Unified Output ---

export interface CosmologyResult {
  hexagram: {
    timeBased: PlumBlossomResult;
    yearBased: ShaoYongYearResult;
  };
  fourPillars: FourPillars;
  macroCycle: MacroCycleContext;
  planetaryPositions: PlanetaryPosition[];
  moonPhase: MoonPhaseInfo;
  operationalScale: OperationalScaleResult;
}

export interface PlumBlossomComputerResult {
  timestamp: string;
  cosmology: CosmologyResult;
  reasoning: ReasoningGraph;
}
