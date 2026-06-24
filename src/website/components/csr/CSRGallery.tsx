"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { gsap, ScrollTrigger } from "@/src/website/utils/gsap";
import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import WaterMark from "../common/WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventItem {
  id: string | number;
  title: string;
  year: number;
  description: string[];
  images: {
    url: string;
    mainLabel?: string;
  }[];
  mainLabel?: string;
}

interface CSRGalleryProps {
  title?: string;
  description?: string;
  long_description?: string;
  events?: EventItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CSRGallery({
  title,
  description,
  long_description,
  events = [],
}: CSRGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = contentRefs.current.filter(Boolean) as HTMLDivElement[];

      // Pin the sticky sidebar
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: stickyRef.current,
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
        scrub: true,
      });

      // Switch active tab based on scroll position
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });

      // Recalculate ScrollTrigger positions
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [events]);

  const scrollToPanel = (index: number) => {
    const panel = contentRefs.current[index];
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div data-cursor="light" className="pt-16 lg:pt-26">
      <div className="app-container">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-28">
          <div className="flex items-center gap-5 mb-6 md:mb-10">
            <Image
              src="/images/about/about-bullet.png"
              alt="Icon"
              width={16}
              height={16}
            />
            <span
              className={`${blauerNue.className} text-[#0F3C78] text-[14px] md:text-[18px] leading-[20px] tracking-[0.5px] capitalize`}
            >
              {title}
            </span>
          </div>
          <h2
            className={`${agency.className} text-[#0F3C78] text-[24px] md:text-[36px] mb-6 md:mb-8 lg:max-w-[755px]`}
          >
            {description}
          </h2>
          <p
            className={`${blauerNue.className} text-[#0F3C78] text-[14px] lg:text-base lg:max-w-[818px] tracking-[0.5px] leading-[24px]`}
          >
            {long_description}
          </p>
        </div>

        {/* Vertical Timeline With Images */}
        <section ref={sectionRef} className="relative bg-white overflow-hidden">
          {/* ── Background Shape ── */}

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row">
              {/* ─────────────── LEFT — Sticky Tabs ─────────────── */}
              <div
                ref={stickyRef}
                className="hidden lg:flex flex-col justify-center w-1/3 h-screen"
              >
                <nav className="space-y-6">
                  {events.map((ev, i) => (
                    <button
                      key={ev.id}
                      onClick={() => scrollToPanel(i)}
                      className={`block text-left transition-all duration-500 max-w-[274px] text-[#0F3C78] lg:text-[18px] text-[16px] tracking-[-0.5px] lg:leading-[29px] ${
                        agency.className
                      } ${
                        i === activeIndex
                          ? "opacity-100 border-b border-[#0F3C78] pb-1"
                          : "opacity-50 hover:opacity-70 border-b border-transparent"
                      }`}
                    >
                      {ev.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* ─────────────── RIGHT — Scrolling Content ─────────────── */}
              <div className="w-full lg:w-2/3">
                {events.map((ev, i) => (
                  <div
                    key={ev.id}
                    ref={(el) => {
                      contentRefs.current[i] = el;
                    }}
                    className="lg:min-h-screen flex flex-col justify-center py-8 lg:py-10"
                  >
                    {/* Image Slider */}
                    <div className="relative mb-12">
                      <Swiper
                        modules={[Navigation, Pagination, EffectFade]}
                        navigation={{
                          prevEl: `.prev-${ev.id}`,
                          nextEl: `.next-${ev.id}`,
                        }}
                        pagination={{
                          el: `.csr-pagination-${ev.id}`,
                          clickable: true,
                        }}
                        effect="fade"
                        loop
                        className="rounded-[20px] overflow-hidden aspect-video"
                      >
                        {ev.images.map((img, idx) => (
                          <SwiperSlide key={idx} className="relative">
                            <Image
                              src={img.url}
                              alt={ev.title}
                              width={800}
                              height={500}
                              className="w-full h-full object-cover"
                              priority
                            />
                            <div className="absolute  right-5  bottom-5">
                              <WaterMark
                                textColor="text-white"
                                opacity="opacity-100"
                                label={getDisplayLabel(img?.mainLabel || ev?.mainLabel || "")}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="triangle absolute lg:block hidden -left-[13%] top-[50%]">
                        <Image
                          width={235}
                          height={235}
                          src="/images/csr/csr-triangle.svg"
                          alt="triangle"
                          className="object-cover"
                        />
                      </div>

                      {/* Custom Navigation Buttons */}
                      <button
                        className={`prev-${ev.id} absolute lg:left-6 left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-14 lg:h-14 bg-white/80 rounded-full flex items-center justify-center transition-all  active:scale-95 hover:bg-white`}
                      >
                        <Image
                          src="/images/home/testimonial-arrow.png"
                          alt="arrow"
                          width={17}
                          height={17}
                          className="rotate-180 prev-btn cursor-pointer"
                        />
                      </button>
                      <button
                        className={`next-${ev.id} absolute lg:right-6 right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-14 lg:h-14 bg-white/80 rounded-full flex items-center justify-center transition-all active:scale-95 hover:bg-white`}
                      >
                        <Image
                          src="/images/home/testimonial-arrow.png"
                          alt="arrow"
                          width={17}
                          height={17}
                          className="next-btn cursor-pointer"
                        />
                      </button>
                    </div>

                    {/* Content Section */}

                    <div className="flex items-end justify-between mb-4 lg:mb-8">
                      <h2
                        className={`${agency.className} text-[#0F3C78] block lg:hidden lg:text-[24px] text-[16px] tracking-[-0.5px] `}
                      >
                        {ev.title}
                      </h2>
                      <p
                        className={`${agency.className} text-[#0F3C78]/50 text-sm tracking-[0.5px] lg:leading-[32px]`}
                      >
                        Year{" "}
                        <span
                          className={`${blauerNue.className} text-[#0F3C78] text-base lg:leading-[24px] tracking-[0.5px] ml-[10px]`}
                        >
                          {ev.year}
                        </span>
                      </p>
                    </div>

                    <div className="w-full h-px bg-black/10 mb-4 lg:mb-8" />

                    <div className="space-y-4">
                      {ev.description.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={`${blauerNue.className} text-[#0F3C78] text-[16px] lg:leading-[24px] tracking-[0.5px]`}
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                    <div
                      className={`csr-pagination-${ev.id} csr-pagination mt-6 hidden md:flex items-center gap-2`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
