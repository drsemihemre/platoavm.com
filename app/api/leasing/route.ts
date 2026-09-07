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

const TAG = "leasing";
/** Formun sığmayacağı büyüklükteki gövde ayrıştırılmadan reddedilir. */
const MAX_BODY_BYTES = 32 * 1024;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);

    // Kiralama başvurusu iletişim formundan çok daha seyrek gelir;
    // bu yüzden IP başına limit daha dar tutuldu.
    const ipBlocked = guardIp(ip, { tag: TAG, perIpLimit: 4 });
    if (ipBlocked) {
      console.warn("[LEASING] engellendi", ipBlocked.reason, ipBlocked.ref);
      return ipBlocked.response;
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      const blocked = reject(413, "Gönderilen içerik çok büyük.", "body-too-large");
      console.warn("[LEASING] engellendi", blocked.reason, blocked.ref);
      return blocked.response;
    }

    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return reject(400, "Geçersiz istek.", "bad-json").response;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return reject(400, "Geçersiz istek.", "bad-shape").response;
    }
    const payload = data as Record<string, unknown>;

    const payloadBlocked = await guardPayload(payload, ip);
    if (payloadBlocked) {
      console.warn("[LEASING] engellendi", payloadBlocked.reason, payloadBlocked.ref);
      return payloadBlocked.response;
    }

    const { company, brand, contact, sector, area, phone, email, message } = payload;
    if (!company || !brand || !contact || !sector || !phone || !email) {
      return reject(400, "Zorunlu alanlar eksik.", "missing-fields").response;
    }

    const submission = {
      company: String(company).slice(0, 200),
      brand: String(brand).slice(0, 200),
      contact: String(contact).slice(0, 200),
      sector: String(sector).slice(0, 200),
      area: String(area || "").slice(0, 50),
      phone: String(phone).slice(0, 50),
      email: String(email).slice(0, 200),
      message: String(message || "").slice(0, 5000),
    };

    const quotaBlocked = checkMailQuota(TAG);
    if (quotaBlocked) {
      console.warn("[LEASING] engellendi", quotaBlocked.reason, quotaBlocked.ref);
      return quotaBlocked.response;
    }

    const result = await sendFormMail({
      subject: `KİRALAMA BAŞVURUSU — ${submission.brand} (${submission.company})`,
      heading: "Yeni Kiralama Başvurusu",
      replyTo: submission.email,
      fields: {
        "Firma Ünvanı": submission.company,
        "Marka Adı": submission.brand,
        "Yetkili": submission.contact,
        "Sektör": submission.sector,
        "Talep Edilen m²": submission.area,
        "Telefon": submission.phone,
        "E-posta": submission.email,
        "Mesaj": submission.message,
      },
    });

    if (!result.ok) {
      // KVKK: log'a maskeli özet + referans kodu; ham kişisel veri yazılmaz.
      const ref = referenceCode();
      console.error(
        "[LEASING] GONDERILEMEDI",
        JSON.stringify({
          ref,
          hata: result.error,
          firma: maskName(submission.company),
          marka: maskName(submission.brand),
          yetkili: maskName(submission.contact),
          telefon: maskPhone(submission.phone),
          eposta: maskEmail(submission.email),
          mesaj: maskText(submission.message),
        })
      );
      return NextResponse.json(
        {
          error: `Başvurunuz iletilemedi. Lütfen bizi ${PHONE} numaradan arayın (referans: ${ref}).`,
          ref,
        },
        { status: 502 }
      );
    }

    recordMailSent(TAG);
    console.log("[LEASING] gonderildi", result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leasing error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
