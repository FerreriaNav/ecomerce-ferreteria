"use client"

import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import type { Address } from "@/interfaces/directions/directions.interface"
import { Button } from "@/components/ui/button"
import CartStep from "./step-1/cart-step"
import { AddressStep } from "./step-2/address-step"
import { useSearchParams } from "next/navigation"
import { CheckoutStepper } from "./checkout-stepper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/products-cart.store"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { showToastAlert } from "@/components/ui/altertas/toast"
import type { ProductoSeleccionadoInput } from "@/interfaces/orders/pedido.interface"
import { usePedidoStore } from "@/store/pedido.store"
import { QuoteStep } from "./step-3/quote-step"
import { createCotizacion } from "@/services/quote/quote"

interface BasketGridProps {
  session: Session
  addresses: Address[]
}

export function BasketGrid({ session, addresses }: BasketGridProps) {
  const searchParams = useSearchParams()
  const initialStep = Number.parseInt(searchParams.get("step") || "1", 10)
  const [step, setStep] = useState(initialStep)
  const [isLoading, setIsLoading] = useState(false)

  const { getCartSummary, cart } = useCartStore()

  const { subtotal, total } = getCartSummary()

  const { pedido, setProductos, setCliente, resetPedido } = usePedidoStore()

  const handleGenerarCotizacion = async () => {
    setIsLoading(true)

    const quoteType = pedido.quoteType // Ya está seteado por el QuoteStep
    const clienteId = session?.user?.user?.id
    const products: ProductoSeleccionadoInput[] = cart.map((item) => ({
      producto: +item.id,
      cantidad: item.quantity,
    }))

    if (!quoteType || !clienteId) {
      showToastAlert({
        title: "Información incompleta",
        text: "Asegúrate de seleccionar un tipo de cotización.",
        icon: "warning",
        position: "top-end",
        toast: true,
      })
      setIsLoading(false)
      return
    }

    setCliente(clienteId)
    setProductos(products)
    console.log(pedido)

    try {
      // Assuming you'll create this service function
      const cotizacion = await createCotizacion({
        ...pedido,
        cliente: clienteId,
        productosSeleccionados: products,
        quoteType,
      })

      if (cotizacion) {
        showToastAlert({
          title: "Cotización generada",
          text: "Tu cotización ha sido generada exitosamente.",
          icon: "success",
          position: "top-end",
          toast: true,
        })

        // You might want to redirect to a quote details page
        // window.location.href = `/cotizaciones/${cotizacion.id}`
        resetPedido()
      } else {
        throw new Error("No se pudo generar la cotización")
      }
    } catch (error) {
      showToastAlert({
        title: "Error al generar cotización",
        text: "Ocurrió un error al crear la cotización. Por favor, intenta nuevamente.",
        icon: "error",
        position: "top-end",
        toast: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("step", step.toString())
    window.history.replaceState(null, "", url.toString())
  }, [step])

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1)
  }

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CartStep />
      case 2:
        return (
          session.user?.user.documentId && <AddressStep userId={session.user?.user.documentId} addresses={addresses} />
        )
      case 3:
        return <QuoteStep />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Carrito de Compras</h1>
        <CheckoutStepper currentStep={step} setCurrentStep={setStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            {step === 1 ? (
              <Button className="cursor-pointer" variant="outline" asChild>
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Seguir comprando
                </Link>
              </Button>
            ) : (
              <Button className="cursor-pointer" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {step === 2 ? "Volver al carrito" : "Volver a la dirección"}
              </Button>
            )}

            {step < 3 ? (
              <Button className="cursor-pointer" onClick={handleNext}>
                {step === 1 ? "Continuar a dirección" : "Continuar a cotización"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="cursor-pointer" onClick={handleGenerarCotizacion} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar cotización
              </Button>
            )}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de cotización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {subtotal > total && (
                  <div className="flex justify-between">
                    <span>Descuento</span>
                    <span>- ${(subtotal - total).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>A consultar</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total estimado</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta cotización es válida por 15 días. Los precios pueden variar según disponibilidad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
