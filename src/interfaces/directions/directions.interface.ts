import { User } from "../auth/user.interface";

export interface Address {
    id?: number;
    documentId?: string;
    calle: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    numeroExterior: string;
    numeroInterior: string | null;
    referencia: string | null;
    nombreRecibe: string;
    principal?: boolean;
    telefono: string;
    usuario?: User
  }

  export interface Principal {
  mensaje:   string;
  direccion: Address;
}
  
  export interface ApiResponse {
    data: Address;
    meta: Record<string, unknown>;
  }