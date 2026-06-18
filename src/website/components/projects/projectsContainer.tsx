"use client";
import React, { useRef } from "react";
import { Category, Project } from "./projects";
import ProjectCard from "./projectCard";
import { useSlideY } from "../../hooks/useSlideY";
import { useReveal } from "../../hooks/useReveal";
import { agency } from "@/src/app/fonts";
import ProjectsFilters from "./ProjectsFilters";
import { useProjectFilters, ProjectStatusOption } from "../../hooks/useProjectFilters";
import { useProjectFilterOptions } from "../../hooks/useProjectFilterOptions";
import { useRouter, usePathname } from "next/navigation";

export default function ProjectsContainer({
  projectsList,
  category,
  statusOptions = [],
  initialPagination,
}: {
  projectsList: Project[];
  category: Category;
  statusOptions?: ProjectStatusOption[];
  initialPagination?: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLSpanElement | null>(null);
  const headerLine = useRef<HTMLDivElement | null>(null);

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredProjects,
    isFiltering,
    pagination,
  } = useProjectFilters(projectsList, {}, category.id, statusOptions, initialPagination);

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  const listRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentPage > 1 && listRef.current) {
      const offset = listRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useSlideY({ target: headerRef, direction: "up" });
  useReveal(headerLine, { direction: "left", delay: 1, duration: 2 });

  return (
    <>
      <div
        className="py-12 lg:py-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(51, 211, 238, 0.07) 0%, rgba(15, 60, 120, 0.07) 100%)",
        }}
        data-cursor="light"
      >
        <ProjectsFilters
          cities={useProjectFilterOptions().cities}
          budgets={useProjectFilterOptions().budgets}
          status={statusOptions.map((s: any) => s.name).filter(Boolean)}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <div ref={listRef} className="projects-listing pt-12 lg:pt-20">
          <div className="app-container">
            {filteredProjects.length > 0 ? (
              <>
                {isFiltering && (
                  <h4
                    className={`${agency.className} text-(--blue) text-2xl tracking-[0.5px] pb-14`}
                  >
                    We found {filteredProjects.length} {category.label} Projects
                  </h4>
                )}
                <div className="grid gap-8 lg:gap-16">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 pt-12 lg:pt-16">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
              <h3
                className={`${agency.className} text-(--blue) text-xl tracking-[0.5px]`}
              >
                No projects found matching your criteria.
              </h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
