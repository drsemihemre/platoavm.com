import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "plato_session";
const ALG = "HS256";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(username: string) {
  const token = await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: String(payload.sub) };
  } catch {
    return null;
  }
}

/**
 * Sabit süreli karşılaştırma: `===` girilen şifrenin doğru şifreyle kaç
 * karakter örtüştüğünü zamanlama üzerinden sızdırabilir.
 */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    // Uzunluk farkında da sabit süre harca, sonra reddet.
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

/**
 * Yönetici kimlik doğrulaması.
 *
 * Tercih edilen: ADMIN_PASSWORD_HASH (bcrypt özeti) — ortam değişkenlerini
 * görebilen biri düz şifreyi okuyamaz. Tanımlı değilse ADMIN_PASSWORD (düz)
 * kullanılır; geriye dönük uyumluluk için korundu.
 *
 * Kullanıcı adı ve şifre kontrolü kısa devre yapmadan (ikisi de hesaplanarak)
 * birleştirilir; böylece "kullanıcı adı yanlış" ile "şifre yanlış" arasındaki
 * süre farkı ayırt edilemez.
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  const userOk = safeEqual(username, adminUser);

  if (hash) {
    const passOk = await bcrypt.compare(password, hash);
    return userOk && passOk;
  }
  if (!plain) return false;
  const passOk = safeEqual(password, plain);
  return userOk && passOk;
}
