export const dynamic = "force-dynamic";
import { auth } from "@/auth";

import AddressGrid from "@/components/layout/address/address-grid";
import { getUserDirections } from "@/services/directions/directions-services";
import { WelcomeSection } from "@/modules/common/components/unidentified/unidentified-section";

export default async function Home() {
  const session = await auth();
  
  if ( !session?.user?.user.id ) {
    return (
      <WelcomeSection 
        title="Accede a tus direcciones"
        description="Inicia sesión para ver y gestionar las direcciones de tu cuenta"
        showAuthModal={true}
        showBrowseButton={true} 
      />
    );
  }
  const address = await getUserDirections(session?.user?.user.documentId);

  return (
    <main className="container mx-auto px-4 py-8">
      <AddressGrid session={session} address={address?.data ?? []} />
    </main>
  );
}
