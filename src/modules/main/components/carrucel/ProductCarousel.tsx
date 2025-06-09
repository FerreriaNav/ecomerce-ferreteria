"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Products } from "@/interfaces/products/products.interface";
import { ProductCard } from "@/modules/common/components/product-carousel/product-card";

interface ProductCarouselProps {
  products: Products[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  console.log(products);
  
  return (
    <>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-sm "
      >
        <CarouselContent className="-ml-2 md:-ml-4">

          {
          products.map((product) => (
            // renderizar cartas
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 basis-1/2">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
     
    </>
  );
}
