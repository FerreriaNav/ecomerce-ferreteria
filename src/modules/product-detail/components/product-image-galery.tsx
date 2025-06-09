"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"

interface ProductImageGalleryProps {
  images?: string[]
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
    setCurrent(api.selectedScrollSnap())
  }, [api])

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square bg-background rounded-lg border overflow-hidden">
                <Image
                  src={image || "/placeholder.svg?height=600&width=600"}
                  alt={image || "Imagen del producto"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Contenedor para los botones */}
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <CarouselPrevious className="pointer-events-auto z-10" />
                  <CarouselNext className="pointer-events-auto z-10" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border ${
                current === index ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image
                src={imageUrl || "/placeholder.svg?height=600&width=600"}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
