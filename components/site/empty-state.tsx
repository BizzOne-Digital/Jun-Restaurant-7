"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mx-auto max-w-lg rounded-3xl p-10 text-center"
    >
      <p className="font-display text-2xl text-rice-50">{title}</p>
      {description && <p className="mt-2 text-sm text-rice-300">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </motion.div>
  );
}
