import { site } from "@/lib/data";

/**
 * ShoppingCenter yapısal verisi (schema.org).
 * Google'ın yerel aramada AVM'yi doğru tanıması ve bilgi kartı üretebilmesi için.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ShoppingCenter",
    name: site.name,
    description: site.description,
    url: "https://www.platoavm.com",
    logo: "https://www.platoavm.com/images/logo.png",
    image: "https://www.platoavm.com/images/hero/plato-avm.jpg",
    telephone: site.phone_raw,
    faxNumber: site.fax,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fatih Bulvarı No:97",
      addressLocality: "Sultanbeyli",
      addressRegion: "İstanbul",
      postalCode: "34920",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.lat,
      longitude: site.coordinates.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "10:00",
      closes: "22:00",
    },
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.twitter,
      site.social.linkedin,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
