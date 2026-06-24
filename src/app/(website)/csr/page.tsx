import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import CSRGallery from "@/src/website/components/csr/CSRGallery";
import { fetchPageData } from "@/src/website/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/csr");
  const seo = pageRes?.data?.seoTags;

  return {
    title:
      seo?.meta_title ||
      "K.Sons Group CSR & Sustainability – Making a Difference",
    description:
      seo?.meta_description ||
      "Discover K.Sons Group's CSR initiatives and sustainability practices. Learn about our commitment to community development, environmental responsibility, and social impact in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group CSR, sustainability Vrindavan, community development Mathura, social impact, environmental responsibility, corporate social responsibility",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/csr",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/csr",
      siteName: "KSons Group",
      title:
        seo?.meta_title ||
        "K.Sons Group CSR & Sustainability – Making a Difference",
      description:
        seo?.meta_description ||
        "Discover K.Sons Group's CSR initiatives and sustainability practices. Learn about our commitment to community development, environmental responsibility, and social impact in Vrindavan and Mathura.",
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@KSonsGroup",
      creator: "@KSonsGroup",
      title:
        seo?.meta_title ||
        "K.Sons Group CSR & Sustainability – Making a Difference",
      description:
        seo?.meta_description ||
        "Discover K.Sons Group's CSR initiatives and sustainability practices. Learn about our commitment to community development, environmental responsibility, and social impact in Vrindavan and Mathura.",
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },
  };
}

const page = async () => {
  const pageRes = await fetchPageData("website/page/csr");
  const pageData = pageRes?.data;

  const csrOverviewRes = await fetchPageData(
    "website/page-section/csr_overview",
  );
  const csrOverviewData = csrOverviewRes?.data?.[0];

  const eventsRes = await fetchPageData("website/events");
  const eventsData = eventsRes?.data || [];

  const mappedEvents = eventsData.map((item: any) => {
    const images: { url: string; mainLabel?: string }[] = [];
    if (item.eventGalleries && item.eventGalleries.length > 0) {
      item.eventGalleries.forEach((gallery: any) => {
        const img = gallery.files?.desktop_file || gallery.files?.mobile_file;
        if (img) {
          images.push({
            url: img,
            mainLabel: gallery.files?.mainLabel || "",
          });
        }
      });
    }
    if (images.length === 0 && item.files) {
      const img = item.files.desktop_file || item.files.mobile_file;
      if (img) {
        images.push({
          url: img,
          mainLabel: item.files?.mainLabel || "",
        });
      }
    }
    return {
      id: item.id,
      title: item.title,
      year: item.year,
      description: [item.description],
      images,
      mainLabel: item.files?.mainLabel || "",
    };
  });

  const bannerData: CommonBannerProps = {
    tag: "CSR & Sustainbility",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
  };

  return (
    <>
      <CommonBanner {...bannerData} />
      <CSRGallery
        title={csrOverviewData?.title?.main}
        description={csrOverviewData?.title?.sub}
        long_description={csrOverviewData?.title?.description}
        events={mappedEvents}
      />
    </>
  );
};

export default page;
