"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { UserAdd, User } from "iconsax-react"
import type { EnterpriseType } from "@/core/models/company"

interface UsersTabProps {
  enterprise?: EnterpriseType
  isLoading: boolean
}

export function UsersTab({ enterprise, isLoading }: UsersTabProps) {
  const users = enterprise?.user || []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((userId: string, index: number) => (
            <Card key={userId || index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-5 w-5 text-primary" variant="Bulk" color="currentColor" />
                  Utilisateur {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">ID: {userId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <UserAdd className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" variant="Bulk" color="currentColor" />
            <p className="text-muted-foreground mb-4">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
