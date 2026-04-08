"use client";

import { cn } from "@/core/lib/utils";
import { Loader2 } from "lucide-react";
import { useT } from "@/core/hooks";

interface ActionLoaderProps {
  isLoading?: boolean;
  message?: string;
  spinnerClassName?: string;
}

const ActionLoader = ({ isLoading, message, spinnerClassName }: ActionLoaderProps) => {
  const { t } = useT();

  return isLoading ? (
    <div className="absolute z-20 flex flex-col gap-2 h-full w-full items-center justify-center bg-background/30 backdrop-blur-sm">
      <Loader2 className={cn("size-6", spinnerClassName)} />
      {message || t('loader.defaultMessage')}
    </div>
  ) : null;
};

export default ActionLoader;
