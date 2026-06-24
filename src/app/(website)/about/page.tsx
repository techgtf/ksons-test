import dynamic from "next/dynamic";
import Banner, {
  AboutBannerProps,
} from "@/src/website/components/about/Banner";
import BrandMetrics, {
  BrandMetricsProps,
} from "@/src/website/components/about/BrandMetrics";

import { TeamProps } from "@/src/website/components/about/Team";
import { TimelineProps } from "@/src/website/components/about/Timeline";
import { VisionMissionProps } from "@/src/website/components/about/VisionMission";
import Overview, {
  OverViewProps,
} from "@/src/website/components/about/Overview";

import Values, { OurValues } from "@/src/website/components/about/Values";
const VissionMission = dynamic(
  () => import("@/src/website/components/about/VisionMission"),
);
const TeamTimelineParent = dynamic(
  () => import("@/src/website/components/about/TeamTimelineParent"),
);
import { Metadata } from "next";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import { fetchPageData } from "@/src/website/utils/api";
import { cache } from "react";

// In Next.js App Router, you can use React's cache() to deduplicate requests:
// This ensures the request is only executed once per render cycle.
const getAboutPageData = cache(async () => {
  return fetchPageData("website/page/about");
});

export const generateMetadata = async (): Promise<Metadata> => {
  const about = await getAboutPageData();
  if (!about) {
    return {
      title: "About Us",
    };
  }
  return {
    title: about?.data?.seoTags?.meta_title,
    description: about?.data?.seoTags?.meta_description,
    keywords: about?.data?.seoTags?.meta_keywords,
    alternates: {
      canonical: `${BASE_FRONTEND}/about`,
    },
    openGraph: {
      type: "website",
      url: `${BASE_FRONTEND}/about`,
      siteName: "KSons Group",
      title: about?.data?.seoTags?.meta_title,
      description: about?.data?.seoTags?.meta_description,
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
      title: about?.data?.seoTags?.meta_title,
      description: about?.data?.seoTags?.meta_description,
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
};

export default async function AboutUs() {
  const pageRes = await getAboutPageData();
  const pageData = pageRes?.data;
  const bannerData: AboutBannerProps = {
    tag: "About",
    heading: pageData?.title?.heading,
    subtext: pageData?.title?.sub_heading,

    bulletImage: "/images/about/about-bullet.png",
    bannerImage: pageData?.files?.desktop_file,
    mainLabel: pageData?.files?.mainLabel || "",
    triangleImage: "/images/about/banner-triangle.png",
  };

  const OverView: OverViewProps = {
    descriptions: [
      {
        pera: pageData?.title?.description,
      },
    ],
    Icons: "/images/about/about-page-banner-bottom.png",
  };

  const [
    brandMetricsDataRep,
    visionMissionResponse,
    leadershipHeader,
    leadershipList,
    timelineResponse,
    ourVauesRes,
  ] = await Promise.all([
    fetchPageData("website/page-section/about_brand_metrics"),
    fetchPageData("website/page-section/our_vison_and_mission"),
    fetchPageData("website/page-section/about_leadership"),
    fetchPageData("website/leaderships"),
    fetchPageData("website/timelines"),
    fetchPageData("website/page-section/about_our_value"),
  ]);

  const metricsListTitle = brandMetricsDataRep?.data?.[0]?.title?.main || "";
  const metricsListSubTitle = brandMetricsDataRep?.data?.[0]?.title?.sub || "";
  const metricsList = brandMetricsDataRep?.data?.[0]?.list || [];

  const brandMetricsData: BrandMetricsProps = {
    tag: metricsListTitle,
    heading: metricsListSubTitle,

    leftTitle: metricsList[0]?.title || "",
    rightTitle: metricsList[1]?.title || "",

    bulletImage: "/images/about/about-bullet.png",

    leftLineImage: "/images/about/left-connecting-line.png",
    rightLineImage: "/images/about/right-connecting-line.png",

    leftData:
      metricsList[0]?.items?.map((item: any) => ({
        value: item.number,
        label: item.text,
      })) || [],

    rightData:
      metricsList[1]?.items?.map((item: any) => ({
        value: item.number,
        label: item.text,
      })) || [],
  };

  const visionAndMissionSection = visionMissionResponse?.data?.[0];
  const visionMissionData: VisionMissionProps = {
    leftImage: visionAndMissionSection?.files?.desktop_image || "here",
    dividerImage: "/images/about/divider-line.png",
    vision: {
      title: visionAndMissionSection?.title?.[0]?.heading || "",
      description: visionAndMissionSection?.title?.[0]?.description || "",
    },
    mission: {
      title: visionAndMissionSection?.title?.[1]?.heading || "",
      description: visionAndMissionSection?.title?.[1]?.description || "",
    },
  };

  const leadershipHeaderData = leadershipHeader?.data?.[0];

  const members =
    leadershipList?.data?.map((item: any) => ({
      name: item.name || "",
      role: item.designation || "",
      image: item.files?.image || "",
      description: item.description || "",
    })) || [];
  const teamData: TeamProps = {
    tag: leadershipHeaderData?.title?.main || "",
    heading: leadershipHeaderData?.title?.sub || "",
    bulletImage: "/images/about/about-bullet.png",

    backgroundImage: "/images/about/way.png",
    glowImage: "/images/about/glow.png",
    triangleImage: "/images/about/team-triangle.png",
    arrowImage: "/images/about/team-arrow.png",

    members,
  };

  const timelineData: TimelineProps = {
    markerImage: "/images/about/active-timeline-triangle.png",
    ranges:
      timelineResponse?.data?.map((item: any) => ({
        title: item.title || "",

        range: item.duration || "",

        description: item.sub_title || "",

        years:
          item.list?.map((yearItem: any) => ({
            year: yearItem.year || "",
            text: yearItem.title || "",
          })) || [],
      })) || [],
  };

  const ourVauesData = ourVauesRes?.data?.[0];

  const ourValuesData: OurValues = {
    title: ourVauesData?.title?.main,
    description: ourVauesData?.title?.sub,
    data:
      ourVauesData?.list?.map(
        (item: { heading?: string; description?: string }, index: number) => ({
          id: index + 1,
          title: item.heading || "",
          description: item.description || "",
        }),
      ) || [],
    bgImage:
      ourVauesData?.files?.desktop_image || "/images/about/values-center.png",
  };

  return (
    <div className="py-10 lg:py-20">
      <Banner {...bannerData} />
      {OverView && <Overview {...OverView} />}
      {brandMetricsData && <BrandMetrics {...brandMetricsData} />}
      {visionMissionData && <VissionMission {...visionMissionData} />}
      {teamData && timelineData && (
        <TeamTimelineParent teamData={teamData} timelineData={timelineData} />
      )}
      {ourValuesData && <Values {...ourValuesData} />}
    </div>
  );
}
