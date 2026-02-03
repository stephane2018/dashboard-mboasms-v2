"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDefaultDashboardUrl } from "@/core/utils/role.utils";

export const RoleBasedRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const destination = getDefaultDashboardUrl();
    router.replace(destination);
  }, [router]);

  return null;
};
