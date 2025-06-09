
/**
 * Genera una descripción detallada con los productos del carrito.
 * Si la descripción supera el límite, se usa una versión corta predeterminada.
 * @param items Lista de productos del carrito
 * @returns Descripción para el proveedor de pago
 */
import type { PaymentItem } from "@/interfaces/payment/payments.interface"

const MAX_DESCRIPTION_LENGTH = 200
const DEFAULT_DESCRIPTION = "Compra de productos realizada en la tienda"
export function generatePaymentDescription(items: PaymentItem[]): string {
  if (!items || items.length === 0) {
    return DEFAULT_DESCRIPTION
  }

  const productDescriptions = items
    .filter((item) => item.id !== "tax" && item.id !== "shipping")
    .map((item) => `(${item.quantity}x) ${item.title}`)
    .join(", ")

  const fullDescription = `${DEFAULT_DESCRIPTION}: ${productDescriptions}`

  return fullDescription.length <= MAX_DESCRIPTION_LENGTH
    ? fullDescription
    : DEFAULT_DESCRIPTION
}
