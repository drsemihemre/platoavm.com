"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Store } from "@/lib/data";

const FLOORS = [
  { value: "", label: "—" },
  { value: "-3. Kat (Otopark 2)", label: "-3. Kat (Otopark 2)", order: -3 },
  { value: "-2. Kat (Otopark 1)", label: "-2. Kat (Otopark 1)", order: -2 },
  { value: "-1. Kat", label: "-1. Kat", order: -1 },
  { value: "Zemin Kat", label: "Zemin Kat", order: 0 },
  { value: "1. Kat", label: "1. Kat", order: 1 },
  { value: "2. Kat", label: "2. Kat", order: 2 },
];

const CATEGORIES = [
  "Giyim", "Yeme & İçme", "Eğlence", "Kozmetik", "Ayakkabı & Çanta",
  "Optik & Aksesuar", "Mobilya & Ev Tekstili", "Elektronik Market",
  "Hizmet", "Süpermarket", "Çocuk Giyim", "Kitap & Kırtasiye",
  "Spor", "Şarj İstasyonu", "Oto Yıkama",
];

export function StoreEditor({ store, isNew }: { store: Store; isNew?: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<Store>(store);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Store>(key: K, value: Store[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const payload = { ...data, slug };
    const url = isNew ? "/api/admin/stores" : `/api/admin/stores/${store.slug}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Kaydedilemedi");
      }
      router.push("/admin/stores");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${store.name}" silinecek. Emin misin?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/stores/${store.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      router.push("/admin/stores");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Field label="Mağaza Adı" required>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="URL Slug" hint="Örn: lc-waikiki, abc-magaza">
            <input
              type="text"
              value={data.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="input font-mono"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori">
              <select
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                className="input"
              >
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Kat">
              <select
                value={data.floor}
                onChange={(e) => {
                  const f = FLOORS.find((x) => x.value === e.target.value);
                  update("floor", e.target.value);
                  if (f && "order" in f) update("floor_order", f.order!);
                }}
                className="input"
              >
                {FLOORS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Telefon">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input"
              placeholder="0216 398 64 64"
            />
          </Field>
          <Field label="Açıklama">
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="Görsel URL" hint="/images/stores/abc.jpg">
            <input
              type="text"
              value={data.image}
              onChange={(e) => update("image", e.target.value)}
              className="input font-mono text-xs"
            />
          </Field>
          {data.image && (
            <div className="relative aspect-square bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
              <Image
                src={data.image}
                alt={data.name || "Önizleme"}
                fill
                sizes="300px"
                className="object-contain p-4"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 justify-between">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {saving ? "Kaydediliyor..." : isNew ? "Oluştur" : "Kaydet"}
        </button>
        {!isNew && (
          <button
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Sil
          </button>
        )}
      </div>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid rgb(214 211 209); border-radius: 0.5rem; background: white; }
        .input:focus { outline: none; border-color: rgb(234 88 12); box-shadow: 0 0 0 3px rgb(234 88 12 / 0.2); }`}</style>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}
