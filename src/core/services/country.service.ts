import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    CountryType,
    PaginatedCountryResponseType,
} from '@/types/country';

export const getCountriesPaginated = async (pageNumber: number = 0, pageSize: number = 200): Promise<PaginatedCountryResponseType> => {
    try {
        console.log('Fetching countries with pagination:', { pageNumber, pageSize });
        const response = await httpClient.get<PaginatedCountryResponseType>(
            `/api/v1/pays?page=${pageNumber}&size=${pageSize}`
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getCountries = async (): Promise<CountryType[]> => {
    try {
        const response = await httpClient.get<CountryType[]>(`api/v1/pays`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getCountryByCode = async (code: string): Promise<CountryType> => {
    try {
        const response = await httpClient.get<CountryType>(`/api/v1/pays/${code}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};