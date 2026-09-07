/**
 * Form korumasının alan adları — hem istemci bileşeni hem sunucu doğrulaması
 * buradan okur. Ayrı bir dosya olmasının sebebi: istemci paketine sunucu
 * tarafı kodu (lib/spam.ts) sızmasın.
 */

/** Botların doldurmaya en meyilli olduğu ad; ekranda görünmez. */
export const HONEYPOT_FIELD = "website";

/**
 * İstemcinin ölçtüğü doldurma süresi (ms). Zaman damgası DEĞİL: saati yanlış
 * kurulmuş cihazlarda yanlış pozitif üretmesin diye süre gönderilir.
 */
export const ELAPSED_FIELD = "_fill_ms";

/** Cloudflare Turnstile widget'ının ürettiği gizli input'un adı (sabit). */
export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Bir insanın formu doldurabileceği en kısa makul süre. */
export const MIN_FILL_MS = 3_000;
