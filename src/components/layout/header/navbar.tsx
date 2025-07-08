"use client";

import Link from "next/link";
import {
  Menu,
  ChevronDown,
  User,
  Heart,
  MapPin,
  LogOut,
  ShoppingCart,
  Info,
  Home,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Marca } from "@/interfaces/marcas/marca.interface";
import Image from "next/image";
import type { Categoria } from "@/interfaces/categories/categories.interface";
import type { InfoEcommerce } from "@/interfaces/informacion-tienda/informacion-tienda.interface";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBar } from "../search-bar/SearchBar";
import { AvatarDropdown } from "../../../modules/common/components/avatar-dropdown/AvatarDropdown";
import { ButtonLogin } from "@/modules/common/components/auth/login/ButtonLogin";
import type { Session } from "next-auth";
import { FRONTEND_ROUTES } from "../../../contants/frontend-routes/routes";
import { Suspense, useEffect, useState } from "react";
import { useCartStore } from "@/store/products-cart.store";
import { FaWhatsapp } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarProps {
  marcas: Marca[];
  categorias: Categoria[];
  informacionTienda: InfoEcommerce | null;
  session: Session | null;
}

export default function Navbar({
  marcas,
  categorias,
  informacionTienda,
  session,
}: NavbarProps) {
  const { loadCart } = useCartStore();
  const categoriasFiltradas = categorias.filter((cat) => !cat.principal);
  const [, setIsMobile] = useState(false);
  useEffect(() => {
    loadCart();

    // Detectar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Comprobar al cargar y cuando cambie el tamaño de la ventana
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [loadCart]);

  // Función para crear la URL de WhatsApp
  const getWhatsAppUrl = () => {
    const message = encodeURIComponent(
      "Hola, me gustaría obtener más información"
    );
    const whatsappNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
    return `https://wa.me/+52${whatsappNumber}?text=${message}`;
  };

  return (
    <div className=" fixed top-0 left-0 w-full z-50 bg-primary shadow-md">
      <div className="container flex h-16 items-center px-4">
        {/* sidebar movil */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] flex flex-col h-full p-0"
          >
            {/* Header con título */}
            <SheetHeader className="p-4 border-b">
              <SheetTitle>
                <Link href="/" className="flex flex-row items-center gap-2">
                  <Image
                    src={informacionTienda?.logo?.url || "/placeholder.svg"}
                    width={100}
                    height={100}
                    alt="logo"
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>

            {/* Tabs para organizar el contenido */}
            <Tabs defaultValue="navigation" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 mx-4 mt-4">
                <TabsTrigger className="cursor-pointer" value="navigation">
                  Navegación
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="account">
                  Mi Cuenta
                </TabsTrigger>
              </TabsList>

              {/* Contenido de navegación */}
              <TabsContent
                value="navigation"
                className="flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <nav className="flex flex-col gap-4 px-4 py-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Inicio
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href={FRONTEND_ROUTES.NOSOTROS}>
                        <Info className="mr-2 h-4 w-4" />
                        Sobre Nosotros
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href={FRONTEND_ROUTES.TORNILLERIA}>
                        <Info className="mr-2 h-4 w-4" />
                        Tornillería
                      </Link>
                    </Button>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                        >
                          <div className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Catalogo
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-2">
                        {categorias.map((categoria) => {
                          if (
                            !categoria.principal ||
                            categoria.subcategorias?.length
                          ) {
                            return (
                              <Collapsible key={categoria.nombre}>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between"
                                  >
                                    {categoria.nombre}
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-2 mt-2">
                                  {categoria.subcategorias?.map(
                                    (subcategoria) => (
                                      <Button
                                        key={subcategoria.nombre}
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start pl-4"
                                      >
                                        <Link
                                          href={`${FRONTEND_ROUTES.CATALOGOS}/${subcategoria.nombre}`}
                                        >
                                          <p className="text-foreground">
                                            {subcategoria.nombre}
                                          </p>
                                        </Link>
                                      </Button>
                                    )
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          }
                          return (
                            <Button
                              key={categoria.nombre}
                              asChild
                              variant="ghost"
                              className="w-full justify-start pl-4"
                            >
                              <Link
                                href={`${FRONTEND_ROUTES.CATALOGOS}/${categoria.nombre}`}
                              >
                                <p className="text-foreground">
                                  {categoria.nombre}
                                </p>
                              </Link>
                            </Button>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                        >
                          <div className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Provedores
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-2">
                        {marcas.map((marca) => (
                          <Button
                            key={marca.nombre}
                            asChild
                            variant="ghost"
                            className="w-full justify-start pl-4"
                          >
                            <Link
                              href={`${FRONTEND_ROUTES.PROVEDORES}/${marca.nombre}`}
                            >
                              <p className="text-foreground">{marca.nombre}</p>
                            </Link>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Botón de WhatsApp */}
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-green-500"
                    >
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp className="mr-2 h-5 w-5" />
                        Contáctanos
                      </a>
                    </Button>
                  </nav>
                </ScrollArea>
              </TabsContent>

              {/* Contenido de cuenta */}
              <TabsContent value="account" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-4 py-2">
                    {/* Información del usuario */}
                    <div className="flex items-center gap-3 mb-6 p-2 bg-muted/30 rounded-lg">
                      <Avatar>
                        <AvatarImage
                          src={
                            session?.user?.image || "/placeholder-avatar.jpg"
                          }
                          alt="@username"
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {session?.user?.name ||
                            session?.user?.email ||
                            "@username"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Opciones de usuario con iconos */}
                    <div className="space-y-1">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Link href="/perfil">
                          <User className="mr-2 h-4 w-4" />
                          Mi Perfil
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Link href="/mis-cotizaciones">
                          <FileText className="mr-2 h-4 w-4" />
                          Mis Cotizaciones
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Link href="/direcciones">
                          <MapPin className="mr-2 h-4 w-4" />
                          Mis Direcciones
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Link href="/favoritos">
                          <Heart className="mr-2 h-4 w-4" />
                          Mis Favoritos
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Link href={session?.user?.user ? "/carrito" : "/"}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Mi Carrito
                        </Link>
                      </Button>
                    </div>

                    {/* Separador */}
                    <div className="my-4 border-t" />

                    {/* Opciones adicionales */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                        onClick={() => console.log("Cerrar sesión")}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* Footer con toggle de tema */}
            <div className="border-t p-4 bg-background">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} {informacionTienda?.nombre}
                </p>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* navbar desktop */}
        <div className="flex flex-row container gap-2">
          <Link href="/" className="hidden md:flex items-center gap-2 mr-6">
            <Image
              src={informacionTienda?.logo?.url || "/placeholder.svg"}
              width={100}
              height={100}
              alt="logo"
            />
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white">
                  Catalogo
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className=" grid  max-h-[300px] w-[400px] md:w-[500px] lg:w-[600px]  overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-3 p-4 md:grid-cols-2 ">
                    {categoriasFiltradas.map((categoria) => (
                     
                        <NavigationMenuLink key={categoria.id} asChild>
                          <Link
                            href={`${FRONTEND_ROUTES.CATALOGOS}/${categoria.nombre}`}
                            className="h-20 "
                          >
                            <div className="text-sm font-medium leading-none">
                              {categoria.nombre}
                            </div>
                            {categoria.subcategorias && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {categoria.subcategorias
                                  .map((subcategoria) => subcategoria.nombre)
                                  .join(",  ")}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                     
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent  text-white">
                  Provedores
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid  max-h-[300px] w-fit md:w-[400px] lg:w-[600px]  overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                    {marcas.map((marca) => (
                      <li
                        key={marca.id}
                        className="aspect-video min-h-10 min-w-10 flex items-center justify-center overflow-hidden rounded-md shadow-sm bg-white dark:bg-muted"
                      >
                        <NavigationMenuLink asChild>
                          <Link
                            href={`${FRONTEND_ROUTES.PROVEDORES}/${marca.nombre}`}
                            className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-100"
                          >
                            {marca.img ? (
                              <Image
                                className="max-h-full max-w-full object-contain"
                                src={marca.img?.url || "/default/img.webp"}
                                width={100}
                                height={100}
                                alt={marca.nombre}
                              />
                            ) : (
                              <span className="text-sm font-medium leading-none text-center text-foreground">
                                {marca.nombre}
                              </span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href={FRONTEND_ROUTES.NOSOTROS} legacyBehavior passHref>
                  <Button variant={"ghost"} className=" text-white">
                    Sobre Nosotros
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={FRONTEND_ROUTES.TORNILLERIA}
                  legacyBehavior
                  passHref
                >
                  <Button variant={"ghost"} className=" text-white">
                    Tornillería
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* search */}
          <Suspense fallback={<Skeleton></Skeleton>}>
            <SearchBar />
          </Suspense>
          <div className="flex flex-row items-center gap-2">
            {/* avatar */}
            <AvatarDropdown avatarUrl={session?.user?.image} />
            {/* toggle theme */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <ButtonLogin session={session}></ButtonLogin>
          </div>
        </div>
      </div>
    </div>
  );
}
