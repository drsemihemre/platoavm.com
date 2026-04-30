"use client";

import { useState } from "react";

export function LeasingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/leasing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Bir hata oluştu");
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-700 font-bold text-lg">Başvurunuz alındı!</div>
        <p className="text-green-600 text-sm mt-1">Kısa süre içinde sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Firma Ünvanı" name="company" required />
        <Field label="Marka Adı" name="brand" required />
        <Field label="Yetkili İsim" name="contact" required />
        <Field label="Sektör" name="sector" required />
        <Field label="m²" name="area" type="number" />
        <Field label="Telefon" name="phone" type="tel" required />
      </div>
      <Field label="E-posta" name="email" type="email" required />
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Mesajınız</label>
        <textarea
          name="message"
          rows={4}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none"
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        {status === "loading" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
      />
    </div>
  );
}
