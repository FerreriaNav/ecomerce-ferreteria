import { Meta } from "../data/pagination.interface";

export interface DataStockActions {
    data: StockActions[];
    meta: Meta;
}

export interface StockActions {
    id:          number;
    documentId:  string;
    accion:      string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
}

