import Link from "next/link";
import { getStores, getServices, getEvents } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stores, services, events] = await Promise.all([
    getStores(),
    getServices(),
    getEvents(),
  ]);
  const upcoming = events.filter((e) => new Date(e.end) > new Date()).length;

  const tiles = [
    { href: "/admin/stores", label: "Mağazalar", count: stores.length, color: "bg-orange-500" },
    { href: "/admin/services", label: "Hizmetler", count: services.length, color: "bg-blue-500" },
    { href: "/admin/events", label: "Etkinlikler", count: events.length, color: "bg-purple-500", sub: `${upcoming} yaklaşan` },
    { href: "/admin/site", label: "Site Ayarları", count: 1, color: "bg-emerald-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900">Yönetim Paneli</h1>
      <p className="text-stone-600 mt-1">Plato AVM içerik yönetimi</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 ${tile.color} text-white rounded-xl flex items-center justify-center font-bold text-xl mb-3`}>
              {tile.count}
            </div>
            <div className="text-stone-900 font-bold">{tile.label}</div>
            {tile.sub && <div className="text-xs text-stone-500 mt-1">{tile.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white border border-stone-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/admin/stores/new" className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50">
            <div className="font-semibold text-stone-900">+ Yeni Mağaza Ekle</div>
            <div className="text-xs text-stone-500 mt-1">Yeni bir işletme kartı oluştur</div>
          </Link>
          <Link href="/admin/events/new" className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50">
            <div className="font-semibold text-stone-900">+ Yeni Etkinlik Ekle</div>
            <div className="text-xs text-stone-500 mt-1">Yaklaşan bir etkinlik duyur</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
