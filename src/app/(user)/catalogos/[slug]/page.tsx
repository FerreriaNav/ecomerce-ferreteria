// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import CategoryCarousel from "@/modules/common/components/category-carousel/category-carousel";
import { ErrorState } from "@/modules/common/components/error/ErrorState";
import { TitleGradient } from "@/modules/common/components/titles/title-gradient";
import { ProductGrid } from "@/modules/main/components/productCart/ProductGrid";
import { ResponsiveStoreFilters } from "@/modules/shop/ResponsiveStoreFilters"; // Asegúrate que esta ruta esté bien
import { getCategorias } from "@/services/categories/categories-services";
// import { getMarcas } from "@/services/marcas/marcas-services";
import {
  getProductsByFilters,
  parseProductFilters,
  ProductFilters,
} from "@/services/products/products-services";
import { AlertTriangle, Store } from "lucide-react";

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  try {
    const slug = decodeURIComponent((await params).slug);
    const searchParamsDecode = await searchParams;
    const categoriasResult = await getCategorias();
    const categoria = categoriasResult?.data?.find(
      (cat) => cat.nombre === slug
    );

    const filtros: ProductFilters = parseProductFilters(searchParamsDecode);

    const filtrosWithCategoria: ProductFilters = {
      ...filtros,
      categorias: [slug, ...(filtros.categorias ?? [])],
    };
    const productResult = await getProductsByFilters(filtros);
    console.log(productResult);

    // const marcasResult = await getMarcas();

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="-mt-14 -mb-5">
          <TitleGradient
            title={slug}
            tagIcon={<Store size={50} />}
          ></TitleGradient>
        </div>
        {/* Mobile: Filters on top */}
        <div className="md:hidden mb-4">
          <ResponsiveStoreFilters
            // categorias={categoriasResult?.data ?? []}
            // marcas={marcasResult?.data ?? []}
            categoriaBase={slug}
            selectedFilters={filtrosWithCategoria}
          />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Desktop: Filters on the side */}
          <div className="hidden md:block">
            <ResponsiveStoreFilters
              // categorias={categoriasResult?.data ?? []}
              // marcas={marcasResult?.data ?? []}
              categoriaBase={slug}
              selectedFilters={filtrosWithCategoria}
            />
          </div>
          {/* Main content */}
          <div className="md:col-span-3 space-y-4">
            <Card>
              {categoria?.subcategorias && (
                <CategoryCarousel
                  className="w-full scale-90"
                  categorias={categoria?.subcategorias}
                />
              )}
            </Card>
            <ProductGrid products={productResult} />
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
          title="Error al cargar la categoria"
          message="No pudimos obtener los datos de esta categoria. Por favor, intenta de nuevo más tarde."
        />
      </main>
    );
  }
}
