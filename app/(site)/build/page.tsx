"use client";

import * as React from "react";
import { BuildBowlModal } from "@/components/site/build-bowl-modal";
import { useRouter } from "next/navigation";

export default function BuildPage() {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mango-300">Custom</p>
      <h1 className="mt-2 font-display text-4xl text-rice-50">Build your bowl</h1>
      <p className="mt-2 text-sm text-rice-400">Use the composer — same experience as the menu modal.</p>
      <BuildBowlModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.push("/menu");
        }}
      />
    </div>
  );
}
