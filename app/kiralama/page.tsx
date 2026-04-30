import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LeasingForm } from "@/components/LeasingForm";

export const metadata: Metadata = {
  title: "Kiralama",
  description: "Plato AVM'de mağaza kiralama başvurusu.",
};

export default function KiralamaPage() {
  return (
    <>
      <PageHero
        title="Kiralama"
        subtitle="Plato AVM'de mağaza açmak için başvurun"
        breadcrumb="Kiralama"
      />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Kiralama Başvuru Formu</h2>
            <p className="text-stone-600 mb-6">İşletmeniz için Plato AVM&apos;de uygun bir alan bulalım. Aşağıdaki formu doldurarak başvurunuzu iletebilirsiniz.</p>
            <LeasingForm />
          </div>
        </div>
      </section>
    </>
  );
}
