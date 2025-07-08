"use client";

import { FRONTEND_ROUTES } from "@/contants/frontend-routes/routes";
import { Marca } from "@/interfaces/marcas/marca.interface";
import Image from "next/image";
import Link from "next/link";

interface MarcasGridProps {
  marcas: Marca[];
}

export default function MarcasGrid({ marcas }: MarcasGridProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {marcas.map((marca) => (
        <Link
          href={`${FRONTEND_ROUTES.PROVEDORES}/${marca.nombre}`}
          key={marca.id}
          className="bg-secondary rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        >
          <div className="relative aspect-square">
            <div className="aspect-square relative bg-white p-2">
              <Image
                src={marca?.img?.url ?? "/default/img.webp"}
                alt={marca.nombre || "img categoria"}
                fill
                className="object-contain "
              />
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold">{marca.nombre}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
