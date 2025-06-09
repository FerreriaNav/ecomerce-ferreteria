export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { ErrorState } from "@/modules/common/components/error/ErrorState";
import { ProfileLayout } from "@/modules/profile/profile";
import { getMeInfo } from "@/services/users/users-services";
import { AlertTriangle } from "lucide-react";

export default async function PerfilUsuario() {
  try {
    const sesion = await auth();
    const user = await getMeInfo(sesion?.user?.user.documentId);

    return (
      <ProfileLayout
        user={user?.data ?? null}
        userAvatar={sesion?.user?.image}
      />
    );
  } catch (error) {
    console.error("Error en la página de marca:", error);
    return (
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          icon={<AlertTriangle size={48} />}
          title="Error al cargar los datos de perfil"
          message="No pudimos obtener los datos de perfil. Por favor, intenta de nuevo más tarde."
        />
      </main>
    );
  }
}
