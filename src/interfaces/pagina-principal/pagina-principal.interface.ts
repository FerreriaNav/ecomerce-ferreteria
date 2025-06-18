import { CarrucelItem } from "@/modules/common/components/carousel/types/carousel";
import { Products } from "../products/products.interface";

export interface PaginaPrincipal {
    id:          number;
    documentId:  string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    carrucel:    CarrucelItem[];
    productosDestacados: {
        id:number
        producto:Products
    }[]
}




