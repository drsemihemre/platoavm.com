import type { Metadata } from "next";
import { getEntertainment, getFloors } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { StoresList } from "@/components/StoresList";

export const metadata: Metadata = {
  title: "Eğlence",
  description: "Plato AVM'deki eğlence merkezleri: CineGreen Sinema, Funny Center, Go-Kart, Magic Land.",
};

export default function EglencePage() {
  const items = getEntertainment();
  return (
    <>
      <PageHero
        title="Eğlence"
        subtitle="Sinema, oyun ve aktivite alanlarıyla dolu dolu zaman"
        breadcrumb="Eğlence"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoresList stores={items} categories={[]} floors={getFloors()} showCategoryFilter={false} />
        </div>
      </section>
    </>
  );
}
