"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PlumBlossomComputerResult, AgreementState } from "@/lib/plumBlossomComputer/core/types";
import { hexagramData } from "@/constants/hexagrams";
import { hexagramImageText } from "@/constants/hexagramImageText";
import { hexagramLineText } from "@/constants/hexagramLineText";
import { getLineInfo } from "@/constants/plumBlossom/lineData";
import { getHatcherHexagram } from "@/lib/hatcher";
import { InterlinearGloss } from "@/components/InterlinearGloss";
import ReasoningTreePanel from "./ReasoningTreePanel";
import OraclePanel from "./OraclePanel";
import PanelHelp from "./PanelHelp";

interface Props {
  result: PlumBlossomComputerResult;
  toggles: Record<string, AgreementState>;
  onToggle: (branchId: string, state: AgreementState) => void;
}

const BIAS_DISPLAY: Record<string, { word: string; color: string; description: string }> = {
  act: {
    word: "ACT",
    color: "text-[#44ff88]",
    description: "Conditions favor initiative. Move forward.",
  },
  observe: {
    word: "OBSERVE",
    color: "text-amber-400",
    description: "Watch and wait. Gather information before acting.",
  },
  avoid: {
    word: "AVOID",
    color: "text-red-400",
    description: "Exercise caution. Pull back or defer decisions.",
  },
  neutral: {
    word: "NEUTRAL",
    color: "text-gray-400",
    description: "No strong signal in either direction.",
  },
};

