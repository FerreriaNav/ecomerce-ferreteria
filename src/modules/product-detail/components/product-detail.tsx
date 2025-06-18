"use client"

import { ChevronLeft, Heart, ShoppingCart } from "lucide-react"
import ProductImageGallery from "./product-image-galery"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  type Descripcion,
  type GrupoAtributo,
  type Products,
  ProductType,
} from "@/interfaces/products/products.interface"
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/products-cart.store"
import { useState, useEffect } from "react"
// import { ProductPriceDetail } from "./product-price"
// import { useSession } from "next-auth/react"
// import { getPrecioMinimoVariantes } from "@/lib/price-descuento"
import { useFavoritesStore } from "@/store/product-favorite.store"

interface ProductDetailProps {
  product: Products
  selectedSlug: string
}

function renderDescription(descripcion: Descripcion[]) {
  return descripcion.map((block, blockIndex) => {
    if (block.type === "paragraph") {
      return (
        <p key={blockIndex} className="mb-4">
          {block.children.map((child, childIndex) => {
            if (child.type === "text") {
              return child.text.split("\n").map((line, lineIndex) => (
                <span key={`${childIndex}-${lineIndex}`}>
                  {line}
                  {lineIndex < child.text.split("\n").length - 1 && <br />}
                </span>
              ))
            }
            return null
          })}
        </p>
      )
    }
    return null
  })
}

