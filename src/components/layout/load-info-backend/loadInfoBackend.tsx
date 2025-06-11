'use client';

import { useCatalogStore } from '@/store/catalog-ecommerce.store';
import { useEffect } from 'react';

export default function CatalogLoader() {
  const initCatalog = useCatalogStore((state) => state.initCatalog);
  const loading = useCatalogStore((state) => state.loading);
  const error = useCatalogStore((state) => state.error);

  useEffect(() => {
    initCatalog();
  }, [initCatalog]);

  if (loading) return null; // Opcional: podrías mostrar un skeleton global
  if (error) {
    console.error('Error al cargar catálogo:', error);
    return null; // Opcional: mostrar un banner global de error
  }

  return null; // No renderiza nada, solo inicializa el store
}
