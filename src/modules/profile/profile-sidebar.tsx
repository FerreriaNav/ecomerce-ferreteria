"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, Mail, Phone } from "lucide-react";
import { useFavoritesStore } from "@/store/product-favorite.store";
import { getInitialsName } from "@/lib/getInitialsName";
import { getTimeSinceCreation } from "@/lib/timeCreationProfile";
import { User } from "@/interfaces/auth/user.interface";
import { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface";
import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";
import { useRouter } from "next/navigation";

interface ProfileSidebarProps {
  user: User | null;
  avatarUser: string | undefined | null;
  quotes: Cotizacion[] | null;
}

export function ProfileSidebar({
  user,
  avatarUser,
  quotes,
}: ProfileSidebarProps) {
  const { favorites, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-3 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage
            src={avatarUser || `/imgs/default/user.webp?height=96&width=96`}
            alt="Foto de perfil"
          />
          <AvatarFallback className="bg-orange-50 text-orange-600 font-semibold text-lg">
            {user?.name && user?.lastName
              ? getInitialsName(user?.name, user?.lastName)
              : "nombre no disponible"}
          </AvatarFallback>
        </Avatar>
        <CardTitle>
          {user?.name} {user?.lastName}
        </CardTitle>
        <CardDescription>
          <Badge className="mt-2 capitalize bg-blue-500 hover:bg-blue-600">
            {getTimeSinceCreation(user?.createdAt?.toString() ?? "")}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContactInfo user={user} />
        <Separator />
        <ActivitySummary favorites={favorites} quotes={quotes} />
      </CardContent>
    </Card>
  );
}

function ContactInfo({ user }: { user: User | null }) {
  const contactDetails = [
    {
      icon: <Mail className="h-4 w-4 text-muted-foreground" />,
      text: user?.email || "email no disponible",
    },
    {
      icon: <Phone className="h-4 w-4 text-muted-foreground" />,
      text: user?.telefono || `telefono no disponible`,
    },
  ];

  return (
    <>
      {contactDetails.map((detail, index) => (
        <div key={index} className="flex items-center gap-2">
          {detail.icon}
          <span className="text-sm">{detail.text}</span>
        </div>
      ))}
    </>
  );
}

function ActivitySummary({ favorites, quotes }: { favorites: any[]; quotes: any[] | null; }) {

  const router = useRouter();

  const activities = [
    {
      icon: <ShoppingBag className="h-4 w-4 mb-1" />,
      count: quotes?.length.toString(),
      label: "Cotizaciones",
      route: FRONTEND_ROUTES.QUOTES,
    },
    {
      icon: <Heart className="h-4 w-4 mb-1" />,
      count: favorites.length.toString(),
      label: "Favoritos",
      route: FRONTEND_ROUTES.FAVORITE,
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route)
  }
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Resumen</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {activities.map((activity, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(activity.route)}
            className="flex flex-col items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted hover:text-primary transition-colors duration-200"
          >
            {activity.icon}
            <span className="font-bold">{activity.count}</span>
            <span className="text-xs">
              {activity.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
