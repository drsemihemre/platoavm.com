import type { Metadata } from "next";
import Image from "next/image";
import { events } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description: "Plato AVM'de gerçekleşen ve gerçekleşecek etkinlikler.",
};

export default function EtkinliklerPage() {
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.end) > now);
  const past = events.filter((e) => new Date(e.end) <= now);

  return (
    <>
      <PageHero
        title="Etkinlikler"
        subtitle="Plato AVM'de düzenlenen tüm etkinlikler"
        breadcrumb="Etkinlikler"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {upcoming.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Yaklaşan Etkinlikler</h2>
              <EventGrid events={upcoming} />
            </>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
              <p className="text-stone-700 text-lg">Şu anda yaklaşan etkinlik bulunmuyor.</p>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Geçmiş Etkinlikler</h2>
              <EventGrid events={past} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EventGrid({ events }: { events: typeof import("@/lib/data").events }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <article key={event.slug} className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-shadow group">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <time className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              {new Date(event.start).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              {" - "}
              {new Date(event.end).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <h3 className="mt-2 text-lg font-bold text-stone-900">{event.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{event.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
