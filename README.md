# Plato AVM Web Sitesi

Sultanbeyli'de yer alan Plato AVM'nin yeni nesil web sitesi. Next.js 16 + Tailwind CSS 4 ile inşa edilmiş, tam mobil uyumlu, hızlı ve admin panelli.

## Özellikler

- **46 mağaza, 4 eğlence merkezi, 12 yeme-içme noktası** verisi yapılandırılmış JSON dosyalarında
- **Mağazalar / Yemek / Eğlence** sayfalarında kategori ve kat filtreleme
- **Mağaza detay sayfaları** (statik üretim ile hızlı yükleme)
- **İletişim ve Kiralama formları** (webhook entegrasyonlu API route)
- **Admin paneli** (`/admin`) — JWT cookie ile kimlik doğrulama
  - Mağaza ekle/düzenle/sil
  - Etkinlik ekle/düzenle/sil
  - Hizmet listesi düzenleme
  - Site ayarları (iletişim, sosyal medya)
- **Analytics** — Google Analytics ve Plausible.io desteği

## Geliştirme

```bash
cp .env.example .env.local
# .env.local içindeki değerleri güncelle
npm install
PLATO_DATA_DIR="$(pwd)/data" npm run dev
```

http://localhost:3000 — site
http://localhost:3000/admin — yönetim

## Vercel Deploy

Repo'yu Vercel'e bağla. Aşağıdaki ortam değişkenlerini ayarla:

- `ADMIN_USERNAME` — yönetici kullanıcı adı
- `ADMIN_PASSWORD` — yönetici şifresi (güçlü olsun)
- `ADMIN_SESSION_SECRET` — JWT imzalama anahtarı (en az 32 karakter rastgele)
- `NEXT_PUBLIC_GA_ID` (opsiyonel) — Google Analytics
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (opsiyonel) — Plausible domain

> **Not:** Vercel'in dosya sistemi salt-okunurdur. Üretim ortamında admin panelinden yapılan içerik değişiklikleri kalıcı olmaz. Veriler için kalıcı saklama (Vercel KV, GitHub commit-back, vb.) gerekir.

## Veri Yapısı

```
data/
├── site.json       # AVM bilgileri, iletişim, sosyal medya
├── stores.json     # Mağaza listesi
├── services.json   # Hizmet listesi
└── events.json     # Etkinlikler
```

## Migration Notu

Bu site, eski WordPress kurulumundan (Güzel Hosting üzerinde) modern bir Jamstack mimariye taşınmıştır. Tüm görseller, mağaza bilgileri ve içerikler eski siteden aktarılmıştır.
