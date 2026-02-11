"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface PanelHelpProps {
  text: string;
}

export default function PanelHelp({ text }: PanelHelpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="text-xl text-gray-600 hover:text-amber-500 shrink-0"
          title="What is this?"
        >
          ?
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="max-w-lg bg-[#1a1a1a] border-amber-800 p-4"
      >
        <div className="max-h-80 overflow-y-auto text-sm text-amber-500/80 font-mono leading-relaxed whitespace-pre-line">
          {text}
        </div>
      </PopoverContent>
    </Popover>
  );
}
