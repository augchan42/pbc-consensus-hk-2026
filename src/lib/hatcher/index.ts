// src/lib/hatcher/index.ts
// Hatcher interlinear gloss data loader and formatting utilities
import hatcherData from "@/constants/hatcher/hatcherData.json";

// Types
export interface HatcherCharacter {
  char: string;
  pinyin: string;
  meaning: string;
}

export interface HatcherLine {
  position: number;
  text: string;
  characters: HatcherCharacter[];
  phrases?: number[];
}

export interface HatcherHexagram {
  id: number;
  name: HatcherCharacter;
  judgment: HatcherCharacter[];
  image: HatcherCharacter[];
  lines: HatcherLine[];
}

// Data access
const typedData = hatcherData as Record<string, HatcherHexagram>;

export function getHatcherHexagram(n: number): HatcherHexagram | null {
  return typedData[String(n)] ?? null;
}

// Pure formatting utilities (for API/iOS responses)

export function formatGlossInline(chars: HatcherCharacter[]): string {
  return chars
    .map(c => `${c.char} ${c.pinyin} ${c.meaning}`)
    .join(" · ");
}

export function formatChineseOnly(chars: HatcherCharacter[]): string {
  return chars.map(c => c.char).join("");
}

export function formatForPrompt(chars: HatcherCharacter[]): string {
  return chars
    .map(c => `${c.char} (${c.pinyin}) — ${c.meaning}`)
    .join("\n");
}
