/**
 * Operational Scales (十/百/千/萬/億)
 * Derives current operational scope from hexagram + planetary state
 */

import type { PlumBlossomResult, PlanetaryPosition, OperationalScaleResult } from "../core/types";
import { OPERATIONAL_SCALES } from "../core/constants";

/**
 * Derive operational scale from hexagram and planetary positions
 *
 * Formula: count active planets (non-retrograde, fire/air element) + hexagram number weight
 * More active = higher operational scope
 */
export function deriveOperationalScale(
  hexagram: PlumBlossomResult,
  planets: PlanetaryPosition[]
): OperationalScaleResult {
  // Count "active" planets: non-retrograde AND fire or air element
  const activePlanets = planets.filter(
    p => !p.isRetrograde && (p.element === "fire" || p.element === "air")
  ).length;

  // Retrograde count adds constraint/depth
  const retrogradeCount = planets.filter(p => p.isRetrograde).length;

  // Scale index: 0-4 based on active planet count
  // 0-1 active = 十, 2 = 百, 3 = 千, 4 = 萬, 5+ = 億
  const scaleIndex = Math.min(activePlanets, 4);
  const scaleInfo = OPERATIONAL_SCALES[scaleIndex];

  // Observation level derived from hexagram conditions
  const { observationLevel, observationEnglish } = deriveObservationLevel(
    hexagram.movingLine,
    retrogradeCount
  );

  return {
    scale: scaleInfo.scale,
    scaleEnglish: scaleInfo.english,
    observationLevel,
    observationEnglish,
    derivation: `${activePlanets} active planets (fire/air, non-retrograde), ${retrogradeCount} retrograde`,
  };
}

function deriveObservationLevel(
  movingLine: number,
  retrogradeCount: number
): { observationLevel: "\u76ee" | "\u5fc3" | "\u7406"; observationEnglish: string } {
  // 理 (Principle): moving line at extremes (1 or 6) + multiple retrogrades = deep pattern
  if ((movingLine === 1 || movingLine === 6) && retrogradeCount >= 2) {
    return { observationLevel: "\u7406", observationEnglish: "Principle" };
  }
  // 心 (Heart): moving line in inner lines (3-4) or tension
  if (movingLine === 3 || movingLine === 4 || retrogradeCount >= 1) {
    return { observationLevel: "\u5fc3", observationEnglish: "Heart" };
  }
  // 目 (Eye): straightforward, outer lines, no retrogrades
  return { observationLevel: "\u76ee", observationEnglish: "Eye" };
}
