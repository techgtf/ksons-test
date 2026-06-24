"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProjectFilterOptions } from "@/src/website/hooks/useProjectFilterOptions";
import { useProjectFilters } from "@/src/website/hooks/useProjectFilters";
import ProjectCard from "../projects/projectCard";
import { agency } from "@/src/app/fonts";
import ProjectsFilters from "../projects/ProjectsFilters";

interface LocationProjectContainerProps {
  location: string;
  initialProjects: any[];
  initialCities: string[];
  initialStatuses: any[];
  initialPagination?: any;
}

export default function LocationProjectContainer({
  location,
  initialProjects,
  initialCities,
  initialStatuses,
  initialPagination,
}: LocationProjectContainerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { budgets } = useProjectFilterOptions();

  // Find the matching city names from our filter options to ensure correct casing
  const locList = location
    ? location.split(",").map((l) => l.trim().toLowerCase())
    : [];
  const initialCitiesFilter = initialCities.filter((c) =>
    locList.includes(c.toLowerCase()),
  );

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredProjects,
    isFiltering,
    pagination,
  } = useProjectFilters(
    initialProjects,
    {
      cities: initialCitiesFilter.length > 0 ? initialCitiesFilter : [],
    },
    undefined,
    initialStatuses,
    initialPagination,
  );

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentPage > 1 && listRef.current) {
      const offset =
        listRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [currentPage]);

  // Update URL when cities filter changes
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filters.cities.length > 0) {
      params.set("location", filters.cities.join(","));
    } else {
      params.delete("location");
    }
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [filters.cities, pathname, router]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section data-cursor="light" className=" flex flex-col gap-y-14 ">
      <ProjectsFilters
        title={`Filter Projects`}
        cities={initialCities}
        budgets={budgets}
        status={initialStatuses.map((s: any) => s.name).filter(Boolean)}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        // showCities={false}
      />
      <div className="app-container">
        <div ref={listRef} className="projects-listing">
          {filters.cities.length > 0 ? (
            <>
              {filteredProjects.length > 0 && (
                <div className="mb-12">
                  <h2
                    className={`${agency.className} text-2xl  text-[#0F3C78] capitalize font-medium`}
                  >
                    We found {pagination?.total ?? filteredProjects.length}{" "}
                    projects in{" "}
                    <span className="capitalize">
                      {filters.cities.join(", ")}
                    </span>
                  </h2>
                </div>
              )}

              {filteredProjects.length > 0 ? (
                <>
                  <div className="grid gap-8 lg:gap-16">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id + 2} project={project} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-12 lg:pt-16">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-[#0F3C78]/20 text-[#0F3C78] disabled:opacity-40 disabled:pointer-events-none hover:bg-[#0F3C78] hover:text-white hover:border-[#0F3C78] transition-colors duration-300"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 19L8 12L15 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-full font-medium transition-colors duration-300 text-sm ${
                              currentPage === page
                                ? "bg-[#0F3C78] text-white shadow-md shadow-[#0F3C78]/20"
                                : "border border-[#0F3C78]/20 text-[#0F3C78] hover:bg-[#0F3C78]/5 hover:border-[#0F3C78]"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(currentPage + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-[#0F3C78]/20 text-[#0F3C78] disabled:opacity-40 disabled:pointer-events-none hover:bg-[#0F3C78] hover:text-white hover:border-[#0F3C78] transition-colors duration-300"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 5L16 12L9 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
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
