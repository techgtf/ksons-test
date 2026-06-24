import Gallery, { GalleryItem } from "@/src/website/components/common/Gallery";
import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import MicroHeader from "@/src/website/components/projects/micro/MicroHeader";

import ProjectGallery from "@/src/website/components/projects/ProjectGallery";
import { Metadata } from "next";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import { fetchPageData } from "@/src/website/utils/api";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await fetchPageData("website/page/gallery");
  const seo = pageRes?.data?.seoTags;

  return {
    title: seo?.meta_title || "K.Sons Group Gallery – Project Images & Visuals",
    description:
      seo?.meta_description ||
      "Browse images and visuals of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
    keywords:
      seo?.meta_keywords ||
      "K.Sons Group gallery, project images Vrindavan, Mathura real estate visuals, residential and commercial gallery",
    alternates: {
      canonical:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/gallery",
    },
    openGraph: {
      type: "website",
      url:
        `${BASE_FRONTEND}${pageRes?.data?.slug}` ||
        "https://ksonsgroup.com/gallery",
      siteName: "KSons Group",
      title:
        seo?.meta_title || "K.Sons Group Gallery – Project Images & Visuals",
      description:
        seo?.meta_description ||
        "Browse images and visuals of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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
        seo?.meta_title || "K.Sons Group Gallery – Project Images & Visuals",
      description:
        seo?.meta_description ||
        "Browse images and visuals of K.Sons Group residential and commercial projects in Vrindavan and Mathura.",
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

// ================================================//
// ================================================//
// DON'T REMOVE THE COMMENTED CODE ================//
// ================================================//
// ================================================//

const page = async () => {
  const [
    pageRes,
    // worksectionRes,
    projectsectionRes,
    // gallerysectionRes,
    projectsRes,
  ] = await Promise.all([
    fetchPageData("website/page/gallery"),
    // fetchPageData("website/page-section/gallery_our_culture"),
    fetchPageData("website/page-section/gallery_project_images"),
    // fetchPageData("website/gallery"),
    fetchPageData("website/project?limit=20"),
  ]);

  const pageData = pageRes?.data;
  const projectsectionData = projectsectionRes?.data?.[0];
  // const worksectionData = worksectionRes?.data?.[0];
  // const gallerysectionData = gallerysectionRes?.data ?? [];
  const projectsData = projectsRes?.data ?? [];

  const activeProjects = (
    await Promise.all(
      projectsData
        .filter((project: any) => project.status)
        .map(async (project: any) => {
          const galleryRes = await fetchPageData(
            `website/project/${project.id}/gallery`,
          );

          const hasActiveGallery = galleryRes?.data?.some(
            (gallery: any) => gallery.status,
          );

          return hasActiveGallery
            ? {
                id: project.id,
                projectName: project.projectName,
                slug: project.slug,
              }
            : null;
        }),
    )
  ).filter(Boolean);

  const bannerData: CommonBannerProps = {
    tag: "Gallery",
    heading: pageData?.title?.heading,
    description: pageData?.title?.sub_heading,
    files: {
      desktop_file: pageData?.files?.desktop_file,
      mobile_file: pageData?.files?.mobile_file,
      mainLabel: pageData?.files?.mainLabel,
    },
    headingArea: "lg:w-[850px]",
  };

  const gallery = {
    // work: {
    //   title: worksectionData?.title?.main,
    //   description: worksectionData?.title?.sub,
    // },
    projectGallery: {
      title: projectsectionData?.title?.main,
      description: projectsectionData?.title?.sub,
    },
  };

  // const galleryItems: GalleryItem[] = gallerysectionData.map((item: any) => ({
  //   id: item.id,
  //   type: item.type,
  //   files: {
  //     mobile_file: item?.files?.mobile_file,
  //     desktop_file: item?.files?.desktop_file,
  //   },
  //   title: item.type === "image" ? "Images" : "Videos",
  // }));

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
        <ProjectGallery projects={activeProjects} />
      </div>
    </>
  );
};

export default page;
