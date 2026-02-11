"use client";

import type { CosmologyResult } from "@/lib/plumBlossomComputer/core/types";
import { hexagramData } from "@/constants/hexagrams";
import { getLineInfo } from "@/constants/plumBlossom/lineData";
import { getHatcherHexagram } from "@/lib/hatcher";
import { InterlinearGloss } from "@/components/InterlinearGloss";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  cosmology: CosmologyResult;
}

const REGISTER_COLORS: Record<string, string> = {
  auspicious: "text-green-400",
  blameless: "text-gray-400",
  inauspicious: "text-red-400",
  danger: "text-red-500",
  regret: "text-amber-500",
  distress: "text-amber-400",
  blame: "text-red-300",
};

export default function HexagramCorePanel({ cosmology }: Props) {
  const { timeBased, yearBased } = cosmology.hexagram;

  const timeHex = hexagramData.find(h => h.number === timeBased.hexagramNumber);
  const yearHex = hexagramData.find(h => h.number === yearBased.kingWenNumber);

  const lineInfo = getLineInfo(timeBased.hexagramNumber, timeBased.movingLine);
  const hatcher = getHatcherHexagram(timeBased.hexagramNumber);
  const hatcherLine = hatcher?.lines.find(l => l.position === timeBased.movingLine);

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Hexagrams
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">Computed</span>
        </div>
        <PanelHelp text="Time Hexagram: derived from the lunar year, month, day, and hour using the Plum Blossom method (梅花易數). Upper trigram = (year+month+day) mod 8, Lower trigram = (year+month+day+hour) mod 8, Moving line = total mod 6. Year Hexagram: the hexagram assigned to this year in Shao Yong's 60-year cycle, providing the annual backdrop." />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200">
        {/* Time-based hexagram */}
        <div className="mb-4">
          <div className="text-xl text-gray-500 uppercase mb-2">Time Hexagram</div>
          <div className="flex items-center gap-4">
            <InfoTip content={
              timeHex ? (
                <>
                  <div className="font-bold">{timeHex.meaning}</div>
                  <div className="text-gray-500 mt-1">
                    {timeHex.topTrigram}
                    {' '}
                    over
                    {' '}
                    {timeHex.bottomTrigram}
                  </div>
                </>
              ) : "Unknown hexagram"
            }
            >
              <span className="text-6xl text-[#44ff88]">{timeHex?.unicode || "?"}</span>
            </InfoTip>
            <div>
              <div className="text-2xl text-gray-200">
                #
                {timeBased.hexagramNumber}
                {' '}
                {timeHex?.name.chinese}
              </div>
              <div className="text-xl text-gray-500">
                {timeBased.upperTrigram.chinese}
                /
                {timeBased.lowerTrigram.chinese}
                {" "}
                {timeBased.upperTrigram.name}
                {' '}
                over
                {' '}
                {timeBased.lowerTrigram.name}
              </div>
            </div>
          </div>
          <div className="mt-2 border-t border-[#2a2a2a] pt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl text-red-500">
                Moving line:
                {' '}
                {timeBased.movingLine}
              </span>
              {lineInfo && (
                <InfoTip content="Traditional register for this line position">
                  <span className={`text-xl ${REGISTER_COLORS[lineInfo.register] || "text-gray-400"}`}>
                    {lineInfo.register}
                  </span>
                </InfoTip>
              )}
            </div>
            {hatcherLine && (
              <div className="mt-2">
                <div className="text-2xl text-amber-400 mb-1">{hatcherLine.text}</div>
                <InterlinearGloss
                  characters={hatcherLine.characters}
                  phrases={hatcherLine.phrases}
                  variant="stacked"
                  className="!text-xs [&_span]:!text-xs [&_.text-lg]:!text-base"
                />
              </div>
            )}
            {lineInfo?.note && (
              <div className="mt-2 text-xl text-gray-500 leading-relaxed">
                {lineInfo.note}
              </div>
            )}
          </div>
        </div>

        {/* Year hexagram */}
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="text-xl text-gray-500 uppercase mb-2">Year Hexagram</div>
          <div className="flex items-center gap-4">
            <InfoTip content={
              yearHex ? (
                <>
                  <div className="font-bold">{yearHex.meaning}</div>
                  <div className="text-gray-500 mt-1">
                    {yearHex.topTrigram}
                    {' '}
                    over
                    {' '}
                    {yearHex.bottomTrigram}
                  </div>
                  <div className="text-gray-500 mt-1">
                    Position
                    {' '}
                    {yearBased.cyclePosition + 1}
                    /60 in Shao Yong cycle
                  </div>
                </>
              ) : "Unknown hexagram"
            }
            >
              <span className="text-6xl text-[#44ff88]">{yearBased.hexagram.unicode}</span>
            </InfoTip>
            <div>
              <div className="text-2xl text-gray-200">
                #
                {yearBased.kingWenNumber}
                {' '}
                {yearBased.hexagram.chinese}
              </div>
              <div className="text-xl text-gray-500">
                {yearBased.hexagram.meaning}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xl text-gray-500">
            Cycle:
            {' '}
            {yearBased.cyclePosition + 1}
            /60 | Gen
            {' '}
            {yearBased.generation}
          </div>
        </div>
      </div>
    </div>
  );
}
