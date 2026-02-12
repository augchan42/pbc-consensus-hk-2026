"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlumBlossomComputerResult, AgreementState } from "@/lib/plumBlossomComputer/core/types";
import { computePlumBlossom } from "@/lib/plumBlossomComputer";
import { recomputeWithToggles } from "@/lib/plumBlossomComputer/reasoning/graphBuilder";
import {
  canonicalCosmology,
  canonicalReasoning,
  hashCosmology,
  hashReasoning,
  biasToUint8,
  uint8ToBiasLabel,
} from "@/lib/oracleHash";
import { getEthProvider, getRegistryContract, CHAIN_CONFIG } from "@/lib/wallet";
import PanelHelp from "./PanelHelp";

interface Props {
  result: PlumBlossomComputerResult;
}

interface OnChainEntry {
  id: number;
  cosmologyHash: string;
  reasoningHash: string;
  bias: number;
  confidence: number;
  hexagramNumber: number;
  movingLine: number;
  computationTimestamp: number;
  commitTimestamp: number;
  committer: string;
}

type VerifyStatus = "idle" | "verifying" | "match" | "mismatch";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm text-xl text-gray-400 hover:border-[#44ff88] hover:text-[#44ff88] transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied ? "Copied" : label || "Copy"}
    </button>
  );
}

function DataBlock({ label, value, helpText }: { label: string; value: string; helpText?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl text-gray-500 uppercase">{label}</span>
          {helpText && <PanelHelp text={helpText} />}
        </div>
        <CopyButton text={value} />
      </div>
      <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4 text-xl text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {value}
      </pre>
    </div>
  );
}

const explorer = CHAIN_CONFIG.blockExplorerUrls[0];

const BIAS_COLORS: Record<string, string> = {
  ACT: "text-[#44ff88]",
  OBSERVE: "text-amber-400",
  AVOID: "text-red-400",
  NEUTRAL: "text-gray-400",
};

