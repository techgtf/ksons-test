"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import MicroHeader from "../projects/micro/MicroHeader";

/* ================= TYPES ================= */

export type CounterItem = {
  value: number;
  suffix?: string;
  label: string;
};

export type NumbersScalesProps = {
  tag: string;
  heading: string;

  triangleImage: string;
  dividerImage: string;

  leftTitle: string;
  description: string;

  counters: CounterItem[];
};

/* ================= COMPONENT ================= */

export default function NumbersScales({
  tag,
  heading,
  triangleImage,
  dividerImage,
  leftTitle,
  description,
  counters,
}: NumbersScalesProps) {
  const sectionRef = useRef(null);
  const triangleRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);

  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const animateCounters = () => {
    countRefs.current.forEach((el, i) => {
      if (!el) return;

      const target = counters[i].value;

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.8,
          ease: "power2.out",
          snap: { innerText: 1 },
          onUpdate: function () {
            const value = Math.floor(Number(el.innerText));
            const formattedValue = String(value).padStart(2, "0");
            el.innerText = formattedValue + (counters[i].suffix || "");
          },
        },
      );
    });
  };
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 0%",
          scrub: 3,
        },
      });

      //  scrollTrigger: {
      //     trigger: sectionRef.current,
      //     start: "top 80%",
      //     end: "top 20%",
      //     scrub: 2.5,
      //   },

      // 🔺 Triangle Animation
      tl.fromTo(
        triangleRef.current,
        {
          x: () => window.innerWidth * 0.6,
          y: () => -window.innerHeight * 0.6,
          rotate: 460,
          scale: 0.5,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          duration: 3,
        },
      );

      // ✨ Heading reveal slightly earlier
      tl.to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.6",
      );

      // 📦 Content reveal ONLY when triangle near final
      tl.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          onStart: animateCounters,
        },
        "-=0.4", // 👈 important: trigger just before triangle settles
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      data-cursor="light"
      className="w-full bg-gradient-to-r from-[#FFFF] to-[#00DBFF66]/40 pb-10 md:pb-0"
    >
      <div
        ref={sectionRef}
        className="relative md:min-h-[100vh] pt-35 flex flex-col items-center justify-start max-w-7xl mx-auto overflow-hidden"
      >
        {/* Heading */}
        <div className="app-container">
          <div
            ref={headingRef}
            className="relative z-10 pointer-events-none opacity-0"
          >
            <MicroHeader title={tag} description={heading} />
          </div>
        </div>

        {/* Triangle */}
        <div className="absolute left-6 md:left-[11%] top-[40%] lg:top-[39%] 2xl:top-[33%] z-10">
          <div
            ref={triangleRef}
            className="will-change-transform mix-blend-multiply opacity-80"
          >
            <div className="relative w-[75px] md:w-[140px] lg:w-[180px] aspect-square">
              <Image
                src={triangleImage}
                alt="triangle"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="h-full flex flex-col justify-center px-6 relative overflow-hidden opacity-0 translate-y-[20%] blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-10 md:gap-0">
            {/* LEFT */}
            <div className="relative flex flex-col items-center justify-start left-el ml-14 md:ml-0">
              {/* <div className="h-[90px] md:h-[95px] flex items-center justify-center" /> */}
              <p
                className={`text-[#0F3C78] lg:text-[24px] ${agency.className}`}
              >
                {leftTitle}
              </p>
            </div>

            {/* CENTER */}
            <div className="hidden lg:flex justify-center center-el">
              <Image src={dividerImage} alt="divider" width={60} height={250} />
            </div>

            {/* RIGHT */}
            <div className="text-[#1B3F6B] max-w-md mx-auto lg:mx-0 right-el">
              <div className="space-y-3 md:space-y-6">
                {counters.map((item, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <span
                      ref={(el) => {
                        countRefs.current[i] = el;
                      }}
                      className={`text-[24px] lg:text-[32px] ${agency.className}`}
                    >
                      0{item.suffix}
                    </span>
                    <p
                      className={`${blauerNue.className} lg:leading-[20px] tracking-[0.5px] capitalize`}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <p
                className={`mt-8 text-[#2F4F6F] font-light lg:leading-[22px] tracking-[0.5px] ${blauerNue.className}`}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
