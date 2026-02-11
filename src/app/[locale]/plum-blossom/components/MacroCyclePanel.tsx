"use client";

import type { ReactNode } from "react";
import type { MacroCycleContext } from "@/lib/plumBlossomComputer/core/types";
import { hexagramData } from "@/constants/hexagrams";
import { hexagramImageText } from "@/constants/hexagramImageText";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  macroCycle: MacroCycleContext;
}

function hexTip(hexNum: number, extra?: string): ReactNode {
  const hex = hexagramData.find(h => h.number === hexNum);
  if (!hex) return null;
  const imageText = hexagramImageText[hexNum];
  return (
    <>
      <div className="font-bold">
        #{hexNum} {hex.name.chinese} &middot; {hex.meaning}
      </div>
      <div className="text-gray-500">
        {hex.topTrigram} over {hex.bottomTrigram}
      </div>
      {imageText && (
        <div className="mt-1 text-amber-500/80 italic">
          {imageText.en}
        </div>
      )}
      {extra && <div className="text-gray-500 mt-1">{extra}</div>}
    </>
  );
}

const SEASON_INSPECTORS: Record<string, string> = {
  Spring: "Li (☲) inspects spring — clarity, illumination",
  Summer: "Kan (☵) inspects summer — depth, the abyss, hidden danger amid fullness",
  Autumn: "Kun (☷) inspects autumn — the receptive, yielding, harvest and decline",
  Winter: "Qian (☰) inspects winter — the creative, latent potential, renewal from dormancy",
};

const PANEL_HELP_TEXT =
  "Shao Yong's (邵雍) 129,600-year cosmological framework from the Huangji Jingshi (皇極經世書). "
  + "The structure is fractal — the same patterns of 12-fold and 30-fold division repeat at every scale, "
  + "from the Yuan down to hours. "
  + "Each layer is a concentric temporal container that sets the quality of the medium for everything within it: "
  + "Yuan (元) 129,600 years — the ocean. The absolute cosmological frame; too vast to directly influence conditions, "
  + "but everything unfolds within it. "
  + "Hui (會) 10,800 years — the deep current. Each of the 12 Hui corresponds to an Earthly Branch, a season, "
  + "and a governing hexagram. The Hui determines the macro-tone of civilizational epochs — "
  + "like climate vs weather. "
  + "Yun (運) 360 years — the tide. Civilizational tendency within which empires, philosophies, and technologies emerge. "
  + "Derived from the Qi-Term hexagram of the season's Principal hexagram (Li/Qian/Kan/Kun). "
  + "Shi (世) 30 years — the wave. The most experientially relevant layer. This is the generational quality "
  + "you actually live through, cycling through 60 on-duty hexagrams in Fu Xi circular sequence. "
  + "The outer layers do not override inner ones — they provide the quality of the background "
  + "through which inner layers manifest. The Shi has the most direct bearing on lived experience.";

export default function MacroCyclePanel({ macroCycle }: Props) {
  const currentYear = new Date().getFullYear();

  const yuanProgress = Math.min(
    (macroCycle.yuan.elapsed / macroCycle.yuan.totalYears) * 100,
    100
  );

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
        <PanelHelp text={PANEL_HELP_TEXT} />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200 space-y-4">

        {/* Nested breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-600 flex-wrap">
          <InfoTip content={`Yuan (元): ${macroCycle.yuan.startYear.toLocaleString()}–${macroCycle.yuan.endYear.toLocaleString()} (${yuanProgress.toFixed(1)}% elapsed). The outermost container — the ocean in which all cycles swim.`}>
            <span className="text-gray-500">元</span>
          </InfoTip>
          <span>&rsaquo;</span>
          <InfoTip content={hexTip(macroCycle.hui.hexagramNumber, macroCycle.hui.context) || "Unknown"}>
            <span className="text-gray-400">{macroCycle.hui.hexagramUnicode} {macroCycle.hui.chinese}</span>
          </InfoTip>
          <span>&rsaquo;</span>
          <InfoTip content={hexTip(macroCycle.yun.hexagramNumber, macroCycle.yun.context) || "Unknown"}>
            <span className="text-gray-400">{macroCycle.yun.unicode} {macroCycle.yun.chinese}</span>
          </InfoTip>
          <span>&rsaquo;</span>
          <InfoTip content={hexTip(macroCycle.shi.hexagramNumber, macroCycle.shi.context) || "Unknown"}>
            <span className="text-[#44ff88]">{macroCycle.shi.unicode} {macroCycle.shi.chinese}</span>
          </InfoTip>
        </div>

        {/* Yuan */}
        <div>
          <div className="text-xl text-gray-500 uppercase">Yuan (Cycle)</div>
          <div className="text-xl text-gray-400">
            {macroCycle.yuan.totalYears.toLocaleString()} years
          </div>
          <div className="text-xl text-gray-600">
            {yuanProgress.toFixed(1)}% elapsed
          </div>
          <div className="mt-1 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-600 rounded-full"
              style={{ width: `${yuanProgress}%` }}
            />
          </div>
        </div>

        {/* Hui */}
        <div className="border-t border-[#2a2a2a] pt-3">
          <div className="text-xl text-gray-500 uppercase">Hui (Epoch)</div>
          <div className="flex items-center gap-3">
            <InfoTip content={hexTip(macroCycle.hui.hexagramNumber, `Epoch: ${macroCycle.hui.startYear}–${macroCycle.hui.endYear}`) || "Unknown"}>
              <span className="text-3xl text-[#44ff88]">{macroCycle.hui.hexagramUnicode}</span>
            </InfoTip>
            <span className="text-2xl">{macroCycle.hui.chinese}</span>
            <span className="text-xl text-gray-500">
              {macroCycle.hui.inspector} {macroCycle.hui.inspectorUnicode}
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
              {macroCycle.yun.chinese} {macroCycle.yun.english}
            </span>
          </div>
          <div className="text-xl text-gray-500">
            {macroCycle.yun.startYear} - {macroCycle.yun.endYear}
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
              {macroCycle.shi.chinese} {macroCycle.shi.english}
            </span>
          </div>
          <div className="text-xl text-gray-500">
            {macroCycle.shi.startYear} - {macroCycle.shi.endYear}
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
