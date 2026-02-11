"use client";

import { useState, useCallback } from "react";
import type { ReasoningBranch, Synthesis, AgreementState } from "@/lib/plumBlossomComputer/core/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: ignore if clipboard not available
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-gray-600 hover:text-gray-400 transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

interface Props {
  branches: ReasoningBranch[];
  synthesis: Synthesis;
  toggles: Record<string, AgreementState>;
  onToggle: (branchId: string, state: AgreementState) => void;
}

const BIAS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  observe: { bg: "bg-blue-900/20", text: "text-blue-400", border: "border-blue-800" },
  act: { bg: "bg-green-900/20", text: "text-[#44ff88]", border: "border-green-800" },
  avoid: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800" },
  neutral: { bg: "bg-gray-900/20", text: "text-gray-400", border: "border-gray-700" },
};

const BIAS_LABELS: Record<string, string> = {
  observe: "OBSERVE",
  act: "ACT",
  avoid: "CAUTION",
  neutral: "NEUTRAL",
};

function cycleState(current: AgreementState): AgreementState {
  if (current === "neutral") return "accepted";
  if (current === "accepted") return "rejected";
  return "neutral";
}

const TOGGLE_ICONS: Record<AgreementState, { icon: string; color: string }> = {
  accepted: { icon: "\u2713", color: "text-[#44ff88] border-[#44ff88]" },
  rejected: { icon: "\u2717", color: "text-red-500 border-red-500" },
  neutral: { icon: "\u2014", color: "text-gray-500 border-gray-600" },
};

const TOGGLE_LABELS: Record<AgreementState, string> = {
  accepted: "Accepted — this interpretation is included in the synthesis",
  rejected: "Rejected — this interpretation is excluded from the synthesis",
  neutral: "Neutral — included by default, click to accept or reject",
};

export default function ReasoningTreePanel({ branches, synthesis, toggles, onToggle }: Props) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
          Reasoning
        </span>
        <span className="text-xl text-gray-500">
          {branches.length}
          {' '}
          branches
        </span>
      </div>

      <div className="p-4 font-mono text-xl text-gray-200">
        {/* Branches */}
        {branches.map(branch => (
          <BranchCard
            key={branch.id}
            branch={branch}
            state={toggles[branch.id] || branch.userAgreement}
            onToggle={state => onToggle(branch.id, state)}
          />
        ))}

        {/* Synthesis */}
        <SynthesisCard synthesis={synthesis} />
      </div>
    </div>
  );
}

function BranchCard({
  branch,
  state,
  onToggle,
}: {
  branch: ReasoningBranch;
  state: AgreementState;
  onToggle: (state: AgreementState) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const style = BIAS_STYLES[branch.interpretation.bias];
  const toggle = TOGGLE_ICONS[state];

  return (
    <div className={`mb-3 border rounded-sm ${state === "rejected" ? "border-red-900/50 opacity-60" : "border-[#2a2a2a]"}`}>
      {/* Branch header */}
      <div className="px-4 py-3 flex flex-wrap items-center gap-2">
        {/* Expand + label row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xl text-gray-500 hover:text-gray-300 w-6 shrink-0"
        >
          {expanded ? "\u25BC" : "\u25B6"}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-[100px] text-left text-xl text-gray-200 hover:text-white"
        >
          {branch.label}
        </button>

        {/* Right-side controls — stay together */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xl uppercase font-bold px-2 py-1 rounded-sm ${style.bg} ${style.text}`}>
            {BIAS_LABELS[branch.interpretation.bias]}
          </span>
          <span className="text-xl text-gray-500 w-12 text-right">
            {Math.round(branch.interpretation.confidence * 100)}
            %
          </span>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-xl text-gray-600 hover:text-amber-500 shrink-0"
            title="What is this?"
          >
            ?
          </button>
          <button
            onClick={() => onToggle(cycleState(state))}
            className={`w-8 h-8 border rounded-sm flex items-center justify-center text-xl shrink-0 ${toggle.color}`}
            title={TOGGLE_LABELS[state]}
          >
            {toggle.icon}
          </button>
        </div>
      </div>

      {/* Help text */}
      {showHelp && (
        <div className="px-4 pb-3 mx-4 mb-2 border-l-2 border-amber-800">
          <p className="text-xl text-amber-500/80 leading-relaxed">{branch.helpText}</p>
        </div>
      )}

      {/* Expanded observations */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-[#2a2a2a] pt-3">
          {/* Observations */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl uppercase tracking-wider text-gray-600">
                Observations (derived from timestamp)
              </div>
              <CopyButton text={branch.observations.map(obs => `${obs.label}${obs.detail ? '\n' + obs.detail : ''}`).join('\n\n')} />
            </div>
            <div className="space-y-2">
              {branch.observations.map((obs, i) => (
                <div key={i} className="pl-3 border-l border-[#2a2a2a]">
                  <div className="text-xl text-gray-300">{obs.label}</div>
                  {obs.detail && (
                    <div className="text-xl text-gray-500">{obs.detail}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation */}
          <div className={`p-3 rounded-sm border ${style.bg} ${style.border}`}>
            <div className="text-xl uppercase tracking-wider text-gray-500 mb-1">
              Interpretation
            </div>
            <div className="text-xl text-gray-300">{branch.interpretation.rationale}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function SynthesisCard({ synthesis }: { synthesis: Synthesis }) {
  const [showHelp, setShowHelp] = useState(false);
  const style = BIAS_STYLES[synthesis.overallBias];

  return (
    <div className={`mt-4 p-4 border rounded-sm ${style.border} ${style.bg}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xl uppercase tracking-wider text-gray-500">Synthesis</span>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-xl text-gray-600 hover:text-amber-500"
            title="What is this?"
          >
            ?
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl uppercase font-bold ${style.text}`}>
            {BIAS_LABELS[synthesis.overallBias]}
          </span>
          <span className="text-xl text-gray-500">
            {Math.round(synthesis.confidence * 100)}
            %
          </span>
        </div>
      </div>

      {showHelp && (
        <div className="mb-3 pl-3 border-l-2 border-amber-800">
          <p className="text-xl text-amber-500/80 leading-relaxed">
            Combines all accepted interpretation branches using majority voting.
            Each branch contributes its bias (observe/act/avoid/neutral).
            In ties, caution takes precedence over action.
            Toggle branches above to see how the synthesis changes.
          </p>
        </div>
      )}

      <div className="text-xl text-gray-400 mb-3">{synthesis.rationale}</div>

      {/* Sensitivities */}
      {synthesis.sensitivities.length > 0 && (
        <div className="border-t border-[#2a2a2a] pt-3">
          <div className="text-xl uppercase tracking-wider text-gray-600 mb-2">
            What would change it
          </div>
          {synthesis.sensitivities.map((s) => {
            const wouldChange = s.ifToggled !== synthesis.overallBias;
            if (!wouldChange) return null;
            const toggleAction = s.currentState === "rejected" ? "Accepting" : "Rejecting";
            return (
              <div key={s.branchId} className="text-xl text-gray-500 mb-1">
                {toggleAction}
                {' '}
                <span className="text-gray-300">{s.branchLabel}</span>
                {" → "}
                <span className={BIAS_STYLES[s.ifToggled].text}>
                  {BIAS_LABELS[s.ifToggled]}
                </span>
              </div>
            );
          })}
          {synthesis.sensitivities.every(s => s.ifToggled === synthesis.overallBias) && (
            <div className="text-xl text-gray-500">
              Robust — toggling any single branch does not change the overall bias
            </div>
          )}
        </div>
      )}
    </div>
  );
}
