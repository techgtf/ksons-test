"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import NextImage from "next/image";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import CommonBtn from "../common/CommonBtn";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";

export type SliderItem = {
  slug: string;
  title: string;
  label: string;
  description: string;
  files: {
    featured_desktop_file: string;
    featured_mobile_file: string;
  };
};

export type SliderProps = {
  slides: SliderItem[];
  buttonText?: string;
  buttonIcon?: string;
};

export function Slider({
  slides,
  buttonText = "Explore",
  buttonIcon = "/images/home/arrow2.png",
}: SliderProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<any>(null);

  useLayoutEffect(() => {
    slides.forEach((slide) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = slide.files.featured_desktop_file;
      }
    });
  }, [slides]);

  useLayoutEffect(() => {
    registerGSAP();
    if (!sectionRef.current) return;
    if (window.innerWidth < 768) return;

    const total = slides.length - 1;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${slides.length * window.innerHeight}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const index = Math.round(self.progress * total);
          setActive(index);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [slides.length]);

  const handlePanelClick = (i: number) => {
    if (i === active) return;
    if (!triggerRef.current) return;
    const start = triggerRef.current.start;
    const end = triggerRef.current.end;
    const total = slides.length - 1;
    const targetScroll = start + (i / total) * (end - start);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={sectionRef}
      className="relative h-screen md:block hidden w-full overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `
                url(${slide.files.featured_desktop_file})
              `,
            }}
          />
        ))}
      </div>

      {/* PANELS */}
      <div className="relative flex h-full">
        {slides.map((slide, i) => {
          const isActive = i === active;

          return (
            <div
              key={i}
              onClick={() => handlePanelClick(i)}
              className="relative grow overflow-hidden cursor-pointer transition-all duration-700"
              style={{
                flexGrow: isActive ? 7 : 1,
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* BOTTOM TEXT OVERLAY */}
              <div
                className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
                style={{
                  height: "65%",
                  background: `linear-gradient(to top,
                        rgba(0,0,0,0.68) 0%,
                        rgba(0,0,0,0.48) 28%,
                        rgba(0,0,0,0.20) 55%,
                        rgba(0,0,0,0.00) 100%
                      )`,
                }}
              />
              {/* BLUR */}
              {!isActive && (
                <div className="absolute inset-0 backdrop-blur-[5px] bg-black/20" />
              )}

              {/* DIVIDER */}
              <div className="absolute right-0 top-0 h-full w-px bg-white/30" />

              {/* ACTIVE CONTENT */}
              <div
                className={`absolute inset-0 z-10 flex items-end px-16 py-24 text-white transition-all duration-500 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 pointer-events-none"
                }`}
              >
                <div className={`${blauerNue.className}`}>
                  <div className="flex items-center gap-3">
                    <NextImage
                      src={"/images/about/about-bullet.png"}
                      alt="bullet"
                      height={15}
                      width={15}
                      className="brightness-0 invert"
                    />
                    <p className="capitalize tracking-[0.5px] leading-5">
                      {slide.label}
                    </p>
                  </div>

                  <h1 className="mt-9 text-[24px] font-medium lg:text-[36px] lg:leading-[20px] capitalize tracking-[0.5px]">
                    {slide.title}
                  </h1>

                  <p className="mt-9 mb-11.5 font-light max-w-[402px]">
                    {slide.description.length > 90
                      ? slide.description.slice(0, 80) + "..."
                      : slide.description}
                  </p>
                  <CommonBtn
                    variant="outline"
                    href={`/${slide?.slug}`}
                    rightIcon={
                      <NextImage
                        src={buttonIcon}
                        alt="button arrow"
                        width={20}
                        height={20}
                      />
                    }
                  >
                    {buttonText}
                  </CommonBtn>
                </div>
              </div>

              {/* COLLAPSED LABEL */}
              <div
                className={`absolute inset-0 flex items-end justify-center transition-opacity duration-300 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <span
                  className={`${blauerNue.className} mb-30 capitalize tracking-[0.5px] lg:leading-[20px] font-medium text-[24px] lg:text-[36px] text-white whitespace-nowrap`}
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {slide.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileSlider({
  slides,
  buttonText = "Explore",
  buttonIcon = "/images/home/arrow2.png",
}: SliderProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    registerGSAP();
    if (!sectionRef.current) return;
    if (window.innerWidth >= 768) return;

    const total = slides.length - 1;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${slides.length * window.innerHeight}`,
        pin: true,
        scrub: 0.8, // smoother scroll sync
        anticipatePin: 1,
        fastScrollEnd: true,

        onUpdate: (self) => {
          const index = Math.round(self.progress * total);
          setActive(index);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [slides.length]);

  return (
    <section
      ref={sectionRef}
      className="md:hidden block h-screen relative overflow-hidden bg-black"
    >
      {/* Background Images */}
      {slides.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <NextImage
            fill
            src={item.files.featured_mobile_file}
            alt={item.title}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Foreground */}
      <div className="relative z-10 h-full pb-8 flex flex-col text-white">
        {/* Top Fixed Stack (Scrolled headings) */}
        {slides.slice(0, active).map((item, index) => (
          <div
            key={index}
            className={`h-[62px] shrink-0 border-b border-white/40 backdrop-blur-[2px] flex items-center justify-center tracking-[0.5px] font-medium text-[22px] ${blauerNue.className}`}
          >
            {item.label}
          </div>
        ))}

        {/* Active Expanded Card */}
        <div
          className={`${blauerNue.className} flex-1 flex items-center justify-center px-6`}
        >
          <div>
            <div className="flex items-center gap-3">
              <NextImage
                src={"/images/about/about-bullet.png"}
                alt="bullet"
                height={15}
                width={15}
                className="brightness-0 invert"
              />
              <p className="capitalize tracking-[0.5px] leading-5">
                {slides[active].label}
              </p>
            </div>

            <h2 className="text-[24px] font-medium tracking-[0.5px]">
              {slides[active].title}
            </h2>

            <p className="mt-5 pera leading-6 opacity-90 pb-6">
              {slides[active].description.length > 90
                ? slides[active].description.slice(0, 80) + "..."
                : slides[active].description}
            </p>
            <CommonBtn
              variant="outline"
              href={`/${slides[active].slug}`}
              rightIcon={
                <NextImage
                  src={buttonIcon}
                  alt="button arrow"
                  height={20}
                  width={20}
                />
              }
            >
              {buttonText}
            </CommonBtn>
          </div>
        </div>

        {/* Bottom Remaining Queue */}
        {slides.slice(active + 1).map((item, index) => (
          <div
            key={index}
            className={`h-[62px] shrink-0 border-t border-white/40 backdrop-blur-[2px] flex items-center justify-center capitalize tracking-[0.5px] font-medium text-[22px] ${blauerNue.className}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

const SliderContainer = ({ slides, buttonText, buttonIcon }: SliderProps) => {
  return (
    <>
      <Slider slides={slides} buttonText={buttonText} buttonIcon={buttonIcon} />
      <MobileSlider
        slides={slides}
        buttonText={buttonText}
        buttonIcon={buttonIcon}
      />
    </>
  );
};

export default SliderContainer;
