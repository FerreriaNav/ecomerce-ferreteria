import React from "react";
import Navbar from "./navbar";
import { getMarcas } from "@/services/marcas/marcas-services";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { getCategorias } from "@/services/categories/categories-services";
import { getInfoEcommerce } from "@/services/informacion-tienda/informacion-tienda-services";
import { auth } from "@/auth";

export const HeaderShop = async () => {
  try {
    const informacionTienda = (await getInfoEcommerce())?.data ?? null;
    const categorias = (await getCategorias())?.data ?? [];
    const marcas = (await getMarcas())?.data ?? [];
    const sesion = await auth();

    return (
      <header className="">
        <Navbar
          informacionTienda={informacionTienda}
          marcas={marcas}
          categorias={categorias}
          session={sesion}
        ></Navbar>
        <div className="container mx-auto  pt-20">
          <BreadcrumbNav></BreadcrumbNav>
        </div>
      </header>
    );
  } catch {
    return (
      <header className="">
        <Navbar
          informacionTienda={null}
          marcas={[]}
          categorias={[]}
          session={null}
        ></Navbar>
        <div className="container mx-auto  pt-20">
          <BreadcrumbNav></BreadcrumbNav>
        </div>
      </header>
    );
  }
};
