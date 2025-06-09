import { Pedido } from "@/interfaces/orders/pedido.interface"
import { OrderItem } from "./order-item"

interface OrderListProps {
  pedidos: Pedido[]
}

export function OrderList({ pedidos }: OrderListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {pedidos.map((pedido) => (
        <OrderItem key={pedido.id} pedido={pedido} />
      ))}
    </div>
  )
}
