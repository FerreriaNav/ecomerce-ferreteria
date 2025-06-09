"use client"

import { useState } from "react"
import { OrderList } from "./order-list"
import { OrderFilters } from "./order-filters"
import { OrderEmpty } from "./order-empty"
import { OrderSkeleton } from "./order-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag } from "lucide-react"
import { Pedido } from "@/interfaces/orders/pedido.interface"

interface OrdersClientProps {
  initialPedidos: Pedido[]
}

export function OrdersClient({ initialPedidos }: OrdersClientProps) {
  const [pedidos] = useState<Pedido[]>(initialPedidos)
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>(initialPedidos)
  const [isLoading, setIsLoading] = useState(false)

  // Función para filtrar pedidos por estado
  const filterByStatus = (estado: string | null) => {
    setIsLoading(true)

    // Simulamos una carga para mostrar el skeleton
    setTimeout(() => {
      if (!estado || estado === "todos") {
        setFilteredPedidos(pedidos)
      } else {
        setFilteredPedidos(pedidos.filter((pedido) => pedido.estado === estado))
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-teal-600 dark:text-teal-300" />
          </div>
          <h1 className="text-3xl font-bold">Mis Pedidos</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6">
          <Tabs
            defaultValue="todos"
            className="w-full"
            onValueChange={(value) => filterByStatus(value === "todos" ? null : value)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="h-10">
                <TabsTrigger value="todos" className="px-4 hover:bg-muted cursor-pointer">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="procesando" className="px-4 hover:bg-muted cursor-pointer">
                  Procesando
                </TabsTrigger>
                <TabsTrigger value="en camino" className="px-4 hover:bg-muted cursor-pointer">
                  En camino
                </TabsTrigger>
                <TabsTrigger value="entregado" className="px-4 hover:bg-muted cursor-pointer">
                  Entregados
                </TabsTrigger>
              </TabsList>

              <OrderFilters />
            </div>

            <TabsContent value="todos" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <OrderSkeleton />
                  <OrderSkeleton />
                </div>
              ) : filteredPedidos.length > 0 ? (
                <OrderList pedidos={filteredPedidos} />
              ) : (
                <OrderEmpty />
              )}
            </TabsContent>

            <TabsContent value="procesando" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <OrderSkeleton />
                </div>
              ) : filteredPedidos.length > 0 ? (
                <OrderList pedidos={filteredPedidos} />
              ) : (
                <OrderEmpty estado="procesando" />
              )}
            </TabsContent>

            <TabsContent value="en camino" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <OrderSkeleton />
                </div>
              ) : filteredPedidos.length > 0 ? (
                <OrderList pedidos={filteredPedidos} />
              ) : (
                <OrderEmpty estado="en camino" />
              )}
            </TabsContent>

            <TabsContent value="entregado" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <OrderSkeleton />
                </div>
              ) : filteredPedidos.length > 0 ? (
                <OrderList pedidos={filteredPedidos} />
              ) : (
                <OrderEmpty estado="entregado" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
