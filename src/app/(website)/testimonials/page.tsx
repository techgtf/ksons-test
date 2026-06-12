import BannerSubDesc from "@/src/website/components/common/BannerSubDesc";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import Testimonials, {
  TestimonialsProps,
} from "@/src/website/components/home/Testimonials";
import { TestimonialsData } from "@/src/website/components/testimonials/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Testimonials – Client Feedback",
  keywords:
    "K.Sons Group testimonials, customer reviews Vrindavan, Mathura real estate feedback, client experiences",
  description:
    "Read testimonials and reviews from satisfied customers of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/testimonials",
  },
};

export default function testimonials() {
  const bannerData: CommonBannerProps = {
    tag: "Testimonials",

    heading:
      "Voices of Trust—Where Every Testimony Reflects a Journey Built on Integrity and Excellence.",

    description: "Where Trust Speaks Louder, and Stories Shape Our Legacy.",

    // bottomText:
    //     "We were impressed by the thoughtful design and attention to detail in every corner of the project. The amenities, peaceful surroundings, and easy access to daily essentials make living here both comfortable and convenient.",

    files: {
      desktop_file: "/images/testimonials/testimonials-banner.webp",
      mobile_file: "/images/testimonials/testimonials-banner.webp",
    },
    headingArea: "lg:w-[850px]",
  };

  const testimonialsData: TestimonialsProps = {
    tag: "Testimonial",
    heading: "Where Every Voice Echoes Our Commitment to Lasting Value",
    testimonials: TestimonialsData,
  };

  const sub_desc =
    "At K.sons, the trust of our partners, clients, and stakeholders is the foundation of our legacy. Each testimonial reflects not just a relationship, but a shared commitment to excellence, built over time through consistent actions and unwavering dedication. These voices echo the values that drive us—credibility, foresight, and responsibility.";

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
