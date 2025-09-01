"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function InfoTooltip({
  content,
  iconSize = 14,
  className = "",
  side = "top",
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="More information"
          className={`text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${className}`}
        >
          <Info style={{ width: iconSize, height: iconSize }} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        className="text-sm leading-snug text-gray-700 max-w-xs"
      >
        {typeof content === "string" ? <span>{content}</span> : content}
      </PopoverContent>
    </Popover>
  );
}
