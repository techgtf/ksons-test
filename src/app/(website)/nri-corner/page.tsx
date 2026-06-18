import Accordion from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";
import { fetchPageData } from "@/src/website/utils/api";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/nri-corner");
  const seo = pageRes?.data?.seoTags;

  return {
    title: seo?.meta_title || "K.Sons Group NRI Corner – Property Guidance",
    description:
      seo?.meta_description ||
      "Guidance for NRIs on investing in K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group NRI, NRI property guidance Vrindavan, Mathura real estate for NRIs, investment tips NRI",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/nri-corner",
    },
    openGraph: {
      type: "website",
      url: `${BASE_FRONTEND}${pageRes?.data?.slug}`,
      siteName: "KSons Group",
      title: seo?.meta_title || "K.Sons Group NRI Corner – Property Guidance",
      description:
        seo?.meta_description ||
        "Guidance for NRIs on investing in K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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
      title: seo?.meta_title || "K.Sons Group NRI Corner – Property Guidance",
      description:
        seo?.meta_description ||
        "Guidance for NRIs on investing in K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

export default async function nri() {
  const pageRes = await fetchPageData("website/page/nri-corner");
  const pageData = pageRes?.data;

  const sub_desc = pageData?.title?.description;

  const bannerData: CommonBannerProps = {
    tag: "NRI Corner",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
    },
    headingArea: "lg:w-[650px] 2xl:w-[850px]",
  };

  const icon = "/images/about/about-page-banner-bottom.png";

  const faqRes = await fetchPageData("website/other-faq?faq_type=nri-corner");
  const faqData = faqRes?.data || [];

  type NRICornerType = {
    question: string;
    answer: string;
    seq: number;
    faq_type: string;
  };

  const data = faqData.map(
    ({ question, answer, seq, faq_type }: NRICornerType) => ({
      question,
      answer,
      seq,
      faq_type,
    }),
  );

  return (
    <>
      <CommonBanner {...bannerData} />

      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <div className="md:max-w-[700px] lg:max-w-[817px] mx-auto lg:pt-14 pb-10 lg:pb-20">
          <Accordion accordionData={data} />
        </div>
      </div>
    </>
  );
}
