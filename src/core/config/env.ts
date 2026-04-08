import { z } from 'zod';

const envSchema = z.object({
  apiBaseUrl: z.string().url(),
  appName: z.string().min(1),
  appUrl: z.string().url(),
  tokenKey: z.string().min(1),
  refreshTokenKey: z.string().min(1),
  userKey: z.string().min(1),
  isDevelopment: z.boolean(),
  isProduction: z.boolean(),
  isTest: z.boolean(),
});

const rawEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "MboaSMS",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || "mboasms-access-token",
  refreshTokenKey: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "mboasms-refresh-token",
  userKey: process.env.NEXT_PUBLIC_USER_KEY || "mboasms-user",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};

// Validate at import time -- crash early if env is misconfigured
const parsed = envSchema.safeParse(rawEnv);
if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  console.error("Invalid environment configuration:", errors);
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment configuration in production");
  }
}

export const env = parsed.success ? parsed.data : rawEnv;
export type Env = z.infer<typeof envSchema>;
