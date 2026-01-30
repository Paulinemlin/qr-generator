import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// For backward compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// Re-export plan utilities from the client-safe module
export { PLANS, getPlanLimits, canCreateQRCode, canUseLogo, canViewAnalytics } from "./plans";
export type { PlanType } from "./plans";

// Price IDs (server-only)
export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID,
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID,
} as const;
