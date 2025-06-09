import { BACKEND_ROUTES } from "@/contants/backend-routes/routes"
import { PedidoCreateDto } from "@/interfaces/orders/pedido.interface"
import type { Payment, PaymentRequest } from "@/interfaces/payment/payments.interface"
import { query } from "@/lib/api/server/strapi"

const BASE_ENDPOINT_PEDIDOS: string = BACKEND_ROUTES.PEDIDOS
const BASE_ENDPOINT_PAYMENTS: string = BACKEND_ROUTES.PAYMENTS

export function createPayment(data: PaymentRequest, userId?: string, userEmail?: string): Promise<Payment | null> {
  // Sanitizar los datos
  const sanitizedRequest = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      description:
        typeof item.description === "string"
          ? item.description
          : Array.isArray(item.description)
            ? `${item.title} - Producto`
            : `${item.title} - Producto`,
    })),
  }

  // Validar campos requeridos
  if (
    !sanitizedRequest.currency ||
    !sanitizedRequest.description ||
    !sanitizedRequest.callbackUrl ||
    !sanitizedRequest.provider ||
    !sanitizedRequest.items ||
    sanitizedRequest.items.length === 0
  ) {
    return Promise.reject(new Error("Todos los campos son requeridos"))
  }

  // Validar que cada item tenga los campos requeridos
  const invalidItems = sanitizedRequest.items.filter(
    (item) => !item.id || !item.title || !item.description || item.quantity <= 0 || item.unitPrice <= 0,
  )

  if (invalidItems.length > 0) {
    return Promise.reject(
      new Error(
        `Algunos productos tienen datos inválidos: ${invalidItems.map((item) => item.title || item.id).join(", ")}`,
      ),
    )
  }

  // Calcular el total de los items para verificar
  const calculatedTotal = sanitizedRequest.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  // Verificar si el total calculado coincide con el total proporcionado (si existe)
  if (sanitizedRequest.totalAmount && Math.abs(calculatedTotal - sanitizedRequest.totalAmount) > 0.01) {
    console.warn(
      `Advertencia: El total calculado (${calculatedTotal.toFixed(2)}) no coincide con el total proporcionado (${sanitizedRequest.totalAmount.toFixed(2)})`,
    )
  }

  // Usar los datos sanitizados en la llamada a la API
  return query<Payment>(BASE_ENDPOINT_PAYMENTS, {
    method: "POST",
    body: sanitizedRequest,
    customerId: userId,
    customerEmail: userEmail,
  })
    .then((res) => {
      if( !res ) {
        return null;
      }
      return res;
    })
    .catch((error) => {
      console.error("Error al crear el request del pago:", error);
      throw new Error("Fallo al crear el request del pago");
    })
}

export function createPedido(data:PedidoCreateDto): Promise<Payment | null> {
  return query<Payment>(`${BASE_ENDPOINT_PEDIDOS}`, {
    method: "POST",
    body: data,
  })
    .then((res) => {
      if( !res ) {
        return null;
      }
      return res
    })
    .catch((error) => {
      console.error("Error al crear Pedido", error)
      throw new Error("Fallo al crear Pedido")
    })
}