"use client";

import type { MacroCycleContext } from "@/lib/plumBlossomComputer/core/types";
import { hexagramData } from "@/constants/hexagrams";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  macroCycle: MacroCycleContext;
}

function hexTip(hexNum: number, extra?: string) {
  const hex = hexagramData.find(h => h.number === hexNum);
  if (!hex) return null;
  return (
    <>
      <div className="font-bold">
        #
        {hexNum}
        {' '}
        {hex.name.chinese}
        {' '}
        &middot;
        {' '}
        {hex.meaning}
      </div>
      <div className="text-gray-500">
        {hex.topTrigram}
        {' '}
        over
        {' '}
        {hex.bottomTrigram}
      </div>
      {extra && <div className="text-gray-500 mt-1">{extra}</div>}
    </>
  );
}

const SEASON_INSPECTORS: Record<string, string> = {
  Spring: "Qian (☰) governs spring — the creative, initiating",
  Summer: "Li (☲) governs summer — clarity, illumination",
  Autumn: "Kan (☵) governs autumn — depth, danger, the abyss",
  Winter: "Kun (☷) governs winter — the receptive, yielding",
};

export default function MacroCyclePanel({ macroCycle }: Props) {
  const currentYear = new Date().getFullYear();

  const shiProgress = Math.min(
    ((currentYear - macroCycle.shi.startYear) / (macroCycle.shi.endYear - macroCycle.shi.startYear)) * 100,
    100
  );

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Macro Cycle
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">Computed</span>
        </div>
        <PanelHelp text="Shao Yong's (邵雍) 129,600-year cosmological framework from the Huangji Jingshi (皇極經世). Time is divided into: Yuan (元, 129,600 years) → Hui (會, 10,800 years, seasonal epochs) → Yun (運, 360 years) → Shi (世, 30-year generations). Each level has a governing hexagram. The progress bar shows our position within the current Shi generation." />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200 space-y-4">
        {/* Hui */}
        <div>
          <div className="text-xl text-gray-500 uppercase">Hui (Epoch)</div>
          <div className="flex items-center gap-3">
            <InfoTip content={hexTip(macroCycle.hui.hexagramNumber, `Epoch: ${macroCycle.hui.startYear}–${macroCycle.hui.endYear}`) || "Unknown"}>
              <span className="text-3xl text-[#44ff88]">{macroCycle.hui.hexagramUnicode}</span>
            </InfoTip>
            <span className="text-2xl">{macroCycle.hui.chinese}</span>
            <span className="text-xl text-gray-500">
              {macroCycle.hui.inspector}
              {' '}
              {macroCycle.hui.inspectorUnicode}
            </span>
          </div>
          <InfoTip content={SEASON_INSPECTORS[macroCycle.hui.season] || `${macroCycle.hui.season} season`}>
            <span className="text-xl text-gray-500">{macroCycle.hui.season}</span>
          </InfoTip>
        </div>

        {/* Yun */}
        <div className="border-t border-[#2a2a2a] pt-3">
          <div className="text-xl text-gray-500 uppercase">Yun (Revolution)</div>
          <div className="flex items-center gap-3">
            <InfoTip content={hexTip(macroCycle.yun.hexagramNumber, `Yun #${macroCycle.yun.yunNumber}: ${macroCycle.yun.startYear}–${macroCycle.yun.endYear}`) || "Unknown"}>
              <span className="text-3xl text-[#44ff88]">{macroCycle.yun.unicode}</span>
            </InfoTip>
            <span className="text-2xl">
              {macroCycle.yun.chinese}
              {' '}
              {macroCycle.yun.english}
            </span>
          </div>
          <div className="text-xl text-gray-500">
            {macroCycle.yun.startYear}
            {' '}
            -
            {macroCycle.yun.endYear}
          </div>
        </div>

        {/* Shi */}
        <div className="border-t border-[#2a2a2a] pt-3">
          <div className="text-xl text-gray-500 uppercase">Shi (Generation)</div>
          <div className="flex items-center gap-3">
            <InfoTip content={hexTip(macroCycle.shi.hexagramNumber, `Shi #${macroCycle.shi.shiNumber}: ${macroCycle.shi.startYear}–${macroCycle.shi.endYear}`) || "Unknown"}>
              <span className="text-3xl text-[#44ff88]">{macroCycle.shi.unicode}</span>
            </InfoTip>
            <span className="text-2xl">
              {macroCycle.shi.chinese}
              {' '}
              {macroCycle.shi.english}
            </span>
          </div>
          <div className="text-xl text-gray-500">
            {macroCycle.shi.startYear}
            {' '}
            -
            {macroCycle.shi.endYear}
          </div>
          <div className="mt-2 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#44ff88] rounded-full"
              style={{ width: `${shiProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
