"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";
import { AnimatedPage } from "@/components/site/animated-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/site/empty-state";
import Link from "next/link";
import { toast } from "sonner";
import { hasMinPhoneDigits, suggestEmailTypo } from "@/lib/email-validation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [promo, setPromo] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const emailSuggestion = React.useMemo(() => suggestEmailTypo(email), [email]);

  React.useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [status, session]);

  React.useEffect(() => {
    if (searchParams.get("cancelled")) {
      toast.message("Checkout cancelled — your cart is still here.");
    }
  }, [searchParams]);

  const submit = async () => {
    if (!items.length) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (trimmedName.length < 2) {
      toast.error("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!hasMinPhoneDigits(trimmedPhone)) {
      toast.error("Please enter a valid phone number (minimum 7 digits).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: trimmedName,
          customerEmail: trimmedEmail,
          customerPhone: trimmedPhone,
          promoCode: promo || undefined,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Unable to start checkout");
        if (data.emailSuggestion) {
          toast.message(`Did you mean ${data.emailSuggestion}?`);
        }
        return;
      }
      if (data.url) {
        window.location.href = data.url as string;
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <AnimatedPage>
        <div className="mx-auto max-w-xl px-4 py-20">
          <EmptyState
            title="Nothing to checkout"
            description="Add items from the menu, then return here to pay securely with Stripe."
            action={
              <Link href="/menu">
                <Button>Back to menu</Button>
              </Link>
            }
          />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="font-display text-3xl text-rice-50 sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-rice-400">
          Pickup only · In-store pickup. Payments are processed by Stripe — never trust the browser alone.
        </p>

        <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-rice-400">
              Full name
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-rice-400">
              Email
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {emailSuggestion ? (
              <button
                type="button"
                className="text-left text-xs text-mango-300 hover:underline md:col-span-2"
                onClick={() => setEmail(emailSuggestion)}
              >
                Did you mean {emailSuggestion}?
              </button>
            ) : null}
            <label className="text-xs font-semibold uppercase tracking-wide text-rice-400 md:col-span-2">
              Phone
              <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </div>

          <label className="text-xs font-semibold uppercase tracking-wide text-rice-400">
            Promo code (optional)
            <Input className="mt-1" value={promo} onChange={(e) => setPromo(e.target.value)} />
          </label>

          <label className="text-xs font-semibold uppercase tracking-wide text-rice-400">
            Order notes
            <Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <Button
            className="w-full"
            size="lg"
            type="button"
            disabled={loading || !name || !email || !phone}
            onClick={submit}
          >
            {loading ? "Redirecting…" : "Pay with Stripe"}
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
