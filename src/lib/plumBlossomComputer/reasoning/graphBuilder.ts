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
      + "The macro cycle places this moment within Shao Yong's 129,600-year cosmological framework. "
      + "Accepting this branch means you trust that hexagram symbolism is a meaningful signal for this moment.",
    userAgreement: "neutral",
    observations: [
      {
        label: `Time Hexagram #${timeHexNum} ${timeHex?.name.chinese || ""} — ${timeHex?.meaning || ""}`,
        detail: `${cosmology.hexagram.timeBased.upperTrigram.chinese} over ${cosmology.hexagram.timeBased.lowerTrigram.chinese} (${cosmology.hexagram.timeBased.upperTrigram.name}/${cosmology.hexagram.timeBased.lowerTrigram.name})`,
      },
      {
        label: `Moving Line ${cosmology.hexagram.timeBased.movingLine}`,
        detail: "The line of transformation — where the hexagram shifts",
      },
      {
        label: `Year Hexagram #${yearHexNum} ${cosmology.hexagram.yearBased.hexagram.chinese}`,
        detail: `${cosmology.hexagram.yearBased.hexagram.meaning} — cycle position ${cosmology.hexagram.yearBased.cyclePosition + 1}/60`,
      },
      {
        label: `Pillars: ${pillars.year.stem.chinese}${pillars.year.branch.chinese} ${pillars.month.stem.chinese}${pillars.month.branch.chinese} ${pillars.day.stem.chinese}${pillars.day.branch.chinese} ${pillars.hour.stem.chinese}${pillars.hour.branch.chinese}`,
        detail: `Dominant element: ${dominantElement} (${elementCounts[dominantElement]}/4 pillars)`,
      },
      {
        label: `Macro season: ${cosmology.macroCycle.hui.season}`,
        detail: `Shi period: ${cosmology.macroCycle.shi.chinese} (${cosmology.macroCycle.shi.english})`,
      },
    ],
    interpretation: {
      bias,
      confidence: 0.6,
      rationale: `Hexagram #${timeHexNum} maps to "${bias}" — ${biasExplanation(bias)}`,
    },
  };
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
    helpText: "Current planetary positions calculated from orbital mechanics (astronomy-engine). "
      + "Retrograde planets — appearing to move backward from Earth's perspective — traditionally signal "
      + "periods of review, delay, or reconsideration. Moon phase indicates timing energy: "
      + "waxing for initiation and building, full for culmination, waning for completion and release. "
      + "Accepting this branch means you trust these astronomical patterns as meaningful timing signals.",
    userAgreement: "neutral",
    observations: [
      ...cosmology.planetaryPositions.map(p => ({
        label: `${capitalize(p.planet)} in ${capitalize(p.zodiacSign)}${p.isRetrograde ? " (retrograde)" : ""} — ${Math.round(p.degree)}°`,
        detail: `Element: ${p.element}`,
      })),
      {
        label: `Moon: ${moonPhaseLabel} (${illumination}% illuminated)`,
        detail: `Sun-Moon angle: ${Math.round(cosmology.moonPhase.angle)}°`,
      },
      {
        label: `${retrogradeCount} planet${retrogradeCount !== 1 ? "s" : ""} retrograde${retrogradePlanets.length > 0 ? `: ${retrogradePlanets.join(", ")}` : ""}`,
        detail: retrogradeCount === 0
          ? "Clear skies — no retrograde friction"
          : retrogradeCount >= 3
            ? "Heavy retrograde — significant review energy"
            : "Moderate retrograde activity",
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
