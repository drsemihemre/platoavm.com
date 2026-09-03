import type { NextConfig } from "next";

/**
 * Eski WordPress sitesinden gelen URL'ler için kalıcı (308) yönlendirmeler.
 * Amaç: Google indeksindeki ve dış sitelerdeki mevcut bağlantılar 404 vermesin.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
