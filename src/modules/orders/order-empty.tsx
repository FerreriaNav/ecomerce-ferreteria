import { Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderEmptyProps {
  estado?: string
}

export function OrderEmpty({ estado }: OrderEmptyProps) {
  const getMessage = () => {
    if (!estado || estado === "todos") {
      return "No has realizado ningún pedido todavía."
    }

    return `No tienes pedidos en estado "${estado}".`
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
        {!estado || estado === "todos" ? (
          <ShoppingCart className="h-12 w-12 text-slate-400" />
        ) : (
          <Package className="h-12 w-12 text-slate-400" />
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">Sin pedidos</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{getMessage()}</p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
        <Link href="/">Explorar productos</Link>
      </Button>
    </div>
  )
}