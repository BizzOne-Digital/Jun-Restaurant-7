"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-2.5 text-sm",
        size === "lg" && "px-8 py-3 text-base",
        variant === "primary" &&
          "bg-gradient-to-r from-coral-500 via-mango-500 to-avocado-500 text-charcoal-900 shadow-lift hover:brightness-105",
        variant === "ghost" && "bg-white/10 text-rice-50 hover:bg-white/15",
        variant === "outline" && "border border-white/20 bg-transparent text-rice-50 hover:bg-white/5",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        className
      )}
      {...props}
    />
  );
});
