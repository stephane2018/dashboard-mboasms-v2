"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/shared/common/data-table"
import { useAllMessageHistory, useMessageHistory, useSearchMessagesByPhoneNumber } from "@/core/hooks/useMessage";
import { useEnterprises } from "@/core/hooks/useEnterprise"
import { useUserStore } from "@/core/stores/userStore"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import type { MessageHistoryType } from "@/core/models/history"
import { columns } from "./columns"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"

export default function HistoriquePage() {
  const { user } = useUserStore()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const enterpriseId = user?.companyId || ""
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const { data: enterprises } = useEnterprises()

  const isSearching = !!searchPhoneNumber;
  // SUPER_ADMIN can filter by enterprise; non-SA always uses their own enterprise
  const isFilteringByEnterprise = _isSuperAdmin ? selectedEnterpriseId !== 'all' : true;
  const activeEnterpriseId = _isSuperAdmin ? selectedEnterpriseId : enterpriseId;

  // GET /api/v1/message (SUPER_ADMIN only, all messages paginated)
  const { data: allHistoryData, isLoading: isLoadingAll, isError: isErrorAll } = useAllMessageHistory(
    pagination.pageIndex,
    pagination.pageSize,
    _isSuperAdmin && !isSearching && !isFilteringByEnterprise
  );

  // GET /api/v1/message/enterprise/{enterpriseId} (enterprise messages paginated)
  const { data: enterpriseHistoryData, isLoading: isLoadingEnterprise, isError: isErrorEnterprise } = useMessageHistory(
    activeEnterpriseId,
    pagination.pageIndex,
    pagination.pageSize,
    isFilteringByEnterprise && !isSearching && !!activeEnterpriseId
  );

  // GET /api/v1/message/phone/{phoneNumber} (search by phone paginated)
  const { data: searchData, isLoading: isLoadingSearch, isError: isErrorSearch } = useSearchMessagesByPhoneNumber(
    searchPhoneNumber,
    pagination.pageIndex,
    pagination.pageSize
  );

  const historyData = isSearching
    ? searchData
    : isFilteringByEnterprise
    ? enterpriseHistoryData
    : allHistoryData;

  const isLoading = isSearching
    ? isLoadingSearch
    : isFilteringByEnterprise
    ? isLoadingEnterprise
    : isLoadingAll;

  const isError = isSearching
    ? isErrorSearch
    : isFilteringByEnterprise
    ? isErrorEnterprise
    : isErrorAll;

  const data = historyData?.content || [];
  const rowCount = historyData?.totalElements || 0

    useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, [searchPhoneNumber, selectedEnterpriseId]);

  useEffect(() => {
    if (isError) {
      toast.error("Erreur lors du chargement de l'historique des messages.");
    }
  }, [isError]);

  return (
    <div className="container mx-auto py-6 space-y-6">
            <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {_isSuperAdmin ? "Historique des messages" : "Mon historique"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {_isSuperAdmin
                ? "Consultez l'historique de tous les messages envoyés depuis la plateforme."
                : "Consultez l'historique des messages envoyés par votre entreprise."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Rechercher par numéro..."
            value={searchPhoneNumber}
            onChange={(e) => setSearchPhoneNumber(e.target.value)}
            className="max-w-sm"
          />
          {_isSuperAdmin && (
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Toutes les entreprises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entreprises</SelectItem>
                {enterprises?.map((enterprise) => (
                  <SelectItem key={enterprise.id} value={enterprise.id}>
                    {enterprise.socialRaison}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        isLoading={isLoading}
        enablePagination
        onPaginationChange={setPagination}
        initialState={{
          pagination,
          sorting: [
            {
              id: "createdAt",
              desc: true,
            },
          ],
        }}
      />
    </div>
  )
}
