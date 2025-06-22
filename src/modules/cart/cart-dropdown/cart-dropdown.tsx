"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Trash } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem, useCartStore } from "@/store/products-cart.store";
import {
  getPrecioConDescuento,
  getPrecioMinimoVariantes,
} from "@/lib/price-descuento";
import { formatCurrency } from "@/lib/formatCurrency";
import { ProductType } from "@/interfaces/products/products.interface";
import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";
import { useSession } from "next-auth/react";

const CartContent = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCartStore();
  const { data: session } = useSession();
  // Calcular el total del carrito
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cartTotal = cart.reduce((total, item) => {
    const { finalPrice } = getPrecioConDescuento(
      item.inventario,
      item.descuento
    );
    if (finalPrice !== null) {
      return total + finalPrice * item.quantity;
    }
    return total;
  }, 0);

  // modificalo para que multiplique por la cantidad
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderPrecio = (producto: CartItem) => {
    if (!session && ECOMMERCE_PRIVADO) {
      return (
        <span className="text-sm text-muted-foreground">
          Inicia sesión para ver el precio
        </span>
      );
    }

    const precioBase = producto.inventario?.precioVenta || 0;
    const { finalPrice: precioFinal, hasDiscount: tieneDescuento } =
      getPrecioConDescuento(producto.inventario, producto.descuento);
    const precioMinimo = getPrecioMinimoVariantes(producto);
    const cantidad = producto.quantity;

    if (
      producto.tipo === ProductType.SIMPLE ||
      producto.tipo === ProductType.VARIANT
    ) {
      if (precioFinal !== null && precioFinal !== undefined) {
        return (
          <div className="flex flex-col items-start">
            <span className="font-bold text-primary">
              {formatCurrency(precioFinal * cantidad)}
            </span>
            {tieneDescuento && (
              <span className="text-xs line-through text-muted-foreground">
                {formatCurrency(precioBase * cantidad)}
              </span>
            )}
          </div>
        );
      }
      return (
        <span className="text-sm text-muted-foreground">No disponible</span>
      );
    }

    if (producto.tipo === "base") {
      if (precioMinimo !== null && precioMinimo !== undefined) {
        return (
          <span className="font-bold text-primary">
            Desde {formatCurrency(precioMinimo)}
          </span>
        );
      }
      return (
        <span className="text-sm text-muted-foreground">No disponible</span>
      );
    }

    return <span className="text-sm text-muted-foreground">No disponible</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Mi Carrito</h4>
        <span className="text-sm text-muted-foreground">
          {cart.length} artículos
        </span>
      </div>

      <Separator />

      {cart.length > 0 ? (
        <div className="max-h-[250px] overflow-auto space-y-3">
          {cart.map((item) => {
            return (
              <div key={item.id} className="flex items-center gap-3">
                <Image
                  src={item.coverUrl || "/imgs/products/default-img.png"}
                  alt={item.nombre}
                  width={50}
                  height={50}
                  className="rounded-md border"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{item.nombre}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {/* {renderPrecio(item)} */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-muted-foreground">Tu carrito está vacío</p>
        </div>
      )}

      {cart.length > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            {/* <span>Total:</span>
            {!session && ECOMMERCE_PRIVADO ? (
              `inicia sesion `
            ) : (
              <span>${cartTotal.toFixed(2)}</span>
            )} */}
            <span>Generar Cotizacion</span>
          </div>
        </>
      )}

      <Button asChild className="w-full">
        <Link href="/carrito">Ir al carrito</Link>
      </Button>
    </div>
  );
};

export default function CartDropdown() {
  const [isMobile, setIsMobile] = useState(false);
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const CartIcon = () => (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {cart.length > 0 && (
        <span className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          {cart.length}
        </span>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <CartIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4">
          <CartContent />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <HoverCard openDelay={0} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartIcon />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" align="end">
        <CartContent />
      </HoverCardContent>
    </HoverCard>
  );
}
