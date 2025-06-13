import type { PedidoCreateDto } from "@/interfaces/orders/pedido.interface"
import type { QuoteType } from "@/store/pedido.store"

// Define a type for the quote response
interface Cotizacion {
  id: string
  cliente: number | null;
  productos: Array<{
    id: number
    cantidad: number
    precio: number
  }>
  total: number
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA"
  fechaCreacion: string
  fechaExpiracion: string
  tipo: QuoteType
}

// Create a function to generate quotes
export async function createCotizacion(pedido: PedidoCreateDto & { quoteType: QuoteType }): Promise<Cotizacion | null> {
  try {
    // Here you would make an API call to your backend
    // For now, we'll simulate a successful response

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock response
    const cotizacion: Cotizacion = {
      id: `COT-${Date.now()}`,
      cliente: pedido.cliente,
      productos: pedido.productosSeleccionados.map((p) => ({
        id: p.producto,
        cantidad: p.cantidad,
        precio: 100, // Mock price
      })),
      total: pedido.productosSeleccionados.reduce((acc, p) => acc + p.cantidad * 100, 0),
      estado: "PENDIENTE",
      fechaCreacion: new Date().toISOString(),
      fechaExpiracion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      tipo: pedido.quoteType,
    }

    return cotizacion
  } catch (error) {
    console.error("Error creating quote:", error)
    return null
  }
}
