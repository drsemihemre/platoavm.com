import { NextRequest, NextResponse } from "next/server";
import { sendFormMail } from "@/lib/mailer";
import { guardFormRequest, PHONE } from "@/lib/form-guard";
import { maskEmail, maskName, maskPhone, maskText, referenceCode } from "@/lib/privacy";

/** Formun sığmayacağı büyüklükteki gövdeyi ayrıştırmadan reddet. */
const MAX_BODY_BYTES = 32 * 1024;

export async function POST(req: NextRequest) {
  try {
    const declaredSize = Number(req.headers.get("content-length") ?? 0);
    if (declaredSize > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Gönderilen içerik çok büyük" }, { status: 413 });
    }

    const data = await req.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // Kiralama başvurusu iletişim formundan çok daha seyrek gelir;
    // bu yüzden IP başına limit daha dar tutuldu.
    const blocked = await guardFormRequest(req, data as Record<string, unknown>, {
      tag: "leasing",
      perIpLimit: 4,
    });
    if (blocked) {
      console.warn("[LEASING] engellendi", blocked.reason, blocked.ref);
      return blocked.response;
    }

    const { company, brand, contact, sector, area, phone, email, message } =
      data as Record<string, unknown>;
    if (!company || !brand || !contact || !sector || !phone || !email) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
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

    console.log("[LEASING] gonderildi", result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leasing error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
