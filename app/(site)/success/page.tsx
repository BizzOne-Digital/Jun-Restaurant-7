"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Legacy URL — Stripe success URLs now use `/payment-success`. */
export default function SuccessRedirectPage() {
  const router = useRouter();
  const params = useSearchParams();

  React.useEffect(() => {
    const sid = params.get("session_id");
    router.replace(sid ? `/payment-success?session_id=${encodeURIComponent(sid)}` : "/payment-success");
  }, [router, params]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-rice-400">Redirecting…</p>
    </div>
  );
}
