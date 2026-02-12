"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { recomputeWithToggles } from "@/lib/plumBlossomComputer/reasoning/graphBuilder";
import { hashReasoning } from "@/lib/oracleHash";
import type { PlumBlossomComputerResult, AgreementState } from "@/lib/plumBlossomComputer/core/types";
import HexagramCorePanel from "./components/HexagramCorePanel";
import StemsBranchesPanel from "./components/StemsBranchesPanel";
import MacroCyclePanel from "./components/MacroCyclePanel";
import PlanetaryPanel from "./components/PlanetaryPanel";
import OperationalScalePanel from "./components/OperationalScalePanel";
import ReasoningTreePanel from "./components/ReasoningTreePanel";
import OraclePanel from "./components/OraclePanel";
import ReadingView from "./components/ReadingView";
import VerifyView from "./components/VerifyView";

type ActiveTab = "reading" | "dashboard" | "verify";

export interface OracleHashes {
  cosmologyHash: string;
  reasoningHash: string;
}

interface PlumBlossomClientProps {
  initialResult: PlumBlossomComputerResult;
  initialHashes: OracleHashes;
}

export default function PlumBlossomClient({ initialResult, initialHashes }: PlumBlossomClientProps) {
  const t = useTranslations("PlumBlossom");
  const [result, setResult] = useState<PlumBlossomComputerResult>(initialResult);
  const [hashes, setHashes] = useState<OracleHashes>(initialHashes);
  const [toggles, setToggles] = useState<Record<string, AgreementState>>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("reading");

  const handleToggle = useCallback(
    (branchId: string, state: AgreementState) => {
      const newToggles = { ...toggles, [branchId]: state };
      setToggles(newToggles);
      const updatedReasoning = recomputeWithToggles(result.cosmology, newToggles);
      setResult(prev => ({ ...prev, reasoning: updatedReasoning }));
      setHashes(prev => ({ ...prev, reasoningHash: hashReasoning(updatedReasoning) }));
    },
    [result, toggles]
  );

  const ts = new Date(result.timestamp);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-[#0a0a0a] p-2 md:p-4">
        {/* Header */}
        <div className="px-4 py-3 mb-2 flex items-center justify-between flex-wrap gap-y-2">
          <div>
            <h1 className="font-mono text-3xl text-gray-200 tracking-wider uppercase">
              {t("title")}
            </h1>
            <p className="font-mono text-xl text-gray-500">{t("subtitle")}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab switcher */}
            <div className="flex font-mono text-xs border border-[#2a2a2a] rounded-sm overflow-hidden">
              <button
                onClick={() => setActiveTab("reading")}
                className={`px-3 py-1.5 transition-colors ${
                  activeTab === "reading"
                    ? "bg-[#44ff88]/10 text-[#44ff88] border-r border-[#2a2a2a]"
                    : "text-gray-500 hover:text-gray-300 border-r border-[#2a2a2a]"
                }`}
              >
                {t("tabReading")}
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 transition-colors border-r border-[#2a2a2a] ${
                  activeTab === "dashboard"
                    ? "bg-[#44ff88]/10 text-[#44ff88]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t("tabDashboard")}
              </button>
              <button
                onClick={() => setActiveTab("verify")}
                className={`px-3 py-1.5 transition-colors ${
                  activeTab === "verify"
                    ? "bg-[#44ff88]/10 text-[#44ff88]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t("tabVerify")}
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-[#44ff88] animate-pulse" />
              <span className="font-mono text-xl text-gray-500">
                {ts.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Reading View */}
        {activeTab === "reading" && (
          <ReadingView result={result} toggles={toggles} onToggle={handleToggle} hashes={hashes} />
        )}

        {/* Verify View */}
        {activeTab === "verify" && (
          <VerifyView result={result} hashes={hashes} />
        )}

        {/* Dashboard View (original) */}
        {activeTab === "dashboard" && (
          <>
            {/* Data Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
              <HexagramCorePanel cosmology={result.cosmology} />
              <MacroCyclePanel macroCycle={result.cosmology.macroCycle} />
              <StemsBranchesPanel fourPillars={result.cosmology.fourPillars} />
              <PlanetaryPanel
                positions={result.cosmology.planetaryPositions}
                moonPhase={result.cosmology.moonPhase}
              />
              <OperationalScalePanel scale={result.cosmology.operationalScale} />
              <OraclePanel result={result} hashes={hashes} />
            </div>

            {/* Reasoning Tree — full width */}
            <ReasoningTreePanel
              branches={result.reasoning.branches}
              synthesis={result.reasoning.synthesis}
              toggles={toggles}
              onToggle={handleToggle}
            />
          </>
        )}

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
