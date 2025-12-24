import type { Country } from '../types/country.types';

async function getCountries(): Promise<Country[]> {
  try {
    // Assuming the API is hosted on the same origin
    const response = await fetch('/api/v1/pays');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // The actual data might be nested, e.g., in a `data` property.
    // Adjust this if the API response structure is different.
    return data.data || data; 
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return []; // Return empty array on error to avoid breaking the UI
  }
}

export const countryService = {
  getCountries,
};
