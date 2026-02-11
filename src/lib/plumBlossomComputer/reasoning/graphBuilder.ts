/**
 * Reasoning Graph Builder — Branched Model
 *
 * Constructs two semantic branches (Chinese Cosmology, Astronomical)
 * from the cosmology layers. Each branch groups related factual observations
 * with a shared interpretive rule. Users accept/reject at the branch level.
 */

import type {
  CosmologyResult,
  ReasoningGraph,
  ReasoningBranch,
  Synthesis,
  SensitivityNote,
  AgreementState,
  ScenarioBias,
} from "../core/types";
import { hexagramBias, retrogradeBias, moonPhaseBias, aggregateBiases } from "./scenarios";
import { hexagramData } from "@/constants/hexagrams";
import { hexagramImageText } from "@/constants/hexagramImageText";
import { hexagramLineText } from "@/constants/hexagramLineText";
import { getLineInfo } from "@/constants/plumBlossom/lineData";

/**
 * Build the branched reasoning graph from computed cosmology
 */
export function buildReasoningGraph(cosmology: CosmologyResult): ReasoningGraph {
  const branches = [
    buildCosmologyBranch(cosmology),
    buildAstronomicalBranch(cosmology),
  ];

  const synthesis = computeSynthesis(branches);

  return { branches, synthesis };
}

function buildCosmologyBranch(cosmology: CosmologyResult): ReasoningBranch {
  const timeHexNum = cosmology.hexagram.timeBased.hexagramNumber;
  const yearHexNum = cosmology.hexagram.yearBased.kingWenNumber;
  const timeHex = hexagramData.find(h => h.number === timeHexNum);
  const timeHexImage = hexagramImageText[timeHexNum];
  const yearHexImage = hexagramImageText[yearHexNum];
  const shiHexImage = hexagramImageText[cosmology.macroCycle.shi.hexagramNumber];
  const pillars = cosmology.fourPillars;

  // Collect the dominant wu xing element from pillars
  const pillarElements = [pillars.year, pillars.month, pillars.day, pillars.hour]
    .map(p => p.branch.wuXing);
  const elementCounts: Record<string, number> = {};
  for (const el of pillarElements) {
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  }
  const dominantElement = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  const bias = hexagramBias(timeHexNum);

  return {
    id: "cosmology",
    label: "Chinese Cosmology",
    helpText: "Derived from the timestamp using the Plum Blossom method (梅花易數). "
      + "The lunar date yields upper/lower trigrams that combine into a hexagram. "
      + "The Four Pillars (四柱) encode the elemental balance of year, month, day, and hour. "
      + "The macro cycle places this moment within Shao Yong's 129,600-year cosmological framework (皇極經世書). "
      + "The framework is fractal: Yuan (元, ocean) → Hui (會, deep current) → Yun (運, tide) → Shi (世, wave). "
      + "Outer layers set background quality; the Shi is most experientially relevant. "
      + "Accepting this branch means you trust that hexagram symbolism is a meaningful signal for this moment.",
    userAgreement: "neutral",
    observations: [
      {
        label: `Time Hexagram #${timeHexNum} ${timeHex?.name.chinese || ""} — ${timeHex?.meaning || ""}`,
        detail: `${cosmology.hexagram.timeBased.upperTrigram.chinese} over ${cosmology.hexagram.timeBased.lowerTrigram.chinese} (${cosmology.hexagram.timeBased.upperTrigram.name}/${cosmology.hexagram.timeBased.lowerTrigram.name})`
          + (timeHexImage ? `. Image (象): ${timeHexImage.en}` : ""),
      },
      (() => {
        const movingLine = cosmology.hexagram.timeBased.movingLine;
        const lineInfo = getLineInfo(timeHexNum, movingLine);
        const lineText = hexagramLineText[timeHexNum]?.[movingLine - 1];
        const registerLabel = lineInfo ? ` [${lineInfo.register}]` : "";
        const detail = lineText || "The line of transformation — where the hexagram shifts";
        const famous = lineInfo?.phrase ? `${lineInfo.phrase} — ` : "";
        return {
          label: `Moving Line ${movingLine}${registerLabel}`,
          detail: `${famous}${detail}`,
        };
      })(),
      {
        label: `Year Hexagram #${yearHexNum} ${cosmology.hexagram.yearBased.hexagram.chinese}`,
        detail: `${cosmology.hexagram.yearBased.hexagram.meaning} — cycle position ${cosmology.hexagram.yearBased.cyclePosition + 1}/60`
          + (yearHexImage ? `. Image (象): ${yearHexImage.en}` : ""),
      },
      {
        label: `Macro cycle: ${cosmology.macroCycle.hui.season} (${cosmology.macroCycle.hui.chinese}) → ${cosmology.macroCycle.yun.chinese} → ${cosmology.macroCycle.shi.chinese}`,
        detail: `${cosmology.macroCycle.yuan.context} `
          + `${cosmology.macroCycle.hui.context} `
          + `${cosmology.macroCycle.shi.context}`
          + (shiHexImage ? ` Shi Image (象): ${shiHexImage.en}` : ""),
      },
      {
        label: `Pillars: ${pillars.year.stem.chinese}${pillars.year.branch.chinese} ${pillars.month.stem.chinese}${pillars.month.branch.chinese} ${pillars.day.stem.chinese}${pillars.day.branch.chinese} ${pillars.hour.stem.chinese}${pillars.hour.branch.chinese}`,
        detail: `Dominant element: ${dominantElement} (${elementCounts[dominantElement]}/4 pillars)`,
      },
    ],
    interpretation: {
      bias,
      confidence: 0.6,
      rationale: `Hexagram #${timeHexNum} maps to "${bias}" — ${biasExplanation(bias)}`,
    },
  };
}

