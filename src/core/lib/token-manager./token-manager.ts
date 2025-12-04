import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/core/config/constante";
import { LocalStorageAdapter } from "./local-storage-adapter";

export class TokenManager {
  private static instance: TokenManager;
  private storage: LocalStorageAdapter;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private initialized: boolean = false;

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
}

export const tokenManager = TokenManager.getInstance();
