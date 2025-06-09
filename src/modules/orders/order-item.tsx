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
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { formatCurrency } from "@/lib/formatCurrency";
import { Pedido, PedidosStatus } from "@/interfaces/orders/pedido.interface";

interface OrderItemProps {
  pedido: Pedido;
}

export function OrderItem({ pedido }: OrderItemProps) {
  
  // Función para obtener el icono según el estado del pedido
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case PedidosStatus.PENDIENTE:
        return <Clock className="h-4 w-4" />;
      case PedidosStatus.ENVIADO:
        return <Truck className="h-4 w-4" />;
      case PedidosStatus.ENTREGADO:
      case PedidosStatus.PAGADO:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Función para obtener el color de la badge según el estado
  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case PedidosStatus.PENDIENTE:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case PedidosStatus.ENVIADO:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case PedidosStatus.ENTREGADO:
      case PedidosStatus.PAGADO:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {pedido.estado && (
              <div
                className={`p-2 rounded-full ${getStatusColor(pedido.estado)}`}
              >
                {getStatusIcon(pedido.estado)}
              </div>
            )}
            <div>
              {pedido.uuid && (
                <h3 key={pedido.uuid} className="font-semibold">
                  {pedido.uuid}
                </h3>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />{" "}
                {pedido.fechaPedido
                  ? formatDate(pedido.fechaPedido?.toString())
                  : "fecha no disponible"}
              </p>
            </div>
          </div>
          {pedido.estado && (
            <Badge
              key={pedido.estado}
              variant="outline"
              className={`capitalize ${getStatusColor(
                pedido.estado
              )} border-0 flex gap-2 p-1.5`}
            >
              {getStatusIcon(pedido.estado)}
              <p>{pedido.estado}</p>
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dirección
              </p>
              {pedido.informacionEnvio.esLocal ? (
                 <p className="text-sm">Entrega en Sucursal</p>
              ) : (
                <p className="text-sm">
                  {pedido.informacionEnvio?.direccion?.calle},{" "}
                  {pedido.informacionEnvio?.direccion?.numeroExterior} -{" "}
                  <span className="italic uppercase text-xs">cp:</span>{" "}
                  {pedido.informacionEnvio?.direccion?.codigoPostal},{" "}
                  {pedido.informacionEnvio?.direccion?.ciudad}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Productos
              </p>
              <p className="text-sm">
                {pedido.metadata.productos.length}{" "}
                {pedido.metadata.productos.length === 1
                  ? "artículo"
                  : "artículos"}
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
                {pedido.pagos.map((pago) => formatCurrency(pago.monto))}
              </p>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="items" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium cursor-pointer">
              Ver detalles del pedido
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {pedido.metadata.productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          producto.coverUrl || "/imgs/products/default-img.png"
                        }
                        alt={producto.nombre}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{producto.nombre}</p>
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
                                  {producto.nombre}
                                </h4>
                                <p className="text-sm">
                                  Precio unitario:{" "}
                                  {formatCurrency(producto.precioDescuento)}
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {producto.cantidad} ×{" "}
                        {formatCurrency(producto.precioDescuento)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(
                          producto.cantidad * producto.precioDescuento
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg w-full sm:w-auto sm:min-w-[200px]">
                    <div className="flex justify-between font-bold mt-2 pt-2 dark:border-slate-700">
                      <span>Total:</span>
                      {pedido.pagos && <span>{pedido.metadata.total}</span>}
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
