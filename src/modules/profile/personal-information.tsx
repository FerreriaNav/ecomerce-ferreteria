"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Clock } from "lucide-react";
import Image from "next/image";
import { Cotizacion } from "@/interfaces/cotizaciones/cotizacion.interface";
import { getTimeSinceCreation } from "@/lib/timeCreationProfile";

interface PersonalInformationProps {
  quotes:  Cotizacion[] | null;
  timeCreationAccount: string | null;
  orders: Cotizacion[] | null;
}

export function PersonalInformation({ quotes, timeCreationAccount, orders }: PersonalInformationProps) {
  return (
    <div className="space-y-6">
      <ActivityStats quotes={quotes} timeAccount={timeCreationAccount ?? ""} />
      {/* <FavoriteCategories /> */}
      <RecentPurchases orders={orders || []} />
      {/* <RecommendedProducts /> */}
    </div>
  );
}

function ActivityStats({ quotes, timeAccount }: { quotes: Cotizacion[] | null, timeAccount: string | null }) {
  const year = new Date(timeAccount!.toString())
  const estadisticas = [
    {
      titulo: "Total de cotizaciones",
      valor: quotes?.length.toString(),
      descripcion: "Cotizaciones realizados",
      icono: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    },
    // {
    //   titulo: "Productos comprados",
    //   valor: 87,
    //   descripcion: "Artículos diferentes",
    //   icono: <Package className="h-5 w-5 text-green-500" />,
    // },
    {
      titulo: "Tiempo como cliente",
      valor: getTimeSinceCreation(timeAccount!.toString()),
      descripcion: `Cliente desde ${year.getFullYear().toString()}`,
      icono: <Clock className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumen de actividad</CardTitle>
        <CardDescription>
          Tu historial como cliente en nuestra ferretería
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estadisticas.map((stat, index) => (
            <div key={index} className="text-center p-4 border rounded-lg">
              <div className="flex justify-center mb-2">{stat.icono}</div>
              <div className="font-bold text-2xl">{stat.valor}</div>
              <div className="font-medium text-sm">{stat.titulo}</div>
              <div className="text-xs text-muted-foreground">
                {stat.descripcion}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// function FavoriteCategories() {
//   const categoriasFavoritas = [
//     { nombre: "Herramientas Eléctricas", compras: 12, icono: "⚡" },
//     { nombre: "Herramientas Manuales", compras: 8, icono: "🔧" },
//     { nombre: "Materiales de Construcción", compras: 6, icono: "🧱" },
//     { nombre: "Seguridad Industrial", compras: 4, icono: "🦺" },
//   ];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <TrendingUp className="h-5 w-5 text-orange-500" />
//           Tus categorías favoritas
//         </CardTitle>
//         <CardDescription>
//           Productos que más compras en nuestra tienda
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {categoriasFavoritas.map((categoria, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between p-3 border rounded-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl">{categoria.icono}</span>
//                 <div>
//                   <div className="font-medium">{categoria.nombre}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {categoria.compras} compras
//                   </div>
//                 </div>
//               </div>
//               <Badge variant="secondary">{categoria.compras}</Badge>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

function RecentPurchases({ orders }: { orders: Cotizacion[] | null }) {
  // const productosRecientes = [
  //   {
  //     nombre: "Taladro Inalámbrico DeWalt",
  //     fecha: "15 Jun 2023",
  //     precio: "$1,299.00",
  //     imagen: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     nombre: "Juego de Llaves Combinadas",
  //     fecha: "8 Jun 2023",
  //     precio: "$450.00",
  //     imagen: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     nombre: "Casco de Seguridad",
  //     fecha: "2 Jun 2023",
  //     precio: "$180.00",
  //     imagen: "/placeholder.svg?height=60&width=60",
  //   },
  // ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Compras recientes
        </CardTitle>
        <CardDescription>Últimos productos que has adquirido</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders?.map((producto, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <Image
                width={100}
                height={100}
                src={producto.productos[0].producto.coverUrl || "/imgs/products/default-img.png"}
                alt={producto.productos[0].producto.nombre}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{producto.productos[0].producto.nombre}</div>
                <div className="text-xs text-muted-foreground uppercase">
                   {producto.productos[0].producto.marca?.nombre} - {producto.productos[0].producto.categorias[0].nombre}
                </div>
              </div>
              {/* <div className="font-bold text-green-600">{producto.productos[0].producto.}</div> */}
              <div className="font-bold text-green-600">$1,299</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// function RecommendedProducts() {
//   const recommendedProducts = [
//     {
//       nombre: "Brocas para Concreto Set 5 piezas",
//       precio: "$299.00",
//       badge: "Complemento ideal",
//       imagen: "/placeholder.svg?height=100&width=100",
//     },
//     {
//       nombre: "Guantes de Trabajo Reforzados",
//       precio: "$89.00",
//       badge: "Más vendido",
//       imagen: "/placeholder.svg?height=100&width=100",
//     },
//   ];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Wrench className="h-5 w-5 text-red-500" />
//           Recomendado para ti
//         </CardTitle>
//         <CardDescription>Productos que podrían interesarte</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {recommendedProducts.map((product, index) => (
//             <div key={index} className="border rounded-lg p-4 space-y-2">
//               <Image
//                 width={100}
//                 height={100}
//                 src={product.imagen || "/placeholder.svg"}
//                 alt={product.nombre}
//                 className="w-full h-24 object-cover rounded"
//               />
//               <h4 className="font-medium text-sm">{product.nombre}</h4>
//               <div className="flex items-center justify-between">
//                 <span className="font-bold text-green-600">
//                   {product.precio}
//                 </span>
//                 <Badge variant="secondary" className="text-xs">
//                   {product.badge}
//                 </Badge>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
