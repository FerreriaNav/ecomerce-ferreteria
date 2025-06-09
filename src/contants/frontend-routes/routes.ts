export const FRONTEND_ROUTES = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CATEGORIA: "/categoria",
    MARCA: "/marca",
    DASHBOARD: "/dashboard",
    PROFILE: "/perfil",
    SETTINGS: "/configuracion",
    DIRECTIONS: "/direcciones",
    FAVORITE: "/favoritos",
    ORDERS: "/pedidos",
    CALLBACK: "http://localhost:3000/pedidos",
    ADMIN: {
      USERS: "/admin/users",
      PRODUCTS: "/admin/products",
    },
  } as const;
export type Route = typeof FRONTEND_ROUTES[keyof typeof FRONTEND_ROUTES];  