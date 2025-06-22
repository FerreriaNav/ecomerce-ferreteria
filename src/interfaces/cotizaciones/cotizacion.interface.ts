import { User } from "../auth/user.interface";
import { Address } from "../directions/directions.interface";
import { ProductoSeleccionado, ProductoSeleccionadoInput } from "../orders/pedido.interface";


// Enums para estatus y método de pago
export enum EstatusCotizacion {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA',
  FINALIZADA = 'FINALIZADA'
}

export enum MetodoPago {
  TRANSFERENCIA = 'TRANSFERENCIA',
  EFECTIVO = 'EFECTIVO',
  DEPOSITO = 'DEPOSITO'
}

// Interfaz de la cotización
export interface CotizacionCreateDto {
  id?: number;
  productos: ProductoSeleccionadoInput[];
  estatus: EstatusCotizacion;
  cliente: string | number; // Puedes tipar esto según tu modelo de usuario
  informacionEnvio?: InformacionEnvio | null
  metodoPago: MetodoPago;
  notaCliente?: string; // Campo largo opcional
  notaVendedor?: string; // Campo largo opcional
  totalCotizacion?: number;
}


// Interfaz de la cotización
export interface Cotizacion {
  id: number;
  productos: ProductoSeleccionado[];
  estatus: EstatusCotizacion;
  cliente: User; // Puedes tipar esto según tu modelo de usuario
  metodoPago: MetodoPago;
  notaCliente?: string; // Campo largo opcional
  notaVendedor?: string; // Campo largo opcional
  totalCotizacion: number;
}

export interface InformacionEnvio {
  id: number;
  esLocal: boolean;
  costoEnvio: number;
  nota: null;
  direccion: Address;
}