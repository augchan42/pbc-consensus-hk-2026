"use client";

import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface InfoTipProps {
  content: ReactNode;
  children: ReactNode;
}

export default function InfoTip({ content, children }: InfoTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-gray-600">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs bg-[#1a1a1a] border-amber-800/50 px-3 py-2"
      >
        <div className="text-xs font-mono text-gray-300 leading-relaxed">
          {content}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
