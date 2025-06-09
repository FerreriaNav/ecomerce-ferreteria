"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Img } from "@/interfaces/data/img.interface";

interface ImageLightboxProps {
  images: Img[]
  triggerRef?:RefObject<HTMLButtonElement | null>
}

export default function ImageLightbox({ images, triggerRef }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <Image
        src="/placeholder.svg?height=600&width=600"
        alt="Imagen no disponible"
        width={600}
        height={600}
        className="object-cover w-full h-full rounded-lg"
      />
    );
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button 
           ref={triggerRef}
            className="relative cursor-pointer group w-full h-full block overflow-hidden rounded-lg"
            type="button"
          >
            <Image
              src={images[0]?.url || "/placeholder.svg?height=600&width=600"}
              alt="Imagen de la sucursal"
              width={600}
              height={600}
              className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
            />

            {/* Overlay con efecto hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Indicador de múltiples imágenes */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                +{images.length - 1} más
              </div>
            )}

            {/* Icono de zoom */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-primary/90 text-primary-foreground p-3 rounded-full backdrop-blur-sm">
                <ZoomIn className="h-6 w-6" />
              </div>
            </div>

            {/* Texto de acción */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Ver galería
              </span>
            </div>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl w-full p-0 border-0 bg-black/95 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative w-full h-[80vh]">
            {/* Botón de cerrar */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70 border-0 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Contador de imágenes */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {current} / {count}
            </div>

            {/* Carrusel */}
            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full h-full flex items-center justify-center"
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="w-full h-full flex">
                    <Image
                      src={image.url || "/placeholder.svg?height=600&width=800"}
                      alt={`Imagen ${index + 1}`}
                      width={1000}
                      height={1000}
                      priority={index === 0}
                      className="object-contain w-full h-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Controles del carrusel - solo si hay más de una imagen */}
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0 backdrop-blur-sm" />
                  <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0 backdrop-blur-sm" />
                </>
              )}
            </Carousel>

            {/* Indicadores de puntos (solo si hay múltiples imágenes) */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === current - 1
                        ? "bg-primary scale-125"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
