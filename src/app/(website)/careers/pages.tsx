import Hiring from "@/src/website/components/careers/Hiring";
import Life from "@/src/website/components/careers/Life";
import ContactForm from "@/src/website/components/careers/ContactForm";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import CareerSlider from "@/src/website/components/careers/CareerSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Careers – Join Our Team",
  keywords:
    "K.Sons Group careers, jobs in real estate Vrindavan, Mathura employment opportunities, K.Sons Group hiring",
  description:
    "Explore career opportunities at K.Sons Group and be part of a legacy real estate developer in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/careers",
  },
};

export default function investor() {
  const bannerData: CommonBannerProps = {
    tag: "Career",
    heading:
      "Where Passion Meets Purpose—Build Your Legacy with K.sons, the Architects of Tomorrow.",
    description:
      "A Place Where Talent Thrives, Innovation Flourishes, and Careers Are Built to Last.",
    files: {
      desktop_file: "/images/career/career-banner.webp",
      mobile_file: "/images/career/career-banner.webp",
    },
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <Life />
      <CareerSlider />
      <Hiring />
      <ContactForm />
    </>
  );
}
