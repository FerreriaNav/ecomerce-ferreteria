import { User } from "../auth/user.interface";
import {
  ProductoSeleccionadoInput,
  InformacionEnvioCreateDto,
} from "../orders/pedido.interface";
import { Products } from "../products/products.interface";

// Enums para estatus y método de pago
export enum EstatusCotizacion {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  CANCELADA = "CANCELADA",
  FINALIZADA = "FINALIZADA",
}

export enum MetodoPago {
  TRANSFERENCIA = "TRANSFERENCIA",
  EFECTIVO = "EFECTIVO",
  DEPOSITO = "DEPOSITO",
}

// Interfaz de la cotización
export interface CotizacionCreateDto {
  productos: ProductoSeleccionadoInput[];
  estatus: EstatusCotizacion;
  cliente: string | number | null; // Puedes tipar esto según tu modelo de usuario
  informacionEnvio?: InformacionEnvioCreateDto | null;
  metodoPago: MetodoPago;
  notaCliente?: string; // Campo largo opcional
  notaVendedor?: string; // Campo largo opcional
  total?: number;
}

// Interfaz de la cotización
export interface Cotizacion {
  id: number;
  productos: ProductoCotizacion[];
  estatus: EstatusCotizacion;
  cliente: User; // Puedes tipar esto según tu modelo de usuario
  metodoPago: MetodoPago;
  notaCliente?: string; // Campo largo opcional
  notaVendedor?: string; // Campo largo opcional
  total: number;
}

export interface ProductoCotizacion {
  id: number;
  producto: Products;
  cantidad: string  ;
  precioUnitario: number;
}
