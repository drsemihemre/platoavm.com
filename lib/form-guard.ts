import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { checkLocalSignals, verifyTurnstile } from "@/lib/spam";
import { referenceCode } from "@/lib/privacy";

/**
 * Herkese açık form uç noktalarının ortak bekçisi.
 *
 * İki route da (iletişim, kiralama) aynı sırayı uygular; kural değişikliği
 * tek yerden yapılsın diye burada toplandı.
 *
 * İlke: SESSİZ DÜŞÜRME YOK. Bir istek reddedilirse ziyaretçi bunu görür ve
 * telefonla arama alternatifi sunulur — yanlış pozitif bir başvuruyu asla
 * "gönderildi" yanılsamasıyla çöpe atmaz. (Botun bundan öğreneceği bir şey
 * yok; küçük bir kurumsal sitede saldırgan geri bildirimi zaten uyarlamıyor.)
 */

const PHONE = "0216 398 64 64";

/**
 * Örnek başına saatlik toplam e-posta tavanı. IP değiştirerek per-IP limitini
 * aşan dağıtık bir bot bile Google Workspace günlük kotasını (~2.000 ileti)
 * tüketemesin diye son emniyet supabı.
 */
const GLOBAL_HOURLY_MAIL_CAP = 40;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

export type GuardFailure = { response: NextResponse; reason: string; ref: string };

function reject(status: number, message: string, reason: string, retryAfter?: number): GuardFailure {
  const ref = referenceCode();
  const response = NextResponse.json(
    { error: message, ref },
    {
      status,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    }
  );
  return { response, reason, ref };
}

export async function guardFormRequest(
  req: Request,
  data: Record<string, unknown>,
  opts: { tag: string; perIpLimit: number; windowMs?: number }
): Promise<GuardFailure | null> {
  const ip = clientIp(req);
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;

  const perIp = rateLimit(`${opts.tag}:${ip}`, opts.perIpLimit, windowMs);
  if (!perIp.ok) {
    return reject(
      429,
      `Kısa sürede çok fazla gönderim yapıldı. Lütfen biraz sonra tekrar deneyin veya bizi ${PHONE} numaradan arayın.`,
      "rate-limit-ip",
      perIp.retryAfter
    );
  }

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

  const globalCap = rateLimit("global:mail", GLOBAL_HOURLY_MAIL_CAP, 60 * 60 * 1000);
  if (!globalCap.ok) {
    return reject(
      429,
      `Sistem şu anda yoğun. Lütfen kısa süre sonra tekrar deneyin veya bizi ${PHONE} numaradan arayın.`,
      "rate-limit-global",
      globalCap.retryAfter
    );
  }

  return null;
}

export { PHONE };
