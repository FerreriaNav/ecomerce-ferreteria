// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";


import { Suspense } from "react"
import { getInfoEcommerce } from "@/services/informacion-tienda/informacion-tienda-services"

import { Skeleton } from "@/components/ui/skeleton"
import AboutUsHero from "@/modules/about-us/components/about-us-hero"
import AboutUsHistory from "@/modules/about-us/components/about-us-history"
import AboutUsValues from "@/modules/about-us/components/about-us-values"
import AboutUsLocations from "@/modules/about-us/components/about-us-locations"
import AboutUsTeam from "@/modules/about-us/components/about-us-team"
import AboutUsSocial from "@/modules/about-us/components/about-us-social"

export const metadata = {
  title: "Sobre Nosotros | Ferretería Online",
  description: "Conoce más sobre nuestra ferretería, historia, valores y equipo",
}



export default async function AboutUsPage() {
  try {
    const  infoEcommerce  = (await getInfoEcommerce())?.data

    return (
      <main className="flex flex-col min-h-screen container mx-auto px-4 md:px-6 py-8 space-y-12">
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <AboutUsHero companyName={infoEcommerce?.nosotros?.nombreEmpresa} slogan={infoEcommerce?.nosotros?.eslogan} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <AboutUsHistory history={infoEcommerce?.nosotros.historia} image={infoEcommerce?.nosotros?.imagenHistoria} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <AboutUsValues />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
         <AboutUsLocations
            locations={infoEcommerce?.direcciones ??[] }
            generalPhone={infoEcommerce?.numeroGeneral}
            generalEmail={infoEcommerce?.correoGeneral}
          />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <AboutUsTeam team={infoEcommerce?.nosotros.personal} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
          <AboutUsSocial socialNetworks={infoEcommerce?.redesSociales} />
        </Suspense>
      </main>
    )
  } catch (error) {
    console.error("Error loading store information:", error)
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error al cargar la información</h1>
          <p className="text-muted-foreground">
            No se pudo cargar la información de la tienda. Por favor, intenta más tarde.
          </p>
        </div>
      </main>
    )
  }
}
