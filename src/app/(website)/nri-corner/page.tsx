import Accordion, {
  AccordionItem,
} from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group NRI Corner – Property Guidance",
  keywords: "K.Sons Group NRI, NRI property guidance Vrindavan, Mathura real estate for NRIs, investment tips NRI",
  description: "Guidance for NRIs on investing in K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/nri-corner",
  },
};

export default function nri() {
  const bannerData: CommonBannerProps = {
    tag: "NRI Corner",
    heading:
      "Your Bridge to a Legacy of Opportunities—Where Vision Meets Investment Beyond Borders.",
    description:
      "Empowering NRIs with Spaces that Speak to Their Legacy and Future.",
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",
    files: {
      desktop_file: "/images/nri/nri-banner.webp",
      mobile_file: "/images/nri/nri-banner.webp",
    },
    headingArea: "lg:w-[650px] 2xl:w-[850px]",
  };

  const sub_desc =
    "At K.sons, we understand the dreams and aspirations that NRIs carry across borders. Our developments are more than just investments; they are an extension of your legacy, thoughtfully crafted to offer not just a home, but a lasting community. With a vision that transcends geographical boundaries, we create spaces that offer a timeless connection to home, no matter where you are.";

  const icon = "/images/about/about-page-banner-bottom.png";

  const data: AccordionItem[] = [
    {
      question: "What makes K.sons a reliable choice for NRI investors?",
      answer:
        "K.sons is built on a foundation of credibility, foresight, and responsibility. Our projects are meticulously planned and executed, ensuring your investment is both secure and sustainable for generations to come.",
    },
    {
      question: "How can NRIs invest in K.sons' properties?",
      answer:
        "Investing with K.sons is simple and transparent. Our team assists with the entire process, from selecting the perfect property to navigating legal and financial procedures, ensuring a seamless experience.",
    },
    {
      question: "Are there any special offers for NRI investors?",
      answer:
        "K.sons offers tailored solutions for NRI investors, providing guidance and exclusive offers that align with your investment goals, ensuring your experience is as rewarding as it is seamless.",
    },
    {
      question: "How does K.sons ensure the quality of its developments?",
      answer:
        "Every K.sons project is built with the utmost attention to detail, guided by our core values. We focus on long-term sustainability, ensuring that each development remains a valuable asset for years to come.",
    },
    {
      question: "Can I purchase property in K.sons' townships as an NRI?",
      answer:
        "Yes, NRIs can purchase property in K.sons' well-planned townships. We offer a range of residential options, providing a perfect blend of luxury, comfort, and long-term investment value.",
    },
  ];

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
