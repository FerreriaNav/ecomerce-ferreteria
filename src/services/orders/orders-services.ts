import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { DataResponse } from "@/interfaces/data/response.interface";
import type { Pedido } from "@/interfaces/orders/pedido.interface";
import { query } from "@/lib/api/server/strapi";

const BASE_ENDPOINT: string = BACKEND_ROUTES.ORDERS;
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

export async function getUserOrders(
  userId: number | undefined
): Promise<DataResponse<Pedido[]> | null> {
  try {
    const res = await query<DataResponse<Pedido[]>>(
      `${BASE_ENDPOINT}?filters[cliente][id][$eq]=${userId}&populate[informacionEnvio][populate][direccion][fields]=calle,ciudad,estado,codigoPostal,numeroExterior,numeroInterior,referencia,nombreRecibe,telefono&populate[pagos][fields]=monto,moneda,estadoPago,orderId`
    );

    if (!res) {
      return null;
    }
    
    const orders = res?.data.map((order) => {
      // procesamos los coverUrl de los productos
      const productos =
        order.metadata?.productos?.map((producto) => ({
          ...producto,
          coverUrl: producto.coverUrl?.startsWith("http")
            ? producto.coverUrl
            : `${STRAPI_HOST}${producto.coverUrl}`,
        })) ?? [];

      return {
        ...order,
        metadata: {
          ...order.metadata,
          productos,
        },
      };
    });

    return { ...res, data: orders };
  } catch (error) {
    console.error("Error al obtener las órdenes del usuario:", error);
    throw new Error("No se pudieron obtener las órdenes del usuario");
  }
}
