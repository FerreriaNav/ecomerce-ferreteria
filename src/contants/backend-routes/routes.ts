export const BACKEND_ROUTES = {
    LOGIN: "usuarios/login",
    REGISTER: "usuarios/register",
    ADDRESS: "direccions",
    CATEGORIES: "categorias",
    PAYMENTS_CONFIGURATION: "configuracion-pago",
    ORDERS: "pedidos",
    INFORMATION_ECOMMERCE: "informacion-tienda",
    INVENTORY: "inventarios",
    BRANCH: "marcas",
    PRODUCTS: "productos",
    USERS: "usuarios",
    PEDIDOS: "pedidos",
    PAYMENTS: "payments",
    PAGINA_PRINCIPAL: "pagina-principal",
  } as const;
export type Route = typeof BACKEND_ROUTES[keyof typeof BACKEND_ROUTES];  