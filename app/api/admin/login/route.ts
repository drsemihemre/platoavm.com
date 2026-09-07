import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";
import { checkQuota, clientIp, recordUse, resetRateLimit } from "@/lib/rate-limit";

/**
 * Yönetim girişi. Panel üretimde salt-okunur ve Vercel güvenlik duvarı
 * /admin yollarını script erişimine kapatıyor olsa da, giriş uç noktası
 * herkese açıktır; kaba kuvvet denemesi sınırlanmalı.
 *
 * Sayaç YALNIZCA başarısız denemelerde artar ve başarılı girişte sıfırlanır:
 * aksi hâlde gün içinde birkaç kez giriş yapan yöneticinin kendisi (veya aynı
 * NAT arkasındaki bir başkası) hiç hata yapmadan kilitlenirdi.
 */
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const key = `admin-login:${ip}`;

    const quota = checkQuota(key, MAX_FAILED_ATTEMPTS);
    if (!quota.ok) {
      return NextResponse.json(
        { error: "Çok fazla başarısız deneme. Lütfen bir süre sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(quota.retryAfter) } }
      );
    }

    const { username, password } = await req.json();
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    if (!(await verifyCredentials(username, password))) {
      recordUse(key, ATTEMPT_WINDOW_MS);
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Hatalı kullanıcı adı veya şifre" }, { status: 401 });
    }

    resetRateLimit(key);
    await createSession(username);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
