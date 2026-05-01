import type { Metadata } from "next";
import { stores, getCategories, getFloors } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { StoresList } from "@/components/StoresList";

export const metadata: Metadata = {
  title: "Mağazalar",
  description: "Plato AVM'de yer alan tüm mağazaları, restoranları ve eğlence merkezlerini kategori ve kata göre keşfedin.",
};

export default function MagazalarPage() {
  // Hizmet kategorisi /hizmetler sayfasında ayrı; burada alışveriş + yemek + eğlence
  const allBusinesses = stores.filter((s) => s.category !== "Hizmet");
  const categories = getCategories().filter((c) => c.name !== "Hizmet");
  return (
    <>
      <PageHero
        title="Mağazalar"
        subtitle={`Plato AVM'de ${allBusinesses.length} farklı işletmeyi keşfedin`}
        breadcrumb="Mağazalar"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoresList stores={allBusinesses} categories={categories} floors={getFloors()} />
        </div>
      </section>
    </>
  );
}
