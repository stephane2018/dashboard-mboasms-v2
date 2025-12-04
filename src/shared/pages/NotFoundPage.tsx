import { Home, ArrowLeft } from "lucide-react"
import { SearchStatus } from "iconsax-react"
import { Button, Card, CardContent } from "../ui"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import { useRouter } from "next/navigation"

export function NotFoundPage() {
  const router = useRouter()

  const handleGoHome = () => {
    const dashboardUrl = getDefaultDashboardUrl()
    router.push(dashboardUrl)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full border-2 shadow-xl">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <SearchStatus size={80} variant="Bulk" className="text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center animate-bounce">
                <span className="text-2xl font-bold text-destructive">!</span>
              </div>
            </div>

            {/* Error Code */}
            <div className="space-y-2">
              <h1 className="text-8xl font-bold text-primary">404</h1>
              <h2 className="text-2xl font-semibold text-foreground">
                Page introuvable
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-3 max-w-md">
              <p className="text-muted-foreground">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <p className="text-sm text-muted-foreground">
                Vérifiez l'URL ou retournez à la page d'accueil pour continuer votre navigation.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full sm:w-auto">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button
                onClick={handleGoHome}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                Page d'accueil
              </Button>
            </div>

            {/* Help Section */}
            <div className="pt-8 border-t w-full">
              <p className="text-sm text-muted-foreground mb-3">
                Besoin d'aide ?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <button
                  onClick={() => router.push("/admin/support")}
                  className="text-primary hover:underline transition-all"
                >
                  Contacter le support
                </button>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={handleGoHome}
                  className="text-primary hover:underline transition-all"
                >
                  Tableau de bord
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
