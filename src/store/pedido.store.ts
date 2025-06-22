// src/store/pedido.store.ts
import type {
  InformacionEnvioCreateDto,
  PedidoCreateDto,
  ProductoSeleccionadoInput,
} from "@/interfaces/orders/pedido.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PedidoStore {
  pedido: PedidoCreateDto
  // Campos adicionales para cotización
  notaCliente: string
  loading: boolean
  error: string | null
  success: boolean

  setCliente: (cliente: number) => void
  setProductos: (productos: ProductoSeleccionadoInput[]) => void
  setInformacionEnvio: (info: InformacionEnvioCreateDto) => void

  // Funciones adicionales para cotización
  setNotaCliente: (nota: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: boolean) => void

  resetPedido: () => void
}

export const usePedidoStore = create<PedidoStore>()(
  persist(
    (set) => ({
      pedido: {
        cliente: 0,
        productosSeleccionados: [],
        informacionEnvio: null,
      },

      // Estados adicionales para cotización
      notaCliente: "",
      loading: false,
      error: null,
      success: false,

      setCliente: (cliente) =>
        set((state) => ({
          pedido: { ...state.pedido, cliente },
        })),

      setProductos: (productos) =>
        set((state) => ({
          pedido: { ...state.pedido, productosSeleccionados: productos },
        })),

      setInformacionEnvio: (info) =>
        set((state) => ({
          pedido: { ...state.pedido, informacionEnvio: info },
        })),

      // Funciones adicionales para cotización
      setNotaCliente: (nota) => set({ notaCliente: nota }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),

      resetPedido: () =>
        set(() => ({
          pedido: {
            cliente: 0,
            productosSeleccionados: [],
            informacionEnvio: null,
          },
          notaCliente: "",
          loading: false,
          error: null,
          success: false,
        })),
    }),
    {
      name: "pedido-storage", // Se guarda en localStorage
    }
  )
);
