"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Tag } from "lucide-react"
import { Categoria } from "@/interfaces/categories/categories.interface"

interface CategoriesGridProps {
  categories: Categoria[]
}

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [currentCategory, setCurrentCategory] = useState<Categoria | null>(null)

  const handleCategoryClick = (category: Categoria) => {
    if (category.subcategorias && category.subcategorias.length > 0) {
      setCurrentCategory(category)
    }
  }

  const handleBackClick = () => {
    setCurrentCategory(null)
  }

  const displayCategories = currentCategory ? currentCategory.subcategorias || [] : categories

  return (
    <div>
      {currentCategory && (
        <div className="mb-4 ">
          <button onClick={handleBackClick} className="flex items-center text-red-600 hover:text-red-800 font-medium">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Volver a todas las categorías
          </button>
          <h2 className="text-xl font-bold mt-2">Subcategorías de {currentCategory.nombre}</h2>
        </div>
      )}

     <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <Link href={`/categoria/${category.nombre}`} className="flex flex-col h-full">
              <div className="relative">
                {category.img && (
                  <div className="aspect-square relative">
                    <Image
                      src={category.img.url || "/placeholder.svg"}
                      alt={category.nombre || "img categoria"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {category.descuento && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {
                        `${category.descuento.valor}${category.descuento.tipo} OFF`
                    }
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-center">{category.nombre}</h3>
                {category.subcategorias && category.subcategorias.length > 0 && (
                  <p className="text-xs text-center text-gray-500 mt-1">
                    {category.subcategorias.length} subcategorías
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
