import Link from "next/link"
import type { CarrucelItemTextoAvanzado } from "./types/carousel"

interface Props {
  item: CarrucelItemTextoAvanzado
}

export function CarouselItemTextoAvanzado({ item }: Props) {
  const getTextAlignment = () => {
    switch (item.posicionTexto) {
      case "izquierda":
        return "text-left items-start"
      case "derecha":
        return "text-right items-end"
      case "centro":
      default:
        return "text-center items-center"
    }
  }

  const content = (
    <div
      className={`relative w-full h-full min-h-[400px] md:min-h-[500px] flex flex-col justify-center px-6 md:px-12 lg:px-16 transition-all duration-300 ${getTextAlignment()}`}
      style={{
        backgroundColor: item.colorFondo || "#f8f9fa",
        color: item.colorTexto || "#333333",
      }}
    >
      <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {item.titulo && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-in fade-in slide-in-from-left-6 duration-700 delay-150">
            {item.titulo}
          </h2>
        )}
        {item.subtitulo && (
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed animate-in fade-in slide-in-from-left-6 duration-700 delay-300">
            {item.subtitulo}
          </p>
        )}
        {item.mostrarBoton && item.botonTexto && item.link && (
          <button
            className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 animate-in fade-in slide-in-from-left-6 duration-700 delay-500"
            style={{
              backgroundColor: item.colorTexto || "#ffffff",
              color: item.colorFondo || "#333333",
            }}
          >
            {item.botonTexto}
          </button>
        )}
      </div>
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
