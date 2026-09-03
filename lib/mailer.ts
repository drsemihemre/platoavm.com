import nodemailer from "nodemailer";

/**
 * Form bildirimlerini Google Workspace (Gmail SMTP) üzerinden iletir.
 *
 * Tasarım notu: Eski WordPress sitesinde formlar `admin@plato.zikrifikir.com`
 * adresine gönderiliyordu; o alan adı DNS'te bulunmuyor (NXDOMAIN), yani
 * başvurular sessizce kayboluyordu. Bu yüzden burada SESSİZ BAŞARISIZLIK YOK:
 * gönderim başarısız olursa çağıran tarafa hata döner ve ziyaretçiye
 * telefonla arama alternatifi gösterilir.
 *
 * Gerekli ortam değişkenleri (Vercel):
 *   SMTP_USER  – gönderici Google Workspace hesabı (örn. semihemre@platoavm.com)
 *   SMTP_PASS  – o hesap için üretilmiş Uygulama Şifresi (16 karakter)
 *   FORM_TO_EMAIL (opsiyonel, varsayılan yonetim@platoavm.com)
 */

const TO = process.env.FORM_TO_EMAIL || "yonetim@platoavm.com";
const FROM_NAME = process.env.FORM_FROM_NAME || "Plato AVM Web Sitesi";

export type MailResult = { ok: true; id?: string } | { ok: false; error: string };

function esc(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function rows(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#f5f5f4;font-weight:600;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:8px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`
    )
    .join("");
}

export async function sendFormMail(opts: {
  subject: string;
  heading: string;
  fields: Record<string, string>;
  replyTo?: string;
}): Promise<MailResult> {
  const user = process.env.SMTP_USER?.trim().replace(/^["\u201C\u201D]+|["\u201C\u201D]+$/g, "");
  // Google uygulama şifresi TAM 16 küçük harftir (boşluk/rakam/sembol içermez).
  // Panele yapıştırırken araya boşluk, tırnak, parantez vb. karışması çok yaygın;
  // harf olmayan her karakteri temizleyerek bu hataları tolere ediyoruz.
  const pass = process.env.SMTP_PASS?.replace(/[^A-Za-z]/g, "");
  // Boş değer, tanımsız değer kadar sık görülen bir hata: ikisini ayırt et.
  if (!user && !pass) {
    return { ok: false, error: "SMTP_USER ve SMTP_PASS boş veya tanımsız" };
  }
  if (!user) return { ok: false, error: "SMTP_USER boş" };
  if (!pass) return { ok: false, error: "SMTP_PASS boş" };
  if (pass.length !== 16) {
    // Değeri ASLA sızdırma; yalnızca biçim ipucu ver.
    const sekil = [
      /[0-9]/.test(pass) ? "rakam" : null,
      /[A-Z]/.test(pass) ? "buyuk-harf" : null,
      /[^A-Za-z0-9]/.test(pass) ? "sembol" : null,
    ].filter(Boolean).join("+") || "sadece-kucuk-harf";
    return {
      ok: false,
      error:
        `SMTP_PASS uzunluğu ${pass.length}, beklenen 16. İçerik biçimi: ${sekil}. ` +
        `Google uygulama şifresi tam 16 küçük harftir (rakam/sembol içermez).`,
    };
  }

  const text = Object.entries(opts.fields)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#fafaf9;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1917">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden">
    <div style="background:#ea580c;color:#fff;padding:16px 20px;font-size:18px;font-weight:700">${esc(opts.heading)}</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows(opts.fields)}</table>
    <div style="padding:12px 20px;background:#fafaf9;border-top:1px solid #e7e5e4;font-size:12px;color:#78716c">
      platoavm.com üzerinden gönderildi · ${esc(new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }))}
    </div>
  </div></body></html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      // Serverless ortamda takılı kalmasın:
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    const info = await transporter.sendMail({
      // Gmail, From adresinin kimliği doğrulanmış hesap (veya alias) olmasını şart koşar.
      from: `"${FROM_NAME}" <${user}>`,
      to: TO,
      subject: opts.subject,
      text,
      html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });

    return { ok: true, id: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
