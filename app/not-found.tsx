import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Sayfa Bulunamadı" };

const LINKS = [
  { href: "/magazalar", label: "Mağazalar" },
  { href: "/yemek", label: "Yemek" },
  { href: "/eglence", label: "Eğlence" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/iletisim", label: "İletişim" },
];

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Sayfa Bulunamadı"
        subtitle="Aradığınız sayfa taşınmış veya kaldırılmış olabilir."
        breadcrumb="404"
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-700">
            Aşağıdaki bölümlerden devam edebilir ya da ana sayfaya dönebilirsiniz.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-stone-100 hover:bg-orange-50 hover:text-orange-800 text-stone-800 font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
