import { NextRequest, NextResponse } from "next/server";
import { sendFormMail } from "@/lib/mailer";

const PHONE = "0216 398 64 64";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { company, brand, contact, sector, area, phone, email, message } = data;

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
      console.error("[LEASING] GONDERILEMEDI", result.error, JSON.stringify(submission));
      return NextResponse.json(
        { error: `Başvurunuz iletilemedi. Lütfen bizi ${PHONE} numaradan arayın.`, detail: process.env.MAIL_DEBUG?.trim() === "1" ? result.error : undefined },
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
