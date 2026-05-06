"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BuildBowlSelection } from "@/types";
import { BYO_OPTIONS } from "@/lib/byo-options";
import { calculateBuildBowlPrice } from "@/lib/build-bowl-pricing";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

function toKey(s: string) {
  return s.toLowerCase();
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-transparent bg-gradient-to-r from-coral-500/90 to-mango-500/90 text-charcoal-900"
          : "border-white/15 bg-white/5 text-rice-200 hover:border-white/25"
      )}
    >
      {children}
    </button>
  );
}

export function BuildBowlModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addBuildBowl = useCartStore((s) => s.addBuildBowl);
  const [sel, setSel] = React.useState<BuildBowlSelection>({
    size: "regular",
    base: toKey(BYO_OPTIONS.bases[0]),
    protein: toKey(BYO_OPTIONS.proteins[0]),
    toppings: ["avocado", "cucumber", "edamame"],
    crunch: ["furikake"],
    sauce: ["spicy mayo"],
  });

  const price = calculateBuildBowlPrice(sel);

  const toggle = (field: "toppings" | "crunch" | "sauce", key: string) => {
    setSel((prev) => {
      const arr = new Set(prev[field]);
      if (arr.has(key)) arr.delete(key);
      else arr.add(key);
      return { ...prev, [field]: Array.from(arr) };
    });
  };

  const handleAdd = () => {
    addBuildBowl(sel, 1);
    toast.success("Bowl added to cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="glass-panel max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-4 sm:max-h-[90vh] sm:rounded-3xl sm:p-6 md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mango-300 sm:text-xs sm:tracking-[0.3em]">Custom</p>
                <h2 className="font-display text-xl text-rice-50 sm:text-2xl">Build Your Own Bowl</h2>
                <p className="mt-1 text-sm text-rice-400">Live price updates as you compose.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-rice-300 hover:bg-white/5"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Size</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.sizes.map((s) => (
                    <Chip key={s.id} active={sel.size === s.id} onClick={() => setSel({ ...sel, size: s.id })}>
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Base</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.bases.map((b) => {
                    const k = toKey(b);
                    return (
                      <Chip key={b} active={sel.base === k} onClick={() => setSel({ ...sel, base: k })}>
                        {b}
                      </Chip>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Protein</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.proteins.map((p) => {
                    const k = toKey(p);
                    return (
                      <Chip key={p} active={sel.protein === k} onClick={() => setSel({ ...sel, protein: k })}>
                        {p}
                      </Chip>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Toppings</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.toppings.map((t) => {
                    const k = toKey(t);
                    return (
                      <Chip key={t} active={sel.toppings.includes(k)} onClick={() => toggle("toppings", k)}>
                        {t}
                      </Chip>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Crunch</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.crunch.map((c) => {
                    const k = toKey(c);
                    return (
                      <Chip key={c} active={sel.crunch.includes(k)} onClick={() => toggle("crunch", k)}>
                        {c}
                      </Chip>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rice-400">Sauce</p>
                <div className="flex flex-wrap gap-2">
                  {BYO_OPTIONS.sauces.map((s) => {
                    const k = toKey(s);
                    return (
                      <Chip key={s} active={sel.sauce.includes(k)} onClick={() => toggle("sauce", k)}>
                        {s}
                      </Chip>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-rice-400">Your bowl</p>
                <p className="font-display text-3xl text-mango-300">${price.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:flex sm:gap-3">
                <Button variant="ghost" type="button" className="w-full sm:w-auto" onClick={onClose}>
                  Keep browsing
                </Button>
                <Button type="button" className="w-full sm:w-auto" onClick={handleAdd}>
                  Add to cart
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
