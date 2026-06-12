// import type { Metadata } from "next";
import "./globals.css";
import ToasterProvider from "../website/components/common/ToasterProvider";

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ksonsgroup.com/#organization",
      name: "K.Sons Group",
      url: "https://ksonsgroup.com",
      logo: "https://ksonsgroup.com/images/header/ksons-logo.png",
      foundingDate: "1970",
      sameAs: [
        "https://www.facebook.com/thek.sonsgroup/",
        "https://x.com/theksonsgroup",
        "https://www.instagram.com/the_k.sonsgroup/",
        "https://www.youtube.com/@thek.sonsgroup",
        "https://www.linkedin.com/company/theksonsgroup/",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://ksonsgroup.com/#localbusiness",
      name: "K.Sons Group",
      url: "https://ksonsgroup.com",
      image: "https://ksonsgroup.com/images/header/ksons-logo.png",
      parentOrganization: {
        "@id": "https://ksonsgroup.com/#organization",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sunrakh Bangar",
        addressLocality: "Vrindavan",
        postalCode: "281121",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 27.5870796,
        longitude: 77.64788519999999,
      },
    },
  ],
};

// export const metadata: Metadata = {
//   metadataBase: new URL("https://ksonsgroup.com"),
//   title: {
//     default: "K.sons Group",
//     template: "%s | K.sons Group",
//   },
//   description: "K.sons Group",
//   keywords: "K.sons Group",
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema),
          }}
        />
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
