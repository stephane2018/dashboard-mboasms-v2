import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page introuvable
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Retour à l&apos;accueil
          </Link>

          <Link
            href="/auth/login"
            className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}
