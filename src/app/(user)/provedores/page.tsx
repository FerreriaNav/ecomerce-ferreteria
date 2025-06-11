"use client";
// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import MarcasGrid from "@/modules/common/components/marcas-grid/marcas-grid";
import { TitleGradient } from "@/modules/common/components/titles/title-gradient";
import { Tags } from "lucide-react";
import { getMarcas } from "@/services/marcas/marcas-services";
import { useEffect, useState } from "react";
import { Marca } from "@/interfaces/marcas/marca.interface";

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  useEffect(() => {
    async function fetchMarcas() {
      const marcas = (await getMarcas())?.data ?? [];

      setMarcas(marcas);
    }

    fetchMarcas();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div>
        <TitleGradient
          title="Provedores"
          subtitle="Explora productos de  nuestros provedores"
          tagIcon={<Tags size={40} />}
        />
        <MarcasGrid marcas={marcas} />
      </div>
    </main>
  );
}
