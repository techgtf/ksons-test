"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import TabSwitcher from "./TabSwitcher";
import { useReveal } from "../../hooks/useReveal";
import { blauerNue } from "@/src/app/fonts";

const CATEGORIES = [
  { id: "all", title: "All" },
  { id: "image", title: "Images" },
  { id: "video", title: "Videos" },
];

export interface GalleryItem {
  id: number;
  type: string;
  src?: string;
  files?: {
    mobile_file: string;
    desktop_file: string;
  };
  title: string;
}

type Props = {
  galleryItems: GalleryItem[];
};

const Gallery = ({ galleryItems }: Props) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "all" || item.type === activeCategory,
  );

  return (
    <section className="pb-16 md:pb-24 bg-white relative overflow-hidden">
      <div className="app-container relative z-10">
        {/* Toggle Buttons */}
        <TabSwitcher
          tabs={CATEGORIES}
          activeTab={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Gallery Grid: 3 Desktop, 2 Tab, 1 Mobile */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {filteredItems.map((item) => (
              <Cards key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24">
            <p className={`${blauerNue.className} text-[#0F3C78]/60 text-[16px] md:text-[18px]`}>
              No {activeCategory === "all" ? "images or videos" : activeCategory === "image" ? "images" : "videos"} available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

const Cards = ({ item }: { item: GalleryItem }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useReveal(cardRef, { direction: "top" });

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative group aspect-4/3 rounded-2xl overflow-hidden ${item?.type == "video" && "cursor-pointer"}`}
    >
      {item.type == "image" ? (
        typeof window !== "undefined" && window.innerWidth < 768 ? (
          item?.files?.mobile_file ? (
            <Image
              src={item.files.mobile_file}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : null
        ) : item?.files?.desktop_file ? (
          <Image
            src={item.files.desktop_file}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : null
      ) : typeof window !== "undefined" && window.innerWidth < 768 ? (
        item?.files?.mobile_file ? (
          <video
            ref={videoRef}
            src={item?.files?.mobile_file}
            controls
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={item?.files?.mobile_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null
      ) : item?.files?.desktop_file ? (
        <video
          ref={videoRef}
          src={item?.files?.desktop_file}
          controls
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={item?.files?.desktop_file} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}
      {/* play button */}
      {item.type === "video" && !isPlaying && (
        <div
          onClick={handlePlayClick}
          className="absolute inset-0 transition-all duration-500 flex items-center justify-center bg-black/10 hover:bg-black/30 z-10"
        >
          <div>
            <Image
              src="/images/awards/play-button.png"
              alt="Play Button"
              width={50}
              height={50}
            />
          </div>
        </div>
      )}
    </div>
  );
};
