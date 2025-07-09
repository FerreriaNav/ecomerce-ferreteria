"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Package, Settings } from "lucide-react";
import { ProfileSidebar } from "./profile-sidebar";
import { ProductosFavoritos } from "./favorites-products";
import { ProfileSettings } from "./profile-settings";
import { User } from "@/interfaces/auth/user.interface";
import { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface";
import { PersonalInformation } from "./personal-information";

interface ProfileProps {
  user: User | null;
  userAvatar: string | undefined | null;
  quotes: Cotizacion[] | null;
  orders: Cotizacion[] | null;
}

export function ProfileLayout({ user, userAvatar, quotes, orders }: ProfileProps) {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-7xl">
      <div className="grid gap-6 md:grid-cols-5">
        <ProfileSidebar user={user} avatarUser={userAvatar} quotes={quotes} />

        <div className="md:col-span-3 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{`Bienvenido de vuelta, ${user?.name ?? "usuario"}`}</CardTitle>
              <CardDescription>
                Gestiona tu información, revisa tus compras y descubre productos
                recomendados.
              </CardDescription>
            </CardHeader>
          </Card>

          <ProfileTabs user={user} quotes={quotes ?? []} orders={orders ?? []} />
        </div>
      </div>
    </div>
  );
}

function ProfileTabs({ user, quotes, orders }: { user: User | null, quotes: Cotizacion[] | null, orders: Cotizacion[] | null }) {
  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger
          value="settings"
          className="flex items-center gap-2 cursor-pointer hover:bg-muted hover:text-primary transition-colors rounded-md px-2 py-1"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Ajustes</span>
        </TabsTrigger>
        <TabsTrigger
          value="favorites"
          className="flex items-center gap-2 cursor-pointer hover:bg-muted hover:text-primary transition-colors rounded-md px-2 py-1"
        >
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Favoritos</span>
        </TabsTrigger>
        <TabsTrigger
          value="information"
          className="flex items-center gap-2 cursor-pointer hover:bg-muted hover:text-primary transition-colors rounded-md px-2 py-1"
        >
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Información</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="space-y-4">
        <ProfileSettings user={user} />
      </TabsContent>

      <TabsContent value="favorites" className="space-y-4">
        <ProductosFavoritos />
      </TabsContent>

      <TabsContent value="information" className="space-y-4">
        <PersonalInformation quotes={quotes} timeCreationAccount={user?.createdAt.toString() ?? ""} orders={orders || []} />
      </TabsContent>
    </Tabs>
  );
}
