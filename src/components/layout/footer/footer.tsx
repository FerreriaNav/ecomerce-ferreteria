"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Headphones,
} from "lucide-react";
import { useInfoEcommerceStore } from "@/store/info-ecommerce.store";
import { getGoogleMapsEmbedUrl } from "@/lib/maps/frame";

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFooter = () => {
    if (!isExpanded) {
      setIsExpanded(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          const footer = document.getElementById("expandable-footer");
          footer?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    } else {
      setIsExpanded(false);
    }
  };

  const { infoEcommerce, initInfoEcommerce, loading } = useInfoEcommerceStore();

  useEffect(() => {
    initInfoEcommerce();
  }, [initInfoEcommerce]);

  if (loading || !infoEcommerce) {
    <div></div>;
  }

  return (
    <footer
      id="expandable-footer"
      className={`bg-gray-100 dark:bg-gray-900  pb-6  ${
        isExpanded ? "pt-6" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Contenido expandible */}
        <div
          id="expandable-footer"
          className={`transition-all  duration-300 ease-in-out overflow-hidden ${
            isExpanded ? " opacity-100 mb-8" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!isExpanded}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Columna 1: Logo e información */}
            <div>
              <div className="flex items-center mb-4">
                <div className="relative h-10 w-10 mr-2">
                  <Image
                    src={infoEcommerce?.logo?.url || "/imgs/default/logo.webp"}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-xl text-red-600">
                  {infoEcommerce?.nombre ?? "ECOMMERCE"}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Distribuidora Industrial Nacional, ofreciendo productos de alta
                calidad desde 2010.
              </p>
              <div className="flex space-x-4 px-2">
                {infoEcommerce &&
                  infoEcommerce.redesSociales?.map((red) => {
                    return (
                      <Link href={red.url} key={red.url}>
                        <Image
                          width={40}
                          height={40}
                          src={red.icono.url}
                          alt={red.nombreRedSocial}
                          className="w-7 h-7 hover:scale-125 hover:shadow-2xl hover:text-primary duration-300 transition-transform transform"
                        />
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Columna 2: Enlaces rápidos */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categoria"
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  >
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marcas"
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  >
                    Marcas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ofertas"
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  >
                    Ofertas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nosotros"
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Información de contacto */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
                Contacto
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin
                    className="text-red-600 mr-2 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {infoEcommerce?.direcciones[0]?.direccion ||
                      "Dirección no disponible"}
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone
                    className="text-red-600 mr-2 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {infoEcommerce?.numeroGeneral ||
                      "Número de contacto no disponible"}
                  </span>
                </li>
                <li className="flex items-center">
                  <Mail className="text-red-600 mr-2 flex-shrink-0" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">
                    {infoEcommerce?.correoGeneral || "Correo  no disponible"}
                  </span>
                </li>
                <li className="flex items-center">
                  <Clock
                    className="text-red-600 mr-2 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {infoEcommerce?.direcciones[0].horario ||
                      " Horario no disponible"}
                  </span>
                </li>
                <li className="flex items-center">
                  <Headphones
                    className="text-red-600 mr-2 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {infoEcommerce?.numeroGeneral ||
                      "Número de Soporte no disponible"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Columna 4: Newsletter */}

            <div className="w-full h-64 rounded-md overflow-hidden shadow">
              {infoEcommerce &&
              infoEcommerce?.direcciones[0].urlFrame?.includes("<iframe") ? (
                <div
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: infoEcommerce.direcciones[0].urlFrame,
                  }}
                />
              ) : (
                infoEcommerce && (
                  <iframe
                    src={
                      getGoogleMapsEmbedUrl(
                        infoEcommerce.direcciones[0]?.coordenadas
                      ) || infoEcommerce.direcciones[0].urlFrame
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    className=""
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Botón para desplegar/contraer con separador */}
        <div className="relative border-t border-gray-200 dark:border-gray-800 my-6">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-900 px-2">
            <button
              onClick={toggleFooter}
              className="flex items-center justify-center space-x-1 px-4 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-expanded={isExpanded}
              aria-controls="expandable-footer"
            >
              <span>
                {isExpanded ? "Menos información" : "Más información"}
              </span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Pie de página - siempre visible */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 DIN - Distribuidora Industrial Nacional. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/privacidad"
              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 text-sm transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 text-sm transition-colors"
            >
              Términos y Condiciones
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 text-sm transition-colors"
            >
              Política de Cookies
            </Link>
          </div>
        </div>

        {/* Métodos de pago - siempre visible */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-credit-card text-gray-600 dark:text-gray-400"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paypal text-gray-600 dark:text-gray-400"
            >
              <path d="M7 11.5h2a2.5 2.5 0 1 0 0-5H7v9" />
              <path d="M17 7.5h-5.5c-.5 0-.5 2 0 2H15c.5 0 2 .5 2 2s-1.5 2-2 2h-3" />
            </svg>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-banknote text-gray-600 dark:text-gray-400"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-landmark text-gray-600 dark:text-gray-400"
            >
              <line x1="3" x2="21" y1="22" y2="22" />
              <line x1="6" x2="6" y1="18" y2="11" />
              <line x1="10" x2="10" y1="18" y2="11" />
              <line x1="14" x2="14" y1="18" y2="11" />
              <line x1="18" x2="18" y1="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
