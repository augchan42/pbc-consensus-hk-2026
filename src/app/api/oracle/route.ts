import { NextResponse } from "next/server";
import { computePlumBlossom } from "@/lib/plumBlossomComputer";
import { hashCosmology, hashReasoning, biasToUint8 } from "@/lib/oracleHash";

export async function GET() {
  const date = new Date();
  const result = computePlumBlossom({ date });

  const cosmologyHash = hashCosmology(result.cosmology);
  const reasoningHash = hashReasoning(result.reasoning);

  const biasLabel = result.reasoning.synthesis.overallBias;
  const bias = biasToUint8(biasLabel);
  const confidence = Math.round(result.reasoning.synthesis.confidence * 100);
  const hexagramNumber = result.cosmology.hexagram.timeBased.hexagramNumber;
  const movingLine = result.cosmology.hexagram.timeBased.movingLine;

  return NextResponse.json(
    {
      bias,
      biasLabel,
      confidence,
      hexagramNumber,
      movingLine,
      timestamp: Math.floor(date.getTime() / 1000),
      cosmologyHash,
      reasoningHash,
      algorithmVersion: "pbc-1.0.0",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    }
  );
}
