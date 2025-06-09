"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";


export interface MainCarouselItem {
    id: string;
    imageUrl: string;
    link?: string;
    title?: string;
    subtitle?: string;
  }
interface MainCarouselProps {
  banners: MainCarouselItem[];
}

export function MainCarousel({ banners }: MainCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);
  const [, setCount] = useState(0);

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

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="w-full h-auto md:h-[400px] lg:h-[500px] relative ">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="relative w-full h-full overflow-hidden"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="relative w-full h-auto aspect-[16/9] md:aspect-[21/9]"
            >
              {banner.link ? (
                <Link
                  href={banner.link}
                  className="block relative w-full h-full"
                >
                  <BannerImage banner={banner} />
                </Link>
              ) : (
                <div className="relative w-full h-full">
                  <BannerImage banner={banner} />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}

function BannerImage({ banner }: { banner: MainCarouselItem }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={banner.imageUrl}
        alt={banner.title ?? "Banner Image"}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      />
      {(banner.title || banner.subtitle) && (
        <div className="absolute inset-0 flex flex-col justify-center items-start p-4 md:p-8 text-white">
          {banner.title && (
            <h2 className="text-xl md:text-3xl font-bold mb-2">
              {banner.title}
            </h2>
          )}
          {banner.subtitle && (
            <p className="text-sm md:text-lg">{banner.subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
