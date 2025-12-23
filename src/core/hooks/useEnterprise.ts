import { useQuery } from "@tanstack/react-query";
import { getEnterprises } from "@/core/services/enterprise.service";
import type { EnterpriseType } from "@/core/models/enterprise";

export const enterpriseKeys = {
  all: ["enterprises"] as const,
  lists: () => [...enterpriseKeys.all, "list"] as const,
};

export function useEnterprises() {
  return useQuery<EnterpriseType[], Error>({
    queryKey: enterpriseKeys.lists(),
    queryFn: getEnterprises,
  });
}
