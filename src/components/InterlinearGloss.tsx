"use client";

import { cn } from "@/lib/utils";
import type { HatcherCharacter } from "@/lib/hatcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InterlinearGlossProps {
  characters: HatcherCharacter[];
  phrases?: number[];
  variant?: "inline" | "stacked";
  className?: string;
}

// Extract short display meaning, skipping bare articles
function shortMeaning(meaning: string): string {
  const parts = meaning.split(/[,;]/).map(s => s.trim());
  if (parts.length > 1 && (parts[0] === "a" || parts[0] === "an" || parts[0] === "the")) {
    return parts[1];
  }
  return parts[0];
}

// Check if full meaning adds info beyond the short version
function hasExtraMeaning(meaning: string): boolean {
  return meaning.includes(",") || meaning.includes(";");
}

// Split characters into phrase groups
function groupByPhrases(characters: HatcherCharacter[], phrases?: number[]): HatcherCharacter[][] {
  if (!phrases || phrases.length === 0) return [characters];
  const groups: HatcherCharacter[][] = [];
  let offset = 0;
  for (const len of phrases) {
    groups.push(characters.slice(offset, offset + len));
    offset += len;
  }
  if (offset < characters.length) {
    groups.push(characters.slice(offset));
  }
  return groups;
}

// Character with optional tooltip for full meaning
function GlossChar({ c, children }: { c: HatcherCharacter; children: React.ReactNode }) {
  if (!hasExtraMeaning(c.meaning)) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-sm">
        <p className="font-semibold">
          {c.char}
          {' '}
          {c.pinyin}
        </p>
        <p className="text-gray-400">{c.meaning}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function InterlinearGloss({
  characters,
  phrases,
  variant = "inline",
  className,
}: InterlinearGlossProps) {
  if (!characters || characters.length === 0) return null;

  const groups = groupByPhrases(characters, phrases);

  if (variant === "stacked") {
    return (
      <TooltipProvider delayDuration={200}>
        <div className={cn("space-y-2 font-mono text-sm sm:text-base", className)}>
          {groups.map((group, gi) => (
            <div
              key={gi}
              className="flex flex-wrap gap-x-4 gap-y-1"
            >
              {group.map((c, i) => {
                const extra = hasExtraMeaning(c.meaning);
                return (
                  <GlossChar key={i} c={c}>
                    <div className={cn("flex flex-col items-center min-w-[3rem]", extra && "cursor-help")}>
                      <span className="text-lg sm:text-xl text-gray-200">{c.char}</span>
                      <span className="text-gray-500">{c.pinyin}</span>
                      <span className={cn(
                        "text-xs sm:text-sm text-gray-400 text-center",
                        extra && "underline decoration-dotted decoration-gray-500"
                      )}
                      >
                        {shortMeaning(c.meaning)}
                      </span>
                    </div>
                  </GlossChar>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  // inline variant
  return (
    <TooltipProvider delayDuration={200}>
      <span
        className={cn(
          "font-mono text-sm sm:text-base text-gray-200 leading-relaxed",
          className
        )}
      >
        {groups.map((group, gi) => (
          <span key={gi}>
            {gi > 0 && <span className="text-gray-600"> ∣ </span>}
            {group.map((c, i) => {
              const extra = hasExtraMeaning(c.meaning);
              return (
                <GlossChar key={i} c={c}>
                  <span className={extra ? "cursor-help" : undefined}>
                    {i > 0 && <span className="text-gray-600"> · </span>}
                    <span className="text-gray-200">{c.char}</span>
                    {" "}
                    <span className="text-gray-500">{c.pinyin}</span>
                    {" "}
                    <span className={cn(
                      "text-gray-300",
                      extra && "underline decoration-dotted decoration-gray-600"
                    )}
                    >
                      {shortMeaning(c.meaning)}
                    </span>
                  </span>
                </GlossChar>
              );
            })}
          </span>
        ))}
      </span>
    </TooltipProvider>
  );
}
