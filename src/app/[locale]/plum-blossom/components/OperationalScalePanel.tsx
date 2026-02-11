"use client";

import type { OperationalScaleResult } from "@/lib/plumBlossomComputer/core/types";
import { OPERATIONAL_SCALES, OBSERVATION_LEVELS, ELEMENT_THINGS, SOCIAL_ROLES } from "@/lib/plumBlossomComputer/core/constants";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

interface Props {
  scale: OperationalScaleResult;
}

export default function OperationalScalePanel({ scale }: Props) {
  const scaleIndex = OPERATIONAL_SCALES.findIndex(s => s.scale === scale.scale);
  const obsInfo = OBSERVATION_LEVELS.find(o => o.level === scale.observationLevel);

  // Find dominant element from derivation text for correspondences
  const dominantElement = ["wood", "fire", "earth", "metal", "water"].find(
    el => scale.derivation.toLowerCase().includes(el)
  );

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Operational
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">Derived</span>
        </div>
        <PanelHelp text="Maps the current moment to Shao Yong's observational scale hierarchy. Scale (體, tǐ) indicates the scope of phenomena best observed at this time — from personal (身) to civilizational (世). Observation level suggests the appropriate analytical stance. Derived from the interaction of the Four Pillars' dominant elements and the macro cycle position." />
      </div>
      <div className="p-4 font-mono text-xl text-gray-200">
        {/* Scale gauge */}
        <div className="mb-4">
          <div className="text-xl text-gray-500 uppercase mb-2">Scale</div>
          <div className="flex items-center gap-1">
            {OPERATIONAL_SCALES.map((s, i) => (
              <InfoTip key={s.scale} content={`${s.english} (${s.scale}) — ${s.description}`}>
                <span
                  className={`block flex-1 h-3 rounded-sm ${
                    i <= scaleIndex ? "bg-[#44ff88]" : "bg-[#2a2a2a]"
                  }`}
                />
              </InfoTip>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <InfoTip content={(
              <>
                <div>
                  {OPERATIONAL_SCALES[scaleIndex]?.english}
                  {' '}
                  &middot; magnitude
                  {' '}
                  {OPERATIONAL_SCALES[scaleIndex]?.magnitude?.toLocaleString()}
                </div>
                <div className="text-gray-500">{OPERATIONAL_SCALES[scaleIndex]?.description}</div>
                {dominantElement && ELEMENT_THINGS[dominantElement] && (
                  <div className="text-gray-500 mt-1">
                    Correspondences:
                    {' '}
                    {ELEMENT_THINGS[dominantElement].join(", ")}
                  </div>
                )}
              </>
            )}
            >
              <span className="text-3xl text-[#44ff88]">{scale.scale}</span>
            </InfoTip>
            <span className="text-xl text-gray-500">{scale.scaleEnglish}</span>
          </div>
        </div>

        {/* Observation level */}
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="text-xl text-gray-500 uppercase mb-2">Observation</div>
          <div className="flex items-center gap-3">
            <InfoTip content={obsInfo?.description || scale.observationLevel}>
              <span className="text-3xl text-[#44ff88]">{scale.observationLevel}</span>
            </InfoTip>
            <span className="text-xl text-gray-400">{scale.observationEnglish}</span>
          </div>
          <div className="text-xl text-gray-500 mt-2">
            {obsInfo?.description}
          </div>
        </div>

        {/* Derivation */}
        <div className="mt-4 text-xl text-gray-600">
          <InfoTip content={
            dominantElement && SOCIAL_ROLES[dominantElement]
              ? `Social role: ${SOCIAL_ROLES[dominantElement]}`
              : "Derived from Four Pillars elements and macro cycle"
          }
          >
            <span>{scale.derivation}</span>
          </InfoTip>
        </div>
      </div>
    </div>
  );
}
