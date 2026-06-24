import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import LatestBlogs from "@/src/website/components/blogs/LatestBlogs";
import PopularBlogs from "@/src/website/components/blogs/PopularBlogs";
import { Metadata } from "next";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import { fetchPageData } from "@/src/website/utils/api";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/blogs");
  const seo = pageRes?.data?.seoTags;

  return {
    title: seo?.meta_title || "K.Sons Group Blogs – Real Estate Insights",
    description:
      seo?.meta_description ||
      "Read expert insights, market trends, and updates on real estate from K.Sons Group’s official blogs.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group blogs, real estate insights Vrindavan, Mathura property updates, investment guides",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/blogs",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/blogs",
      siteName: "KSons Group",
      title: seo?.meta_title || "K.Sons Group Blogs – Real Estate Insights",
      description:
        seo?.meta_description ||
        "Read expert insights, market trends, and updates on real estate from K.Sons Group’s official blogs.",
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
      title: seo?.meta_title || "K.Sons Group Blogs – Real Estate Insights",
      description:
        seo?.meta_description ||
        "Read expert insights, market trends, and updates on real estate from K.Sons Group’s official blogs.",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

const page = async () => {
  const pageRes = await fetchPageData("website/page/blogs");
  const pageData = pageRes?.data;

  const bannerData: CommonBannerProps = {
    tag: "our Blogs",
    headingArea: "lg:w-[740px] 2xl:w-[900px]",
    peraArea: "lg:w-[450px]",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
  };

  const sub_desc = pageData?.title?.description;

  const icon = "/images/about/about-page-banner-bottom.png";

  return (
    <>
      <CommonBanner {...bannerData} />
      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <div className="lg:py-27 py-10 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 gap-0">
            <div className="lg:col-span-8">
              <LatestBlogs />
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-16 lg:block hidden">
              <PopularBlogs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
