"use client";
import DektopHero from "./DesktopHero";
import HeroMobile from "./HeroMobile";
import { useWindowWidth } from "@/src/website/hooks/useWindowWidth";

export type FileType = {
  id: string | number;
  desktop_file: string;
  mobile_file: string;
};

export interface HeroBasicProps {
  alt: string;
  tagLine: string;
  logo?: string;
  thumbnails: {
    desktop_file: string;
    mobile_file: string;
  };
}

export interface HomeHeroProps {
  files: FileType[];
  basicData: HeroBasicProps;
}

export default function HeroContainer({
  basicData,
  files,
}: {
  basicData: HeroBasicProps;
  files?: FileType[];
}) {
  const { isMobile, mounted } = useWindowWidth();

  const fallbackFiles: FileType[] = [
    {
      id: 1,
      desktop_file: "/images/home/banner/1.mp4",
      mobile_file: "/images/home/banner/mobile/M1.mp4",
    },
    {
      id: 2,
      desktop_file: "/images/home/banner/2.mp4",
      mobile_file: "/images/home/banner/mobile/M2.mp4",
    },
    {
      id: 3,
      desktop_file: "/images/home/banner/3.mp4",
      mobile_file: "/images/home/banner/mobile/M3.mp4",
    },
  ];

  const data: HomeHeroProps = {
    basicData: basicData || {
      tagLine: "Where Vision Is Built to Last.",
      logo: "/images/header/logo-no-line.svg",
      alt: "",
      thumbnails: {
        desktop_file: "",
        mobile_file: "",
      },
    },

    files: files && files.length > 0 ? files : fallbackFiles,
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
            tagLine={data.basicData.tagLine}
            logo={data.basicData.logo}
            files={data.files}
            thumbnails={data.basicData.thumbnails.mobile_file}
          />
        ) : (
          <DektopHero
            tagLine={data.basicData.tagLine}
            logo={data.basicData.logo}
            files={data.files}
            thumbnails={data.basicData.thumbnails.desktop_file}
          />
        )
      ) : null}
    </div>
  );
}
