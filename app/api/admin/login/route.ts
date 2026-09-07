import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Yönetim girişi. Panel üretimde salt-okunur olsa da giriş uç noktası
 * herkese açıktır; kaba kuvvet denemesini sınırlamak gerekir.
 */
const MAX_ATTEMPTS_PER_IP = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const attempts = rateLimit(`admin-login:${ip}`, MAX_ATTEMPTS_PER_IP, ATTEMPT_WINDOW_MS);
    if (!attempts.ok) {
      return NextResponse.json(
        { error: "Çok fazla başarısız deneme. Lütfen bir süre sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(attempts.retryAfter) } }
      );
    }

    const { username, password } = await req.json();
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }
    if (!(await verifyCredentials(username, password))) {
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
