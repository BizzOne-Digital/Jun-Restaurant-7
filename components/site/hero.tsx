"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center gap-8 px-4 pb-14 pt-20 md:min-h-[88vh] md:flex-row md:items-center md:gap-10 md:px-6 md:pb-20 md:pt-28">
        <div className="max-w-xl space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-mango-200 md:px-4 md:text-xs md:tracking-[0.25em]"
          >
            Liberty Village · Fresh daily
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="font-display text-3xl font-semibold leading-tight text-rice-50 sm:text-4xl md:text-6xl"
          >
            Fresh Poké. <span className="text-gradient-warm">Bold Flavour.</span>
            <br />
            Island Energy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-rice-200/90 md:text-xl"
          >
            Premium poké bowls crafted fresh in downtown Toronto — vibrant ingredients, chef-level balance, and a
            dining experience that feels as good as it tastes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-2 sm:gap-3"
          >
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto">
                Order Now
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Menu
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 90 }}
          className="relative mx-auto flex h-[260px] w-full max-w-md items-center justify-center sm:h-[320px] md:h-[420px]"
        >
          <div className="absolute inset-4 rounded-[1.5rem] border border-white/15 bg-white/5 shadow-lift backdrop-blur-xl sm:inset-6 sm:rounded-[2rem]" />
          <div className="relative grid max-w-sm grid-cols-2 gap-2 p-5 sm:gap-3 sm:p-8">
            {["Salmon", "Mango", "Avocado", "Tuna"].map((label, idx) => (
              <motion.div
                key={label}
                className="glass-panel flex flex-col justify-between rounded-xl p-3 sm:rounded-2xl sm:p-4"
                animate={{ y: [0, idx % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-xs uppercase tracking-widest text-rice-400">{label}</span>
                <span className="font-display text-xl text-rice-50 sm:text-2xl">{idx + 4}★</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
