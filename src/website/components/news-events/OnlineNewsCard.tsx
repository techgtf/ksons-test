import { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";
import Link from "next/link";
import { agency, blauerNue } from "@/src/app/fonts";
import { NewsItem } from "./NewsSection";

export default function OnlineNewsCard({ item }: { item: NewsItem }) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useSlideY({ target: cardRef, direction: "down", distance: -120 });

  return (
    <Link
      target="_blank"
      ref={cardRef}
      key={item.id}
      href={item.link || "#"}
      className="group"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
        {/* Date Section */}
        <div
          className={`${blauerNue.className} hidden flex-col items-center text-[#0F3C78]/75 tracking-[0.5px] leading-[24px] font-semibold mt-2 min-w-[80px] lg:flex`}
        >
          <span>{item.date}</span>
          <span>{item.monthYear}</span>
        </div>

        {/* Content Section */}
        <div className="flex-1 border-b border-[#0F3C78]/10 pb-6 lg:pb-10">
          <h3
            className={`${agency.className} text-[#0F3C78] text-[20px] lg:text-[24px] tracking-[-0.5px] lg:leading-[32px] lg:mb-5 mb-4`}
          >
            {item.title}
          </h3>
          <p
            className={`${blauerNue.className} text-[#0F3C78] text-[16px] tracking-[0.5px] lg:mb-6 mb-4 font-light`}
          >
            {item.description}
          </p>
          <div
            className={`${blauerNue.className} flex items-center gap-2 text-[#0F3C78] text-[14px] tracking-[0.5px] font-light group-hover:opacity-70 transition-opacity`}
          >
            Know More
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path
                d="M1 13L13 1M13 1H4M13 1V10"
                stroke="#0F3C78"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
