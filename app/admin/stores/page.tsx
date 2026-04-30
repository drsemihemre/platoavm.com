import Link from "next/link";
import Image from "next/image";
import { getStores } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const stores = await getStores();
  const sorted = [...stores].sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">Mağazalar</h1>
          <p className="text-stone-600 mt-1">{stores.length} işletme kayıtlı</p>
        </div>
        <Link
          href="/admin/stores/new"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Ekle
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-stone-700"></th>
              <th className="text-left px-4 py-3 font-semibold text-stone-700">Ad</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-700">Kategori</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-700">Kat</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-700">Telefon</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sorted.map((s) => (
              <tr key={s.slug} className="hover:bg-stone-50">
                <td className="px-4 py-2">
                  <div className="relative w-10 h-10 bg-stone-50 rounded">
                    <Image src={s.image} alt={s.name} fill sizes="40px" className="object-contain p-1" />
                  </div>
                </td>
                <td className="px-4 py-2 font-semibold text-stone-900">{s.name}</td>
                <td className="px-4 py-2 text-stone-600">{s.category}</td>
                <td className="px-4 py-2 text-stone-600">{s.floor}</td>
                <td className="px-4 py-2 text-stone-600">{s.phone}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/stores/${s.slug}`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Düzenle →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
