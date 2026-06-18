"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { DownArrow } from "../common/SVGIcons";
import { BASE_WEBSITE } from "@/config";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { SlideImage } from "yet-another-react-lightbox";

interface ProjectItem {
  id: string;
  projectName: string;
  slug: string;
}

interface ProjectGalleryProps {
  projects: ProjectItem[];
}

interface GalleryMediaItem {
  id: string;
  projectId: string;
  files: {
    mobile_file: string;
    desktop_file: string;
  };
  alt: string;
  status: boolean;
  seq: number;
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const VideoGalleryItem = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        controls={isPlaying}
        muted
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
        >
          <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white drop-shadow-lg transition-transform duration-300 hover:scale-110">
            <svg
              className="w-8 h-8 fill-current translate-x-0.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectGallery = ({ projects = [] }: ProjectGalleryProps) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    projects[0]?.id || "",
  );
  const [mediaItems, setMediaItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { openLightbox } = useLightbox();

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    if (!activeProjectId) return;
    let isMounted = true;
    async function fetchGallery() {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_WEBSITE}website/project/${activeProjectId}/gallery`,
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            const rawData = json.data || json || [];
            // Filter active gallery items and sort them by sequence (seq)
            const items = rawData.filter((item: any) => item.status === true);
            items.sort(
              (a: any, b: any) => (Number(a.seq) || 0) - (Number(b.seq) || 0),
            );
            setMediaItems(items);
          }
        }
      } catch (err) {
        console.error("Error fetching project gallery:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchGallery();
    return () => {
      isMounted = false;
    };
  }, [activeProjectId]);

  const mapSlide: SlideImage[] = mediaItems.map((item) => {
    const fileUrl = item.files?.desktop_file || item.files?.mobile_file || "";
    return {
      src: fileUrl,
      alt: item.alt || "Project Gallery Image",
      thumbnail: fileUrl,
    };
  });

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
              {projects.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.projectName}
                </option>
              ))}
            </select>
            <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none">
              <DownArrow />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <p
              className={`${blauerNue.className} text-[#0F3C78]/60 text-[16px]`}
            >
              No gallery items available for this project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {mediaItems.map((item, index) => {
              const fileUrl =
                item.files?.desktop_file || item.files?.mobile_file || "";
              const isVideo = isVideoUrl(fileUrl);
              return (
                <div
                  key={item.id}
                  className="relative group aspect-4/3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-sm hover:shadow-md border border-gray-100"
                >
                  {isVideo ? (
                    <VideoGalleryItem src={fileUrl} />
                  ) : (
                    <picture onClick={() => openLightbox(mapSlide, index)}>
                      <source
                        media="(max-width: 768px)"
                        srcSet={item.files?.mobile_file || fileUrl}
                      />
                      <Image
                        src={fileUrl}
                        alt={item.alt || "Project Gallery Image"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    </picture>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;
