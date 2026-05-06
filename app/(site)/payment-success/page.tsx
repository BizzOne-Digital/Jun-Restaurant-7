"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

type SessionStatusPayload = {
  payment_status: string;
  status: string;
  amount_total: number | null;
  currency: string | null;
  stripe_checkout_session_id?: string;
  stripe_payment_intent_id?: string | null;
  customer_email?: string | null;
  metadata?: Record<string, string>;
  order?: {
    orderNumber: string;
    total: number;
    paymentStatus: string;
    orderType: string;
    customerName: string;
    items?: { name: string; quantity: number; price: number }[];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    discount: number;
    notes?: string;
    restaurantOrderEmailSent?: boolean;
  };
};

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = React.useState<"loading" | "ok" | "error">("loading");
  const [payload, setPayload] = React.useState<SessionStatusPayload | null>(null);

  React.useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }
    fetch(`/api/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d: SessionStatusPayload & { error?: string }) => {
        if (!d.order || d.error) {
          setState("error");
          return;
        }
        setPayload(d);
        setState("ok");
        if (d.payment_status === "paid") {
          useCartStore.getState().clear();
        }
      })
      .catch(() => setState("error"));
  }, [sessionId]);

  const paid = payload?.payment_status === "paid";
  const order = payload?.order;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-20">
      {state === "loading" && <p className="text-rice-300">Confirming your payment…</p>}
      {state === "error" && (
        <div className="glass-panel rounded-3xl p-8">
          <p className="font-display text-2xl text-rice-50">We couldn&apos;t verify that session</p>
          <p className="mt-2 text-sm text-rice-400">
            If you were charged, contact the restaurant with your email receipt. Final confirmation also arrives via email once the payment webhook completes.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button>Back home</Button>
          </Link>
        </div>
      )}
      {state === "ok" && payload && order && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel rounded-[1.5rem] p-5 text-left sm:rounded-[2rem] sm:p-10"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-avocado-500 to-ocean-400 text-3xl text-charcoal-900"
            >
              ✓
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mango-300">Thank you</p>
            <h1 className="mt-2 font-display text-3xl text-rice-50">{paid ? "Payment received" : "Processing payment"}</h1>
            <p className="mt-2 text-sm text-rice-400">
              Order <span className="font-semibold text-rice-100">{order.orderNumber}</span>
              {paid ? (
                <>
                  {" "}
                  · Stripe status{" "}
                  <span className="font-semibold text-rice-100">{payload.payment_status}</span>
                </>
              ) : (
                <> · Your bank may still be authorizing this charge.</>
              )}
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-rice-300">
            Estimated {order.orderType === "delivery" ? "delivery" : "pickup"} time:{" "}
            <span className="font-semibold text-mango-300">25–40 minutes</span> (placeholder — set real SLA in admin).
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal-900/50 p-4 text-sm text-rice-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-rice-500">Stripe references</p>
            <ul className="mt-2 space-y-1 break-all text-xs text-rice-400">
              <li>
                <span className="text-rice-500">Checkout Session:</span> {payload.stripe_checkout_session_id ?? sessionId}
              </li>
              {payload.stripe_payment_intent_id ? (
                <li>
                  <span className="text-rice-500">Payment Intent:</span> {payload.stripe_payment_intent_id}
                </li>
              ) : null}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal-900/50 p-4 text-sm text-rice-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-rice-500">Restaurant notification</p>
            <p className="mt-2 text-sm text-rice-300">
              {order.restaurantOrderEmailSent ? (
                <>
                  The kitchen inbox should already have your order details (sent after Stripe confirmed payment via webhook). If anything looks wrong,
                  reply from your confirmation email or call the restaurant directly.
                </>
              ) : paid ? (
                <>
                  We&apos;re notifying the restaurant now. If this message stays here for more than a minute, check your spam folder — or contact us with your Stripe receipt while we reconcile the webhook.
                </>
              ) : (
                <>Once Stripe marks this payment as paid, our server will email the restaurant automatically.</>
              )}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal-900/50 p-4 text-sm text-rice-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-rice-500">Order summary</p>
            <ul className="mt-2 space-y-1">
              {order.items?.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {it.quantity}× {it.name}
                  </span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-rice-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-semibold text-rice-50">
              <span>Total paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            {order.notes ? (
              <p className="mt-3 text-xs text-rice-500">
                <span className="font-semibold text-rice-400">Notes:</span> {order.notes}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/menu">
              <Button variant="outline">Order again</Button>
            </Link>
            <Link href="/">
              <Button>Back home</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
