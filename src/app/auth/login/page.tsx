"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeSlash } from "iconsax-react"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { httpClient } from "@/core/lib/http-client"
import { tokenManager } from "@/core/lib/token-manager./token-manager"
import { useUserStore } from "@/core/stores"
import { Role } from "@/core/config/enum"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import { loginSchema, type LoginFormData } from "@/shared/validation"
import { Button } from "@/shared/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"

interface LoginResponse {
  token: string
  refreshToken: string
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  userEnterprise?: {
    id: string
    name: string
  }
}

const slides = [
  {
    title: "SMS Marketing Power",
    description: "Reach your customers instantly with bulk SMS campaigns. Send promotional messages, alerts, and notifications with 98% open rates."
  },
  {
    title: "Global SMS Gateway",
    description: "Connect with customers worldwide through our reliable SMS gateway. Support for multiple countries and carriers with real-time delivery tracking."
  },
  {
    title: "Automated Messaging",
    description: "Schedule SMS campaigns, set up auto-responses, and create automated workflows to engage your audience at the perfect time."
  },
  {
    title: "Analytics & Reports",
    description: "Track delivery rates, measure campaign performance, and get detailed insights into your SMS marketing efforts with comprehensive analytics."
  },
  {
    title: "Professional Network",
    description: "Join a qualified ecosystem of professionals and experts. Develop your business activity by collaborating with trusted experts and multiply your business opportunities thanks to an active and engaged network."
  }
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<{ message: string } | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { setUser } = useUserStore()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await httpClient.post<LoginResponse>('/api/v1/auth/login', data)
    },
    onSuccess: (data) => {
      tokenManager.setTokens(data.token, data.refreshToken)
      console.log(data);
      setUser({
        id: data.id,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role as Role,
        companyId: data.userEnterprise?.id,
      })

      toast.success("Login successful!")
      setError(null)

      // // Navigate to appropriate dashboard
      const dashboardUrl = getDefaultDashboardUrl()
      router.push(dashboardUrl)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Login failed. Please check your credentials."
      setError({ message: errorMessage })
      toast.error(errorMessage)
    },
  })

  const handleLogin = (data: LoginFormData) => {
    setError(null)
    loginMutation.mutate(data)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Primary Gradient Sidebar with Dot Pattern */}
      <div className="hidden lg:flex flex-col p-12 bg-linear-to-br from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Dot Pattern Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Animated SVG Icons Background */}
        <div className="absolute inset-0 opacity-10">
          {/* Message Icon */}
          <svg className="absolute top-[15%] left-[10%] w-16 h-16 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {/* Users Icon */}
          <svg className="absolute top-[25%] right-[15%] w-20 h-20 animate-float-delayed-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>

          {/* Network Icon */}
          <svg className="absolute bottom-[20%] left-[15%] w-14 h-14 animate-float-delayed-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="12" cy="20" r="2" />
            <line x1="12" y1="6" x2="12" y2="10" />
            <line x1="12" y1="14" x2="12" y2="18" />
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="18" y2="12" />
          </svg>

          {/* Star Icon */}
          <svg className="absolute top-[60%] right-[20%] w-12 h-12 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>

          {/* Globe Icon */}
          <svg className="absolute bottom-[35%] right-[10%] w-18 h-18 animate-float-delayed-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        {/* Logo at top left */}
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="MboaSMS Logo"
            width={192}
            height={48}
            className="w-48"
          />
        </div>

        {/* Centered Content - Slider */}
        <div className="flex-1 flex items-center justify-center relative z-10 overflow-hidden">
          <div className="max-w-2xl  w-full text-center px-8">
            <div className="relative h-72">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                    }`}
                >
                  <h1 className="text-5xl font-bold mb-8">{slide.title}</h1>
                  <p className="text-white/90 text-xl leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider at bottom */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Previous slide"
            >
              <span className="text-sm">←</span>
            </button>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/30'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-sm text-white/70">{currentSlide + 1} / {slides.length}</span>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Next slide"
            >
              <span className="text-sm">→</span>
            </button>
          </div>
          <p className="text-sm text-white/60">© 2025 MboaSMS</p>
        </div>
      </div>

      {/* Right Side - White Form Area */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm space-y-8">
          <Image
            src="/logo.png"
            alt="MboaSMS Logo"
            width={160}
            height={40}
            className="w-40 lg:hidden"
          />

          {error && (
            <div className="relative overflow-hidden rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20 p-3.5 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
              <AlertCircle className="relative w-5 h-5 text-destructive shrink-0" />
              <div className="relative">
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Bon retour sur <span className="text-primary">MboaSMS</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Connectez-vous pour continuer</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs font-medium text-primary hover:underline transition-all"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="current-password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          className="pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlash size={20} variant="Bulk" color="currentcolor" className="text-primary" />
                          ) : (
                            <Eye size={20} variant="Bulk" color="currentcolor" className="text-primary" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="default"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-base"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
                Vous n'avez pas de compte ?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-primary hover:underline transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
