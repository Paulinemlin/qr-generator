// This file configures the initialization of Sentry on the server.
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

    // Filter out sensitive data
    beforeSend(event) {
      // Don't send events in development unless explicitly configured
      if (process.env.NODE_ENV === "development" && !SENTRY_DSN) {
        return null;
      }

      // Remove any sensitive data from the event
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>;
        // Remove password fields
        if (typeof data === "object" && data !== null) {
          delete data.password;
          delete data.currentPassword;
          delete data.newPassword;
          delete data.confirmPassword;
        }
      }

      return event;
    },
  });
}
