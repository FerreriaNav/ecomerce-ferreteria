import type { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface"
import { QuotesItem } from "./quote-item"

interface CotizacionListProps {
  cotizaciones: Cotizacion[]
}

export function QuotesList({ cotizaciones }: CotizacionListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {cotizaciones.map((cotizacion) => (
        <QuotesItem key={cotizacion.id} cotizacion={cotizacion} />
      ))}
    </div>
  )
}
