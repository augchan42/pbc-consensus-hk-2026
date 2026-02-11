/**
 * Oracle Hashing Utilities
 *
 * Produces deterministic keccak256 hashes of the Plum Blossom Computer output.
 * These hashes are posted on-chain as commitments.
 *
 * The hash covers the full deterministic computation result, so anyone can:
 *   1. Recompute with the same timestamp
 *   2. Hash the result
 *   3. Verify it matches the on-chain commitment
 */

import { keccak256, toUtf8Bytes } from "ethers";
import type { CosmologyResult, ReasoningGraph, ScenarioBias } from "@/lib/plumBlossomComputer/core/types";

/**
 * Hash the deterministic cosmology result.
 * Serializes the key fields into a canonical JSON string, then keccak256.
 */
export function hashCosmology(cosmology: CosmologyResult): string {
  const canonical = JSON.stringify({
    hexagramNumber: cosmology.hexagram.timeBased.hexagramNumber,
    movingLine: cosmology.hexagram.timeBased.movingLine,
    upperTrigram: cosmology.hexagram.timeBased.upperTrigram.name,
    lowerTrigram: cosmology.hexagram.timeBased.lowerTrigram.name,
    yearHexagram: cosmology.hexagram.yearBased.kingWenNumber,
    fourPillars: {
      year: `${cosmology.fourPillars.year.stem.chinese}${cosmology.fourPillars.year.branch.chinese}`,
      month: `${cosmology.fourPillars.month.stem.chinese}${cosmology.fourPillars.month.branch.chinese}`,
      day: `${cosmology.fourPillars.day.stem.chinese}${cosmology.fourPillars.day.branch.chinese}`,
      hour: `${cosmology.fourPillars.hour.stem.chinese}${cosmology.fourPillars.hour.branch.chinese}`,
    },
    planets: cosmology.planetaryPositions.map(p => ({
      planet: p.planet,
      longitude: Math.round(p.longitude * 1000) / 1000,
      retrograde: p.isRetrograde,
    })),
    moonPhase: cosmology.moonPhase.phase,
    moonIllumination: Math.round(cosmology.moonPhase.illumination * 1000) / 1000,
    operationalScale: cosmology.operationalScale.scale,
    observationLevel: cosmology.operationalScale.observationLevel,
  });
  return keccak256(toUtf8Bytes(canonical));
}

/**
 * Hash the reasoning synthesis.
 */
export function hashReasoning(reasoning: ReasoningGraph): string {
  const canonical = JSON.stringify({
    overallBias: reasoning.synthesis.overallBias,
    confidence: reasoning.synthesis.confidence,
    branches: reasoning.branches.map(b => ({
      id: b.id,
      bias: b.interpretation.bias,
      confidence: b.interpretation.confidence,
    })),
  });
  return keccak256(toUtf8Bytes(canonical));
}

/** Map ScenarioBias to contract uint8 */
export function biasToUint8(bias: ScenarioBias): number {
  switch (bias) {
    case "act": return 1;
    case "observe": return 2;
    case "avoid": return 3;
    default: return 0; // neutral
  }
}

/** Map contract uint8 back to label */
export function uint8ToBiasLabel(n: number): string {
  switch (n) {
    case 1: return "ACT";
    case 2: return "OBSERVE";
    case 3: return "AVOID";
    default: return "NEUTRAL";
  }
}
