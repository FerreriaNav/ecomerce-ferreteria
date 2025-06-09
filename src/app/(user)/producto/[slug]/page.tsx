// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";

import { ProductDetail } from "@/modules/product-detail/components/product-detail";
import { getProductWithVariantesBySlug } from "@/services/products/products-services";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductWithVariantesBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-10 py-4">
      <ProductDetail product={product} selectedSlug={slug} />
    </main>
  );
}
