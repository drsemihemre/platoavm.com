import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveSiteData, isReadOnly } from "@/lib/storage";
import type { Site } from "@/lib/data";

export async function PUT(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (isReadOnly) return NextResponse.json({ error: "Salt okunur" }, { status: 403 });
  const body: Site = await req.json();
  if (!body.name || !body.email) return NextResponse.json({ error: "Zorunlu alanlar" }, { status: 400 });
  await saveSiteData(body);
  return NextResponse.json({ ok: true });
}
