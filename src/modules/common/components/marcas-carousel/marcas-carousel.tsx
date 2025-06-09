"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Marca } from "@/interfaces/marcas/marca.interface";

interface CategoryCarouselProps {
  marcas: Marca[];
  className?: string;
}

export default function MarcasCarousel({
  marcas,
  className,
}: CategoryCarouselProps) {
  return (
    <Carousel
      className={`w-full pt-4 md:w-2/3 mx-auto flex justify-center ${
        className || ""
      }`}
      opts={{
        align: "center", // Asegura la alineación central en el carrusel
        loop: false,
      }}
    >
      <CarouselContent className="">
        {marcas.map((item, index) => (
          <CarouselItem
            key={index}
            className="pl-2 md:pl-4 basis-[140px] md:basis-[150px] flex justify-center"
          >
            <Link
              href={`/categoria/${item.nombre}`}
              className="flex flex-col items-center"
            >
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100">
                {item.img?.url && (
                  <Image
                    src={item.img?.url}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="mt-2 text-center text-sm font-medium">
                {item.nombre}
              </span>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
