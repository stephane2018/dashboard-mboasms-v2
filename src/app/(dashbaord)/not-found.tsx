"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardNotFound() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-full">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page introuvable
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Cette page du tableau de bord n&apos;existe pas ou a été déplacée.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Retour au tableau de bord
          </Link>

          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Page précédente
          </button>
        </div>
      </div>
    </div>
  )
}
