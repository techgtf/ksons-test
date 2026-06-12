import Amenities from "@/src/website/components/projects/micro/Amenities";
import FloorAndMasterPlan from "@/src/website/components/projects/micro/FloorAndMasterPlan";
import Gallery from "@/src/website/components/projects/micro/Gallery";
import Hero from "@/src/website/components/projects/micro/Hero";
import Highlights from "@/src/website/components/projects/micro/Highlights";
import Location from "@/src/website/components/projects/micro/Location";
import OverView from "@/src/website/components/projects/micro/OverView";
import Specifications from "@/src/website/components/projects/micro/Specifications";
import {
  getAllSlugs,
  getCategoryBySlug,
} from "@/src/website/components/projects/projects";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const categories = getAllSlugs();

  return categories.flatMap((categorySlug) => {
    const category = getCategoryBySlug(categorySlug);

    if (!category) return [];

    return category.projects.map((project) => ({
      projects: categorySlug, // parent
      slug: project.slug, // child
    }));
  });
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ projects: string; slug: string }>;
}): Promise<Metadata> => {
  const { projects, slug } = await params;

  const category = getCategoryBySlug(projects);
  const project = category?.projects.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.description,
    keywords: project.seo?.keywords,
    alternates: {
      canonical:
        project.seo?.alternates?.canonical ||
        `https://ksonsgroup.com/${category?.slug}/${project.slug}`,
    },
  };
};

type Props = {
  params: {
    projects: string;
    slug: string;
  };
};

export default async function ProjectDetailPage({ params }: Props) {
  const { projects, slug } = await params;

  const category = getCategoryBySlug(projects);
  if (!category) notFound();

  const project = category.projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="project-detail">
      <Hero
        dekstop_file={project.desktop_file}
        mobile_file={project.mobile_file}
      />
      <OverView data={project} />
      <Highlights data={project.highlights} />
      <Specifications data={project.specifications} />
      <Amenities data={project.microAmenities} />
      <FloorAndMasterPlan data={project.floorAndMasterPlan} />
      <Location data={project.microLocation} />
      <Gallery data={project.microGallery} />
    </main>
  );
}
