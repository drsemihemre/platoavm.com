import { NextRequest, NextResponse } from "next/server";
import { sendFormMail } from "@/lib/mailer";

const PHONE = "0216 398 64 64";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

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
      // Sessizce kaybetme: ziyaretçiye durumu bildir, log'a tam kaydı yaz.
      console.error("[CONTACT] GONDERILEMEDI", result.error, JSON.stringify(submission));
      return NextResponse.json(
        { error: `Mesajınız iletilemedi. Lütfen bizi ${PHONE} numaradan arayın.`, detail: process.env.MAIL_DEBUG === "1" ? result.error : undefined },
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
