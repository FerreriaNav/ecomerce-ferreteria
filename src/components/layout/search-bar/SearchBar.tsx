"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CartDropdown from "../../../modules/cart/cart-dropdown/cart-dropdown";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const handleSearch = useCallback(
  (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === "") return;

    const currentSearchParam = searchParams.get("search");
    const shouldUpdateSearch = currentSearchParam !== trimmedQuery;
    if (!shouldUpdateSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", trimmedQuery);
    params.set("page", "1");
    params.set("pageSize", "10");

    const isInCategoriaOrMarca =
      pathname.startsWith("/categoria/") || pathname.startsWith("/marca/");

    const targetUrl = isInCategoriaOrMarca
      ? `?${params.toString()}`
      : `/s/${trimmedQuery}?${params.toString()}`;

    router.push(targetUrl);
  },
  [router, searchParams, pathname]
);

  useEffect(() => {
    if (searchQuery.trim() === "") return; // ⛔ Ignora si está vacío

    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("search")) {
    params.delete("search");
    setSearchQuery("");
    router.replace(`${pathname}?${params.toString()}`);
  }
}, [pathname,router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return; // ⛔ Ignora si está vacío
    handleSearch(searchQuery);
  };

  return (
    <div className="ml-auto flex items-center">
      <form
        onSubmit={onSubmit}
        className="relative flex items-center gap-2 mr-4 w-[200px] lg:w-[300px]"
      >
        <div className="relative w-full">
          <Search
            onClick={() => handleSearch(searchQuery)}
            className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
          />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </form>

      <CartDropdown />
    </div>
  );
};
