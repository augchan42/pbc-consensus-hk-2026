/**
 * Scenario generation rules
 * Deterministic bias derivation from node values
 */

import type { ScenarioBias } from "../core/types";
import { OBSERVE_HEXAGRAMS, ACT_HEXAGRAMS, AVOID_HEXAGRAMS } from "../core/constants";

/**
 * Determine scenario bias from hexagram number
 */
export function hexagramBias(hexNumber: number): ScenarioBias {
  if (OBSERVE_HEXAGRAMS.includes(hexNumber)) return "observe";
  if (ACT_HEXAGRAMS.includes(hexNumber)) return "act";
  if (AVOID_HEXAGRAMS.includes(hexNumber)) return "avoid";
  return "neutral";
}

/**
 * Determine bias from retrograde count
 * More retrogrades = more caution
 */
export function retrogradeBias(count: number): ScenarioBias {
  if (count >= 3) return "avoid";
  if (count >= 2) return "observe";
  if (count === 1) return "neutral";
  return "act";
}

/**
 * Determine bias from element harmony
 * Fire-Water tension = caution, Wood-Fire support = action
 */
export function elementHarmonyBias(
  hexElement: string,
  dominantPlanetaryElement: string
): ScenarioBias {
  // Destructive cycle pairs
  const destructive: [string, string][] = [
    ["fire", "water"], ["water", "fire"],
    ["metal", "fire"], ["fire", "metal"],
    ["wood", "metal"], ["metal", "wood"],
  ];

  // Productive cycle pairs
  const productive: [string, string][] = [
    ["wood", "fire"], ["fire", "earth"],
    ["earth", "metal"], ["metal", "water"],
    ["water", "wood"],
  ];

  if (destructive.some(([a, b]) => a === hexElement && b === dominantPlanetaryElement)) {
    return "avoid";
  }
  if (productive.some(([a, b]) => a === hexElement && b === dominantPlanetaryElement)) {
    return "act";
  }
  return "neutral";
}

/**
 * Moon phase bias
 * New/waxing = initiate, full = culminate/observe, waning = retreat
 */
export function moonPhaseBias(phase: string): ScenarioBias {
  switch (phase) {
    case "new":
    case "waxing_crescent":
      return "act";
    case "first_quarter":
    case "waxing_gibbous":
      return "neutral";
    case "full":
      return "observe";
    case "waning_gibbous":
    case "third_quarter":
      return "observe";
    case "waning_crescent":
      return "avoid";
    default:
      return "neutral";
  }
}

/**
 * Aggregate multiple biases into a final bias
 * Simple voting: count each bias type, majority wins
 */
export function aggregateBiases(biases: ScenarioBias[]): ScenarioBias {
  const counts: Record<ScenarioBias, number> = { observe: 0, act: 0, avoid: 0, neutral: 0 };
  for (const b of biases) counts[b]++;

  // Avoid wins ties with act (caution principle)
  if (counts.avoid > counts.act && counts.avoid > counts.observe) return "avoid";
  if (counts.act > counts.avoid && counts.act > counts.observe) return "act";
  if (counts.observe > 0) return "observe";
  return "neutral";
}
