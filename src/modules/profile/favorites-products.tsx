"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useFavoritesStore } from "@/store/product-favorite.store";
import { useCartStore } from "@/store/products-cart.store";
import { useEffect } from "react";
import {
  Products,
  ProductType,
} from "@/interfaces/products/products.interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  getPrecioConDescuento,
  getPrecioMinimoVariantes,
} from "@/lib/price-descuento";

import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";

import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";

export function ProductosFavoritos() {
  const { favorites, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Productos favoritos</CardTitle>
        <CardDescription>
          {favorites.length > 0
            ? `Tienes ${favorites.length} producto${
                favorites.length === 1 ? "" : "s"
              } guardado${favorites.length === 1 ? "" : "s"} para ver más tarde`
            : "Productos que has guardado para ver más tarde"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductGrid />
      </CardContent>
    </Card>
  );
}

function ProductGrid() {
  const { favorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes productos favoritos
        </h3>
        <p className="text-gray-500 mb-6">
          Explora nuestros productos y guarda tus favoritos haciendo clic en el
          ícono del corazón
        </p>
        <Link href="/categoria">
          <Button>Explorar productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {favorites.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

interface ProductCardProps {
  producto: Products;
}

function ProductCard({ producto }: ProductCardProps) {
  const { confirmRemoveFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();
  const { data: session } = useSession();

  const handleRemoveFavorite = () => {
    confirmRemoveFavorite(producto.id, producto.nombre);
  };

  const handleAddToCart = () => {
    addToCart(producto);
  };

  const tieneStock = (producto.inventario?.stock || 0) > 0;
  const stockDisponible = producto.inventario?.stock || 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderPrecio = () => {
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

    if (
      producto.tipo === ProductType.SIMPLE ||
      producto.tipo === ProductType.VARIANT
    ) {
      if (precioFinal !== null && precioFinal !== undefined) {
        return (
          <div className="flex flex-col items-start">
            <span className="font-bold text-primary">
              {formatCurrency(precioFinal)}
            </span>
            {tieneDescuento && (
              <span className="text-xs line-through text-muted-foreground">
                {formatCurrency(precioBase)}
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
    <div className="border rounded-lg overflow-hidden group relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 text-rose-500 hover:bg-white hover:text-rose-600"
          onClick={handleRemoveFavorite}
          title="Quitar de favoritos"
        >
          <Heart className="h-4 w-4 fill-current" />
        </Button>
      </div>

      {producto.descuento && producto.descuento.activo && (
        <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
          Oferta
        </Badge>
      )}

      <Link href={`/productos/${producto.slug}`}>
        <div className="aspect-square relative overflow-hidden cursor-pointer">
          <Image
            width={500}
            height={500}
            src={producto.coverUrl || "/imgs/products/default-img.png"}
            alt={producto.nombre}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary cursor-pointer">
            {producto.nombre}
          </h3>
        </Link>

        {producto.marca && (
          <div className="text-xs text-muted-foreground">
            {producto.marca.nombre}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {producto.categorias.slice(0, 2).map((categoria) => (
            <Badge key={categoria.id} variant="outline" className="text-xs">
              {categoria.nombre}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          {/* <div>{renderPrecio()}</div> */}

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemoveFavorite}
              title="Eliminar de favoritos"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8"
              disabled={!tieneStock}
              onClick={handleAddToCart}
              title={tieneStock ? "Agregar al carrito" : "Sin stock"}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!tieneStock && (
          <div className="text-xs text-red-500 font-medium">Sin stock</div>
        )}

        {tieneStock && stockDisponible <= 5 && (
          <div className="text-xs text-orange-500">
            Últimas {stockDisponible} unidades
          </div>
        )}
      </div>
    </div>
  );
}
