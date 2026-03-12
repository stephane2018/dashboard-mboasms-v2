import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import type { SmsCountryPriceType, SmsCountryPriceResponse } from '@/core/models/sms-country-price';

export type CreateSmsCountryPriceRequest = {
  countryCode: string;
  countryName: string;
  pricePerSms: number;
};

export const getSmsCountryPrices = async (params?: { page?: number; size?: number }): Promise<SmsCountryPriceResponse> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.size != null) searchParams.set('size', String(params.size));
    const query = searchParams.toString();
    const response = await httpClient.get<SmsCountryPriceResponse>(
      `/api/v1/sms-country-prices${query ? `?${query}` : ''}`,
      { useToken: false }
    );
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getSmsCountryPriceById = async (
  id: string
): Promise<SmsCountryPriceType> => {
  try {
    const response = await httpClient.get<SmsCountryPriceType>(
      `/api/v1/sms-country-prices/${id}`
    );
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const createSmsCountryPrice = async (
  data: CreateSmsCountryPriceRequest
): Promise<SmsCountryPriceType> => {
  try {
    const response = await httpClient.post<SmsCountryPriceType>(
      '/api/v1/sms-country-prices',
      data
    );
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const updateSmsCountryPrice = async (
  id: string,
  data: Partial<CreateSmsCountryPriceRequest>
): Promise<SmsCountryPriceType> => {
  try {
    const response = await httpClient.put<SmsCountryPriceType>(
      `/api/v1/sms-country-prices/${id}`,
      data
    );
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const deleteSmsCountryPrice = async (
  id: string
): Promise<void> => {
  try {
    await httpClient.delete(`/api/v1/sms-country-prices/${id}`);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
