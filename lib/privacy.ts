/**
 * KVKK / veri minimizasyonu yardımcıları.
 *
 * Gönderim başarısız olduğunda başvurunun sessizce kaybolmaması gerekiyor,
 * ama Vercel çalışma zamanı loglarına ziyaretçinin adı-telefonu-mesajı ham
 * hâlde yazılmamalı: o loglara ekipteki herkes ve olası bir log-drain erişir.
 *
 * Çözüm: loga yalnızca "bir gönderim vardı, şu biçimdeydi" bilgisi ve kısa bir
 * referans kodu yazılır. Kod ziyaretçiye de gösterildiği için, arayan kişiyle
 * log satırı eşleştirilebilir; içerik ise ziyaretçinin kendisinden alınır.
 */

/** "Semih Emre Ayyıldız" -> "S.E.A." */
export function maskName(value: string): string {
  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => [...part][0]?.toLocaleUpperCase("tr-TR") ?? "")
    .filter(Boolean);
  return initials.length ? `${initials.join(".")}.` : "-";
}

/** "semih@example.com" -> "s***@example.com" */
export function maskEmail(value: string): string {
  const at = value.lastIndexOf("@");
  if (at <= 0) return value.trim() ? "***" : "-";
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  return `${[...local][0] ?? ""}***@${domain}`;
}

/** "0532 123 45 67" -> "***4567" (son 4 hane) */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "-";
  return `***${digits.slice(-4)}`;
}

/** Serbest metin: yalnızca uzunluk. */
export function maskText(value: string): string {
  const len = value.trim().length;
  return len ? `${len} karakter` : "-";
}

/**
 * Ziyaretçiye gösterilen ve loga yazılan kısa referans kodu.
 * Karışması kolay karakterler (0/O, 1/I) çıkarıldı: telefonda okunacak.
 */
export function referenceCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
