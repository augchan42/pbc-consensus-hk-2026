/**
 * Zodiac sign determination from ecliptic longitude
 */

import type { ZodiacSign, ZodiacElement } from "../core/types";
import { ZODIAC_SIGNS } from "../core/constants";

export interface ZodiacResult {
  sign: ZodiacSign;
  element: ZodiacElement;
  degree: number; // 0-30 within sign
  chinese: string;
}

/**
 * Determine zodiac sign from ecliptic longitude (0-360)
 */
export function zodiacFromLongitude(longitude: number): ZodiacResult {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const info = ZODIAC_SIGNS[signIndex];
  return {
    sign: info.sign,
    element: info.element,
    degree: normalized - info.startDegree,
    chinese: info.chinese,
  };
}
