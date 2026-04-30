import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStores, saveStores, isReadOnly } from "@/lib/storage";
import type { Store } from "@/lib/data";

async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  if (isReadOnly) {
    return NextResponse.json({ error: "Üretim ortamı salt okunurdur" }, { status: 403 });
  }
  const body: Store = await req.json();
  if (!body.slug || !body.name) {
    return NextResponse.json({ error: "Slug ve ad zorunlu" }, { status: 400 });
  }
  const stores = await getStores();
  if (stores.some((s) => s.slug === body.slug)) {
    return NextResponse.json({ error: "Bu slug zaten var" }, { status: 409 });
  }
  stores.push(body);
  await saveStores(stores);
  return NextResponse.json({ ok: true });
}
