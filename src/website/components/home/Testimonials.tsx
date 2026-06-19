"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, registerGSAP } from "../../utils/gsap";
import { useSlideX } from "../../hooks/useSlideX";
import MicroHeader from "../projects/micro/MicroHeader";

export type TestimonialItem = {
  name: string;
  role: string;
  image: string;
  text: string;
};

export type TestimonialsProps = {
  tag: string;
  heading: string;
  testimonials: TestimonialItem[];
  bgImage?: string;
  triangleIcon?: string;
  quoteIcon?: string;
  arrowIcon?: string;
  bgImg?: boolean;
};

export default function Testimonials({
  tag,
  heading,
  testimonials = [],
  bgImage = "/images/home/testimonial-bg.png",
  triangleIcon = "/images/home/testimonial-triangle.svg",
  quoteIcon = "/images/home/testimonial-quote.png",
  bgImg = true,
}: TestimonialsProps) {
  const headingRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const leftTriangle = useRef<HTMLImageElement | null>(null);
  const rightTriangle = useRef<HTMLImageElement | null>(null);

  // useReveal(leftTriangle, { direction: "bottom", duration: 2, delay: 1 });
  // useReveal(rightTriangle, { direction: "bottom", duration: 2, delay: 1 });
  useSlideX({ target: leftTriangle, direction: "left", duration: 2 });
  useSlideX({ target: rightTriangle, direction: "right", duration: 2 });

  useLayoutEffect(() => {
    registerGSAP();
    if (!headingRef.current || !sectionRef.current) return;

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
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3",
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      data-cursor="light"
      ref={wrapperRef}
      id="testimonials"
      className="relative w-full lg:pt-12 pb-12 overflow-x-hidden"
    >
      {/* Glow Background */}
      <div
        className="absolute inset-0 blur-[250px]"
        // style={{
        //   background: "radial-gradient(circle, #00DBFF24 0%, transparent 100%)",
        // }}
      />
      {/* Heading */}
      <div className="app-container">
        <div ref={headingRef}>
          <MicroHeader
            title={tag}
            description={heading}
            titleColor="#005e96"
            descriptionColor="#005e96"
          />
        </div>
      </div>

      {/* BG IMAGES */}

      {bgImg && (
        <>
          {" "}
          <Image
            ref={leftTriangle}
            className="absolute top-1/2 left-[8%] -translate-y-1/2"
            src={bgImage}
            alt="bg-left"
            width={250}
            height={250}
          />
          <Image
            ref={rightTriangle}
            className="absolute top-1/2 right-[8%] -translate-y-1/2"
            src={bgImage}
            alt="bg-right"
            width={250}
            height={250}
          />
        </>
      )}

      {/* SLIDER */}
      <div
        ref={sectionRef}
        className="relative flex justify-center items-center"
      >
        <Swiper
          modules={[Navigation, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          centeredSlides
          loop
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          className="w-full max-w-[1000px] px-4 md:px-0 relative"
        >
          {testimonials.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left py-4">
                {/* IMAGE */}
                <div className="rounded-full flex items-center justify-center w-[300px] h-[300px] shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="rounded-full object-cover"
                  />
                </div>

                {/* TRIANGLE */}
                <div
                  className="hidden md:flex items-center justify-center self-center transition-transform duration-700 ease-in-out shrink-0 rotate-30"
                  style={{ transform: `rotate(${activeIndex * 120}deg)` }}
                >
                  <Image
                    src={triangleIcon}
                    height={80}
                    width={80}
                    alt="arrow"
                  />
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 flex flex-col items-center md:items-start">
                  <div className="relative pl-0 md:pl-12 pr-0 md:pr-12">
                    <Image
                      src={quoteIcon}
                      alt="left quote"
                      width={40}
                      height={38}
                      className="absolute left-0 top-0 scale-x-[-1] md:block hidden"
                    />
                    <p
                      className={`${blauerNue.className} text-[#183E60] text-[15px] font-light mt-8 relative max-w-[331px] md:max-w-[480px] tracking-[0.5px] leading-6 text-pretty`}
                    >
                      {item.text}
                      <Image
                        src={quoteIcon}
                        alt="right quote"
                        width={40}
                        height={38}
                        className="right-2 -bottom-4 md:inline-block hidden ml-2"
                      />
                    </p>
                  </div>

                  {/* NAME */}
                  <h3
                    className={`${agency.className} mt-10 mb-1 md:pl-12 text-[#005E96] text-[22px] lg:leading-[35px] leading-[30px] tracking-[0.5px]`}
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`${blauerNue.className} capitalize text-base text-[#005587]/50 leading-[22px] tracking-[0.5px] md:pl-12`}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* CONTROLS (Dots & Navigation) */}
          <div className="w-full flex items-center justify-between mt-8 md:pl-[calc(50%+2rem)] px-4 md:px-0">
            <div className="custom-pagination flex gap-2 m-0 p-0 items-center justify-center lg:justify-start w-full" />
            {/* desktop */}
            <div className="md:flex gap-6 hidden">
              <Image
                src="/images/home/testimonial-arrow.png"
                alt="arrow"
                width={17}
                height={17}
                className="rotate-180 prev-btn cursor-pointer"
              />
              <Image
                src="/images/home/testimonial-arrow.png"
                alt="arrow"
                width={17}
                height={17}
                className="next-btn cursor-pointer"
              />
            </div>
            {/* Mobile */}
            <div className="md:hidden flex w-[90%] mx-auto absolute z-2 left-4 right-4 bottom-[42%] justify-between">
              <Image
                src="/images/home/testimonial-arrow.png"
                alt="arrow"
                width={17}
                height={17}
                className="rotate-180 prev-btn cursor-pointer"
              />
              <Image
                src="/images/home/testimonial-arrow.png"
                alt="arrow"
                width={17}
                height={17}
                className="next-btn cursor-pointer"
              />
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
}
