import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import OurNews from "@/src/website/components/news-events/OurNews";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Events – Corporate & Community Updates",
  keywords:
    "K.Sons Group events, real estate launches, Vrindavan community events, Mathura property events, corporate updates",
  description:
    "Stay updated with K.Sons Group’s corporate events, project launches, and community initiatives in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/news-events",
  },
};

const page = () => {
  const bannerData: CommonBannerProps = {
    tag: "News & Events",
    heading:
      "Breaking News, Building Legacies, Stay Informed with Stories That Shape Tomorrow.",
    description:
      "The Latest Updates, The Boldest Moves, Where Every Headline Reflects a Vision.",
    files: {
      desktop_file: "/images/news-events/news-events-banner.webp",
      mobile_file: "/images/news-events/news-events-banner.webp",
    },
    peraArea: "lg:w-[450px]",
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <OurNews />
    </>
  );
};

export default page;
