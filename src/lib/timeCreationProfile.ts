export function getTimeSinceCreation(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - createdDate.getTime();

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30.44); // promedio de días por mes
  const diffInYears = Math.floor(diffInDays / 365.25);

  if (diffInYears > 0) {
    return `Cliente desde hace ${diffInYears} año${diffInYears > 1 ? "s" : ""}`;
  } else if (diffInMonths > 0) {
    return `Cliente desde hace ${diffInMonths} mes${diffInMonths > 1 ? "es" : ""}`;
  } else if (diffInDays > 0) {
    return `Cliente desde hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
  } else {
    return `Cliente desde hoy`;
  }
}
