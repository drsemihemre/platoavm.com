import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEvents();
  const sorted = [...events].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">Etkinlikler</h1>
          <p className="text-stone-600 mt-1">{events.length} kayıt</p>
        </div>
        <Link href="/admin/events/new" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
          + Yeni Ekle
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((e) => {
          const isPast = new Date(e.end) < new Date();
          return (
            <Link
              key={e.slug}
              href={`/admin/events/${e.slug}`}
              className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="relative w-24 h-24 bg-stone-100 rounded-lg flex-shrink-0">
                <Image src={e.image} alt={e.title} fill sizes="96px" className="object-cover rounded-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-900 truncate">{e.title}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  {new Date(e.start).toLocaleDateString("tr-TR")} - {new Date(e.end).toLocaleDateString("tr-TR")}
                </p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded ${isPast ? "bg-stone-200 text-stone-700" : "bg-emerald-100 text-emerald-800"}`}>
                  {isPast ? "Geçmiş" : "Aktif"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
