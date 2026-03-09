import { BaseEntity, PaginatedResponse } from './common';

export interface SmsCountryPriceType extends BaseEntity {
  statusCode?: number;
  error?: string | null;
  message?: string | null;
  countryCode: string;
  countryName: string;
  pricePerSms: number;
}

export type SmsCountryPriceResponse = PaginatedResponse<SmsCountryPriceType>;
