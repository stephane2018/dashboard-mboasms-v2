"use client"

import { useRouter } from "next/navigation"
import { useUserStore } from "@/core/stores"
import { Role } from "@/core/config/enum"
import { Shield } from "iconsax-react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { user } = useUserStore()

  const handleGoToDashboard = () => {
    if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
      router.push("/dashboard")
    } else if (user?.role === Role.USER) {
      router.push("/contacts")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Shield size={64} variant="Bulk" color="currentcolor" className="text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>

        {user && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: <span className="font-semibold">{user.role}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
