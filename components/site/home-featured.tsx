"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { MenuItemView } from "@/types/menu";
import { LoadingSkeleton } from "@/components/site/loading-skeleton";

export function HomeFeatured() {
  const [items, setItems] = React.useState<MenuItemView[] | null>(null);

  React.useEffect(() => {
    fetch("/api/menu?category=most-popular")
      .then((r) => r.json())
      .then((d) => setItems((d.items as MenuItemView[]) ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-72 rounded-3xl" />
        ))}
      </div>
    );
  }

  const slice = items.slice(0, 6);

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {slice.map((item, idx) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.06 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
        >
          <Link href="/menu" className="block">
            <div className="relative aspect-[4/3]">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-lg text-rice-50">{item.name}</p>
                <p className="text-sm text-mango-300">${item.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
