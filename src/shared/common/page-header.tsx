import { Button } from "@/shared/ui/button"
import type { Icon } from "iconsax-reactjs"

export interface PageHeaderAction {
  label: string
  icon?: Icon
  onClick?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: PageHeaderAction[]
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
              >
                {IconComponent && (
                  <IconComponent
                    size={16}
                    variant="Bulk"
                    color="currentColor"
                    className="mr-2"
                  />
                )}
                {action.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
