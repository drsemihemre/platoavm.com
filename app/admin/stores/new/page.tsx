import Link from "next/link";
import { StoreEditor } from "@/components/admin/StoreEditor";

export const dynamic = "force-dynamic";

export default function NewStorePage() {
  return (
    <div>
      <Link href="/admin/stores" className="text-sm text-stone-600 hover:text-orange-600">← Mağazalar</Link>
      <h1 className="text-3xl font-extrabold text-stone-900 mt-2 mb-6">Yeni Mağaza</h1>
      <StoreEditor
        isNew
        store={{
          slug: "",
          name: "",
          image: "",
          phone: "",
          floor: "",
          floor_order: 0,
          category: "",
          category_slug: "",
          description: "",
        }}
      />
    </div>
  );
}
