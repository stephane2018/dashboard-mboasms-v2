export class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private initialized: boolean = false;
  private hydrationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Hydrate tokens from httpOnly cookies via API route.
   * Deduplicates concurrent calls — multiple callers share the same fetch.
   */
  public async hydrateFromServer(force = false): Promise<void> {
    if (this.initialized && !force) return;
    if (typeof window === 'undefined') {
      this.initialized = true;
      return;
    }

    // If already hydrating, return the existing promise (dedup)
    if (this.hydrationPromise) return this.hydrationPromise;

    this.hydrationPromise = this.fetchTokensFromCookies();
    try {
      await this.hydrationPromise;
    } finally {
      this.hydrationPromise = null;
    }
  }

  private async fetchTokensFromCookies(): Promise<void> {
    try {
      const res = await fetch('/api/auth/token', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        this.token = data.token || null;
        this.refreshToken = data.refreshToken || null;
      }
    } catch {
      // Server not reachable — keep current in-memory values
    }
    this.initialized = true;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Store tokens in memory + persist to httpOnly cookies via API route
   */
  public setToken(token: string): void {
    this.token = token;
    if (this.refreshToken) this.persistToServer(token, this.refreshToken);
  }

  public setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
    if (this.token) this.persistToServer(this.token, refreshToken);
  }

  public async setTokens(token: string, refreshToken: string): Promise<void> {
    this.token = token;
    this.refreshToken = refreshToken;
    await this.persistToServer(token, refreshToken);
  }

  public clearToken(): void {
    this.token = null;
  }

  public clearRefreshToken(): void {
    this.refreshToken = null;
  }

  public clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    this.initialized = false;
    this.clearFromServer();
  }

  public hasToken(): boolean {
    return this.token !== null;
  }

  public hasRefreshToken(): boolean {
    return this.refreshToken !== null;
  }

  private async persistToServer(token: string, refreshToken: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ token, refreshToken }),
      });
    } catch {
      // Silent fail -- tokens still in memory for current session
    }
  }

  private async clearFromServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch {
      // Silent fail
    }
  }
}

export const tokenManager = TokenManager.getInstance();
