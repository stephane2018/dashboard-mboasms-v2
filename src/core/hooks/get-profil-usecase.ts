import { useQuery } from "@tanstack/react-query";
import { loginQueryKey } from "@/core/config/querykey";
import { getProfile } from "@/core/services/auth.service";

export const useGetProfile = (enabled = true) =>
  useQuery({
    queryKey: loginQueryKey.profile,
    queryFn: getProfile,
    enabled: enabled,
  });
