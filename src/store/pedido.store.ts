// src/store/pedido.store.ts
import { InformacionEnvioCreateDto, PedidoCreateDto, ProductoSeleccionadoInput } from "@/interfaces/orders/pedido.interface";
import { PaymentProvider } from "@/interfaces/payments-providers/payment-prodivers";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PedidoStore {
  pedido: PedidoCreateDto;
  setCliente: (cliente: number) => void;
  setProductos: (productos: ProductoSeleccionadoInput[]) => void;
  setInformacionEnvio: (info: InformacionEnvioCreateDto) => void;
  setProvider: (provider: PaymentProvider) => void;
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

      setProvider: (provider) =>
        set((state) => ({
          pedido: { ...state.pedido, provider },
        })),

      resetPedido: () =>
        set(() => ({
          pedido: {
            cliente: null,
            productosSeleccionados: [],
            informacionEnvio: null,
            provider: null,
          },
        })),
    }),
    {
      name: "pedido-storage", // Se guarda en localStorage
    }
  )
);
