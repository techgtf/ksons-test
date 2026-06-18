import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import OurNews from "@/src/website/components/news-events/OurNews";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/news-events");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title || "K.Sons Group Events – Corporate & Community Updates",
    description:
      seo?.meta_description ||
      "Stay updated with K.Sons Group’s corporate events, project launches, and community initiatives in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group events, real estate launches, Vrindavan community events, Mathura property events, corporate updates",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/news-events",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/news-events",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "K.Sons Group Events – Corporate & Community Updates",
      description:
        seo?.meta_description ||
        "Stay updated with K.Sons Group’s corporate events, project launches, and community initiatives in Vrindavan and Mathura.",
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
        "K.Sons Group Events – Corporate & Community Updates",
      description:
        seo?.meta_description ||
        "Stay updated with K.Sons Group’s corporate events, project launches, and community initiatives in Vrindavan and Mathura.",
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

const page = async () => {
  const pageRes = await fetchPageData("website/page/news-events");
  const pageData = pageRes?.data;

  const bannerData: CommonBannerProps = {
    tag: "News & Events",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
    },
    peraArea: "lg:w-[450px]",
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <OurNews />
    </>
  );
};

export default page;