const REGISTER_COLORS: Record<string, string> = {
  auspicious: "bg-green-900/30 text-green-400 border-green-800",
  blameless: "bg-gray-900/30 text-gray-400 border-gray-700",
  inauspicious: "bg-red-900/30 text-red-400 border-red-800",
  danger: "bg-red-900/40 text-red-500 border-red-700",
  regret: "bg-amber-900/30 text-amber-500 border-amber-800",
  distress: "bg-amber-900/30 text-amber-400 border-amber-800",
  blame: "bg-red-900/30 text-red-300 border-red-800",
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

const PLANET_CHINESE: Record<string, string> = {
  mercury: "Water (水星)",
  venus: "Metal (金星)",
  mars: "Fire (火星)",
  jupiter: "Wood (木星)",
  saturn: "Earth (土星)",
};

const PLANET_WUXING: Record<string, string | null> = {
  sun: null, moon: null,
  mercury: "water", venus: "metal", mars: "fire", jupiter: "wood", saturn: "earth",
};

const WU_XING_PRODUCES: Record<string, string> = {
  wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
};

const ZODIAC_TO_WUXING: Record<string, string> = {
  fire: "fire", earth: "earth", water: "water", air: "metal",
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Section({
  title,
  helpText,
  defaultOpen = false,
  children,
}: {
  title: string;
  helpText?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#2a2a2a]">
      <div className="flex items-center justify-between py-5">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 text-left group flex-1 min-w-0"
        >
          <span className="font-mono text-xl uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors">
            {title}
          </span>
          <span className="text-gray-600 text-xl font-mono">
            {open ? "\u25B2" : "\u25BC"}
          </span>
        </button>
        {helpText && <PanelHelp text={helpText} />}
      </div>
      {open && <div className="pb-8">{children}</div>}
    </div>
  );
}

export default function ReadingView({ result, toggles, onToggle }: Props) {
  const t = useTranslations("PlumBlossom");
  const { cosmology, reasoning } = result;
  const ts = new Date(result.timestamp);

  // --- Data extraction ---
  const synthesis = reasoning.synthesis;
  const bias = BIAS_DISPLAY[synthesis.overallBias] || BIAS_DISPLAY.neutral;
  const confidence = Math.round(synthesis.confidence * 100);

  const timeHexNum = cosmology.hexagram.timeBased.hexagramNumber;
  const yearHexNum = cosmology.hexagram.yearBased.kingWenNumber;
  const movingLine = cosmology.hexagram.timeBased.movingLine;

  const timeHex = hexagramData.find(h => h.number === timeHexNum);
  const yearHex = hexagramData.find(h => h.number === yearHexNum);
  const timeImage = hexagramImageText[timeHexNum];
  const lineInfo = getLineInfo(timeHexNum, movingLine);
  const lineText = hexagramLineText[timeHexNum]?.[movingLine - 1];
  const hatcher = getHatcherHexagram(timeHexNum);
  const hatcherLine = hatcher?.lines.find(l => l.position === movingLine);

  const moonPhase = cosmology.moonPhase;
  const moonSymbol = MOON_PHASE_SYMBOLS[moonPhase.phase] || "";
  const moonMeaning = MOON_PHASE_MEANINGS[moonPhase.phase] || "";
  const moonLabel = moonPhase.phase.replace(/_/g, " ");

  const pillars = cosmology.fourPillars;
  const { macroCycle } = cosmology;

  // Planetary prose
  const retrogrades = cosmology.planetaryPositions.filter(p => p.isRetrograde);
  const wuxingPlanets = cosmology.planetaryPositions.filter(p => PLANET_WUXING[p.planet]);

  function describePlanetInteraction(planet: typeof cosmology.planetaryPositions[0]): string {
    const wuxing = PLANET_WUXING[planet.planet];
    if (!wuxing) return "";
    const zWuxing = ZODIAC_TO_WUXING[planet.element];
    if (!zWuxing) return "";
    if (wuxing === zWuxing) return "reinforced";
    if (WU_XING_PRODUCES[wuxing] === zWuxing) return "productive, energy flows outward";
    if (WU_XING_PRODUCES[zWuxing] === wuxing) return "supported, replenished";
    return "in tension";
  }

  // Observation level
  const obsLevel = cosmology.operationalScale.observationEnglish;
  const obsChar = cosmology.operationalScale.observationLevel;

  return (
    <div className="max-w-4xl mx-auto px-4 font-mono">

      {/* ============ SECTION 1: THE VERDICT ============ */}
      <div className="py-10 text-center relative">
        <div className="absolute top-4 right-0">
          <PanelHelp text={"The verdict synthesizes two reasoning branches — Chinese Cosmology (hexagram symbolism, Four Pillars, macro cycles) and Astronomical (real planetary positions, retrogrades, moon phase). "
            + "Each branch derives a bias signal (act/observe/avoid/neutral) from the timestamp. "
            + "The overall bias is determined by majority vote with a caution principle: avoid wins ties with act. "
            + "Confidence reflects the average certainty across active branches. "
            + "You can expand the Reasoning section below to accept or reject individual branches and see how the synthesis changes."} />
        </div>
        {/* Hexagram symbol */}
        <div className="text-8xl text-[#44ff88] mb-4 leading-none">
          {timeHex?.unicode || "?"}
        </div>

        {/* Bias word */}
        <div className={`text-5xl font-bold tracking-widest mb-3 ${bias.color}`}>
          {bias.word}
        </div>

        {/* Confidence */}
        <div className="text-gray-500 text-xl mb-4">
          {confidence}% confidence
        </div>

        {/* Rationale */}
        <p className="text-gray-300 text-2xl leading-relaxed max-w-lg mx-auto mb-6">
          {bias.description}
        </p>

        {/* Contextual details */}
        <div className="flex items-center justify-center gap-4 text-gray-500 text-xl flex-wrap">
          <span>
            {moonSymbol}
            {" "}
            {moonLabel}
          </span>
          <span className="text-gray-700">|</span>
          <span>
            {obsChar}
            {" "}
            {obsLevel}
          </span>
          <span className="text-gray-700">|</span>
          <span>
            {ts.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* ============ SECTION 2: THE HEXAGRAM READING ============ */}
      <Section
        title={t("hexagramReadingTitle")}
        defaultOpen
        helpText={"Time Hexagram: derived from the lunar year, month, day, and hour using the Plum Blossom method (梅花易數). "
          + "Upper trigram = (year+month+day) mod 8, Lower trigram = (year+month+day+hour) mod 8, Moving line = total mod 6. "
          + "The Image (象) text is the traditional commentary describing what the hexagram means in practice. "
          + "The moving line is the point of transformation — it indicates the specific dynamic at work in this moment. "
          + "Year Hexagram: the hexagram assigned to this year in Shao Yong's 60-year cycle, providing the annual backdrop."}
      >
        {/* Hexagram identity */}
        <div className="mb-6">
          <h3 className="text-3xl text-gray-200 mb-1">
            <span className="text-[#44ff88] mr-2">{timeHex?.unicode}</span>
            #{timeHexNum} {timeHex?.name.chinese}
            <span className="text-gray-500 ml-2 text-xl">{timeHex?.meaning}</span>
          </h3>
          <div className="text-gray-500 text-xl">
            {cosmology.hexagram.timeBased.upperTrigram.chinese}/{cosmology.hexagram.timeBased.lowerTrigram.chinese}
            {" \u2014 "}
            {cosmology.hexagram.timeBased.upperTrigram.name} over {cosmology.hexagram.timeBased.lowerTrigram.name}
          </div>
        </div>

        {/* Image text */}
        {timeImage && (
          <blockquote className="border-l-2 border-[#44ff88]/30 pl-4 mb-6 text-xl text-gray-400 italic leading-relaxed">
            {timeImage.en}
          </blockquote>
        )}

        {/* Moving line */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl text-gray-200">
              {t("movingLineLabel")} {movingLine}
            </span>
            {lineInfo && (
              <span className={`text-xl px-2 py-0.5 rounded border ${REGISTER_COLORS[lineInfo.register] || "text-gray-400"}`}>
                {lineInfo.register}
              </span>
            )}
          </div>

          {/* Original Chinese with gloss */}
          {hatcherLine && (
            <div className="mb-3">
              <div className="text-2xl text-amber-400 mb-2">{hatcherLine.text}</div>
              <InterlinearGloss
                characters={hatcherLine.characters}
                phrases={hatcherLine.phrases}
                variant="stacked"
              />
            </div>
          )}

          {/* Line commentary */}
          {lineText && (
            <p className="text-xl text-gray-300 leading-relaxed">
              {lineText}
            </p>
          )}

          {lineInfo?.note && (
            <p className="text-xl text-gray-500 leading-relaxed mt-2">
              {lineInfo.note}
            </p>
          )}
        </div>

        {/* Year hexagram backdrop */}
        {yearHex && (
          <div className="pt-4 border-t border-[#2a2a2a]">
            <div className="text-xl text-gray-500 mb-1 uppercase">{t("yearBackdrop")}</div>
            <div className="flex items-center gap-3 text-xl text-gray-400">
              <span className="text-3xl text-[#44ff88]/60">
                {cosmology.hexagram.yearBased.hexagram.unicode}
              </span>
              <span>
                #{yearHexNum} {cosmology.hexagram.yearBased.hexagram.chinese}
                {" \u2014 "}
                {yearHex.meaning}
              </span>
              <span className="text-gray-600">
                ({cosmology.hexagram.yearBased.cyclePosition + 1}/60)
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* ============ SECTION 3: CELESTIAL CONTEXT ============ */}
      <Section
        title={t("celestialContextTitle")}
        helpText={"Real planetary positions computed from VSOP87 ephemeris (astronomy-engine). "
          + "In Chinese cosmology, the five visible planets ARE the Wu Xing (五行) elements in motion through the sky: "
          + "Jupiter = Wood (木星), Mars = Fire (火星), Saturn = Earth (土星), Venus = Metal (金星), Mercury = Water (水星). "
          + "Each planet's zodiac sign places its element in a specific elemental context, "
          + "creating productive (生) or controlling (剋) relationships. "
          + "Retrograde motion means that element's energy turns inward — review and reflection rather than outward action. "
          + "The Moon phase indicates timing energy: waxing for building, full for culmination, waning for release.\n\n"
          + "The Four Pillars (四柱) are the sexagenary cycle positions for year, month, day, and hour. "
          + "Each pillar has a Celestial Stem (天干) and Terrestrial Branch (地支), both carrying a Five Phase (五行) element. "
          + "Colors indicate the element: green=wood, red=fire, yellow=earth, white=metal, blue=water.\n\n"
          + "Macro Cycle: Shao Yong's (邵雍) 129,600-year cosmological framework from the Huangji Jingshi (皇極經世書). "
          + "The structure is fractal: Yuan (元, ocean) → Hui (會, deep current) → Yun (運, tide) → Shi (世, wave). "
          + "The Shi is the most experientially relevant layer — the generational quality you actually live through."}
      >
        {/* Planetary prose */}
        <div className="mb-6">
          <div className="space-y-3 text-xl text-gray-300 leading-relaxed">
            {wuxingPlanets.map(planet => {
              const chinese = PLANET_CHINESE[planet.planet] || "";
              const interaction = describePlanetInteraction(planet);
              return (
                <div key={planet.planet} className="flex items-start gap-3">
                  <span className="text-gray-500 text-xl mt-0.5 w-20 shrink-0">
                    {capitalize(planet.planet)}
                  </span>
                  <span>
                    {chinese} in {capitalize(planet.zodiacSign)}
                    {" \u2014 "}
                    <span className="text-gray-400">{interaction}</span>
                    {planet.isRetrograde && (
                      <span className="text-red-400 ml-1">(retrograde)</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Retrograde summary */}
          <div className="mt-4 text-xl text-gray-500">
            {retrogrades.length === 0 ? (
              <span>{t("allForward")}</span>
            ) : (
              <span>
                {retrogrades.length} planet{retrogrades.length !== 1 ? "s" : ""} {t("retrogradeNote")}:
                {" "}
                {retrogrades.map(p => capitalize(p.planet)).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Moon phase */}
        <div className="mb-6 pb-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{moonSymbol}</span>
            <span className="text-xl text-gray-300">
              {capitalize(moonLabel)}
              <span className="text-gray-500 ml-2">
                {Math.round(moonPhase.illumination * 100)}% illuminated
              </span>
            </span>
          </div>
          <p className="text-xl text-gray-400 ml-12">{moonMeaning}</p>
        </div>

        {/* Four Pillars inline */}
        <div className="mb-6">
          <div className="text-xl text-gray-500 uppercase mb-2">Four Pillars</div>
          <div className="flex items-center gap-6">
            {(["year", "month", "day", "hour"] as const).map(key => {
              const p = pillars[key];
              return (
                <div key={key} className="text-center">
                  <div className="text-xl text-gray-600 uppercase mb-1">{key}</div>
                  <div className="text-3xl">
                    <span className={PILLAR_COLOR[p.stem.wuXing]}>{p.stem.chinese}</span>
                    <span className={PILLAR_COLOR[p.branch.wuXing]}>{p.branch.chinese}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Macro cycle prose */}
        <div>
          <div className="text-xl text-gray-500 uppercase mb-2">Macro Cycle</div>
          <p className="text-xl text-gray-300 leading-relaxed">
            We are in the Shi of
            {" "}
            <span className="text-[#44ff88]">{macroCycle.shi.unicode} {macroCycle.shi.chinese}</span>
            {" "}
            ({macroCycle.shi.english}, {macroCycle.shi.startYear}&ndash;{macroCycle.shi.endYear}),
            within the Yun of {macroCycle.yun.unicode} {macroCycle.yun.chinese} ({macroCycle.yun.english}).
          </p>
          {macroCycle.shi.context && (
            <p className="text-xl text-gray-500 mt-2 leading-relaxed">{macroCycle.shi.context}</p>
          )}
        </div>
      </Section>

      {/* ============ SECTION 4: REASONING ============ */}
      <Section
        title={t("reasoningTitle")}
        helpText={"The reasoning system builds two semantic branches from the computed cosmology data. "
          + "Chinese Cosmology: derives a bias from hexagram symbolism — certain hexagrams traditionally suggest action, observation, or caution. "
          + "Astronomical: combines retrograde count (more retrogrades = more caution) with moon phase timing (waxing = action, waning = retreat). "
          + "The synthesis aggregates both branches by majority vote. In ties, caution takes precedence over action. "
          + "You can accept or reject individual branches to see how the overall signal changes — "
          + "this is the interactive, human-in-the-loop element of the system."}
      >
        <p className="text-xl text-gray-500 mb-4 leading-relaxed">
          This reading combines two interpretation branches — Chinese Cosmology and Astronomical.
          You can accept or reject each branch to see how the synthesis changes.
        </p>
        <ReasoningTreePanel
          branches={reasoning.branches}
          synthesis={reasoning.synthesis}
          toggles={toggles}
          onToggle={onToggle}
        />
      </Section>

      {/* ============ SECTION 5: ON-CHAIN ============ */}
      <Section
        title={t("onChainTitle")}
        helpText={"Cryptographic anchoring for the Plum Blossom Computer. "
          + "Commits a tamper-evident hash of the deterministic cosmology computation and reasoning synthesis to the blockchain. "
          + "Anyone can recompute with the same timestamp and verify the hashes match. "
          + "Ancient oracles relied on ritual to prevent revision — this one relies on cryptography."}
      >
        <OraclePanel result={result} />
      </Section>
    </div>
  );
}

const PILLAR_COLOR: Record<string, string> = {
  wood: "text-green-400",
  fire: "text-red-400",
  earth: "text-yellow-400",
  metal: "text-gray-300",
  water: "text-blue-400",
};
