// src/store/pedido.store.ts
import {
  InformacionEnvioCreateDto,
  ProductoSeleccionadoInput,
} from "@/interfaces/orders/pedido.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CotizacionCreateDto,
  EstatusCotizacion,
  MetodoPago,
} from "@/interfaces/cotizaciones/cotizacion.interface";

interface CotizacionStore {
  cotizacion: CotizacionCreateDto;
  loading: boolean;
  error: string | null;
  success: boolean;

  setCliente: (cliente: string | number) => void;
  setProductos: (productos: ProductoSeleccionadoInput[]) => void;
  setInformacionEnvio: (info: InformacionEnvioCreateDto) => void;
  setNotaCliente: (nota: string) => void;
  setMetodoPago: (metodo: MetodoPago) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;

  resetTemporaryStates: () => void;
  resetCotizacion: () => void;
}

export const useCotizacionStore = create<CotizacionStore>()(
  persist(
    (set) => ({
      cotizacion: {
        cliente: 0,
        productos: [],
        informacionEnvio: null,
        metodoPago: MetodoPago.EFECTIVO,
        estatus:EstatusCotizacion.PENDIENTE,
      },

      loading: false,
      error: null,
      success: false,

      setCliente: (cliente) =>
        set((state) => ({
          cotizacion: { ...state.cotizacion, cliente },
        })),

      setProductos: (productos) =>
        set((state) => ({
          cotizacion: { ...state.cotizacion, productos },
        })),

      setInformacionEnvio: (info) =>
        set((state) => ({
          cotizacion: { ...state.cotizacion, informacionEnvio: info },
        })),

      setNotaCliente: (nota) =>
        set((state) => ({
          cotizacion: { ...state.cotizacion, notaCliente: nota },
        })),

      setMetodoPago: (metodo) =>
        set((state) => ({
          cotizacion: { ...state.cotizacion, metodoPago: metodo },
        })),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),

      resetTemporaryStates: () =>
        set({
          loading: false,
          error: null,
          success: false,
        }),

      resetCotizacion: () =>
        set(() => ({
          cotizacion: {
            cliente: null,
            productos: [],
            informacionEnvio: null,
            metodoPago: MetodoPago.EFECTIVO,
            estatus: EstatusCotizacion.PENDIENTE,
          },
          loading: false,
          error: null,
          success: false,
        })),
    }),
    {
      name: "cotizacion-storage",
      partialize: (state) => ({
        cotizacion: state.cotizacion,
      }),
    }
  )
);
