// This file is used to instrument the application with Sentry
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import server-side Sentry config
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Import edge Sentry config
    await import("../sentry.edge.config");
  }
}
