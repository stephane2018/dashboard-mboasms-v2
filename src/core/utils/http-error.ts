import type { AxiosError } from "axios";

export interface HttpError {
    status?: number;
    data?: unknown;
    headers?: Record<string, string>;
    message: string;
    request?: unknown;
}

export const refractHttpError = (error: unknown): HttpError => {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
        return {
            status: axiosError.response.status,
            data: axiosError.response.data,
            headers: axiosError.response.headers as Record<string, string>,
            message: axiosError.message,
        };
    } else if (axiosError.request) {
        return {
            message: "No response received from server",
            request: axiosError.request,
        };
    } else {
        const genericError = error as Error;
        return {
            message: genericError?.message || "Unknown error",
        };
    }
};