export function ProductDetail({ product, selectedSlug }: ProductDetailProps) {
  const router = useRouter()
  const { addToCart } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  // const { data } = useSession()

  const [selectionError, setSelectionError] = useState<string | null>(null)

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [availableAttributes, setAvailableAttributes] = useState<Record<string, string[]>>({})
  const [selectedVariant, setSelectedVariant] = useState<Products | null>(null)

  // Función para obtener el producto actual (variante seleccionada o producto principal)
  const getCurrentProduct = (): Products => {
    if (product.tipo === ProductType.SIMPLE) {
      return product
    }
    return selectedVariant || product
  }

  // Función para verificar si el producto actual está en favoritos
  const isCurrentProductFavorite = (): boolean => {
    const currentProduct = getCurrentProduct()
    return isFavorite(currentProduct.id)
  }

  // Agrupar los atributos por tipo (como color, tamaño)
  const groupVariantAttributes = (product: Products): GrupoAtributo[] => {
    const atributosPorGrupo: { [key: string]: GrupoAtributo } = {}
    product.variantes.forEach((variante) => {
      variante.atributos?.forEach((atributo) => {
        if (!atributosPorGrupo[atributo.tipoAtributo]) {
          atributosPorGrupo[atributo.tipoAtributo] = {
            nombre: atributo.tipoAtributo,
            values: [],
          }
        }
        if (!atributosPorGrupo[atributo.tipoAtributo].values?.includes(atributo.valor)) {
          atributosPorGrupo[atributo.tipoAtributo].values?.push(atributo.valor)
        }
      })
    })
    return Object.values(atributosPorGrupo)
  }

  // Filtrar variantes en base a los atributos seleccionados
  const getAvailableAttributes = (selectedAttributes: Record<string, string>) => {
    // 1. Filtrar variantes que coincidan parcialmente con los atributos seleccionados
    const filteredVariants = product.variantes.filter((variante) => {
      return Object.entries(selectedAttributes).every(([tipoAtributo, valor]) =>
        variante.atributos?.some((atributo) => atributo.tipoAtributo === tipoAtributo && atributo.valor === valor),
      )
    })

    // 2. Recolectar atributos disponibles según las variantes filtradas
    const newAvailableAttributes: Record<string, string[]> = {}
    filteredVariants.forEach((variante) => {
      variante.atributos?.forEach((atributo) => {
        if (!newAvailableAttributes[atributo.tipoAtributo]) {
          newAvailableAttributes[atributo.tipoAtributo] = []
        }
        if (!newAvailableAttributes[atributo.tipoAtributo].includes(atributo.valor)) {
          newAvailableAttributes[atributo.tipoAtributo].push(atributo.valor)
        }
      })
    })

    // 3. Asegurar que todos los tipos de atributos estén presentes
    const allAttributeTypes = new Set<string>()
    product.variantes.forEach((variante) => {
      variante.atributos?.forEach((atributo) => {
        allAttributeTypes.add(atributo.tipoAtributo)
      })
    })

    allAttributeTypes.forEach((tipo) => {
      if (!newAvailableAttributes[tipo]) {
        newAvailableAttributes[tipo] = []
      }
    })

    // 4. Eliminar atributos seleccionados que ya no están disponibles
    const cleanedSelectedAttributes = { ...selectedAttributes }
    Object.entries(cleanedSelectedAttributes).forEach(([tipo, valor]) => {
      if (newAvailableAttributes[tipo] && !newAvailableAttributes[tipo].includes(valor)) {
        delete cleanedSelectedAttributes[tipo]
      }
    })

    // 5. Aplicar los cambios
    setSelectedAttributes(cleanedSelectedAttributes)
    setAvailableAttributes(newAvailableAttributes)
  }

  // Inicializar atributos seleccionados si hay un slug seleccionado
  useEffect(() => {
    if (!selectedSlug || !product.variantes?.length) return

    const matchedVariant = product.variantes.find((v) => v.slug === selectedSlug)

    if (matchedVariant && matchedVariant.atributos) {
      const atributosIniciales: Record<string, string> = {}
      matchedVariant.atributos.forEach((atributo) => {
        atributosIniciales[atributo.tipoAtributo] = atributo.valor
      })

      setSelectedAttributes(atributosIniciales)
    }
  }, [selectedSlug, product.variantes])

  // Obtener la variante seleccionada en base a los atributos seleccionados
  useEffect(() => {
    const variantMatch = product.variantes.find((variante) => {
      if (!variante.atributos) return false

      // Checar cantidad de atributos (match exacto con los seleccionados)
      if (variante.atributos.length !== Object.keys(selectedAttributes).length) {
        return false
      }

      return variante.atributos.every((atributo) => selectedAttributes[atributo.tipoAtributo] === atributo.valor)
    })

    setSelectedVariant(variantMatch || null)
  }, [selectedAttributes, product.variantes])

  const handleSelectAttribute = (tipoAtributo: string, valor: string) => {
    setSelectedAttributes((prev) => {
      const newSelectedAttributes = { ...prev, [tipoAtributo]: valor }
      getAvailableAttributes(newSelectedAttributes) // Actualiza las opciones disponibles
      return newSelectedAttributes
    })
  }

  const handleDeselectAttribute = (tipoAtributo: string) => {
    setSelectedAttributes((prev) => {
      const newSelectedAttributes = { ...prev }
      delete newSelectedAttributes[tipoAtributo]
      getAvailableAttributes(newSelectedAttributes) // Actualiza las opciones disponibles
      return newSelectedAttributes
    })
  }

  const handleAddToCart = () => {
    if (product.tipo === ProductType.SIMPLE) {
      addToCart(product)
      return
    }

    if (!selectedVariant) {
      setSelectionError("Debes seleccionar todas las opciones disponibles.")
      return
    }
    setSelectionError(null) // limpiar errores
    addToCart(selectedVariant)
  }

  // Función mejorada para manejar favoritos
  const handleToggleFavorite = () => {
    const currentProduct = getCurrentProduct()
    toggleFavorite(currentProduct)
  }

  const groupedAttributes = groupVariantAttributes(product)
  console.log(product)

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver a productos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <ProductImageGallery
            images={
              selectedVariant?.galleryUrls?.length
                ? selectedVariant.galleryUrls
                : selectedVariant?.coverUrl
                  ? [selectedVariant.coverUrl]
                  : product.galleryUrls?.length
                    ? product.galleryUrls
                    : product?.coverUrl
                      ? [product.coverUrl]
                      : ["/placeholder.svg?height=300&width=300"]
            }
          />
        </div>

        <div className="order-1 md:order-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.nombre}</h1>
              <Badge variant={"outline"}>{product.marca?.nombre}</Badge>

              <div className="flex flex-wrap gap-2 mt-2">
                {product.categorias
                  .filter((c) => !c.principal)
                  .map((categoria) => (
                    <Badge key={categoria.id}>{categoria.nombre}</Badge>
                  ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {product.categorias
                  .filter((c) => c.principal)
                  .map((subcategoria) => (
                    <Badge key={subcategoria.id} variant="outline">
                      {subcategoria.nombre}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* {(selectedVariant || product.tipo == ProductType.BASE) && (
              <ProductPriceDetail
                product={selectedVariant}
                minPrice={getPrecioMinimoVariantes(product)}
                isLoggedIn={data?.user ? true : false}
              />
            )}
            {product.tipo == ProductType.SIMPLE && (
              <ProductPriceDetail
                product={product}
                minPrice={getPrecioMinimoVariantes(product)}
                isLoggedIn={data?.user ? true : false}
              />
            )} */}

            <div className="space-y-6">
              {/* Sección atributos dinámicos           -------------------------------*/}
              {product.variantes.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Selecciona atributos</h2>

                  {groupedAttributes.map(({ nombre, values }) => {
                    // Solo habilitar los valores que coinciden con los atributos disponibles
                    const availableValues = availableAttributes[nombre] || values

                    return (
                      <div key={nombre} className="mb-6">
                        <h3 className="font-semibold mb-2">{nombre}</h3>
                        <div className="flex gap-2 flex-wrap">
                          {values?.map((valor) => {
                            const isSelected = selectedAttributes[nombre] === valor
                            const isDisabled = !availableValues.includes(valor)

                            return (
                              <Button
                                key={valor}
                                variant="outline"
                                className={`text-sm cursor-pointer ${
                                  isSelected ? "border-2 border-primary" : "border"
                                } ${isDisabled ? " opacity-50" : ""}`}
                                onClick={() => {
                                  // if (isDisabled) return; // Si está desactivado, no hacer nada
                                  if (isSelected) {
                                    handleDeselectAttribute(nombre) // Deseleccionar
                                  } else {
                                    handleSelectAttribute(nombre, valor) // Seleccionar
                                  }
                                }}
                              >
                                {valor}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              {selectionError && <p className="text-sm text-red-500">{selectionError}</p>}
              <div className="flex gap-4">
                <Button
                  className="flex-1 cursor-pointer"
                  size="lg"
                  onClick={() => {
                    handleAddToCart()
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al carrito
                </Button>

                <Button onClick={handleToggleFavorite} variant="ghost" size="icon" className="shrink-0">
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isCurrentProductFavorite() ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-400"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="descripcion">
              <TabsList className="w-full">
                <TabsTrigger value="descripcion" className="flex-1">
                  Descripción
                </TabsTrigger>
                <TabsTrigger value="detalles" className="flex-1">
                  Detalles
                </TabsTrigger>
              </TabsList>
              <TabsContent value="descripcion" className="mt-4">
                <Card>
                  <CardContent className="pt-6">{renderDescription(product.descripcion)}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="detalles" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-muted-foreground">slug:</div>
                      <div className="text-sm">{product.slug}</div>

                      <div className="text-sm text-muted-foreground">Categorías:</div>
                      <div className="text-sm">{product.categorias.map((cat) => cat.nombre).join(", ")}</div>
                      <div className="text-sm text-muted-foreground">Marca:</div>
                      <div className="text-sm">{product.marca?.nombre}</div>

                      <div className="text-sm text-muted-foreground">Fecha de publicación:</div>
                      <div className="text-sm">{new Date(product.publishedAt).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
