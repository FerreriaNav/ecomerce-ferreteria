import { Meta } from "./pagination.interface";

export interface DataResponse<T> {
    data: T; 
    meta: Meta;
}