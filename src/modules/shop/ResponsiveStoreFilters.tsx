"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { StoreFilters } from "./StoreFilters"; // mismo archivo que ya tienes
import { Categoria } from "@/interfaces/categories/categories.interface";
import { Marca } from "@/interfaces/marcas/marca.interface";
import { Card } from "@/components/ui/card";
import { ProductFilters } from "@/services/products/products-services";

interface Props {
  categorias: Categoria[];
  marcas: Marca[];
  selectedFilters?: ProductFilters;
  marcaBase?: string;
  categoriaBase?: string;
}

export const ResponsiveStoreFilters = ({
  categorias,
  marcas,
  marcaBase,
  categoriaBase,
  selectedFilters,
}: Props) => {
  return (
    <>
      {/* Mobile: Button to open sheet */}
      <div className="md:hidden mb-4">
        <div></div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Mostrar filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto max-h-screen">
            <SheetTitle></SheetTitle>
            <StoreFilters
              marcaBase={marcaBase}
              categoriaBase={categoriaBase}
              categorias={categorias}
              marcas={marcas}
              selectedFilters={selectedFilters}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Show filters as static card */}
      <Card className="hidden md:block">
        <StoreFilters
          marcaBase={marcaBase}
          categoriaBase={categoriaBase}
          categorias={categorias}
          marcas={marcas}
          selectedFilters={selectedFilters}
        />
      </Card>
    </>
  );
};
