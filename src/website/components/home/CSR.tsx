"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";

import "swiper/css";
import "swiper/css/effect-fade";
import MicroHeader from "../projects/micro/MicroHeader";
import Link from "next/link";

/* ================= TYPES ================= */

export type CSRItem = {
  image: string;
  year: string;
  title: string;
};

export type CSRProps = {
  tag: string;
  heading: string;
  description: string;

  backgroundImage: string;

  events: CSRItem[];

  arrowIcon: string;
};

/* ================= COMPONENT ================= */

export default function CSR({
  tag,
  heading,
  description,
  backgroundImage,
  events,
  arrowIcon,
}: CSRProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const uiUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  const headingRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [uiActive, setUiActive] = useState(0);

  const isFirst = uiActive === 0;
  const isLast = uiActive === events.length - 1;

  useLayoutEffect(() => {
    registerGSAP();
    if (!headingRef.current || !sliderRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );

      tl.fromTo(
        sliderRef.current,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4",
      );
    }, sectionRef);

    return () => {
      if (uiUpdateTimeoutRef.current) {
        clearTimeout(uiUpdateTimeoutRef.current);
        uiUpdateTimeoutRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      data-cursor="light"
      className="relative mt-6 py-14 md:py-20 flex flex-col items-center px-6 md:px-0"
    >
      <div
        className="absolute inset-0 blur-[250px]"
        style={{
          background: "radial-gradient(circle, #00DBFF24 0%, transparent 100%)",
        }}
      ></div>
      {/* BACKGROUND */}
      <div className="absolute inset-0 left-0 z-0 pointer-events-none">
        <Image
          src={backgroundImage}
          alt="bg-1"
          height={250}
          width={250}
          className="absolute bottom-[30%] left-[6%]"
        />
      </div>

      {/* HEADING */}
      <div className="app-container">
        <div ref={headingRef} className="relative z-10">
          <MicroHeader title={tag} description={heading} />
          <p
            className={`${blauerNue.className} text-center text-[#0F3C78] font-light lg:leading-[24px] tracking-[0.5px] max-w-[818px]`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* RIGHT NEXT */}
      {!isLast && (
        <div
          onClick={() => swiperRef.current?.slideNext()}
          className={`absolute lg:block hidden  right-8 lg:right-3 2xl:right-12 top-[72%] lg:top-[60%] lg:-translate-y-1/2 text-[#0F3C78] cursor-pointer ${agency.className} font-normal text-center`}
        >
          <p className="opacity-50 text-sm">Next</p>
          <div className="flex items-center flex-col gap-2 mt-1 justify-start">
            <p className="text-xl tracking-[-0.5px] lg:leading-[32px] max-w-[150px]">
              {events[uiActive + 1]?.title}
            </p>
            <span>
              <Image src={arrowIcon} alt="next" width={17} height={17} />
            </span>
          </div>
        </div>
      )}

      {/* LEFT PREV */}
      {!isFirst && (
        <div
          onClick={() => swiperRef.current?.slidePrev()}
          className={`absolute lg:block hidden left-8 lg:left-3 2xl:left-12 top-[72%] lg:top-[60%] lg:-translate-y-1/2 text-[#0F3C78] cursor-pointer ${agency.className} font-normal text-center`}
        >
          <p className="opacity-50 text-sm">Prev</p>
          <div className="flex items-center flex-col gap-2 mt-1 justify-end">
            <p className="text-xl tracking-[-0.5px] max-w-[150px]">
              {events[uiActive - 1]?.title}
            </p>
            <span>
              <Image
                src={arrowIcon}
                alt="previous"
                width={17}
                height={17}
                className="rotate-180"
              />
            </span>
          </div>
        </div>
      )}
      {/* SLIDER WRAPPER */}
      <div
        ref={sliderRef}
        className="w-full max-w-5xl mt-16 z-10 lg:px-18 2xl:px-2"
      >
        <Swiper
          modules={[]}
          speed={900}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActive(swiper.activeIndex);

            if (uiUpdateTimeoutRef.current) {
              clearTimeout(uiUpdateTimeoutRef.current);
            }

            uiUpdateTimeoutRef.current = setTimeout(() => {
              setUiActive(swiper.activeIndex);
            }, 900);
          }}
          className="w-full"
        >
          {events.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  index === active
                    ? "opacity-100 scale-100 translate-x-0"
                    : index < active
                      ? "opacity-0 scale-95 -translate-x-10"
                      : "opacity-0 scale-95 translate-x-10"
                }`}
              >
                {/* IMAGE */}
                <div className="relative h-[220px] md:h-[450px] w-full rounded-[18px] overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>

                <div className="py-5 lg:hidden flex items-center border-b border-[#0F3C78]/20">
                  {!isFirst && (
                    <span onClick={() => swiperRef.current?.slidePrev()}>
                      <Image
                        src={arrowIcon}
                        alt="previous"
                        width={17}
                        height={17}
                        className="rotate-180"
                      />
                    </span>
                  )}
                  <h5
                    className={`text-xl font-normal tracking-[-0.5px] text-center text-[#0F3C78] mx-auto ${agency.className}`}
                  >
                    {slide.title}
                  </h5>
                  {!isLast && (
                    <span onClick={() => swiperRef.current?.slideNext()}>
                      <Image
                        src={arrowIcon}
                        alt="next"
                        width={17}
                        height={17}
                      />
                    </span>
                  )}
                </div>

                {/* BOTTOM INFO */}
                <div className="grid grid-cols-2 md:grid-cols-3 mt-8 text-[#0F3C78] gap-y-6">
                  {/* 1 */}
                  <div>
                    <p className={`text-sm opacity-50 ${agency.className}`}>
                      Year
                    </p>
                    <p
                      className={`${blauerNue.className} text-base font-normal tracking-[0.5px] mt-2`}
                    >
                      {slide.year}
                    </p>
                  </div>

                  {/* 2 */}
                  <div>
                    <p className={`text-sm opacity-50 ${agency.className}`}>
                      Event Name
                    </p>
                    <p
                      className={`${blauerNue.className} text-base font-normal max-w-[180px] lg:leading-[24px] tracking-[0.5px] mt-2`}
                    >
                      {slide.title}
                    </p>
                  </div>

                  {/* 3 (Action) */}
                  <div className="col-span-2 md:col-span-1 flex justify-start">
                    <div>
                      <p className={`text-sm opacity-50 ${agency.className}`}>
                        Action
                      </p>

                      <Link
                        href="/csr"
                        className="group flex items-center gap-1 cursor-pointer justify-center md:justify-start"
                      >
                        <p
                          className={`${blauerNue.className} relative inline-block mr-1 text-base font-normal tracking-[0.5px] mt-2`}
                        >
                          View More Details
                          <span className="pointer-events-none absolute left-0 bottom-0 h-[1.5px] w-full bg-[#0F3C78] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                        </p>

                        <span>
                          <Image
                            src={arrowIcon}
                            alt="next"
                            width={15}
                            height={15}
                            className="-rotate-45 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
