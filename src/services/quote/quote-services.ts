import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import {
  Cotizacion,
  CotizacionCreateDto,
  EstatusCotizacion,
} from "@/interfaces/cotizaciones/cotizacion.interface";
import type { DataResponse } from "@/interfaces/data/response.interface";
import { Products } from "@/interfaces/products/products.interface";
import { query } from "@/lib/api/server/strapi";
import { useCartStore } from "@/store/products-cart.store";

const BASE_ENDPOINT: string = BACKEND_ROUTES.QUOTES;
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

// Obtener cotizaciones de un usuario específico
export function getUserCotizaciones(
  userId: string
): Promise<DataResponse<Cotizacion[]> | null> {
  const params = new URLSearchParams();
  params.set("filters[cliente][documentId][$eq]", userId);
  params.set("sort", "createdAt:desc");
  params.set("populate[cliente]", "true");
  params.set("populate[productos][populate][producto][fields][0]", "nombre");
  params.set("populate[productos][populate][producto][fields][1]", "tipo");
  params.set(
    "populate[productos][populate][producto][populate][cover][fields][0]",
    "url"
  );
  params.set(
    "populate[productos][populate][producto][populate][marca]",
    "true"
  );
  params.set(
    "populate[productos][populate][producto][populate][categorias]",
    "true"
  );

  const queryCotizaciones: string = `${BASE_ENDPOINT}?${params.toString()}`;

  if (!userId) {
    return Promise.reject(new Error("User documentId is required."));
  }

  return query<DataResponse<Cotizacion[]>>(queryCotizaciones)
    .then((res) => {
      if (!res) {
        return null;
      }
      const cotizaciones = res.data.map((cotizacion) => {
        // Asegurarse de que los productos tengan un cover definido
        return {
          ...cotizacion,
          productos: cotizacion.productos.map((item) => ({
            ...item,
            producto: {
              ...item?.producto,
              coverUrl: `${STRAPI_HOST}${item?.producto?.cover?.url}`,
            } as Products,
          })),
        };
      });
      const data: DataResponse<Cotizacion[]> = {
        ...res,
        data: cotizaciones,
      };
      return data;
    //   res.data = res.data.map((order) => ({
    //   ...order,
    //   productos:
    //     order.productos?.map((producto) => {
    //       const coverUrl = producto.producto.cover?.url?.startsWith("http")
    //         ? producto.producto.cover.url
    //         : `${STRAPI_HOST}${producto.producto.cover?.url}`;

    //       return {
    //         ...producto,
    //         producto: {
    //           ...producto.producto,
    //           coverUrl,
    //         },
    //       };
    //     }) ?? [],
    // }));
      
    //   return res;
    })
    .catch((error) => {
      console.error("Error fetching user cotizaciones:", error);
      throw new Error("Failed to fetch user cotizaciones.");
    });
}

// Crear nueva cotización - Actualizada para usar CotizacionCreateDto
export function createCotizacion(
  data: CotizacionCreateDto,
  userDocumentId: string
): Promise<Cotizacion | null> {
  if (!data.productos || data.productos.length === 0) {
    return Promise.reject(new Error("Productos y estatus son requeridos."));
  }

  const fullPayload = {
    productos: data.productos,
    estatus: data.estatus || EstatusCotizacion.PENDIENTE,
    metodoPago: data.metodoPago,
    notaCliente: data.notaCliente,
    informacionEnvio: data.informacionEnvio,
    cliente: userDocumentId,
  };

  return query<Cotizacion | null>(`${BASE_ENDPOINT}`, {
    method: "POST",
    body: { data: fullPayload },
  })
    .then((res) => {
      if (!res) {
        return null;
      }
      useCartStore.getState().deleteCartFromStorage();
      return res;
    })
    .catch((error) => {
      console.error("Error creating a new cotizacion:", error);
      throw new Error("Failed to create the cotizacion.");
    });
}

// Actualizar cotización completa
export function updateCotizacion(
  documentId: string,
  data: Partial<Cotizacion>
): Promise<Cotizacion | null> {
  if (!documentId || !data) {
    return Promise.reject(new Error("Cotizacion ID and data are required."));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, cliente, ...payload } = data;

  return query<Cotizacion>(`${BASE_ENDPOINT}/${documentId}`, {
    method: "PUT",
    body: { data: payload },
  })
    .then((res) => {
      if (!res) {
        return null;
      }
      return res;
    })
    .catch((error) => {
      console.error(`Error updating cotizacion with ID ${documentId}:`, error);
      throw new Error("Failed to update the cotizacion.");
    });
}

// Eliminar cotización
export function deleteCotizacion(
  documentId: string
): Promise<Cotizacion | null> {
  if (!documentId) {
    return Promise.reject(new Error("Cotizacion ID is required."));
  }

  return query<Cotizacion>(`${BASE_ENDPOINT}/eliminar`, {
    method: "PUT",
    body: {
      data: {
        documentId,
      },
    },
  })
    .then((res) => res)
    .catch((error) => {
      console.error(`Error deleting cotizacion with ID ${documentId}:`, error);
      throw new Error("Failed to delete the cotizacion.");
    });
}
