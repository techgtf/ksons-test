"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { useSlideX } from "@/src/website/hooks/useSlideX";
import { gsap } from "@/src/website/utils/gsap";

export interface AwardsItem {
  title: string;
  description: string;
}
export interface AwardsProps {
  awardCards: AwardsItem[];
}

export default function AwardCards({ awardCards }: AwardsProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewedSlides, setViewedSlides] = useState(3);
  const totalSlides = awardCards.length;

  return (
    <div data-cursor="light" className="app-container">
      <div className="w-full">
        <Swiper
          modules={[Mousewheel]}
          mousewheel={{
            forceToAxis: true,
          }}
          speed={600}
          slidesPerView={1.2}
          spaceBetween={16}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          onBreakpoint={(swiper, params) => {
            if (params.slidesPerView) {
              setViewedSlides(params.slidesPerView as number);
            }
          }}
          breakpoints={{
            768: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="pb-4"
        >
          {awardCards.map((card, index) => (
            <SwiperSlide key={index}>
              <Card card={card} isActive={index === activeSlide} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Progress bar container */}
        <div className="relative lg:my-16 my-8 h-px w-full bg-[#D7E1EC]">
          <div
            className="absolute left-0 top-0 h-full bg-[#0F3C78] transition-all duration-500 ease-out"
            style={{
              // Width starts at roughly the portion of visible slides and expands
              width: `${Math.min(100, ((activeSlide + viewedSlides) / totalSlides) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

type CardProp = {
  card: AwardsItem;
  isActive: any;
};

const Card = ({ card, isActive }: CardProp & { isActive: boolean }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useSlideX({ target: cardRef });

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-6 md:p-8 light-gradient-bg overflow-x-hidden"
    >
      <div className="relative mb-6 h-20 w-20 md:mb-8 md:h-24 md:w-24">
        <Image
          src="/images/awards/award-symbol.png"
          alt="Award Symbol"
          fill
          className="object-contain"
        />
      </div>

      <h3
        className={`${agency.className} text-[18px] text-[#4a4a4a] tracking-[1px] leading-[28px] lg:leading-[42px] md:text-[25px]`}
      >
        {card.title}
      </h3>

      <p
        className={`${blauerNue.className} lg:mt-6 mt-4 text-base leading-[28px] tracking-[0.2px] text-[#4a4a4a] lg:leading-[34px] lg:text-[20px]`}
      >
        {card.description}
      </p>
    </div>
  );
};
