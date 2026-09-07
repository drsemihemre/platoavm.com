import { NextRequest, NextResponse } from "next/server";
import { sendFormMail } from "@/lib/mailer";
import {
  checkMailQuota,
  guardIp,
  guardPayload,
  recordMailSent,
  reject,
  PHONE,
} from "@/lib/form-guard";
import { clientIp } from "@/lib/rate-limit";
import { maskEmail, maskName, maskPhone, maskText, referenceCode } from "@/lib/privacy";

const TAG = "contact";
/** Formun sığmayacağı büyüklükteki gövde ayrıştırılmadan reddedilir. */
const MAX_BODY_BYTES = 32 * 1024;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);

    // 1) Hız sınırı gövdeden ÖNCE: bozuk JSON gönderen bot da sayaca takılsın.
    const ipBlocked = guardIp(ip, { tag: TAG, perIpLimit: 6 });
    if (ipBlocked) {
      console.warn("[CONTACT] engellendi", ipBlocked.reason, ipBlocked.ref);
      return ipBlocked.response;
    }

    // 2) Gövdeyi ölçerek oku: content-length başlığına güvenmek yetmez
    //    (chunked istekte hiç gelmez, uydurulmuş değer NaN olur).
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      const blocked = reject(413, "Gönderilen içerik çok büyük.", "body-too-large");
      console.warn("[CONTACT] engellendi", blocked.reason, blocked.ref);
      return blocked.response;
    }

    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      // Ayrıştırma hatası sunucu hatası değildir; 500 gürültüsü üretmesin.
      return reject(400, "Geçersiz istek.", "bad-json").response;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return reject(400, "Geçersiz istek.", "bad-shape").response;
    }
    const payload = data as Record<string, unknown>;

    // 3) Spam katmanları: honeypot, doldurma süresi, Turnstile.
    const payloadBlocked = await guardPayload(payload, ip);
    if (payloadBlocked) {
      console.warn("[CONTACT] engellendi", payloadBlocked.reason, payloadBlocked.ref);
      return payloadBlocked.response;
    }

    const { name, email, phone, message } = payload;
    if (!name || !email || !message) {
      return reject(400, "Zorunlu alanlar eksik.", "missing-fields").response;
    }

    const submission = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || "").slice(0, 50),
      message: String(message).slice(0, 5000),
    };

    // 4) Kota kontrolü — sayaç burada ARTMAZ.
    const quotaBlocked = checkMailQuota(TAG);
    if (quotaBlocked) {
      console.warn("[CONTACT] engellendi", quotaBlocked.reason, quotaBlocked.ref);
      return quotaBlocked.response;
    }

    const result = await sendFormMail({
      subject: `Yeni iletişim mesajı — ${submission.name}`,
      heading: "Yeni İletişim Mesajı",
      replyTo: submission.email,
      fields: {
        "Ad / Soyad": submission.name,
        "E-posta": submission.email,
        "Telefon": submission.phone,
        "Mesaj": submission.message,
      },
    });

    if (!result.ok) {
      // Sessizce kaybetme: ziyaretçiye durumu ve bir referans kodu bildir.
      // Log'a KVKK gereği yalnızca maskeli özet yazılır; arayan ziyaretçi
      // kodu söylediğinde bu satır bulunur, içerik kendisinden alınır.
      const ref = referenceCode();
      console.error(
        "[CONTACT] GONDERILEMEDI",
        JSON.stringify({
          ref,
          hata: result.error,
          ad: maskName(submission.name),
          eposta: maskEmail(submission.email),
          telefon: maskPhone(submission.phone),
          mesaj: maskText(submission.message),
        })
      );
      return NextResponse.json(
        {
          error: `Mesajınız iletilemedi. Lütfen bizi ${PHONE} numaradan arayın (referans: ${ref}).`,
          ref,
        },
        { status: 502 }
      );
    }

    // 5) Kota yalnızca gerçekten gönderilen e-posta için tüketilir.
    recordMailSent(TAG);
    console.log("[CONTACT] gonderildi", result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
