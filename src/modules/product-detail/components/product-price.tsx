// componentes/ProductPrice.tsx
import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";
import { Products } from "@/interfaces/products/products.interface";
import { formatCurrency } from "@/lib/formatCurrency";
import { getPrecioConDescuento } from "@/lib/price-descuento";

interface ProductPriceProps {
  product?: Products | null;
  minPrice?: number | null;
  isLoggedIn?: boolean; // Nuevo parámetro para controlar el inicio de sesión
}

export const ProductPriceDetail = ({
  product,
  minPrice,
  isLoggedIn = false,
}: ProductPriceProps) => {
  if (!isLoggedIn && ECOMMERCE_PRIVADO) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Inicia sesión para ver el precio
      </div>
    );
  }

  if (minPrice && !product) {
    return (
      <span className="text-3xl font-bold text-primary">
        desde {formatCurrency(minPrice)}
      </span>
    );
  }

  const { finalPrice, hasDiscount } = getPrecioConDescuento(
    product?.inventario,
    product?.descuento
  );

  if (finalPrice === null) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Precio no disponible
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-3xl font-bold text-primary">
        {formatCurrency(finalPrice)}
      </span>
      {hasDiscount && product && (
        <span className="text-xl text-muted-foreground line-through">
          {formatCurrency(product.inventario!.precioVenta)}
        </span>
      )}
    </div>
  );
};
