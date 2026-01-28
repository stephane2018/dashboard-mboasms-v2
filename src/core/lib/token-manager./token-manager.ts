import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/core/config/constante";
import { LocalStorageAdapter } from "./local-storage-adapter";

interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export class TokenManager {
  private static instance: TokenManager;
  private storage: LocalStorageAdapter;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private initialized: boolean = false;
  private refreshThresholdMs: number = 5 * 60 * 1000; // Refresh 5 minutes before expiration

  private constructor() {
    this.storage = new LocalStorageAdapter();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private initializeTokens(): void {
    if (this.initialized) return;
    try {
      this.token = this.storage.get(TOKEN_KEY);
      this.refreshToken = this.storage.get(REFRESH_TOKEN_KEY);
      this.initialized = true;
    } catch (error) {
      // localStorage not available (server-side), skip initialization
      this.initialized = true;
    }
  }

  public getToken(): string | null {
    this.initializeTokens();
    if (!this.token) {
      try {
        this.token = this.storage.get(TOKEN_KEY);
      } catch (error) {
        // localStorage not available
      }
    }
    return this.token;
  }

  public getRefreshToken(): string | null {
    this.initializeTokens();
    if (!this.refreshToken) {
      try {
        this.refreshToken = this.storage.get(REFRESH_TOKEN_KEY);
      } catch (error) {
        // localStorage not available
      }
    }
    return this.refreshToken;
  }

  public setToken(token: string): void {
    this.token = token;
    this.storage.set(TOKEN_KEY, token);
  }

  public setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
    this.storage.set(REFRESH_TOKEN_KEY, refreshToken);
  }

  public setTokens(token: string, refreshToken: string): void {
    this.setToken(token);
    this.setRefreshToken(refreshToken);
  }

  public clearToken(): void {
    this.token = null;
    this.storage.remove(TOKEN_KEY);
  }

  public clearRefreshToken(): void {
    this.refreshToken = null;
    this.storage.remove(REFRESH_TOKEN_KEY);
  }

  public clearTokens(): void {
    this.clearToken();
    this.clearRefreshToken();
  }

  public hasToken(): boolean {
    return this.getToken() !== null;
  }

  public hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  }

  /**
   * Decode JWT token payload without verification
   */
  private decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  /**
   * Check if the current token is expired
   */
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.decodeToken(token);
    if (!payload?.exp) return false; // If no exp claim, assume not expired

    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  }

  /**
   * Check if the token should be refreshed proactively
   * (i.e., it will expire within the threshold)
   */
  public shouldRefreshToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload?.exp) return false;

    const expirationTime = payload.exp * 1000;
    const timeUntilExpiry = expirationTime - Date.now();

    return timeUntilExpiry > 0 && timeUntilExpiry <= this.refreshThresholdMs;
  }

  /**
   * Get time until token expires in milliseconds
   */
  public getTimeUntilExpiry(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload?.exp) return null;

    return (payload.exp * 1000) - Date.now();
  }
}

export const tokenManager = TokenManager.getInstance();
