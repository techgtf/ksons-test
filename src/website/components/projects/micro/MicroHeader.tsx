"use client";
import { agency, blauerNue } from "@/src/app/fonts";
import { useSlideY } from "@/src/website/hooks/useSlideY";
import Image from "next/image";
import React, { useRef } from "react";

type Props = {
  title: string;
  description: string;
  titleColor?: string;
  descriptionColor?: string;
  padding?: string;
  dataCursor?: string;
};

export default function MicroHeader({
  title = "",
  description = "",
  titleColor = "#0F3C78",
  descriptionColor = "#0F3C78",
  padding = "pb-10",
  dataCursor = "",
}: Props) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: titleRef, direction: "down" });
  useSlideY({ target: headingRef, direction: "up" });

  return (
    <div
      data-cursor={dataCursor}
      className={`head lg:grid justify-center ${padding} ${blauerNue.className} text-center tracking-[0.5px] lg:leading-[20px]`}
    >
      <div ref={titleRef}>
        <div
          className="builder-name flex justify-center items-center gap-4 mb-6 lg:mb-8"
          style={{ color: titleColor }}
        >
          <Image
            src={"/images/about/about-bullet.png"}
            alt="bullet"
            height={16}
            width={16}
          />
          {title}
        </div>
      </div>
      <h2
        ref={headingRef}
        className={`${agency.className} text-[24px] lg:text-[36px] max-w-[844px] lg:leading-[40px] tracking-normal`}
        style={{ color: descriptionColor }}
      >
        {description}
      </h2>
    </div>
  );
}
