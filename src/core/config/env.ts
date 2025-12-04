/**
 * Environment Configuration
 * Centralized environment variables management for Next.js
 */

export const env = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",

  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || "MboaSMS",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Authentication Keys
  tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || "mboasms-access-token",
  refreshTokenKey: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "mboasms-refresh-token",
  userKey: process.env.NEXT_PUBLIC_USER_KEY || "mboasms-user",

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

// Type-safe environment variable access
export type Env = typeof env;
