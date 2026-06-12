import React from "react";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import LatestBlogs from "@/src/website/components/blogs/LatestBlogs";
import PopularBlogs from "@/src/website/components/blogs/PopularBlogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Blogs – Real Estate Insights",
  keywords:
    "K.Sons Group blogs, real estate insights Vrindavan, Mathura property updates, investment guides",
  description:
    "Read expert insights, market trends, and updates on real estate from K.Sons Group’s official blogs.",
  alternates: {
    canonical: "https://ksonsgroup.com/blogs",
  },
};

const page = () => {
  const bannerData: CommonBannerProps = {
    tag: "our Blogs",
    headingArea: "lg:w-[740px] 2xl:w-[900px]",
    peraArea: "lg:w-[450px]",
    heading:
      "Where Insight Meets Innovation, Stay Ahead with Our Curated Stories and Future-Focused Content.",
    description:
      "Your Gateway to the Latest Trends, Thought Leadership, and Visionary Insights.",
    files: {
      desktop_file: "/images/blogs/hero.webp",
      mobile_file: "/images/blogs/hero-mb.webp",
    },
  };

  const sub_desc =
    "Our latest blogs offer a deep dive into the evolving landscape of real estate, innovation, and investment. Each post is a reflection of K.sons’ commitment to sharing valuable insights that help you stay informed, inspired, and ahead of the curve.";

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
