export function getGoogleMapsEmbedUrl(input?: string): string | null {
  if (!input || input.length > 200) return null; // Evita strings sospechosamente largos

  const dmsMatch = input.match(
    /(\d+)°(\d+)'([\d.]+)"?([NS])\s+(\d+)°(\d+)'([\d.]+)"?([EW])/
  );

  if (dmsMatch) {
    function toDecimal(deg: string, min: string, sec: string, dir: string): number {
      const decimal = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
      return dir === "S" || dir === "W" ? -decimal : decimal;
    }

    const lat = toDecimal(dmsMatch[1], dmsMatch[2], dmsMatch[3], dmsMatch[4]);
    const lng = toDecimal(dmsMatch[5], dmsMatch[6], dmsMatch[7], dmsMatch[8]);
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  const decimalMatch = input.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);

  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  return null;
}
