import Link from "next/link";
import Image from "next/image";
import type { CarrucelItemBanner } from "./types/carousel";

interface Props {
  item: CarrucelItemBanner;
}

export function CarouselItemBanner({ item }: Props) {
  const getOverlayPosition = () => {
    switch (item.posicionOverlay) {
      case "izquierda":
        return "justify-start text-left";
      case "derecha":
        return "justify-end text-right";
      case "centro":
      default:
        return "justify-center text-center";
    }
  };

  function hexToRGBA(hex: string, alpha = 0.4): string {
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c.split("").map((char) => char + char).join(""); // #abc → #aabbcc
    }
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const content = (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] overflow-hidden">
      <Image
        src={item.imagen.url || "/icons/logo.webp"}
        alt={item.alt || item.imagen.alternativeText || "Banner image"}
        fill
        className="object-cover transition-transform duration-700 hover:scale-105"
        priority
      />

      {item.overlayTexto && (
        <div
          className={`absolute inset-0 flex items-center px-6 md:px-12 lg:px-16 ${getOverlayPosition()}`}
        >
          {item.overlayFull !== false ? (
            // Overlay grande: cubre toda la imagen
            <div
              className={`w-full h-full flex items-center inset-0 absolute  px-6 md:px-12 lg:px-16 ${getOverlayPosition()} ${
                item?.blur ? "backdrop-blur" : ""
              }`}
              style={{
                backgroundColor: item.overlayColor
                  ? hexToRGBA(item.overlayColor)
                  : "rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  {item.overlayTexto}
                </h2>
              </div>
            </div> 
          ) : (
            // Overlay pequeño tipo tarjeta
            <div
              className={`px-6 py-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 ${
                item?.blur ? "backdrop-blur" : ""
              }`}
              style={{
                backgroundColor: item.overlayColor
                  ? hexToRGBA(item.overlayColor, 0.5)
                  : "rgba(0, 0, 0, 0.4)",
              }}
            >
              <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                {item.overlayTexto}
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (item.link) {
    return (
      <Link href={item.link} className="block w-full h-full">
        {content}
      </Link>
    );
  }

  return content;
}
