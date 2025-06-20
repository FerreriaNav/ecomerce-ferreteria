"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/products-cart.store"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CartStep() {
  const { cart, loadCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore()

  useEffect(() => {
    loadCart()
  }, [loadCart])

  if (cart.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
        <Button asChild>
          <Link href="/">Continuar comprando</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {cart.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Link href={`/producto/${item.slug}`} className="shrink-0 cursor-pointer">
                <Image
                  src={item.coverUrl || "/imgs/products/default-img.png"}
                  alt={item.nombre}
                  width={80}
                  height={80}
                  className="rounded-md border object-cover"
                />
              </Link>
              <Link href={`/producto/${item.slug}`} className="flex-1 space-y-1 cursor-pointer">
                <h3 className="font-medium">{item.nombre}</h3>
                {/* {(() => {
                  const { finalPrice } = getPrecioConDescuento(item.inventario, item.descuento)
                  const priceTotal = (finalPrice || 0) * item.quantity

                  return (
                    <>
                      <p className="text-sm text-muted-foreground">
                        ${finalPrice?.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-sm font-medium">Total: ${priceTotal.toFixed(2)}</p>
                    </>
                  )
                })()} */}
                 <p className="text-sm font-medium">Cantidad: {item.quantity}</p>
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => decreaseQuantity(item.id)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => increaseQuantity(item.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
