import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { infoExtra } from "../../../interfaces/informacion-tienda/informacion-tienda.interface";

interface AboutUsHistoryProps {
  history?: string;
  image?: {
    url: string;
  };
  infoExtra?: infoExtra[];
}

export default function AboutUsHistory({
  history,
  image,
  infoExtra,
}: AboutUsHistoryProps) {
  const defaultHistory =
    "Nuestra ferretería comenzó como un pequeño negocio familiar hace más de 20 años. Con dedicación y compromiso con la calidad, hemos crecido hasta convertirnos en un referente en el sector, manteniendo siempre nuestros valores de servicio al cliente y excelencia en productos.";

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-muted/30 to-background" />

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <Card className="group overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-0 relative">
              <div className="relative aspect-video overflow-hidden">
                {image?.url ? (
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Imagen de nuestra empresa"
                    width={1280}
                    height={720}
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    priority
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    alt="Imagen de nuestra empresa"
                    width={1280}
                    height={720}
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 animate-in slide-in-from-right-8 duration-1000">
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20 text-primary"
            >
              <History className="w-4 h-4 mr-2" />
              Nuestra Trayectoria
            </Badge>

            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Nuestra Historia
            </h2>

            <div className="flex items-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
            </div>

            <p className="text-muted-foreground md:text-lg lg:text-xl leading-relaxed">
              {history || defaultHistory}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {infoExtra?.map((info) => (
                <div
                  key={info.titulo}
                  className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                  // className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/10"
                  // className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10"
                >
                  <div className="text-2xl font-bold text-primary">
                    {info.titulo}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {info.descripcion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
