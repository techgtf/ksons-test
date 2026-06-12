import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import Calculator from "@/src/website/components/emi/calculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group EMI Calculator – Plan Your Investment",
  keywords: "K.Sons Group EMI calculator, home loan EMI Vrindavan, Mathura property EMI, investment planning real estate",
  description: "Use K.Sons Group EMI Calculator to estimate monthly payments for residential and commercial properties in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/emi-calculator",
  },
};

export default async function page() {
  const bannerData: CommonBannerProps = {
    tag: "Emi Calculator",
    heading:
      "Transforming Dreams into Reality—Calculate Your Way to a Future Built on Trust and Transparency.",
    description:
      "Empowering Your Journey—Easy EMI Calculations for a Future That’s Within Reach.",
    files: {
      desktop_file: "/images/emi/emi-banner.webp",
      mobile_file: "/images/emi/emi-banner.webp",
    },
  };

  const sub_desc = (
    <>
      <p className="mb-4 lg:mb-10!">
        At K.sons, we understand that the journey to owning a home is not just
        about the property, it’s about securing a future built on stability and
        clarity. Our EMI Calculator simplifies your journey by helping you plan
        and manage your payments efficiently. With our transparent approach, we
        ensure that every step you take toward your dream home is informed and
        empowered. Let us guide you with the right tools to make your investment
        a seamless, long-term success.
      </p>
    </>
  );

  const icon = "/images/about/about-page-banner-bottom.png";
  return (
    <>
      <CommonBanner {...bannerData} />
      <div data-cursor="light" className="app-container">
        <BannerSubDesc sub_desc={sub_desc} icon={icon} />
        <hr className="border border-[#0f3c78]/8" />
        <Calculator />
      </div>
    </>
  );
}
