"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Lock, Sms, Eye, EyeSlash } from "iconsax-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT, useLogin } from "@/core/hooks"
import { toast } from "sonner"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}


export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const { t } = useT()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const loginMutation = useLogin()

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!email) {
            newErrors.email = t("loginModal.emailRequired")
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("loginModal.emailInvalid")
        }
        if (!password) {
            newErrors.password = t("loginModal.passwordRequired")
        } else if (password.length < 6) {
            newErrors.password = t("loginModal.passwordMinLength")
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await loginMutation.mutateAsync({ email, password })
            handleClose()
            onSuccess?.()
        } catch (error: any) {
            const msg = error?.message || t("loginModal.invalidCredentials")
            toast.error(t("auth.loginError"), { description: msg })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setPassword("")
        setShowPassword(false)
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        {t("auth.login")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("loginModal.description")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="login-email">{t("common.email")}</Label>
                        <div className="relative">
                            <Sms size="18" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                className={cn("h-12 pl-10", errors.email && "border-red-500")}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="login-password">{t("auth.password")}</Label>
                        <div className="relative">
                            <Lock size="18" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("loginModal.passwordPlaceholder")}
                                className={cn("h-12 pl-10 pr-10", errors.password && "border-red-500")}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeSlash size="18" color="currentColor" /> : <Eye size="18" color="currentColor" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {t("loginModal.loggingIn")}
                            </>
                        ) : (
                            t("auth.login")
                        )}
                    </Button>

                    {/* Links */}
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            {t("loginModal.noAccount")}{" "}
                            <Link href="/auth/register" className="text-primary font-medium hover:underline" onClick={handleClose}>
                                {t("auth.register")}
                            </Link>
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
