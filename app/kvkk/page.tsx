import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel Verilerin Korunması Kanunu uyarınca aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <>
      <PageHero
        title="KVKK Aydınlatma Metni"
        breadcrumb="KVKK"
      />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-stone max-w-none">
          <h2>Kişisel Verilerin Korunması</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca, {site.name} olarak kişisel verilerinizi
            kanunda öngörülen şekilde işlemekte ve koruma altına almaktayız.
          </p>

          <h3>Veri Sorumlusu</h3>
          <p>
            Veri Sorumlusu sıfatıyla {site.name}, kişisel verilerinizi aşağıda açıklanan kapsamda işleyebilecektir.
            <br />
            <strong>Adres:</strong> {site.address}
            <br />
            <strong>E-posta:</strong> {site.email}
          </p>

          <h3>İşlenen Kişisel Veriler</h3>
          <ul>
            <li>Ad, soyad, e-posta, telefon numarası</li>
            <li>İletişim formu üzerinden iletilen mesaj içeriği</li>
            <li>Kiralama başvuru formu bilgileri</li>
            <li>IP adresi, tarayıcı ve cihaz bilgileri (analitik amaçlı)</li>
          </ul>

          <h3>İşleme Amaçları</h3>
          <ul>
            <li>İletişim taleplerinizin yanıtlanması</li>
            <li>Hizmet kalitesinin artırılması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>İstatistiksel analizler ve site iyileştirme</li>
          </ul>

          <h3>Haklarınız</h3>
          <p>KVKK&apos;nın 11. maddesi kapsamında veri sahibi olarak; verilerinize ilişkin bilgi alma, düzeltme, silme,
          işlemeye itiraz etme haklarına sahipsiniz. Taleplerinizi <a href={`mailto:${site.email}`}>{site.email}</a> adresine iletebilirsiniz.</p>
        </div>
      </section>
    </>
  );
}
