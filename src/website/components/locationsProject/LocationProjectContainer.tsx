"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "../projects/projects";
import { useProjectFilterOptions } from "@/src/website/hooks/useProjectFilterOptions";
import { useProjectFilters } from "@/src/website/hooks/useProjectFilters";
import ProjectCard from "../projects/projectCard";
import { agency } from "@/src/app/fonts";
import ProjectsFilters from "../projects/ProjectsFilters";

export default function LocationProjectContainer({ loc }: { loc: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Get all projects across all categories
  const allProjects = categories.flatMap((cat) =>
    cat.projects.map((proj) => ({
      ...proj,
      categorySlug: cat.slug,
    })),
  );

  const { cities, budgets, statuses } = useProjectFilterOptions();

  // Find the matching city names from our filter options to ensure correct casing
  const locList = loc ? loc.split(",").map((l) => l.trim().toLowerCase()) : [];
  const initialCities = cities.filter((c) => locList.includes(c.toLowerCase()));

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredProjects,
    isFiltering,
  } = useProjectFilters(allProjects, {
    cities: initialCities.length > 0 ? initialCities : [],
  });

  // Update URL when cities filter changes
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filters.cities.length > 0) {
      params.set("loc", filters.cities.join(","));
    } else {
      params.delete("loc");
    }
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [filters.cities, pathname, router]);

  return (
    <section
      data-cursor="light"
      className="py-12 lg:py-20 flex flex-col gap-y-14"
    >
      <ProjectsFilters
        title={`Location Preferences`}
        cities={cities}
        budgets={budgets}
        status={statuses}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      <div className="app-container">
        <div className="projects-listing">
          {filters.cities.length > 0 ? (
            <>
              {filteredProjects.length > 0 && (
                <div className="mb-12">
                  <h2
                    className={`${agency.className} text-2xl  text-[#0F3C78] capitalize font-medium`}
                  >
                    We found {filteredProjects.length} projects in{" "}
                    <span className="capitalize">
                      {filters.cities.join(", ")}
                    </span>
                  </h2>
                </div>
              )}

              {filteredProjects.length > 0 ? (
                <div className="grid gap-8 lg:gap-16">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id + 2} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className={`${agency.className} text-[#0F3C78] text-2xl`}>
                    No projects found for the selected locations.
                  </h3>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 px-4 border-2 border-dashed border-[#0F3C78]/10 rounded-3xl bg-white/30 backdrop-blur-sm">
              <h3 className={`${agency.className} text-[#0F3C78] text-3xl`}>
                Please select one or more locations to view available projects.
              </h3>
              <p className="mt-4 text-[#0F3C78]/60 font-light">
                Use the filters above to explore projects by city, budget, and
                status.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
