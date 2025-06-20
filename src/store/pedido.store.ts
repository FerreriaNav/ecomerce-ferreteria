// src/store/pedido.store.ts
import type {
  InformacionEnvioCreateDto,
  PedidoCreateDto,
  ProductoSeleccionadoInput,
} from "@/interfaces/orders/pedido.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the quote type
export type QuoteType = "STANDARD" | "DETAILED";

// Update the PedidoCreateDto interface in the store file
// (You may want to update the actual interface file as well)
interface PedidoStore {
  pedido: PedidoCreateDto & { quoteType: QuoteType | null };
  setCliente: (cliente: number) => void;
  setProductos: (productos: ProductoSeleccionadoInput[]) => void;
  setInformacionEnvio: (info: InformacionEnvioCreateDto) => void;
  setQuoteType: (quoteType: QuoteType) => void;
  resetPedido: () => void;
}

export const usePedidoStore = create<PedidoStore>()(
  persist(
    (set) => ({
      pedido: {
        cliente: 0,
        productosSeleccionados: [],
        informacionEnvio: null,
        provider: null,
        quoteType: null,
      },

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

      setQuoteType: (quoteType) =>
        set((state) => ({
          pedido: { ...state.pedido, quoteType },
        })),

      resetPedido: () =>
        set(() => ({
          pedido: {
            cliente: null,
            productosSeleccionados: [],
            informacionEnvio: null,
            provider: null,
            quoteType: null,
          },
        })),
    }),
    {
      name: "pedido-storage", // Se guarda en localStorage
    }
  )
);
