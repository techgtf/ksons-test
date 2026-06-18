import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import Testimonials, {
  TestimonialsProps,
} from "@/src/website/components/home/Testimonials";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/testimonials");
  const seo = pageRes?.data?.seoTags;

  return {
    title: seo?.meta_title || "K.Sons Group Testimonials – Client Feedback",
    description:
      seo?.meta_description ||
      "Read testimonials and reviews from satisfied customers of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group testimonials, customer reviews Vrindavan, Mathura real estate feedback, client experiences",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/testimonials",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/testimonials",
      siteName: "KSons Group",
      title: seo?.meta_title || "K.Sons Group Testimonials – Client Feedback",
      description:
        seo?.meta_description ||
        "Read testimonials and reviews from satisfied customers of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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
      title: seo?.meta_title || "K.Sons Group Testimonials – Client Feedback",
      description:
        seo?.meta_description ||
        "Read testimonials and reviews from satisfied customers of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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

export default async function testimonials() {
  const pageRes = await fetchPageData("website/page/testimonials");
  const pageData = pageRes?.data;

  const sectionRes = await fetchPageData("website/page-section/testimonials");
  const sectionData = sectionRes?.data?.[0];

  const testimonialRes = await fetchPageData("website/testimonials");
  const testimonialResData = testimonialRes?.data;

  const testimonialMappedData = testimonialResData?.map(
    (item: {
      name: string;
      designation: string;
      files: { image: string };
      description: string;
    }) => ({
      name: item.name,
      role: item.designation,
      image: item.files?.image,
      text: item.description,
    }),
  );

  const bannerData: CommonBannerProps = {
    tag: "Testimonials",

    heading: pageData?.title?.heading,

    description: pageData?.title?.sub_heading,

    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",

    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
    },
    headingArea: "lg:w-[850px]",
  };

  const sub_desc = pageData?.title?.description;

  const testimonialsData: TestimonialsProps = {
    tag: sectionData?.title?.main,
    heading: sectionData?.title?.sub,
    testimonials: testimonialMappedData,
  };

  const icon = "/images/about/about-page-banner-bottom.png";

  return (
    <>
      <CommonBanner {...bannerData} />
      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
      </div>
      <Testimonials {...testimonialsData} bgImg={false} />
    </>
  );
}
