"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fd.get("username"),
          password: fd.get("password"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Giriş başarısız");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Kullanıcı Adı</label>
        <input
          name="username"
          type="text"
          required
          autoFocus
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Şifre</label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
