"use server";

import { log } from "node:console";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

interface QueryOptions {
  method?: string;
  body?: unknown;
  customerId?: string; // documentId del usuario
  customerEmail?: string; // correo del usuario
}

export async function query<T>(
  url: string,
  options: QueryOptions = {}
): Promise<T | null> {
  const { method = "GET", body, customerId, customerEmail } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  };

  if (customerId) {
    headers["x-customer-id"] = customerId;
  }

  if (customerEmail) {
    headers["x-customer-email"] = customerEmail;
  }

  const response = await fetch(`${STRAPI_HOST}/api/${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // 🔥 desactiva caché por completo
  });

  if (!response.ok) {
    log(await response.json());

    return null;
  }
  return response.json();
}
