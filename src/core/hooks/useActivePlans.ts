import { useQuery } from '@tanstack/react-query'
import { getActivePlans } from '../services/pricing.service'
import type { PricingPlanType } from '@/core/models/pricing'

export function useActivePlans() {
  return useQuery<PricingPlanType[]>({
    queryKey: ["pricing-plans", "active"],
    queryFn: async () => {
      const response = await getActivePlans()
      return response
    },
  })
}
