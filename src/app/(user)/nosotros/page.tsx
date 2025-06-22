// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getInfoEcommerce } from "@/services/informacion-tienda/informacion-tienda-services";

import { Skeleton } from "@/components/ui/skeleton";
import AboutUsHero from "@/modules/about-us/components/about-us-hero";
import AboutUsHistory from "@/modules/about-us/components/about-us-history";
import AboutUsValues from "@/modules/about-us/components/about-us-values";
import AboutUsLocations from "@/modules/about-us/components/about-us-locations";
import AboutUsTeam from "@/modules/about-us/components/about-us-team";
import AboutUsSocial from "@/modules/about-us/components/about-us-social";

// respaldo json
import respaldo from "@/contants/json/template-datos-ecommerce.json";
import { DireccionSucursal } from "@/interfaces/informacion-tienda/informacion-tienda.interface";

export const metadata = {
  title: "Sobre Nosotros | Ferretería Online",
  description:
    "Conoce más sobre nuestra ferretería, historia, valores y equipo",
};

export default async function AboutUsPage() {
  // 👉 Aquí aplicamos el respaldo con fallback directo
  const infoEcommerce =
    (await getInfoEcommerce())?.data ?? respaldo.infoEcommerce;

  return (
    <main className="flex flex-col min-h-screen container mx-auto px-4 md:px-6 py-8 space-y-12">
      {/* Hero Section */}
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <AboutUsHero
          companyName={infoEcommerce?.nosotros?.nombreEmpresa}
          slogan={infoEcommerce?.nosotros?.eslogan}
        />
      </Suspense>

      {/* History Section */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <AboutUsHistory
          history={infoEcommerce?.nosotros.historia}
          image={infoEcommerce?.nosotros?.imagenHistoria}
        />
      </Suspense>

      {/* Values Section */}
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <AboutUsValues />
      </Suspense>

      {/* Locations Section */}
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AboutUsLocations
          locations={infoEcommerce?.direccion ? [infoEcommerce?.direccion as DireccionSucursal] : []}
          generalPhone={infoEcommerce?.numeroGeneral}
          generalEmail={infoEcommerce?.correoGeneral}
        />
      </Suspense>

      {/* Team Section */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <AboutUsTeam team={infoEcommerce?.nosotros.personal} />
      </Suspense>

      {/* Social Media Section */}
      <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
        <AboutUsSocial socialNetworks={infoEcommerce?.redesSociales} />
      </Suspense>
    </main>
  );
}
