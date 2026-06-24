"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import SectionHeader from "../common/SectionHeader";
import MicroHeader from "../projects/micro/MicroHeader";
import { circle, radialGradient } from "framer-motion/client";

/* ================= TYPES ================= */

export type MetricItem = {
  value: string;
  label: string;
};

export type BrandMetricsProps = {
  tag: string;
  heading: string;

  leftTitle: string;
  rightTitle: string;

  leftData: MetricItem[];
  rightData: MetricItem[];

  bulletImage: string;

  leftLineImage: string;
  rightLineImage: string;
};

/* ================= COMPONENT ================= */

export default function BrandMetrics({
  tag,
  heading,
  leftTitle,
  rightTitle,
  leftData,
  rightData,
  bulletImage,
  leftLineImage,
  rightLineImage,
}: BrandMetricsProps) {
  const fillRef = useRef<SVGRectElement | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    registerGSAP();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(leftRef.current, { x: 200, opacity: 0 });
      gsap.set(rightRef.current, { x: -200, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          // once: true,
        },
      });

      tl.to(
        leftRef.current,
        {
          x: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 1.2,
        },
        0,
      );

      tl.to(
        rightRef.current,
        {
          x: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 1.2,
        },
        0,
      );

      tl.to(
        fillRef.current,
        {
          attr: {
            y: 20,
            height: 140,
          },
          ease: "power2.out",
          duration: 1.2,
        },
        0.2,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ================= STYLES ================= */

  const itemWrapper =
    "flex items-center justify-start lg:justify-centerd lg:px-0";
  const valueClass = `${agency.className} text-[24px] lg:text-[36px] font-normal`;
  const labelClass = `text-sm mt-1 ${blauerNue.className} font-medium tracking-[0.5px] text-start`;

  return (
    <div data-cursor="light" className="relative mt-16 py-10 overflow-x-hidden">
      <div className="app-container">
        {/* Heading */}
        {/* <SectionHeader
                    tag={tag}
                    heading={heading}
                    bulletType="triangle"
                    bulletImage={bulletImage}
                /> */}
        <MicroHeader title={tag} description={heading} />
        {/* Main Section */}
        <div
          ref={sectionRef}
          className="flex flex-col lg:flex-row relative items-start lg:items-center justify-between px-4 lg:px-10 lg:mt-16"
        >
          {/* LEFT */}
          <div
            ref={leftRef}
            className="flex justify-center items-center lg:w-[50%] w-full"
          >
            <div className="flex flex-col gap-1 lg:gap-10 w-full lg:w-1/3 text-[#0F3C78]">
              <h3
                className={`${agency.className} pb-3 lg:pb-0 text-xl mb-2 lg:mb-4 lg:text-start`}
              >
                {leftTitle}
              </h3>

              {leftData.map((item, i) => (
                <div key={i} className={itemWrapper}>
                  <h4 className={valueClass}>{item.value}</h4>
                  <p className={`${labelClass} ml-2`}>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="h-[150px] lg:h-[300px] w-[100px] lg:w-[200px] relative mt-22 ml-10 hidden lg:block">
              <Image src={leftLineImage} alt="line" fill />
            </div>
          </div>
          {/* Glow Background */}
          <div
            className="absolute inset-0 blur-[250px]"
            style={{
              background:
                "radial-gradient(circle, #00DBFF24 0%, transparent 100%)",
            }}
          />
          {/* CENTER TRIANGLE */}
          <div className="absolute left-0 right-0 w-[30%] top-40 mx-auto hidden lg:flex justify-center">
            <svg viewBox="0 0 200 180" className="w-[50px] md:w-[220px]">
              <defs>
                <linearGradient
                  id="triangleGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2FD2ED" />
                  <stop offset="100%" stopColor="#1C71E8" />
                </linearGradient>

                <clipPath id="triangleClip">
                  <path d="M100 20 L20 160 L180 160 Z" />
                </clipPath>
              </defs>

              <rect
                ref={fillRef}
                x="0"
                y="160"
                width="200"
                height="0"
                fill="url(#triangleGradient)"
                clipPath="url(#triangleClip)"
              />

              <path
                d="M100 20 L20 160 L180 160 Z"
                stroke="url(#triangleGradient)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          {/* RIGHT */}
          <div
            ref={rightRef}
            className="flex justify-center items-center lg:w-[50%] w-full"
          >
            <div className="h-[80px] lg:h-[180px] w-[100px] lg:w-[200px] relative mt-22 mr-10 hidden lg:block">
              <Image src={rightLineImage} alt="line" fill />
            </div>

            <div className="flex flex-col gap-1 lg:gap-10 lg:w-1/3 text-[#0F3C78] items-start lg:items-center w-full">
              <h3
                className={`${agency.className} pb-3 lg:pb-0 text-xl mb-2 lg:mb-4 lg:text-start mt-8 lg:mt-0`}
              >
                {rightTitle}
              </h3>

              {rightData.map((item, i) => (
                <div key={i} className={`${itemWrapper} justify-end`}>
                  <h4 className={valueClass}>{item.value}</h4>
                  <p className={`${labelClass} ml-2`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
