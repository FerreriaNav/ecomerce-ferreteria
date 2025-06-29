"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/interfaces/directions/directions.interface";
import { Button } from "@/components/ui/button";
import CartStep from "./step-1/cart-step";
import { AddressStep } from "./step-2/address-step";
import { useSearchParams } from "next/navigation";
import { CheckoutStepper } from "./checkout-stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/products-cart.store";
import { ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { showToastAlert } from "@/components/ui/altertas/toast";
import type { ProductoSeleccionadoInput } from "@/interfaces/orders/pedido.interface";
import { QuoteStep } from "./step-3/quote-step";
import { createCotizacion } from "@/services/quote/quote-services";
import {
  CotizacionCreateDto,
  EstatusCotizacion,
} from "@/interfaces/cotizaciones/cotizacion.interface";
import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";
import { User } from "@/interfaces/auth/user.interface";
import { useCotizacionStore } from "@/store/cotizacion.store";

interface BasketGridProps {
  user: User | undefined;
  addresses: Address[];
}

export function BasketGrid({ user }: BasketGridProps) {
  const searchParams = useSearchParams();
  const initialStep = Number.parseInt(searchParams.get("step") || "1", 10);
  const [step, setStep] = useState(initialStep);

  const { cart } = useCartStore();

  const {
    cotizacion,
    setProductos,
    setCliente,
    loading,
    success,
    setLoading,
    setError,
    setSuccess,
    resetTemporaryStates,
    resetCotizacion
  } = useCotizacionStore();

  // Resetear estados temporales cuando el componente se monta
  useEffect(() => {
    resetTemporaryStates();
  }, [resetTemporaryStates]);

  const handleGenerarCotizacion = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Resetear success al iniciar nueva cotización

    const products: ProductoSeleccionadoInput[] = cart.map((item) => ({
      producto: item.documentId,
      cantidad: item.quantity,
    }));

    if (!user?.id) {
      setError("No se pudo obtener la información del cliente");
      setLoading(false);
      return;
    }

    if (!cotizacion.metodoPago) {
      setError("Por favor selecciona un método de pago");
      setLoading(false);
      return;
    }

    setCliente(user.documentId);
    setProductos(products);

    try {
      const cotizacionData: CotizacionCreateDto = {
        productos: products,
        estatus: EstatusCotizacion.PENDIENTE,
        cliente: user.documentId,
        metodoPago: cotizacion?.metodoPago,
        notaCliente: cotizacion.notaCliente || undefined,
        informacionEnvio: cotizacion.informacionEnvio, // Ahora es compatible
      };

      const cotizacionCreated = await createCotizacion(
        cotizacionData,
        user.documentId
      );

      if (cotizacionCreated) {
        resetCotizacion()
        showToastAlert({
          title: "Cotización generada",
          text: "Tu cotización ha sido generada exitosamente.",
          icon: "success",
          position: "top-end",
          toast: true,
        });

        setSuccess(true);
        // Reset pedido after successful creation if needed
        // resetPedido()
      } else {
        throw new Error("No se pudo generar la cotización");
      }
    } catch (error) {
      console.error(error);
      setError(
        "Ocurrió un error al crear la cotización. Por favor, intenta nuevamente."
      );
      showToastAlert({
        title: "Error al generar cotización",
        text: "Ocurrió un error al crear la cotización. Por favor, intenta nuevamente.",
        icon: "error",
        position: "top-end",
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    window.history.replaceState(null, "", url.toString());
  }, [step]);

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      // Resetear estados temporales al cambiar de paso
      if (step === 3) {
        resetTemporaryStates();
      }
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
      // Resetear estados temporales al entrar al paso 3
      if (step === 2) {
        resetTemporaryStates();
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CartStep />;
      case 2:
        return <AddressStep user={user} />;
      case 3:
        return <QuoteStep />;
      default:
        return null;
    }
  };

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
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={handleBack}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {step === 2 ? "Volver al carrito" : "Volver a la dirección"}
              </Button>
            )}

            {step < 3 ? (
              <Button
                disabled={
                  (step === 1 && cart.length === 0) ||
                  (step == 2 &&
                    !cotizacion.informacionEnvio?.esLocal &&
                    !cotizacion.informacionEnvio?.direccion)
                }
                className="cursor-pointer"
                onClick={handleNext}
              >
                {step === 1
                  ? "Continuar a dirección"
                  : "Continuar a cotización"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : success ? (
              // Mostrar botón "Mirar cotización" cuando la cotización se haya generado exitosamente
              <Button className="cursor-pointer" asChild>
                <Link href={FRONTEND_ROUTES.QUOTES}>
                  <Eye className="mr-2 h-4 w-4" />
                  Mirar cotización
                </Link>
              </Button>
            ) : (
              // Mostrar botón "Generar cotización" cuando no se haya generado aún
              <Button
                className="cursor-pointer"
                onClick={handleGenerarCotizacion}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                  <span>Envío</span>
                  <span>
                    {cotizacion.informacionEnvio?.costoEnvio
                      ? `$${cotizacion.informacionEnvio.costoEnvio.toFixed(2)}`
                      : "A consultar"}
                  </span>
                </div>
                <Separator />
                {cotizacion.metodoPago && (
                  <div className="flex justify-between">
                    <span>Método de pago</span>
                    <span className="capitalize">
                      {cotizacion.metodoPago.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
