# Plato AVM Web Sitesi

Sultanbeyli'de yer alan Plato AVM'nin yeni nesil web sitesi. Next.js 16 + Tailwind CSS 4 ile inşa edilmiş, tam mobil uyumlu, hızlı ve admin panelli.

## Özellikler

- **46 mağaza, 4 eğlence merkezi, 12 yeme-içme noktası** verisi yapılandırılmış JSON dosyalarında
- **Mağazalar / Yemek / Eğlence** sayfalarında kategori ve kat filtreleme
- **Mağaza detay sayfaları** (statik üretim ile hızlı yükleme)
- **İletişim ve Kiralama formları** — Google Workspace (Gmail SMTP) üzerinden
  `yonetim@platoavm.com` adresine e-posta; sessiz başarısızlık yok
- **Form kötüye kullanım koruması** — honeypot + doldurma süresi + IP başına ve
  toplam hız sınırı; opsiyonel Cloudflare Turnstile katmanı
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

**Zorunlu**

- `SMTP_USER` — form e-postalarını gönderen Google Workspace hesabı
- `SMTP_PASS` — o hesap için üretilmiş Uygulama Şifresi (tam 16 küçük harf)
- `ADMIN_USERNAME` — yönetici kullanıcı adı
- `ADMIN_PASSWORD` veya `ADMIN_PASSWORD_HASH` — yönetici şifresi; hash tercih
  edilir (`node -e "console.log(require('bcryptjs').hashSync(process.argv[1],12))" 'SIFRE'`)
- `ADMIN_SESSION_SECRET` — JWT imzalama anahtarı (en az 32 karakter rastgele)

**Opsiyonel**

- `FORM_TO_EMAIL` — formların düşeceği kutu (varsayılan `yonetim@platoavm.com`)
- `FORM_FROM_NAME` — gönderen görünen adı
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — Cloudflare
  Turnstile ile form doğrulaması. **İkisi birlikte** tanımlanmalı; boşsa bu
  katman sessizce devre dışı kalır ve site normal çalışır.
- `NEXT_PUBLIC_GA_ID` — Google Analytics
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible domain

### Form güvenliği nasıl çalışıyor?

Her form gönderimi gerçek bir e-posta üretir ve Google Workspace kotası günlük
~2.000 iletidir. Uç noktalar dört bağımsız katmanla korunur (`lib/form-guard.ts`):

1. **Honeypot** — ekran dışındaki gizli alan dolduysa istek reddedilir
2. **Doldurma süresi** — 3 saniyeden hızlı gönderim bot sayılır
3. **Turnstile** — anahtar tanımlıysa Cloudflare insan doğrulaması
4. **Hız sınırı** — IP başına 15 dakikada 6 (iletişim) / 4 (kiralama) gönderim,
   ayrıca örnek başına saatte en fazla 40 e-posta (SMTP kotası emniyet supabı)

Reddedilen istek **sessizce düşürülmez**: ziyaretçi durumu ve bir referans kodu
görür, telefonla arama alternatifi sunulur. KVKK gereği loglara ham kişisel veri
yazılmaz; yalnızca maskeli özet (`S.E.A.`, `s***@example.com`, `***4567`) ve
referans kodu düşer (`lib/privacy.ts`).

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
