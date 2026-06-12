"use client";

import Image from "next/image";
import { blauerNue, agency } from "@/src/app/fonts";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";

/* ================= TYPES ================= */

export type VMBlock = {
  title: string;
  description: string;
};

export type VisionMissionProps = {
  vision: VMBlock;
  mission: VMBlock;

  leftImage: string;
  dividerImage: string;
};

/* ================= COMPONENT ================= */

export default function VissionMission({
  vision,
  mission,
  leftImage,
  dividerImage,
}: VisionMissionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      // LEFT
      gsap.from(leftRef.current, {
        x: -120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // RIGHT
      gsap.from(rightRef.current, {
        x: 120,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-cursor="light"
      ref={sectionRef}
      className="lg:h-screen w-full bg-gradient-to-r from-[#FFFF] to-[#00DBFF66]/40 py-15 lg:py-24 overflow-x-hidden"
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-start lg:items-center justify-between relative">
        {/* LEFT IMAGE */}
        <div
          ref={leftRef}
          className="relative w-[40%] h-full flex-shrink-0 hidden lg:block"
        >
          <div className="relative w-[80%] h-full">
            <Image
              src={leftImage}
              alt="vision"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* CENTER DIVIDER */}
        <div className="h-full hidden lg:flex items-center justify-center ml-0 lg:ml-12">
          <Image
            src={dividerImage}
            alt="divider"
            width={80}
            height={100}
            className="object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div
          ref={rightRef}
          className="w-full lg:w-[40%] ml-0 lg:ml-auto space-y-4 lg:space-y-16"
        >
          {/* VISION */}
          <div>
            <h3
              className={`${agency.className} text-[28px] lg:text-[32px] text-[#1f4a7c] mb-3 lg:mb-4`}
            >
              {vision.title}
            </h3>
            <p
              className={`${blauerNue.className} lg:leading-[28px] tracking-[0.5px] text-[#3d5f86]`}
            >
              {vision.description}
            </p>
          </div>

          {/* MISSION */}
          <div className="ml-0 lg:-ml-12 mt-10 lg:mt-22">
            <h3
              className={`${agency.className} text-[28px] lg:text-[32px] text-[#1f4a7c] mb-3 lg:mb-4`}
            >
              {mission.title}
            </h3>
            <p
              className={`${blauerNue.className} lg:leading-[28px] tracking-[0.5px] text-[#3d5f86]`}
            >
              {mission.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
