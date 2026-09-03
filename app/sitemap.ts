import type { MetadataRoute } from "next";
import { stores } from "@/lib/data";

const BASE = "https://www.platoavm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/magazalar`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/yemek`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/eglence`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/etkinlikler`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/hizmetler`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/kiralama`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/kurumsal`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/galeri`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const storePages: MetadataRoute.Sitemap = stores.map((s) => ({
    url: `${BASE}/magaza/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...storePages];
}
