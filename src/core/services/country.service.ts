import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import type { Country } from '../../modules/countries/types/country.types';
import type { PaginatedResponse } from '../models/common';

interface CountryResponse {
  data?: Country[];
  [key: string]: any;
}

async function getCountries(page: number = 0, size: number = 1000): Promise<Country[]> {
  try {
    const response = await httpClient.get<PaginatedResponse<Country> | CountryResponse | Country[]>(
      '/api/v1/pays',
      { params: { page, size } }
    );
    
    // Handle paginated response format: { content: [...], totalElements, ... }
    if (response && typeof response === 'object' && 'content' in response) {
      return (response as PaginatedResponse<Country>).content || [];
    }
    
    // Handle nested data format: { data: [...] }
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as CountryResponse).data || [];
    }
    
    // Handle direct array format: [...]
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
}

export const countryService = {
  getCountries,
};
