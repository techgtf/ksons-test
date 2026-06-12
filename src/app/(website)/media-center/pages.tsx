import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import Media from "@/src/website/components/media-center/Media";
import MediaNewsSection from "@/src/website/components/media-center/MediaNewsSection";
import MicroHeader from "@/src/website/components/projects/micro/MicroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Media Center – News & Updates",
  keywords:
    "K.Sons Group media, real estate news Vrindavan, Mathura property updates, K.Sons press",
  description:
    "Explore the latest news, media coverage, and updates about K.Sons Group's residential and commercial projects in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/media-center",
  },
};

export default function investor() {
  const bannerData: CommonBannerProps = {
    tag: "Media Center",
    heading:
      "Where Every Story Begins—Shaping the Future with News That Inspires, Informs, and Empowers.",
    description:
      "Stay Ahead of the Curve—Get the Latest Updates that Define Tomorrow.",
    files: {
      desktop_file: "/images/media-center/media-center-banner.webp",
      mobile_file: "/images/media-center/media-center-banner-mb.webp",
    },
  };
  const title = "Our News";
  const description =
    "Breaking News, Building Legacies—Stay Informed with Our Visionary Updates.";

  return (
    <>
      <CommonBanner {...bannerData} />
      <Media />
      <div data-cursor="light" className="bg-[#0f3c78]/1">
        <div className="pt-16 lg:pt-24 space-y-14!">
          <div className="app-container">
            <MicroHeader title={title} description={description} />
          </div>
          <MediaNewsSection />
        </div>
      </div>
    </>
  );
}
