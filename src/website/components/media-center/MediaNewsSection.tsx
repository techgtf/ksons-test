"use client";

import React, { useRef, useState } from "react";
import { blauerNue, agency } from "@/src/app/fonts";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { useSlideY } from "../../hooks/useSlideY";

interface NewsItem {
  id: number;
  date: string;
  monthYear: string;
  title: string;
  description?: string;
  link?: string;
  image?: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 2,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 3,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 4,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 5,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 6,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 7,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
  {
    id: 8,
    date: "28",
    monthYear: "July/25",
    title: "Innovation that Strengthens Structure",
    description:
      "we are committed to creating developments that balance cultural.",
    image: "/images/blogs/blog-img.jpg",
  },
];

const MediaNewsSection = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 4;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-14 gap-y-8 lg:gap-y-10 px-4 lg:px-20 mb-10">
        {newsData.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default MediaNewsSection;

const NewsCard = ({ item }: { item: NewsItem }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useSlideY({ target: linkRef, direction: "down", distance: -120 });
  return (
    <Link ref={linkRef} key={item.id} href={item.link || "#"} className="group">
      <div className="flex gap-6 lg:gap-10 h-full">
        {/* Date Section */}
        <div
          className={`${blauerNue.className} flex flex-col items-center text-[#0F3C78] tracking-[0.5px] font-light pt-1 lg:pt-10 min-w-[70px] lg:leading-[24px]`}
        >
          <span className="lg:text-[24px]">{item.date}</span>
          <span className="text-[14px] lg:text-base">{item.monthYear}</span>
        </div>

        {/* Content & Image Section */}
        <div className="flex-1 flex gap-4 lg:gap-10 pb-6 lg:pb-10 border-b border-[#0F3C78]/10">
          <div className="flex-1 flex flex-col">
            <h3
              className={`${agency.className} text-[#0F3C78] text-[18px] lg:text-[20px] tracking-[-0.5px] lg:leading-[32px] mb-3 transition-colors line-clamp-2`}
            >
              {item.title}
            </h3>
            <p
              className={`${blauerNue.className} text-[#0F3C78] text-[14px] lg:text-[16px] tracking-[0.5px] lg:leading-[28px] leading-[20px] lg:mb-6 mb-4 font-light line-clamp-2`}
            >
              {item.description}
            </p>
            <div
              className={`${blauerNue.className} mt-auto flex items-center gap-2 text-[#0F3C78] text-[14px] tracking-[0.5px] font-light group-hover:opacity-70 transition-opacity`}
            >
              Know More
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path
                  d="M1 13L13 1M13 1H4M13 1V10"
                  stroke="#0F3C78"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Image Thumbnail */}
          <div className="relative w-[70px] h-[55px] lg:w-[100px] lg:h-[75px] shrink-0 overflow-hidden rounded-[4px] mt-1">
            <Image
              src={item.image || "/images/blogs/blog-img.jpg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
