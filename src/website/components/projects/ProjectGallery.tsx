"use client";

import React, { useState } from "react";
import Image from "next/image";
import { blauerNue } from "@/src/app/fonts";
import { DownArrow } from "../common/SVGIcons";
import { categories } from "./projects";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { SlideImage } from "yet-another-react-lightbox";

const ProjectGallery = () => {
  const { openLightbox } = useLightbox();

  // Get all projects that have gallery images in their microGallery
  const projectsWithImages = categories
    .flatMap((cat) => cat.projects)
    .filter(
      (p) => p.microGallery?.gallery && p.microGallery.gallery.length > 0,
    );

  const [activeProjectId, setActiveProjectId] = useState(
    projectsWithImages[0]?.id || "",
  );

  if (projectsWithImages.length === 0) {
    return null;
  }

  const selectedProject =
    projectsWithImages.find((p) => p.id === activeProjectId) ||
    projectsWithImages[0];

  const displayMedia = selectedProject?.microGallery?.gallery || [];

  const mapSlide: SlideImage[] = displayMedia.map((item) => ({
    src: item.desktop_file,
    alt: item.title || "Gallery Image",
    thumbnail: item.desktop_file,
  }));

  return (
    <section className="pb-16 md:pb-24 bg-white relative overflow-hidden">
      <div className="app-container relative z-10">
        {/* Project Selector Dropdown */}
        <div className="lg:mb-20 mb-10 flex justify-center">
          <div className="relative w-full max-w-[250px]">
            <select
              value={activeProjectId}
              onChange={(e) => {
                setActiveProjectId(e.target.value);
              }}
              className={`${blauerNue.className} w-full appearance-none leading-[18px] bg-white border border-[#0F3C78] text-[#0F3C78] px-6 py-4 rounded-[5px] cursor-pointer focus:outline-none transition-all duration-300 text-[16px] capitalize tracking-[0.16px]`}
            >
              {projectsWithImages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none">
              <DownArrow />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {displayMedia.map((item, index) => (
            <div
              key={`${item.desktop_file}-${index}`}
              onClick={() => openLightbox(mapSlide, index)}
              className="relative group aspect-4/3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
            >
              <Image
                src={item.desktop_file}
                alt={item.title || `Gallery Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
