"use client";

import React from "react";
import DektopHero from "./DesktopHero";
import HeroMobile from "./HeroMobile";
import { useWindowWidth } from "@/src/website/hooks/useWindowWidth";

export type FileType = {
  id: number;
  desktop_file: string;
  mobile_file: string;
};

export interface HomeHeroProps {
  tagLine: string;
  logo?: string;
  files: FileType[];
}

export default function HeroContainer() {
  const { isMobile, mounted } = useWindowWidth();

  const data: HomeHeroProps = {
    tagLine: "Where Vision Is Built to Last.",
    logo: "/images/header/logo-no-line.svg",
    files: [
      {
        id: 1,
        desktop_file: "/images/home/banner/",
        mobile_file: "/images/home/banner/mobile/M",
      },
      {
        id: 2,
        desktop_file: "/images/home/banner/",
        mobile_file: "/images/home/banner/mobile/M",
      },
      {
        id: 3,
        desktop_file: "/images/home/banner/",
        mobile_file: "/images/home/banner/mobile/M",
      },
    ],
  };

  if (!mounted) {
    return (
      <div className="min-h-[100vh] lg:min-h-screen animate-pulse bg-gray-200 flex items-center px-8">
        <div className="left space-y-4">
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
          <div className="h-10 w-64 bg-gray-300 rounded"></div>
          <div className="h-10 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] lg:min-h-screen">
      {mounted ? (
        isMobile ? (
          <HeroMobile
            tagLine={data.tagLine}
            logo={data.logo}
            files={data.files}
          />
        ) : (
          <DektopHero
            tagLine={data.tagLine}
            logo={data.logo}
            files={data.files}
          />
        )
      ) : null}
    </div>
  );
}
