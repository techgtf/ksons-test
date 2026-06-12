"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { gsap, registerGSAP } from "../../utils/gsap";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { lenisInstance } from "../SmoothScroller";
import MicroHeader from "../projects/micro/MicroHeader";

export type ValueItem = {
  title: string;
  image: string;
  description: string;
  filledImage: string;
};

export type ValuesProps = {
  tag: string;
  heading: string;
  values: ValueItem[];
};

export default function Values({ tag, heading, values }: ValuesProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 👉 determines what should LOOK active
  const displayIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : activeIndex !== null
        ? activeIndex
        : null;

  const item = activeIndex !== null ? values[activeIndex] : null;

  const headingRef = useRef<HTMLDivElement | null>(null);
  const trianglesRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("global-ui-root")
      : null;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (activeIndex !== null) {
      lenisInstance?.stop();

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      lenisInstance?.start();

      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    }

    return () => {
      lenisInstance?.start();
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [activeIndex]);

  useLayoutEffect(() => {
    registerGSAP();

    if (!headingRef.current || !trianglesRef.current) return;

    const ctx = gsap.context(() => {
      /* -------------------------
         HEADING
      ------------------------- */
      gsap.fromTo(
        headingRef.current,
        {
          y: -60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* -------------------------
         EACH TRIANGLE PREMIUM REVEAL
      ------------------------- */
      const triangles = trianglesRef.current?.querySelectorAll(".triangle");

      if (!triangles?.length) return;

      triangles.forEach((triangle, index) => {
        gsap.fromTo(
          triangle,
          {
            y: 80,
            scale: 0.82,
            rotate: index % 2 === 0 ? -6 : 6,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
            delay: index * 0.12,
            scrollTrigger: {
              trigger: triangle,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} data-cursor="light" className="py-12 lg:py-24 relative overflow-hidden">
      {/* Glow Background */}
      <div
        className="absolute inset-0 w-[126px] blur-[200px]"
        style={{
          background: "radial-gradient(circle, #1C71E8 0%, transparent 100%)",
        }}
      />

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-500 ${activeIndex !== null
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setActiveIndex(null)}
      />

      {/* MAIN */}
      <div
        className={`transition-transform duration-500 ${activeIndex !== null ? "translate-x-[-150px]" : ""
          }`}
      >
        {/* Heading */}
        <div className="app-container">
          <div ref={headingRef}>
            <MicroHeader title={tag} description={heading} />
          </div>
        </div>

        {/* TRIANGLES */}
        <div
          ref={trianglesRef}
          className="mt-20 flex items-center justify-center flex-col"
        >
          {/* TOP */}
          {values[0] &&
            (() => {
              const isActive = displayIndex === 0;

              return (
                <div
                  className="triangle relative cursor-pointer opacity-0"
                  onClick={() => {
                    setActiveIndex(0);
                    setMounted(true);
                  }}
                  onMouseEnter={() => setHoveredIndex(0)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={values[0].image}
                    alt=""
                    width={300}
                    height={300}
                    className={`transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"
                      }`}
                  />

                  <Image
                    src={values[0].filledImage}
                    alt=""
                    width={300}
                    height={300}
                    className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
                      }`}
                  />

                  <div className="absolute inset-0 flex items-end justify-between px-8 pb-6">
                    <p
                      className={`pera text-[16px] lg:text-[14px] tracking-[0.5px] lg:leading-[18px] font-medium ${blauerNue.className} px-3 lg:px-6 ${isActive ? "text-white" : "text-[#0F3C78]"
                        }`}
                    >
                      {values[0].title}
                    </p>
                    <span
                      className={`text-[20px] lg:text-[18px] ${isActive ? "text-white" : "text-[#0F3C78]"}`}
                    >
                      +
                    </span>
                  </div>
                </div>
              );
            })()}

          {/* BOTTOM */}
          <div className="md:flex gap-3 mt-2 space-y-6 lg:space-y-0 lg:pt-0 pt-4">
            {values.slice(1).map((item, i) => {
              const index = i + 1;
              const isActive = displayIndex === index;

              return (
                <div
                  key={i}
                  className="triangle relative cursor-pointer opacity-0"
                  onClick={() => {
                    setActiveIndex(index);
                    setMounted(true);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={300}
                    height={300}
                    className={`transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"
                      }`}
                  />

                  <Image
                    src={item.filledImage}
                    alt=""
                    width={300}
                    height={300}
                    className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
                      }`}
                  />

                  <div className="absolute inset-0 flex items-end justify-between px-8 pb-6">
                    <p
                      className={`pera text-[16px] lg:text-[14px] tracking-[0.5px] lg:leading-[18px] font-medium ${blauerNue.className} px-3 lg:px-6 ${isActive ? "text-white" : "text-[#0F3C78]"
                        }`}
                    >
                      {item.title}
                    </p>
                    <span
                      className={`text-[20px] lg:text-[18px] ${isActive ? "text-white" : "text-[#0F3C78]"}`}
                    >
                      +
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="lg:block hidden absolute w-[126px] blur-[200px] right-0 top-0 bottom-0"
        style={{
          background: "radial-gradient(circle, #1C71E8 0%, transparent 100%)",
        }}
      />

      {mounted &&
        portalRoot &&
        createPortal(
          <div className="fixed top-0 right-0 h-full z-9999 pointer-events-none">
            <div
              className={`
      h-full w-[300px] lg:w-[380px] bg-white shadow-2xl pointer-events-auto
      transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${activeIndex !== null ? "translate-x-0" : "translate-x-full"}
    `}
            >
              {/* CONTENT */}
              <div className="h-full flex flex-col items-center p-10">
                {/* CLOSE */}
                <button
                  className={`self-end mb-10 ${blauerNue.className} text-sm font-medium flex items-center gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition`}
                  onClick={() => setActiveIndex(null)}
                >
                  CLOSE
                  <span>
                    <Image
                      src="/images/home/testimonial-arrow.png"
                      alt="Close"
                      width={15}
                      height={15}
                    />
                  </span>
                </button>

                {/* TEXT */}
                <div className="flex flex-col justify-end h-[80%] pb-22 lg:pb-10 text-[#0F3C78]">
                  <h2 className={`text-3xl mb-4 ${agency.className}`}>
                    {item?.title}
                  </h2>

                  <p className={`text-sm ${blauerNue.className}`}>
                    {item?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          portalRoot,
        )}
    </div>
  );
}
