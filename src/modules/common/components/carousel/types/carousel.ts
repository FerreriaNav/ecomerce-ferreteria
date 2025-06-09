import { Products } from "@/interfaces/products/products.interface"

// CarrucelItemTextoAvanzado.ts
export interface CarrucelItemTextoAvanzado {
  __component: "carrucel.carrucel-item-texto-avanzado"
  titulo?: string
  subtitulo?: string
  link?: string
  botonTexto?: string
  mostrarBoton?: boolean
  posicionTexto?: "izquierda" | "centro" | "derecha"
  colorFondo?: string
  colorTexto?: string
}

// CarrucelItemBanner.ts
export interface CarrucelItemBanner {
  __component: "carrucel.carrucel-item-banner"
  imagen: {
    url: string
    alternativeText?: string
  }
  link?: string
  alt?: string
  overlayFull?:boolean
  overlayTexto?: string
  overlayColor?: string
  blur?:boolean
  posicionOverlay?: "izquierda" | "centro" | "derecha"
}

// CarrucelItemProducto.ts
export interface CarrucelItemProducto {
  __component: "carrucel.carrucel-item-producto"
  producto: Products
  colorFondo?: string
  colorTexto?: string
  
}

// CarrucelItemColorFondoImagen.ts
export interface CarrucelItemColorFondoImagen {
  __component: "carrucel.carrucel-item-color-fondo-imagen"
  imagen: {
    url: string
    alternativeText?: string
  }
  titulo?: string
  subtitulo?: string
  link?: string
  botonTexto?: string
  mostrarBoton?: boolean
  posicionTexto?: "izquierda" | "centro" | "derecha"
  colorFondo?: string
  colorTexto?: string
}


export type CarrucelItem =
  | CarrucelItemTextoAvanzado
  | CarrucelItemBanner
  | CarrucelItemProducto
  | CarrucelItemColorFondoImagen

