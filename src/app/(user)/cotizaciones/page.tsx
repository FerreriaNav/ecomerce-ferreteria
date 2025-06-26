// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { ErrorState } from "@/modules/common/components/error/ErrorState";
import { WelcomeSection } from "@/modules/common/components/unidentified/unidentified-section";
import { QuotesClient } from "@/modules/quotes/quote-client";
import { getUserCotizaciones } from "@/services/quote/quote-services";
import { AlertTriangle } from "lucide-react";

export default async function PedidosPage() {
  try {
    const session = await auth();

    if( !session?.user?.user.id ) {
      return (
        <WelcomeSection 
          title="Accede a tus cotizaciones"
          description="Inicia sesión para poder mirar tus cotizaciones con nuestra distribuidora"
          showAuthModal={true}
          showBrowseButton={true}
        />
      );
    }
    
    const orders = (await getUserCotizaciones(session?.user?.user.documentId))?.data ?? [];

    return <QuotesClient initialQuotes={orders} />;
  } catch (error) {
    console.error("Error en la página de marca:", error);
    return (
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          icon={<AlertTriangle size={48} />}
          title="Error al cargar las cotizaciones"
          message="No pudimos obtener la informacion de tus cotizaciones. Por favor, intenta de nuevo más tarde."
        />
      </main>
    );
  }
}
