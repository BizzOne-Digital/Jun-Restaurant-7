import Stripe from "stripe";
import { assertStripeSecretKey } from "@/lib/stripe-env";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = assertStripeSecretKey();
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeSingleton;
}
