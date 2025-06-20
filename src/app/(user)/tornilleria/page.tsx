import { Card } from "@/components/ui/card";
import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";
import { CATEGORIAS_ENUM } from "@/interfaces/categories/categories.interface";
import CarouselBasic from "@/modules/common/components/carousel-basic/carousel-basic";
import { TitleGradient } from "@/modules/common/components/titles/title-gradient";
import { getProductsByFilters } from "@/services/products/products-services";
import { Bolt } from "lucide-react";

export default async function  TornilleriaPage() {

    const resultProductsTornilleria = await getProductsByFilters({
          categorias: [CATEGORIAS_ENUM.TORNILLERIA],
        });
  return (
    <main className="container mx-auto">
        <TitleGradient title="Tornillería" tagIcon={<Bolt size={50} />}></TitleGradient>
       <Card className="bg-secondary">
          <CarouselBasic
            basePath={FRONTEND_ROUTES.PRODUCTOS}
            className="my-5"
            title="Proveedor industrial de tornillería"
            subtitle="Contamos con todo tipo de tornillería en general, desde uno sencillo hasta los más especializados, no dudes en preguntarnos, manejamos mayoreo y menudeo, tenemos personal capacitado especialista en tornillería para tu atención y darte el mejor servicio."
            variant="circular"
            items={
              resultProductsTornilleria?.data.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                imgUrl: p.coverUrl,
                slug: p.slug,
              })) ?? []
            }
          />
        </Card>
    </main>
  );
}