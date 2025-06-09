import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { User } from "@/interfaces/auth/user.interface";
import { DataResponse } from "@/interfaces/data/response.interface";
import { query } from "@/lib/api/server/strapi";

const BASE_ENDPOINT = BACKEND_ROUTES.USERS;

export function getUser(): Promise<User | null> {
  return query<User>(`${BASE_ENDPOINT}?populate=*`)
    .then((res) => {
      if ( !res ) {
        return null;
      }
      return res;
    })
    .catch((error) => {
      console.error(
        "Something terrible happened whe getting the users:",
        error
      );
      throw error;
    });
}

export async function getMeInfo(id?: string): Promise<DataResponse<User> | null> {
  if (!id) {
    console.error("No se proporcionó un ID para obtener la información del usuario.");
    return null;
  }

  const q = `${BASE_ENDPOINT}/${id}?populate=*`;

  try {
    const res = await query<DataResponse<User>>(q);
    return res ?? null;
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    throw error;
  }
}

