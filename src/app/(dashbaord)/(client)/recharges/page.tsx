"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable } from "@/shared/common/data-table/table"
import { Button } from "@/shared/ui/button"
import { WalletMoney, Add } from "iconsax-react"
import { useAuthContext } from "@/core/providers"
import { useEnterpriseRecharges } from "@/core/hooks/useRecharge"
import { CreateRechargeModal, type RechargeFormData } from "@/shared/common/create-recharge-modal"
import { clientRechargeColumns } from "./_components/client-recharge-columns"

export default function RechargesPage() {
  const { user } = useAuthContext()
  const enterpriseId = user?.companyId || ""

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { query, createRechargeMutation } = useEnterpriseRecharges(
    enterpriseId,
    0,
    100,
  )

  const handleCreateRecharge = async (data: RechargeFormData) => {
    if (!enterpriseId) {
      toast.error("Erreur", {
        description: "Impossible de créer la recharge. ID entreprise manquant.",
      })
      return
    }

    await createRechargeMutation.mutateAsync({
      qteMessage: data.qteMessage,
      enterpriseId,
      paymentMethod: data.paymentMethod,
      debitPhoneNumber: data.debitPhoneNumber,
      debitBankAccountNumber: data.debitBankAccountNumber,
      couponCode: data.couponCode,
    })
  }

  const recharges = (query.data || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WalletMoney size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Mes recharges</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Suivez vos demandes de recharge et rechargez votre compte SMS.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-9">
          <Add size={16} variant="Bulk" color="currentColor" className="mr-2" />
          Faire une recharge
        </Button>
      </div>

      <DataTable
        data={recharges}
        columns={clientRechargeColumns}
        rowCount={recharges.length}
        isLoading={query.isLoading}
        enablePagination
        autoPagination
        emptyMessage="Aucune recharge trouvée."
      />

      <CreateRechargeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRecharge}
        isLoading={createRechargeMutation.isPending}
      />
    </div>
  )
}
