"use client"

import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes"
import { Marca } from "@/interfaces/marcas/marca.interface"
import Image from "next/image"
import Link from "next/link"

interface MarcasGridProps {
  marcas: Marca[]
}

export default function MarcasGrid({ marcas }: MarcasGridProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {marcas.map((marca) => (
        <Link
          href={`${FRONTEND_ROUTES.PROVEDORES}/${marca.nombre}`}
          key={marca.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer flex flex-col"
        >
          <div className="relative aspect-square">
            <Image
              src={marca.img?.url || "/placeholder.svg"}
              alt={marca.nombre}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold">{marca.nombre}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
