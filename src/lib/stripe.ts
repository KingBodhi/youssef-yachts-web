import "server-only";
import Stripe from "stripe";

// Single Stripe client for the server. When STRIPE_SECRET_KEY is absent (e.g.
// before keys are configured) this is null and the app degrades gracefully to
// the older "request a charter" flow instead of crashing.
const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = secretKey
  ? new Stripe(secretKey)
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null;
}

// Whether we collect the 50% deposit online (default) or the full balance.
// Controlled by STRIPE_CHARGE_MODE = "deposit" | "full".
export function chargeMode(): "deposit" | "full" {
  return process.env.STRIPE_CHARGE_MODE === "deposit" ? "deposit" : "full";
}
