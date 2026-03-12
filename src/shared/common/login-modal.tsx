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
import { login } from "@/core/services/auth.service"
import { useUserStore } from "@/core/stores/userStore"
import { useEnterpriseStore } from "@/core/stores/enterpriseStore"
import { getCompagnieConnectedDetails } from "@/core/services/CompanyService"
import { toast } from "sonner"
import type { Role } from "@/core/config/enum"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

interface LoginApiResponse {
    token: string
    refreshToken: string
    id?: string
    email?: string
    firstName?: string
    lastName?: string
    name?: string
    role?: Role
    avatar?: string
    phone?: string
    companyId?: string
    userEnterprise?: { id: string }
    user?: {
        id: string
        email: string
        name?: string
        firstName?: string
        lastName?: string
        role: Role
        avatar?: string
        phone?: string
        companyId?: string
    }
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { setUser } = useUserStore()
    const { setEnterprise } = useEnterpriseStore()

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!email) {
            newErrors.email = "L'email est requis"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email invalide"
        }
        if (!password) {
            newErrors.password = "Le mot de passe est requis"
        } else if (password.length < 6) {
            newErrors.password = "Minimum 6 caractères"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            const response = await login({ email, password }) as LoginApiResponse
            const userData = response.user || response
            const name = userData.name ||
                [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
                "Utilisateur"

            const mappedUser = {
                id: userData.id || "",
                email: userData.email || "",
                name,
                role: userData.role as Role,
                avatar: userData.avatar,
                phone: userData.phone,
                companyId: userData.companyId || response.userEnterprise?.id,
            }

            if (mappedUser.id && mappedUser.email) {
                setUser(mappedUser)
            }

            if (mappedUser.companyId) {
                try {
                    const enterpriseData = await getCompagnieConnectedDetails(mappedUser.companyId)
                    setEnterprise(enterpriseData)
                } catch { }
            }

            toast.success("Connexion réussie", {
                description: `Bienvenue ${name}`,
            })

            handleClose()
            onSuccess?.()
        } catch (error: any) {
            const msg = error?.message || "Email ou mot de passe incorrect"
            toast.error("Erreur de connexion", { description: msg })
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
                        Connexion
                    </DialogTitle>
                    <DialogDescription>
                        Connectez-vous pour continuer votre recharge
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
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
                        <Label htmlFor="login-password">Mot de passe</Label>
                        <div className="relative">
                            <Lock size="18" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Votre mot de passe"
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
                                Connexion...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </Button>

                    {/* Links */}
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            Pas encore de compte ?{" "}
                            <Link href="/auth/register" className="text-primary font-medium hover:underline" onClick={handleClose}>
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
