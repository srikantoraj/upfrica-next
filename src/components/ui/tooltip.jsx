'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export function TooltipProvider({ ...props }) {
  return <TooltipPrimitive.Provider delayDuration={300} {...props} />;
}

export function Tooltip({ children, ...props }) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, sideOffset = 4, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md bg-black/90 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}