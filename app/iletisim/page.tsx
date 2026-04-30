import type { Metadata } from "next";
import { site } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Plato AVM iletişim bilgileri ve mesaj formu.",
};

export default function IletisimPage() {
  return (
    <>
      <PageHero
        title="İletişim"
        subtitle="Bize ulaşmanın en hızlı yolları"
        breadcrumb="İletişim"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <ContactCard icon={<PinIcon />} title="Adres">
                {site.address}
              </ContactCard>
              <ContactCard icon={<PhoneIcon />} title="Telefon">
                <a href={`tel:${site.phone_raw}`} className="hover:text-orange-600">{site.phone}</a>
                <br />
                <span className="text-sm text-stone-500">Faks: {site.fax}</span>
              </ContactCard>
              <ContactCard icon={<MailIcon />} title="E-posta">
                <a href={`mailto:${site.email}`} className="hover:text-orange-600">{site.email}</a>
              </ContactCard>
              <ContactCard icon={<ClockIcon />} title="Çalışma Saatleri">
                Hergün {site.hours}
              </ContactCard>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-stone-900 mb-4">Bize Yazın</h2>
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl overflow-hidden border border-stone-200 aspect-[16/7]">
            <iframe
              title="Plato AVM Konum"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.9!2d29.27!3d40.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPlato%20AVM!5e0!3m2!1str!2str!4v1700000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-4">
      <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-stone-900">{title}</h3>
        <div className="text-sm text-stone-600 mt-1">{children}</div>
      </div>
    </div>
  );
}

function PinIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function PhoneIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.7.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg>; }
function MailIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 0v10a2 2 0 002 2h14a2 2 0 002-2V8m-18 0a2 2 0 012-2h14a2 2 0 012 2" /></svg>; }
function ClockIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
