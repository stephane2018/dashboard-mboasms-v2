"use client"

import { useState } from "react"
import { Wallet, AddCircle, Warning2 } from "iconsax-react"
import { Button } from "@/shared/ui/button"
import { CreateRechargeModal, type RechargeFormData } from "@/shared/common/create-recharge-modal"
import { useRecharge } from "@/core/hooks/useRecharge"
import { useAuth } from "@/core/hooks/useAuth"
import { toast } from "sonner"
import { useT } from "@/core/hooks"

interface RechargeSectionProps {
    hasInsufficientBalance: boolean
    totalSmsToSend: number
    userBalance: number
    onRechargeSuccess?: () => void
}

export function RechargeSection({
    hasInsufficientBalance,
    totalSmsToSend,
    userBalance,
    onRechargeSuccess,
}: RechargeSectionProps) {
    const { t } = useT()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { createRechargeMutation } = useRecharge()
    const { user } = useAuth()

    if (!hasInsufficientBalance) return null

    const deficit = totalSmsToSend - userBalance

    const handleSubmit = async (data: RechargeFormData) => {
        await createRechargeMutation.mutateAsync({
            qteMessage: data.qteMessage,
            enterpriseId: user?.companyId || "",
            paymentMethod: data.paymentMethod,
            debitPhoneNumber: data.debitPhoneNumber,
            debitBankAccountNumber: data.debitBankAccountNumber,
            couponCode: data.couponCode,
        })
        onRechargeSuccess?.()
    }

    return (
        <>
            <div className="rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 overflow-hidden">
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Warning2 size={16} color="currentColor" variant="Bulk" className="text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            {t('sms.insufficientBalance')}
                        </span>
                    </div>

                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        {t('sms.missingSmsBefore')} <span className="font-bold">{deficit.toLocaleString()} SMS</span> {t('sms.missingSmsAfter')}
                    </p>

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-10 rounded-xl gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                        size="sm"
                    >
                        <AddCircle size={16} variant="Bulk" />
                        {t('sms.rechargeBalance')}
                    </Button>
                </div>
            </div>

            <CreateRechargeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={createRechargeMutation.isPending}
            />
        </>
    )
}
