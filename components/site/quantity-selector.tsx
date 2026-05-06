"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function Icon({ children }: { children: ReactNode }) {
  return <span className="text-base leading-none">{children}</span>;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-charcoal-900/60 p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-rice-100 hover:bg-white/10"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Icon>−</Icon>
      </button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-rice-100 hover:bg-white/10"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Icon>+</Icon>
      </button>
    </div>
  );
}
