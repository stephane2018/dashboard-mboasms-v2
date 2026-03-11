import axios, { type AxiosInstance, type AxiosInterceptorManager, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosRequestConfig, type AxiosError } from "axios";
import type { RequestBody } from "./api-type";
import { tokenManager } from "./token-manager./token-manager";
import { API_URL, REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE, UNAUTHORIZED_STATUS_NUMBERS } from "../config/constante";
import { toast } from "sonner";

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  useToken?: boolean;
}

export class HttpClient {
  private static instance: HttpClient;
  private client: AxiosInstance;
  private isRefreshing = false;
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

  public async post<T>(url: string, data?: RequestBody, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data as Record<string, any>, config);
    return response.data;
  }

  public async put<T>(url: string, data?: RequestBody, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data as Record<string, any>, config);
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

    try {
      const response = await this.client.post<LoginResponse>('/api/v1/auth/refresh', {
        refreshToken
      });

      tokenManager.setTokens(response.data.token, response.data.refreshToken);

      return response.data.token;
    } catch (error) {
      if (!silent) this.handleUnauthorized();
      throw error;
    }
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

        const { response } = error;

        // Only treat 401 as session expired (not 403 which is permission denied)
        if (response && response.status === 401) {
          callback();
          this.handleUnauthorized();
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
    this.withAuthorization();
    this.withMultipartFormData();
    this.withTokenRefresh();
  }

  private withAuthorization() {
    this.interceptors.request.use(async (config) => {
      const requestConfig = { ...config } as InternalAxiosRequestConfig & CustomAxiosRequestConfig;

      // Skip token if useToken is explicitly set to false
      if (requestConfig.useToken === false) {
        return requestConfig;
      }

      // Check if token should be refreshed proactively before making the request
      // Use silent mode so a failed proactive refresh doesn't redirect to login
      if (tokenManager.shouldRefreshToken() && !this.isRefreshing) {
        try {
          await this.handleTokenRefresh(true);
        } catch {
          // If proactive refresh fails, continue with current token
          // The response interceptor will handle 401/403 errors
        }
      }

      const token = tokenManager.getToken();

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

        // Only attempt token refresh on 401 (unauthorized), not on 403 (forbidden/permission denied)
        if (error.response?.status === 401 && !originalRequest._retry) {
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
