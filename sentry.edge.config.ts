// This file configures the initialization of Sentry for edge features (middleware, edge routes, etc).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment configuration
    environment:
      process.env.VERCEL_ENV || process.env.NODE_ENV || "development",

    // Performance Monitoring
    // Capture 10% of transactions in production to limit costs
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Disable Sentry in development unless DSN is explicitly set
    enabled: process.env.NODE_ENV !== "development" || !!SENTRY_DSN,
  });
}
