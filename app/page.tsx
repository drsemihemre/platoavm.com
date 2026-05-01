import Image from "next/image";
import Link from "next/link";
import { stores, services, events, site, getRetail } from "@/lib/data";
import { StoreCard } from "@/components/StoreCard";

export default function Home() {
  const featuredStores = getRetail().slice(0, 8);
  const upcomingEvents = events.filter((e) => new Date(e.end) > new Date());
  const featuredEvents = upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, 3);

  const categories = [
    { href: "/magazalar", label: "Mağazalar", img: "/images/categories/icon-oto-yikama.jpg", count: stores.filter(s => !["Yeme & İçme", "Eğlence", "Hizmet"].includes(s.category)).length },
    { href: "/yemek", label: "Yemek", img: "/images/stores/coffee-factory.jpg", count: stores.filter(s => s.category === "Yeme & İçme").length },
    { href: "/eglence", label: "Eğlence", img: "/images/stores/cinegreen.jpg", count: stores.filter(s => s.category === "Eğlence").length },
    { href: "/hizmetler", label: "Hizmetler", img: "/images/categories/icon-elektrikli-sarj.jpg", count: services.length },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-stone-900 to-stone-700 text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster="/images/hero/plato-avm.jpg"
        >
          <source src="/images/hero/Plato-AVM-Tanitim-Filmi.mp4" type="video/mp4" />
        </video>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Sultanbeyli&apos;nin Yaşam Merkezi
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {site.name}&apos;ye <br />Hoş Geldiniz
            </h1>
            <p className="mt-6 text-lg text-stone-200 leading-relaxed">
              {site.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/magazalar" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                Mağazaları Keşfet
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/iletisim" className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full font-semibold transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <section className="bg-orange-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ClockIcon />
              <div>
                <div className="text-xs uppercase tracking-wide opacity-80">Açılış</div>
                <div className="font-bold">{site.hours}</div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <PinIcon />
              <div>
                <div className="text-xs uppercase tracking-wide opacity-80">Konum</div>
                <div className="font-bold">{site.address.split(",")[0]}</div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <PhoneIcon />
              <div>
                <div className="text-xs uppercase tracking-wide opacity-80">İletişim</div>
                <a href={`tel:${site.phone_raw}`} className="font-bold hover:underline">{site.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Plato'da Neler Var?" subtitle="Hayatın tüm renkleri tek bir yerde" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold">{cat.label}</h3>
                  <p className="text-sm opacity-90">{cat.count} işletme</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED STORES */}
      <section className="py-16 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader title="Mağazalar" subtitle="Plato AVM'de yer alan markalar" align="left" />
            <Link href="/magazalar" className="text-orange-600 hover:text-orange-700 font-semibold text-sm inline-flex items-center gap-2">
              Tümünü Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {featuredStores.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Etkinlikler" subtitle="Plato'da yaşanan keyifli anlar" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {featuredEvents.map((event) => (
              <article key={event.slug} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <time className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                    {new Date(event.start).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  <h3 className="mt-2 text-lg font-bold text-stone-900 leading-tight">{event.title}</h3>
                  <p className="mt-2 text-sm text-stone-600 line-clamp-2">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Hizmetler" subtitle="Konforunuz için sunduğumuz olanaklar" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {services.slice(0, 8).map((s) => (
              <div key={s.slug} className="bg-white border border-stone-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3">
                  <Image src={s.icon} alt={s.title} width={32} height={32} className="object-contain" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">{s.title}</h3>
                <p className="text-xs text-stone-500 mt-1">{s.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, subtitle, align = "center" }: { title: string; subtitle?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">{title}</h2>
      {subtitle && <p className="mt-3 text-stone-600">{subtitle}</p>}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
}
function PinIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.7.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg>
  );
}
