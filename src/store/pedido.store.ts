// src/store/pedido.store.ts
import { InformacionEnvio, MetodoPago } from "@/interfaces/cotizaciones/cotizacion.interface"
import { PedidoCreateDto, ProductoSeleccionadoInput } from "@/interfaces/orders/pedido.interface"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PedidoStore {
  pedido: PedidoCreateDto
  notaCliente: string
  metodoPago: MetodoPago | null
  loading: boolean
  error: string | null
  success: boolean

  setCliente: (cliente: string| number) => void
  setProductos: (productos: ProductoSeleccionadoInput[]) => void
  setInformacionEnvio: (info: InformacionEnvio) => void

  // Funciones adicionales para cotización
  setNotaCliente: (nota: string) => void
  setMetodoPago: (metodo: MetodoPago) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: boolean) => void

  // Nueva función para resetear estados temporales
  resetTemporaryStates: () => void

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
      metodoPago: null,
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
      setMetodoPago: (metodo) => set({ metodoPago: metodo }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),

      // Nueva función para resetear solo los estados temporales
      resetTemporaryStates: () =>
        set({
          loading: false,
          error: null,
          success: false,
        }),

      resetPedido: () =>
        set(() => ({
          pedido: {
            cliente: 0,
            productosSeleccionados: [],
            informacionEnvio: null,
          },
          notaCliente: "",
          metodoPago: null,
          loading: false,
          error: null,
          success: false,
        })),
    }),
    {
      name: "pedido-storage", // Se guarda en localStorage
      // No persistir los estados temporales
      partialize: (state) => ({
        pedido: state.pedido,
        notaCliente: state.notaCliente,
        metodoPago: state.metodoPago,
        // No incluir loading, error, success en la persistencia
      }),
    },
  ),
)
