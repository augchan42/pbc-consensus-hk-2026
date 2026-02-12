"use client";

import { useState, useEffect, useCallback } from "react";
import type { PlumBlossomComputerResult } from "@/lib/plumBlossomComputer/core/types";
import { hashCosmology, hashReasoning, biasToUint8, uint8ToBiasLabel } from "@/lib/oracleHash";
import { connectWallet, switchChain, getRegistryContract, getEthProvider, CHAIN_CONFIG } from "@/lib/wallet";
import PanelHelp from "./PanelHelp";

interface Props {
  result: PlumBlossomComputerResult;
}

interface OnChainState {
  id: number;
  bias: number;
  confidence: number;
  hexagramNumber: number;
  movingLine: number;
  computationTimestamp: number;
  commitTimestamp: number;
  committer: string;
  cosmologyHash: string;
  reasoningHash: string;
}

type TxStatus = "idle" | "connecting" | "switching" | "signing" | "pending" | "confirmed" | "error";

const BIAS_COLORS: Record<string, string> = {
  ACT: "text-[#44ff88]",
  OBSERVE: "text-amber-400",
  AVOID: "text-red-400",
  NEUTRAL: "text-gray-400",
};

const explorer = CHAIN_CONFIG.blockExplorerUrls[0];

export default function OraclePanel({ result }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [onChain, setOnChain] = useState<OnChainState | null>(null);
  const [history, setHistory] = useState<OnChainState[]>([]);
  const [totalCommitments, setTotalCommitments] = useState<number>(0);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const registryAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;

  const readOnChainState = useCallback(async () => {
    if (!registryAddress || !window.ethereum) return;
    try {
      const { BrowserProvider } = await import("ethers");
      const eth = getEthProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new BrowserProvider(eth as any);
      const contract = getRegistryContract(provider);
      const count = await contract.commitmentCount();
      const total = Number(count);
      setTotalCommitments(total);
      if (total > 0) {
        const c = await contract.getLatestCommitment();
        setOnChain({
          id: Number(c[0]),
          cosmologyHash: c[1],
          reasoningHash: c[2],
          bias: Number(c[3]),
          confidence: Number(c[4]),
          hexagramNumber: Number(c[5]),
          movingLine: Number(c[6]),
          computationTimestamp: Number(c[7]),
          commitTimestamp: Number(c[8]),
          committer: c[9],
        });

        // Fetch history (newest first, cap at 20)
        const cap = Math.min(total, 20);
        const entries: OnChainState[] = [];
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
      }
    } catch {
      // No wallet or contract not deployed — silent
    }
  }, [registryAddress]);

  useEffect(() => {
    readOnChainState();
  }, [readOnChainState]);

  const handleConnect = async () => {
    setError(null);
    setTxStatus("connecting");
    try {
      // Request accounts first, then switch chain
      const { signer } = await connectWallet();
      const addr = await signer.getAddress();
      setAddress(addr);
      setTxStatus("switching");
      await switchChain();
      setTxStatus("idle");
      await readOnChainState();
    } catch (err: unknown) {
      setError((err as Error).message || "Connection failed");
      setTxStatus("error");
    }
  };

  const handleCommit = async () => {
    if (!address) return;
    setError(null);
    setTxHash(null);
    setTxStatus("signing");
    try {
      const { signer } = await connectWallet();
      const contract = getRegistryContract(signer);

      const cosmologyHash = hashCosmology(result.cosmology);
      const reasoningHash = hashReasoning(result.reasoning);
      const bias = biasToUint8(result.reasoning.synthesis.overallBias);
      const confidence = Math.round(result.reasoning.synthesis.confidence * 100);
      const hexagramNumber = result.cosmology.hexagram.timeBased.hexagramNumber;
      const movingLine = result.cosmology.hexagram.timeBased.movingLine;
      const timestamp = Math.floor(new Date(result.timestamp).getTime() / 1000);

      const tx = await contract.commit(
        cosmologyHash,
        reasoningHash,
        bias,
        confidence,
        hexagramNumber,
        movingLine,
        timestamp
      );
      setTxHash(tx.hash);
      setTxStatus("pending");
      await tx.wait();
      setTxStatus("confirmed");
      await readOnChainState();
    } catch (err: unknown) {
      setError((err as Error).message?.slice(0, 120) || "Transaction failed");
      setTxStatus("error");
    }
  };

  const biasLabel = uint8ToBiasLabel(biasToUint8(result.reasoning.synthesis.overallBias));
  const offChainConfidence = Math.round(result.reasoning.synthesis.confidence * 100);

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm col-span-full">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono uppercase tracking-wider text-gray-500">
            Cosmic Commitment Registry
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">{CHAIN_CONFIG.chainName}</span>
        </div>
        <PanelHelp text="Cryptographic anchoring for the Plum Blossom Computer. Commits a tamper-evident hash of the deterministic cosmology computation and reasoning synthesis to the blockchain. Anyone can recompute with the same timestamp and verify the hashes match. Ancient oracles relied on ritual to prevent revision — this one relies on cryptography." />
      </div>

      <div className="p-4 font-mono text-xl">
        {/* Two-column layout: off-chain signal vs on-chain commitment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Current computed signal */}
          <div>
            <div className="text-xs text-gray-600 uppercase mb-2">Current Signal (off-chain)</div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl font-bold ${BIAS_COLORS[biasLabel]}`}>{biasLabel}</span>
              <span className="text-gray-500">{offChainConfidence}% confidence</span>
            </div>
            <div className="text-gray-500 text-xs space-y-0.5">
              <div>Hexagram #{result.cosmology.hexagram.timeBased.hexagramNumber} / Line {result.cosmology.hexagram.timeBased.movingLine}</div>
              <div className="truncate text-gray-600" title={hashCosmology(result.cosmology)}>
                cosm: {hashCosmology(result.cosmology).slice(0, 18)}...
              </div>
              <div className="truncate text-gray-600" title={hashReasoning(result.reasoning)}>
                reas: {hashReasoning(result.reasoning).slice(0, 18)}...
              </div>
            </div>
          </div>

          {/* Right: On-chain state */}
          <div>
            <div className="text-xs text-gray-600 uppercase mb-2">Latest Commitment (on-chain)</div>
            {!registryAddress ? (
              <div className="text-xs text-gray-600">Contract not configured</div>
            ) : onChain ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl font-bold ${BIAS_COLORS[uint8ToBiasLabel(onChain.bias)]}`}>
                    {uint8ToBiasLabel(onChain.bias)}
                  </span>
                  <span className="text-gray-500">{onChain.confidence}% confidence</span>
                </div>
                <div className="text-gray-500 text-xs space-y-0.5">
                  <div>Hexagram #{onChain.hexagramNumber} / Line {onChain.movingLine}</div>
                  <div>Commitment #{onChain.id} / {totalCommitments} total</div>
                  <div>{new Date(onChain.computationTimestamp * 1000).toLocaleString()}</div>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-600">No commitments yet — be the first</div>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center gap-3 flex-wrap">
          {!address ? (
            <button
              onClick={handleConnect}
              disabled={txStatus === "connecting" || txStatus === "switching"}
              className="px-4 py-1.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm text-xs text-gray-300 hover:border-[#44ff88] hover:text-[#44ff88] transition-colors disabled:opacity-50"
            >
              {txStatus === "connecting" || txStatus === "switching" ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <>
              <button
                onClick={handleCommit}
                disabled={txStatus === "signing" || txStatus === "pending"}
                className="px-4 py-1.5 bg-[#1a1a1a] border border-[#44ff88]/30 rounded-sm text-xs text-[#44ff88] hover:bg-[#44ff88]/10 transition-colors disabled:opacity-50"
              >
                {txStatus === "signing"
                  ? "Sign tx..."
                  : txStatus === "pending"
                    ? "Confirming..."
                    : "Commit Signal On-Chain"}
              </button>
              <span className="text-xs text-gray-600">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </>
          )}

          {/* Status indicators */}
          {txStatus === "confirmed" && (
            <span className="text-xs text-[#44ff88]">Committed</span>
          )}
          {txHash && (
            <a
              href={`${explorer}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              {txHash.slice(0, 10)}...
            </a>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}

          {/* Gas note + contract link */}
          <span className="text-xs text-gray-600">
            Requires {CHAIN_CONFIG.nativeCurrency.symbol} on {CHAIN_CONFIG.chainName} for gas
          </span>
          {registryAddress && (
            <a
              href={`${explorer}/address/${registryAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-gray-400 ml-auto"
            >
              contract
            </a>
          )}
        </div>

        {/* Commitment History */}
        {history.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
            <div className="text-xs text-gray-600 uppercase mb-2">Commitment History</div>
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs text-gray-500">
                <thead>
                  <tr className="text-gray-600 border-b border-[#2a2a2a]">
                    <th className="text-left py-1 pr-2">#</th>
                    <th className="text-left py-1 pr-2">Bias</th>
                    <th className="text-left py-1 pr-2">Conf</th>
                    <th className="text-left py-1 pr-2">Hex</th>
                    <th className="text-left py-1 pr-2">Committer</th>
                    <th className="text-left py-1">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => {
                    const label = uint8ToBiasLabel(entry.bias);
                    return (
                      <tr key={entry.id} className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a]">
                        <td className="py-1 pr-2 text-gray-600">{entry.id}</td>
                        <td className={`py-1 pr-2 font-bold ${BIAS_COLORS[label]}`}>{label}</td>
                        <td className="py-1 pr-2">{entry.confidence}%</td>
                        <td className="py-1 pr-2">#{entry.hexagramNumber} / L{entry.movingLine}</td>
                        <td className="py-1 pr-2">
                          <a
                            href={`${explorer}/address/${entry.committer}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300"
                          >
                            {entry.committer.slice(0, 6)}...{entry.committer.slice(-4)}
                          </a>
                        </td>
                        <td className="py-1">{new Date(entry.computationTimestamp * 1000).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
