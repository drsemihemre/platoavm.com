import type { Metadata } from "next";
import { stores, getCategories, getFloors, getRetail } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { StoresList } from "@/components/StoresList";

export const metadata: Metadata = {
  title: "Mağazalar",
  description: "Plato AVM'de yer alan tüm mağazaları kategori ve kata göre keşfedin.",
};

export default function MagazalarPage() {
  const retail = getRetail();
  return (
    <>
      <PageHero
        title="Mağazalar"
        subtitle={`Plato AVM'de ${stores.length} farklı işletmeyi keşfedin`}
        breadcrumb="Mağazalar"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoresList stores={retail} categories={getCategories().filter(c => !["Yeme & İçme", "Eğlence", "Hizmet"].includes(c.name))} floors={getFloors()} />
        </div>
      </section>
    </>
  );
}
