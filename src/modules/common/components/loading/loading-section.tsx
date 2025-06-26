import { Loader2, ShoppingCart } from "lucide-react"

interface LoadingSectionProps {
  message?: string
  className?: string
}

export function LoadingSection({ message = "Cargando...", className = "" }: LoadingSectionProps) {
  return (
    <div className={`flex items-center justify-center min-h-[70vh] ${className}`}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/20" />
          <Loader2 className="h-8 w-8 animate-spin text-primary absolute top-2 left-2" />
        </div>
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  )
}
