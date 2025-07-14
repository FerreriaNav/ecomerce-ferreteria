"use client"

import { FaWhatsapp } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { useCatalogStore } from "@/store/catalog-ecommerce.store"

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export function WhatsAppButton({
  message = "Hola, me gustaría obtener más información",
  className,
}: WhatsAppButtonProps) {
  const info = useCatalogStore((state) => state.infoEcommerce)

  // Verificamos si existe el número
  if (!info?.whatsapp) return null

  // Eliminamos cualquier carácter no numérico del número
  const cleanPhoneNumber = info.whatsapp.replace(/\D/g, "")

  // Creamos la URL completa con mensaje
  const whatsappUrl = `https://wa.me/52${cleanPhoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2",
        className,
      )}
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="sr-only">Contactar por WhatsApp</span>
    </a>
  )
}
