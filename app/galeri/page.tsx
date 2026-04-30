import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { stores } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Plato AVM mağaza ve mekanlarından kareler.",
};

export default function GaleriPage() {
  return (
    <>
      <PageHero
        title="Galeri"
        subtitle="Plato AVM'nin tüm mağazalarına bir bakış"
        breadcrumb="Galeri"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {stores.map((s) => (
              <Link key={s.slug} href={`/magaza/${s.slug}`} className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-bold text-sm">{s.name}</h3>
                    <p className="text-xs opacity-90">{s.floor}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
