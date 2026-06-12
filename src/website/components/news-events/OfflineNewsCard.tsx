import React, { useRef } from "react";
import { NewsItem } from "./NewsSection";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { useSlideY } from "../../hooks/useSlideY";


export default function OfflineNewsCard({
  item,
  onClick,
}: {
  item: NewsItem;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: cardRef, direction: "down", distance: -120 });
  return (
    <div
      ref={cardRef}
      key={item.id}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[1.4/1] lg:mb-10 mb-5 overflow-hidden rounded-[10px]">
        <Image
          src={item.image || "/images/blogs/blog-img.jpg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div>
        <h3
          className={`${agency.className} text-[#0F3C78] text-[20px] lg:text-[24px] tracking-[-0.5px] lg:leading-[32px] lg:mb-5 mb-4 line-clamp-2`}
        >
          {item.title}
        </h3>
        <span
          className={`${blauerNue.className} text-[#0F3C78]/75 text-[16px] lg:leading-[24px] tracking-[0.5px] font-semibold block`}
        >
          {item.date} {item.monthYear}
        </span>
      </div>
    </div>
  );
}
