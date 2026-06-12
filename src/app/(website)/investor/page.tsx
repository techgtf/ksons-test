import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import InvestorDesc, {
  InvestorDescProps,
} from "@/src/website/components/investor/InvestorDesc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Investor Relations – Updates & Reports",
  keywords:
    "K.Sons Group investor, real estate investment Vrindavan, Mathura project reports, corporate updates, shareholder information",
  description:
    "Find investor-related information, financial updates, and corporate disclosures from K.Sons Group.",
  alternates: {
    canonical: "https://ksonsgroup.com/investor",
  },
};

export default function investor() {
  const bannerData: CommonBannerProps = {
    tag: "investors",
    heading:
      "Investing in More Than Just Property—Building a Legacy, One Visionary Step at a Time.",
    description:
      "Where Your Investment Meets Purpose, Growth, and Timeless Value.",
    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",
    files: {
      desktop_file: "/images/investor/hero.webp",
      mobile_file: "/images/investor/hero.webp",
    },
    headingArea: "lg:w-[650px] 2xl:w-[850px]",
  };

  const investorDescData: InvestorDescProps = {
    heading: "Where Your Investment Becomes a Timeless Legacy",
    description:
      "At K.sons, we view investment as a partnership, one rooted in trust, foresight, and long-term vision. Every project we undertake is crafted with the commitment to not only deliver returns but to build lasting value that endures for generations. Whether residential or commercial, our developments are shaped by a deep understanding of market dynamics and a dedication to excellence.",
    icon: "/images/about/about-page-banner-bottom.png",
    image: "/images/investor/pageimg.webp",
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <InvestorDesc {...investorDescData} />
    </>
  );
}
