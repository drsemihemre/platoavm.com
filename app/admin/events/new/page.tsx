import Link from "next/link";
import { EventEditor } from "@/components/admin/EventEditor";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div>
      <Link href="/admin/events" className="text-sm text-stone-600 hover:text-orange-600">← Etkinlikler</Link>
      <h1 className="text-3xl font-extrabold text-stone-900 mt-2 mb-6">Yeni Etkinlik</h1>
      <EventEditor
        isNew
        event={{
          slug: "",
          title: "",
          image: "",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          description: "",
          active: true,
        }}
      />
    </div>
  );
}
