import Accordion from "@/src/website/components/common/Accordion";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Tax Benefits – Real Estate Investments",
  keywords:
    "K.Sons Group tax benefits, real estate tax Vrindavan, Mathura property investment benefits, NRI tax advantage",
  description:
    "Learn about the tax benefits available on K.Sons Group residential and commercial properties in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/tax-benefit",
  },
};

export default function taxBenefit() {
  const bannerData: CommonBannerProps = {
    tag: "Tax Benefit",

    heading:
      "Maximizing Your Investment, Amplifying Your Future—Unlock the Power of Tax Benefits with K.sons.",

    description:
      "Where Every Investment Finds More Value—Smart Tax Benefits for a Secure Tomorrow.",
    peraArea: "lg:w-[528px]",
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",

    files: {
      desktop_file: "/images/tax-benefit/tax-banner.png",
      mobile_file: "/images/tax-benefit/tax-banner.png",
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };

  const sub_desc =
    "At K.sons, we believe in creating lasting value for our investors, and tax benefits are a key part of that journey. Our commitment to long-term growth extends beyond properties, it includes ensuring that every investment is maximized to its full potential. With our tailored tax strategies, we help you navigate the complexities of real estate investment, turning every opportunity into a step toward financial security. Together, we build not just homes, but futures that flourish for generations.";

  const accordionData = [
    {
      question:
        "What tax benefits can I avail of by investing in K.sons properties?",
      answer:
        "By investing in K.sons, you can avail of various tax benefits, including deductions on home loan interest under Section 24(b) and principal repayment under Section 80C. Our team assists you in understanding and maximizing these benefits to enhance the value of your investment.",
    },
    {
      question: "How does K.sons help in optimizing tax benefits for NRIs?",
      answer:
        "K.sons offers customized solutions for NRI investors, guiding you through the applicable tax laws and providing advice on how to structure your investment for maximum tax efficiency, both in India and abroad.",
    },
    {
      question: "Can I claim tax deductions for property under construction?",
      answer:
        "Yes, K.sons ensures that our investors are informed about tax deductions available during the construction phase, particularly under Section 24 for interest on home loans, which can be claimed even before possession.",
    },
    {
      question: "What is the tax impact of selling a K.sons property?",
      answer:
        "If you sell a K.sons property, you may be subject to capital gains tax. However, depending on the holding period, you could be eligible for long-term capital gains tax exemptions. Our experts guide you on minimizing these taxes through various available exemptions.",
    },
    {
      question:
        "How does K.sons assist in understanding tax implications for commercial properties?",
      answer:
        "Whether you're investing in residential or commercial properties, K.sons provides you with detailed insights into tax deductions and benefits specific to commercial real estate. We ensure that your investments are structured for long-term growth while optimizing tax outcomes.",
    },
  ];

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
