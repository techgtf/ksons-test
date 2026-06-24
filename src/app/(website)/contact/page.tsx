import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import ContactContainer from "@/src/website/components/contact/ContactContainer";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Contact K.Sons Group – Vrindavan & Mathura Real Estate",
//   keywords:
//     "K.Sons Group contact, real estate queries Vrindavan, Mathura real estate support, residential and commercial projects contact",
//   description:
//     "Get in touch with K.Sons Group for queries, sales, or support regarding residential and commercial projects in Vrindavan & Mathura.",
//   alternates: {
//     canonical: "https://ksonsgroup.com/contact",
//   },
// };

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/contact");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title ||
      "Contact Us - K.Sons Group – Vrindavan & Mathura Real Estate",
    description:
      seo?.meta_description ||
      "Get in touch with K.Sons Group for queries, sales, or support regarding residential and commercial projects in Vrindavan & Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group contact, real estate queries Vrindavan, Mathura real estate support, residential and commercial projects contact",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/contact",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/contact",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "Contact Us - K.Sons Group – Vrindavan & Mathura Real Estate",
      description:
        seo?.meta_description ||
        "Get in touch with K.Sons Group for queries, sales, or support regarding residential and commercial projects in Vrindavan & Mathura.",
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@KSonsGroup",
      creator: "@KSonsGroup",
      title:
        seo?.meta_title ||
        "Contact Us - K.Sons Group – Vrindavan & Mathura Real Estate",
      description:
        seo?.meta_description ||
        "Get in touch with K.Sons Group for queries, sales, or support regarding residential and commercial projects in Vrindavan & Mathura.",
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },
  };
}

export default async function page() {
  const pageRes = await fetchPageData("website/page/contact");
  const pageData = pageRes?.data;

  const sectionRes = await fetchPageData(
    "website/page-section/contact_from_header",
  );
  const sectionData = sectionRes?.data?.[0];

  const mainDetailsRep = await fetchPageData(
    "website/page-section/contact_main_details",
  );
  const mainDetailsData = mainDetailsRep?.data?.[0];

  const bannerData: CommonBannerProps = {
    tag: "Contact Us",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };
  const contactFormHeading: { title: string; heading: string } = {
    title: sectionData?.title?.main,
    heading: sectionData?.title?.sub,
  };

  const mainDetails: {
    email: string[] | string;
    phone: string[] | string;
    address: string;
  } = {
    email: mainDetailsData?.title?.email,
    phone: mainDetailsData?.title?.phone,
    address: mainDetailsData?.title?.address,
  };

  return (
    <div className="contact-us-page">
      <CommonBanner {...bannerData} />
      <ContactContainer
        contactHeading={contactFormHeading}
        mainDetails={mainDetails}
      />
    </div>
  );
}
