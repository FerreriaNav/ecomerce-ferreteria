"use client"

import { BasketGrid } from "@/modules/cart/basket"
import { getUserDirections } from "@/services/directions/directions-services"
import { useSession } from "next-auth/react"
import { useInfoEcommerceStore } from "@/store/info-ecommerce.store"
import { useEffect, useState } from "react"
import type { DataResponse } from "@/interfaces/data/response.interface"
import type { Address } from "@/interfaces/directions/directions.interface"
import { WelcomeSection } from "@/modules/common/components/unidentified/unidentified-section"
import { LoadingSection } from "@/modules/common/components/loading/loading-section"

//respaldo json
import respaldo from "@/contants/json/template-datos-ecommerce.json";

export default function CartPage() {
  const { data: session, status } = useSession()
  const { infoEcommerce } = useInfoEcommerceStore()

  const [address, setAddress] = useState<DataResponse<Address[]> | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userDocumentId = session?.user?.user.documentId

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userDocumentId) return

      setIsLoadingAddresses(true)
      setError(null)

      try {
        const res = await getUserDirections(userDocumentId)
        setAddress(res)
      } catch (err) {
        setError("Error al cargar las direcciones")
        console.error("Error fetching addresses:", err)
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [userDocumentId])

  // Loading session
  if (status === "loading") {
    return <LoadingSection message="Verificando sesión..." />
  }

  // User not authenticated
  if (!userDocumentId) {
    return (
      <WelcomeSection

        title={`Bienvenido a ${infoEcommerce?.nombre ?? respaldo.infoEcommerce.nombre}`}
        description="Descubre asombrosos productos a excelentes precios. ¡Inicia sesión para comenzar a comprar!"
      />
    )
  }

  // Loading addresses
  if (isLoadingAddresses) {
    return <LoadingSection message="Cargando tus direcciones..." />
  }

  // Error loading addresses
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="text-red-500 mb-4">
            <p className="text-xl font-semibold">¡Oops! Algo salió mal</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  // No addresses found
  // if (!address?.data || address.data.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
  //         <h2 className="text-2xl font-bold mb-4">No tienes direcciones registradas</h2>
  //         <p className="text-muted-foreground mb-6">Agrega una dirección de entrega para continuar con tu compra</p>
  //         {/* Aquí podrías agregar un botón para agregar dirección */}
  //       </div>
  //     </div>
  //   )
  // }

  // Success: render cart with addresses
  return <BasketGrid user={session?.user?.user} addresses={address?.data ?? []} />
}
