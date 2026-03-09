import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import type { SmsCountryPriceResponse } from '@/core/models/sms-country-price';

export const getSmsCountryPrices = async (
  page = 0,
  size = 20
): Promise<SmsCountryPriceResponse> => {
  try {
    const response = await httpClient.get<SmsCountryPriceResponse>(
      `/api/v1/sms-country-prices?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
