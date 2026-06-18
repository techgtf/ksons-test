import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import NewsSection from "./NewsSection";
import { fetchPageData } from "@/src/website/utils/api";

const OurNews = async () => {
  const pageRes = await fetchPageData("website/page-section/news-events");
  const pageData = pageRes?.data[0];
  const title = pageData?.title?.main;
  const description = pageData?.title?.sub;
  const long_description = pageData?.title?.description;
  return (
    <div data-cursor="light" className="lg:pt-30 pt-10 pb-10">
      <div className="app-container">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-20">
          <div className="flex items-center gap-5 mb-6 md:mb-10">
            <Image
              src="/images/about/about-bullet.png"
              alt="Icon"
              width={16}
              height={16}
            />
            <span
              className={`${blauerNue.className} text-[#0F3C78] text-[14px] md:text-[18px] leading-[20px] tracking-[0.5px] capitalize`}
            >
              {title}
            </span>
          </div>
          <h2
            className={`${agency.className} text-[#0F3C78] text-[24px] md:text-[36px] mb-6 md:mb-8 lg:max-w-[755px]`}
          >
            {description}
          </h2>
          <p
            className={`${blauerNue.className} text-[#0F3C78] text-[14px] lg:text-base lg:max-w-[818px] tracking-[0.5px] leading-[24px]`}
          >
            {long_description}
          </p>
        </div>

        {/* News Section Component */}
        <NewsSection />
      </div>
    </div>
  );
};

export default OurNews;
