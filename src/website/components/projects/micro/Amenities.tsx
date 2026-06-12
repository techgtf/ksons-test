"use client";
import React, { useRef } from "react";
import { MicroAmenities, MicroAmenitiesTypes } from "../projects";
import Image from "next/image";
import { agency } from "@/src/app/fonts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LeftArrow, RightArrow } from "../../common/SVGIcons";
import MicroHeader from "./MicroHeader";
import { useReveal } from "@/src/website/hooks/useReveal";

type Props = {
  data?: MicroAmenities;
};

export default function Amenities({ data }: Props) {
  if (!data) return null;

  const { title, description, list } = data;
  const swiperRef = useRef<any>(null);
  const amWrapperRef = useRef<HTMLDivElement | null>(null);

  const amenitiesToRender = list || [];

  return (
    <div
      data-cursor="light"
      className="micro-amenities-section py-14 lg:py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/images/common/amenities-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="app-container">
        {/* Header Section */}
        <MicroHeader title={title} description={description} />

        {/* Carousel Area */}
        <div className="relative max-w-[1500px] mx-auto mt-10">
          {/* Left Navigation Panel */}
          {amenitiesToRender.length > 2 && (
            <div
              className="hidden md:flex absolute left-0 top-[30%] w-16 md:w-24 lg:w-32 transition-colors items-center justify-center cursor-pointer z-20"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <LeftArrow />
            </div>
          )}

          {/* Right Navigation Panel */}
          {amenitiesToRender.length > 2 && (
            <div
              className="hidden md:flex absolute right-0 top-[30%] w-16 md:w-24 lg:w-32 transition-colors items-center justify-center cursor-pointer z-20"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <RightArrow />
            </div>
          )}

          <div ref={amWrapperRef} className="px-5 md:px-24 lg:px-32 pb-0">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              loop
              pagination={{
                clickable: true,
                el: ".amenities-pagination",
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 40,
                },
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="!pb-10"
            >
              {amenitiesToRender.map((amenity, index) => (
                <SwiperSlide key={index}>
                  <AmSlideCard amenity={amenity} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Custom Pagination */}
          <div className="flex amenities-pagination justify-center gap-2 mt-4"></div>
        </div>
      </div>

      <style jsx>{`
        :global(.amenities-pagination .swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          opacity: 0.2;
          transition: all 0.3s ease;
          border-radius: 50%;
          cursor: pointer;
          margin: 0 !important;
          background: #0f3c78;
        }
        :global(.amenities-pagination .swiper-pagination-bullet-active) {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

type CardProp = {
  amenity: MicroAmenitiesTypes;
};

const AmSlideCard = ({ amenity }: CardProp) => {
  const amRef = useRef<HTMLDivElement | null>(null);
  const amNameRef = useRef<HTMLDivElement | null>(null);

  useReveal(amRef, { direction: "top" });

  return (
    <div ref={amRef} className="flex flex-col gap-6">
      <div className="relative aspect-[3/2] w-full rounded-[10px] md:rounded-[20px] overflow-hidden ring-1 ring-black/5">
        <Image
          src={amenity.desktop_image}
          alt={amenity.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
      <div
        ref={amNameRef}
        className="flex justify-center lg:items-start items-center gap-6 px-2"
      >
        <div className="lg:w-10 lg:h-10 w-8 h-8 relative shrink-0">
          <Image
            src={amenity.icon}
            alt={amenity.title}
            fill
            className="object-contain"
          />
        </div>
        <h4
          className={`${agency.className} text-[18px] md:text-[24px] text-[#0F3C78] lg:leading-[38px] capitalize pt-1`}
        >
          {amenity.title}
        </h4>
      </div>
    </div>
  );
};
