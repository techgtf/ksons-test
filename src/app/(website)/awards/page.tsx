import AwardCards, {
  AwardsItem,
  AwardsProps,
} from "@/src/website/components/awards/AwardCards";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import InvestorDesc, {
  InvestorDescProps,
} from "@/src/website/components/investor/InvestorDesc";
import Gallery, { GalleryItem } from "@/src/website/components/common/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Awards – Recognitions & Achievements",
  keywords:
    "K.Sons Group awards, real estate recognitions, Vrindavan awards, Mathura property accolades, developer achievements",
  description:
    "Discover the awards and recognitions received by K.Sons Group for excellence in residential and commercial real estate in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/awards",
  },
};

export default function awards() {
  const bannerData: CommonBannerProps = {
    tag: "Awards",

    heading:
      "Every Award a Testament and Every Milestone Reflects Our Commitment to the Future.",
    description:
      "Recognizing Excellence, Celebrating Milestones in Our Journey of Achievement.",
    files: {
      desktop_file: "/images/awards/awards-banner.webp",
      mobile_file: "/images/awards/awards-banner.webp",
    },
    headingArea: "lg:w-[850px] lg:w-[950px]",
  };

  const investorDescData: InvestorDescProps = {
    heading:
      "Not Just Trophies, But Milestones in Our Journey to Building the Future.",
    description:
      "At K.sons, every accolade is more than a recognition, it’s a reflection of the values that guide us. Our commitment to excellence, integrity, and foresight has been honored time and again, reinforcing our belief that true success is measured not in awards, but in the lasting impact we create.",
    icon: "/images/about/about-page-banner-bottom.png",
  };

  const awardCards: AwardsItem[] = [
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
    {
      title: "Excellence In Quality Construction",
      description: "Lorem Ipsum Has Industry's Standard Dummy Text..",
    },
  ];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      type: "image",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&q=80&w=800",
      },
      title: "Images",
    },
    {
      id: 2,
      type: "image",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d?auto=format&fit=crop&q=80&w=800",
      },
      title: "Images",
    },
    {
      id: 3,
      type: "video",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      },
      title: "Videos",
    },
    {
      id: 4,
      type: "image",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
      },
      title: "Images",
    },
    {
      id: 5,
      type: "video",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      },
      title: "Videos",
    },
    {
      id: 6,
      type: "image",
      files: {
        desktop_file: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
        mobile_file: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      },
      title: "Images",
    },
  ];

  return (
    <>
      <CommonBanner {...bannerData} />

      <InvestorDesc {...investorDescData} />

      <AwardCards awardCards={awardCards} />
      <div className="pt-16 md:pt-24">
        <Gallery galleryItems={galleryItems} />
      </div>
    </>
  );
}
