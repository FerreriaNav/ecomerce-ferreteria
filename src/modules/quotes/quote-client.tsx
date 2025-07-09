"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import type { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface"
import { QuotesFilters } from "./quote-filters"
import { QuotesSkeleton } from "./quote-skeleton"
import { QuotesList } from "./quote-list"
import { QuotesEmpty } from "./quote-empty"

interface CotizacionesClientProps {
  initialQuotes: Cotizacion[]
}

export function QuotesClient({ initialQuotes }: CotizacionesClientProps) {
  const [cotizaciones] = useState<Cotizacion[]>(initialQuotes)
  const [filteredCotizaciones, setFilteredCotizaciones] = useState<Cotizacion[]>(initialQuotes)
  const [isLoading, setIsLoading] = useState(false)

  // Función para filtrar cotizaciones por estado
  const filterByStatus = (estatus: string | null) => {
    setIsLoading(true)

    // Simulamos una carga para mostrar el skeleton
    setTimeout(() => {
      if (!estatus || estatus === "todos") {
        setFilteredCotizaciones(cotizaciones)
      } else {
        setFilteredCotizaciones(cotizaciones.filter((cotizacion) => cotizacion.estatus === estatus.toUpperCase()))
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
            <FileText className="h-6 w-6 text-teal-600 dark:text-teal-300" />
          </div>
          <h1 className="text-3xl font-bold">Mis Cotizaciones</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6">
          <Tabs
            defaultValue="todos"
            className="w-full"
            onValueChange={(value) => filterByStatus(value === "todos" ? null : value)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="h-10">
                <TabsTrigger value="todos" className="px-4 hover:bg-muted hover:text-primary transition-colors cursor-pointer">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="pendiente" className="px-4 hover:bg-muted hover:text-primary transition-colors cursor-pointer">
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value="pagada" className="px-4 hover:bg-muted hover:text-primary transition-colors cursor-pointer">
                  Pagadas
                </TabsTrigger>
                {/* <TabsTrigger value="finalizada" className="px-4 hover:bg-muted hover:text-primary transition-colors cursor-pointer">
                  Finalizadas
                </TabsTrigger>
                <TabsTrigger value="cancelada" className="px-4 hover:bg-muted hover:text-primary transition-colors cursor-pointer">
                  Canceladas
                </TabsTrigger> */}
              </TabsList>

              <QuotesFilters />
            </div>

            <TabsContent value="todos" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <QuotesSkeleton />
                  <QuotesSkeleton />
                </div>
              ) : filteredCotizaciones.length > 0 ? (
                <QuotesList cotizaciones={filteredCotizaciones} />
              ) : (
                <QuotesEmpty />
              )}
            </TabsContent>

            <TabsContent value="pendiente" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <QuotesSkeleton />
                </div>
              ) : filteredCotizaciones.length > 0 ? (
                <QuotesList cotizaciones={filteredCotizaciones} />
              ) : (
                <QuotesEmpty estatus="pendiente" />
              )}
            </TabsContent>

            <TabsContent value="pagada" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <QuotesSkeleton />
                </div>
              ) : filteredCotizaciones.length > 0 ? (
                <QuotesList cotizaciones={filteredCotizaciones} />
              ) : (
                <QuotesEmpty estatus="pagada" />
              )}
            </TabsContent>

            <TabsContent value="finalizada" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <QuotesSkeleton />
                </div>
              ) : filteredCotizaciones.length > 0 ? (
                <QuotesList cotizaciones={filteredCotizaciones} />
              ) : (
                <QuotesEmpty estatus="finalizada" />
              )}
            </TabsContent>

            <TabsContent value="cancelada" className="mt-0">
              {isLoading ? (
                <div className="space-y-6">
                  <QuotesSkeleton />
                </div>
              ) : filteredCotizaciones.length > 0 ? (
                <QuotesList cotizaciones={filteredCotizaciones} />
              ) : (
                <QuotesEmpty estatus="cancelada" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
