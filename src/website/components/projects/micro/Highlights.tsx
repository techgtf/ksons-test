"use client";
import React, { useRef } from "react";
import { MicroHighlights } from "../projects";
import Image from "next/image";
import { agency } from "@/src/app/fonts";
import { TriangleImg } from "../../common/VectorImages";
import MicroHeader from "./MicroHeader";
import { useSlideY } from "@/src/website/hooks/useSlideY";
import { useSlideX } from "@/src/website/hooks/useSlideX";

interface HighlightsProps {
  data?: MicroHighlights;
}

export default function Highlights({ data }: HighlightsProps) {
  if (!data) return null;
  const { title, description, list } = data;

  const listRef = useRef<HTMLUListElement | null>(null);
  useSlideX({ target: listRef, direction: "right" });

  return (
    <div
      data-cursor="light"
      className="micro-overview py-14 lg:py-20 overflow-x-hidden"
      style={{ background: "rgba(15, 60, 120, 0.03)" }}
    >
      <div className="app-container">
        <div className="head lg:grid justify-center pb-10 lg:pb-16">
          <MicroHeader title={title} description={description} />
        </div>
        <ul
          ref={listRef}
          className="flex flex-wrap justify-center gap-x-[3%] gap-y-4 lg:gap-y-10"
        >
          {list.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 w-full lg:w-[28%] px-8 py-6 lg:py-7 rounded-[15px] border border-[#0F3C78]/20"
              style={{
                background:
                  "linear-gradient(180deg, rgba(51, 211, 238, 0.05) 0%, rgba(15, 60, 120, 0.05) 100%)",
              }}
            >
              <div className="relative w-[25%] h-[70px] lg:h-[122px] flex justify-center items-center">
                <Image
                  src={item.icons}
                  alt={item.name}
                  height={32}
                  width={32}
                  className="w-[32px] h-[32px]"
                />
                <div className="absolute -z-1 -top-2 lg:top-5 bottom-0 left-0 right-0">
                  <TriangleImg size={"w-full"} />
                </div>
              </div>
              <span
                className={`${agency.className} text-[#0F3C78] pera text-[18px] flex-1 block`}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
