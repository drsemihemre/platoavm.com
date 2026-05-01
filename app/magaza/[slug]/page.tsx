import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { stores, getStore, site } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return { title: "Mağaza Bulunamadı" };
  return {
    title: store.name,
    description: store.description || `${store.name} - ${site.name} ${store.floor}`,
    openGraph: {
      title: store.name,
      description: store.description || `${store.name} - ${site.name}`,
      images: [store.image],
    },
  };
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  const related = stores
    .filter((s) => s.category === store.category && s.slug !== store.slug)
    .slice(0, 4);

  return (
    <>
      <section className="bg-stone-100 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-stone-600">
            <Link href="/" className="hover:text-orange-600">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/magazalar" className="hover:text-orange-600">Mağazalar</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-900 font-medium">{store.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-[4/3] bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <Image
                src={store.image}
                alt={store.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
              />
            </div>
            <div>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {store.category || "Mağaza"}
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-stone-900">{store.name}</h1>
              {store.description && (
                <p className="mt-4 text-stone-700 leading-relaxed">{store.description}</p>
              )}

              <dl className="mt-8 space-y-4 border-t border-stone-200 pt-8">
                <Detail label="Kat" value={store.floor || "—"} />
                <Detail label="Kategori" value={store.category || "—"} />
                {store.phone && (
                  <Detail
                    label="Telefon"
                    value={
                      <a
                        href={`tel:${store.phone.replace(/\s/g, "")}`}
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                      >
                        {store.phone}
                      </a>
                    }
                  />
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {store.ticket_url && (
                  <a
                    href={store.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <TicketIcon /> Online Bilet Al
                  </a>
                )}
                {store.phone && (
                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                      store.ticket_url
                        ? "bg-stone-100 hover:bg-stone-200 text-stone-900"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                  >
                    <PhoneIcon /> Ara
                  </a>
                )}
                <Link
                  href="/iletisim"
                  className="inline-flex items-center bg-stone-100 hover:bg-stone-200 text-stone-900 px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  Yol Tarifi Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {store.ticket_url && (
        <section className="py-12 bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">Vizyondaki Filmler & Seanslar</h2>
                <p className="text-stone-600 mt-1">
                  Online bilet satışı{" "}
                  <a
                    href={store.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Biletinial
                  </a>
                  {" "}üzerinden yapılmaktadır.
                </p>
              </div>
              <a
                href={store.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors text-sm"
              >
                Tüm Seansları Gör →
              </a>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <iframe
                src={store.ticket_url}
                title="Vizyondaki Filmler"
                className="w-full"
                style={{ height: "1100px", border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-12 bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Benzer İşletmeler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/magaza/${s.slug}`}
                  className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square bg-stone-50">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600">{s.name}</h3>
                    <p className="text-xs text-stone-500">{s.floor}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2">
      <dt className="text-sm font-semibold text-stone-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-stone-900 font-medium">{value}</dd>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.7.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}
