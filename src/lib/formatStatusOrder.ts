export function formatStatusOrder(status: string): string {
  switch (status.toLocaleLowerCase()) {
    case "pending":
      return "pendiente";
    case "en camino":
      return "";
    case "entregado":
      return "";
    default:
      return "";
  }
}
