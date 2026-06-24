import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import HomeLoanMarquee from "@/src/website/components/home loan/HomeLoanMarquee";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/home-loan");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title ||
      "K.Sons Group Home Loan Assistance – Vrindavan & Mathura",
    description:
      seo?.meta_description ||
      "Explore home loan options and assistance provided by K.Sons Group for purchasing residential properties in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group home loan, real estate financing Vrindavan, Mathura property loans, residential home loan assistance",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/home-loan",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/home-loan",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "K.Sons Group Home Loan Assistance – Vrindavan & Mathura",
      description:
        seo?.meta_description ||
        "Explore home loan options and assistance provided by K.Sons Group for purchasing residential properties in Vrindavan and Mathura.",
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
        "K.Sons Group Home Loan Assistance – Vrindavan & Mathura",
      description:
        seo?.meta_description ||
        "Explore home loan options and assistance provided by K.Sons Group for purchasing residential properties in Vrindavan and Mathura.",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

const HomeLoan = async () => {
  const pageRes = await fetchPageData("website/page/home-loan");
  const pageData = pageRes?.data;

  const bannerData: CommonBannerProps = {
    tag: "Home Loan",

    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };

  const sectionRes = await fetchPageData("website/page-section/home-loan");
  const sectionData = sectionRes?.data[0];

  const heading = sectionData?.title?.main;

  const subHeading = {
    para1: sectionData?.title?.short,
    para2: sectionData?.title?.description,
  };

  const bankLogos = [
    { name: "Axis Bank", src: "/images/home-loan/bank/axis.png" },
    { name: "SBI", src: "/images/home-loan/bank/sbi.png" },
    { name: "ICICI Bank", src: "/images/home-loan/bank/icici.png" },
    { name: "Axis Bank", src: "/images/home-loan/bank/axis.png" },
    { name: "SBI", src: "/images/home-loan/bank/sbi.png" },
    { name: "ICICI Bank", src: "/images/home-loan/bank/icici.png" },
  ];
  return (
    <>
      <CommonBanner {...bannerData} />
      <HomeLoanMarquee
        heading={heading}
        subHeading={subHeading}
        bankLogos={bankLogos}
      />
    </>
  );
};

export default HomeLoan;
