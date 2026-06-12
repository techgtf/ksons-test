"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { gsap } from "../../utils/gsap";

type SectionHeaderProps = {
  tag: string;
  heading: string;
  className?: string;
  bulletType?: "dot" | "triangle"; // 👈 new prop
  bulletImage?: string; // 👈 for triangle image
};

export default function SectionHeader({
  tag,
  heading,
  className = "",
  bulletType = "dot", // 👈 default
  bulletImage,
}: SectionHeaderProps) {
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { y: -80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  return (
    <div
      ref={headingRef}
      className={`text-center text-[#0F3C78] px-2 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 lg:gap-4">
        {/* 👇 Bullet Switch */}
        {bulletType === "dot" ? (
          <span className="w-[10px] h-[10px] rounded-full bg-gradient-to-b from-[#2FD2ED] to-[#1C71E8]" />
        ) : (
          <Image
            src={bulletImage || "/images/default-bullet.png"}
            alt="bullet"
            height={16}
            width={16}
          />
        )}
        <p
          className={`${blauerNue.className} text-base font-normal capitalize`}
        >
          {tag}
        </p>
      </div>

      <h2
        className={`${agency.className} text-[28px] md:text-4xl mt-4 font-normal`}
      >
        {heading}
      </h2>
    </div>
  );
}
