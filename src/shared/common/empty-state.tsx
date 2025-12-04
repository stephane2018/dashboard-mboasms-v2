import React from "react"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "Aucune donnée",
  description = "Il n'y a aucune donnée à afficher pour le moment.",
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="mb-4">
        {icon || (
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground/20"
          >
            {/* Empty folder illustration */}
            <path
              d="M100 30H54L46 22H20C16.6863 22 14 24.6863 14 28V92C14 95.3137 16.6863 98 20 98H100C103.314 98 106 95.3137 106 92V36C106 32.6863 103.314 30 100 30Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 42H106"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Empty circle/document icon inside folder */}
            <circle
              cx="60"
              cy="65"
              r="12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
            />
            <path
              d="M52 65H68"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {description}
      </p>
    </div>
  )
}
