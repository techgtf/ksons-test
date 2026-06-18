"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import CommonBtn from "../common/CommonBtn";
import MicroHeader from "../projects/micro/MicroHeader";
import Link from "next/link";

/* ================= TYPES ================= */

export type BlogItem = {
  date: string;
  title: string;
  description: string;
  slug: string;
};

export type BlogsProps = {
  tag: string;
  heading: string;
  backgroundImage: string;

  blogs: BlogItem[];
  exploreText: string;
  exploreIcon: string;
};

/* ================= COMPONENT ================= */

export default function Blogs({
  tag,
  heading,
  backgroundImage,
  blogs,
  exploreText,
  exploreIcon,
}: BlogsProps) {
  if (!blogs) return null;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    registerGSAP();
    if (!headingRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".blog-card");
      if (!cards) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );

      tl.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.4",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={sectionRef}
      className="h-full relative px-6 overflow-hidden flex flex-col items-center text-center py-16"
    >
      {/* BACKGROUND */}
      <Image
        src={backgroundImage}
        alt="background"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      {/* Heading */}
      <div ref={headingRef} className="text-center text-white">
        <MicroHeader
          title={tag}
          description={heading}
          titleColor="white"
          descriptionColor="white"
        />
      </div>

      {/* Blog Cards */}
      <div
        ref={cardsRef}
        className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-0 md:px-26"
      >
        {blogs.slice(0, 3).map((blog, i) => (
          <div
            key={i}
            className="blog-card relative rounded-[22px] px-8 py-13 text-white bg-[#d3d3d3]/50 backdrop-blur-[2.5px] flex flex-col items-center text-center"
          >
            {/* Date */}
            <div
              className={`${blauerNue.className} border border-white/60 rounded-full px-5 py-1 text-[14px] mb-6 font-bold`}
            >
              {blog.date}
            </div>

            {/* Title */}
            <h3
              className={`${agency.className} text-2xl lg:mb-10 font-normal text-[22px] line-clamp-2`}
            >
              {blog.title}
            </h3>

            {/* Image */}
            <div className="mb-4 lg:mb-10 mt-4">
              <Image
                src={"/images/home/blog-card-img.png"}
                alt="blog"
                width={140}
                height={140}
                className="mix-blend-multiply brightness-70"
              />
            </div>

            <p
              className={`${blauerNue.className} text-[15px] lg:leading-[24px] mb-6 lg:mb-10 mt-2 font-light tracking-[0.5px] line-clamp-2`}
            >
              {blog.description}
            </p>

            <Link
              href={`/blogs/${blog.slug}`}
              className={`${blauerNue.className} flex items-center gap-2 border-b border-white pb-0.5 text-[14px] font-normal tracking-[0.5px]`}
            >
              Read More
              <span>
                <Image
                  src={"/images/home/blog-card-arrow.png"}
                  alt="arrow"
                  width={10}
                  height={10}
                />
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Explore Button */}
      <CommonBtn
        href={`/blogs`}
        variant="white"
        rightIcon={
          <Image src={exploreIcon} alt="arrow" width={10} height={10} />
        }
      >
        {" "}
        {exploreText}
      </CommonBtn>

      {/* <button
                className={`${blauerNue.className} mt-16 px-6 py-3 text-sm text-[#0F3C78] font-normal rounded-[100px] tracking-[1.2px] flex items-center bg-white cursor-pointer transition hover:opacity-90`}
                style={{
                    boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                }}
            >
                {exploreText}
                <span className="inline-block ml-3">
                    <Image
                        src={exploreIcon}
                        alt="arrow"
                        width={10}
                        height={10}
                    />
                </span>
            </button> */}
    </div>
  );
}
