"use client";

import type { PlanetaryPosition, MoonPhaseInfo } from "@/lib/plumBlossomComputer/core/types";
import { ZODIAC_SIGNS } from "@/lib/plumBlossomComputer/core/constants";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  positions: PlanetaryPosition[];
  moonPhase: MoonPhaseInfo;
}

const PLANET_SYMBOLS: Record<string, string> = {
  sun: "\u2609",
  moon: "\u263D",
  mercury: "\u263F",
  venus: "\u2640",
  mars: "\u2642",
  jupiter: "\u2643",
  saturn: "\u2644",
};

const PLANET_CHINESE: Record<string, string> = {
  sun: "日 (太陽)",
  moon: "月 (太陰)",
  mercury: "水星 (辰星)",
  venus: "金星 (太白)",
  mars: "火星 (熒惑)",
  jupiter: "木星 (歲星)",
  saturn: "土星 (鎮星)",
};

const MOON_PHASE_SYMBOLS: Record<string, string> = {
  new: "\u{1F311}",
  waxing_crescent: "\u{1F312}",
  first_quarter: "\u{1F313}",
  waxing_gibbous: "\u{1F314}",
  full: "\u{1F315}",
  waning_gibbous: "\u{1F316}",
  third_quarter: "\u{1F317}",
  waning_crescent: "\u{1F318}",
};

const MOON_PHASE_MEANINGS: Record<string, string> = {
  new: "New beginnings, planting seeds, setting intentions",
  waxing_crescent: "Building momentum, emerging plans, initial growth",
  first_quarter: "Decision point, taking action, overcoming obstacles",
  waxing_gibbous: "Refinement, adjustment, patience before fruition",
  full: "Culmination, clarity, maximum illumination and energy",
  waning_gibbous: "Gratitude, sharing results, dissemination",
  third_quarter: "Release, letting go, reassessment",
  waning_crescent: "Rest, reflection, preparation for renewal",
};

export default function PlanetaryPanel({ positions, moonPhase }: Props) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Planetary
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">Observed</span>
        </div>
        <PanelHelp text="Current geocentric planetary positions computed from astronomical ephemeris data. Each planet's ecliptic longitude determines its zodiac sign. Retrograde (R) marks planets appearing to move backward from Earth's perspective — traditionally significant in both Western astrology and Chinese star lore (占星). Moon phase shows the current lunation cycle, important for timing in Plum Blossom numerology." />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200">
        {/* Planets */}
        <div className="space-y-2">
          {positions.map((planet) => {
            const zodiac = ZODIAC_SIGNS.find(z => z.sign === planet.zodiacSign);
            return (
              <div key={planet.planet} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InfoTip content={PLANET_CHINESE[planet.planet] || planet.planet}>
                    <span className="text-2xl w-8 text-center">{PLANET_SYMBOLS[planet.planet]}</span>
                  </InfoTip>
                  <span className="text-xl uppercase">{planet.planet}</span>
                </div>
                <div className="flex items-center gap-3">
                  <InfoTip content={
                    zodiac ? (
                      <>
                        <div>
                          {zodiac.chinese}
                          {' '}
                          &middot;
                          {' '}
                          {zodiac.element}
                          {' '}
                          element
                        </div>
                        <div className="text-gray-500">
                          {zodiac.startDegree}
                          &deg;–
                          {zodiac.startDegree + 30}
                          &deg; ecliptic
                        </div>
                      </>
                    ) : planet.zodiacSign
                  }
                  >
                    <span className="text-xl text-gray-400">{planet.zodiacSign}</span>
                  </InfoTip>
                  <span className="text-xl text-gray-500">
                    {planet.degree.toFixed(1)}
                    &deg;
                  </span>
                  {planet.isRetrograde && (
                    <InfoTip content="Apparent backward motion — traditionally signals reflection, revision, and reconsideration">
                      <span className="text-xl text-red-500 font-bold">R</span>
                    </InfoTip>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Moon Phase */}
        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InfoTip content={(
                <>
                  <div>{MOON_PHASE_MEANINGS[moonPhase.phase] || moonPhase.phase}</div>
                  <div className="text-gray-500 mt-1">
                    {Math.round(moonPhase.illumination * 100)}
                    % illuminated
                  </div>
                </>
              )}
              >
                <span className="text-3xl">{MOON_PHASE_SYMBOLS[moonPhase.phase]}</span>
              </InfoTip>
              <span className="text-xl">{moonPhase.phase.replace("_", " ")}</span>
            </div>
            <span className="text-xl text-gray-500">
              {Math.round(moonPhase.illumination * 100)}
              % illuminated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
