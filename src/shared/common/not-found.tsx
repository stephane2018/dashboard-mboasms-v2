import { Button } from "@/shared/ui/button";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router";

interface NotFoundProps {
  title?: string;
  subtitle?: string;
  shouldRedirect?: boolean;
  redirection?: {
    label?: string;
    href?: string;
  };
}

export function NotFound({ title, subtitle, shouldRedirect, redirection }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 text-center">
      <div className="relative max-w-md mx-auto">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8 backdrop-blur-sm bg-background/50 p-8 rounded-xl border shadow-lg">
          <div className="relative">
            <h1 className="text-[120px] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 animate-gradient">
              404
            </h1>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-primary/20 rounded-full opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-primary/10 rounded-full opacity-30" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title || "Oups ! Page non trouvée"}</h2>
            <p className="text-muted-foreground">
              {subtitle ||
                "La page que vous recherchez a peut-être été supprimée, son nom a changé, ou elle est temporairement indisponible."}
            </p>
          </div>

          {shouldRedirect && (
            <Button asChild size="lg" className="group relative overflow-hidden">
              <Link to={redirection?.href || "/"} className="flex items-center gap-2">
                <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{redirection?.label || "Retour à l'accueil"}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
