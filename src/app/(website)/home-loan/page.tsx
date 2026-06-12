import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import HomeLoanMarquee from "@/src/website/components/home loan/HomeLoanMarquee";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Home Loan Assistance – Vrindavan & Mathura",
  keywords:
    "K.Sons Group home loan, real estate financing Vrindavan, Mathura property loans, residential home loan assistance",
  description:
    "Explore home loan options and assistance provided by K.Sons Group for purchasing residential properties in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/home-loan",
  },
};

const HomeLoan = () => {
  const bannerData: CommonBannerProps = {
    tag: "Home Loan",

    heading:
      "Turning Your Dream Home into a Reality—With Every Step Backed by Trust and Transparency.",
    description: "Home Loans Tailored to Your Vision—Building Your Future",
    files: {
      desktop_file: "/images/home-loan/home-loan-banner.webp",
      mobile_file: "/images/home-loan/home-loan-banner.webp",
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };

  const heading = "A Home Loan Built on Your Trust, Powered by Our Commitment.";

  const subHeading = {
    para1: `At K.sons, we believe that a home is more than just a place—it's a foundation for your future. Our home loan services are designed to be transparent, flexible, and reliable, ensuring that you have the financial support needed to make your dream home a reality.`,
    para2: `We provide personalized home loan solutions, crafted to suit your unique needs and aspirations. With K.sons by your side, you’re not just securing a loan; you’re building a legacy, with every detail handled with care and precision.`,
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
