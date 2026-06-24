"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import { useScrollScale } from "../../hooks/useScrollScale";
import WaterMark from "../common/WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

/* ================= TYPES ================= */

export type InvestorDescProps = {
  heading: string;
  description: string;
  icon: string;
  image?: string;
  mainLabel?: string;
};

/* ================= COMPONENT ================= */

export default function InvestorDesc({
  heading,
  description,
  icon,
  image,
  mainLabel,
}: InvestorDescProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useScrollScale(imgRef, { fromScale: 0.8, start: "top 80%" });

  useLayoutEffect(() => {
    registerGSAP();

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (headingRef.current) {
        tl.from(headingRef.current, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (textRef.current) {
        tl.from(
          textRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        );
      }

      if (iconRef.current) {
        tl.from(
          iconRef.current,
          {
            scale: 0.6,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div data-cursor="light" ref={containerRef} className="pt-10 lg:pt-30">
      <div className="app-container">
        <div className="flex items-center justify-center flex-col text-[#0F3C78]">
          <h5
            ref={headingRef}
            className={`${agency.className} lg:max-w-3xl text-[24px] text-center md:text-[36px] leading-[32px] lg:leading-[54px]`}
          >
            {heading}
          </h5>

          <p
            ref={textRef}
            className={`${blauerNue.className} font-light max-w-[884px] leading-[24px] tracking-[0.5px] px-7 lg:px-0 text-center text-xs lg:text-base mt-3 lg:mt-8`}
          >
            {description}
          </p>

          <div ref={iconRef} className="my-10 lg:my-16">
            <Image src={icon} alt="icon" height={25} width={25} />
          </div>
          {image && (
            <div className="relative">
              <Image
                ref={imgRef}
                src={image}
                alt="investor-description"
                width={702}
                height={326}
                className="block mx-auto rounded-[15px] pb-10 lg:pb-30"
              />
              <div className="absolute right-5  lg:top-[65%]">
                <WaterMark
                  textColor="text-white"
                  opacity="opacity-100"
                  label={getDisplayLabel(mainLabel)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
