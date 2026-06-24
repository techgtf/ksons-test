"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { agency, blauerNue } from "@/src/app/fonts";
import { useSlideY } from "../../hooks/useSlideY";
import { fetchPageData } from "../../utils/api";
import { formatDate } from "../../utils/dateFormat";
import WaterMark from "../common/WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

const PopularBlogItem = ({
  image,
  date,
  title,
  slug,
  mainLabel,
}: {
  image: string;
  date: string;
  title: string;
  slug: string;
  mainLabel?: string;
}) => {
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useSlideY({ target: cardRef, direction: "down", distance: -120 });
  return (
    <Link
      ref={cardRef}
      href={`/blogs/${slug}`}
      className="group block lg:py-10 py-6 border-b border-[#0f3c78]/8 cursor-pointer"
    >
      <div className="relative w-full aspect-16/10 lg:mb-6 mb-4 overflow-hidden rounded-[10px] bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110 ease-in-out"
        />
        {mainLabel && (
          <div className="absolute right-4 bottom-4 z-10">
            <WaterMark
              textColor="text-white"
              opacity="opacity-60"
              label={getDisplayLabel(mainLabel)}
            />
          </div>
        )}
      </div>
      <span
        className={`${blauerNue.className} text-[#0f3c78]/75 font-light text-base tracking-[0.5px] leading-[24px] inline-block mb-4`}
      >
        {date}
      </span>
      <p
        className={`${blauerNue.className} text-[#0f3c78] text-base font-light leading-[24px] tracking-[0.5px] line-clamp-2`}
      >
        {title}
      </p>
    </Link>
  );
};

const PopularBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const loadPopularBlogs = async () => {
      try {
        const blogsRes = await fetchPageData("website/blogs?isPopular=true");
        const blogsData = blogsRes?.data || [];
        const formatted = blogsData.map((blog: any) => ({
          image:
            blog?.files?.desktop_image || "/images/blogs/blog-fallback.jpg",
          mainLabel: blog?.files?.mainLabel,
          title: blog?.title,
          date: formatDate(blog?.dateAt),
          slug: blog?.slug,
        }));
        setBlogs(formatted.slice(0, 2));
      } catch (error) {
        console.error("Failed to load popular blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularBlogs();
  }, []);

  useSlideY({ target: headingRef, direction: "down", distance: -120 });

  if (loading) {
    return (
      <div className="py-2 animate-pulse">
        {/* Search Bar Placeholder */}
        <div className="relative lg:mb-10 mb-8 h-12 bg-gray-100 rounded-[8px]" />

        <h2
          className={`${agency.className} text-[24px] tracking-[-0.5px] leading-[32px] text-[#0f3c78] text-center lg:text-left`}
        >
          Popular Blogs
        </h2>
        <div className="flex flex-col">
          {[1, 2].map((i) => (
            <div key={i} className="lg:py-10 py-6 border-b border-[#0f3c78]/8">
              <div className="w-full aspect-16/10 bg-gray-100 rounded-[10px]" />
              <div className="h-4 bg-gray-100 rounded w-1/4 mt-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Search Bar */}
      <div className="relative lg:mb-10 mb-8">
        <input
          type="text"
          placeholder="SEARCH HERE"
          className={`w-full border border-[#0f3c78]/5 bg-[#F5F7FA] rounded-[8px] lg:px-6 px-4 lg:py-3.5 py-2 outline-none text-base tracking-[0.5px] leading-[24px] font-light ${blauerNue.className} text-[#0f3c78]/75 placeholder:text-[#0f3c78]/75`}
        />
        <FiSearch className="absolute right-8 top-1/2 -translate-y-1/2 text-[#183E60] text-[20px]" />
      </div>

      <h2
        ref={headingRef}
        className={`${agency.className} text-[24px] tracking-[-0.5px] leading-[32px] text-[#0f3c78] text-center lg:text-left`}
      >
        Popular Blogs
      </h2>

      <div className="flex flex-col">
        {blogs.map((blog, index) => (
          <PopularBlogItem key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default PopularBlogs;
