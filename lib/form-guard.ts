import { NextResponse } from "next/server";
import { checkQuota, rateLimit, recordUse } from "@/lib/rate-limit";
import { checkLocalSignals, verifyTurnstile } from "@/lib/spam";
import { referenceCode } from "@/lib/privacy";

/**
 * Herkese açık form uç noktalarının ortak bekçisi.
 *
 * Sıra önemli ve bilinçli:
 *   1. guardIp()        — gövde AYRIŞTIRILMADAN önce; bozuk JSON gönderen bir
 *                         bot da hız sınırına takılsın diye.
 *   2. guardPayload()   — honeypot, doldurma süresi, Turnstile.
 *   3. (route) zorunlu alan doğrulaması
 *   4. checkMailQuota() — e-posta göndermeden HEMEN önce, sayaç ARTIRILMADAN
 *   5. recordMailSent() — yalnızca gönderim BAŞARILI olduğunda
 *
 * 4 ve 5'in ayrı olması kritik: aksi hâlde hiç e-posta üretmeyen istekler
 * (eksik alan, SMTP hatası) kotayı yer ve saldırgan tek bir mail bile
 * göndermeden formu herkese kapatabilirdi.
 *
 * İlke: SESSİZ DÜŞÜRME YOK. Reddedilen istek ziyaretçiye bildirilir ve
 * telefon alternatifi sunulur — yanlış pozitif bir başvuruyu asla
 * "gönderildi" yanılsamasıyla çöpe atmaz.
 */

const PHONE = "0216 398 64 64";

/**
 * Form başına saatlik gerçek e-posta tavanı (örnek başına). Google Workspace
 * günlük ~2.000 ileti kotasının son emniyet supabı. Formlar ayrı sayılır ki
 * iletişim trafiği kiralama başvurularını boğmasın.
 */
const HOURLY_MAIL_CAP = 30;
const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

export type GuardFailure = { response: NextResponse; reason: string; ref: string };

export function reject(
  status: number,
  message: string,
  reason: string,
  retryAfter?: number
): GuardFailure {
  const ref = referenceCode();
  const response = NextResponse.json(
    { error: message, ref },
    { status, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
  );
  return { response, reason, ref };
}

/** 1. adım: IP başına istek sınırı. Gövde okunmadan çağrılmalı. */
export function guardIp(
  ip: string,
  opts: { tag: string; perIpLimit: number; windowMs?: number }
): GuardFailure | null {
  const verdict = rateLimit(
    `${opts.tag}:${ip}`,
    opts.perIpLimit,
    opts.windowMs ?? DEFAULT_WINDOW_MS
  );
  if (verdict.ok) return null;
  return reject(
    429,
    `Kısa sürede çok fazla gönderim yapıldı. Lütfen biraz sonra tekrar deneyin veya bizi ${PHONE} numaradan arayın.`,
    "rate-limit-ip",
    verdict.retryAfter
  );
}

/** 2. adım: honeypot, doldurma süresi ve (yapılandırılmışsa) Turnstile. */
export async function guardPayload(
  data: Record<string, unknown>,
  ip: string
): Promise<GuardFailure | null> {
  const local = checkLocalSignals(data);
  if (!local.ok) {
    if (local.reason === "too-fast") {
      return reject(
        400,
        "Form beklenenden hızlı gönderildi. Lütfen bir kez daha 'Gönder'e basın.",
        local.reason
      );
    }
    return reject(
      400,
      `Gönderiminiz doğrulanamadı. Lütfen sayfayı yenileyip tekrar deneyin veya bizi ${PHONE} numaradan arayın.`,
      local.reason
    );
  }

  const turnstile = await verifyTurnstile(data, ip);
  if (!turnstile.ok) {
    return reject(
      400,
      "Güvenlik doğrulaması tamamlanamadı. Lütfen sayfayı yenileyip tekrar deneyin.",
      turnstile.reason
    );
  }

  return null;
}

/** 4. adım: e-posta göndermeden hemen önce — sayacı ARTIRMAZ. */
export function checkMailQuota(tag: string): GuardFailure | null {
  const verdict = checkQuota(`global:mail:${tag}`, HOURLY_MAIL_CAP);
  if (verdict.ok) return null;
  return reject(
    429,
    `Sistem şu anda yoğun. Lütfen kısa süre sonra tekrar deneyin veya bizi ${PHONE} numaradan arayın.`,
    "rate-limit-global",
    verdict.retryAfter
  );
}

/** 5. adım: yalnızca gönderim gerçekten başarılı olduğunda çağrılır. */
export function recordMailSent(tag: string): void {
  recordUse(`global:mail:${tag}`, HOUR_MS);
}

export { PHONE };
