"use client";

import type { ReactNode } from "react";
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
  mercury: "水星 (辰星) — Water 水",
  venus: "金星 (太白) — Metal 金",
  mars: "火星 (熒惑) — Fire 火",
  jupiter: "木星 (歲星) — Wood 木",
  saturn: "土星 (鎮星) — Earth 土",
};

/** Wu Xing element for each planet (Sun/Moon are luminaries, not elemental) */
const PLANET_WUXING: Record<string, string | null> = {
  sun: null,
  moon: null,
  mercury: "water",
  venus: "metal",
  mars: "fire",
  jupiter: "wood",
  saturn: "earth",
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

/** Wu Xing productive cycle: A produces B */
const WU_XING_PRODUCES: Record<string, string> = {
  wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
};

/** Wu Xing descriptive relationships */
const WU_XING_ZODIAC_INTERACTION: Record<string, Record<string, string>> = {
  wood: {
    fire: "Wood feeds Fire — productive, growth energy amplified",
    earth: "Wood controls Earth — roots stabilizing ground",
    water: "Water nourishes Wood — supported, replenished",
    air: "Wood in Air — expansive ideas, scattered growth",
  },
  fire: {
    fire: "Fire meets Fire — intensified, potentially excessive",
    earth: "Fire creates Earth — transformative, productive output",
    water: "Water controls Fire — tension, suppressed energy",
    air: "Fire in Air — rapid spread, volatile brilliance",
  },
  earth: {
    fire: "Fire nourishes Earth — productive, stabilizing heat",
    earth: "Earth meets Earth — grounded, potentially stagnant",
    water: "Earth controls Water — dammed, contained flow",
    air: "Earth in Air — ideas seeking grounding",
  },
  metal: {
    fire: "Fire controls Metal — pressure, transformation under heat",
    earth: "Earth nourishes Metal — productive, solid foundation",
    water: "Metal produces Water — flowing, generative",
    air: "Metal in Air — sharp clarity, cutting insight",
  },
  water: {
    fire: "Water controls Fire — cautionary, cooling force",
    earth: "Earth dams Water — obstruction, redirected flow",
    water: "Water meets Water — deep, potentially overwhelming",
    air: "Water in Air — diffusion, evaporative change",
  },
};

function planetTip(planet: PlanetaryPosition): ReactNode {
  const wuxing = PLANET_WUXING[planet.planet];
  const chinese = PLANET_CHINESE[planet.planet] || planet.planet;
  const zodiac = ZODIAC_SIGNS.find(z => z.sign === planet.zodiacSign);
  const interaction = wuxing && zodiac
    ? WU_XING_ZODIAC_INTERACTION[wuxing]?.[zodiac.element]
    : null;

  return (
    <>
      <div className="font-bold">{chinese}</div>
      {interaction && (
        <div className="mt-1 text-amber-500/80 italic">{interaction}</div>
      )}
      {planet.isRetrograde && wuxing && (
        <div className="mt-1 text-red-400/80">
          Retrograde: {wuxing} energy turned inward — review, not initiation
        </div>
      )}
    </>
  );
}

const PANEL_HELP_TEXT =
  "Real planetary positions computed from VSOP87 ephemeris (astronomy-engine). "
  + "In Chinese cosmology, the five visible planets ARE the Wu Xing (五行) elements in motion through the sky: "
  + "Jupiter = Wood (木星), Mars = Fire (火星), Saturn = Earth (土星), Venus = Metal (金星), Mercury = Water (水星). "
  + "The Sun and Moon are the luminaries (太陽/太陰) — yin and yang in their purest celestial form. "
  + "Each planet's zodiac sign places its element in a specific elemental context, "
  + "creating productive (生) or controlling (剋) relationships. "
  + "For example: Jupiter (Wood) in a fire sign = wood feeds fire (productive). "
  + "Mars (Fire) in a water sign = water controls fire (tension). "
  + "Retrograde motion means that element's energy turns inward — "
  + "review and reflection rather than outward action. "
  + "The Moon phase indicates timing energy: waxing for building, full for culmination, waning for release. "
  + "Multiple retrogrades increase caution; the specific planets retrograde tell you which elemental domains are under review. "
  + "\n\nDEGREES: The ecliptic is 360° total, divided into 12 zodiac signs of 30° each. "
  + "The degree shown is the planet's position within its current sign (0° = just entered, 29° = about to leave). "
  + "This isn't about 'power' — it's about position. Early degrees (0-9°) = fresh influence of that sign; "
  + "mid degrees (10-20°) = fully expressing the sign's quality; late degrees (21-29°) = transitioning out. "
  + "In traditional astrology, certain 'critical degrees' carry extra significance, "
  + "but in this system we focus on the sign's elemental quality and its Wu Xing interaction with the planet.";

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
        <PanelHelp text={PANEL_HELP_TEXT} />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200">
        {/* Planets */}
        <div className="space-y-2">
          {positions.map((planet) => {
            const zodiac = ZODIAC_SIGNS.find(z => z.sign === planet.zodiacSign);
            return (
              <div key={planet.planet} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InfoTip content={planetTip(planet)}>
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
                  <InfoTip content={`Position within sign (0–30°). ${planet.degree < 10 ? "Early: fresh influence" : planet.degree > 20 ? "Late: transitioning out" : "Mid-sign: fully expressed"}`}>
                    <span className="text-xl text-gray-500">
                      {planet.degree.toFixed(1)}
                      &deg;
                    </span>
                  </InfoTip>
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
