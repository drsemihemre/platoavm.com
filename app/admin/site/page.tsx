import { getSiteData } from "@/lib/storage";
import { SiteEditor } from "@/components/admin/SiteEditor";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const site = await getSiteData();
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-6">Site Ayarları</h1>
      <SiteEditor site={site} />
    </div>
  );
}
