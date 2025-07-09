"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  DollarSign,
  Info,
  FileText,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  type Cotizacion,
  EstatusCotizacion,
  MetodoPago,
} from "@/interfaces/cotizaciones/cotizacion.interface";
import { IMG_DEFAULT } from "../../contants/img/img-default";

interface CotizacionItemProps {
  cotizacion: Cotizacion;
}

export function QuotesItem({ cotizacion }: CotizacionItemProps) {
  // Función para obtener el icono según el estado de la cotización
  const getStatusIcon = (estatus: EstatusCotizacion) => {
    switch (estatus) {
      case EstatusCotizacion.PENDIENTE:
        return <Clock className="h-4 w-4" />;
      case EstatusCotizacion.PAGADA:
        return <CheckCircle className="h-4 w-4" />;
      case EstatusCotizacion.FINALIZADA:
        return <CheckCircle className="h-4 w-4" />;
      case EstatusCotizacion.CANCELADA:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Función para obtener el color de la badge según el estado
  const getStatusColor = (estatus: EstatusCotizacion): string => {
    switch (estatus) {
      case EstatusCotizacion.PENDIENTE:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case EstatusCotizacion.PAGADA:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case EstatusCotizacion.FINALIZADA:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      case EstatusCotizacion.CANCELADA:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Función para obtener el icono del método de pago
  const getPaymentMethodIcon = (metodo: MetodoPago) => {
    switch (metodo) {
      case MetodoPago.TRANSFERENCIA:
        return <CreditCard className="h-3 w-3" />;
      case MetodoPago.EFECTIVO:
        return <DollarSign className="h-3 w-3" />;
      case MetodoPago.DEPOSITO:
        return <CreditCard className="h-3 w-3" />;
      default:
        return <DollarSign className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${getStatusColor(
                cotizacion.estatus
              )}`}
            >
              {getStatusIcon(cotizacion.estatus)}
            </div>
            <div>
              <h3 className="font-semibold">Cotización #{cotizacion.id}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <User className="h-3 w-3" />
                {cotizacion.cliente.name} {cotizacion.cliente.lastName}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`capitalize ${getStatusColor(
              cotizacion.estatus
            )} border-0 flex gap-2 p-1.5`}
          >
            {getStatusIcon(cotizacion.estatus)}
            <span>{cotizacion.estatus.toLowerCase()}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-1">
              {getPaymentMethodIcon(cotizacion.metodoPago)}
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Método de pago
              </p>
              <p className="text-sm capitalize">
                {cotizacion.metodoPago.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Productos
              </p>
              <p className="text-sm">
                {cotizacion.productos.length}{" "}
                {cotizacion.productos.length === 1 ? "artículo" : "artículos"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total
              </p>
              <p className="text-sm font-semibold">
                {cotizacion?.total ?formatCurrency(cotizacion?.total):"Pendiente"}
              </p>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="items" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium cursor-pointer">
              Ver detalles de la cotización
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {/* Productos */}
                <div className="space-y-3">
                  {cotizacion?.productos?.map(
                    ({ producto,cantidad,precioUnitario}) =>
                      producto && (
                        <div
                          key={`${producto?.documentId}-${cotizacion.id}`}
                          className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={producto?.coverUrl || IMG_DEFAULT.IMG}
                              alt={producto?.nombre}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{producto?.nombre}</p>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <Info className="h-3 w-3" />
                                    <span className="sr-only">
                                      Detalles del producto
                                    </span>
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="flex justify-between space-x-4">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold">
                                        {producto?.nombre}
                                      </h4>
                                      {/* <p className="text-sm">Precio unitario: {formatCurrency(producto)}</p> */}
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                          {cantidad} × {precioUnitario ? formatCurrency(precioUnitario) : "Pendiente"}
                        </p>
                          </div>
                          {/* <div className="text-right">
                        <p className="font-semibold">{formatCurrency(producto.cantidad * producto.precioDescuento)}</p>
                      </div> */}
                        </div>
                      )
                  )}
                </div>

                {/* Notas */}
                {(cotizacion?.notaCliente || cotizacion?.notaVendedor) && (
                  <div className="space-y-3">
                    {cotizacion.notaCliente && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Nota del cliente
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          {cotizacion.notaCliente}
                        </p>
                      </div>
                    )}

                    {cotizacion.notaVendedor && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            Nota del vendedor
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          {cotizacion.notaVendedor}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-end pt-2">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg w-full sm:w-auto sm:min-w-[200px]">
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span>Total:</span>
                      <span>
                        {cotizacion.total != null
                          ? formatCurrency(cotizacion.total)
                          : "No disponible"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
