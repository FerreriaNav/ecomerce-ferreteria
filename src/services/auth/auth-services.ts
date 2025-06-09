import { User, UserToken } from "@/interfaces/auth/user.interface";
import { BACKEND_ROUTES } from "../../contants/backend-routes/routes";
import { RegisterPartialData } from "@/modules/common/components/auth/register/register-schema";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

export async function registerUser(
  data: RegisterPartialData
): Promise<User | null> {
  const response = await fetch(`${STRAPI_HOST}/api/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: data,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Respuesta del servidor:", result);
    return null;
  }

  return result.data as User;
}

export async function loginUser(data: RegisterPartialData): Promise<UserToken | null> {
  const response = await fetch(`${STRAPI_HOST}/api/${BACKEND_ROUTES.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    console.log(await response.json());
    return null;
  }

  return await response.json();
}
