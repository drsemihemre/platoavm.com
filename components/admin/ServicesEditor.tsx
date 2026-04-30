"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Service } from "@/lib/data";

export function ServicesEditor({ services: initial }: { services: Service[] }) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initial);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(idx: number, patch: Partial<Service>) {
    setServices((s) => s.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  }
  function remove(idx: number) {
    setServices((s) => s.filter((_, i) => i !== idx));
  }
  function add() {
    setServices((s) => [
      ...s,
      { slug: `hizmet-${s.length + 1}`, title: "Yeni Hizmet", icon: "/images/services/atm.png", description: "", location: "" },
    ]);
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Hata");
      }
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {services.map((service, idx) => (
        <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-4">
          <div className="relative w-20 h-20 bg-stone-50 rounded-lg flex-shrink-0">
            {service.icon && <Image src={service.icon} alt={service.title} fill sizes="80px" className="object-contain p-2" />}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={service.title} onChange={(e) => update(idx, { title: e.target.value })} placeholder="Başlık" className="input" />
            <input value={service.slug} onChange={(e) => update(idx, { slug: e.target.value })} placeholder="Slug" className="input font-mono text-xs" />
            <input value={service.icon} onChange={(e) => update(idx, { icon: e.target.value })} placeholder="İkon URL" className="input font-mono text-xs" />
            <input value={service.location} onChange={(e) => update(idx, { location: e.target.value })} placeholder="Konum" className="input" />
            <textarea value={service.description} onChange={(e) => update(idx, { description: e.target.value })} placeholder="Açıklama" rows={2} className="input md:col-span-2 resize-none" />
          </div>
          <button onClick={() => remove(idx)} className="text-red-600 hover:text-red-700 self-start">Sil</button>
        </div>
      ))}

      <button onClick={add} className="w-full border-2 border-dashed border-stone-300 rounded-2xl p-4 text-stone-600 hover:border-orange-500 hover:text-orange-600 font-semibold">
        + Yeni Hizmet
      </button>

      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
      {success && <div className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">Kaydedildi</div>}

      <button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-6 py-3 rounded-lg">
        {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
      </button>
      <style>{`.input { padding: 0.5rem 0.75rem; border: 1px solid rgb(214 211 209); border-radius: 0.375rem; background: white; }
        .input:focus { outline: none; border-color: rgb(234 88 12); box-shadow: 0 0 0 3px rgb(234 88 12 / 0.2); }`}</style>
    </div>
  );
}
