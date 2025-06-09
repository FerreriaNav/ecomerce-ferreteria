import Link from "next/link"
import Image from "next/image"
import type { CarrucelItemProducto } from "./types/carousel"

interface Props {
  item: CarrucelItemProducto
}

export function CarouselItemProducto({ item }: Props) {
  return (
    <Link href={`/producto/${item.producto.slug}`} className="block w-full h-full">
      <div
        className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center px-6 md:px-12 transition-all duration-300"
        style={{
          backgroundColor: item.colorFondo || "#ffffff",
          color: item.colorTexto || "#333333",
        }}
      >
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-in fade-in slide-in-from-left-6 duration-700">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{item.producto.nombre}</h2>
            <p className="text-lg opacity-80 mb-6">Descubre este increíble producto</p>
            <button
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: item.colorTexto || "#1f2937",
                color: item.colorFondo || "#ffffff",
              }}
            >
              Ver Producto
            </button>
          </div>
          {item.producto.coverUrl && (
            <div className="order-1 md:order-2 relative h-64 md:h-80 animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
              <Image
                src={item.producto.coverUrl || "/icons/logo.webp"}
                alt={item.producto.nombre}
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
