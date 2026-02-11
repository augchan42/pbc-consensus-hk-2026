"use client";

import type { FourPillars } from "@/lib/plumBlossomComputer/core/types";
import { WU_XING } from "@/lib/plumBlossomCorrespondences/wuXing";
import { CELESTIAL_STEMS, TERRESTRIAL_BRANCHES } from "@/lib/plumBlossomCorrespondences/stemsBranches";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  fourPillars: FourPillars;
}

const ELEMENT_COLORS: Record<string, string> = {
  wood: "text-green-400",
  fire: "text-red-400",
  earth: "text-yellow-400",
  metal: "text-gray-300",
  water: "text-blue-400",
};

function stemTip(chinese: string) {
  const stem = CELESTIAL_STEMS.find(s => s.chinese === chinese);
  if (!stem) return null;
  const wx = WU_XING[stem.wuXing];
  return (
    <>
      <div>
        {stem.pinyin}
        {' '}
        &middot;
        {' '}
        {wx?.english}
        {' '}
        (
        {wx?.chinese}
        ) &middot;
        {' '}
        {stem.yinYang}
      </div>
      {wx && (
        <div className="text-gray-500">
          {wx.direction}
          {' '}
          &middot;
          {' '}
          {wx.season}
          {' '}
          &middot;
          {' '}
          {wx.guardian}
        </div>
      )}
    </>
  );
}

function branchTip(chinese: string) {
  const branch = TERRESTRIAL_BRANCHES.find(b => b.chinese === chinese);
  if (!branch) return null;
  const wx = WU_XING[branch.wuXing];
  return (
    <>
      <div>
        {branch.pinyin}
        {' '}
        &middot;
        {' '}
        {branch.animal}
        {' '}
        (
        {branch.animalChinese}
        )
      </div>
      <div className="text-gray-500">
        {wx?.english}
        {' '}
        (
        {wx?.chinese}
        ) &middot;
        {branch.hour}
        h &middot;
        {branch.organ}
        {' '}
        (
        {branch.organChinese}
        )
      </div>
    </>
  );
}

export default function StemsBranchesPanel({ fourPillars }: Props) {
  const pillars = [
    { label: "YEAR", key: "year" as const },
    { label: "MONTH", key: "month" as const },
    { label: "DAY", key: "day" as const },
    { label: "HOUR", key: "hour" as const },
  ];

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Four Pillars
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">Computed</span>
        </div>
        <PanelHelp text="The Four Pillars (四柱) are the sexagenary cycle positions for year, month, day, and hour. Each pillar has a Celestial Stem (天干) and Terrestrial Branch (地支), both carrying a Five Phase (五行) element. Colors indicate the element: green=wood, red=fire, yellow=earth, white=metal, blue=water. The balance of elements reveals the energetic signature of this moment." />
      </div>
      <div className="p-4 font-mono">
        <div className="grid grid-cols-4 gap-3 text-center">
          {pillars.map(({ label, key }) => {
            const pillar = fourPillars[key];
            const stemColor = ELEMENT_COLORS[pillar.stem.wuXing] || "text-gray-200";
            const branchColor = ELEMENT_COLORS[pillar.branch.wuXing] || "text-gray-200";
            const sTip = stemTip(pillar.stem.chinese);
            const bTip = branchTip(pillar.branch.chinese);
            return (
              <div key={key}>
                <div className="text-xl text-gray-500 uppercase mb-2">{label}</div>
                {sTip ? (
                  <InfoTip content={sTip}>
                    <span className={`text-3xl ${stemColor}`}>{pillar.stem.chinese}</span>
                  </InfoTip>
                ) : (
                  <div className={`text-3xl ${stemColor}`}>{pillar.stem.chinese}</div>
                )}
                {bTip ? (
                  <InfoTip content={bTip}>
                    <span className={`text-3xl ${branchColor}`}>{pillar.branch.chinese}</span>
                  </InfoTip>
                ) : (
                  <div className={`text-3xl ${branchColor}`}>{pillar.branch.chinese}</div>
                )}
                <div className="text-xl text-gray-500 mt-2">
                  {pillar.stem.pinyin}
                </div>
                <div className="text-xl text-gray-500">
                  {pillar.branch.pinyin}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
