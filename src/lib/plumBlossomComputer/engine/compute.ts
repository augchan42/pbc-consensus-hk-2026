/**
 * Main computation orchestrator
 * Combines all layers into PlumBlossomComputerResult
 */

import { Solar } from "lunar-javascript";
import { calculatePlumBlossom } from "@/lib/plumBlossom";
import { getShaoYongYearHexagram } from "@/lib/shaoYongCalendar";
import { getMacroCycleContext } from "@/lib/plumBlossomCorrespondences/macroCycles";
import { CELESTIAL_STEMS, TERRESTRIAL_BRANCHES } from "@/lib/plumBlossomCorrespondences/stemsBranches";
import { calculatePlanetaryPositions } from "../astronomy/planets";
import { calculateMoonPhase } from "../astronomy/moonPhase";
import { deriveOperationalScale } from "../cosmology/operationalScales";
import { buildReasoningGraph } from "../reasoning/graphBuilder";
import type { FourPillars, PlumBlossomComputerResult, CosmologyResult } from "../core/types";

/**
 * Calculate Four Pillars (年月日時) from a date
 * Uses lunar-javascript's Lunar object for stem/branch access
 */
function calculateFourPillars(date: Date): FourPillars {
  const solar = Solar.fromYmdHms(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  const lunar = solar.getLunar();

  // Year pillar
  const yearGan = lunar.getYearGan();
  const yearZhi = lunar.getYearZhi();

  // Month pillar
  const monthGan = lunar.getMonthGan();
  const monthZhi = lunar.getMonthZhi();

  // Day pillar
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();

  // Hour pillar
  const timeGan = lunar.getTimeGan();
  const timeZhi = lunar.getTimeZhi();

  return {
    year: {
      stem: CELESTIAL_STEMS.find(s => s.chinese === yearGan) || CELESTIAL_STEMS[0],
      branch: TERRESTRIAL_BRANCHES.find(b => b.chinese === yearZhi) || TERRESTRIAL_BRANCHES[0],
    },
    month: {
      stem: CELESTIAL_STEMS.find(s => s.chinese === monthGan) || CELESTIAL_STEMS[0],
      branch: TERRESTRIAL_BRANCHES.find(b => b.chinese === monthZhi) || TERRESTRIAL_BRANCHES[0],
    },
    day: {
      stem: CELESTIAL_STEMS.find(s => s.chinese === dayGan) || CELESTIAL_STEMS[0],
      branch: TERRESTRIAL_BRANCHES.find(b => b.chinese === dayZhi) || TERRESTRIAL_BRANCHES[0],
    },
    hour: {
      stem: CELESTIAL_STEMS.find(s => s.chinese === timeGan) || CELESTIAL_STEMS[0],
      branch: TERRESTRIAL_BRANCHES.find(b => b.chinese === timeZhi) || TERRESTRIAL_BRANCHES[0],
    },
  };
}

/**
 * Main computation function - runs all layers client-side
 */
export function computePlumBlossom(input: { date: Date }): PlumBlossomComputerResult {
  // Truncate to whole seconds so the computation is reproducible from
  // the on-chain Unix timestamp (which stores seconds, not milliseconds).
  const date = new Date(Math.floor(input.date.getTime() / 1000) * 1000);

  // Layer 1: Hexagrams (existing)
  const timeBased = calculatePlumBlossom({ gregorianDate: date });
  const yearBased = getShaoYongYearHexagram(date.getUTCFullYear());

  // Layer 2: Four Pillars
  const fourPillars = calculateFourPillars(date);

  // Layer 3: Macro Cycles (existing)
  const macroCycle = getMacroCycleContext(date.getUTCFullYear());

  // Layer 4: Astronomy (new)
  const planetaryPositions = calculatePlanetaryPositions(date);
  const moonPhase = calculateMoonPhase(date);

  // Layer 5: Operational (new)
  const operationalScale = deriveOperationalScale(timeBased, planetaryPositions);

  // Combine cosmology
  const cosmology: CosmologyResult = {
    hexagram: { timeBased, yearBased },
    fourPillars,
    macroCycle,
    planetaryPositions,
    moonPhase,
    operationalScale,
  };

  // Layer 7: Reasoning graph
  const reasoning = buildReasoningGraph(cosmology);

  return {
    timestamp: date.toISOString(),
    cosmology,
    reasoning,
  };
}
