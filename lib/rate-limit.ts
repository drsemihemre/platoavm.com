/**
 * Bellek-içi (örnek başına) kayan pencere hız sınırı.
 *
 * Vercel'de her serverless örneği kendi sayacını tuttuğu için bu koruma mutlak
 * değildir; amacı tek bir botun bir örneği saniyede yüzlerce kez dövmesini
 * ucuza engellemektir. Asıl bariyer honeypot + Turnstile (bkz. lib/spam.ts).
 *
 * Kalıcı/paylaşımlı sayaç gerekirse (Vercel KV, Upstash) bu modülün imzası
 * aynı kalacak şekilde değiştirilebilir.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
// Bellek tavanı: saldırgan IP çeşitlendirerek haritayı şişiremesin.
const MAX_KEYS = 5_000;

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) sweep(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { ok: true };
}

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Hepsi hâlâ geçerliyse en erken sona erecek yarıyı at: sayaç sıfırlanır,
  // yani en kötü ihtimalle saldırgan biraz daha hak kazanır — kabul edilebilir.
  if (buckets.size >= MAX_KEYS) {
    const byExpiry = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (let i = 0; i < Math.ceil(byExpiry.length / 2); i++) buckets.delete(byExpiry[i][0]);
  }
}

/**
 * İstemci IP'si. Cloudflare proxy KAPALI (gri bulut) olduğu için istekler
 * doğrudan Vercel'e geliyor; bu yüzden Vercel'in kendi yazdığı başlıklar
 * güvenilir, istemcinin gönderdiği ham x-forwarded-for son çare.
 */
export function clientIp(req: Request): string {
  const h = req.headers;
  const candidate =
    h.get("x-vercel-forwarded-for") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0];
  return candidate?.trim() || "unknown";
}
