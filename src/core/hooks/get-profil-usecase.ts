import { useQuery } from "@tanstack/react-query";
import { loginQueryKey } from "../config/querykey";
import { getProfile } from "../services/auth.service";

export const useGetProfile = (enabled = true) =>
  useQuery({
    queryKey: loginQueryKey.profile,
    queryFn: getProfile,
    enabled: enabled,
  });