/** Wu Xing element for each planet */
const PLANET_WUXING: Record<string, string | null> = {
  sun: null, moon: null,
  mercury: "water", venus: "metal", mars: "fire", jupiter: "wood", saturn: "earth",
};

const PLANET_CHINESE_NAME: Record<string, string> = {
  mercury: "水星", venus: "金星", mars: "火星", jupiter: "木星", saturn: "土星",
  sun: "太陽", moon: "太陰",
};

/** Describe Wu Xing interaction between planet element and zodiac element */
function wuxingInteraction(planetElement: string, zodiacElement: string): string {
  const produces: Record<string, string> = {
    wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
  };
  const controls: Record<string, string> = {
    wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood",
  };
  // Map Western 4-element to nearest Wu Xing for interaction
  const zodiacToWuxing: Record<string, string> = {
    fire: "fire", earth: "earth", water: "water", air: "metal",
  };
  const zWuxing = zodiacToWuxing[zodiacElement];
  if (!zWuxing || !planetElement) return "";
  if (planetElement === zWuxing) return `${planetElement} meets ${zWuxing} — reinforced, intensified`;
  if (produces[planetElement] === zWuxing) return `${planetElement} produces ${zWuxing} — productive, energy flows outward`;
  if (produces[zWuxing] === planetElement) return `${zWuxing} nourishes ${planetElement} — supported, replenished`;
  if (controls[planetElement] === zWuxing) return `${planetElement} controls ${zWuxing} — dominant, restraining`;
  if (controls[zWuxing] === planetElement) return `${zWuxing} controls ${planetElement} — constrained, under pressure`;
  return "";
}

