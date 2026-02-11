/**
 * Moon phase calculation via astronomy-engine
 */

import { MoonPhase as AstroMoonPhase, Illumination, Body, MakeTime } from "astronomy-engine";
import type { MoonPhaseInfo, MoonPhaseName } from "../core/types";

/**
 * Map Sun-Moon angle to 8-phase name
 */
function phaseFromAngle(angle: number): MoonPhaseName {
  if (angle < 22.5) return "new";
  if (angle < 67.5) return "waxing_crescent";
  if (angle < 112.5) return "first_quarter";
  if (angle < 157.5) return "waxing_gibbous";
  if (angle < 202.5) return "full";
  if (angle < 247.5) return "waning_gibbous";
  if (angle < 292.5) return "third_quarter";
  if (angle < 337.5) return "waning_crescent";
  return "new"; // 337.5 - 360
}

/**
 * Calculate moon phase info for a given date
 */
export function calculateMoonPhase(date: Date): MoonPhaseInfo {
  const astroTime = MakeTime(date);
  const angle = AstroMoonPhase(astroTime);
  const illum = Illumination(Body.Moon, astroTime);

  return {
    phase: phaseFromAngle(angle),
    illumination: illum.phase_fraction,
    angle,
  };
}
