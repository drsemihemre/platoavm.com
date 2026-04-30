import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const submission = {
      type: "contact",
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || "").slice(0, 50),
      message: String(message).slice(0, 5000),
      ip: req.headers.get("x-forwarded-for") || "",
      ua: req.headers.get("user-agent") || "",
      ts: new Date().toISOString(),
    };

    console.log("[CONTACT]", JSON.stringify(submission));

    const webhook = process.env.CONTACT_WEBHOOK_URL;
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
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
