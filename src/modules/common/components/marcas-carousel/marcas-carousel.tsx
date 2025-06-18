"use client"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { TagsIcon, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Marca } from "@/interfaces/marcas/marca.interface"

interface BrandCarouselProps {
  marcas: Marca[]
  className?: string
  variant?: "circular" | "square"
  showId?: boolean
  title?: string
  subtitle?: string
}

export default function BrandCarousel({
  marcas,
  className,
  variant = "circular",
  showId = false,
  title,
  subtitle,
}: BrandCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const containerClasses =
    variant === "circular" ? "w-[120px] h-[120px] rounded-full" : "w-[140px] h-[100px] rounded-xl"

  return (
    <div className={`w-full space-y-6 ${className || ""}`}>
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>}
          <div className="flex items-center justify-center space-x-2">
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-secondary rounded-full" />
            <div className="h-1 w-4 bg-secondary rounded-full" />
          </div>
        </div>
      )}

      {/* Carousel */}
      <Carousel
        className="w-full max-w-5xl mx-auto"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {marcas.map((item, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-[160px] md:basis-[180px]">
              <Link
                href={`/catalogos/marcas/${item.documentId}`}
                className="group block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex flex-col items-center space-y-3 p-4 rounded-lg transition-all duration-300 hover:bg-muted/50">
                  {/* Image Container */}
                  <div
                    className={`relative ${containerClasses} overflow-hidden bg-gradient-to-br from-muted to-muted/50 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10`}
                  >
                    {item.img?.url ? (
                      <Image
                        src={item.img.url || "/placeholder.svg"}
                        alt={item.nombre}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TagsIcon
                          size={variant === "circular" ? 40 : 32}
                          className="text-muted-foreground/60 transition-colors duration-300 group-hover:text-primary/80"
                        />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Show ID Badge */}
                    {showId && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-medium"
                      >
                        {item.id}
                      </Badge>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="text-center space-y-1">
                    <h4 className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {item.nombre}
                    </h4>

                    {/* Hover Arrow */}
                    <div
                      className={`flex items-center justify-center transition-all duration-300 ${
                        hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      }`}
                    >
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300" />
        <CarouselNext className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300" />
      </Carousel>
    </div>
  )
}
