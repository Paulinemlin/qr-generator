import * as Sentry from "@sentry/nextjs";

type LogLevel = "info" | "warn" | "error";
type UserPlan = "FREE" | "PRO" | "BUSINESS";

interface LogContext {
  userId?: string;
  userEmail?: string;
  userPlan?: UserPlan;
  [key: string]: unknown;
}

interface UserContext {
  id: string;
  email?: string;
  plan?: UserPlan;
}

/**
 * Structured logger that wraps Sentry for error tracking and logging.
 * Provides consistent logging interface across the application.
 */
class Logger {
  private isSentryEnabled(): boolean {
    return !!process.env.NEXT_PUBLIC_SENTRY_DSN || !!process.env.SENTRY_DSN;
  }

  /**
   * Set the current user context for all subsequent logs
   */
  setUser(user: UserContext | null): void {
    if (this.isSentryEnabled()) {
      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
        });
        if (user.plan) {
          Sentry.setTag("user.plan", user.plan);
        }
      } else {
        Sentry.setUser(null);
      }
    }
  }

  /**
   * Add extra context to all subsequent logs
   */
  setContext(name: string, context: Record<string, unknown>): void {
    if (this.isSentryEnabled()) {
      Sentry.setContext(name, context);
    }
  }

  /**
   * Add a tag to all subsequent logs
   */
  setTag(key: string, value: string): void {
    if (this.isSentryEnabled()) {
      Sentry.setTag(key, value);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  /**
   * Log an error with full stack trace
   */
  error(error: Error | string, context?: LogContext): void {
    const errorObj = typeof error === "string" ? new Error(error) : error;

    // Always log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[ERROR]", errorObj.message, context || "");
    }

    if (this.isSentryEnabled()) {
      Sentry.withScope((scope) => {
        if (context) {
          // Set user context if provided
          if (context.userId || context.userEmail) {
            scope.setUser({
              id: context.userId,
              email: context.userEmail,
            });
          }
          if (context.userPlan) {
            scope.setTag("user.plan", context.userPlan);
          }

          // Set extra context (exclude user fields)
          const { userId, userEmail, userPlan, ...extraContext } = context;
          if (Object.keys(extraContext).length > 0) {
            scope.setExtras(extraContext);
          }
        }

        Sentry.captureException(errorObj);
      });
    }
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    // Always log to console in development
    if (process.env.NODE_ENV === "development") {
      const logMethod =
        level === "error"
          ? console.error
          : level === "warn"
            ? console.warn
            : console.log;
      logMethod(`[${level.toUpperCase()}]`, message, context || "");
    }

    if (this.isSentryEnabled() && level !== "info") {
      Sentry.withScope((scope) => {
        scope.setLevel(level === "warn" ? "warning" : level);

        if (context) {
          if (context.userId || context.userEmail) {
            scope.setUser({
              id: context.userId,
              email: context.userEmail,
            });
          }
          if (context.userPlan) {
            scope.setTag("user.plan", context.userPlan);
          }

          const { userId, userEmail, userPlan, ...extraContext } = context;
          if (Object.keys(extraContext).length > 0) {
            scope.setExtras(extraContext);
          }
        }

        Sentry.captureMessage(message, level === "warn" ? "warning" : level);
      });
    }
  }

  /**
   * Create a breadcrumb for tracking user actions
   */
  addBreadcrumb(
    message: string,
    category: string,
    data?: Record<string, unknown>,
    level: Sentry.SeverityLevel = "info"
  ): void {
    if (this.isSentryEnabled()) {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level,
      });
    }
  }

  /**
   * Start a performance transaction
   */
  startSpan(
    name: string,
    op: string
  ): ReturnType<typeof Sentry.startInactiveSpan> | undefined {
    if (this.isSentryEnabled()) {
      return Sentry.startInactiveSpan({ name, op });
    }
    return undefined;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for external use
export type { LogContext, UserContext, UserPlan };
