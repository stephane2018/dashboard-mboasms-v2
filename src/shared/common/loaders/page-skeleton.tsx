import { Skeleton } from "@/shared/ui/skeleton";

export const PageSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="flex w-full flex-col gap-2 md:w-fit">
          <div className="flex items-center gap-3">
            <Skeleton className="h-2 w-full md:w-[10vw]" />
            <Skeleton className="h-2 w-full md:w-[10vw]" />
            <Skeleton className="h-2 w-full md:w-[10vw]" />
          </div>
          <Skeleton className="h-7 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full md:w-[10vw]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Skeleton className="h-[17vh] w-full" />
        <Skeleton className="h-[17vh] w-full" />
        <Skeleton className="h-[17vh] w-full" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-5 lg:gap-x-4">
          <div className="flex items-center gap-x-2 lg:col-span-2 xl:col-span-1">
            <Skeleton className="h-9 w-full lg:w-[30vw]" />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:col-span-3 lg:justify-end 2xl:col-span-4">
            <Skeleton className="h-9 w-[calc(50%_-_.25rem)] md:w-[calc(33%_-_.25rem)] lg:w-[8vw]" />
            <Skeleton className="h-9 w-[calc(50%_-_.25rem)] md:w-[calc(33%_-_.25rem)] lg:w-[8vw]" />
            <Skeleton className="h-9 w-full md:w-[calc(33%_-_.25rem)] lg:w-[8vw]" />
          </div>
        </div>

        <Skeleton className="h-[40vh] w-full" />

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Skeleton className="h-9 w-full md:w-[20vw]" />

          <div className="flex w-full items-center justify-between gap-8 md:w-fit md:justify-start">
            <div>
              <Skeleton className="h-9 md:w-[10vw]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
