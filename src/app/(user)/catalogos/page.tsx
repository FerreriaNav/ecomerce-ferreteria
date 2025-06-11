'use client';

import { useEffect, useState } from 'react';
import CategoriesGrid from '@/modules/common/components/categories-grid/categories-grid';
import { TitleGradient } from '@/modules/common/components/titles/title-gradient';
import { Tags } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '@/modules/common/components/error/ErrorState';
import { Categoria } from '@/interfaces/categories/categories.interface';
import { useCatalogStore } from '@/store/catalog-ecommerce.store';

export default function CategoriasPage() {
  const categorias = useCatalogStore((state) => state.categorias);
  const loading = useCatalogStore((state) => state.loading);
  const error = useCatalogStore((state) => state.error);
  const initCatalog = useCatalogStore((state) => state.initCatalog);

  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Si aún no cargó el catálogo, lo inicializamos
    if (categorias?.length === 0 && !loading && !error) {
      initCatalog();
    }
  }, [categorias, loading, error, initCatalog]);

  useEffect(() => {
    if ((categorias?.length ?? 0) > 0) {
      const filtradas = (categorias ?? []).filter((c) => !c.principal);
      setFilteredCategorias(filtradas);
    }
  }, [categorias]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="animate-spin" size={40} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          icon={<Tags size={40} />}
          title="Error al cargar categorías"
          message={error}
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <TitleGradient
        title="Categorías"
        subtitle="Explora nuestras categorías"
        tagIcon={<Tags size={40} />}
      />
      <CategoriesGrid categories={filteredCategorias} />
    </main>
  );
}
