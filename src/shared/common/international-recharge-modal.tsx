"use client"

import { useState } from "react"
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
import {
    Wallet,
    TickCircle,
    InfoCircle,
    Card as CardIcon,
    MoneyRecive,
    Global,
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/core/hooks"
import { PaymentMethod } from "@/core/models/recharges"
import { couponService } from "@/core/services/coupon.service"
import type { Coupon } from "@/modules/coupon/types"

function countryCodeToFlag(code: string): string {
    const codePoints = code
        .toUpperCase()
        .split("")
        .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    return String.fromCodePoint(...codePoints)
}

interface InternationalRechargeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: InternationalRechargeFormData) => Promise<void>
    isLoading?: boolean
    selectedCountry?: { countryName: string; countryCode: string; pricePerSms: number } | null
}

export interface InternationalRechargeFormData {
    qteMessage: number
    amount: number
    paymentMethod: string
    debitPhoneNumber: string
    debitBankAccountNumber?: string
    couponCode?: string
}

export function InternationalRechargeModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    selectedCountry,
}: InternationalRechargeModalProps) {
    const { t } = useT()

    const paymentMethods = [
        { value: PaymentMethod.CASH, label: t("intlRecharge.cashPayment"), icon: Wallet },
        { value: PaymentMethod.ORANGE_MONEY, label: "Orange Money", icon: MoneyRecive },
        { value: PaymentMethod.MTN_MONEY, label: "MTN Money", icon: MoneyRecive },
        { value: PaymentMethod.BANK_ACCOUNT, label: t("intlRecharge.bankAccount"), icon: CardIcon },
        { value: PaymentMethod.PAYPAL, label: "PayPal", icon: CardIcon },
    ]
    const [qteMessage, setQteMessage] = useState("")
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bankAccount, setBankAccount] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)
    const [verifiedCoupon, setVerifiedCoupon] = useState<Coupon | null>(null)
    const [couponError, setCouponError] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Auto-calculate amount when qteMessage changes
    const handleQteChange = (value: string) => {
        setQteMessage(value)
        if (selectedCountry && value) {
            setAmount(String(Number(value) * selectedCountry.pricePerSms))
        } else if (!value) {
            setAmount("")
        }
    }

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return

        setIsVerifyingCoupon(true)
        setCouponError("")
        setVerifiedCoupon(null)

        try {
            const coupon = await couponService.verifyCouponByCode(couponCode.trim())
            const now = new Date()
            if (new Date(coupon.validTo) < now) {
                setCouponError(t("recharge.promoExpired"))
            } else {
                setVerifiedCoupon(coupon)
            }
        } catch {
            setCouponError(t("recharge.promoInvalid"))
        } finally {
            setIsVerifyingCoupon(false)
        }
    }

    const handleClearCoupon = () => {
        setCouponCode("")
        setVerifiedCoupon(null)
        setCouponError("")
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!qteMessage || Number(qteMessage) <= 0) {
            newErrors.qteMessage = t("intlRecharge.qteError")
        }

        const numAmount = Number(amount)
        if (!amount || numAmount <= 0) {
            newErrors.amount = t("intlRecharge.amountError")
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = t("recharge.paymentMethodRequired")
        }

        if ((paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY) && !phoneNumber) {
            newErrors.phoneNumber = t("recharge.phoneRequired")
        }

        if (paymentMethod === PaymentMethod.BANK_ACCOUNT && !bankAccount) {
            newErrors.bankAccount = t("recharge.bankAccountRequired")
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        const data: InternationalRechargeFormData = {
            qteMessage: Number(qteMessage),
            amount: Number(amount),
            paymentMethod,
            debitPhoneNumber: phoneNumber,
            debitBankAccountNumber: bankAccount || undefined,
            couponCode: couponCode || undefined,
        }

        try {
            await onSubmit(data)
            handleClose()
        } catch {
            // error handled by caller
        }
    }

    const handleClose = () => {
        setQteMessage("")
        setAmount("")
        setPaymentMethod("")
        setPhoneNumber("")
        setBankAccount("")
        setCouponCode("")
        setVerifiedCoupon(null)
        setCouponError("")
        setErrors({})
        onClose()
    }

    const requiresPhoneNumber = paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY
    const requiresBankAccount = paymentMethod === PaymentMethod.BANK_ACCOUNT

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Global size={24} color="currentColor" variant="Bulk" className="text-primary" />
                        {t("intlRecharge.title")}
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-muted-foreground">
                            {t("intlRecharge.description")}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {/* Country highlight */}
                {selectedCountry && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                        <span className="text-5xl">{countryCodeToFlag(selectedCountry.countryCode)}</span>
                        <div>
                            <div className="font-semibold text-foreground text-lg">{selectedCountry.countryName}</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">{selectedCountry.pricePerSms}</span>
                                <span className="text-sm text-muted-foreground">FCFA / SMS</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 py-4">
                    {/* Quantity of SMS */}
                    <div className="space-y-2">
                        <Label htmlFor="intl-qte">{t("intlRecharge.smsQuantity")} *</Label>
                        <Input
                            id="intl-qte"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={qteMessage}
                            onChange={(e) => handleQteChange(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="Ex: 500"
                            className={cn("h-12 text-lg font-semibold", errors.qteMessage && "border-red-500 ring-1 ring-red-500")}
                        />
                        {errors.qteMessage && (
                            <p className="text-xs text-red-500 mt-1">{errors.qteMessage}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="intl-amount">{t("intlRecharge.amount")} *</Label>
                        <Input
                            id="intl-amount"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="Ex: 5000"
                            className={cn("h-12 text-lg font-semibold", errors.amount && "border-red-500 ring-1 ring-red-500")}
                        />
                        {errors.amount && (
                            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                        )}
                        <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                            <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                            <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
                                {t("intlRecharge.amountNote")}
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label htmlFor="intl-payment-method">{t("recharge.paymentMethod")} *</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger
                                id="intl-payment-method"
                                className={cn("h-12", errors.paymentMethod && "border-red-500 ring-1 ring-red-500")}
                            >
                                <SelectValue placeholder={t("recharge.selectPaymentMethod")} />
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

                    {/* Phone Number */}
                    {requiresPhoneNumber && (
                        <div className="space-y-2">
                            <Label htmlFor="intl-phone-number">{t("recharge.phoneNumber")} *</Label>
                            <Input
                                id="intl-phone-number"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+237 6XX XXX XXX"
                                className={cn("h-12", errors.phoneNumber && "border-red-500 ring-1 ring-red-500")}
                            />
                            {errors.phoneNumber && (
                                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                            )}
                            <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
                                    {t("intlRecharge.validateOnMobile")}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Bank Account */}
                    {requiresBankAccount && (
                        <div className="space-y-2">
                            <Label htmlFor="intl-bank-account">{t("recharge.bankAccount")} *</Label>
                            <Input
                                id="intl-bank-account"
                                type="text"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                placeholder="CM21 1000 2000 0000 0001"
                                className={cn("h-12", errors.bankAccount && "border-red-500 ring-1 ring-red-500")}
                            />
                            {errors.bankAccount && (
                                <p className="text-xs text-red-500">{errors.bankAccount}</p>
                            )}
                        </div>
                    )}

                    {/* Coupon Code (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="intl-coupon-code">{t("recharge.promoCode")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="intl-coupon-code"
                                type="text"
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase())
                                    if (verifiedCoupon) setVerifiedCoupon(null)
                                    if (couponError) setCouponError("")
                                }}
                                placeholder="PROMO2025"
                                className="h-12"
                                disabled={!!verifiedCoupon}
                            />
                            {verifiedCoupon ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 shrink-0"
                                    onClick={handleClearCoupon}
                                >
                                    {t("recharge.clear")}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 shrink-0"
                                    onClick={handleVerifyCoupon}
                                    disabled={!couponCode.trim() || isVerifyingCoupon}
                                >
                                    {isVerifyingCoupon ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        t("recharge.verify")
                                    )}
                                </Button>
                            )}
                        </div>
                        {verifiedCoupon && (
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                                <TickCircle size={16} color="currentColor" variant="Bulk" />
                                <span>{verifiedCoupon.name} - {verifiedCoupon.percentage}% {t("intlRecharge.discount")}</span>
                            </div>
                        )}
                        {couponError && (
                            <p className="text-xs text-red-500">{couponError}</p>
                        )}
                    </div>

                    {/* Summary */}
                    {amount && Number(amount) > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3">{t("recharge.summary")}</h3>
                            <div className="space-y-2 text-sm">
                                {qteMessage && Number(qteMessage) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t("intlRecharge.smsQuantity")}</span>
                                        <span className="font-medium">{Number(qteMessage).toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedCountry && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t("recharge.unitPrice")}</span>
                                        <span className="font-medium">{selectedCountry.pricePerSms} FCFA/SMS</span>
                                    </div>
                                )}
                                {verifiedCoupon && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t("recharge.reductionLabel", { percentage: verifiedCoupon.percentage })}</span>
                                        <span className="font-medium text-green-600">
                                            -{Math.round(Number(amount) * verifiedCoupon.percentage / 100).toLocaleString()} FCFA
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-semibold">{t("recharge.total")}</span>
                                    {verifiedCoupon ? (
                                        <div className="text-right">
                                            <span className="line-through text-muted-foreground text-sm mr-2">
                                                {Number(amount).toLocaleString()} FCFA
                                            </span>
                                            <span className="font-bold text-lg text-primary">
                                                {Math.round(Number(amount) * (1 - verifiedCoupon.percentage / 100)).toLocaleString()} FCFA
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-lg text-primary">
                                            {Number(amount).toLocaleString()} FCFA
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {t("recharge.processing")}
                            </>
                        ) : (
                            <>
                                <TickCircle size={18} color="currentColor" variant="Bulk" className="mr-2" />
                                {requiresPhoneNumber ? t("recharge.validateTransaction") : t("recharge.createRequest")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
