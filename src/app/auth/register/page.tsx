"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeSlash } from "iconsax-react"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { httpClient } from "@/core/lib/http-client"
import { registerSchema, type RegisterFormData } from "@/shared/validation"
import { Brand } from "@/shared/common/brand"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"

interface RegisterResponse {
  message: string
  userId: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<{ message: string } | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data
      return await httpClient.post<RegisterResponse>('/api/v1/auth/register', registerData)
    },
    onSuccess: () => {
      toast.success("Account created successfully! Please login.")
      setError(null)
      router.push('/auth/login')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Registration failed. Please try again."
      setError({ message: errorMessage })
      toast.error(errorMessage)
    },
  })

  const handleRegister = (data: RegisterFormData) => {
    setError(null)
    registerMutation.mutate(data)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Dark Navy Sidebar */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0A1628] text-white">
        <div>
          <Brand imgClassNames="w-48" className="w-fit mb-16" />

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Join Our Network</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Create your account and become part of a qualified ecosystem of professionals and experts. Start building meaningful connections and grow your business with our powerful SMS management platform.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="text-sm">←</span>
          </button>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
          <span className="text-sm text-gray-400">2 / 5</span>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="text-sm">→</span>
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-8">© 2025 MboaSMS</p>
      </div>

      {/* Right Side - White Form Area */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <Brand imgClassNames="w-40" className="w-fit lg:hidden" />

          {error && (
            <div className="relative overflow-hidden rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20 p-3.5 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
              <AlertCircle className="relative w-5 h-5 text-destructive shrink-0" />
              <div className="relative">
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-sm text-muted-foreground">Get started with MboaSMS</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Last name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        placeholder="email@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Enter password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          className="h-11 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlash size={18} variant="Bulk" color="currentcolor" className="text-primary" />
                          ) : (
                            <Eye size={18} variant="Bulk" color="currentcolor" className="text-primary" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          placeholder="••••••••"
                          type={showConfirmPassword ? "text" : "password"}
                          className="h-11 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeSlash size={18} variant="Bulk" color="currentcolor" className="text-primary" />
                          ) : (
                            <Eye size={18} variant="Bulk" color="currentcolor" className="text-primary" />
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
                className="w-full h-11 bg-[#0A1628] hover:bg-[#0A1628]/90 text-white font-medium mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#0A1628] hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
