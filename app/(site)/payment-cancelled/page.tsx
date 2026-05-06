"use client";

import Link from "next/link";
import { AnimatedPage } from "@/components/site/animated-page";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <AnimatedPage>
      <div className="mx-auto max-w-xl px-4 py-12 text-center sm:py-20">
        <div className="glass-panel rounded-3xl p-10">
          <h1 className="font-display text-3xl text-rice-50">Payment cancelled</h1>
          <p className="mt-3 text-sm text-rice-400">No charge was made. Your cart is unchanged.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/checkout">
              <Button>Return to checkout</Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline">Back to menu</Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
