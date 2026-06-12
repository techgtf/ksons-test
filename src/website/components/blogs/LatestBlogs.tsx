"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import Pagination from "../common/Pagination";
import Link from "next/link";
import { blogs } from "./blogs";
import { useSlideY } from "../../hooks/useSlideY";
import { ScrollTrigger } from "../../utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";

interface BlogItemProps {
  image: string;
  title: string;
  description: string;
  date: string;
  slug: string;
}

const BlogItem: React.FC<BlogItemProps> = ({
  image,
  title,
  description,
  date,
  slug,
}) => {
  const blogRef = useRef<HTMLAnchorElement | null>(null);

  useSlideY({ target: blogRef, direction: "down", distance: -120 });

  return (
    <Link
      ref={blogRef}
      href={`/blogs/${slug}`}
      className="group flex flex-col md:flex-row lg:gap-10 gap-8 lg:py-10 py-6 border-b border-[#efefef]/80 cursor-pointer"
    >
      <div className="relative shrink-0 md:w-[153px] md:h-[118px] w-full h-[200px] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110 ease-in-out"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3
          className={`${agency.className} text-[24px] tracking-[-0.5px] lg:leading-[32px] text-[#0f3c78] mb-4`}
        >
          {title}
        </h3>
        <p
          className={`${blauerNue.className} text-[#0f3c78] text-base font-light leading-[24px] tracking-[0.5px] mb-4 line-clamp-2`}
        >
          {description}
        </p>
        <span
          className={`${blauerNue.className} text-[#0f3c78]/75 font-light text-base tracking-[0.5px] leading-[24px]`}
        >
          {date}
        </span>
      </div>
    </Link>
  );
};

const LatestBlogs = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const blogsPerPage = 4;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: headingRef, direction: "up", distance: -120 });

  useEffect(() => {
    // Refresh ScrollTrigger positions after page changes and content updates
    ScrollTrigger.refresh();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (lenisInstance && containerRef.current) {
      // Smooth scroll using Lenis to account for sticky/fixed headers nicely
      lenisInstance.scrollTo(containerRef.current, {
        offset: -96,
        duration: 1.2,
      });
    } else {
      // Fallback scroll to container top
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const displayedBlogs = blogs.slice(startIndex, endIndex);

  return (
    <div ref={containerRef} className="pt-10 scroll-mt-24">
      <h2
        ref={headingRef}
        className={`${agency.className} text-[24px] tracking-[-0.5px] leading-[32px] text-[#0f3c78] lg:mb-10 mb-6 text-center lg:text-left`}
      >
        Latest Blogs
      </h2>
      <div className="flex flex-col">
        {displayedBlogs.map((blog) => (
          <BlogItem key={blog.slug} {...blog} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LatestBlogs;
