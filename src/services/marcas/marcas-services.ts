import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { DataResponse } from "@/interfaces/data/response.interface";
import { Marca } from "@/interfaces/marcas/marca.interface";
import { query } from "@/lib/api/server/strapi";

const BASE_ENDPOINT: string = BACKEND_ROUTES.BRANCH;
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

type MarcaFilters = {
  nombre?: string;
};

export function getMarcas(
  filters: MarcaFilters = {}
): Promise<DataResponse<Marca[]> | null> {
  const searchParams = new URLSearchParams();

  // Filtro por nombre
  if (filters.nombre) {
    searchParams.append("filters[nombre][$containsi]", filters.nombre);
  }

  // Incluir relaciones (como imágenes)
  searchParams.append("populate", "*");

  const url = `${BASE_ENDPOINT}?${searchParams.toString()}`;

  return query<DataResponse<Marca[]>>(url)
    .then((res) => {
      if (!res) {
        return null;
      }

      const data: DataResponse<Marca[]> = {
        ...res,
        data: res.data.map((marca) => ({
          ...marca,
          img: marca.img
            ? { ...marca.img, url: `${STRAPI_HOST}${marca.img.url}` }
            : undefined,
        })),
      };

      return data;
    })
    .catch((error) => {
      console.error("Error al obtener marcas filtradas: ", error);
      throw error;
    });
}
