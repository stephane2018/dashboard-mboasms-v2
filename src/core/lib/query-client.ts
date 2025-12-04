import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorApiResponse } from "./api-type";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
      retry: (failureCount: number, error: unknown) => {
        const apiError = error as AxiosError<ErrorApiResponse>;
        if (apiError.response?.status && apiError.response.status >= 400 && apiError.response.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryOnMount: true,
    },
  },
});
