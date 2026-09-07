import type { NextConfig } from "next";

/**
 * Eski WordPress sitesinden gelen URL'ler için kalıcı (308) yönlendirmeler.
 * Amaç: Google indeksindeki ve dış sitelerdeki mevcut bağlantılar 404 vermesin.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Tek kanonik adres: platoavm.com -> www.platoavm.com (308).
      // Aynı içeriğin iki adreste 200 dönmesi arama motorları için
      // çift içerik, analitik için bölünmüş trafik demekti.
      // Not: koşul yalnızca çıplak alan adında eşleşir; www, vercel.app
      // önizlemeleri ve localhost etkilenmez (döngü riski yok).
      {
        source: "/:path*",
        has: [{ type: "host", value: "platoavm.com" }],
        destination: "https://www.platoavm.com/:path*",
        permanent: true,
      },

      // Sinema işletmecisi değişti: CinePlato -> CineGreen
      { source: "/magaza/cineplato", destination: "/magaza/cinegreen", permanent: true },
      { source: "/magaza/cineplato/:path*", destination: "/magaza/cinegreen", permanent: true },

      // Eski WordPress taksonomi arşivleri (12 kategori + 6 kat) -> mağaza listesi
      { source: "/magaza-kategorisi/:slug*", destination: "/magazalar", permanent: true },
      { source: "/magaza-kati/:slug*", destination: "/magazalar", permanent: true },

      // The Events Calendar tekil etkinlik sayfaları -> etkinlikler
      { source: "/etkinlik/:slug*", destination: "/etkinlikler", permanent: true },
      // The Events Calendar ay/liste görünümleri (eski sitede gerçek sayfalardı)
      { source: "/etkinlikler/ay/:path*", destination: "/etkinlikler", permanent: true },
      { source: "/etkinlikler/liste/:path*", destination: "/etkinlikler", permanent: true },

      // WordPress kalıntıları
      { source: "/kvkk/plato_avm_kvkk.pdf", destination: "/kvkk", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },

      // Google'in bildigi eski sitemap adresi bosa dusmesin
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap-:path(.*)", destination: "/sitemap.xml", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Güvenlik başlıkları — tüm yanıtlarda.
        //
        // CSP bilinçli olarak "güvenli alt küme": script-src / style-src
        // TANIMLANMADI. Sebep: sayfalar statik üretiliyor, nonce üretmek
        // her isteği dinamik render'a zorlardı; katı bir script-src ise
        // Google Haritalar gömülüsünü ve Vercel Analytics'i kırardı.
        // Aşağıdaki dört direktif ise hiçbir meşru davranışı engellemeden
        // clickjacking, <base> enjeksiyonu, form kaçırma ve eklenti
        // içeriği saldırılarını kapatır.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; " +
              "form-action 'self'; upgrade-insecure-requests",
          },
        ],
      },
      {
        // Gorseller ve video her sayfa gecisinde yeniden dogrulanmasin
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
