import { getServices } from "@/lib/storage";
import { ServicesEditor } from "@/components/admin/ServicesEditor";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Hizmetler</h1>
      <p className="text-stone-600 mb-6">{services.length} hizmet kayıtlı</p>
      <ServicesEditor services={services} />
    </div>
  );
}
