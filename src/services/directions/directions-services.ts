import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { DataResponse } from "@/interfaces/data/response.interface";
import {
  Address,
  Principal,
} from "@/interfaces/directions/directions.interface";
import { query } from "@/lib/api/server/strapi";

const BASE_ENDPOINT: string = BACKEND_ROUTES.ADDRESS;

// Obtener direcciones de un usuario específico
export function getUserDirections(
  userId: string
): Promise<DataResponse<Address[]> | null> {
  const queryDireccions: string = `${BASE_ENDPOINT}?filters[usuario][documentId][$eq]=${userId}&filters[activo][$eq]=true&sort=createdAt:desc&populate=*`;

  if (!userId) {
    return Promise.reject(new Error("User documentId is required."));
  }

  return query<DataResponse<Address[]>>(queryDireccions)
    .then((res) => {
      if (!res) {
        return null;
      }

      return res;
    })
    .catch((error) => {
      console.error("Error fetching user directions:", error);
      throw new Error("Failed to fetch user directions.");
    });
}

export function createDirection(
  data: Address,
  userId: number
): Promise<Address | null> {
  if (
    !data.calle ||
    !data.ciudad ||
    !data.estado ||
    !data.codigoPostal ||
    !data.numeroExterior ||
    !data.nombreRecibe
  ) {
    return Promise.reject(new Error("Todos los campos son requeridos."));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, publishedAt, usuario, ...payload } = data;

  const fullPayload = {
    ...payload,
    usuario: userId,
  };

  return query<Address | null>(`${BASE_ENDPOINT}`, {
    method: "POST",
    body: { data: fullPayload },
  })
    .then((res) => {
      if (!res) {
        return null;
      }
      return res;
    })
    .catch((error) => {
      console.error("Error creating a new direction:", error);
      throw new Error("Failed to create the direction.");
    });
}

export function updateDirection(
  id: string,
  data: Address
): Promise<Address | null> {
  if (!id || !data) {
    return Promise.reject(new Error("Direction ID and data are required."));
  }

  return query<Address>(`${BASE_ENDPOINT}/${id}`, {
    method: "PUT",
    body: { data },
  })
    .then((res) => {
      if (!res) {
        return null;
      }

      return res;
    })
    .catch((error) => {
      console.error(`Error updating direction with ID ${id}:`, error);
      throw new Error("Failed to update the direction.");
    });
}

export function deleteDirection(documentId: string): Promise<Address| null> {
  if (!documentId) {
    return Promise.reject(new Error("Direction ID is required."));
  }

  return query<Address>(`${BASE_ENDPOINT}/eliminar`, {
    method: "PUT",
    body: {
      data: {
        documentId,
      },
    },
  })
    .then((res) => res)
    .catch((error) => {
      console.error(`Error deleting direction with ID ${documentId}:`, error);
      throw new Error("Failed to delete the direction.");
    });
}

export function setPrincipal(
  documentId: string,
  usuario: string
): Promise<Principal | null> {
  if (!documentId) {
    return Promise.reject(new Error("Direction ID is required."));
  }

  const payload = { documentId, usuario };
  return query<Principal>(`${BASE_ENDPOINT}/principal`, {
    method: "POST",
    body: payload,
  }).then((res) => {
      if (!res) {
        return null;
      }

      return res;
    })
    .catch((error) => {
      throw new Error(`Falló en el servidor: ${error}`);
    });
}
