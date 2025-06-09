import { create } from "zustand";
import Swal from "sweetalert2";
import { Products } from "@/interfaces/products/products.interface";
import { getPrecioConDescuento } from "@/lib/price-descuento";
// import {
//   CANTIDAD_MIN_ENVIO_GRATIS,
//   COSTO_ENVIO,
//   PORCENTAJE_IMPUESTOS,
// } from "@/contants/precio-taxes-envio.constant";
// import { ConfiguracionPago } from "@/interfaces/configuracion-pago/configuracion-pago.interface";

export interface CartItem extends Products {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  // porcentajeImpuestos: number;
  // costoEnvio: number;
  // cantidadMiniEnvioGratis: number;

  loadCart: () => void;
  // setConfig: (configuracionPago: ConfiguracionPago) => void;

  addToCart: (product: Products) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;

  getTotal: () => number;
  getSubtotal: () => number;
  getCartSummary: () => {
    subtotal: number;
    total: number;
    // impuestos: number;
    // envio: number;
    // finalAmount: number;
  };
}

const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  // porcentajeImpuestos: PORCENTAJE_IMPUESTOS, // valor por defecto
  // costoEnvio: COSTO_ENVIO, // valor por defecto
  // cantidadMiniEnvioGratis: CANTIDAD_MIN_ENVIO_GRATIS, // valor por defecto
  // Cargar config desde API o store externo
  // setConfig: (configuracionPago) => {
  //   set({
  //     porcentajeImpuestos: configuracionPago.porcentajeImpuestos,
  //     costoEnvio: configuracionPago.costoEnvio,
  //     cantidadMiniEnvioGratis: configuracionPago.cantidadMinEnvioGratis,
  //   });
  // },

  // CARGAR EL CARRITO
  loadCart: () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const loadedCart = JSON.parse(savedCart).map((item: Products) => ({
        ...item,
      }));

      set({ cart: loadedCart });
    }
  },

  // AGREGAR PRODUCTO AL CARRITO
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      let updatedCart;

      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }

      // Guardar el carrito actualizado en localStorage
      saveCartToLocalStorage(updatedCart);

      Swal.fire({
        title: "Producto añadido",
        text: `${product.nombre} se agregó al carrito.`,
        icon: "success",
        timer: 2000,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
      });

      return { cart: updatedCart };
    }),

  // INCREMENTAR CANTIDAD DEL PRODUCTO
  increaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );

      // Guardar el carrito actualizado en localStorage
      saveCartToLocalStorage(updatedCart);
      return { cart: updatedCart };
    }),

  // DECREMENTAR CANTIDAD DEL PRODUCTO
  decreaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      // Guardar el carrito actualizado en localStorage
      saveCartToLocalStorage(updatedCart);
      return { cart: updatedCart };
    }),

  // ELIMINAR POR COMPLETO EL PRODUCTO DEL CARRITO
  removeFromCart: (id) =>
    set((state) => {
      const productToRemove = state.cart.find((item) => item.id === id);

      if (!productToRemove) return state;

      Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar "${productToRemove.nombre}" del carrito?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedCart = state.cart.filter((item) => item.id !== id);
          saveCartToLocalStorage(updatedCart);

          // Swal.fire({
          //   title: "Producto eliminado",
          //   text: `"${productToRemove.nombre}" ha sido eliminado del carrito.`,
          //   icon: "success",
          //   timer: 2000,
          //   toast: true,
          //   position: "top-end",
          //   showConfirmButton: false,
          // });

          set({ cart: updatedCart });
        }
      });

      return state;
    }),

  // CALCULAR EL TOTAL DEL CARRITO SIN DESCUENTOS
  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const price = item.inventario?.precioVenta || 0;
      return total + price * item.quantity;
    }, 0);
  },

  // CALCULAR EL TOTAL DEL CARRITO CON DESCUENTOS
  getTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const { finalPrice } = getPrecioConDescuento(
        item.inventario,
        item.descuento
      );
      return total + (finalPrice || 0) * item.quantity;
    }, 0);
  },

  // CALCULAR EL TOTAL DEL CARRITO CON IMPUESTOS
  // getTotalWithTax: () => {
  //   const { getTotal, porcentajeImpuestos } = get();

  //   const total = getTotal();
  //   const tax = total * (porcentajeImpuestos / 100);
  //   return total + tax;
  // },

  // CALCULAR EL TOTAL DEL CARRITO CON IMPUESTOS Y ENVIO
  getCartSummary: () => {
    const {
      getSubtotal,
      getTotal,
      // porcentajeImpuestos,
      // costoEnvio,
      // cantidadMiniEnvioGratis,
    } = get();
    const subtotal = getSubtotal();
    const total = getTotal();
    // const impuestos = total * (porcentajeImpuestos / 100);
    // const envio = total > cantidadMiniEnvioGratis ? 0 : costoEnvio;
    // const finalAmount = total + impuestos + envio;
    return {
      subtotal,
      total,
      // impuestos, envio, finalAmount
    };
  },
}));
