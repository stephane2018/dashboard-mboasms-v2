"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/shared/common/data-table"
import { useAllMessageHistory, useMessageHistory, useSearchMessagesByPhoneNumber } from "@/core/hooks/useMessage";
import { useEnterprises } from "@/core/hooks/useEnterprise"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import type { MessageHistoryType } from "@/core/models/history"
import { columns } from "./columns"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"

export default function HistoriquePage() {
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

    const { data: enterprises } = useEnterprises()

    const isSearching = !!searchPhoneNumber;
  const isFilteringByEnterprise = selectedEnterpriseId !== 'all';

  const { data: allHistoryData, isLoading: isLoadingAll, isError: isErrorAll } = useAllMessageHistory(
    pagination.pageIndex,
    pagination.pageSize,
    !isSearching && !isFilteringByEnterprise
  );

  const { data: enterpriseHistoryData, isLoading: isLoadingEnterprise, isError: isErrorEnterprise } = useMessageHistory(
    selectedEnterpriseId,
    pagination.pageIndex,
    pagination.pageSize,
    isFilteringByEnterprise && !isSearching
  );

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
            <h1 className="text-3xl font-bold tracking-tight">Historique des messages</h1>
            <p className="text-muted-foreground mt-1">
              Consultez l'historique de tous les messages envoyés depuis la plateforme.
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
