"use client"

import { Card, CardContent } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

export function StatisticsSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-l-[3px] border-l-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
