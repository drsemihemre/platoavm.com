import { notFound } from "next/navigation";
import Link from "next/link";
import { getStores } from "@/lib/storage";
import { StoreEditor } from "@/components/admin/StoreEditor";

export const dynamic = "force-dynamic";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stores = await getStores();
  const store = stores.find((s) => s.slug === slug);
  if (!store) notFound();

  return (
    <div>
      <Link href="/admin/stores" className="text-sm text-stone-600 hover:text-orange-600">← Mağazalar</Link>
      <h1 className="text-3xl font-extrabold text-stone-900 mt-2 mb-6">{store.name}</h1>
      <StoreEditor store={store} />
    </div>
  );
}
