import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }
    if (!verifyCredentials(username, password)) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Hatalı kullanıcı adı veya şifre" }, { status: 401 });
    }
    await createSession(username);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
