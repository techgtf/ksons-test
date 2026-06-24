"use client";

import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import WaterMark from "../common/WaterMark";

export type ServiceSlide = {
  title: string;
  desc: string;
  files: {
    mobile: string;
    desktop: string;
    mainLabel?: string;
  };
};

export type ServicesProps = {
  slides: ServiceSlide[];
  scrollText?: string;
  arrowIcon?: string;
};

export default function Services({
  slides,
  scrollText = "SCROLL",
  arrowIcon = "/images/home/services/arrow.svg",
}: ServicesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    registerGSAP();
    if (!sectionRef.current || slides.length <= 1) return;

    const ctx = gsap.context(() => {
      const cards = imageCardsRef.current;
      const contextRef = leftRefs.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${(slides.length - 1) * 100}%`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.round(progress * (slides.length - 1));
            setActiveIndex(index);
          },
        },
      });

      triggerRef.current = tl.scrollTrigger || null;

      cards.forEach((card, index) => {
        if (!card) return;

        if (index !== cards.length - 1) {
          tl.to(
            card,
            {
              yPercent: -120,
              duration: 1,
              ease: "power2.out",
            },
            index,
          );
        }
      });
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const max = slides.length - 1;
      const target = Math.max(0, Math.min(index, max));

      const progress = target / max;
      const scrollY = trigger.start + (trigger.end - trigger.start) * progress;

      gsap.to(window, {
        scrollTo: scrollY,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    [slides.length],
  );

  const handleArrow = (dir: number) => {
    goToSlide(activeIndex + dir);
  };

  return (
    <section
      id="services-section"
      ref={sectionRef}
      data-cursor="dark"
      className="relative pattern-1 py-[50px] md:py-[100px] h-screen md:flex items-center justify-center px-[3%]"
    >
      <div className="relative md:w-full h-[65vh] lg:h-[88vh] 2xl:h-[80vh] mt-[10vh]">
        {slides.map((item: ServiceSlide, index) => (
          <div
            key={index}
            ref={(el) => {
              imageCardsRef.current[index] = el;
            }}
            className="absolute w-full h-full rounded-2xl overflow-hidden"
            style={{
              bottom: `-${index * 0}px`,
              zIndex: slides.length - index,
            }}
          >
            {/* image */}
            <img
              src={item.files.desktop}
              alt={item.title}
              className="object-cover h-full w-full hidden lg:block"
            />
            <img
              src={item.files.mobile}
              alt={item.title}
              className="object-cover h-full w-full lg:hidden block"
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/80" />

            {/* left content */}
            <div
              ref={(el) => {
                leftRefs.current[index] = el;
              }}
              className="max-w-xl text-white absolute left-8 right-8 lg:left-[10%] bottom-[10%] lg:bottom-[20%]"
            >
              <h2
                className={`${agency.className} text-[28px] lg:text-[48px] mb-6`}
              >
                {item.title}
              </h2>
              <p
                className={`${blauerNue.className} font-light tracking-[0.5px] lg:leading-[22px]`}
              >
                {item.desc}
              </p>
            </div>

            {/* watermark */}
            <div className="absolute bottom-4 lg:bottom-14 right-4 z-10">
              <WaterMark
                label={
                  item.files.mainLabel ||
                  (index === slides.length - 1 ? "Actual Image" : "Stock Image")
                }
                opacity="opacity-60"
                textColor="text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
