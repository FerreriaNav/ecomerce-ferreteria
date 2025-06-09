"use client";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Categoria } from "@/interfaces/categories/categories.interface";
import { Marca } from "@/interfaces/marcas/marca.interface";
import { ProductFilters } from "@/services/products/products-services";

interface StoreFiltersProps {
  categorias: Categoria[];
  marcas: Marca[];
  selectedFilters?: ProductFilters;
  categoriaBase?: string; // Nuevo prop opcional
  marcaBase?: string; // Nuevo prop opcional
}

export const StoreFilters = ({
  categorias,
  marcas,
  selectedFilters,
  categoriaBase,
  marcaBase,
}: StoreFiltersProps) => {
  const router = useRouter();
  const categoriasFiltradas = categoriaBase
    ? categorias.filter((cat) => cat.nombre === categoriaBase)
    : categorias.filter((cat) => !cat.principal);

  const marcasFiltradas = marcaBase
    ? marcas.filter((marca) => marca.nombre === marcaBase)
    : marcas;

  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(
    selectedFilters?.categorias ?? []
  );

  const [selectedMarcas, setSelectedMarcas] = useState<string[]>(
    selectedFilters?.marcas ?? []
  );
  const [minPrice, setMinPrice] = useState(
    selectedFilters?.precioMin?.toString() ?? "0"
  );
  const [maxPrice, setMaxPrice] = useState(
    selectedFilters?.precioMax?.toString() ?? "99999"
  );
  const [priceRange, setPriceRange] = useState([
    Number(selectedFilters?.precioMin?.toString() ?? "0"),
    Number(selectedFilters?.precioMax?.toString() ?? "99999"),
  ]);

const updateURL = useCallback(() => {
  const currentParams = new URLSearchParams(window.location.search);

  if (selectedCategorias.length)
    currentParams.set("categorias", selectedCategorias.join(","));
  else currentParams.delete("categorias");

  if (selectedMarcas.length)
    currentParams.set("marcas", selectedMarcas.join(","));
  else currentParams.delete("marcas");

  if (minPrice !== "0")
    currentParams.set("precioMin", minPrice.toString());
  else currentParams.delete("precioMin");

  if (maxPrice !== "99999")
    currentParams.set("precioMax", maxPrice.toString());
  else currentParams.delete("precioMax");

  // Resetear la paginación si se aplica un nuevo filtro
  currentParams.set("page", "1");

  router.push(`?${currentParams.toString()}`);
}, [selectedCategorias, selectedMarcas, minPrice, maxPrice, router]);

  useEffect(() => {
    updateURL();
  }, [selectedCategorias, selectedMarcas, updateURL]);

  const applyPriceFilter = () => {
    updateURL();
  };

  const toggleItem = (prev: string[], item: string) =>
    prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item];

  return (
    <div className="w-full max-w-xs p-4 sticky ">
      <h2 className="text-xl font-semibold text-primary mb-4">Filtros</h2>

      <div className="space-y-6">
        {/* Categorías con Subcategorías */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between w-full font-medium">
            <span>Categorías</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {categoriasFiltradas.map((categoria) => (
              <div key={categoria.id}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCategorias.includes(categoria.nombre)}
                    onCheckedChange={() =>
                      setSelectedCategorias((prev) =>
                        toggleItem(prev, categoria.nombre)
                      )
                    }
                    id={`cat-${categoria.id}`}
                  />
                  <Label htmlFor={`cat-${categoria.id}`} className="text-sm">
                    {categoria.nombre}
                  </Label>
                </div>

                <div className="ml-5 mt-1 space-y-1">
                  {(categoria.subcategorias || []).map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCategorias.includes(sub.nombre)}
                        onCheckedChange={() =>
                          setSelectedCategorias((prev) =>
                            toggleItem(prev, sub.nombre)
                          )
                        }
                        id={`sub-${sub.id}`}
                      />

                      <Label
                        htmlFor={`sub-${sub.id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {sub.nombre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Marcas */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between w-full font-medium">
            <span>Marcas</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {marcasFiltradas.map((marca) => (
              <div key={marca.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedMarcas.includes(marca.nombre)}
                  onCheckedChange={() =>
                    setSelectedMarcas((prev) => toggleItem(prev, marca.nombre))
                  }
                  id={`marca-${marca.id}`}
                />
                <Label htmlFor={`marca-${marca.id}`} className="text-sm">
                  {marca.nombre}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Precio */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between w-full font-medium">
            <span>Precio</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <Slider
              value={priceRange}
              min={0}
              max={9999}
              step={1}
              onValueChange={(values) => {
                setPriceRange(values);
                setMinPrice(values[0].toString());
                setMaxPrice(values[1].toString());
              }}
              className="mb-4"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="text-xs"
              />
              <span className="text-sm">-</span>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-xs"
              />
            </div>
            <Button onClick={applyPriceFilter} className="mt-2 w-full">
              Aplicar precio
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
