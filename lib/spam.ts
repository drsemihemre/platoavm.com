/**
 * Form kötüye kullanım savunmaları.
 *
 * Her gönderim gerçek bir e-posta üretir ve Google Workspace SMTP kotası
 * günlük ~2.000 iletidir; korumasız bir uç nokta bu kotayı saatler içinde
 * tüketip yonetim@ kutusunu çöpe boğabilir. Bu yüzden birbirinden bağımsız
 * dört katman var:
 *
 *   1. Honeypot   – gerçek kullanıcının göremediği, botun doldurduğu alan
 *   2. Zamanlama  – formu 3 sn'den kısa sürede dolduran bot sayılır
 *   3. Turnstile  – Cloudflare'ın görünmez insan doğrulaması (anahtar varsa)
 *   4. Hız sınırı – lib/rate-limit.ts
 *
 * Tasarım kararı: Turnstile anahtarları TANIMLI DEĞİLSE bu katman sessizce
 * atlanır. Böylece anahtar eklemek/çıkarmak tek başına formu kırmaz; site
 * her durumda çalışır, koruma yalnızca zayıflar.
 */

import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  TURNSTILE_FIELD,
} from "@/lib/form-fields";

export type SpamVerdict = { ok: true } | { ok: false; reason: string };

type Payload = Record<string, unknown>;

export function checkHoneypot(data: Payload): SpamVerdict {
  const value = data[HONEYPOT_FIELD];
  if (typeof value === "string" && value.trim() !== "") {
    return { ok: false, reason: "honeypot" };
  }
  return { ok: true };
}

export function checkTiming(data: Payload): SpamVerdict {
  const elapsed = Number(data[ELAPSED_FIELD]);
  // Alan yoksa/okunamıyorsa engelleme: JS'siz veya eski önbellekten gelen
  // gerçek ziyaretçiyi cezalandırmak, bir botu kaçırmaktan daha kötü.
  if (!Number.isFinite(elapsed)) return { ok: true };
  if (elapsed < MIN_FILL_MS) return { ok: false, reason: "too-fast" };
  return { ok: true };
}

export async function verifyTurnstile(data: Payload, ip: string): Promise<SpamVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true }; // katman yapılandırılmamış

  const token = data[TURNSTILE_FIELD];
  if (typeof token !== "string" || token === "") {
    return { ok: false, reason: "turnstile-missing" };
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        ...(ip !== "unknown" ? { remoteip: ip } : {}),
      }),
      signal: AbortSignal.timeout(8_000),
    });
    const body = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (body?.success) return { ok: true };
    return { ok: false, reason: `turnstile:${(body?.["error-codes"] ?? []).join(",") || "failed"}` };
  } catch {
    // Cloudflare'a ulaşılamıyorsa ziyaretçiyi cezalandırma (fail-open):
    // AVM sitesinde erişilebilirlik, kusursuz spam engellemeden önce gelir.
    // Honeypot, zamanlama ve hız sınırı yine devrede.
    return { ok: true };
  }
}

/**
 * Tüm ucuz (ağ gerektirmeyen) kontroller. Turnstile ayrı çağrılır ki
 * gereksiz yere dış istek atılmasın.
 */
export function checkLocalSignals(data: Payload): SpamVerdict {
  const honeypot = checkHoneypot(data);
  if (!honeypot.ok) return honeypot;
  return checkTiming(data);
}
