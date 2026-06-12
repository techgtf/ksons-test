import Image from "next/image";
import Accordion from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import { blauerNue } from "../../fonts";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "K.Sons Group FAQ – Real Estate Questions Answered",
  keywords:
    "K.Sons Group FAQ, real estate questions Vrindavan, Mathura property queries, residential and commercial FAQs",
  description:
    "Find answers to frequently asked questions about K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/faq",
  },
}

export default function faq() {
  const bannerData: CommonBannerProps = {
    tag: "Faq",

    heading:
      "Where Every Question Finds a Clear Answer—Your Journey to Informed Decisions Begins Here.",

    description:
      "Clarity at Every Step—Empowering You with the Information You Need.",
    files: {
      desktop_file: "/images/faq/hero.webp",
      mobile_file: "/images/faq/hero.webp",
    },
    headingArea: "lg:w-[780px] 2xl:w-[850px]",
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",
  };

  const sub_desc =
    "At K.sons, we believe that informed decisions are the foundation of every successful investment. Our FAQs page is crafted to provide you with the clarity you need, answering your questions with transparency and precision. Whether you're a first-time buyer or an experienced investor, our goal is to guide you with the knowledge necessary to make confident choices, paving the way for a secure and lasting future.";

  const icon = "/images/about/about-page-banner-bottom.png";

  const accordionData = [
    {
      question: "How can I invest in K.sons properties?",
      answer:
        "Investing in K.sons is simple and transparent. You can browse our available properties online, and our team will guide you through every step—be it financing options, legal documentation, or finalizing your purchase.",
    },
    {
      question: "What tax benefits can I avail with K.sons investments?",
      answer:
        "K.sons provides detailed guidance on tax deductions available under Section 80C for principal repayment and Section 24(b) for interest on home loans. We ensure that your investment is structured for maximum tax efficiency.",
    },
    {
      question: "Can NRIs invest in K.sons properties?",
      answer:
        "Yes, K.sons welcomes NRI investors. Our team provides specialized support for NRIs, guiding you through the legal, financial, and tax implications to make your investment seamless and beneficial.",
    },
    {
      question:
        "What kind of warranty or post-sale support does K.sons provide?",
      answer:
        "K.sons stands behind every property we sell. We offer post-sale support to ensure your satisfaction, including property maintenance advice, handling queries, and assisting with any future upgrades or services.",
    },
    {
      question: "How does K.sons ensure quality in construction?",
      answer:
        "Quality is the cornerstone of every K.sons project. Our developments are constructed using the highest standards of materials, with a focus on long-term sustainability and structural integrity. We adhere to stringent quality controls to ensure that every home and commercial space meets our promises of excellence.",
    },
    {
      question: "What makes K.sons different from other developers?",
      answer:
        "At K.sons, we focus on building not just properties, but communities. Our approach is based on long-term relationships, transparency, and consistent quality. With a foundation of credibility and foresight, we create spaces that stand the test of time, providing value and security for generations to come.",
    },
  ];

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
