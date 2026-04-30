import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Kurumsal",
  description: "Plato AVM hakkında, vizyonumuz ve misyonumuz.",
};

export default function KurumsalPage() {
  return (
    <>
      <PageHero
        title="Kurumsal"
        subtitle="Plato AVM hakkında bilmeniz gerekenler"
        breadcrumb="Kurumsal"
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/hero/plato-avm.jpg"
                alt="Plato AVM"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-stone-900">Hakkımızda</h2>
              <p className="mt-4 text-stone-700 leading-relaxed">
                {site.name}, Sultanbeyli&apos;ye uluslararası yaşam standartlarını getiren bölgenin
                ilk yaşam merkezi olarak hizmet vermektedir. Fatih Bulvarı&apos;nın merkezinde
                konumlanmış olup, ilçenin kültür ve yönetim merkezlerine yakındır.
              </p>
              <p className="mt-4 text-stone-700 leading-relaxed">
                Bir ailenin her bir bireyinin yemekten giyime, eğlenceden bakım hizmetlerine
                kadar tüm gündelik ihtiyaçlarını hızlı ve ekonomik şekilde karşılayabileceği bir alışveriş merkezidir.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
            <Card title="Misyonumuz" icon={<TargetIcon />}>
              Toplumun tüm bireylerinin huzur içinde ziyaret ettiği ve güven ortamında bir araya gelebildiği
              bir yaşam alanı oluşturmak. Sosyal sorumluluk projeleri aracılığıyla toplumsal bilince katkı
              sağlamak.
            </Card>
            <Card title="Vizyonumuz" icon={<EyeIcon />}>
              Bir ailenin her bir bireyinin yemekten giyime, eğlenceden bakım hizmetlerine kadar tüm
              gündelik ihtiyaçlarını hızlı ve ekonomik şekilde karşılayabileceği, uluslararası standartlarda
              bir alışveriş merkezi oluşturmak.
            </Card>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat number="46+" label="İşletme" />
            <Stat number="6" label="Kat" />
            <Stat number="500+" label="Otopark" />
            <Stat number="12+" label="Yıl" />
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
      <div className="w-14 h-14 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-stone-900">{title}</h3>
      <p className="mt-3 text-stone-700 leading-relaxed">{children}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-orange-600">{number}</div>
      <div className="text-sm font-medium text-stone-600 mt-1">{label}</div>
    </div>
  );
}

function TargetIcon() {
  return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
}
function EyeIcon() {
  return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
}
