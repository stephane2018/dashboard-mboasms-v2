import axios, { type AxiosInstance, type AxiosInterceptorManager, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosRequestConfig, type AxiosError } from "axios";
import type { RequestBody } from "./api-type";
import { useAuthStore } from "@/core/stores/authStore";
import { connectionChecker } from "./connection-checker";
import { API_URL, REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from "../config/constante";
import { toast } from "sonner";

interface RefreshResponse {
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
    return HttpClient.getInstance().client;
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
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      if (!silent) this.handleUnauthorized();
      throw new Error("No refresh token available");
    }

    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
      try {
        const response = await this.client.post<RefreshResponse>('/api/v1/auth/refresh', {
          refreshToken,
        });

        const current = useAuthStore.getState();
        if (current.user) {
          current.setAuth({
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            user: current.user,
          });
        }
        return response.data.token;
      } catch (error) {
        lastError = error;
        const axiosErr = error as AxiosError;
        if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
          break;
        }
        if (attempt < MAX_REFRESH_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    if (!silent) this.handleUnauthorized();
    throw lastError;
  }

  private handleUnauthorized(): void {
    const publicPaths = ["/", "/sms-pricing", "/auth", "/api-docs"];
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const isPublicPage = publicPaths.some(
      (p) => currentPath === p || currentPath.startsWith(p + "/")
    );

    if (isPublicPage) return;

    useAuthStore.getState().clearAuth();
    toast.error("Session expirée. Veuillez vous reconnecter.");
    window.location.href = "/auth/login";
  }

  public catchUnauthorizedResponse(callback: () => void) {
    return this.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error) return Promise.reject(error);

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const { response } = error;

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
      if (config.url?.includes("/api/health")) return config;

      const status = connectionChecker.checkSync();

      if (status.quality === "offline") {
        throw new axios.AxiosError(
          "Connexion indisponible. Vérifiez votre connexion internet.",
          "ERR_NETWORK"
        );
      }

      return config;
    });
  }

  private withConnectionRecovery() {
    this.interceptors.response.use(
      (response) => {
        connectionChecker.notifyGood();
        return response;
      },
      (error) => {
        if (!error.response && error.code !== "ERR_CANCELED") {
          connectionChecker.pingCheck();
        }
        return Promise.reject(error);
      }
    );
  }

  private withAuthorization() {
    this.interceptors.request.use((config) => {
      const requestConfig = { ...config } as InternalAxiosRequestConfig & CustomAxiosRequestConfig;

      if (requestConfig.useToken === false) {
        return requestConfig;
      }

      const token = useAuthStore.getState().token;

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

        const isTokenExpired = (status === 401 || status === 403) && !originalRequest._retry;

        if (isTokenExpired) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
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
            if (newToken) {
              this.refreshSubscribers.forEach((callback) => callback(newToken));
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
