import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import Calculator from "@/src/website/components/emi/calculator";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/emi-calculator");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title || "K.Sons Group EMI Calculator – Plan Your Investment",
    description:
      seo?.meta_description ||
      "Use K.Sons Group EMI Calculator to estimate monthly payments for residential and commercial properties in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group EMI calculator, home loan EMI Vrindavan, Mathura property EMI, investment planning real estate",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/emi-calculator",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/emi-calculator",
      siteName: "KSons Group",
      title:
        seo?.meta_title || "K.Sons Group EMI Calculator – Plan Your Investment",
      description:
        seo?.meta_description ||
        "Use K.Sons Group EMI Calculator to estimate monthly payments for residential and commercial properties in Vrindavan and Mathura.",
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
        seo?.meta_title || "K.Sons Group EMI Calculator – Plan Your Investment",
      description:
        seo?.meta_description ||
        "Use K.Sons Group EMI Calculator to estimate monthly payments for residential and commercial properties in Vrindavan and Mathura.",
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
  const pageRes = await fetchPageData("website/page/emi-calculator");
  const pageData = pageRes?.data;

  const bannerData: CommonBannerProps = {
    tag: "EMI Calculator",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
  };

  const sub_desc = (
    <>
      <p className="mb-4 lg:mb-10!">{pageData?.title?.description}</p>
    </>
  );

  const icon = "/images/about/about-page-banner-bottom.png";
  return (
    <>
      <CommonBanner {...bannerData} />
      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <hr className="border border-[#0f3c78]/8" />
        <Calculator />
      </div>
    </>
  );
}
