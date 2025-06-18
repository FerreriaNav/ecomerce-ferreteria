import { Img } from "../data/img.interface";
import { Descuento } from "../products/products.interface";

export interface Categoria {
    id: number;
    nombre: string;
    img?: Img;
    principal?: Categoria;
    subcategorias?: Categoria[];
    descuento?: Descuento;
    slug: string;
  }


  export enum  CATEGORIAS_ENUM{
    TORNILLERIA = "tornilleria"
  }


