import { cn } from "@/core/lib/utils";
import { currentBranding } from "@/config/branding";

interface BrandProps {
  className?: string;
  brandClassNames?: string;
  logoClassNames?: string;
  imgClassNames?: string;
}

export function Brand(props: BrandProps) {
  const { className, logoClassNames, imgClassNames } = props;

  return (
    <div className={cn("flex gap-2 items-center justify-center w-full", className)}>
      <div className={cn("w-fit text-xl text-primary font-medium", logoClassNames)}>
        <img src={currentBranding.logo} alt={currentBranding.name} className={cn("w-56", imgClassNames)} />
      </div>
    </div>
  );
}
