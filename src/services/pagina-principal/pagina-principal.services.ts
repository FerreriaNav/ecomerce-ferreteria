import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { DataResponse } from "@/interfaces/data/response.interface";
import { PaginaPrincipal } from "@/interfaces/pagina-principal/pagina-principal.interface";
import { Products } from "@/interfaces/products/products.interface";
import { query } from "@/lib/api/server/strapi";
import {
  CarrucelItem,
  CarrucelItemBanner,
  CarrucelItemColorFondoImagen,
} from "@/modules/common/components/carousel/types/carousel";
import {
  getProductByDocumentId,
} from "../products/products-services";

const BASE_ENDPOINT: string = BACKEND_ROUTES.PAGINA_PRINCIPAL;
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

export async function getPaginaPrincipal(): Promise<DataResponse<PaginaPrincipal> | null> {
  const searchParams = new URLSearchParams();
  searchParams.append("populate[carrucel][populate]", "*");

  const url = `${BASE_ENDPOINT}?${searchParams.toString()}`;

  try {
    const res = await query<DataResponse<PaginaPrincipal>>(url);

    if (!res) return null;

    const carrucel: CarrucelItem[] = (
      await Promise.all(
        res.data.carrucel.map(async (item: CarrucelItem) => {
          switch (item.__component) {
            case "carrucel.carrucel-item-banner":
              return {
                ...item,
                imagen: item.imagen
                  ? {
                      ...item.imagen,
                      url: `${STRAPI_HOST}${item.imagen.url}`,
                    }
                  : undefined,
              } as CarrucelItemBanner;

            case "carrucel.carrucel-item-color-fondo-imagen":
              return {
                ...item,
                imagen: item.imagen
                  ? {
                      ...item.imagen,
                      url: `${STRAPI_HOST}${item.imagen.url}`,
                    }
                  : undefined,
              } as CarrucelItemColorFondoImagen;

            case "carrucel.carrucel-item-producto":
              if (!item.producto.documentId) return null;
              const product = await getProductByDocumentId(item.producto.documentId);

              if (!product) return null;

              return {
                ...item,
                producto: product as Products,
              };

            case "carrucel.carrucel-item-texto-avanzado":
            default:
              return item;
          }
        })
      )
    ).filter((item): item is CarrucelItem => item !== null);

    const paginaPrincipal: DataResponse<PaginaPrincipal> = {
      ...res,
      data: {
        ...res.data,
        carrucel,
      },
    };

    return paginaPrincipal;
  } catch (error) {
    console.error("Error al obtener Página Principal: ", error);
    throw error;
  }
}

