import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvents } from "@/lib/storage";
import { EventEditor } from "@/components/admin/EventEditor";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();
  return (
    <div>
      <Link href="/admin/events" className="text-sm text-stone-600 hover:text-orange-600">← Etkinlikler</Link>
      <h1 className="text-3xl font-extrabold text-stone-900 mt-2 mb-6">{event.title}</h1>
      <EventEditor event={event} />
    </div>
  );
}
