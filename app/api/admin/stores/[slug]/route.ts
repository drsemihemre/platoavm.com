import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStores, saveStores, isReadOnly } from "@/lib/storage";
import type { Store } from "@/lib/data";

async function guard() {
  if (!(await getSession())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (isReadOnly) return NextResponse.json({ error: "Üretim ortamı salt okunurdur" }, { status: 403 });
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const blocked = await guard();
  if (blocked) return blocked;

  const { slug } = await params;
  const body: Store = await req.json();
  const stores = await getStores();
  const idx = stores.findIndex((s) => s.slug === slug);
  if (idx === -1) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  if (body.slug !== slug && stores.some((s) => s.slug === body.slug)) {
    return NextResponse.json({ error: "Yeni slug zaten kullanımda" }, { status: 409 });
  }
  stores[idx] = body;
  await saveStores(stores);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const blocked = await guard();
  if (blocked) return blocked;

  const { slug } = await params;
  const stores = await getStores();
  const next = stores.filter((s) => s.slug !== slug);
  if (next.length === stores.length) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  await saveStores(next);
  return NextResponse.json({ ok: true });
}
