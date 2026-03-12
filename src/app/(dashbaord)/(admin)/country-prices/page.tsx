"use client"

import { useState, useMemo, useCallback } from "react"
import { useUserStore } from "@/core/stores/userStore"
import { useSmsCountryPrices } from "@/core/hooks/useSmsCountryPrices"
import type { SmsCountryPriceType } from "@/core/models/sms-country-price"
import { DataTable } from "@/shared/common/data-table/table"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { SearchNormal1, Add } from "iconsax-react"
import { getColumns } from "./_components/country-price-columns"
import { CreateCountryPriceModal } from "./_components/create-country-price-modal"
import { EditCountryPriceModal } from "./_components/edit-country-price-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"

const PAGE_SIZE = 10

export default function CountryPricesPage() {
  const { isSuperAdmin } = useUserStore()

  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<SmsCountryPriceType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [priceToDelete, setPriceToDelete] = useState<SmsCountryPriceType | null>(null)

  const {
    pricesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useSmsCountryPrices({ page, size: PAGE_SIZE })

  const rawData = pricesQuery.data
  const prices: SmsCountryPriceType[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.content ?? []
  const totalElements: number = (rawData as any)?.totalElements ?? prices.length
  const isLoading = pricesQuery.isLoading

  const filteredPrices = useMemo(() => {
    if (!searchTerm) return prices
    const lower = searchTerm.toLowerCase()
    return prices.filter(
      (p) =>
        p.countryName.toLowerCase().includes(lower) ||
        p.countryCode.toLowerCase().includes(lower)
    )
  }, [prices, searchTerm])

  const handleEditPrice = (price: SmsCountryPriceType) => {
    setSelectedPrice(price)
    setIsEditModalOpen(true)
  }

  const handleDeletePrice = (price: SmsCountryPriceType) => {
    setPriceToDelete(price)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (priceToDelete) {
      deleteMutation.mutate(priceToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPriceToDelete(null)
        },
      })
    }
  }

  const handlePaginationChange = useCallback((pagination: { pageIndex: number; pageSize: number }) => {
    setPage(pagination.pageIndex)
  }, [])

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEditPrice,
        onDelete: handleDeletePrice,
        isSuperAdmin: isSuperAdmin(),
      }),
    [isSuperAdmin]
  )

  if (!isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <h1 className="text-2xl font-bold text-muted-foreground">Accès refusé</h1>
        <p className="text-muted-foreground">Cette page est réservée aux super administrateurs.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prix SMS internationaux</h1>
          <p className="text-muted-foreground">
            Gérer les tarifs SMS par pays ({totalElements} pays)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-9">
            <Add size={16} variant="Bulk" color="currentColor" className="mr-2" />
            Ajouter un pays
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <SearchNormal1
              size={16}
              variant="Bulk"
              color="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Rechercher par nom ou code pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-9 sm:w-[350px]"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredPrices.length} résultat{filteredPrices.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredPrices}
        rowCount={totalElements}
        columns={columns}
        isLoading={isLoading}
        enablePagination={true}
        enableColumnFilter={false}
        rowSelectable={false}
        onPaginationChange={handlePaginationChange}
        initialState={{
          pagination: { pageIndex: page, pageSize: PAGE_SIZE },
        }}
      />

      {/* Create Modal */}
      <CreateCountryPriceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createMutation.mutateAsync}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <EditCountryPriceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPrice(null)
        }}
        onSubmit={async (data) => {
          if (!selectedPrice) return
          await updateMutation.mutateAsync({ id: selectedPrice.id, data })
        }}
        price={selectedPrice}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le tarif pour &quot;
              {priceToDelete?.countryName}&quot; ({priceToDelete?.countryCode}) ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
