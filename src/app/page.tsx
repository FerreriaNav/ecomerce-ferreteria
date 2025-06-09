// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import AboutUsLocations from "@/modules/about-us/components/about-us-locations";
import AboutUsSocial from "@/modules/about-us/components/about-us-social";
import { StrapiCarousel } from "@/modules/common/components/carousel/strapi-carousel";
import { CarrucelItem } from "@/modules/common/components/carousel/types/carousel";
import CategoryCarousel from "@/modules/common/components/category-carousel/category-carousel";
import MarcasCarousel from "@/modules/common/components/marcas-carousel/marcas-carousel";
import { ProductCarousel } from "@/modules/common/components/product-carousel/product-carousel";
import { TitleGradient } from "@/modules/common/components/titles/title-gradient";
import { getCategorias } from "@/services/categories/categories-services";
import { getInfoEcommerce } from "@/services/informacion-tienda/informacion-tienda-services";
import { getMarcas } from "@/services/marcas/marcas-services";
import { getPaginaPrincipal } from "@/services/pagina-principal/pagina-principal.services";
import { getProductsByFilters } from "@/services/products/products-services";
import { TagIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import respaldo from "@/contants/json/template-datos-ecommerce.json";

export default async function Home() {
  try {
    const paginaPrincipalResult = (await getPaginaPrincipal())?.data;
    // fetch product
    const resultProducts = await getProductsByFilters({
      descuentos: true,
    });
    const categorias = (await getCategorias())?.data ?? [];
    const marcas = (await getMarcas())?.data ?? [];
    const infoEcommerce = (await getInfoEcommerce())?.data;
    

    return (
      <main className="container mx-auto ">
        <div>
          {/* Carrusel principal */}

          <StrapiCarousel
            items={
              paginaPrincipalResult?.carrucel ?? respaldo.paginaPrincipal.carrucel as CarrucelItem[]
            }
            autoplay={true}
            intervalo={5000}
            // showControls={false}
            // showIndicators={false}
          />
          <div className="mt-5">
            <TitleGradient
              title={infoEcommerce?.nombre ?? "Nombre de la Tienda"}
              badgeText="BIENVENIDO"
              tagIcon={
                <Image
                  width={100}
                  height={100}
                  alt="logo"
                  src={infoEcommerce?.logo.url ?? "/icons/logo.webp"}
                />
              }
            />
          </div>
          {/* Carrusel category */}
          <CategoryCarousel categorias={categorias} />

          {/* Carrusel de productos (ya existente) */}
          {resultProducts && resultProducts.data.length > 0 && (
            <ProductCarousel
              products={resultProducts.data}
              title="Ofertas de la Semana"
            />
          )}
        </div>
        <TitleGradient
          title="Nuestros Distribuidores"
          badgeText="oficiales"
          tagIcon={<TagIcon size={40} />}
        />
        <MarcasCarousel marcas={marcas} />
        <div>
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <AboutUsLocations
              locations={infoEcommerce?.direcciones ?? []}
              generalPhone={infoEcommerce?.numeroGeneral}
              generalEmail={infoEcommerce?.correoGeneral}
            />
          </Suspense>

          {/* <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <AboutUsTeam team={infoEcommerce.nosotros.personal} />
          </Suspense> */}

          <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
            <AboutUsSocial socialNetworks={infoEcommerce?.redesSociales} />
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading store information:", error);
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error al cargar la información</h1>
          <p className="text-muted-foreground">
            No se pudo cargar la información de la tienda. Por favor, intenta
            más tarde.
          </p>
        </div>
      </main>
    );
  }
}
