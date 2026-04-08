"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/shared/common/data-table"
import { useAllMessageHistory, useMessageHistory, useSearchMessagesByPhoneNumber } from "@/core/hooks/useMessage"
import { useEnterprises } from "@/core/hooks/useEnterprise"
import { useUserStore } from "@/core/stores/userStore"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { DateRangePicker, type DateRange } from "@/shared/common/date-range-picker"
import { createColumns } from "./columns"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"
import { SearchNormal1, Building, MessageText1, CloseCircle, Calendar, ReceiptSearch } from "iconsax-react"
import { useT } from "@/core/hooks"

function getDefaultRange(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { from: start, to: end }
}

function toISO(date: Date | undefined, end?: boolean): string {
  if (!date) return ""
  const d = date.toISOString().slice(0, 10)
  return end ? `${d}T23:59:59Z` : `${d}T00:00:00Z`
}

export default function HistoriquePage() {
  const { user } = useUserStore()
  const { t } = useT()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const enterpriseId = user?.companyId || ""
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultRange)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const { data: enterprises } = useEnterprises()

  const isSearching = !!searchPhoneNumber
  const isFilteringByEnterprise = _isSuperAdmin ? selectedEnterpriseId !== "all" : true
  const activeEnterpriseId = _isSuperAdmin ? selectedEnterpriseId : enterpriseId
  const hasActiveFilters = searchPhoneNumber || selectedEnterpriseId !== "all"

  // GET /api/v1/message (SUPER_ADMIN only, all messages paginated)
  const { data: allHistoryData, isLoading: isLoadingAll, isError: isErrorAll } = useAllMessageHistory(
    {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort: "createdAt,desc",
      startDate: toISO(dateRange?.from),
      endDate: toISO(dateRange?.to, true),
    },
    _isSuperAdmin && !isSearching && !isFilteringByEnterprise
  )

  // GET /api/v1/message/enterprise/{enterpriseId} (enterprise messages paginated)
  const { data: enterpriseHistoryData, isLoading: isLoadingEnterprise, isError: isErrorEnterprise } = useMessageHistory(
    activeEnterpriseId,
    pagination.pageIndex,
    pagination.pageSize,
    isFilteringByEnterprise && !isSearching && !!activeEnterpriseId,
    toISO(dateRange?.from),
    toISO(dateRange?.to, true)
  )

  // GET /api/v1/message/phone/{phoneNumber} (search by phone paginated)
  const { data: searchData, isLoading: isLoadingSearch, isError: isErrorSearch } = useSearchMessagesByPhoneNumber(
    searchPhoneNumber,
    pagination.pageIndex,
    pagination.pageSize
  )

  const historyData = isSearching
    ? searchData
    : isFilteringByEnterprise
    ? enterpriseHistoryData
    : allHistoryData

  const isLoading = isSearching
    ? isLoadingSearch
    : isFilteringByEnterprise
    ? isLoadingEnterprise
    : isLoadingAll

  const isError = isSearching
    ? isErrorSearch
    : isFilteringByEnterprise
    ? isErrorEnterprise
    : isErrorAll

  const data = historyData?.content || []
  const rowCount = historyData?.totalElements || 0

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 })
  }, [searchPhoneNumber, selectedEnterpriseId, dateRange])

  useEffect(() => {
    if (isError) {
      toast.error(t('toasts.loadingError'))
    }
  }, [isError])

  const resetFilters = () => {
    setSearchPhoneNumber("")
    setSelectedEnterpriseId("all")
    setDateRange(getDefaultRange())
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {_isSuperAdmin ? t('history.titlePlatform') : t('history.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {_isSuperAdmin
              ? t('history.subtitlePlatform')
              : t('history.subtitle')}
          </p>
        </div>
        {/* Stats pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <MessageText1 size={18} color="currentColor" variant="Bulk" className="text-primary" />
          <span className="text-sm font-semibold text-primary">{rowCount.toLocaleString()}</span>
          <span className="text-xs text-primary/70">{t('history.message')}{rowCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        {/* Search bar - full width */}
        <div className="relative">
          <SearchNormal1 size={18} color="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('history.searchPlaceholder')}
            value={searchPhoneNumber}
            onChange={(e) => setSearchPhoneNumber(e.target.value)}
            className="h-11 pl-11 pr-10 text-sm rounded-xl bg-card border-border"
          />
          {searchPhoneNumber && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSearchPhoneNumber("")}
              onKeyDown={(e) => e.key === "Enter" && setSearchPhoneNumber("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <CloseCircle size={18} color="currentColor" variant="Bulk" />
            </div>
          )}
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <div
            role="button"
            tabIndex={0}
            onClick={resetFilters}
            onKeyDown={(e) => e.key === "Enter" && resetFilters()}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 cursor-pointer transition-all duration-200"
          >
            <CloseCircle size={16} color="currentColor" variant="Bulk" />
            {t('common.reset')}
          </div>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date range chip */}
        <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Calendar size={16} color="currentColor" variant="Bulk" className="text-primary" />
          </div>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="border-0 bg-transparent hover:bg-transparent px-1"
          />
        </div>

        {/* Enterprise chip (SUPER_ADMIN) */}
        {_isSuperAdmin && (
          <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Building size={16} color="currentColor" variant="Bulk" className="text-primary" />
            </div>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger className="h-8 w-[200px] text-sm border-0 bg-transparent shadow-none focus:ring-0 px-1">
                <SelectValue placeholder={t('common.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {enterprises?.map((enterprise) => (
                  <SelectItem key={enterprise.id} value={enterprise.id}>
                    {enterprise.socialRaison}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active search indicator */}
        {searchPhoneNumber && (
          <div className="flex items-center gap-2 px-3 py-1 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ReceiptSearch size={16} color="currentColor" variant="Bulk" className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {t('common.search')} : &quot;{searchPhoneNumber}&quot;
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSearchPhoneNumber("")}
              onKeyDown={(e) => e.key === "Enter" && setSearchPhoneNumber("")}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 cursor-pointer transition-colors"
            >
              <CloseCircle size={14} color="currentColor" variant="Bold" />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={createColumns({ t })}
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
