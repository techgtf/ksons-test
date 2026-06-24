import Accordion from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";
import { fetchPageData } from "@/src/website/utils/api";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/tax-benefits");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title || "K.Sons Group Tax Benefits – Real Estate Investments",
    description:
      seo?.meta_description ||
      "Learn about the tax benefits available on K.Sons Group residential and commercial properties in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group tax benefits, real estate tax Vrindavan, Mathura property investment benefits, NRI tax advantage",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/tax-benefit",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/tax-benefit",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "K.Sons Group Tax Benefits – Real Estate Investments",
      description:
        seo?.meta_description ||
        "Learn about the tax benefits available on K.Sons Group residential and commercial properties in Vrindavan and Mathura.",
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
        "K.Sons Group Tax Benefits – Real Estate Investments",
      description:
        seo?.meta_description ||
        "Learn about the tax benefits available on K.Sons Group residential and commercial properties in Vrindavan and Mathura.",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

export default async function taxBenefit() {
  const pageRes = await fetchPageData("website/page/tax-benefits");
  const pageData = pageRes?.data;
  const sub_desc = pageData?.title?.description;

  const bannerData: CommonBannerProps = {
    tag: "Tax Benefit",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    peraArea: "lg:w-[528px]",
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };

  const faqRes = await fetchPageData("website/other-faq?faq_type=tax-benefits");
  const faqData = faqRes?.data || [];

  type TaxBenefitType = {
    question: string;
    answer: string;
    seq: number;
    faq_type: string;
  };
  const accordionData = faqData.map(
    ({ question, answer, seq, faq_type }: TaxBenefitType) => ({
      question,
      answer,
      seq,
      faq_type,
    }),
  );

  const icon = "/images/about/about-page-banner-bottom.png";

  return (
    <>
      <CommonBanner {...bannerData} />

      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <div className="md:max-w-[700px] lg:max-w-[817px] mx-auto lg:pt-14 pb-10 lg:pb-20">
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
