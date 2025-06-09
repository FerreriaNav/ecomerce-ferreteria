import Link from "next/link"
import Image from "next/image"
import type { CarrucelItemColorFondoImagen } from "./types/carousel"

interface Props {
  item: CarrucelItemColorFondoImagen
}

export function CarouselItemColorFondoImagen({ item }: Props) {
  const renderText = (
    <div className="flex flex-col animate-in fade-in slide-in-from-left-6 duration-700">
      {item.titulo && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          {item.titulo}
        </h2>
      )}
      {item.subtitulo && (
        <p className="text-lg opacity-80 mb-6">
          {item.subtitulo}
        </p>
      )}
      {item.mostrarBoton && item.botonTexto && item.link && (
        <button
          className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: item.colorTexto || "#ffffff",
            color: item.colorFondo || "#000000",
          }}
        >
          {item.botonTexto}
        </button>
      )}
    </div>
  )

  const renderImage = (
    <div className="relative h-64 md:h-80 animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
      <Image
        src={item.imagen.url || "/placeholder.svg"}
        alt={item.imagen.alternativeText || "Imagen"}
        fill
        className="object-contain transition-transform duration-300 hover:scale-105"
      />
    </div>
  )

  const getContentLayout = () => {
    if (item.posicionTexto === "izquierda") {
      return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">{renderText}</div>
          <div className="order-1 md:order-2">{renderImage}</div>
        </div>
      )
    }

    if (item.posicionTexto === "derecha") {
      return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          <div className="order-1">{renderText}</div>
          <div className="order-2">{renderImage}</div>
        </div>
      )
    }

    // Centro
    return (
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={item.imagen.url || "/placeholder.svg"}
            alt={item.imagen.alternativeText || "Imagen"}
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-2xl">{renderText}</div>
      </div>
    )
  }

  const content = (
    <div
      className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center px-6 md:px-12 transition-all duration-300"
      style={{
        backgroundColor: item.colorFondo || "#ffffff",
        color: item.colorTexto || "#000000",
      }}
    >
      {getContentLayout()}
    </div>
  )

  if (item.link && !item.mostrarBoton) {
    return (
      <Link href={item.link} className="block w-full h-full">
        {content}
      </Link>
    )
  }

  if (item.link && item.mostrarBoton) {
    return (
      <div className="relative w-full h-full">
        {content}
        <Link href={item.link} className="absolute inset-0" />
      </div>
    )
  }

  return content
}
