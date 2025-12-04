import { cn } from "@/core/lib/utils";

export const ErrorMessage = ({ message, className }: { message: string; className?: string }) => {
  return <div className={cn("text-destructive text-sm p-2 rounded-md bg-destructive/10 text-center", className)}>{message}</div>;
};
