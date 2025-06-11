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
import { Categoria } from "@/interfaces/categories/categories.interface";
import {  TagsIcon } from "lucide-react";
import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";

interface CategoryCarouselProps {
  categorias: Categoria[];
  className?: string;
}

export default function CategoryCarousel({
  categorias,
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
      <CarouselContent >
        {categorias.map((item, index) => (
          <CarouselItem
            key={index}
            className="pl-2 md:pl-4 basis-[140px] md:basis-[150px] flex justify-center"
          >
            <Link
              href={`${FRONTEND_ROUTES.CATALOGOS}/${item.slug}`}
              className="flex flex-col items-center"
            >
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100">
                {item.img?.url ? (
                  <Image
                    src={item.img?.url}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <TagsIcon size={50} className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                )}
              </div>
              <span className="mt-2 text-center text-sm font-medium">
                {item.nombre}
              </span>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 md:-left-9 top-1/2 md:top-1/2 -translate-y-1/2 " />
      <CarouselNext className="absolute right-0 md:-right-9 top-1/2 md:top-1/2 -translate-y-1/2 " />
    </Carousel>
  );
}
