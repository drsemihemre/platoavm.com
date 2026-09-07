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

    // Spam/kötüye kullanım bekçisi: honeypot, zamanlama, Turnstile, hız sınırı.
    const blocked = await guardFormRequest(req, data as Record<string, unknown>, {
      tag: "contact",
      perIpLimit: 6,
    });
    if (blocked) {
      console.warn("[CONTACT] engellendi", blocked.reason, blocked.ref);
      return blocked.response;
    }

    const { name, email, phone, message } = data as Record<string, unknown>;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const submission = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || "").slice(0, 50),
      message: String(message).slice(0, 5000),
    };

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

    console.log("[CONTACT] gonderildi", result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
