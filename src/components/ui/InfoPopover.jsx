"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function InfoPopover({ children, side = "top", iconSize = 16 }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Info className={`w-${iconSize} h-${iconSize}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent side={side} className="max-w-xs text-sm leading-snug">
        {children}
      </PopoverContent>
    </Popover>
  );
}
