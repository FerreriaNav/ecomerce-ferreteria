"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { FileText, Heart, LogOut, MapPin, Package, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";

interface AvatarDropdownProps {
  avatarUrl?: string | null;
}

const menuItems = [
  {
    href: `${FRONTEND_ROUTES.PROFILE}`,
    label: "Perfil",
    icon: User,
  },
  {
    href: `${FRONTEND_ROUTES.DIRECTIONS}`,
    label: "Direcciones",
    icon: MapPin,
  },
  {
    href: `${FRONTEND_ROUTES.FAVORITE}`,
    label: "Favoritos",
    icon: Heart,
  },
  {
    href: `${FRONTEND_ROUTES.QUOTES}`,
    label: "Mis Cotizaciones",
    icon: FileText,
  },
  {
    href: `${FRONTEND_ROUTES.SETTINGS}`,
    label: "Configuración",
    icon: Settings,
  },
];

export const AvatarDropdown = ({ avatarUrl }: AvatarDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded-full hidden md:flex justify-center items-center"
        >
          <Avatar>
            <AvatarImage
              src={avatarUrl || "/imgs/default/user.webp"}
              alt="@username"
            />
            <AvatarFallback>
              <User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link
              href={href}
              className="flex w-full items-center gap-2 hover:bg-muted hover:text-primary transition-colors rounded-md px-2 py-1"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
