import Gallery, { GalleryItem } from "@/src/website/components/common/Gallery";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import MicroHeader from "@/src/website/components/projects/micro/MicroHeader";

import ProjectGallery from "@/src/website/components/projects/ProjectGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group Gallery – Project Images & Visuals",
  keywords:
    "K.Sons Group gallery, project images Vrindavan, Mathura real estate visuals, residential and commercial gallery",
  description:
    "Browse images and visuals of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/gallery",
  },
};

const page = () => {
  const bannerData: CommonBannerProps = {
    tag: "Gallery",
    heading:
      "Where Every Image Captures the Essence of Legacy, Innovation, and Timeless Craftsmanship.",
    description:
      "Every Picture Tells a Story of Vision, Precision, and Purpose.",
    files: {
      desktop_file: "/images/gallery/gallery-banner.webp",
      mobile_file: "/images/gallery/gallery-banner.webp",
    },
    headingArea: "lg:w-[850px]",
  };

  const gallery = {
    work: {
      title: "Culture at Work",
      description:
        "Where Collaboration Fuels Innovation, and Every Detail Drives Excellence.",
    },
    projectGallery: {
      title: "Project Images",
      description:
        "Each Image a Testament, Every Detail a Promise of Excellence.",
    },
  };

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      type: "image",
      src: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&q=80&w=800",
      title: "Images",
    },
    {
      id: 2,
      type: "image",
      src: "https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d?auto=format&fit=crop&q=80&w=800",
      title: "Images",
    },
    {
      id: 3,
      type: "video",
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      title: "Videos",
    },
    {
      id: 4,
      type: "image",
      src: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
      title: "Images",
    },
    {
      id: 5,
      type: "video",
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      title: "Videos",
    },
    {
      id: 6,
      type: "image",
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      title: "Images",
    },
  ];

  return (
    <>
      <CommonBanner {...bannerData} />
      {/* <div className="app-container">
        <div data-cursor="light" className="lg:pt-20 pt-10">
          <MicroHeader {...gallery.work} />
        </div>
      </div>
      <Gallery galleryItems={galleryItems} /> */}
      <div data-cursor="light" className="app-container">
        <div className="border-t border-[#0f3c78]/8 lg:pb-20 pb-10" />
        <MicroHeader {...gallery.projectGallery} dataCursor="light" />
        <ProjectGallery />
      </div>
    </>
  );
};

export default page;
