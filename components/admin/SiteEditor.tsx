"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Site } from "@/lib/data";

export function SiteEditor({ site }: { site: Site }) {
  const router = useRouter();
  const [data, setData] = useState<Site>(site);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Site>(k: K, v: Site[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Kaydedilemedi");
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
    <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6">
      <Section title="Genel Bilgiler">
        <Field label="AVM Adı"><input value={data.name} onChange={(e) => update("name", e.target.value)} className="input" /></Field>
        <Field label="Slogan"><input value={data.tagline} onChange={(e) => update("tagline", e.target.value)} className="input" /></Field>
        <Field label="Açıklama"><textarea rows={3} value={data.description} onChange={(e) => update("description", e.target.value)} className="input resize-none" /></Field>
      </Section>

      <Section title="İletişim">
        <Field label="Adres"><input value={data.address} onChange={(e) => update("address", e.target.value)} className="input" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefon (Görünen)"><input value={data.phone} onChange={(e) => update("phone", e.target.value)} className="input" /></Field>
          <Field label="Telefon (tel: linkleri için)"><input value={data.phone_raw} onChange={(e) => update("phone_raw", e.target.value)} className="input font-mono" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Faks"><input value={data.fax} onChange={(e) => update("fax", e.target.value)} className="input" /></Field>
          <Field label="E-posta"><input value={data.email} onChange={(e) => update("email", e.target.value)} className="input" /></Field>
        </div>
        <Field label="Çalışma Saatleri"><input value={data.hours} onChange={(e) => update("hours", e.target.value)} className="input" /></Field>
      </Section>

      <Section title="Sosyal Medya">
        <Field label="Facebook"><input value={data.social.facebook} onChange={(e) => update("social", { ...data.social, facebook: e.target.value })} className="input" /></Field>
        <Field label="Instagram"><input value={data.social.instagram} onChange={(e) => update("social", { ...data.social, instagram: e.target.value })} className="input" /></Field>
        <Field label="Twitter / X"><input value={data.social.twitter} onChange={(e) => update("social", { ...data.social, twitter: e.target.value })} className="input" /></Field>
        <Field label="LinkedIn"><input value={data.social.linkedin} onChange={(e) => update("social", { ...data.social, linkedin: e.target.value })} className="input" /></Field>
      </Section>

      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
      {success && <div className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">Kaydedildi</div>}

      <button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-6 py-3 rounded-lg">
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid rgb(214 211 209); border-radius: 0.5rem; background: white; }
        .input:focus { outline: none; border-color: rgb(234 88 12); box-shadow: 0 0 0 3px rgb(234 88 12 / 0.2); }`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-bold text-stone-900 mb-2">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
