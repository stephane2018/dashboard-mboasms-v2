"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useActivePlans, useT } from "@/core/hooks"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs"
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
    MoneyRecive,
    Global,
    Call,
    ArrowLeft2,
    ArrowRight2,
} from "iconsax-react"
import { Loader2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PricingPlanType } from "@/core/models/pricing"
import { PaymentMethod } from "@/core/models/recharges"
import { couponService } from "@/core/services/coupon.service"
import type { Coupon } from "@/modules/coupon/types"

interface CreateRechargeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: RechargeFormData) => Promise<void>
    isLoading?: boolean
}

export interface RechargeFormData {
    qteMessage: number
    paymentMethod: string
    debitPhoneNumber: string
    debitBankAccountNumber?: string
    couponCode?: string
    rechargeType?: "local" | "international"
}

const localPaymentMethods = [
    { value: PaymentMethod.ORANGE_MONEY, label: "Orange Money", icon: MoneyRecive },
    { value: PaymentMethod.MTN_MONEY, label: "MTN Money", icon: MoneyRecive },
]

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
}

export function CreateRechargeModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}: CreateRechargeModalProps) {
    const { t } = useT()
    const { data: activePlans = [] } = useActivePlans()

    const internationalPaymentMethods = [
        { value: PaymentMethod.CASH, label: t('recharge.depositMobileMoney'), icon: Wallet },
        { value: PaymentMethod.ORANGE_MONEY, label: "Orange Money", icon: MoneyRecive },
        { value: PaymentMethod.MTN_MONEY, label: "MTN Money", icon: MoneyRecive },
        { value: PaymentMethod.BANK_ACCOUNT, label: t('recharge.bankAccountLabel'), icon: CardIcon },
        { value: PaymentMethod.PAYPAL, label: "PayPal", icon: CardIcon },
    ]

    const INTL_STEPS = [
        { label: t('recharge.stepQuantity'), description: t('recharge.stepQuantityDesc') },
        { label: t('recharge.stepPayment'), description: t('recharge.stepPaymentDesc') },
        { label: t('recharge.stepConfirmation'), description: t('recharge.stepConfirmationDesc') },
    ]

    const [rechargeType, setRechargeType] = useState<"local" | "international">("local")
    const [intlStep, setIntlStep] = useState(0)
    const [intlDirection, setIntlDirection] = useState(1)
    const [smsQuantity, setSmsQuantity] = useState(100)
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bankAccount, setBankAccount] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)
    const [verifiedCoupon, setVerifiedCoupon] = useState<Coupon | null>(null)
    const [couponError, setCouponError] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { price, plan } = useMemo(() => {
        if (!activePlans?.length) return { price: 0, plan: null }
        const applicablePlan = activePlans.find(
            (p: PricingPlanType) => smsQuantity >= p.minSMS && smsQuantity <= p.maxSMS
        )
        if (!applicablePlan) return { price: 0, plan: null }
        return { price: smsQuantity * applicablePlan.smsUnitPrice, plan: applicablePlan }
    }, [smsQuantity, activePlans])

    const { minSMS, maxSMS } = useMemo(() => {
        if (!activePlans?.length) return { minSMS: 1, maxSMS: 1000000 }
        const allMinValues = activePlans.map((p: PricingPlanType) => p.minSMS)
        const allMaxValues = activePlans.map((p: PricingPlanType) => p.maxSMS)
        return { minSMS: Math.min(...allMinValues), maxSMS: Math.max(...allMaxValues) }
    }, [activePlans])

    const discountedPrice = useMemo(() => {
        if (!verifiedCoupon || !price) return null
        return Math.round(price * (1 - verifiedCoupon.percentage / 100))
    }, [price, verifiedCoupon])

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return
        setIsVerifyingCoupon(true)
        setCouponError("")
        setVerifiedCoupon(null)
        try {
            const coupon = await couponService.verifyCouponByCode(couponCode.trim())
            if (new Date(coupon.validTo) < new Date()) {
                setCouponError(t('recharge.promoExpired'))
            } else {
                setVerifiedCoupon(coupon)
            }
        } catch {
            setCouponError(t('recharge.promoInvalid'))
        } finally {
            setIsVerifyingCoupon(false)
        }
    }

    const handleClearCoupon = () => {
        setCouponCode("")
        setVerifiedCoupon(null)
        setCouponError("")
    }

    const handleTabChange = (value: string) => {
        setRechargeType(value as "local" | "international")
        setPaymentMethod("")
        setPhoneNumber("")
        setBankAccount("")
        setIntlStep(0)
        setErrors({})
    }

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {}
        if (step === 0) {
            if (smsQuantity < minSMS || smsQuantity > maxSMS) {
                newErrors.smsQuantity = t('recharge.quantityMustBeBetween', { min: minSMS, max: maxSMS })
            }
            if (!plan) {
                newErrors.smsQuantity = t('recharge.noPlanForQuantity')
            }
        }
        if (step === 1) {
            if (!paymentMethod) {
                newErrors.paymentMethod = t('recharge.paymentMethodRequired')
            }
            if ((paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY) && !phoneNumber) {
                newErrors.phoneNumber = t('recharge.phoneRequired')
            }
            if (paymentMethod === PaymentMethod.BANK_ACCOUNT && !bankAccount) {
                newErrors.bankAccount = t('recharge.bankAccountRequired')
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateAll = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (smsQuantity < minSMS || smsQuantity > maxSMS) newErrors.smsQuantity = t('recharge.quantityInvalid')
        if (!plan) newErrors.smsQuantity = t('recharge.noPlanAvailable')
        if (!paymentMethod) newErrors.paymentMethod = t('recharge.methodRequired')
        if ((paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY) && !phoneNumber) newErrors.phoneNumber = t('recharge.numberRequired')
        if (paymentMethod === PaymentMethod.BANK_ACCOUNT && !bankAccount) newErrors.bankAccount = t('recharge.accountRequired')
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleIntlNext = () => {
        if (!validateStep(intlStep)) return
        setIntlDirection(1)
        setIntlStep((s) => s + 1)
    }

    const handleIntlPrev = () => {
        setIntlDirection(-1)
        setIntlStep((s) => s - 1)
        setErrors({})
    }

    const handleSubmit = async () => {
        if (rechargeType === "local" && !validateAll()) return
        if (rechargeType === "international" && !validateAll()) return
        const data: RechargeFormData = {
            qteMessage: smsQuantity,
            paymentMethod,
            debitPhoneNumber: phoneNumber,
            debitBankAccountNumber: bankAccount || undefined,
            couponCode: couponCode || undefined,
            rechargeType,
        }
        try {
            await onSubmit(data)
            handleClose()
        } catch {
            // handled by parent
        }
    }

    const handleClose = () => {
        setSmsQuantity(100)
        setPaymentMethod("")
        setPhoneNumber("")
        setBankAccount("")
        setCouponCode("")
        setVerifiedCoupon(null)
        setCouponError("")
        setIsVerifyingCoupon(false)
        setIntlStep(0)
        setErrors({})
        onClose()
    }

    const requiresPhoneNumber = paymentMethod === PaymentMethod.ORANGE_MONEY || paymentMethod === PaymentMethod.MTN_MONEY
    const requiresBankAccount = paymentMethod === PaymentMethod.BANK_ACCOUNT

    // ── Shared sub-components ────────────────────────────────────────

    const QuantitySection = (
        <div className="space-y-4">
            <SMSQuantityInput value={smsQuantity} onChange={setSmsQuantity} min={minSMS} max={maxSMS} step={100} label={t('recharge.smsQuantity')} />
            {errors.smsQuantity && (
                <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
                    <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-400 text-sm">{errors.smsQuantity}</AlertDescription>
                </Alert>
            )}
            {plan && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{t('recharge.pricingPlan')}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{plan.planCode}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">{price.toLocaleString()}</span>
                        <span className="text-xl font-semibold text-primary">FCFA</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t('recharge.unitPrice')}: {plan.smsUnitPrice} FCFA/SMS</p>
                    <p className="text-sm text-muted-foreground mt-1">{plan.descriptionFr}</p>
                </div>
            )}
        </div>
    )

    const PaymentSection = (methods: typeof localPaymentMethods) => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>{t('recharge.paymentMethod')} *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className={cn("h-12", errors.paymentMethod && "border-red-500")}>
                        <SelectValue placeholder={t('recharge.selectPaymentMethod')} />
                    </SelectTrigger>
                    <SelectContent>
                        {methods.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                                <div className="flex items-center gap-2">
                                    <m.icon size={16} color="currentColor" variant="Bulk" />
                                    <span>{m.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod}</p>}
            </div>
            {requiresPhoneNumber && (
                <div className="space-y-2">
                    <Label>{t('recharge.phoneNumber')} *</Label>
                    <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+237 6XX XXX XXX" className={cn("h-12", errors.phoneNumber && "border-red-500")} />
                    {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                </div>
            )}
            {requiresBankAccount && (
                <div className="space-y-2">
                    <Label>{t('recharge.bankAccount')} *</Label>
                    <Input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" className={cn("h-12", errors.bankAccount && "border-red-500")} />
                    {errors.bankAccount && <p className="text-xs text-red-500">{errors.bankAccount}</p>}
                </div>
            )}
            {/* Coupon */}
            <div className="space-y-2">
                <Label>{t('recharge.promoCode')}</Label>
                <div className="flex gap-2">
                    <Input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); if (verifiedCoupon) setVerifiedCoupon(null); if (couponError) setCouponError("") }} placeholder="PROMO2024" className="h-12" disabled={!!verifiedCoupon} />
                    {verifiedCoupon ? (
                        <Button type="button" variant="outline" className="h-12 shrink-0" onClick={handleClearCoupon}>{t('recharge.clear')}</Button>
                    ) : (
                        <Button type="button" variant="outline" className="h-12 shrink-0" onClick={handleVerifyCoupon} disabled={!couponCode.trim() || isVerifyingCoupon}>
                            {isVerifyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : t('recharge.verify')}
                        </Button>
                    )}
                </div>
                {verifiedCoupon && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                        <TickCircle size={16} color="currentColor" variant="Bulk" />
                        <span>{verifiedCoupon.name} - {verifiedCoupon.percentage}% {t('recharge.discount')}</span>
                    </div>
                )}
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
            </div>
        </div>
    )

    const SummarySection = (
        plan ? (
            <div className="space-y-4">
                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('recharge.type')}</span>
                        <span className="font-medium">{rechargeType === "local" ? t('recharge.localCameroon') : t('recharge.international')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('recharge.quantity')}</span>
                        <span className="font-medium">{smsQuantity.toLocaleString()} SMS</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('recharge.unitPrice')}</span>
                        <span className="font-medium">{plan.smsUnitPrice} FCFA</span>
                    </div>
                    {paymentMethod && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('recharge.payment')}</span>
                            <span className="font-medium">{[...localPaymentMethods, ...internationalPaymentMethods].find(m => m.value === paymentMethod)?.label}</span>
                        </div>
                    )}
                    {verifiedCoupon && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('recharge.reductionLabel', { percentage: verifiedCoupon.percentage })}</span>
                            <span className="font-medium text-green-600">-{(price - (discountedPrice ?? price)).toLocaleString()} FCFA</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-3 border-t">
                        <span className="font-semibold">{t('recharge.total')}</span>
                        {verifiedCoupon && discountedPrice !== null ? (
                            <div className="text-right">
                                <span className="line-through text-muted-foreground text-sm mr-2">{price.toLocaleString()} FCFA</span>
                                <span className="font-bold text-lg text-primary">{discountedPrice.toLocaleString()} FCFA</span>
                            </div>
                        ) : (
                            <span className="font-bold text-lg text-primary">{price.toLocaleString()} FCFA</span>
                        )}
                    </div>
                </div>
                {rechargeType === "international" && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/50">
                        <Call size={16} variant="Bulk" color="currentColor" className="text-amber-500 shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            {t('recharge.whatsappHelp')}{" "}
                            <a href="https://wa.me/237697193064" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">+237 697 193 064 (WhatsApp uniquement)</a>
                        </p>
                    </div>
                )}
            </div>
        ) : null
    )

    // ── Render ───────────────────────────────────────────────────────

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Wallet size={24} color="currentColor" variant="Bulk" className="text-primary" />
                        {t('recharge.createRecharge')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('recharge.chooseTypeAndPayment')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Tabs */}
                    <Tabs value={rechargeType} onValueChange={handleTabChange}>
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="local" className="gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {t('recharge.localCameroon')}
                            </TabsTrigger>
                            <TabsTrigger value="international" className="gap-1.5">
                                <Global size={16} variant="Bulk" color="currentColor" />
                                {t('recharge.international')}
                            </TabsTrigger>
                        </TabsList>

                        {/* ── LOCAL TAB ─────────────────────────────────── */}
                        <TabsContent value="local">
                            <div className="space-y-5">
                                <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                                    <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                    <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
                                        <strong>{t('recharge.howItWorks')} :</strong> {t('recharge.localHowItWorks')}
                                    </AlertDescription>
                                </Alert>
                                {QuantitySection}
                                {PaymentSection(localPaymentMethods)}
                                {requiresPhoneNumber && rechargeType === "local" && (
                                    <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                                        <Call size={16} color="currentColor" variant="Bulk" className="text-amber-600" />
                                        <AlertDescription className="text-amber-700 dark:text-amber-400 text-xs">
                                            {t('recharge.validationMessage')}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {SummarySection}
                            </div>
                        </TabsContent>

                        {/* ── INTERNATIONAL TAB (multi-step) ───────────── */}
                        <TabsContent value="international">
                            <div className="space-y-5">
                                <Alert className="border-purple-300 bg-purple-50 dark:bg-purple-900/20">
                                    <Global size={16} variant="Bulk" color="currentColor" className="text-purple-600" />
                                    <AlertDescription className="text-purple-700 dark:text-purple-400 text-xs leading-relaxed">
                                        <strong>{t('recharge.howItWorks')} :</strong> {t('recharge.intlHowItWorks')}
                                    </AlertDescription>
                                </Alert>

                                {/* Step indicator */}
                                <div className="flex items-center gap-1">
                                    {INTL_STEPS.map((s, i) => (
                                        <div key={i} className="flex items-center flex-1">
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                                    i <= intlStep ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {i < intlStep ? <TickCircle size={14} color="currentColor" variant="Bulk" /> : i + 1}
                                                </div>
                                                <div className="hidden sm:block min-w-0">
                                                    <p className={cn("text-[11px] font-semibold truncate", i <= intlStep ? "text-foreground" : "text-muted-foreground")}>{s.label}</p>
                                                </div>
                                            </div>
                                            {i < INTL_STEPS.length - 1 && (
                                                <div className={cn("h-px flex-1 mx-2 transition-colors", i < intlStep ? "bg-primary" : "bg-border")} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Step content with slide animation */}
                                <AnimatePresence mode="wait" custom={intlDirection}>
                                    <motion.div
                                        key={intlStep}
                                        custom={intlDirection}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                    >
                                        {intlStep === 0 && QuantitySection}
                                        {intlStep === 1 && PaymentSection(internationalPaymentMethods)}
                                        {intlStep === 2 && SummarySection}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Step navigation */}
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        {intlStep > 0 && (
                                            <Button type="button" variant="outline" size="sm" onClick={handleIntlPrev} className="gap-1.5">
                                                <ArrowLeft2 size={14} color="currentColor" />
                                                {t('common.previous')}
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        {intlStep < INTL_STEPS.length - 1 && (
                                            <Button type="button" size="sm" onClick={handleIntlNext} className="gap-1.5">
                                                {t('common.next')}
                                                <ArrowRight2 size={14} color="currentColor" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        {t('common.cancel')}
                    </Button>
                    {/* Show submit only on local tab OR last intl step */}
                    {(rechargeType === "local" || intlStep === INTL_STEPS.length - 1) && (
                        <Button onClick={handleSubmit} disabled={isLoading || !plan} className="min-w-[140px]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {t('recharge.processing')}
                                </>
                            ) : (
                                <>
                                    <TickCircle size={18} color="currentColor" variant="Bulk" className="mr-2" />
                                    {rechargeType === "local" && requiresPhoneNumber
                                        ? t('recharge.validateTransaction')
                                        : t('recharge.createRequest')}
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
