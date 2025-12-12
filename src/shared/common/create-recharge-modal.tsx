"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { SMSQuantityInput } from "./sms-quantity-input"
import {
    Wallet,
    Warning2,
    TickCircle,
    InfoCircle,
    Card as CardIcon,
    MoneyRecive
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PricingPlanType } from "@/core/models/pricing"
import { PaymentMethod } from "@/core/models/recharges"

interface CreateRechargeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: RechargeFormData) => Promise<void>
    activePlans: PricingPlanType[]
    isLoading?: boolean
}

export interface RechargeFormData {
    qteMessage: number
    paymentMethod: string
    debitPhoneNumber: string
    debitBankAccountNumber?: string
    couponCode?: string
}

const paymentMethods = [
    { value: PaymentMethod.CASH, label: "Espèces (CASH)", icon: Wallet },
    { value: PaymentMethod.ORANGE_MONEY, label: "Orange Money", icon: MoneyRecive },
    { value: PaymentMethod.MTN_MONEY, label: "MTN Money", icon: MoneyRecive },
    { value: PaymentMethod.BANK_ACCOUNT, label: "Compte bancaire", icon: CardIcon },
    { value: PaymentMethod.PAYPAL, label: "PayPal", icon: CardIcon },
]

export function CreateRechargeModal({
    isOpen,
    onClose,
    onSubmit,
    activePlans,
    isLoading = false
}: CreateRechargeModalProps) {
    const [smsQuantity, setSmsQuantity] = useState(100)
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bankAccount, setBankAccount] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Calculate price based on quantity and pricing plans
    const { price, plan } = useMemo(() => {
        if (!activePlans?.length) return { price: 0, plan: null }

        const applicablePlan = activePlans.find(
            (p: PricingPlanType) => smsQuantity >= p.minSMS && smsQuantity <= p.maxSMS
        )

        if (!applicablePlan) return { price: 0, plan: null }

        return {
            price: smsQuantity * applicablePlan.smsUnitPrice,
            plan: applicablePlan
        }
    }, [smsQuantity, activePlans])

    // Get min and max SMS from plans
    const { minSMS, maxSMS } = useMemo(() => {
        if (!activePlans?.length) return { minSMS: 1, maxSMS: 1000000 }

        const allMinValues = activePlans.map(p => p.minSMS)
        const allMaxValues = activePlans.map(p => p.maxSMS)

        return {
            minSMS: Math.min(...allMinValues),
            maxSMS: Math.max(...allMaxValues)
        }
    }, [activePlans])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (smsQuantity < minSMS || smsQuantity > maxSMS) {
            newErrors.smsQuantity = `La quantité doit être entre ${minSMS} et ${maxSMS}`
        }

        if (!plan) {
            newErrors.smsQuantity = "Aucun plan tarifaire disponible pour cette quantité"
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = "Veuillez sélectionner une méthode de paiement"
        }

        if ((paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY) && !phoneNumber) {
            newErrors.phoneNumber = "Le numéro de téléphone est requis"
        }

        if (paymentMethod === PaymentMethod.BANK_ACCOUNT && !bankAccount) {
            newErrors.bankAccount = "Le numéro de compte bancaire est requis"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        const data: RechargeFormData = {
            qteMessage: smsQuantity,
            paymentMethod,
            debitPhoneNumber: phoneNumber,
            debitBankAccountNumber: bankAccount || undefined,
            couponCode: couponCode || undefined
        }

        try {
            await onSubmit(data)
            handleClose()
        } catch (error) {
            console.error("Error submitting recharge:", error)
        }
    }

    const handleClose = () => {
        setSmsQuantity(100)
        setPaymentMethod("")
        setPhoneNumber("")
        setBankAccount("")
        setCouponCode("")
        setErrors({})
        onClose()
    }

    const requiresPhoneNumber = paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY
    const requiresBankAccount = paymentMethod === PaymentMethod.BANK_ACCOUNT

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Wallet size={24} color="currentColor" variant="Bulk" className="text-primary" />
                        Faire une recharge
                    </DialogTitle>
                    <DialogDescription>
                        Rechargez votre compte SMS en sélectionnant la quantité et la méthode de paiement
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* SMS Quantity Input */}
                    <SMSQuantityInput
                        value={smsQuantity}
                        onChange={setSmsQuantity}
                        min={minSMS}
                        max={maxSMS}
                        step={100}
                        label="Nombre de SMS"
                    />
                    {errors.smsQuantity && (
                        <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
                            <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
                                {errors.smsQuantity}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Price Display */}
                    {plan && (
                        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Plan tarifaire</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {plan.planCode}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">{price}</span>
                                <span className="text-xl font-semibold text-primary">FCFA</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Prix unitaire: {plan.smsUnitPrice} FCFA/SMS
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {plan.descriptionFr}
                            </p>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label htmlFor="payment-method">Méthode de paiement *</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger
                                id="payment-method"
                                className={cn(
                                    "h-12",
                                    errors.paymentMethod && "border-red-500"
                                )}
                            >
                                <SelectValue placeholder="Sélectionnez une méthode" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                        <div className="flex items-center gap-2">
                                            <method.icon size={16} color="currentColor" variant="Bulk" />
                                            <span>{method.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.paymentMethod && (
                            <p className="text-xs text-red-500">{errors.paymentMethod}</p>
                        )}
                    </div>

                    {/* Phone Number (for Mobile Money) */}
                    {requiresPhoneNumber && (
                        <div className="space-y-2">
                            <Label htmlFor="phone-number">Numéro de téléphone *</Label>
                            <Input
                                id="phone-number"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+237 6XX XXX XXX"
                                className={cn(
                                    "h-12",
                                    errors.phoneNumber && "border-red-500"
                                )}
                            />
                            {errors.phoneNumber && (
                                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                            )}
                            <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
                                    Valider la transaction sur votre mobile et cliquer sur terminer la transaction
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Bank Account (for Bank Transfer) */}
                    {requiresBankAccount && (
                        <div className="space-y-2">
                            <Label htmlFor="bank-account">Numéro de compte bancaire *</Label>
                            <Input
                                id="bank-account"
                                type="text"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className={cn(
                                    "h-12",
                                    errors.bankAccount && "border-red-500"
                                )}
                            />
                            {errors.bankAccount && (
                                <p className="text-xs text-red-500">{errors.bankAccount}</p>
                            )}
                        </div>
                    )}

                    {/* Coupon Code (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="coupon-code">Code promo (optionnel)</Label>
                        <Input
                            id="coupon-code"
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="PROMO2024"
                            className="h-12"
                        />
                    </div>

                    {/* Summary */}
                    {plan && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3">Récapitulatif</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantité de SMS</span>
                                    <span className="font-medium">{smsQuantity.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prix unitaire</span>
                                    <span className="font-medium">{plan.smsUnitPrice} FCFA</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-semibold">Prix total</span>
                                    <span className="font-bold text-lg text-primary">{price.toLocaleString()} FCFA</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !plan}
                        className="min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Traitement...
                            </>
                        ) : (
                            <>
                                <TickCircle size={18} color="currentColor" variant="Bulk" className="mr-2" />
                                {requiresPhoneNumber ? "Valider la transaction" : "Créer la demande"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
