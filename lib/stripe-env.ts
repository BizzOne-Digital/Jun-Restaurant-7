/**
 * Validates Stripe key prefixes at runtime.
 * Never treat mk_* or other non-Stripe prefixes as valid Stripe secrets.
 */

export function assertStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new StripeSetupError(
      "STRIPE_SECRET_KEY is not set. Add sk_test_... or sk_live_... from your Stripe Dashboard to .env.local."
    );
  }
  if (!key.startsWith("sk_test_") && !key.startsWith("sk_live_")) {
    throw new StripeSetupError(
      `STRIPE_SECRET_KEY must start with sk_test_ or sk_live_. Got prefix "${key.slice(0, 8)}…". ` +
        `Keys starting with mk_ are not valid Stripe secret keys — copy the Secret key from Developers → API keys.`
    );
  }
  return key;
}

export function assertStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!key) {
    throw new StripeSetupError(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add pk_test_... or pk_live_... from Stripe Dashboard."
    );
  }
  if (!key.startsWith("pk_test_") && !key.startsWith("pk_live_")) {
    throw new StripeSetupError(
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_test_ or pk_live_. Got prefix "${key.slice(0, 8)}…".`
    );
  }
  return key;
}

export function assertStripeWebhookSecretOptional(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) return null;
  if (!secret.startsWith("whsec_")) {
    throw new StripeSetupError(
      `STRIPE_WEBHOOK_SECRET must start with whsec_. Got prefix "${secret.slice(0, 8)}…". ` +
        "Create a webhook in Stripe Dashboard and paste the signing secret."
    );
  }
  return secret;
}

export class StripeSetupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeSetupError";
  }
}
