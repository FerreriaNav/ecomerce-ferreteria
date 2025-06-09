import {
  parseProductFilters,
  ProductFilters,
  searchProductsWithParams,
} from "@/services/products/products-services";
import { ProductGrid } from "@/modules/main/components/productCart/ProductGrid";
import { getCategorias } from "@/services/categories/categories-services";
import { getMarcas } from "@/services/marcas/marcas-services";
import { ErrorState } from "@/modules/common/components/error/ErrorState";
import { AlertTriangle } from "lucide-react";
import { ResponsiveStoreFilters } from "@/modules/shop/ResponsiveStoreFilters";

export default async function SearchSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  try {
    const { slug } = await params;
    const searchDecode = decodeURIComponent(slug);
    const searchParamsDecode = await searchParams;
    const filtros: ProductFilters = parseProductFilters(searchParamsDecode);
    console.log(searchParamsDecode);
    console.log("filtered", filtros);

    const productData = await searchProductsWithParams(filtros);
    const categorias = (await getCategorias())?.data ?? [];
    const marcas = (await getMarcas())?.data ?? [];


    return (
      <main className="container mx-auto px-4 py-8">
        {/* Mobile: Filters on top */}
        <div className="md:hidden mb-4">
          <ResponsiveStoreFilters
            categorias={categorias}
            marcas={marcas}
            categoriaBase={slug}
            selectedFilters={filtros}
          />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Desktop: Filters on the side */}
          <div className="hidden md:block">
            <ResponsiveStoreFilters
              categorias={categorias}
              marcas={marcas}
              categoriaBase={slug}
              selectedFilters={filtros}
            />
          </div>
          {/* Main content */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              Resultados para:{" "}
              <span className="text-primary">{searchDecode}</span>
            </h2>

            {productData && productData.data.length > 0 ? (
              <ProductGrid products={productData} />
            ) : (
              <p>No se encontraron productos para esta búsqueda.</p>
            )}
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
          title="Error al cargar los productos relacionados ala busqueda"
          message="No pudimos obtener los productos relacionados ala busqueda. Por favor, intenta de nuevo más tarde."
        />
      </main>
    );
  }
}