export default function VerifyView({ result }: Props) {
  const [history, setHistory] = useState<OnChainEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<OnChainEntry | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [verifyResult, setVerifyResult] = useState<{
    cosmMatch: boolean;
    reasMatch: boolean;
    recomputedCosmHash: string;
    recomputedReasHash: string;
    recomputedCosmCanonical: string;
    recomputedReasCanonical: string;
    matchedToggles?: Record<string, AgreementState>;
  } | null>(null);

  const registryAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;

  // Load commitment history
  useEffect(() => {
    async function loadHistory() {
      if (!registryAddress || typeof window === "undefined" || !window.ethereum) return;
      try {
        const { BrowserProvider } = await import("ethers");
        const eth = getEthProvider();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = new BrowserProvider(eth as any);
        const contract = getRegistryContract(provider);
        const count = await contract.commitmentCount();
        const total = Number(count);
        if (total === 0) return;

        const cap = Math.min(total, 20);
        const entries: OnChainEntry[] = [];
        for (let i = total - 1; i >= total - cap; i--) {
          const h = await contract.commitments(i);
          entries.push({
            id: i,
            cosmologyHash: h[0],
            reasoningHash: h[1],
            bias: Number(h[2]),
            confidence: Number(h[3]),
            hexagramNumber: Number(h[4]),
            movingLine: Number(h[5]),
            computationTimestamp: Number(h[6]),
            commitTimestamp: Number(h[7]),
            committer: h[8],
          });
        }
        setHistory(entries);
      } catch {
        // No wallet or contract not deployed
      }
    }
    loadHistory();
  }, [registryAddress]);

  // Current computation data
  const cosmCanonical = canonicalCosmology(result.cosmology);
  const reasCanonical = canonicalReasoning(result.reasoning);
  const cosmHash = hashCosmology(result.cosmology);
  const reasHash = hashReasoning(result.reasoning);
  const timestamp = result.timestamp;
  const unixTimestamp = Math.floor(new Date(timestamp).getTime() / 1000);
  const biasUint8Val = biasToUint8(result.reasoning.synthesis.overallBias);
  const biasLabel = uint8ToBiasLabel(biasUint8Val);
  const confidence = Math.round(result.reasoning.synthesis.confidence * 100);
  const hexNum = result.cosmology.hexagram.timeBased.hexagramNumber;
  const movingLine = result.cosmology.hexagram.timeBased.movingLine;

  const cosmPretty = JSON.stringify(JSON.parse(cosmCanonical), null, 2);
  const reasPretty = JSON.stringify(JSON.parse(reasCanonical), null, 2);

  // Verify against an on-chain entry by recomputing from its timestamp.
  // If the default (no-toggle) reasoning hash doesn't match, brute-force
  // all 9 toggle combinations (2 branches x 3 states) to find the match.
  const handleVerify = useCallback(async (entry: OnChainEntry) => {
    setSelectedEntry(entry);
    setVerifyStatus("verifying");
    setVerifyResult(null);

    const recomputed = computePlumBlossom({ date: new Date(entry.computationTimestamp * 1000) });
    const reCosmCanonical = canonicalCosmology(recomputed.cosmology);
    const reCosmHash = hashCosmology(recomputed.cosmology);
    const cosmMatch = reCosmHash === entry.cosmologyHash;

    // Try default (no toggles) first
    let reReasCanonical = canonicalReasoning(recomputed.reasoning);
    let reReasHash = hashReasoning(recomputed.reasoning);
    let reasMatch = reReasHash === entry.reasoningHash;
    let matchedToggles: Record<string, AgreementState> | undefined;

    // If reasoning doesn't match, cycle through all toggle combinations
    if (!reasMatch) {
      const states: AgreementState[] = ["neutral", "accepted", "rejected"];
      const branchIds = recomputed.reasoning.branches.map(b => b.id);

      for (const s0 of states) {
        for (const s1 of states) {
          const toggles: Record<string, AgreementState> = {
            [branchIds[0]]: s0,
            [branchIds[1]]: s1,
          };
          // Skip all-neutral (already tried above)
          if (s0 === "neutral" && s1 === "neutral") continue;

          const toggled = recomputeWithToggles(recomputed.cosmology, toggles);
          const hash = hashReasoning(toggled);
          if (hash === entry.reasoningHash) {
            reasMatch = true;
            reReasCanonical = canonicalReasoning(toggled);
            reReasHash = hash;
            matchedToggles = toggles;
            break;
          }
        }
        if (reasMatch) break;
      }
    }

    setVerifyResult({
      cosmMatch,
      reasMatch,
      recomputedCosmHash: reCosmHash,
      recomputedReasHash: reReasHash,
      recomputedCosmCanonical: reCosmCanonical,
      recomputedReasCanonical: reReasCanonical,
      matchedToggles,
    });
    setVerifyStatus(cosmMatch && reasMatch ? "match" : "mismatch");
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 font-mono">
      {/* Header */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl text-gray-200 uppercase tracking-wider">
            Verify Commitment
          </h2>
          <PanelHelp text={"This page shows the exact data that gets hashed and committed on-chain. "
            + "To verify a commitment:\n\n"
            + "1. Take the computation timestamp from any on-chain commitment\n"
            + "2. Recompute: computePlumBlossom({ date: new Date(timestamp) })\n"
            + "3. The canonical JSON is the deterministic serialization of the result\n"
            + "4. keccak256(utf8Bytes(canonicalJSON)) produces the hash\n"
            + "5. Compare the hash with the on-chain commitment\n\n"
            + "The computation is entirely client-side and deterministic — "
            + "the same timestamp always produces the same result, the same canonical JSON, and the same hash. "
            + "Click any commitment below to verify it automatically."} />
        </div>
        <p className="text-xl text-gray-500 leading-relaxed">
          Copy the exact bytes that were hashed, or click a commitment to recompute and verify automatically.
        </p>
      </div>

      {/* ============ COMMITMENT HISTORY + VERIFY ============ */}
      {history.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl text-gray-500 uppercase">On-Chain Commitments</span>
            <PanelHelp text="Click any row to recompute from its timestamp and verify the hashes match the on-chain values. The computation runs entirely in your browser." />
          </div>
          <div className="max-h-64 overflow-y-auto border border-[#2a2a2a] rounded-sm">
            <table className="w-full text-xl text-gray-500">
              <thead>
                <tr className="text-gray-600 border-b border-[#2a2a2a] bg-[#141414]">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Bias</th>
                  <th className="text-left py-2 px-3">Hex</th>
                  <th className="text-left py-2 px-3">Committer</th>
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => {
                  const label = uint8ToBiasLabel(entry.bias);
                  const isSelected = selectedEntry?.id === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => handleVerify(entry)}
                      className={`border-b border-[#1e1e1e] cursor-pointer transition-colors ${
                        isSelected ? "bg-[#1a1a1a] border-l-2 border-l-[#44ff88]" : "hover:bg-[#141414]"
                      }`}
                    >
                      <td className="py-2 px-3 text-gray-600">{entry.id}</td>
                      <td className={`py-2 px-3 font-bold ${BIAS_COLORS[label]}`}>{label}</td>
                      <td className="py-2 px-3">#{entry.hexagramNumber} / L{entry.movingLine}</td>
                      <td className="py-2 px-3">
                        <a
                          href={`${explorer}/address/${entry.committer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-300"
                          onClick={e => e.stopPropagation()}
                        >
                          {entry.committer.slice(0, 6)}...{entry.committer.slice(-4)}
                        </a>
                      </td>
                      <td className="py-2 px-3">{new Date(entry.commitTimestamp * 1000).toLocaleString()}</td>
                      <td className="py-2 px-3 text-gray-600">
                        {isSelected && verifyStatus === "verifying" && "..."}
                        {isSelected && verifyStatus === "match" && <span className="text-[#44ff88]">Verified</span>}
                        {isSelected && verifyStatus === "mismatch" && <span className="text-red-400">Mismatch</span>}
                        {!isSelected && "Verify"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Verification result detail */}
          {selectedEntry && verifyResult && (
            <div className={`mt-3 p-4 border rounded-sm ${
              verifyStatus === "match"
                ? "border-green-800 bg-green-900/10"
                : "border-red-800 bg-red-900/10"
            }`}>
              <div className="text-xl mb-3">
                {verifyStatus === "match" ? (
                  <span className="text-[#44ff88] font-bold">Hashes match — commitment verified</span>
                ) : (
                  <span className="text-red-400 font-bold">Hash mismatch — commitment does not match recomputation</span>
                )}
              </div>
              <div className="space-y-2 text-xl">
                <div>
                  <span className="text-gray-600">Recomputed from: </span>
                  <span className="text-gray-400">{new Date(selectedEntry.computationTimestamp * 1000).toISOString()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="text-gray-600 mb-1">On-chain cosm hash</div>
                    <div className="text-gray-400 break-all text-xl">{selectedEntry.cosmologyHash}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Recomputed cosm hash</div>
                    <div className={`break-all text-xl ${verifyResult.cosmMatch ? "text-[#44ff88]" : "text-red-400"}`}>
                      {verifyResult.recomputedCosmHash}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">On-chain reas hash</div>
                    <div className="text-gray-400 break-all text-xl">{selectedEntry.reasoningHash}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Recomputed reas hash</div>
                    <div className={`break-all text-xl ${verifyResult.reasMatch ? "text-[#44ff88]" : "text-red-400"}`}>
                      {verifyResult.recomputedReasHash}
                    </div>
                  </div>
                </div>

                {/* Toggle combinations tried */}
                {(() => {
                  const states: AgreementState[] = ["neutral", "accepted", "rejected"];
                  const branchIds = ["cosmology", "astronomical"];
                  const matchedKey = verifyResult.matchedToggles
                    ? `${verifyResult.matchedToggles[branchIds[0]]}-${verifyResult.matchedToggles[branchIds[1]]}`
                    : (verifyResult.reasMatch ? "neutral-neutral" : null);

                  return (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl text-gray-500 uppercase">Toggle Combinations</span>
                        <PanelHelp text="Users can accept or reject each reasoning branch before committing. This changes the synthesis hash. All 9 combinations are checked to find which toggle state produced the on-chain hash." />
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-xl">
                        {states.map(s0 =>
                          states.map(s1 => {
                            const key = `${s0}-${s1}`;
                            const isMatch = key === matchedKey;
                            return (
                              <div
                                key={key}
                                className={`px-3 py-2 rounded-sm border ${
                                  isMatch
                                    ? "border-[#44ff88] bg-[#44ff88]/10 text-[#44ff88]"
                                    : "border-[#1e1e1e] bg-[#0a0a0a] text-gray-600"
                                }`}
                              >
                                <span className="text-gray-500">cosm:</span>{s0}{" "}
                                <span className="text-gray-500">astro:</span>{s1}
                                {isMatch && " \u2713"}
                              </div>
                            );
                          })
                        )}
                      </div>
                      {!matchedKey && (
                        <div className="mt-2 text-xl text-red-400">
                          No toggle combination matched the on-chain reasoning hash
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Recomputed pre-images */}
                <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                  <div className="text-xl text-gray-500 uppercase mb-3">Recomputed Pre-Images (what was hashed)</div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl text-gray-500">Cosmology canonical JSON</span>
                      <div className="flex gap-2">
                        <CopyButton text={verifyResult.recomputedCosmCanonical} label="Compact" />
                        <CopyButton text={JSON.stringify(JSON.parse(verifyResult.recomputedCosmCanonical), null, 2)} label="Pretty" />
                      </div>
                    </div>
                    <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4 text-xl text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-64 overflow-y-auto">
                      {JSON.stringify(JSON.parse(verifyResult.recomputedCosmCanonical), null, 2)}
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl text-gray-500">Reasoning canonical JSON</span>
                      <div className="flex gap-2">
                        <CopyButton text={verifyResult.recomputedReasCanonical} label="Compact" />
                        <CopyButton text={JSON.stringify(JSON.parse(verifyResult.recomputedReasCanonical), null, 2)} label="Pretty" />
                      </div>
                    </div>
                    <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4 text-xl text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-64 overflow-y-auto">
                      {JSON.stringify(JSON.parse(verifyResult.recomputedReasCanonical), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ CURRENT COMPUTATION DATA ============ */}
      <div className="border-t border-[#2a2a2a] pt-6">
        <div className="text-xl text-gray-500 uppercase mb-4">Current Computation</div>

        {/* Timestamp */}
        <DataBlock
          label="Computation Timestamp"
          value={timestamp}
          helpText={"The ISO 8601 timestamp used as input to computePlumBlossom(). "
            + "This is the sole input — everything else is deterministically derived. "
            + "Unix epoch: " + unixTimestamp + " (this is what gets stored on-chain)."}
        />

        {/* On-chain parameters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl text-gray-500 uppercase">On-Chain Parameters</span>
            <PanelHelp text={"These are the values passed to the smart contract's commit() function. "
              + "bias: uint8 (0=neutral, 1=act, 2=observe, 3=avoid). "
              + "confidence: uint8 (0-100). "
              + "hexagramNumber and movingLine are stored for quick lookup without recomputation."} />
          </div>
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xl">
              <div>
                <div className="text-gray-600 mb-1">bias</div>
                <div className="text-gray-300">{biasUint8Val} ({biasLabel})</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">confidence</div>
                <div className="text-gray-300">{confidence}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">hexagram</div>
                <div className="text-gray-300">#{hexNum}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">movingLine</div>
                <div className="text-gray-300">{movingLine}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">timestamp (unix)</div>
                <div className="text-gray-300">{unixTimestamp}</div>
              </div>
              {registryAddress && (
                <div>
                  <div className="text-gray-600 mb-1">contract</div>
                  <a
                    href={`${explorer}/address/${registryAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#44ff88] transition-colors break-all"
                  >
                    {registryAddress.slice(0, 10)}...{registryAddress.slice(-8)}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cosmology Hash */}
        <DataBlock
          label="Cosmology Hash (keccak256)"
          value={cosmHash}
          helpText="keccak256 of the canonical cosmology JSON below, encoded as UTF-8 bytes. This is stored on-chain as cosmologyHash."
        />

        {/* Cosmology Pre-image */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-500 uppercase">Cosmology Pre-Image (canonical JSON)</span>
              <PanelHelp text={"This is the exact JSON string that gets hashed. "
                + "The compact form (no whitespace) is what actually gets hashed — "
                + "keccak256(toUtf8Bytes(compactJSON)). "
                + "The pretty-printed version below is for readability only."} />
            </div>
            <div className="flex gap-2">
              <CopyButton text={cosmCanonical} label="Compact" />
              <CopyButton text={cosmPretty} label="Pretty" />
            </div>
          </div>
          <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4 text-xl text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-96 overflow-y-auto">
            {cosmPretty}
          </pre>
        </div>

        {/* Reasoning Hash */}
        <DataBlock
          label="Reasoning Hash (keccak256)"
          value={reasHash}
          helpText="keccak256 of the canonical reasoning JSON below, encoded as UTF-8 bytes. This is stored on-chain as reasoningHash."
        />

        {/* Reasoning Pre-image */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-500 uppercase">Reasoning Pre-Image (canonical JSON)</span>
              <PanelHelp text={"This is the exact JSON string that gets hashed. "
                + "The compact form (no whitespace) is what actually gets hashed."} />
            </div>
            <div className="flex gap-2">
              <CopyButton text={reasCanonical} label="Compact" />
              <CopyButton text={reasPretty} label="Pretty" />
            </div>
          </div>
          <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-4 text-xl text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-96 overflow-y-auto">
            {reasPretty}
          </pre>
        </div>
      </div>

      {/* Verification steps */}
      <div className="mb-8 border-t border-[#2a2a2a] pt-6">
        <div className="text-xl text-gray-500 uppercase mb-3">How To Verify Manually</div>
        <ol className="text-xl text-gray-400 leading-relaxed space-y-2 list-decimal list-inside">
          <li>Copy the <span className="text-gray-300">Computation Timestamp</span> above</li>
          <li>
            Run{" "}
            <code className="text-[#44ff88] bg-[#0a0a0a] px-1">
              computePlumBlossom({"{"} date: new Date(&quot;{timestamp}&quot;) {"}"})
            </code>
          </li>
          <li>Serialize with <code className="text-[#44ff88] bg-[#0a0a0a] px-1">canonicalCosmology()</code> and <code className="text-[#44ff88] bg-[#0a0a0a] px-1">canonicalReasoning()</code></li>
          <li>Hash each with <code className="text-[#44ff88] bg-[#0a0a0a] px-1">keccak256(toUtf8Bytes(json))</code></li>
          <li>Compare with on-chain hashes at the{" "}
            {registryAddress ? (
              <a
                href={`${explorer}/address/${registryAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#44ff88] underline"
              >
                contract
              </a>
            ) : (
              <span className="text-gray-600">contract (not configured)</span>
            )}
          </li>
        </ol>
      </div>
    </div>
  );
}
