import { InfoEcommerce } from '@/interfaces/informacion-tienda/informacion-tienda.interface';
import { getInfoEcommerce } from '@/services/informacion-tienda/informacion-tienda-services';
import { create } from 'zustand';

import respaldo from "@/contants/json/template-datos-ecommerce.json";

interface InfoEcommerceState {
  infoEcommerce: InfoEcommerce | null;
  loading: boolean;
  error: string | null;
  initInfoEcommerce: () => Promise<void>;
  forceRefresh: () => Promise<void>; // Por si en algún momento quieres forzar fetch
}

  const CACHE_EXPIRATION_MINUTES = 10;

export const useInfoEcommerceStore = create<InfoEcommerceState>((set) => ({
  infoEcommerce: respaldo.infoEcommerce as unknown as InfoEcommerce,
  loading: false,
  error: null,


initInfoEcommerce: async () => {
  set({ loading: true, error: null });

  try {
    const stored = localStorage.getItem('infoEcommerce');
    if (stored) {
      const { data, timestamp } = JSON.parse(stored);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRATION_MINUTES * 60 * 1000;

      if (!isExpired) {
        set({ infoEcommerce: data, loading: false });
        return;
      }
    }

    // Si no hay cache o está expirado
    const response = await getInfoEcommerce();
    if (response && response.data) {
      localStorage.setItem('infoEcommerce', JSON.stringify({
        data: response.data,
        timestamp: Date.now(),
      }));
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
        localStorage.setItem('infoEcommerce', JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
        }));
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