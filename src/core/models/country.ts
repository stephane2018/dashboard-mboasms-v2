import { BaseEntity, PaginatedResponse } from './common';

// Country (Pays) type
export interface CountryType extends BaseEntity {
    statusCode?: number;
    error?: string;
    message?: string;
    code: string;      // Country code (e.g., "US", "FR")
    nom: string;       // Country name
    continent: string; // Continent name
    imageUrl: string;  // URL to country flag/image
}

// Main Paginated Response Type
export type PaginatedCountryResponseType = PaginatedResponse<CountryType>;