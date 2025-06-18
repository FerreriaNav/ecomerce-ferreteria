"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Products } from "@/interfaces/products/products.interface";
import { ProductCard } from "./product-card";
import { SubtitleSection } from "../titles/subtitle-section";

interface ProductCarouselProps {
  products: Products[];
  title?: string;
  subtittle?:string
}

export function ProductCarousel({ products, title, subtittle }: ProductCarouselProps) {
  return (
    <div className="w-full h-full py-6">
      {title && <SubtitleSection subtitle={title} description={subtittle}></SubtitleSection>}

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4 p-2">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="my-6 pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2 " />
        <CarouselNext className="-right-2" />
      </Carousel>
    </div>
  );
}
