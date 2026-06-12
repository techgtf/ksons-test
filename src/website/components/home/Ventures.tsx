"use client";

import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import Link from "next/link";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import { useLayoutEffect, useRef } from "react";
import MicroHeader from "../projects/micro/MicroHeader";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useSlideY } from "../../hooks/useSlideY";

export type VentureLogo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  link?: string;
};

export type VenturesProps = {
  tag: string;
  heading: string;
  description: string;
  backgroundImage: string;
  logos: VentureLogo[];
};

export default function Ventures({
  tag,
  heading,
  description,
  backgroundImage,
  logos,
}: VenturesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const logosRef = useRef<any | null>(null);

  useSlideY({ target: descRef, direction: "up" });
  useSlideY({ target: logosRef, direction: "up" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex items-center justify-center text-center py-16 md:py-24 px-6 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* BACKGROUND */}
      {/* <Image
        src={backgroundImage}
        alt="background"
        fill
        priority
        className="object-cover object-center -z-10"
      /> */}

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="app-container">
          <div className="flex flex-col items-center">
            <MicroHeader
              title={tag}
              description={heading}
              titleColor="white"
              descriptionColor="white"
              padding="pb-4"
            />

            <p
              ref={descRef}
              className={`${blauerNue.className} text-white font-light mt-10 max-w-[909px] text-base tracking-[0.5px] lg:leading-[24px]`}
            >
              {description}
            </p>
          </div>
        </div>

        {/* LOGOS */}
        <div className="mt-22 w-full max-w-2xs md:max-w-2xl lg:max-w-5xl mx-auto">
          <Swiper
            ref={logosRef}
            modules={[Pagination]}
            loop={logos.length >= 6}
            slidesPerView={1}
            spaceBetween={10}
            centeredSlides={false}
            breakpoints={{
              768: {
                slidesPerView: 3,
                // spaceBetween: 60,
              },
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom-ventures",
            }}
          >
            {logos.map((logo, i) => {
              const content = (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 220}
                  height={logo.height || 60}
                  className="max-w-full h-auto object-contain"
                />
              );

              return (
                <SwiperSlide
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="flex items-center justify-center w-full h-[110px] px-4">
                    {logo.link ? (
                      <Link href={logo.link}>{content}</Link>
                    ) : (
                      content
                    )}
                  </div>
                  {i !== logos.length - 1 && (
                    <div className="h-[110px] w-px bg-line-home hidden lg:block" />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="swiper-pagination-custom-ventures flex justify-center gap-2 pt-10"></div>
        </div>
      </div>

      <style jsx>{`
        :global(
          .swiper-pagination-custom-ventures .swiper-pagination-bullet-active
        ) {
          background-color: white !important;
        }
      `}</style>
    </section>
  );
}
