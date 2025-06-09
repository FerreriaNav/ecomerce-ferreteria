
import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { Categoria } from "@/interfaces/categories/categories.interface";
import { DataResponse } from "@/interfaces/data/response.interface";
import { query } from "@/lib/api/server/strapi";
import { formatStrapiImageUrl } from "@/lib/FormatUrlImgStrapi";


const BASE_ENDPOINT: string = BACKEND_ROUTES.CATEGORIES


type CategoryFilters = {
  nombre?: string;
  
};

export function getCategorias(filters: CategoryFilters = {}): Promise<DataResponse<Categoria[]> |null> {
  const searchParams = new URLSearchParams();

  // Agregar filtros si existen
  if (filters.nombre) {
    searchParams.append("filters[nombre][$containsi]", filters.nombre);
  }



  // Aseguramos cargar relaciones como imagen y subcategorías
  searchParams.append("populate[subcategorias][populate][img][fields][0]", "url");
  searchParams.append("populate[principal]", "true");
  searchParams.append("populate[img][fields][0]", "url");
  searchParams.append("populate[descuento]", "true");

  const url = `${BASE_ENDPOINT}?${searchParams.toString()}`;

  return query<DataResponse<Categoria[]>>(url)
    .then((res) => {

      if(!res){
        return null;
      }
      const data: DataResponse<Categoria[]> = {
        ...res,
        data: res.data.map((categoria) => ({
          ...categoria,
          img: categoria.img ? { ...categoria.img, url:formatStrapiImageUrl(categoria.img.url) } : undefined,
          subcategorias: categoria.subcategorias?.map((subcategoria) => ({
            ...subcategoria,
            img: subcategoria.img ? { ...subcategoria.img, url: formatStrapiImageUrl(subcategoria.img.url)} : undefined,
          })),
      }))}
      return data;
    })
    .catch((error) => {
      console.error("Error al obtener categorías filtradas: ", error);
      throw error;
    });
}


