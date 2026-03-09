"use client"

import { useQuery } from "@tanstack/react-query"
import { getSmsCountryPrices } from "@/core/services/sms-country-price.service"

export function useSmsCountryPrices(page = 0, size = 20) {
  return useQuery({
    queryKey: ["sms-country-prices", page, size],
    queryFn: () => getSmsCountryPrices(page, size),
  })
}
