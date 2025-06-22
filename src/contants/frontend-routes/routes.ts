export const FRONTEND_ROUTES = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CATALOGOS: "/catalogos",
    PRODUCTOS: "/producto",
    NOSOTROS: "/nosotros",
    TORNILLERIA:"tornilleria",
    PROVEDORES: "/provedores",
    DASHBOARD: "/dashboard",
    PROFILE: "/perfil",
    SETTINGS: "/configuracion",
    DIRECTIONS: "/direcciones",
    OFERTAS: "/ofertas",
    FAVORITE: "/favoritos",
    QUOTES: "/cotizaciones",
    CALLBACK: "http://localhost:3000/pedidos",
    ADMIN: {
      USERS: "/admin/users",
      PRODUCTS: "/admin/products",
    },
  } as const;
export type Route = typeof FRONTEND_ROUTES[keyof typeof FRONTEND_ROUTES];  