"use client";

import { Card } from "@/components/ui/card";
// import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";
import {
  Products,
  // ProductType,
} from "@/interfaces/products/products.interface";
// import { formatCurrency } from "@/lib/formatCurrency";
import {
  // getPrecioConDescuento,
  // getPrecioMinimoVariantes,
  isOfertaActiva,
} from "@/lib/price-descuento";
// import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

interface ProductCardHorizontalProps {
  product: Products;
}

export function ProductCardHorizontal({ product }: ProductCardHorizontalProps) {
  // const { data: session } = useSession();

  // const renderPrecio = () => {
  //   if (!session && ECOMMERCE_PRIVADO) {
  //     return (
  //       <span className="text-sm text-muted-foreground">
  //         Inicia sesión para ver el precio
  //       </span>
  //     );
  //   }

  //   if (
  //     product.tipo === ProductType.SIMPLE ||
  //     product.tipo === ProductType.VARIANT
  //   ) {
  //     const { finalPrice, hasDiscount } = getPrecioConDescuento(
  //       product.inventario,
  //       product.descuento
  //     );

  //     return finalPrice !== null ? (
  //       <div className="flex flex-col items-start">
  //         <span className="font-bold text-primary text-xl">
  //           {formatCurrency(finalPrice)}
  //         </span>
  //         {hasDiscount && (
  //           <span className="text-sm text-muted-foreground line-through">
  //             {formatCurrency(product.inventario!.precioVenta)}
  //           </span>
  //         )}
  //       </div>
  //     ) : (
  //       <span className="text-sm text-muted-foreground">No disponible</span>
  //     );
  //   }

  //   if (product.tipo === ProductType.BASE) {
  //     const precioMin = getPrecioMinimoVariantes(product);

  //     return precioMin !== null ? (
  //       <span className="font-bold text-primary text-xl">
  //         desde {formatCurrency(precioMin)}
  //       </span>
  //     ) : (
  //       <span className="text-sm text-muted-foreground">No disponible</span>
  //     );
  //   }

  //   return <span className="text-sm text-muted-foreground">No disponible</span>;
  // };

  const renderStock = () => {
    if (product.inventario && product.inventario.stock > 0) {
      return (
        <span className="text-sm text-green-600 font-medium flex items-center">
          <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5"></span>
          Disponible, {product.inventario.stock} unidades
        </span>
      );
    }
    return (
      <span className="text-sm text-muted-foreground flex items-center">
        <span className="w-2 h-2 bg-muted-foreground rounded-full mr-1.5"></span>
        No disponible
      </span>
    );
  };

  return (
    <Link href={`/producto/${product.slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          {/* Imagen del producto */}
          <div className="relative w-full sm:w-[200px] h-[200px] bg-white">
            {isOfertaActiva(product.descuento) && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2 z-10"
              >
                ¡OFERTA!
              </Badge>
            )}
            <Image
              src={product.coverUrl || "/placeholder.svg?height=300&width=300"}
              alt={product.nombre}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>

          {/* Contenido del producto */}
          <div className="flex-1 flex flex-col p-4">
            {/* Marca y nombre */}
            <div className="mb-2">
              {product.marca && (
                <span className="text-sm text-muted-foreground uppercase">
                  {product.marca.nombre}
                </span>
              )}
              <h3 className="font-semibold text-lg line-clamp-3">
                {product.nombre}
              </h3>
            </div>

            {/* Stock */}
            <div className="mb-3">{renderStock()}</div>

            {/* Precio y botones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto">
              <div>
                {/* {renderPrecio()} */}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista rápida
                </Button>
                <Button size="sm" className="flex-1 sm:flex-none">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
