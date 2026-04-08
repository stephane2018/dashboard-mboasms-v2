import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const allowTraefik = process.env.NEXT_PUBLIC_ALLOW_TRAEFIK === 'true';

const connectSrc = [
  "'self'",
  "https://dev.mboasms.com",
  "https://*.mboasms.com",
  "https://*.webapptest.cc",
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
    key: 'X-Frame-Options',
    value: 'DENY'
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
      `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.mboasms.com https://*.webapptest.cc",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'self'",
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
  reactCompiler: true,

  // Enable standalone output for Docker
  output: 'standalone',

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

export default nextConfig;
