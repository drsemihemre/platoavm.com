import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { gallery, stores } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Plato AVM'den kareler: mağazalar, mekânlar ve yaşam alanlarımız.",
  alternates: { canonical: "/galeri" },
};

export default function GaleriPage() {
  return (
    <>
      <PageHero
        title="Galeri"
        subtitle={`Plato AVM'den ${gallery.length} kare`}
        breadcrumb="Galeri"
      />

      {/* GERÇEK FOTOĞRAFLAR */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((photo, i) => (
              <figure
                key={photo.src}
                className="relative aspect-[3/2] rounded-xl overflow-hidden bg-stone-100 group"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 6}
                  loading={i < 6 ? undefined : "lazy"}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* MARKALAR */}
      <section className="py-12 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Markalarımız</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {stores.map((s) => (
              <Link
                key={s.slug}
                href={`/magaza/${s.slug}`}
                className="group relative aspect-square rounded-lg overflow-hidden bg-white border border-stone-200 hover:shadow-lg transition-shadow"
                title={s.name}
              >
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  loading="lazy"
                  className="object-contain p-3"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
