import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveServices, isReadOnly } from "@/lib/storage";
import type { Service } from "@/lib/data";

export async function PUT(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (isReadOnly) return NextResponse.json({ error: "Salt okunur" }, { status: 403 });
  const body: Service[] = await req.json();
  if (!Array.isArray(body)) return NextResponse.json({ error: "Liste bekleniyor" }, { status: 400 });
  await saveServices(body);
  return NextResponse.json({ ok: true });
}
