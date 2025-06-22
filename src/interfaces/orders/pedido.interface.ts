import { Address } from "../directions/directions.interface";
import { Products } from "../products/products.interface";

export enum PedidosStatus {
  PENDIENTE = "PENDIENTE",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
  ENVIADO = "ENVIADO",
  DEVOLUCION = "DEVOLUCION",
  ENTREGADO = "ENTREGADO",
}

export interface Pedido {
  id: number;
  uuid: string;
  documentId: string;
  estado: PedidosStatus;
  fechaPedido?: Date;
  metadata: Metadata;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  informacionEnvio: InformacionEnvio;
  pagos: Pago[];
}

export interface InformacionEnvio {
  id: number;
  esLocal: boolean;
  costoEnvio: number;
  nota: null;
  direccion: Address;
}


export interface Metadata {
  productos: DetailsProducts[];
  subtotal: number;
  total: number;
  informacionEnvio: MetadataInformacionEnvio;
}

export interface MetadataInformacionEnvio {
  esLocal: boolean;
  costoEnvio: number;
  direccion: number;
}

export interface DetailsProducts {
  id: number;
  nombre: string;
  coverUrl: string;
  cantidad: number;
  precioUnitario: number;
  precioDescuento: number;
  tipoDescuento: null;
  descuentoAplicado: number;
}

export interface Pago {
  id: number;
  documentId: string;
  monto: number;
  moneda: string;
  estadoPago: string;
  orderId: string;
}

export interface PedidoCreateDto {
  cliente: number | string| null;
  productosSeleccionados: ProductoSeleccionadoInput[];
  informacionEnvio: InformacionEnvioCreateDto | null;
}
export interface InformacionEnvioCreateDto {
  esLocal: boolean;
  costoEnvio?: number | null;
  nota?: string | null;
  direccion?: string| number | null;
}

export interface ProductoSeleccionadoInput {
  producto: number | string;
  cantidad: number;
}

export interface ProductoSeleccionado {
  producto: Products;
  cantidad: number;
}