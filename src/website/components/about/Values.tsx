"use client";
import { agency } from "@/src/app/fonts";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import SectionHeader from "../common/SectionHeader";
import { gsap, registerGSAP } from "../../utils/gsap";
import MicroHeader from "../projects/micro/MicroHeader";

type ValuesItem = {
  id: number;
  title: string;
  description: string;
};

export interface OurValues {
  data: ValuesItem[];
  bgImage: string;
}

export default function Values({ data, bgImage }: OurValues) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const flexCardsRef = useRef<HTMLDivElement | null>(null);
  const imageScaleRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    registerGSAP();
    if (!flexCardsRef.current) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(max-width: 1023px)", () => {
        const cards = gsap.utils.toArray(".values-content-card");

        gsap.set(cards, {
          x: 120,
          opacity: 0,
        });

        gsap.to(cards, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: flexCardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.set(".our-values-card-left", { x: 200, opacity: 0 });
        gsap.set(".our-values-card-right", { x: -200, opacity: 0 });
        gsap.set(imageScaleRef.current, { scale: 0.7, opacity: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: flexCardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
          .to(
            ".our-values-card-left",
            {
              x: 0,
              opacity: 1,
              duration: 1,
            },
            0,
          )
          .to(
            ".our-values-card-right",
            {
              x: 0,
              opacity: 1,
              duration: 1,
            },
            0,
          )
          .to(
            imageScaleRef.current,
            {
              scale: 1,
              opacity: 1,
              duration: 1,
            },
            0,
          );
      });
    }, flexCardsRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const title = "Our Values";
  const description =
    "Built on Principles, Driven by Purpose—Values that Shape Every Step Forward.";

  if (!data) return null;

  return (
    <div
      data-cursor="light"
      ref={sectionRef}
      className="values-section pt-18 lg:pt-25 overflow-x-hidden"
    >
      <div className="relative pb-0 lg:pb-30">
        {/* <SectionHeader
                    tag="Our Values"
                    heading="Our Values: Guiding Principles We Stand By"
                    bulletType="triangle"
                    bulletImage="/images/about/about-bullet.png"
                /> */}
        <MicroHeader title={title} description={description} />
      </div>
      <div ref={flexCardsRef} className="app-container relative">
        <div className="lg:flex w-full justify-between space-y-8 lg:space-y-0 top-card">
          {data.slice(0, 2).map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              className={
                index === 0 ? "our-values-card-left" : "our-values-card-right"
              }
            />
          ))}
        </div>
        <div
          ref={imageScaleRef}
          className="bg-image lg:absolute w-fit left-0 right-0 mx-auto 2xl:-top-4 top-0 lg:pt-0 pt-20 lg:block hidden"
        >
          <Image
            width={300}
            height={300}
            src={bgImage}
            alt="bg-image"
            className="w-[350px] 2xl:w-[400px] h-full object-cover"
          />
        </div>
        <div className="lg:flex w-full justify-center space-y-8 lg:space-y-0 bottom-card gap-[10%] pt-20">
          {data.slice(2, 4).map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              className={
                index === 0 ? "our-values-card-left" : "our-values-card-right"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type ContentCardProps = {
  item: ValuesItem;
  className?: string;
};

const ContentCard = ({ item, className }: ContentCardProps) => {
  return (
    <div
      key={item.id}
      className={`p-10 values-content-card text-(--blue) ${className} rounded-[10px] w-full lg:w-[31%] flex flex-col justify-center`}
      style={{
        borderColor: "rgba(15, 60, 120, 0.06)",
        background:
          "linear-gradient(180deg, rgba(51, 211, 238, 0.07) 0%, rgba(15, 60, 120, 0.07) 100%)",
      }}
    >
      <h4
        className={`${agency.className} text-[18px] lg:text-[22px] lg:leading-[32px] -tracking-[0.5px]`}
      >
        {item.title}
      </h4>
      <p className="pt-4 pera tracking-[0.5px]">{item.description}</p>
    </div>
  );
};

// const cards = gsap.utils.toArray(".content-card");

// cards.forEach((card: any) => {

//     const handleMouseMove = (e: MouseEvent) => {
//         const rect = card.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const rotateX = ((y / rect.height) - 0.5) * -10;
//         const rotateY = ((x / rect.width) - 0.5) * 10;

//         gsap.to(card, {
//             rotateX,
//             rotateY,
//             transformPerspective: 800,
//             ease: "power2.out",
//             duration: 0.3
//         });
//     };

//     const handleLeave = () => {
//         gsap.to(card, {
//             rotateX: 0,
//             rotateY: 0,
//             ease: "power3.out",
//             duration: 0.5
//         });
//     };

//     card.addEventListener("mousemove", handleMouseMove);
//     card.addEventListener("mouseleave", handleLeave);

// });

// 'use client';

// import Image from "next/image";
// import { agency, blauerNue } from "@/src/app/fonts";
// import SectionHeader from "../common/SectionHeader";
// import { useRef, useLayoutEffect } from "react";
// import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";

// const ValueCard = ({ title, desc }: { title: string; desc: string }) => (
//     <div className="text-center px-4 py-10">
//         <h5 className={`${agency.className} text-[#0F3C78] text-[20px]`}>
//             {title}
//         </h5>
//         <p className={`${blauerNue.className} font-light text-sm leading-[22px] tracking-[0.5px] text-[#0F3C78] mt-2`}>
//             {desc}
//         </p>
//     </div>
// );

// export default function Values() {
//     const sectionRef = useRef<HTMLDivElement | null>(null);
//     const imageWrapperRef = useRef<HTMLDivElement | null>(null);
//     const triangleRef = useRef<HTMLImageElement | null>(null);

//     useLayoutEffect(() => {
//         registerGSAP();

//         const ctx = gsap.context(() => {
//             requestAnimationFrame(() => {
//                 const parent = imageWrapperRef.current?.parentElement;
//                 const height = parent ? parent.getBoundingClientRect().height : 500;

//                 gsap.set(imageWrapperRef.current, {
//                     height: 0,
//                 });

//                 // IMPORTANT: scale from bottom center
//                 gsap.set(triangleRef.current, {
//                     y: 0,
//                     scaleX: 4,
//                     scaleY: 4,
//                     transformOrigin: "center bottom",
//                 });

//                 const isMobile = typeof window !== "undefined"
//                     ? window.matchMedia("(max-width: 1023px)").matches
//                     : false;

//                 const tl = gsap.timeline({
//                     scrollTrigger: {
//                         trigger: sectionRef.current,
//                         start: isMobile ? "top 40%" : "top 20%",
//                         toggleActions: "play none none reverse",
//                         invalidateOnRefresh: true,
//                         anticipatePin: 1,
//                     },
//                 });

//                 // image reveal
//                 tl.to(imageWrapperRef.current, {
//                     height: height,
//                     duration: 1.2,
//                     ease: "power3.out",
//                 });

//                 // triangle moves + shrinks
//                 tl.to(
//                     triangleRef.current,
//                     {
//                         y: -height,
//                         scaleX: 1,
//                         scaleY: 1,
//                         duration: 1.2,
//                         ease: "power3.out",
//                     },
//                     0
//                 );
//             });

//         }, sectionRef);

//         return () => ctx.revert();
//     }, []);

//     return (
//         <div ref={sectionRef} className="relative mt-6 py-10 flex items-center justify-center flex-col">
//             <SectionHeader
//                 tag="Our Values"
//                 heading="Our Values: Guiding Principles We Stand By"
//                 bulletType="triangle"
//                 bulletImage="/images/about/about-bullet.png"
//             />

//             <div className="mt-16 w-full max-w-7xl px-5 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-10">

//                 {/* LEFT (desktop) */}
//                 <div className="hidden lg:flex w-1/4 flex-col items-center justify-center gap-30">
//                     <ValueCard
//                         title="Trust Built Through Conduct:"
//                         desc="Credibility is established through consistent action over time, not through assertion or visibility."
//                     />
//                     <ValueCard
//                         title="Progress with Perspective:"
//                         desc="Growth is guided by experience and foresight, advancing with clarity rather than acceleration."
//                     />
//                 </div>

//                 {/* CENTER IMAGE (SINGLE INSTANCE) */}
//                 <div className="w-full lg:w-2/4 relative flex flex-col items-center justify-end order-1 lg:order-none">

//                     {/* triangle */}
//                     <div ref={triangleRef} className="absolute bottom-0 z-10 flex justify-center">
//                         <Image
//                             src="/images/home/value-triangle.png"
//                             alt="Triangle image"
//                             width={60}
//                             height={60}
//                             className="w-[50px] lg:w-[60px] h-auto"
//                         />
//                     </div>

//                     <div className="relative w-full h-[400px] lg:h-[540px]">
//                         <div
//                             ref={imageWrapperRef}
//                             className="absolute bottom-0 left-0 w-full overflow-hidden will-change-[height]"
//                             style={{ height: 0 }}
//                         >
//                             <div className="absolute bottom-0 left-0 w-full h-[400px] lg:h-[540px]">
//                                 <Image
//                                     src="/images/about/values-center.png"
//                                     alt="Values center"
//                                     height={1000}
//                                     width={1000}
//                                     className="object-contain h-full w-full"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT (desktop) */}
//                 <div className="hidden lg:flex w-1/4 flex-col items-center justify-center gap-30">
//                     <ValueCard
//                         title="Innovation that Strengthens Structure:"
//                         desc="Innovation is applied where it enhances planning, relevance and readiness, without introducing volatility."
//                     />
//                     <ValueCard
//                         title="Reliability Across Cycles:"
//                         desc="The brand remains steady through market shifts, supporting decisions that carry long-term consequences."
//                     />
//                 </div>

//                 {/* MOBILE SWIPER (ONLY this is conditional) */}
//                 <div className="w-full lg:hidden order-2">
//                     <Swiper
//                         modules={[Pagination]}
//                         spaceBetween={20}
//                         slidesPerView={1}
//                         pagination={{ clickable: true }}
//                     >
//                         <SwiperSlide>
//                             <ValueCard
//                                 title="Trust Built Through Conduct:"
//                                 desc="Credibility is established through consistent action over time, not through assertion or visibility."
//                             />
//                         </SwiperSlide>

//                         <SwiperSlide>
//                             <ValueCard
//                                 title="Progress with Perspective:"
//                                 desc="Growth is guided by experience and foresight, advancing with clarity rather than acceleration."
//                             />
//                         </SwiperSlide>

//                         <SwiperSlide>
//                             <ValueCard
//                                 title="Innovation that Strengthens Structure:"
//                                 desc="Innovation is applied where it enhances planning, relevance and readiness, without introducing volatility."
//                             />
//                         </SwiperSlide>

//                         <SwiperSlide>
//                             <ValueCard
//                                 title="Reliability Across Cycles:"
//                                 desc="The brand remains steady through market shifts, supporting decisions that carry long-term consequences."
//                             />
//                         </SwiperSlide>
//                     </Swiper>
//                 </div>
//             </div>
//         </div>
//     )
// }
