import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface";
import { DataResponse } from "@/interfaces/data/response.interface";
import { query } from "@/lib/api/server/strapi";

const BASE_ENDPOINT: string = BACKEND_ROUTES.QUOTES;
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

export async function getUserOrders(
  userId: string
): Promise<DataResponse<Cotizacion[]> | null> {
  const params = new URLSearchParams();

  params.set("filters[cliente][documentId][$eq]", userId);
  params.set("filters[estatus][$eq]", "PAGADA");
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

  const url = `${BASE_ENDPOINT}?${params.toString()}`;

  try {
    const res = await query<DataResponse<Cotizacion[]>>(url);

    if (!res) return null;

    res.data = res.data.map((order) => ({
      ...order,
      productos:
        order.productos?.map((producto) => {
          const coverUrl = producto.producto.cover?.url?.startsWith("http")
            ? producto.producto.cover.url
            : `${STRAPI_HOST}${producto.producto.cover?.url}`;

          return {
            ...producto,
            producto: {
              ...producto.producto,
              coverUrl,
            },
          };
        }) ?? [],
    }));

    console.log(res);
    return res;
  } catch (error) {
    console.error("Error al obtener las órdenes del usuario:", error);
    throw new Error("No se pudieron obtener las órdenes del usuario");
  }

  // export async function getUserOrders(
  //   userId: number | undefined
  // ): Promise<DataResponse<Pedido[]> | null> {
  //   try {
  //     const res = await query<DataResponse<Pedido[]>>(
  //       `${BASE_ENDPOINT}?filters[cliente][id][$eq]=${userId}&populate[informacionEnvio][populate][direccion][fields]=calle,ciudad,estado,codigoPostal,numeroExterior,numeroInterior,referencia,nombreRecibe,telefono&populate[pagos][fields]=monto,moneda,estadoPago,orderId`
  //     );

  //     if (!res) {
  //       return null;
  //     }

  //     const orders = res?.data.map((order) => {
  //       // procesamos los coverUrl de los productos
  //       const productos =
  //         order.metadata?.productos?.map((producto) => ({
  //           ...producto,
  //           coverUrl: producto.coverUrl?.startsWith("http")
  //             ? producto.coverUrl
  //             : `${STRAPI_HOST}${producto.coverUrl}`,
  //         })) ?? [];

  //       return {
  //         ...order,
  //         metadata: {
  //           ...order.metadata,
  //           productos,
  //         },
  //       };
  //     });

  //     return { ...res, data: orders };
  //   } catch (error) {
  //     console.error("Error al obtener las órdenes del usuario:", error);
  //     throw new Error("No se pudieron obtener las órdenes del usuario");
  //   }
  // }
}
