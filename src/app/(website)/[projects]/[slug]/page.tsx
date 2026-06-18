import Amenities from "@/src/website/components/projects/micro/Amenities";
import FloorAndMasterPlan from "@/src/website/components/projects/micro/FloorAndMasterPlan";
import Gallery from "@/src/website/components/projects/micro/Gallery";
import Hero from "@/src/website/components/projects/micro/Hero";
import Highlights from "@/src/website/components/projects/micro/Highlights";
import Location from "@/src/website/components/projects/micro/Location";
import OverView from "@/src/website/components/projects/micro/OverView";
import Specifications from "@/src/website/components/projects/micro/Specifications";
import { fetchPageData } from "@/src/website/utils/api";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BASE_FRONTEND, SITE_LOGO, BASE_WEBSITE } from "@/config";

const UPLOAD_BASE_URL = BASE_WEBSITE
  ? BASE_WEBSITE.replace("api/v1/", "uploads/")
  : "https://api.ksonsgroup.com/uploads/";

const getUploadUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${UPLOAD_BASE_URL}${path}`;
};

const typeMap: Record<string, string> = {
  INFRASTRUCTURE: "Infrastructure",
  FLOORING: "Flooring",
  LOCATION: "Location",
  WALLS_CEILING: "Walls And Ceiling",
  WINDOWS: "Windows",
  ELECTRICAL: "Electrical",
  SANITARY: "Sanitary",
  HOME_AUTOMATION: "Home Automation",
  DOORS: "Doors",
};

type Props = {
  params: Promise<{
    projects: string;
    slug: string;
  }>;
};

const getProject = cache(async (slug: string) => {
  const res = await fetchPageData(`website/projects/${slug}`);
  return res?.data;
});

export async function generateStaticParams() {
  const platterRes = await fetchPageData("website/platter");
  const platterData = platterRes?.data || [];

  const paths = await Promise.all(
    platterData.map(async (platter: any) => {
      const projectRes = await fetchPageData(
        `website/project?platterId=${platter.id}&limit=20`,
      );

      const projects = projectRes?.data || [];

      return projects.map((project: any) => ({
        projects: platter.slug,
        slug: project.slug,
      }));
    }),
  );

  return paths.flat();
}

export async function generateMetadata({ params }: Props) {
  const { projects, slug } = await params;

  const projectData = await getProject(slug);

  if (!projectData) {
    return {};
  }

  const seo = projectData.seoTags || {};
  const title = seo.title || projectData.projectName;
  const description =
    seo.description || projectData.shortDescription || "projects";
  const url = `${BASE_FRONTEND}${projects}/${slug}`;

  return {
    title: title,
    description: description,
    keywords: seo.keywords,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      url: url,
      siteName: "KSons Group",
      title: title,
      description: description,
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
      title: title,
      description: description,
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projects, slug } = await params;

  const projectData = await getProject(slug);

  if (!projectData) {
    notFound();
  }

  // Fetch sections first
  const sectionsRes = await fetchPageData(
    `website/project/sections/${projectData.id}`,
  );

  const sections = sectionsRes?.data || [];

  const sectionMap = Object.fromEntries(
    sections.map((section: any) => [section.type, section]),
  );

  const locationSection =
    sectionMap.locationadvantage ||
    sectionMap.locationdata ||
    sectionMap.location;

  const [
    highlightsRes,
    specsRes,
    locationRes,
    galleryRes,
    amenitiesRes,
    floorPlanRes,
  ] = await Promise.all([
    sectionMap.highlight
      ? fetchPageData(`website/project/${projectData.id}/highlights`)
      : Promise.resolve(null),

    sectionMap.specification
      ? fetchPageData(`website/project/${projectData.id}/specifications`)
      : Promise.resolve(null),

    locationSection
      ? fetchPageData(`website/project/${projectData.id}/location-advantage`)
      : Promise.resolve(null),

    sectionMap.gallery
      ? fetchPageData(`website/project/${projectData.id}/gallery`)
      : Promise.resolve(null),

    sectionMap.amenities
      ? fetchPageData(`website/project/${projectData.id}/amenities`)
      : Promise.resolve(null),
    sectionMap.floorPlan
      ? fetchPageData(`website/project/${projectData.id}/floor-plans`, 0)
      : Promise.resolve(null),
  ]);

  // --------------------------------
  // HERO
  // --------------------------------

  const heroData = {
    dekstop_file:
      projectData.files?.desktop_image ||
      projectData.files?.featured_desktop_file ||
      "",

    mobile_file:
      projectData.files?.mobile_image ||
      projectData.files?.featured_mobile_file ||
      "",
  };

  // --------------------------------
  // OVERVIEW
  // --------------------------------

  const typologyName = projectData.typology?.name || "";

  const subTypologies =
    projectData.projectSubTypology
      ?.map((item: any) => item.subTypology?.name)
      .filter(Boolean) || [];

  const combinedTypology =
    subTypologies.length > 1
      ? `${subTypologies.slice(0, -1).join(", ")} & ${subTypologies.at(-1)}`
      : subTypologies[0] || "";

  const overviewData = {
    title: projectData.projectName || "",
    description: projectData.shortDescription || "",
    location: projectData.location || "",

    area: projectData.starting_size
      ? `${projectData.starting_size} ${projectData.size_unit || "Acres"}`
      : "",

    status: projectData.projectStatus?.name || "Ongoing",

    typology: combinedTypology,
  };

  // --------------------------------
  // HIGHLIGHTS
  // --------------------------------

  const highlightSection = sectionMap.highlight;

  const highlightsData = highlightSection
    ? {
        title: highlightSection.title?.main || "Highlights",

        description: highlightSection.title?.short || "",

        list: Array.isArray(highlightsRes?.data || highlightsRes)
          ? (highlightsRes?.data || highlightsRes).map((item: any) => ({
              icons: getUploadUrl(item.files?.image || item.image || ""),

              name: item.title || item.name || "",
            }))
          : [],
      }
    : null;

  // --------------------------------
  // SPECIFICATIONS
  // --------------------------------

  const specSection = sectionMap.specification;

  const specificationsData = specSection
    ? {
        title: specSection.title?.main || "Specifications",

        description: specSection.title?.short || "",

        listing: Array.isArray(specsRes?.data || specsRes)
          ? (specsRes?.data || specsRes).map((category: any) => {
              const typeKey = category.type || "OTHER";

              const displayTitle =
                typeMap[typeKey] ||
                typeKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char: string) => char.toUpperCase());

              return {
                title: displayTitle,

                children: Array.isArray(category.list)
                  ? category.list.map((spec: any) => ({
                      title: spec.title || "",
                      short_description: spec.description || "",
                    }))
                  : [],
              };
            })
          : [],
      }
    : null;

  // --------------------------------
  // LOCATION
  // --------------------------------

  const locationSectionObj = locationSection;

  const locationData = locationSectionObj
    ? {
        title: locationSectionObj.title?.main || "Location",

        description: locationSectionObj.title?.short || "",

        desktop_file: getUploadUrl(
          locationSectionObj.files?.map_desktop_image || "",
        ),

        mobile_file: getUploadUrl(
          locationSectionObj.files?.map_mobile_image || "",
        ),

        iframe: locationSectionObj.iframe || undefined,

        location_data: {
          heading:
            locationSectionObj.description?.title || "Location Advantages",

          description: locationSectionObj.description?.heading || "",

          list: Array.isArray(locationRes?.data || locationRes)
            ? (locationRes?.data || locationRes).map((item: any) => ({
                icons: getUploadUrl(
                  item.websiteIcons?.files?.image ||
                    item.websiteIcon?.files?.image ||
                    item.files?.image ||
                    item.image ||
                    "",
                ),

                name: item.destination || "",

                time: item.duration || "",

                type: (item.type || "drive") as "walk" | "drive",
              }))
            : [],
        },
      }
    : null;

  // --------------------------------
  // GALLERY
  // --------------------------------

  const gallerySection = sectionMap.gallery;

  const galleryData = gallerySection
    ? {
        title: gallerySection.title?.main || "Gallery",

        description: gallerySection.title?.short || "",

        long_description: gallerySection.description?.short || "",

        gallery: Array.isArray(galleryRes?.data || galleryRes)
          ? (galleryRes?.data || galleryRes).map((item: any) => ({
              title: item.alt || "",

              desktop_file: getUploadUrl(
                item.files?.desktop_file || item.desktop_file || "",
              ),

              mobile_file: getUploadUrl(
                item.files?.mobile_file || item.mobile_file || "",
              ),
            }))
          : [],
      }
    : null;

  // --------------------------------
  // AMENITIES
  // --------------------------------

  const amenitiesSection = sectionMap.amenities;

  const amenitiesData = amenitiesSection
    ? {
        title: amenitiesSection.title?.main || "Amenities",

        description: amenitiesSection.title?.short || "",

        list: Array.isArray(amenitiesRes?.data || amenitiesRes)
          ? (amenitiesRes?.data || amenitiesRes).map((item: any) => ({
              title: item.title || item.amenities?.title || "",

              desktop_image: getUploadUrl(
                item.files?.image ||
                  item.image ||
                  item.amenities?.files?.image ||
                  "",
              ),

              mobile_image: getUploadUrl(
                item.files?.image ||
                  item.image ||
                  item.amenities?.files?.image ||
                  "",
              ),

              icon: getUploadUrl(item.amenities?.files?.image || ""),
            }))
          : [],
      }
    : null;

  // --------------------------------
  // FLOOR PLANS
  // --------------------------------

  const floorPlanSection = sectionMap?.floorPlan;

  let floorPlansData = null;

  if (floorPlanSection) {
    const floorPlanList = floorPlanRes?.data || floorPlanRes || [];

    const masterPlanItem = floorPlanList.find(
      (item: any) => item.type === "masterplan",
    );

    const floorPlansItems = floorPlanList.filter(
      (item: any) => item.type === "floorplan",
    );

    floorPlansData = {
      title: floorPlanSection.title?.main || "Master & Floor Plan",
      description: floorPlanSection.title?.short || "",
      planTypes: [
        {
          title: "Master Plan",
          id: "master-plan",
        },
        {
          title: "Floor Plan",
          id: "floor-plan",
        },
      ],
      masterPlan: masterPlanItem
        ? {
            id: masterPlanItem.id,
            title: masterPlanItem.title || "Master Plan",
            image: getUploadUrl(
              masterPlanItem.files?.desktop_image ||
                masterPlanItem.files?.mobile_image ||
                "",
            ),
          }
        : {},
      floorPlans: floorPlansItems.map((item: any) => ({
        id: item.id,
        title: item.title || "Floor Plan",
        image: getUploadUrl(
          item.files?.desktop_image || item.files?.mobile_image || "",
        ),
      })),
    };
  }

  return (
    <main className="project-detail">
      <Hero {...heroData} />

      <OverView data={overviewData} />

      {highlightsData && <Highlights data={highlightsData} />}

      {specificationsData && <Specifications data={specificationsData} />}

      {amenitiesData && <Amenities data={amenitiesData} />}

      {floorPlansData && <FloorAndMasterPlan data={floorPlansData} />}

      {locationData && <Location data={locationData} />}

      {galleryData && <Gallery data={galleryData} />}
    </main>
  );
}
