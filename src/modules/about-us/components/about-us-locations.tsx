"use client";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getGoogleMapsEmbedUrl } from "@/lib/maps/frame";
import { DireccionSucursal } from "../../../interfaces/informacion-tienda/informacion-tienda.interface";
import ImageLightbox from "./image-lightbox";
import { useRef } from "react";

interface AboutUsLocationsProps {
  locations: DireccionSucursal[] | null;
  generalPhone?: string | null;
  generalEmail?: string | null;
}

export default function AboutUsLocations({
  locations,
  generalPhone,
  generalEmail,
}: AboutUsLocationsProps) {
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-muted/20 to-background" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <Badge
            variant="outline"
            className="bg-primary/10 border-primary/20 text-primary"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Encuéntranos
          </Badge>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Nuestras Ubicaciones
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-xl">
              Visítanos y descubre todo lo que tenemos para ofrecerte.
            </p>
          </div>
        </div>

        {locations.length > 1 ? (
          <Tabs
            defaultValue={locations[0].id.toString() || "location-0"}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8 bg-muted/50 p-1">
              {locations.map((location, index) => (
                <TabsTrigger
                  key={location.id || `location-${index}`}
                  value={location.id.toString() || `location-${index}`}
                  className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sucursal {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {locations.map((location, index) => (
              <TabsContent
                key={location.id || `location-${index}`}
                value={location.id.toString() || `location-${index}`}
              >
                <LocationCard
                  location={location}
                  generalPhone={generalPhone}
                  generalEmail={generalEmail}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <LocationCard
            location={locations[0]}
            generalPhone={generalPhone}
            generalEmail={generalEmail}
          />
        )}
      </div>
    </section>
  );
}

function LocationCard({
  location,
  generalPhone,
  generalEmail,
}: {
  location: DireccionSucursal;
  generalPhone?: string | null;
  generalEmail?: string | null;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
      <Card className="group overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card to-muted/20 hover:shadow-3xl transition-all duration-500">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            {location.imagenes && location.imagenes.length > 0 ? (
              <ImageLightbox
                images={location.imagenes}
                triggerRef={triggerRef}
              />
            ) : (
              <Image
                src="/icon/logo.webp"
                alt="Imagen de nuestra sucursal"
                width={600}
                height={600}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div
              onClick={() => triggerRef.current?.click()}
              className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-muted/10">
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden">
              {location.urlFrame?.includes("<iframe") ? (
                <div
                  className="absolute inset-0"
                  dangerouslySetInnerHTML={{
                    __html: location.urlFrame,
                  }}
                />
              ) : (
                <iframe
                  src={
                    getGoogleMapsEmbedUrl(location?.coordenadas) ||
                    location.urlFrame
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  className="absolute inset-0 rounded-lg"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Información de Contacto</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-4 p-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                <div className="rounded-full bg-primary/10 p-2">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground flex-1">
                  {location.direccion}
                </p>
              </div>

              <div className="flex items-start space-x-4 p-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                <div className="rounded-full bg-secondary/10 p-2">
                  <Clock className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-muted-foreground flex-1 ">
                  {location.horario}
                </p>
              </div>

              <div className="flex items-start space-x-4 p-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                <div className="rounded-full bg-accent/10 p-2">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <p className="text-muted-foreground flex-1">
                  {location.numero || generalPhone || "Teléfono no disponible"}
                </p>
              </div>

              <div className="flex items-start space-x-4 p-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground flex-1">
                  {location.correo || generalEmail || "Correo no disponible"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
