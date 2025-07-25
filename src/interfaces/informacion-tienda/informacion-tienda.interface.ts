import { Img } from "../data/img.interface";

export interface InfoEcommerce {
  id: number;
  documentId: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  numeroGeneral: null;
  correoGeneral: null;
  whatsapp: string;
  logo: Img;
  direccion: DireccionSucursal;
  redesSociales: RedesSociales[];
  nosotros: Nosotros;
}

interface Nosotros {
  eslogan: string;
  historia: string;
  nombreEmpresa: string;
  imagenHistoria?: Img;
  personal?: Personal[];
  infoExtra?: infoExtra[];
}

export interface infoExtra {
  titulo: string;
  descripcion: string;
}

export interface DireccionSucursal {
  id: number;
  direccion: string;
  coordenadas?: string;
  urlFrame?: string;
  horario: string;
  numero: string;
  correo: string;
  imagenes: Img[];
}

export interface Personal {
  id: number;
  puesto: string;
  nombre: string;
  img: Img;
}

export interface RedesSociales {
  id: number;
  nombreRedSocial: string;
  url: string;
  icono: Img;
}
