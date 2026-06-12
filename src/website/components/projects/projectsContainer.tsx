"use client";
import React, { useRef, useState, useMemo } from "react";
import { Category, Project } from "./projects";
import ProjectCard from "./projectCard";
import { useSlideY } from "../../hooks/useSlideY";
import { useReveal } from "../../hooks/useReveal";
import { agency, blauerNue } from "@/src/app/fonts";
import ProjectsFilters, { ProjectFiltersState } from "./ProjectsFilters";
import { useProjectFilters } from "../../hooks/useProjectFilters";
import { useProjectFilterOptions } from "../../hooks/useProjectFilterOptions";

export default function ProjectsContainer({
  projectsList,
  category,
}: {
  projectsList: Project[];
  category: Category;
}) {
  const headerRef = useRef<HTMLSpanElement | null>(null);
  const headerLine = useRef<HTMLDivElement | null>(null);

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredProjects,
    isFiltering,
  } = useProjectFilters(projectsList);

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
          status={useProjectFilterOptions().statuses}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* <div className="app-container">
          <div className="flex gap-5 items-center ">
            <span
              ref={headerRef}
              className={`${blauerNue.className} cat-name capitalize text-[#0F3C78] lg:text-[18px] lg:leading-[20px] lg:tracking-[0.5px] leading-[28px] tracking-[0.4px]`}
            >
              {category.label} Projects
            </span>
            <div ref={headerLine} className="flex-1 bg-[#0F3C78]/15 h-px" />
          </div>
        </div> */}

        <div className="projects-listing pt-12 lg:pt-20">
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
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
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
