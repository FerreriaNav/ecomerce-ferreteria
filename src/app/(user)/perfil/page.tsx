export const dynamic = "force-dynamic"

import { auth } from "@/auth"
import { ErrorState } from "@/modules/common/components/error/ErrorState"
import { WelcomeSection } from "@/modules/common/components/unidentified/unidentified-section"
import { ProfileLayout } from "@/modules/profile/profile"
import { getMeInfo } from "@/services/users/users-services"
import { AlertTriangle, User } from "lucide-react"

export default async function PerfilUsuario() {
  try {
    const session = await auth()

    //? SI NO ESTÁ LOGUEADO MOSTRARÁ COMPONENTE DE INICIAR SESIÓN
    if (!session?.user?.user.documentId) {
      return (
        <WelcomeSection
          title="Accede a tu perfil"
          description="Inicia sesión para ver y gestionar la información de tu cuenta, historial de pedidos y preferencias personales."
          showAuthModal={true}
          showBrowseButton={true}
        />
      )
    }

    const userResponse = await getMeInfo(session.user.user.documentId)

    if (!userResponse?.data) {
      return (
        <main className="container mx-auto px-4 py-8">
          <ErrorState
            icon={<User size={48} />}
            title="Perfil no encontrado"
            message="No pudimos encontrar los datos de tu perfil. Es posible que tu cuenta necesite ser verificada o que haya ocurrido un error temporal."
          />
        </main>
      )
    }

    return <ProfileLayout user={userResponse.data} userAvatar={session.user.image} />
  } catch (error) {
    console.error("Error en la página de perfil:", error)

    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    const isNetworkError =
      errorMessage.toLowerCase().includes("fetch") ||
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("connection")

    return (
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          icon={<AlertTriangle size={48} />}
          title={isNetworkError ? "Error de conexión" : "Error al cargar el perfil"}
          message={
            isNetworkError
              ? "Verifica tu conexión a internet e intenta de nuevo más tarde."
              : "Ocurrió un error inesperado al cargar tu perfil. Nuestro equipo ha sido notificado del problema."
          }
        />
      </main>
    )
  }
}
