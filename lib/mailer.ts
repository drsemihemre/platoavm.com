import { Resend } from "resend";

/**
 * Form bildirimlerini e-posta ile iletir.
 *
 * Tasarım notu: Eski WordPress sitesinde formlar `admin@plato.zikrifikir.com`
 * adresine gönderiliyordu; o alan adı DNS'te bulunmadığı için (NXDOMAIN)
 * başvurular sessizce kayboluyordu. Bu yüzden burada SESSIZ BASARISIZLIK YOK:
 * gönderim başarısız olursa çağıran tarafa hata döner ve ziyaretçiye
 * telefonla arama alternatifi gösterilir.
 */

const TO = process.env.FORM_TO_EMAIL || "yonetim@platoavm.com";
// Resend'de platoavm.com doğrulanana kadar onboarding@resend.dev kullanılabilir.
const FROM = process.env.FORM_FROM_EMAIL || "Plato AVM <onboarding@resend.dev>";

export type MailResult = { ok: true; id?: string } | { ok: false; error: string };

function esc(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

export function renderRows(fields: Record<string, string>) {
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY tanımlı değil" };
  }

  const text = Object.entries(opts.fields)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#fafaf9;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1917">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden">
    <div style="background:#ea580c;color:#fff;padding:16px 20px;font-size:18px;font-weight:700">${esc(opts.heading)}</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${renderRows(opts.fields)}</table>
    <div style="padding:12px 20px;background:#fafaf9;border-top:1px solid #e7e5e4;font-size:12px;color:#78716c">
      platoavm.com üzerinden gönderildi · ${esc(new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }))}
    </div>
  </div></body></html>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: opts.subject,
      html,
      text,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    if (error) return { ok: false, error: error.message || String(error) };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
