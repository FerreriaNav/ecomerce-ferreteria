"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid2X2, List } from "lucide-react";
import { ProductCard } from "@/modules/common/components/product-carousel/product-card";
import { ProductCardHorizontal } from "./productCardHorizontal";
import type { Products } from "@/interfaces/products/products.interface";
import type { DataResponse } from "@/interfaces/data/response.interface";
import { SortOption } from "@/services/products/products-services";

export interface ProductGridProps {
  products: DataResponse<Products[]> | null;
}

type ViewMode = "grid" | "list";

export function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(
    () => Math.max(Number(searchParams.get("page") || 1), 1),
    [searchParams]
  );
  const sortBy = useMemo(
    () => (searchParams.get("sort") || "featured") as SortOption,
    [searchParams]
  );
  const pageSize = useMemo(
    () => Math.max(Number(searchParams.get("pageSize") || 10), 10),
    [searchParams]
  );

  const totalItems = products?.meta?.pagination.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = Math.min((page - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(page * pageSize, totalItems);

  const updateQueryParams = useCallback(
    (param: string, value: string | number) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set(param, value.toString());
      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  const updateMultipleQueryParams = useCallback(
    (updates: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(updates).forEach(([key, value]) => {
        current.set(key, value.toString());
      });
      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const updates: Record<string, string | number> = {};
    if (!searchParams.get("page")) updates.page = 1;
    if (!searchParams.get("pageSize")) updates.pageSize = 10;

    if (Object.keys(updates).length > 0) {
      updateMultipleQueryParams(updates);
    }
  }, [searchParams, updateMultipleQueryParams]);

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = pageSize;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => updateQueryParams("page", 1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => updateQueryParams("page", i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => updateQueryParams("page", totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="space-y-4 p-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Mostrando {startItem}-{endItem} de {totalItems} productos
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              updateMultipleQueryParams({ page: "1", pageSize: value });
            }}
            defaultValue="10"
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Mostrar" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  mostrar {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              updateMultipleQueryParams({ page: "1", sort: value });
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
              aria-label="Vista de cuadrícula"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
              aria-label="Vista de lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products?.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products?.data.map((product) => (
            <ProductCardHorizontal key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && updateQueryParams("page", page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {generatePaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < totalPages && updateQueryParams("page", page + 1)
                }
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
