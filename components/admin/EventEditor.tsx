"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Event } from "@/lib/data";

export function EventEditor({ event, isNew }: { event: Event; isNew?: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<Event>(event);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Event>(k: K, v: Event[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setError("");
    const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const payload = { ...data, slug };
    const url = isNew ? "/api/admin/events" : `/api/admin/events/${event.slug}`;
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
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`"${event.title}" silinsin mi?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${event.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      router.push("/admin/events");
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
          <Field label="Başlık" required>
            <input value={data.title} onChange={(e) => update("title", e.target.value)} className="input" required />
          </Field>
          <Field label="URL Slug">
            <input value={data.slug} onChange={(e) => update("slug", e.target.value)} className="input font-mono" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Başlangıç">
              <input
                type="datetime-local"
                value={toLocalInput(data.start)}
                onChange={(e) => update("start", new Date(e.target.value).toISOString())}
                className="input"
              />
            </Field>
            <Field label="Bitiş">
              <input
                type="datetime-local"
                value={toLocalInput(data.end)}
                onChange={(e) => update("end", new Date(e.target.value).toISOString())}
                className="input"
              />
            </Field>
          </div>
          <Field label="Açıklama">
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              className="input resize-none"
            />
          </Field>
          <Field label="">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.active}
                onChange={(e) => update("active", e.target.checked)}
                className="w-4 h-4"
              />
              Aktif
            </label>
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Görsel URL">
            <input
              value={data.image}
              onChange={(e) => update("image", e.target.value)}
              className="input font-mono text-xs"
            />
          </Field>
          {data.image && (
            <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
              <Image src={data.image} alt="Önizleme" fill sizes="300px" className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      <div className="mt-6 flex flex-wrap gap-3 justify-between">
        <button
          onClick={save}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-6 py-3 rounded-lg"
        >
          {saving ? "Kaydediliyor..." : isNew ? "Oluştur" : "Kaydet"}
        </button>
        {!isNew && (
          <button onClick={remove} disabled={saving} className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-6 py-3 rounded-lg">
            Sil
          </button>
        )}
      </div>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid rgb(214 211 209); border-radius: 0.5rem; background: white; }
        .input:focus { outline: none; border-color: rgb(234 88 12); box-shadow: 0 0 0 3px rgb(234 88 12 / 0.2); }`}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}
