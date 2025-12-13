"use client"

import { useGroups } from "@/core/hooks/useGroups"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { People } from "iconsax-react"

interface GroupsTabProps {
  enterpriseId: string
}

export function GroupsTab({ enterpriseId }: GroupsTabProps) {
  const { groups, isLoading, error } = useGroups({ enterpriseId })

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">Erreur lors du chargement des groupes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group: any) => (
            <Card key={group.id} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <People className="h-5 w-5 text-primary" variant="Bulk" color="currentColor" />
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{group.description || "Pas de description"}</p>
                  <p className="text-sm font-medium">
                    Membres: <span className="text-primary">{group.memberCount || 0}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <People className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" variant="Bulk" color="currentColor" />
            <p className="text-muted-foreground">Aucun groupe trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
