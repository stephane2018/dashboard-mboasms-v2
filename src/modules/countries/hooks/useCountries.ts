import { useQuery } from '@tanstack/react-query';
import { countryService } from '../../../core/services/country.service';

interface UseCountriesOptions {
  page?: number;
  size?: number;
}

export function useCountries(options: UseCountriesOptions = {}) {
  const { page = 0, size = 1000 } = options;
  
  return useQuery({
    queryKey: ['countries', page, size],
    queryFn: () => countryService.getCountries(page, size),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}
