"use client"

import { Button } from "@/components/ui/button"
import { ModalAuth } from "@/modules/common/components/auth/modalAuth"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

interface WelcomeSectionProps {
  title: string
  description?: string
  showAuthModal?: boolean
  showBrowseButton?: boolean
  className?: string
}

export function WelcomeSection({
  title,
  description,
  showAuthModal = true,
  showBrowseButton = true,
  className = "",
}: WelcomeSectionProps) {
  const defaultDescription = "Descubre asombrosos productos a excelentes precios. Comienza a comprar ahora!"

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="mb-6 p-4 rounded-full bg-primary/10">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>

        <p className="text-xl mb-8 max-w-md text-muted-foreground">{description || defaultDescription}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          {showAuthModal && <ModalAuth />}
          {showBrowseButton && (
            <Button variant="outline" size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Buscar Productos
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
