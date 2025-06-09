
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;

export function formatStrapiImageUrl  (url: string) {
  if (!url) return "";
  const baseUrl = STRAPI_HOST|| "http://localhost:3001";
  return `${baseUrl}${url}`;
}