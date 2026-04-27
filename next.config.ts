import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const allowTraefik = process.env.NEXT_PUBLIC_ALLOW_TRAEFIK === 'true';

const metaDomains = {
  script: 'https://connect.facebook.net',
  img: 'https://www.facebook.com https://*.facebook.com',
  connect: 'https://www.facebook.com https://*.facebook.com https://connect.facebook.net',
  frameAncestors: 'https://www.facebook.com https://*.facebook.com https://business.facebook.com',
};

const connectSrc = [
  "'self'",
  "https://dev.mboasms.com",
  "https://*.mboasms.com",
  "https://*.webapptest.cc",
  metaDomains.connect,
  ...(isDev ? ["http://localhost:*"] : []),
  ...(allowTraefik ? ["https://*.traefik.me"] : []),
].join(' ');

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '0'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com ${metaDomains.script}${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://*.mboasms.com https://*.webapptest.cc ${metaDomains.img}`,
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      `frame-ancestors 'self' ${metaDomains.frameAncestors}`,
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "media-src 'self'",
      "child-src 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  // Unique build ID for version-check hard refresh
  generateBuildId: async () => `build-${Date.now()}`,

  env: {
    NEXT_PUBLIC_BUILD_ID: `build-${Date.now()}`,
  },

  // Enable standalone output for Docker
  output: 'standalone',

  // Turbopack root to suppress workspace detection warning
  turbopack: {
    root: __dirname,
  },

  // Rename JS chunks so ad-blockers don't mistake long hashes for tracking IDs
  webpack(config, { isServer, dev }) {
    if (!isServer && !dev) {
      config.output.chunkFilename = 'static/chunks/[contenthash:10].js';
    }
    return config;
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "sukuna-compagny",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route Sentry requests through our own server to bypass CSP and ad-blockers.
  // /api/* is excluded from auth middleware so no token required.
  tunnelRoute: "/api/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
