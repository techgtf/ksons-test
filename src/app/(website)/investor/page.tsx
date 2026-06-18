import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import InvestorDesc, {
  InvestorDescProps,
} from "@/src/website/components/investor/InvestorDesc";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/investor");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title || "K.Sons Group Investor Relations – Updates & Reports",
    description:
      seo?.meta_description ||
      "Find investor-related information, financial updates, and corporate disclosures from K.Sons Group.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group investor, real estate investment Vrindavan, Mathura project reports, corporate updates, shareholder information",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/investor",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/investor",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "K.Sons Group Investor Relations – Updates & Reports",
      description:
        seo?.meta_description ||
        "Find investor-related information, financial updates, and corporate disclosures from K.Sons Group.",
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
        "K.Sons Group Investor Relations – Updates & Reports",
      description:
        seo?.meta_description ||
        "Find investor-related information, financial updates, and corporate disclosures from K.Sons Group.",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

export default async function investor() {
  const pageRes = await fetchPageData("website/page/investor");
  const pageData = pageRes?.data;
  const sectionRes = await fetchPageData("website/page-section/investor");
  const sectionData = sectionRes?.data?.[0];

  const bannerData: CommonBannerProps = {
    tag: "investors",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
    },
    headingArea: "lg:w-[650px] 2xl:w-[850px]",
  };

  const investorDescData: InvestorDescProps = {
    heading: sectionData?.title?.main,
    description: sectionData?.title?.description,
    icon: "/images/about/about-page-banner-bottom.png",
    image: sectionData?.files?.desktop_file,
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <InvestorDesc {...investorDescData} />
    </>
  );
}
