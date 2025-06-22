"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";
import {
  Products,
  ProductType,
} from "@/interfaces/products/products.interface";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  getPrecioConDescuento,
  getPrecioMinimoVariantes,
  isOfertaActiva,
} from "@/lib/price-descuento";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Products;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderPrecio = () => {
    if (!session && ECOMMERCE_PRIVADO) {
      return (
        <span className="text-sm text-muted-foreground">
          Inicia sesión para ver el precio
        </span>
      );
    }

    if (
      product.tipo === ProductType.SIMPLE ||
      product.tipo === ProductType.VARIANT
    ) {
      const { finalPrice, hasDiscount } = getPrecioConDescuento(
        product.inventario,
        product.descuento
      );

      return finalPrice !== null ? (
        <div className="flex flex-col items-start">
          <span className="font-bold text-primary">
            {formatCurrency(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.inventario!.precioVenta)}
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No disponible</span>
      );
    }

    if (product.tipo === ProductType.BASE) {
      const precioMin = getPrecioMinimoVariantes(product);

      return precioMin !== null ? (
        <span className="font-bold text-primary">
          desde {formatCurrency(precioMin)}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">No disponible</span>
      );
    }

    return <span className="text-sm text-muted-foreground">No disponible</span>;
  };

  return (
    <Link href={`/producto/${product.slug}`} className="w-full h-full">
      <Card className="h-full flex flex-col hover:cursor-pointer hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
        {isOfertaActiva(product.descuento) && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            ¡OFERTA!
          </div>
        )}

        <div className="relative bg-white aspect-square w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.coverUrl || "/placeholder.svg?height=300&width=300"}
            alt={product.nombre}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="p-4">
          <h3 className="font-semibold text-base line-clamp-3">
            {product.nombre}
          </h3>
        </CardHeader>

        {/* <CardFooter className="px-4 pb-4 pt-0 mt-auto flex justify-between items-center">
          {renderPrecio()}
        </CardFooter> */}
      </Card>
    </Link>
  );
}
