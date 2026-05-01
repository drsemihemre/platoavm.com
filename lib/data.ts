import storesData from "@/data/stores.json";
import servicesData from "@/data/services.json";
import eventsData from "@/data/events.json";
import siteData from "@/data/site.json";

export type Store = {
  slug: string;
  name: string;
  image: string;
  phone: string;
  floor: string;
  floor_order: number;
  category: string;
  category_slug: string;
  description: string;
  ticket_url?: string;
  external_url?: string;
};

export type Service = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  location: string;
};

export type Event = {
  slug: string;
  title: string;
  image: string;
  start: string;
  end: string;
  description: string;
  active: boolean;
};

export type Site = {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  phone_raw: string;
  fax: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
};

export const stores = storesData as Store[];
export const services = servicesData as Service[];
export const events = eventsData as Event[];
export const site = siteData as Site;

export function getStoresByCategory(category: string) {
  return stores.filter((s) => s.category === category);
}

export function getStoresByFloor(floor: string) {
  return stores.filter((s) => s.floor === floor);
}

export function getStore(slug: string) {
  return stores.find((s) => s.slug === slug);
}

export function getCategories() {
  const cats = new Map<string, number>();
  stores.forEach((s) => {
    if (s.category) cats.set(s.category, (cats.get(s.category) || 0) + 1);
  });
  return Array.from(cats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getFloors() {
  const floors = new Map<string, { count: number; order: number }>();
  stores.forEach((s) => {
    if (s.floor) {
      const existing = floors.get(s.floor);
      floors.set(s.floor, {
        count: (existing?.count || 0) + 1,
        order: s.floor_order,
      });
    }
  });
  return Array.from(floors.entries())
    .map(([name, { count, order }]) => ({ name, count, order }))
    .sort((a, b) => b.order - a.order);
}

export function getRestaurants() {
  return stores.filter((s) => s.category === "Yeme & İçme");
}

export function getEntertainment() {
  return stores.filter((s) => s.category === "Eğlence");
}

export function getRetail() {
  return stores.filter(
    (s) => !["Yeme & İçme", "Eğlence", "Hizmet"].includes(s.category)
  );
}
