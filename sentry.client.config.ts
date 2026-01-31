// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment configuration
    environment:
      process.env.NEXT_PUBLIC_VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",

    // Performance Monitoring
    // Capture 10% of transactions in production to limit costs
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replay for debugging user sessions (optional, 10% sample)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

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

    // Ignore specific errors that are not actionable
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Random plugins/extensions
      "original event",
      // Facebook borked
      "fb_xd_fragment",
      // Chrome extensions
      "chrome-extension://",
      // Safari extensions
      "safari-extension://",
      // Network errors
      "Network Error",
      "NetworkError",
      "Failed to fetch",
      "Load failed",
      // Cancelled requests
      "AbortError",
      "The operation was aborted",
    ],
  });
}
