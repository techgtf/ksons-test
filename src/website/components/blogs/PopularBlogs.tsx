"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { agency, blauerNue } from "@/src/app/fonts";
import { useSlideY } from "../../hooks/useSlideY";
import { blogs as allBlogs } from "./blogs";

const PopularBlogItem = ({
  image,
  date,
  title,
  slug,
}: {
  image: string;
  date: string;
  title: string;
  slug: string;
}) => {
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useSlideY({ target: cardRef, direction: "down", distance: -120 });
  return (
    <Link
      ref={cardRef}
      href={`/blogs/${slug}`}
      className="group block lg:py-10 py-6 border-b border-[#0f3c78]/8 cursor-pointer"
    >
      <div className="relative w-full aspect-16/10 lg:mb-6 mb-4 overflow-hidden rounded-[10px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110 ease-in-out"
        />
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
  const [randomBlogs, setRandomBlogs] = useState<any[]>([]);

  useEffect(() => {
    // Pick 2 random blogs from the imported blogs list to avoid hydration mismatch
    const shuffled = [...allBlogs].sort(() => 0.5 - Math.random());
    setRandomBlogs(shuffled.slice(0, 2));
  }, []);

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useSlideY({ target: headingRef, direction: "down", distance: -120 });

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
        {randomBlogs.map((blog, index) => (
          <PopularBlogItem key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default PopularBlogs;
