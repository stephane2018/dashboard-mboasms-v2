"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { LogoutCurve } from "iconsax-react"
import { Loader2 } from "lucide-react"
import { useT } from "@/core/hooks"
import { cn } from "@/lib/utils"

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: LogoutConfirmDialogProps) {
  const { t } = useT()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
        {/* Hero header */}
        <div className="relative bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-b border-border/60 px-5 py-5">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.red.500/15),transparent_60%)]" />
          <AlertDialogHeader>
            <div className="flex items-start gap-3 text-left">
              <div className="rounded-xl bg-red-500/15 p-2.5 ring-1 ring-red-500/20">
                <LogoutCurve
                  size={20}
                  color="currentColor"
                  variant="Bulk"
                  className="text-red-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <AlertDialogTitle className="text-base font-semibold text-foreground">
                  {t("layout.logoutConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t("layout.logoutConfirmDesc")}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
          <AlertDialogCancel disabled={isPending} className="rounded-lg mt-0">
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "rounded-lg gap-2 bg-red-600 text-white font-semibold hover:bg-red-700",
              "shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/30",
              "transition-all duration-200"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogoutCurve size={14} color="currentColor" variant="Bulk" />
            )}
            {t("layout.logoutConfirmAction")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
