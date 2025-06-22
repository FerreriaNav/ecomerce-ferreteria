import type { ProductoSeleccionadoInput, InformacionEnvioCreateDto } from "@/interfaces/orders/pedido.interface"

// Tipo específico para crear cotizaciones
export interface CotizacionCreateDto {
  id: number
  productos: ProductoSeleccionadoInput[]
  total?: number
  estatus: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA"
  notaCliente?: string
  notaVendedor?: string
  informacionEnvio?: InformacionEnvioCreateDto | null
}

// Mantén tu interfaz Cotizacion existente para las respuestas
export interface Cotizacion {
  id?: string
  documentId?: string
  productos: Products[]
  total: number
  estatus: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA"
  notaCliente?: string
  notaVendedor?: string
  informacionEnvio?: InformacionEnvioCreateDto | null
  cliente?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export interface Products {
  id: string
  nombre: string
  slug: string
  descripcion: string
  // ... otros campos del producto
}
