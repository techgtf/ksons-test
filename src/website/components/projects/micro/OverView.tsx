"use client";
import React, { useRef, useState } from "react";
import EnquiryModal from "../../common/EnquiryModal";
import { MicroOverView } from "../projects";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import {
  AreaIcon,
  LocationIcon,
  StatusIcon,
  TypeIcon,
} from "@/src/website/components/common/SVGIcons";
import { TriangleImg } from "@/src/website/components/common/VectorImages";
import CommonBtn from "@/src/website/components/common/CommonBtn";
import { useSlideX } from "@/src/website/hooks/useSlideX";
import { useSlideY } from "@/src/website/hooks/useSlideY";
import { useReveal } from "@/src/website/hooks/useReveal";

interface OverViewProps {
  data: {
    title: string;
    description: string;
    location: string;
    area: string;
    status: string;
    typology: string;
  };
}

export default function OverView({ data }: OverViewProps) {
  if (!data) return null;
  const { title, description, location, area, status, typology } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<HTMLDivElement | null>(null);

  useSlideX({ target: titleRef, direction: "right" });
  useSlideX({ target: headingRef, direction: "right" });
  useSlideX({ target: descRef, direction: "right" });
  useSlideY({ target: contentRef, direction: "down" });
  useReveal(triangleRef, { direction: "bottom", delay: 1, duration: 2 });

  return (
    <div
      data-cursor="light"
      className="micro-overview py-14 lg:py-20 overflow-x-hidden"
    >
      <div className="app-container">
        <div className="lg:flex justify-between">
          <div className="left-side lg:w-[50%] lg:border-r border-[#0F3C78]/10 lg:pr-24 pb-10 lg:pb-0">
            <div className="w-full" ref={titleRef}>
              <div
                className={`builder-name flex items-center gap-2 text-[#0F3C78] ${agency.className} text-[15px] leading-normal`}
              >
                <Image
                  src={"/images/about/about-bullet.png"}
                  alt="bullet"
                  height={16}
                  width={16}
                />
                K.sons
              </div>
            </div>
            <h2
              ref={headingRef}
              className={`${agency.className} pt-2 lg:pt-4 text-[22px] md:text-[36px] text-[#0F3C78] capitalize leading-[32px] lg:leading-[34px]`}
            >
              {title}
            </h2>
            <p
              ref={descRef}
              className={`${blauerNue.className} pera text-[#0F3C78] pt-3 lg:pt-6 font-light`}
            >
              {description}
            </p>
          </div>
          <div
            ref={contentRef}
            className="right-side relative grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4 lg:gap-y-16 capitalize lg:w-[50%] lg:p-10 "
          >
            <div
              ref={triangleRef}
              className="absolute left-0 lg:right-14 lg:top-0 bottom-0 flex justify-center items-center -z-1"
            >
              <TriangleImg size={"w-[200px] lg:w-[300px]"} />
            </div>
            <div className="box w-full text-[#0F3C78] flex gap-3">
              <span className="block">
                <LocationIcon />
              </span>
              <div className="content space-y-1">
                <p className={`${agency.className}`}>Address</p>
                <p className={`${blauerNue.className} font-light`}>
                  {location ? location : "Details Coming soon"}
                </p>
              </div>
            </div>
            <div className="box w-full text-[#0F3C78] flex gap-3 lg:pl-10">
              <span className="block">
                <AreaIcon />
              </span>
              <div className="content space-y-1">
                <p className={`${agency.className}`}>Total Area</p>
                <p className={`${blauerNue.className} font-light`}>
                  {area ? area : "Details Coming soon"}
                </p>
              </div>
            </div>
            <div className="box w-full text-[#0F3C78] flex gap-3">
              <span className="block">
                <TypeIcon />
              </span>
              <div className="content space-y-1">
                <p className={`${agency.className}`}>Type</p>
                <p className={`${blauerNue.className} font-light`}>
                  {typology ? typology : "Details Coming soon"}
                </p>
              </div>
            </div>
            <div className="box w-full text-[#0F3C78] flex gap-3 lg:pl-10">
              <span className="block">
                <StatusIcon />
              </span>
              <div className="content space-y-1">
                <p className={`${agency.className}`}>Status</p>
                <p className={`${blauerNue.className} font-light`}>
                  {status ? status : "Details Coming soon"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {status?.toLowerCase() !== "delivered" && (
          <div ref={btnRef} className={`flex justify-center gap-2.5 pt-14`}>
            <CommonBtn
              onClick={() => setIsModalOpen(true)}
              variant="gradient"
              rightIcon={
                <Image
                  src={"/images/icons/arrow-up.svg"}
                  alt="arrow"
                  width={12}
                  height={14}
                />
              }
            >
              Know more
            </CommonBtn>
          </div>
        )}
      </div>
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
