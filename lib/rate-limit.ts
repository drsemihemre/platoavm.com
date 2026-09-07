/**
 * Bellek-içi (örnek başına) sabit pencere sayacı.
 *
 * Vercel'de her serverless örneği kendi sayacını tuttuğu için bu koruma mutlak
 * değildir; amacı tek bir botun bir örneği saniyede yüzlerce kez dövmesini
 * ucuza engellemektir. Asıl bariyer honeypot + Turnstile (bkz. lib/spam.ts).
 *
 * İki ayrı kullanım var, bu yüzden kontrol ve artırma AYRILDI:
 *  - Deneme sayanlar (IP başına istek, hatalı giriş): rateLimit() = kontrol+artır
 *  - Kaynak sayanlar (fiilen gönderilen e-posta): checkQuota() sonra recordUse()
 *    Aksi hâlde e-posta ÜRETMEYEN bir istek kotayı yer ve saldırgan hiç mail
 *    göndermeden formu herkese kapatabilir.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
// Bellek tavanı: saldırgan IP çeşitlendirerek haritayı şişiremesin.
const MAX_KEYS = 5_000;
/**
 * Bu önekli anahtarlar tahliyeden MUAF. Sebep: emniyet supabı sayaçları
 * IP kovalarından daha uzun pencereli; tahliye sıralamasında öne düşüp
 * tam da saldırı anında sıfırlanırlardı.
 */
const EXEMPT_PREFIX = "global:";

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

function liveBucket(key: string, now: number): Bucket | null {
  const bucket = buckets.get(key);
  return bucket && bucket.resetAt > now ? bucket : null;
}

/** Sayacı ARTIRMADAN kontrol eder. */
export function checkQuota(
  key: string,
  limit: number,
  now: number = Date.now()
): RateLimitResult {
  const bucket = liveBucket(key, now);
  if (!bucket || bucket.count < limit) return { ok: true };
  return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
}

/** Sayacı bir artırır; pencere yoksa açar. */
export function recordUse(key: string, windowMs: number, now: number = Date.now()): void {
  const bucket = liveBucket(key, now);
  if (bucket) {
    bucket.count += 1;
    return;
  }
  if (buckets.size >= MAX_KEYS) sweep(now);
  buckets.set(key, { count: 1, resetAt: now + windowMs });
}

/** Kontrol + artır. Denemenin kendisini saymak istenen yerler için. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  const verdict = checkQuota(key, limit, now);
  if (!verdict.ok) return verdict;
  recordUse(key, windowMs, now);
  return { ok: true };
}

/** Örn. başarılı girişten sonra hatalı deneme sayacını temizlemek için. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now && !key.startsWith(EXEMPT_PREFIX)) buckets.delete(key);
  }
  // Hepsi hâlâ geçerliyse en erken sona erecek yarıyı at — muaf anahtarlara
  // dokunmadan. Sayaç sıfırlanır, yani saldırgan biraz daha hak kazanır;
  // emniyet supabı ise korunur.
  if (buckets.size >= MAX_KEYS) {
    const evictable = [...buckets.entries()]
      .filter(([key]) => !key.startsWith(EXEMPT_PREFIX))
      .sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (let i = 0; i < Math.ceil(evictable.length / 2); i++) buckets.delete(evictable[i][0]);
  }
}

/**
 * İstemci IP'si. Cloudflare proxy KAPALI (gri bulut) olduğu için istekler
 * doğrudan Vercel'e geliyor; bu yüzden Vercel'in kendi yazdığı başlıklar
 * güvenilir, istemcinin gönderebileceği ham x-forwarded-for son çare.
 */
export function clientIp(req: Request): string {
  const h = req.headers;
  const candidate =
    h.get("x-vercel-forwarded-for") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0];
  return candidate?.trim() || "unknown";
}
