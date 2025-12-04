export interface BaseApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export type SuccessApiResponse<T> = BaseApiResponse<T> & {
  success: true;
  data: T;
};

export type ErrorApiResponse = BaseApiResponse & {
  success: false;
};
export type UserErrorResponse = {
  detail: [
    {
      loc: [
        string,
        number
      ],
      msg: string,
      type: string
    }
  ]
}
  

export const isApiSuccess = <T>(response: BaseApiResponse<T>): response is SuccessApiResponse<T> => response.success;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    has_more: boolean;
    page: {
      current: number;
      last: number;
    };
    limits: {
      size: number;
      from: number;
      to: number;
    };
  };
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
  validationErrors?: Record<string, string[]>;
}

export type RequestParams = Record<string, string | number | boolean | undefined>;

export type RequestBody = Record<string, unknown> | FormData | null;
