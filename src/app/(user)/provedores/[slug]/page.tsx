// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { ErrorState } from "@/modules/common/components/error/ErrorState";
import { TitleGradient } from "@/modules/common/components/titles/title-gradient";
import { ProductGrid } from "@/modules/main/components/productCart/ProductGrid";
import { ResponsiveStoreFilters } from "@/modules/shop/ResponsiveStoreFilters";
import {
  parseProductFilters,
  ProductFilters,
  searchProductsWithParams,
} from "@/services/products/products-services";
import { AlertTriangle, Tags } from "lucide-react";

export default async function MarcaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  try {
    const { slug } = await params;
    const decodeSlug = decodeURIComponent(slug);
    const searchParamsDecode = await searchParams;

    const filtros: ProductFilters = parseProductFilters(searchParamsDecode);

    const filtrosWithMarca: ProductFilters = {
      ...filtros,
      marcas: [decodeSlug, ...(filtros.marcas ?? [])],
    };

    const productFilteredData = await searchProductsWithParams(
      filtrosWithMarca
    );

    return (
      <main className="container mx-auto px-4 py-8">
         <div className="-mt-14 -mb-5">
          <TitleGradient
            title={slug}
            tagIcon={<Tags size={50} />}
          ></TitleGradient>
        </div>
        {/* Mobile: Filters on top */}
        <div className="md:hidden mb-4">
          <ResponsiveStoreFilters marcaBase={decodeSlug} selectedFilters={filtrosWithMarca} />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Desktop: Filters on the side */}
          <div className="hidden md:block">
            <ResponsiveStoreFilters
              selectedFilters={filtrosWithMarca}
              marcaBase={decodeSlug}
            />
          </div>

          {/* Main content */}
          <div className="md:col-span-3 space-y-4">
            <ProductGrid products={productFilteredData} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error en la página de marca:", error);
    return (
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          icon={<AlertTriangle size={48} />}
          title="Error al cargar la marca"
          message="No pudimos obtener los datos de esta marca. Por favor, intenta de nuevo más tarde."
        />
      </main>
    );
  }
}
