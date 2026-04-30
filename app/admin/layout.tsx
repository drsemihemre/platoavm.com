import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { isReadOnly } from "@/lib/storage";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-[calc(100vh-200px)] bg-stone-50">
      {session && (
        <>
          <nav className="bg-white border-b border-stone-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
              <div className="flex items-center gap-1">
                <NavLink href="/admin">Özet</NavLink>
                <NavLink href="/admin/stores">Mağazalar</NavLink>
                <NavLink href="/admin/services">Hizmetler</NavLink>
                <NavLink href="/admin/events">Etkinlikler</NavLink>
                <NavLink href="/admin/site">Site Ayarları</NavLink>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600">👤 {session.username}</span>
                <LogoutButton />
              </div>
            </div>
          </nav>
          {isReadOnly && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm px-4 py-2 text-center">
              ⚠️ Üretim ortamında veriler salt okunurdur. Değişiklikler için repo&apos;yu güncelleyin veya <code>PLATO_DATA_DIR</code> ayarını yapın.
            </div>
          )}
        </>
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}
