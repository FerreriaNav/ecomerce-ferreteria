export function getInitialsName(name: string, lastName?: string): string {
  if (!name) return "";

  const nameParts = name.trim().split(" ");
  const lastNameParts = lastName?.trim().split(" ") || [];

  // Si hay apellido, tomamos la primera letra del nombre y del apellido
  if (lastNameParts.length > 0 && lastNameParts[0] !== "") {
    return `${nameParts[0][0] ?? ""}${lastNameParts[0][0] ?? ""}`.toUpperCase();
  }

  // Si no hay apellido, usamos las dos primeras letras del nombre (si hay)
  const initials = nameParts[0][0] ?? "";
  const secondInitial = nameParts[1]?.[0] ?? nameParts[0][1] ?? "";
  return `${initials}${secondInitial}`.toUpperCase();
}
