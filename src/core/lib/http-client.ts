import axios, { type AxiosInstance, type AxiosInterceptorManager, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosRequestConfig, type AxiosError } from "axios";
import type { RequestBody } from "./api-type";
import { tokenManager } from "./token-manager/token-manager";
import { connectionChecker } from "./connection-checker";
import { API_URL, REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from "../config/constante";
import { toast } from "sonner";

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  useToken?: boolean;
}

const MAX_REFRESH_RETRIES = 3;

export class HttpClient {
  private static instance: HttpClient;
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshRetryCount = 0;
  private refreshSubscribers: Array<(token: string) => void> = [];

  public interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };

  private constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        Accept: "application/json",
      },
      timeout: 60000,
    });

    this.interceptors = this.client.interceptors;
    this.setupInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public getClient(): AxiosInstance {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance.client;
  }

  public async get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T, D = RequestBody>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T, D = RequestBody>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  private async handleTokenRefresh(silent = false): Promise<string> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      if (!silent) this.handleUnauthorized();
      throw new Error("No refresh token available");
    }

    // Retry refresh up to MAX_REFRESH_RETRIES times
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
      try {
        const response = await this.client.post<LoginResponse>('/api/v1/auth/refresh', {
          refreshToken
        });

        tokenManager.setTokens(response.data.token, response.data.refreshToken);
        this.refreshRetryCount = 0;
        return response.data.token;
      } catch (error) {
        lastError = error;
        const axiosErr = error as AxiosError;
        // If refresh itself returns 401/403, token is definitely invalid — stop retrying
        if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
          break;
        }
        // Wait briefly before retrying (network issues)
        if (attempt < MAX_REFRESH_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    // All retries exhausted — logout
    if (!silent) this.handleUnauthorized();
    throw lastError;
  }

  private handleUnauthorized(): void {
    // Only clear tokens and redirect on protected pages
    // Public pages should never touch the auth state
    const publicPaths = ["/", "/sms-pricing", "/auth", "/api-docs"];
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const isPublicPage = publicPaths.some(
      (p) => currentPath === p || currentPath.startsWith(p + "/")
    );

    if (isPublicPage) {
      // On public pages, do NOT clear tokens - the user might be authenticated
      // and just browsing the public site
      return;
    }

    tokenManager.clearTokens();
    toast.error("Session expirée. Veuillez vous reconnecter.");
    window.location.href = "/auth/login";
  }

  public catchUnauthorizedResponse(callback: () => void) {
    return this.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const { response } = error;

        // Only trigger logout if the request already went through token refresh and still failed
        // This prevents racing with the withTokenRefresh interceptor
        if (response && (response.status === 401 || response.status === 403) && originalRequest?._retry) {
          callback();
        }

        return Promise.reject(error);
      }
    );
  }

  public rejectResponseInterceptor(interceptorId: number) {
    this.interceptors.response.eject(interceptorId);
  }

  public rejectRequestInterceptor(interceptorId: number) {
    this.interceptors.request.eject(interceptorId);
  }

  private setupInterceptors() {
    this.withConnectionCheck();
    this.withAuthorization();
    this.withMultipartFormData();
    this.withTokenRefresh();
    this.withConnectionRecovery();
  }

  private withConnectionCheck() {
    this.interceptors.request.use((config) => {
      // Skip connection check for health endpoint (used by the checker itself)
      if (config.url?.includes("/api/health")) return config;

      // Synchronous check — never blocks/delays the request
      const status = connectionChecker.checkSync();

      if (status.quality === "offline") {
        throw new axios.AxiosError(
          "Connexion indisponible. Vérifiez votre connexion internet.",
          "ERR_NETWORK"
        );
      }

      // Slow connection: let request through (checker already notified the popup)
      return config;
    });
  }

  private withConnectionRecovery() {
    this.interceptors.response.use(
      (response) => {
        // Successful response = connection is good
        connectionChecker.notifyGood();
        return response;
      },
      (error) => {
        // Network error (no response) — trigger async ping to confirm status
        if (!error.response && error.code !== "ERR_CANCELED") {
          connectionChecker.pingCheck();
        }
        return Promise.reject(error);
      }
    );
  }

  private withAuthorization() {
    this.interceptors.request.use(async (config) => {
      const requestConfig = { ...config } as InternalAxiosRequestConfig & CustomAxiosRequestConfig;

      // Skip token if useToken is explicitly set to false
      if (requestConfig.useToken === false) {
        return requestConfig;
      }

      let token = tokenManager.getToken();

      // If token is null in memory, try re-hydrating once from cookies (handles page refresh)
      if (!token) {
        await tokenManager.hydrateFromServer(true);
        token = tokenManager.getToken();
      }

      // Still no token after hydration — skip silently, withTokenRefresh will handle 401 if needed

      if (token) {
        requestConfig.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
      }

      return requestConfig;
    });
  }

  private withMultipartFormData() {
    this.interceptors.request.use((config) => {
      const requestConfig = { ...config };

      if (!requestConfig.headers["Content-Type"]) {
        if (config.data instanceof FormData) {
          requestConfig.headers["Content-Type"] = "multipart/form-data";
        } else if (config.data !== undefined) {
          requestConfig.headers["Content-Type"] = "application/json";
        }
      }

      return requestConfig;
    });
  }

  private withTokenRefresh() {
    this.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;

        // Treat both 401 (unauthorized) and 403 (forbidden) as potential token expiration
        const isTokenExpired = (status === 401 || status === 403) && !originalRequest._retry;

        if (isTokenExpired) {
          if (this.isRefreshing) {
            // Queue the request if refresh is in progress
            return new Promise(resolve => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            const newToken = await this.handleTokenRefresh();
            // Notify subscribers with new token
            if (newToken) {
              this.refreshSubscribers.forEach(callback => callback(newToken));
            }
            this.refreshSubscribers = [];
            originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const httpClient = HttpClient.getInstance();
