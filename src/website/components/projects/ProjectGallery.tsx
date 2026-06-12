"use client";

import React, { useState } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { DownArrow } from "../common/SVGIcons";

interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  title: string;
}

interface ProjectData {
  id: string;
  title: string;
  media: MediaItem[];
}

const PROJECTS_DATA: ProjectData[] = [
  {
    id: "radha-gulmohar",
    title: "Shri Radha Gulmohar",
    media: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        title: "Main Entrance",
      },
      {
        id: 2,
        type: "video",
        src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
        title: "Living Space Tour",
      },
      {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800",
        title: "Garden View",
      },
    ],
  },
  {
    id: "hilltop-villa",
    title: "Hilltop Villa",
    media: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        title: "Exterior View",
      },
      {
        id: 2,
        type: "image",
        src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
        title: "Infinity Pool",
      },
      {
        id: 3,
        type: "video",
        src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
        title: "Aerial Footage",
      },
    ],
  },
  {
    id: "commercial-hub",
    title: "The Pivot Hub",
    media: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        title: "Facade Design",
      },
      {
        id: 2,
        type: "video",
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        title: "Office Interiors",
      },
      {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
        title: "Conference Room",
      },
    ],
  },
];

const ProjectGallery = () => {
  const [activeProjectId, setActiveProjectId] = useState(PROJECTS_DATA[0].id);

  const selectedProject = PROJECTS_DATA.find((p) => p.id === activeProjectId);

  const projectTabs = PROJECTS_DATA.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  const displayMedia = selectedProject?.media || [];

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
              {projectTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.title}
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
          {displayMedia.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-4/3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/awards/play-button.png"
                    alt="Play Button"
                    width={60}
                    height={60}
                    className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