function buildAstronomicalBranch(cosmology: CosmologyResult): ReasoningBranch {
  const retrogradeCount = cosmology.planetaryPositions.filter(p => p.isRetrograde).length;
  const retrogradePlanets = cosmology.planetaryPositions
    .filter(p => p.isRetrograde)
    .map(p => capitalize(p.planet));

  const retroBias = retrogradeBias(retrogradeCount);
  const moonBias = moonPhaseBias(cosmology.moonPhase.phase);
  const combinedBias = aggregateBiases([retroBias, moonBias]);

  const moonPhaseLabel = cosmology.moonPhase.phase.replace(/_/g, " ");
  const illumination = Math.round(cosmology.moonPhase.illumination * 100);

  return {
    id: "astronomical",
    label: "Astronomical",
    helpText: "Real planetary positions from VSOP87 ephemeris. "
      + "The five visible planets are the Wu Xing (五行) elements in celestial motion: "
      + "Jupiter=Wood, Mars=Fire, Saturn=Earth, Venus=Metal, Mercury=Water. "
      + "Each planet's zodiac position creates Wu Xing interactions (productive or controlling). "
      + "Retrograde motion turns that element's energy inward — review, not action. "
      + "Moon phase indicates timing: waxing=building, full=culmination, waning=release. "
      + "Accepting this branch means you trust these astronomical-elemental patterns as meaningful timing signals.",
    userAgreement: "neutral",
    observations: [
      ...cosmology.planetaryPositions.map(p => {
        const wuxing = PLANET_WUXING[p.planet];
        const chineseName = PLANET_CHINESE_NAME[p.planet] || p.planet;
        const interaction = wuxing ? wuxingInteraction(wuxing, p.element) : "";
        const degreeContext = p.degree < 10 ? "early in sign" : p.degree > 20 ? "late in sign" : "mid-sign";
        return {
          label: `${capitalize(p.planet)} (${chineseName}) in ${capitalize(p.zodiacSign)}${p.isRetrograde ? " ℞" : ""} — ${Math.round(p.degree)}°`,
          detail: wuxing
            ? `Wu Xing: ${wuxing} (${degreeContext}). ${interaction}${p.isRetrograde ? `. Retrograde: ${wuxing} energy turned inward.` : ""}`
            : `Luminary (${p.element} sign, ${degreeContext})`,
        };
      }),
      {
        label: `Moon: ${moonPhaseLabel} (${illumination}% illuminated)`,
        detail: `Sun-Moon angle: ${Math.round(cosmology.moonPhase.angle)}°`,
      },
      {
        label: `${retrogradeCount} planet${retrogradeCount !== 1 ? "s" : ""} retrograde${retrogradePlanets.length > 0 ? `: ${retrogradePlanets.join(", ")}` : ""}`,
        detail: retrogradeCount === 0
          ? "All five elemental planets moving forward — clear momentum"
          : retrogradeCount >= 3
            ? "Heavy retrograde — multiple elemental domains under review"
            : "Moderate retrograde — some elemental energies turned inward",
      },
    ],
    interpretation: {
      bias: combinedBias,
      confidence: 0.45,
      rationale: `Retrogrades → "${retroBias}", Moon phase → "${moonBias}" — combined: "${combinedBias}"`,
    },
  };
}

/**
 * Compute synthesis from active (non-rejected) branches
 */
function computeSynthesis(branches: ReasoningBranch[]): Synthesis {
  const activeBranches = branches.filter(b => b.userAgreement !== "rejected");

  if (activeBranches.length === 0) {
    return {
      overallBias: "neutral",
      confidence: 0,
      rationale: "All interpretation branches rejected — no signal",
      sensitivities: [],
    };
  }

  const biases = activeBranches.map(b => b.interpretation.bias);
  const overallBias = aggregateBiases(biases);

  // Average confidence of active branches, weighted
  const avgConfidence = activeBranches.reduce((sum, b) => sum + b.interpretation.confidence, 0)
    / activeBranches.length;

  const branchSummary = activeBranches
    .map(b => `${b.label} → ${b.interpretation.bias}`)
    .join(", ");

  // Compute sensitivities: what happens if each branch is toggled
  const sensitivities: SensitivityNote[] = branches.map((branch) => {
    // Simulate toggling this branch
    const simBranches = branches.map(b => ({
      ...b,
      userAgreement: b.id === branch.id
        ? (branch.userAgreement === "rejected" ? "neutral" : "rejected") as AgreementState
        : b.userAgreement,
    }));
    const simActive = simBranches.filter(b => b.userAgreement !== "rejected");
    const simBias = simActive.length === 0
      ? "neutral" as ScenarioBias
      : aggregateBiases(simActive.map(b => b.interpretation.bias));

    return {
      branchId: branch.id,
      branchLabel: branch.label,
      currentState: branch.userAgreement,
      ifToggled: simBias,
    };
  });

  return {
    overallBias,
    confidence: Math.round(avgConfidence * 100) / 100,
    rationale: `${branchSummary} — ${biasExplanation(overallBias)}`,
    sensitivities,
  };
}

/**
 * Recompute after user toggles branch agreements
 */
export function recomputeWithToggles(
  cosmology: CosmologyResult,
  toggles: Record<string, AgreementState>
): ReasoningGraph {
  const graph = buildReasoningGraph(cosmology);

  // Apply branch-level toggles
  for (const branch of graph.branches) {
    if (toggles[branch.id]) {
      branch.userAgreement = toggles[branch.id];
    }
  }

  // Recompute synthesis with toggled states
  graph.synthesis = computeSynthesis(graph.branches);

  return graph;
}

function biasExplanation(bias: ScenarioBias): string {
  switch (bias) {
    case "observe": return "Watch & Wait — gather information before acting";
    case "act": return "Move Forward — conditions favor initiative";
    case "avoid": return "Exercise Caution — pull back or defer decisions";
    default: return "Neutral — no strong signal in either direction";
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
