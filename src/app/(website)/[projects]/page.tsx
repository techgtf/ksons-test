import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getCategoryBySlug,
} from "@/src/website/components/projects/projects";
import CommonBanner from "@/src/website/components/common/CommonBanner";
import ProjectsContainer from "@/src/website/components/projects/projectsContainer";
import FutureExtentions from "@/src/website/components/projects/FutureExtentions";
import { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    projects: slug,
  }));
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ projects: string }>;
}): Promise<Metadata> => {
  const { projects } = await params;
  const category = getCategoryBySlug(projects);

  if (!category) return {};

  return {
    title:
      category.seo?.title ||
      `K.Sons Group ${category.label} – Vrindavan Homes & Apartments`,
    description: category.seo?.description || `${category.label}`,
    keywords: category.seo?.keywords || `${category.label}`,
    alternates: {
      canonical:
        category.seo?.alternates?.canonical ||
        `https://ksonsgroup.com/${category.slug}`,
    },
  };
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ projects: string }>;
}) {
  const { projects } = await params;
  const category = getCategoryBySlug(projects);

  if (!category) notFound();

  const projectsList = category.projects;

  return (
    <main className="platter-page">
      <CommonBanner {...category?.bannerData} />
      <ProjectsContainer projectsList={projectsList} category={category} />
      <FutureExtentions hasFutureExtention={category.hasFutureExtention} />
    </main>
  );
}
