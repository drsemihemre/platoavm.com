import type { Metadata } from "next";
import Image from "next/image";
import { services } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Plato AVM ziyaretçilerine sunulan hizmetler ve olanaklar.",
};

export default function HizmetlerPage() {
  return (
    <>
      <PageHero
        title="Hizmetler"
        subtitle="Konforunuz ve rahatlığınız için sunduğumuz olanaklar"
        breadcrumb="Hizmetler"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <article key={service.slug} className="bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                  <Image src={service.icon} alt={service.title} width={40} height={40} className="object-contain" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">{service.title}</h3>
                <p className="text-sm font-semibold text-orange-600 mt-1">{service.location}</p>
                <p className="text-stone-600 mt-3 leading-relaxed">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
