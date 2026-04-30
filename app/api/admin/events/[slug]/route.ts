import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEvents, saveEvents, isReadOnly } from "@/lib/storage";
import type { Event } from "@/lib/data";

async function guard() {
  if (!(await getSession())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (isReadOnly) return NextResponse.json({ error: "Salt okunur" }, { status: 403 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const blocked = await guard();
  if (blocked) return blocked;
  const { slug } = await params;
  const body: Event = await req.json();
  const events = await getEvents();
  const idx = events.findIndex((e) => e.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (body.slug !== slug && events.some((e) => e.slug === body.slug)) {
    return NextResponse.json({ error: "Yeni slug çakışıyor" }, { status: 409 });
  }
  events[idx] = body;
  await saveEvents(events);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const blocked = await guard();
  if (blocked) return blocked;
  const { slug } = await params;
  const events = await getEvents();
  const next = events.filter((e) => e.slug !== slug);
  if (next.length === events.length) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  await saveEvents(next);
  return NextResponse.json({ ok: true });
}
