import { InfoEcommerce } from '@/interfaces/informacion-tienda/informacion-tienda.interface';
import { getInfoEcommerce } from '@/services/informacion-tienda/informacion-tienda-services';
import { create } from 'zustand';

interface InfoEcommerceState {
  infoEcommerce: InfoEcommerce | null;
  loading: boolean;
  error: string | null;
  initInfoEcommerce: () => Promise<void>;
  forceRefresh: () => Promise<void>; // Por si en algún momento quieres forzar fetch
}

export const useInfoEcommerceStore = create<InfoEcommerceState>((set) => ({
  infoEcommerce: null,
  loading: false,
  error: null,

  initInfoEcommerce: async () => {
    set({ loading: true, error: null });

    try {
      // Paso 1: Intentar cargar de localStorage
      const stored = localStorage.getItem('infoEcommerce');
      if (stored) {
        const parsed: InfoEcommerce = JSON.parse(stored);
        set({ infoEcommerce: parsed, loading: false });
        return; // Ya lo tenemos, no hacemos petición
      }

      // Paso 2: No había info, hacer fetch
      const response = await getInfoEcommerce();
      if (response && response.data) {
        localStorage.setItem('infoEcommerce', JSON.stringify(response.data));
        set({ infoEcommerce: response.data, loading: false });
      } else {
        set({ error: 'No se pudo obtener la información del ecommerce', loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ error: 'Error al cargar la información del ecommerce', loading: false });
    }
  },

  forceRefresh: async () => {
    set({ loading: true, error: null });

    try {
      const response = await getInfoEcommerce();
      if (response && response.data) {
        localStorage.setItem('infoEcommerce', JSON.stringify(response.data));
        set({ infoEcommerce: response.data, loading: false });
      } else {
        set({ error: 'No se pudo obtener la información del ecommerce', loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ error: 'Error al actualizar la información del ecommerce', loading: false });
    }
  },
}));
