import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEvents, saveEvents, isReadOnly } from "@/lib/storage";
import type { Event } from "@/lib/data";

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (isReadOnly) return NextResponse.json({ error: "Salt okunur" }, { status: 403 });
  const body: Event = await req.json();
  if (!body.slug || !body.title) return NextResponse.json({ error: "Zorunlu alanlar" }, { status: 400 });
  const events = await getEvents();
  if (events.some((e) => e.slug === body.slug)) return NextResponse.json({ error: "Slug çakışması" }, { status: 409 });
  events.push(body);
  await saveEvents(events);
  return NextResponse.json({ ok: true });
}
