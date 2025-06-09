"use client";

import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import type { Address } from "@/interfaces/directions/directions.interface";
import { Button } from "@/components/ui/button";
import CartStep from "./step-1/cart-step";
import { AddressStep } from "./step-2/address-step";
import { PaymentStep } from "./step-3/payment-step";
import { useSearchParams } from "next/navigation";
import { CheckoutStepper } from "./checkout-stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/products-cart.store";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
// import { useConfigStore } from "@/store/config-pago.store";
import { showToastAlert } from "@/components/ui/altertas/toast";
import { ProductoSeleccionadoInput } from "@/interfaces/orders/pedido.interface";
import { createPedido } from "@/services/payments/payments-services";
import { Payment } from "@/interfaces/payment/payments.interface";
import { usePedidoStore } from "@/store/pedido.store";

interface BasketGridProps {
  session: Session;
  addresses: Address[];
}

export function BasketGrid({ session, addresses }: BasketGridProps) {
  const searchParams = useSearchParams();
  const initialStep = Number.parseInt(searchParams.get("step") || "1", 10);
  const [step, setStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);

  const { getCartSummary, cart } = useCartStore();

  const {
    // impuestos, envio, finalAmount
    subtotal,
    total,
  } = getCartSummary();

  const { pedido, setProductos, setCliente, resetPedido } = usePedidoStore();

  const handleFinalizarPago = async () => {
    setIsLoading(true);

    const provider = pedido.provider; // Ya está seteado por el PaymentStep
    const clienteId = session?.user?.user?.id;
    const products: ProductoSeleccionadoInput[] = cart.map((item) => ({
      producto: +item.id,
      cantidad: item.quantity,
    }));
    if (!provider || !clienteId) {
      showToastAlert({
        title: "Información incompleta",
        text: "Asegúrate de seleccionar un método de pago.",
        icon: "warning",
        position: "top-end",
        toast: true,
      });
      return;
    }

    setCliente(clienteId);
    setProductos(products);
    console.log(pedido);

    const payment: Payment | null = await createPedido({
      ...pedido,
      cliente: clienteId,
      productosSeleccionados: products,
      provider,
    });

    if (payment) {
      window.open(payment.redirectUrl);
      resetPedido();
    } else {
      showToastAlert({
        title: "Error al procesar el pago",
        text: "Ocurrió un error al crear el pago. Por favor, intenta nuevamente.",
        icon: "error",
        position: "top-end",
        toast: true,
      });
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    window.history.replaceState(null, "", url.toString());
  }, [step]);

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CartStep />;
      case 2:
        return (
          session.user?.user.documentId && (
            <AddressStep
              userId={session.user?.user.documentId}
              addresses={addresses}
            />
          )
        );
      case 3:
        return <PaymentStep />;
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
              <Button className="cursor-pointer" onClick={handleNext}>
                {step === 1 ? "Continuar a dirección" : "Continuar a pago"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="cursor-pointer"
                onClick={handleFinalizarPago}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finalizar pago
              </Button>
            )}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
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
                  <span>costos de envio extras</span>
                  {/* <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span> */}
                </div>
                {/* <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div> */}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
