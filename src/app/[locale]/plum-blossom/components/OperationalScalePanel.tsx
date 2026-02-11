"use client";

import type { OperationalScaleResult } from "@/lib/plumBlossomComputer/core/types";
import { OPERATIONAL_SCALES, OBSERVATION_LEVELS, ELEMENT_THINGS, SOCIAL_ROLES } from "@/lib/plumBlossomComputer/core/constants";
import PanelHelp from "./PanelHelp";
import InfoTip from "./InfoTip";

const PANEL_HELP_TEXT =
  "Inspired by Shao Yong's 觀物 (Guanwu, \"Observing Things\") philosophy. "
  + "Shao Yong distinguished two modes of observation: "
  + "以物觀物 (observing things through things) — objective, letting patterns speak for themselves; "
  + "and 以我觀物 (observing things through self) — subjective, colored by personal feeling.\n\n"
  + "Observation Level maps this to three stances:\n"
  + "目 (Eye) — Direct sensory observation. See what is plainly there.\n"
  + "心 (Heart) — Intuitive understanding. Feel the relational quality.\n"
  + "理 (Principle) — Structural pattern recognition. Perceive the cosmic logic.\n\n"
  + "Scale (十/百/千/萬/億) suggests the scope of phenomena most relevant to this moment — "
  + "from the personal (十, tens) to the civilizational (億, hundred millions). "
  + "This echoes Shao Yong's insight that the same principles operate at every scale, "
  + "but at any given moment, certain scales are more salient.\n\n"
  + "Derivation: The observation level is derived from the hexagram's moving line position "
  + "(inner lines suggest 心/Heart; extreme lines with retrogrades suggest 理/Principle) "
  + "and the scale from the count of forward-moving planets in active zodiac signs. "
  + "This is a creative heuristic inspired by Shao Yong's framework, not a formula found in his texts.";

const OBSERVATION_GUIDANCE: Record<string, string> = {
  "Eye": "目 (Mù) — Observe directly. Trust what you can see, measure, and verify. "
    + "Shao Yong's 以物觀物: let things reveal themselves without projection.",
  "Heart": "心 (Xīn) — Feel the relational quality. Attend to intuition, emotional resonance, "
    + "and interpersonal dynamics. The moving line is in the inner position — look inward.",
  "Principle": "理 (Lǐ) — Perceive structural patterns. The hexagram's moving line is at an extreme "
    + "and multiple planets are retrograde — conditions point toward deep, systemic forces at work.",
};

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
        <PanelHelp text={PANEL_HELP_TEXT} />
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
            <InfoTip content={OBSERVATION_GUIDANCE[scale.observationEnglish] || obsInfo?.description || scale.observationLevel}>
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
