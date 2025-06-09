"use client"

import { useState, useEffect, useRef } from "react"
import { Pause, Play } from "lucide-react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import type {  CarrucelItem } from "./types/carousel"
import { CarouselItemTextoAvanzado } from "./carousel-item-texto-avanzado"
import { CarouselItemBanner } from "./carousel-item-banner"
import { CarouselItemProducto } from "./carousel-item-producto"
import { CarouselItemColorFondoImagen } from "./carousel-item-color-fondo-imagen"

export interface CarouselProps {
  items: CarrucelItem[]
  autoplay?: boolean
  intervalo?: number
  className?: string
  showControls?:boolean
  showIndicators?: boolean
}

export function StrapiCarousel({
  items,
  autoplay = true,
  intervalo = 5000,
  className = "",
  showControls = true,
  showIndicators = true,
}: CarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [progress, setProgress] = useState(0)

  const autoplayRef = useRef(
    Autoplay({
      delay: intervalo,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: autoplay,
    }),
  )

 useEffect(() => {
  if (!api) return

  const snapList = api.scrollSnapList?.()
  if (Array.isArray(snapList) && snapList.length > 0) {
    setCount(snapList.length)
    setCurrent(api.selectedScrollSnap() + 1)
  }

  const onSelect = () => {
    setCurrent(api.selectedScrollSnap() + 1)
    setProgress(0)
  }

  api.on("select", onSelect)

  // Handle autoplay state
  const autoplayPlugin = autoplayRef.current
  if (autoplayPlugin) {
    if (isPlaying) {
      autoplayPlugin.play()
    } else {
      autoplayPlugin.stop()
    }
  }

  return () => {
    api.off("select", onSelect)
  }
}, [api, isPlaying])

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || !autoplay) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 100 / (intervalo / 100)
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [current, isPlaying, autoplay, intervalo])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    const autoplayPlugin = autoplayRef.current
    if (autoplayPlugin) {
      if (isPlaying) {
        autoplayPlugin.stop()
      } else {
        autoplayPlugin.play()
      }
    }
  }

  const goToSlide = (index: number) => {
    api?.scrollTo(index)
  }

  const renderCarouselItem = (item: CarrucelItem) => {
    switch (item.__component) {
      case "carrucel.carrucel-item-texto-avanzado":
        return <CarouselItemTextoAvanzado item={item} />
      case "carrucel.carrucel-item-banner":
        return <CarouselItemBanner item={item} />
      case "carrucel.carrucel-item-producto":
        return <CarouselItemProducto item={item} />
      case "carrucel.carrucel-item-color-fondo-imagen":
        return <CarouselItemColorFondoImagen item={item} />
      default:
        return null
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  if (items.length === 1) {
  return (
    <div className={`relative w-full bg-gray-100 overflow-hidden ${className}`}>
      <div className="h-full w-full">{renderCarouselItem(items[0])}</div>
    </div>
  )
}

  return (
    <div className={`relative w-full bg-gray-100 overflow-hidden ${className}`}>
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={autoplay ? [autoplayRef.current] : []}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {items.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="h-full w-full">{renderCarouselItem(item)}</div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        {showControls && items.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110" />
          </>
        )}
      </Carousel>

      {/* Play/Pause button */}
      {autoplay && items.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm hover:scale-110 animate-in fade-in duration-500"
          aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <Play className="w-5 h-5 transition-transform duration-200" />
          )}
        </button>
      )}

      {/* Dots indicator */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === current - 1 ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {autoplay && isPlaying && items.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Slide counter */}
      {items.length > 1 && (
        <div className="absolute top-4 left-4 z-10 bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm animate-in fade-in duration-500">
          {current} / {count}
        </div>
      )}
    </div>
  )
}
