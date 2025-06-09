import { CarrucelItem } from "@/modules/common/components/carousel/types/carousel";

export interface PaginaPrincipal {
    id:          number;
    documentId:  string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    carrucel:    CarrucelItem[];
}




