import type { Metadata } from "next";
import { getRestaurants, getFloors } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { StoresList } from "@/components/StoresList";

export const metadata: Metadata = {
  title: "Yemek",
  description: "Plato AVM'deki restoran, kafe ve yeme-içme işletmeleri.",
};

export default function YemekPage() {
  const restaurants = getRestaurants();
  return (
    <>
      <PageHero
        title="Yemek"
        subtitle={`${restaurants.length} farklı lezzet noktası seni bekliyor`}
        breadcrumb="Yemek"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StoresList stores={restaurants} categories={[]} floors={getFloors()} showCategoryFilter={false} />
        </div>
      </section>
    </>
  );
}
