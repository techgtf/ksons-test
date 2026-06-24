import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import CommonBanner from "@/src/website/components/common/CommonBanner";
import FutureExtentions from "@/src/website/components/projects/FutureExtentions";
import ProjectsContainer from "@/src/website/components/projects/projectsContainer";
import { fetchPageData } from "@/src/website/utils/api";
import { notFound } from "next/navigation";
export async function generateStaticParams() {
  const platter = await fetchPageData("website/platter");
  const platterData = platter?.data || [];
  return platterData.map((p: any) => ({
    projects: p.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ projects: string }> | { projects: string };
}) {
  const resolvedParams = "then" in params ? await params : params;
  const slug = resolvedParams.projects;

  const platter = await fetchPageData("website/platter");
  const platterData = platter?.data || [];

  const activePlatter = platterData.find(
    (p: any) => p.slug?.toLowerCase() === slug.toLowerCase(),
  );

  if (!activePlatter) return {};

  const seo = activePlatter.seoTags;

  return {
    title: seo?.meta_title || `${activePlatter.name} Projects`,
    description: seo?.meta_description || "projects",
    keywords: seo?.meta_keyword,

    alternates: {
      canonical: `${BASE_FRONTEND}${slug}`,
    },

    openGraph: {
      type: "website",
      url: `${BASE_FRONTEND}${slug}`,
      siteName: "KSons Group",
      title: seo?.meta_title || `${activePlatter.name} Projects`,
      description: seo?.meta_description || "projects",
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
      title: seo?.meta_title || `${activePlatter.name} Projects`,
      description: seo?.meta_description || "projects",
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
}

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ projects: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { projects } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 20;

  // 1. Get platters first
  // const platterRes = await fetchPageData("website/platter");
  const [platterRes, projectStatusRes] = await Promise.all([
    fetchPageData(`website/platter`),
    fetchPageData(`website/projectstatus`),
  ]);
  const platterData = platterRes?.data || [];

  const activePlatter = platterData.find(
    (p: any) => p.slug?.toLowerCase() === projects.toLowerCase(),
  );

  if (!activePlatter) notFound();

  // 2. Fetch only relevant projects + statuses
  const projectRes = await fetchPageData(
    `website/project?platterId=${activePlatter.id}&limit=${limit}&page=${currentPage}`,
  );

  const projectsData = projectRes?.data || [];
  const statusData = projectStatusRes?.data || projectStatusRes || [];

  const paginationData = projectRes?.pagination || {
    total: projectsData.length,
    page: currentPage,
    limit: limit,
    totalPages: Math.ceil(projectsData.length / limit),
    hasNextPage: false,
    hasPrevPage: false,
  };

  // 3. Status mapping
  const statusMap: Record<string, string> = {};

  if (Array.isArray(statusData)) {
    statusData.forEach((s: any) => {
      statusMap[s.id] = s.name;
    });
  }

  const category = {
    id: activePlatter.id,
    slug: activePlatter.slug,
    label: activePlatter.name,
    hasFutureExtention: true,

    bannerData: {
      tag: `${activePlatter.name} projects`,
      heading: activePlatter.title?.main || "",
      description: activePlatter.title?.sub || "",
      bulletIcon: "/images/about/about-bullet.png",

      files: {
        desktop_file:
          activePlatter.files?.desktop_image ||
          activePlatter.files?.featured_desktop_file ||
          "",

        mobile_file:
          activePlatter.files?.mobile_image ||
          activePlatter.files?.featured_mobile_file ||
          "",

        featured_desktop_file:
          activePlatter.files?.featured_desktop_file ||
          activePlatter.files?.desktop_image ||
          "",

        featured_mobile_file:
          activePlatter.files?.featured_mobile_file ||
          activePlatter.files?.mobile_image ||
          "",

        mainLabel: activePlatter.files?.mainLabel || "",
      },

      headingArea: "lg:w-[850px]",
    },
  };

  const projectsList = projectsData
    .filter((p: any) => p.status === true)
    .map((p: any) => {
      const typologyName = p.typology?.name || "";

      const subTypologies =
        p.projectSubTypology
          ?.map((st: any) => st.subTypology?.name?.trim())
          .filter(Boolean) || [];

      // const combinedTypology = [typologyName, ...subTypologies].filter(Boolean).join(", ") || "";
      const combinedTypology =
        subTypologies.length > 1
          ? `${subTypologies.slice(0, -1).join(", ")} & ${subTypologies.at(-1)}`
          : subTypologies[0] || "";

      return {
        id: p.id,
        slug: p.slug,
        title: p.projectName,
        description: p.shortDescription || "",
        location: p.location || p.city?.name || "",
        year: p.createdAt
          ? new Date(p.createdAt).getFullYear()
          : new Date().getFullYear(),
        price: p.price || 0,

        area: p.starting_size
          ? `${p.starting_size} ${p.size_unit || "Acres"}`
          : "",

        desktop_file: p.files?.desktop_image || "",
        mobile_file: p.files?.mobile_image || "",
        featuredLabel: p.files?.featuredLabel || "",

        featured_img:
          p.files?.featured_desktop_file || p.files?.desktop_image || "",

        featured: p.is_featured || false,

        typology: combinedTypology,

        status: statusMap[p.projectStatusId] || "Ongoing",
        seq: Number(p.seq) || 0,
      };
    });

  return (
    <main className="platter-page">
      <CommonBanner {...category.bannerData} />

      <ProjectsContainer
        projectsList={projectsList}
        category={category as any}
        statusOptions={statusData}
        initialPagination={paginationData}
      />

      <FutureExtentions hasFutureExtention={category.hasFutureExtention} />
    </main>
  );
}
