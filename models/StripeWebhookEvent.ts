import mongoose, { Schema, models, model } from "mongoose";

/** Stores processed Stripe webhook event IDs so retries do not double-apply logic. */
const StripeWebhookEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

export const StripeWebhookEvent =
  models.StripeWebhookEvent ?? model("StripeWebhookEvent", StripeWebhookEventSchema);
