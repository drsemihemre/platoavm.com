import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { company, brand, contact, sector, area, phone, email, message } = data;

    if (!company || !brand || !contact || !sector || !phone || !email) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const submission = {
      type: "leasing",
      company: String(company).slice(0, 200),
      brand: String(brand).slice(0, 200),
      contact: String(contact).slice(0, 200),
      sector: String(sector).slice(0, 200),
      area: String(area || "").slice(0, 50),
      phone: String(phone).slice(0, 50),
      email: String(email).slice(0, 200),
      message: String(message || "").slice(0, 5000),
      ip: req.headers.get("x-forwarded-for") || "",
      ts: new Date().toISOString(),
    };

    console.log("[LEASING]", JSON.stringify(submission));

    const webhook = process.env.LEASING_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
      } catch (err) {
        console.error("Webhook failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leasing error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
