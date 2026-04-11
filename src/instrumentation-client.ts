// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0bdb7004a4f857751df9b74275d87a62@o4511201260404736.ingest.de.sentry.io/4511201261912144",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

// Forward console.log / warn / error to Sentry Logs so they appear in the Sentry dashboard
function serializeArgs(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    })
    .join(' ');
}

const _log = console.log.bind(console);
const _warn = console.warn.bind(console);
const _error = console.error.bind(console);

console.log = (...args: unknown[]) => {
  _log(...args);
  Sentry.logger.info(serializeArgs(args));
};

console.warn = (...args: unknown[]) => {
  _warn(...args);
  Sentry.logger.warn(serializeArgs(args));
};

console.error = (...args: unknown[]) => {
  _error(...args);
  Sentry.logger.error(serializeArgs(args));
};

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
