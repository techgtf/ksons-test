import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import CSRGallery from "@/src/website/components/csr/CSRGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group - CSR & Sustainability",
  keywords:
    "K.Sons Group CSR, sustainability Vrindavan, community development Mathura",
  description:
    "Learn about K.Sons Group's CSR initiatives and sustainability practices in Vrindavan and Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/csr",
  },
};

const page = () => {
  const bannerData: CommonBannerProps = {
    tag: "CSR & Sustainbility",
    heading: "Building Beyond Business Creating Impact Through Care",
    description: "Committed to Social Impact Creating a Better Tomorrow",
    files: {
      desktop_file: "/images/csr/csr-banner.webp",
      mobile_file: "/images/csr/csr-banner.webp",
    },
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <CSRGallery />
    </>
  );
};

export default page;
