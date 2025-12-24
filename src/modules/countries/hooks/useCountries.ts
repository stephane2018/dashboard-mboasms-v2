import { useQuery } from '@tanstack/react-query';
import { countryService } from '../services/country.service';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: countryService.getCountries,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}
