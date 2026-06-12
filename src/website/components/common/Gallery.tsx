"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { FiPlay } from "react-icons/fi";
import TabSwitcher from "./TabSwitcher";
import { useReveal } from "../../hooks/useReveal";

const CATEGORIES = [
  { id: "all", title: "All" },
  { id: "image", title: "Images" },
  { id: "video", title: "Videos" },
];

export interface GalleryItem {
  id: number;
  type: string;
  src: string;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {filteredItems.map((item) => (
            <Cards key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

type CardProp = {
  item: GalleryItem;
};

const Cards = ({ item }: CardProp) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useReveal(cardRef, { direction: "top" });

  return (
    <div
      ref={cardRef}
      className="relative group aspect-4/3 rounded-2xl overflow-hidden cursor-pointer"
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Premium Overlay with Blue Tint */}
      <div className="absolute inset-0 transition-all duration-500 flex items-center justify-center">
        {item.type === "video" && (
          <div>
            <Image
              src="/images/awards/play-button.png"
              alt="Play Button"
              width={50}
              height={50}
            />
          </div>
        )}
      </div>
    </div>
  );
};
