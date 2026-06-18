"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import Pagination from "../common/Pagination";
import Link from "next/link";
import { useSlideY } from "../../hooks/useSlideY";
import { ScrollTrigger } from "../../utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";
import { fetchPageData } from "../../utils/api";
import { formatDate } from "../../utils/dateFormat";

interface BlogItemProps {
  files: {
    desktop_image: string;
    mobile_image: string;
  };
  title: string;
  description: string;
  date: string;
  slug: string;
}

const BlogItem: React.FC<BlogItemProps> = ({
  files,
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
      <div className="relative shrink-0 md:w-[153px] md:h-[118px] w-full h-[200px] overflow-hidden rounded-lg bg-gray-100">
        {window.innerWidth < 768 ? (
          <Image
            src={files?.mobile_image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110 ease-in-out md:hidden"
          />
        ) : (
          <Image
            src={files?.desktop_image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110 ease-in-out hidden md:block"
          />
        )}
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
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const blogsRes = await fetchPageData(
          `website/blogs?page=${currentPage}&limit=4`,
        );
        const blogsData = blogsRes?.data;
        const apiPagination = blogsRes?.pagination;

        if (apiPagination?.totalPages !== undefined) {
          setTotalPages(apiPagination.totalPages);
        }

        console.log(blogsRes, "blogsRes ");

        const formattedBlogs: BlogItemProps[] =
          blogsData?.map((blog: any) => ({
            files: {
              desktop_image: blog?.files?.desktop_image,
              mobile_image: blog?.files?.mobile_image,
            },
            title: blog?.title,
            description: blog?.description?.short,
            date: formatDate(blog?.dateAt),
            slug: blog?.slug,
          })) || [];
        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [currentPage]);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: headingRef, direction: "up", distance: -120 });

  useEffect(() => {
    // Refresh ScrollTrigger positions after page changes and content updates
    ScrollTrigger.refresh();
  }, [currentPage, blogs]);

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
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="pt-10">
        <h2
          className={`${agency.className} text-[24px] tracking-[-0.5px] leading-[32px] text-[#0f3c78] lg:mb-10 mb-6 text-center lg:text-left`}
        >
          Latest Blogs
        </h2>
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row lg:gap-10 gap-8 lg:py-10 py-6 border-b border-[#efefef]/80"
            >
              <div className="shrink-0 md:w-[153px] md:h-[118px] w-full h-[200px] bg-gray-200 rounded-lg"></div>
              <div className="flex flex-col justify-center flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pt-10 scroll-mt-24">
      <h2
        ref={headingRef}
        className={`${agency.className} text-[24px] tracking-[-0.5px] leading-[32px] text-[#0f3c78] lg:mb-10 mb-6 text-center lg:text-left`}
      >
        Latest Blogs
      </h2>
      <div className="flex flex-col">
        {blogs.map((blog) => (
          <BlogItem key={blog.slug} {...blog} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default LatestBlogs;
