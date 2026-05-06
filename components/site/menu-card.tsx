"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { MenuItemView } from "@/types/menu";
import { cn } from "@/lib/cn";
import { QuantitySelector } from "@/components/site/quantity-selector";

export function MenuCard({
  item,
  onAdd,
  onCustomize,
}: {
  item: MenuItemView;
  onAdd: (qty: number) => void;
  onCustomize?: () => void;
}) {
  const [qty, setQty] = React.useState(1);

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={onCustomize}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-glass",
        onCustomize && "cursor-pointer"
      )}
    >
      {item.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {item.badges?.slice(0, 3).map((b) => (
              <span
                key={b}
                className="rounded-full bg-charcoal-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mango-200"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-3 p-4 sm:p-5">
        {!item.image && item.badges?.length ? (
          <div className="flex flex-wrap gap-1">
            {item.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mango-200"
              >
                {b}
              </span>
            ))}
          </div>
        ) : null}
        <div>
          <h3 className="font-display text-base font-semibold text-rice-50 sm:text-lg">{item.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-rice-300">{item.description}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="font-display text-xl text-mango-300 sm:text-2xl">${item.price.toFixed(2)}</p>
          {onCustomize ? (
            <button
              type="button"
              onClick={onCustomize}
              className={cn(
                "rounded-full bg-gradient-to-r from-coral-500 to-mango-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-charcoal-900",
                "shadow-lift transition hover:brightness-110 active:scale-[0.98]"
              )}
            >
              Customize
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <QuantitySelector value={qty} onChange={setQty} />
              <button
                type="button"
                onClick={() => onAdd(qty)}
                className={cn(
                  "rounded-full bg-gradient-to-r from-coral-500 to-mango-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-charcoal-900",
                  "shadow-lift transition hover:brightness-110 active:scale-[0.98]"
                )}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
