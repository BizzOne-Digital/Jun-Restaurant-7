"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { MenuItemView } from "@/types/menu";
import {
  calculateSelectionsPrice,
  defaultSelections,
  groupMenuOptions,
  type MenuSelections,
} from "@/lib/menu-item-options";

type Props = {
  item: MenuItemView | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: { totalPrice: number; selections: MenuSelections }) => void;
};

function chooseText(minSelect: number, maxSelect: number) {
  if (minSelect === 1 && maxSelect === 1) return "Choose 1";
  return `Choose up to ${maxSelect}`;
}

function fmtPrice(n: number) {
  if (n <= 0) return "";
  return `+$${n.toFixed(2)}`;
}

export function MenuItemCustomizeModal({ item, open, onClose, onConfirm }: Props) {
  const options = React.useMemo(() => item?.options ?? [], [item]);
  const groups = React.useMemo(() => groupMenuOptions(options), [options]);
  const hasImage = Boolean(item?.image);
  const [selections, setSelections] = React.useState<MenuSelections>({});

  React.useEffect(() => {
    if (!open || !item) return;
    setSelections(defaultSelections(options));
  }, [open, item, options]);

  if (!item) return null;

  const pricing = calculateSelectionsPrice(options, selections);
  const total = item.price + (pricing.ok ? pricing.extra : 0);

  const isSelected = (groupKey: string, optionKey: string) => {
    const value = selections[groupKey];
    if (typeof value === "string") return value === optionKey;
    return Array.isArray(value) ? value.includes(optionKey) : false;
  };

  const selectOption = (groupKey: string, optionKey: string, maxSelect: number) => {
    setSelections((prev) => {
      if (maxSelect === 1) return { ...prev, [groupKey]: optionKey };
      const current = Array.isArray(prev[groupKey]) ? [...prev[groupKey]] : [];
      const hasKey = current.includes(optionKey);
      if (hasKey) return { ...prev, [groupKey]: current.filter((k) => k !== optionKey) };
      if (current.length >= maxSelect) {
        toast.error(`You can only choose up to ${maxSelect}.`);
        return prev;
      }
      current.push(optionKey);
      return { ...prev, [groupKey]: current };
    });
  };

  const handleAdd = () => {
    const calculated = calculateSelectionsPrice(options, selections);
    if (!calculated.ok) {
      toast.error(calculated.error);
      return;
    }
    onConfirm({
      totalPrice: Math.round((item.price + calculated.extra) * 100) / 100,
      selections,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-2 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass-panel relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 text-rice-100 sm:max-h-[90vh] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-5 sm:py-3">
              <button type="button" className="text-2xl leading-none text-rice-300 hover:text-rice-50" onClick={onClose}>
                ×
              </button>
              <h2 className="line-clamp-1 px-2 text-sm font-semibold text-rice-50 sm:text-lg">{item.name}</h2>
              <button type="button" className="text-sm font-medium text-rice-400">
                ↗
              </button>
            </div>

            <div className={cn("min-h-0 flex-1", hasImage ? "grid gap-0 md:grid-cols-[46%_54%]" : "block")}>
              {hasImage && (
                <div className="relative hidden min-h-[300px] border-r border-white/10 md:block">
                  <Image src={item.image!} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 45vw" />
                </div>
              )}

              <div className="overflow-y-auto px-4 py-4 md:px-5">
                <h3 className="text-xl font-semibold leading-tight text-rice-50 sm:text-3xl">{item.name}</h3>
                <p className="mt-1 text-xl font-semibold text-mango-300 sm:text-2xl">${item.price.toFixed(2)}</p>
                {item.description && <p className="mt-3 text-sm text-rice-300">{item.description}</p>}

                <div className="mt-6 space-y-5">
                  {groups.map((group) => (
                    <section key={group.groupKey} className="border-t border-white/10 pt-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-base font-semibold leading-tight text-rice-50 sm:text-xl md:text-[26px]">{group.groupLabel}</p>
                          <p className="mt-1 text-sm text-rice-400">{chooseText(group.minSelect, group.maxSelect)}</p>
                        </div>
                        {group.isRequired && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                            Required
                          </span>
                        )}
                      </div>

                      <div className="divide-y divide-white/10">
                        {group.options.map((opt) => {
                          const selected = isSelected(group.groupKey, opt.key);
                          const multiple = group.maxSelect > 1;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => selectOption(group.groupKey, opt.key, group.maxSelect)}
                              className={cn(
                                "flex w-full items-center justify-between gap-2 py-3 text-left sm:gap-3",
                                selected ? "bg-white/10" : "hover:bg-white/5"
                              )}
                            >
                              <div>
                                <p className="pr-2 text-sm font-medium text-rice-100 sm:text-base">{opt.label}</p>
                                <p className="text-sm text-rice-300">{fmtPrice(opt.priceModifier || 0)}</p>
                                {opt.badge && <p className="text-xs font-medium text-emerald-300">{opt.badge}</p>}
                              </div>
                              <span
                                className={cn(
                                  "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm",
                                  selected ? "border-mango-300 bg-mango-300 text-charcoal-900" : "border-white/25 text-rice-300"
                                )}
                              >
                                {multiple ? "+" : "●"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-charcoal-950/60 px-3 py-3 sm:px-4 md:px-5">
              <Button
                type="button"
                onClick={handleAdd}
                className="h-11 w-full bg-gradient-to-r from-coral-500 to-mango-500 text-sm font-semibold text-charcoal-900 hover:brightness-110 sm:h-12 sm:text-base"
              >
                Add 1 to order • ${total.toFixed(2)}
              </Button>
              {!pricing.ok && <p className="mt-1 text-xs text-red-500">{pricing.error}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
