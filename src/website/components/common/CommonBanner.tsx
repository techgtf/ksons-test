"use client";
import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import React, { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";
import { useReveal } from "../../hooks/useReveal";
import WaterMark from "./WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

export interface CommonBannerProps {
  tag?: string;
  heading?: string;
  description?: string;
  bulletIcon?: string;
  files: {
    desktop_file: string;
    mobile_file: string;
    mainLabel?: string;
  };
  headingArea?: string;
  peraArea?: string;
}

const Overlay = () => {
  return (
    <>
      <div
        className="lg:h-[123px] absolute left-0 right-0 top-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.00) 100%)",
        }}
      />
    </>
  );
};

export default function CommonBanner({
  tag,
  heading,
  description,
  bulletIcon = "/images/about/about-bullet.png",
  files,
  headingArea = "lg:w-[850px]",
  peraArea = "lg:w-[428px] 2xl:w-[428px]",
}: CommonBannerProps) {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLHeadingElement | null>(null);

  useSlideY({ target: wrapperRef, direction: "down" });
  // useSlideY({ target: titleRef, direction: "down" })
  // useSlideY({ target: headingRef, direction: "down" })
  // useSlideY({ target: descRef, direction: "up" })
  useReveal(imgRef, { direction: "bottom" });

  return (
    <div
      data-cursor="light"
      className="common-hero-banner relative pt-35 lg:pt-30 2xl:pt-40 text-center"
    >
      <Overlay />
      <div
        ref={wrapperRef}
        className="app-container absolute left-0 right-0 z-1"
      >
        <div ref={titleRef} className="">
          <span
            className={`${blauerNue.className} tag-line pb-5 2xl:pb-8 flex items-center justify-center gap-3 text-[#0F3C78] lg:text-[18px] lg:leading-[20px] capitalize tracking-[0.5px]`}
          >
            <Image src={bulletIcon} height={20} width={20} alt="icon" />
            {tag}
          </span>
        </div>
        <h1
          ref={headingRef}
          className={`${agency.className} ${headingArea} tracking-normal 2xl:pb-8.5 pb-5 mx-auto text-[22px] lg:text-[30px] 2xl:text-[36px] text-[#0F3C78]`}
        >
          {heading}
        </h1>
        <p
          ref={descRef}
          className={`${blauerNue.className} ${peraArea} max-w-[450px] text-base font-light tracking-[0.5px] mx-auto uppercase text-[#0F3C78]`}
        >
          {description}
        </p>
      </div>
      <div ref={imgRef} className="img-main relative block lg:pt-20 pt-32">
        <picture>
          <source media="(max-width: 768px)" srcSet={files.mobile_file} />

          <img
            src={files.desktop_file}
            alt={heading || "banner"}
            className="w-full object-cover min-h-[400px] lg:min-h-[545px] HeaderOverlay"
          />
        </picture>
        <div className="absolute right-5 bottom-5">
          <WaterMark
            textColor="text-black"
            opacity="opacity-100"
            label={getDisplayLabel(files.mainLabel || "")}
          />
        </div>
      </div>
    </div>
  );
}
