"use client";

import { useState, useMemo } from "react";
import { StoreCard } from "./StoreCard";
import type { Store } from "@/lib/data";

type Props = {
  stores: Store[];
  categories: { name: string; count: number }[];
  floors: { name: string; count: number; order: number }[];
  showCategoryFilter?: boolean;
};

export function StoresList({ stores, categories, floors, showCategoryFilter = true }: Props) {
  const [category, setCategory] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    let result = stores;
    if (category) result = result.filter((s) => s.category === category);
    if (floor) result = result.filter((s) => s.floor === floor);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    return result;
  }, [stores, category, floor, query]);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <SearchIcon />
            <input
              type="search"
              placeholder="Mağaza adı ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            />
          </div>
          {showCategoryFilter && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
              ))}
            </select>
          )}
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white"
          >
            <option value="">Tüm Katlar</option>
            {floors.map((f) => (
              <option key={f.name} value={f.name}>{f.name} ({f.count})</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-stone-500">
            <strong className="text-stone-900">{filtered.length}</strong> sonuç
          </span>
          {(category || floor || query) && (
            <button
              onClick={() => { setCategory(""); setFloor(""); setQuery(""); }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          Sonuç bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
