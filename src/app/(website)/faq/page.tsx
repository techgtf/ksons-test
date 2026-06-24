import Accordion from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import { fetchPageData } from "@/src/website/utils/api";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/faq");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title || "K.Sons Group FAQ – Real Estate Questions Answered",
    description:
      seo?.meta_description ||
      "Find answers to frequently asked questions about K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group FAQ, real estate questions Vrindavan, Mathura property queries, residential and commercial FAQs",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/faq",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/faq",
      siteName: "KSons Group",
      title:
        seo?.meta_title || "K.Sons Group FAQ – Real Estate Questions Answered",
      description:
        seo?.meta_description ||
        "Find answers to frequently asked questions about K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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
        seo?.meta_title || "K.Sons Group FAQ – Real Estate Questions Answered",
      description:
        seo?.meta_description ||
        "Find answers to frequently asked questions about K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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

export default async function faq() {
  const pageRes = await fetchPageData("website/page/faq");
  const pageData = pageRes?.data;

  const bannerData: CommonBannerProps = {
    tag: "FAQ",

    heading: pageData?.title?.heading,

    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
    headingArea: "lg:w-[780px] 2xl:w-[850px]",
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",
  };

  const sub_desc = pageData?.title?.description;

  const icon = "/images/about/about-page-banner-bottom.png";

  const faqRes = await fetchPageData("website/faq");

  const faq = faqRes?.data;

  const accordionData = faq?.map(
    ({ question, answer }: { question: string; answer: string }) => {
      return {
        question,
        answer,
      };
    },
  );

  return (
    <>
      <CommonBanner {...bannerData} />
      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <hr className="border border-[#0f3c78]/8 mt-14" />
        <div className="md:max-w-[700px] lg:max-w-[817px] lg:my-30 my-10 mx-auto">
          <Accordion
            showQuestionPrefix={false}
            showAnswerPrefix={false}
            accordionData={accordionData}
          />
        </div>
      </div>
    </>
  );
}
