import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getStripe } from "@/lib/stripe";
import { StripeSetupError } from "@/lib/stripe-env";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    /**
     * If Stripe reports a successful payment but the webhook is delayed, reconcile idempotently.
     * Webhooks remain the source of truth for refunds and edge cases.
     */
    if (session.payment_status === "paid" && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.orderStatus = "paid";
      if (typeof session.payment_intent === "string") {
        order.stripePaymentIntentId = session.payment_intent;
      } else if (session.payment_intent && typeof session.payment_intent !== "string") {
        order.stripePaymentIntentId = session.payment_intent.id;
      }
      await order.save();
    }

    const fresh = await Order.findById(orderId).lean();
    return NextResponse.json({
      order: fresh,
      stripePaymentStatus: session.payment_status,
    });
  } catch (e) {
    if (e instanceof StripeSetupError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    console.error(e);
    return NextResponse.json({ error: "Unable to confirm payment" }, { status: 500 });
  }
}
