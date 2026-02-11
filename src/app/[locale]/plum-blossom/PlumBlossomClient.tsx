"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { recomputeWithToggles } from "@/lib/plumBlossomComputer/reasoning/graphBuilder";
import type { PlumBlossomComputerResult, AgreementState } from "@/lib/plumBlossomComputer/core/types";
import HexagramCorePanel from "./components/HexagramCorePanel";
import StemsBranchesPanel from "./components/StemsBranchesPanel";
import MacroCyclePanel from "./components/MacroCyclePanel";
import PlanetaryPanel from "./components/PlanetaryPanel";
import OperationalScalePanel from "./components/OperationalScalePanel";
import ReasoningTreePanel from "./components/ReasoningTreePanel";
import OraclePanel from "./components/OraclePanel";

interface PlumBlossomClientProps {
  initialResult: PlumBlossomComputerResult;
}

export default function PlumBlossomClient({ initialResult }: PlumBlossomClientProps) {
  const t = useTranslations("PlumBlossom");
  const [result, setResult] = useState<PlumBlossomComputerResult>(initialResult);
  const [toggles, setToggles] = useState<Record<string, AgreementState>>({});

  const handleToggle = useCallback(
    (branchId: string, state: AgreementState) => {
      const newToggles = { ...toggles, [branchId]: state };
      setToggles(newToggles);
      const updatedReasoning = recomputeWithToggles(result.cosmology, newToggles);
      setResult(prev => ({ ...prev, reasoning: updatedReasoning }));
    },
    [result, toggles]
  );

  const ts = new Date(result.timestamp);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-[#0a0a0a] p-2 md:p-4">
        {/* Header */}
        <div className="px-4 py-3 mb-2 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-3xl text-gray-200 tracking-wider uppercase">
              {t("title")}
            </h1>
            <p className="font-mono text-xl text-gray-500">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-[#44ff88] animate-pulse" />
            <span className="font-mono text-xl text-gray-500">
              {ts.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Data Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <HexagramCorePanel cosmology={result.cosmology} />
          <StemsBranchesPanel fourPillars={result.cosmology.fourPillars} />
          <MacroCyclePanel macroCycle={result.cosmology.macroCycle} />
          <PlanetaryPanel
            positions={result.cosmology.planetaryPositions}
            moonPhase={result.cosmology.moonPhase}
          />
          <OperationalScalePanel scale={result.cosmology.operationalScale} />
          <OraclePanel result={result} />
        </div>

        {/* Reasoning Tree — full width */}
        <ReasoningTreePanel
          branches={result.reasoning.branches}
          synthesis={result.reasoning.synthesis}
          toggles={toggles}
          onToggle={handleToggle}
        />

        {/* Provenance footer */}
        <div className="px-4 py-3 mt-2 font-mono text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
          <span>Method: Plum Blossom (梅花易數) + VSOP87 ephemeris</span>
          <span>
            Time:
            {' '}
            {ts.toISOString().replace("T", " ").slice(0, 19)}
            {' '}
            UTC
            {" / "}
            {ts.toLocaleString()}
          </span>
          <span>Correspondences: Ma &amp; Zeng 2020 / Suoyin</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
