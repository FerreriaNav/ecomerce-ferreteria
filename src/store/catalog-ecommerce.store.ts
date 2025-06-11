import { create } from 'zustand';
import { InfoEcommerce } from '@/interfaces/informacion-tienda/informacion-tienda.interface';
import { getInfoEcommerce } from '@/services/informacion-tienda/informacion-tienda-services';
import { getMarcas } from '@/services/marcas/marcas-services';
import { Marca } from '@/interfaces/marcas/marca.interface';
import { Categoria } from '@/interfaces/categories/categories.interface';
import { getCategorias } from '@/services/categories/categories-services';

interface CatalogState {
  infoEcommerce: InfoEcommerce | null;
  marcas: Marca[] | null;
  categorias: Categoria[] | null;
  loading: boolean;
  error: string | null;
  initCatalog: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

const CACHE_EXPIRATION_MINUTES = 10;

const CATALOG_CACHE_KEY = 'catalogData';

export const useCatalogStore = create<CatalogState>((set) => ({
  infoEcommerce: null,
  marcas: null,
  categorias: null,
  loading: false,
  error: null,

  initCatalog: async () => {
    set({ loading: true, error: null });

    try {
      // Paso 1: Leer de localStorage
      const stored = localStorage.getItem(CATALOG_CACHE_KEY);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRATION_MINUTES * 60 * 1000;

        if (!isExpired) {
          set({
            infoEcommerce: data.infoEcommerce,
            marcas: data.marcas,
            categorias: data.categorias,
            loading: false
          });
          return; // Cache válida, no hacemos fetch
        }
      }

      // Paso 2: Fetch en paralelo
      const [infoResponse, marcasResponse, categoriasResponse] = await Promise.all([
        getInfoEcommerce(),
        getMarcas(),
        getCategorias()
      ]);

      if (infoResponse && infoResponse.data && marcasResponse && marcasResponse.data && categoriasResponse && categoriasResponse.data) {
        const catalogData = {
          infoEcommerce: infoResponse.data,
          marcas: marcasResponse.data,
          categorias: categoriasResponse.data,
        };

        localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({
          data: catalogData,
          timestamp: Date.now(),
        }));

        set({ ...catalogData, loading: false });
      } else {
        set({ error: 'No se pudo obtener toda la información del catálogo', loading: false });
      }

    } catch (error) {
      console.error(error);
      set({ error: 'Error al cargar el catálogo', loading: false });
    }
  },

  forceRefresh: async () => {
    set({ loading: true, error: null });

    try {
      const [infoResponse, marcasResponse, categoriasResponse] = await Promise.all([
        getInfoEcommerce(),
        getMarcas(),
        getCategorias()
      ]);

      if (infoResponse && infoResponse.data && marcasResponse && marcasResponse.data && categoriasResponse && categoriasResponse.data) {
        const catalogData = {
          infoEcommerce: infoResponse.data,
          marcas: marcasResponse.data,
          categorias: categoriasResponse.data,
        };

        localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({
          data: catalogData,
          timestamp: Date.now(),
        }));

        set({ ...catalogData, loading: false });
      } else {
        set({ error: 'No se pudo actualizar toda la información del catálogo', loading: false });
      }

    } catch (error) {
      console.error(error);
      set({ error: 'Error al actualizar el catálogo', loading: false });
    }
  },
}));
