"use client";

import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import { useReveal } from "../../hooks/useReveal";
import { useSlideY } from "../../hooks/useSlideY";
import CommonBtn from "../common/CommonBtn";

export type AboutProps = {
  tag: string;
  heading: string;
  description: string;
  buttonText: string;
  image: string;
  smallText: string;
};

export default function About({
  tag,
  heading,
  description,
  buttonText,
  image,
}: AboutProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const numberRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);

  useReveal(bgImgRef, { direction: "bottom" });
  useSlideY({ target: titleRef, direction: "up" });
  useSlideY({ target: numberRef, direction: "up" });
  useSlideY({ target: headingRef, direction: "down" });
  useReveal(descRef, { direction: "top" });

  // useLayoutEffect(() => {
  //     registerGSAP();
  //     const el = contentRef.current;

  //     if (!el) return;

  //     const ctx = gsap.context(() => {
  //         gsap.fromTo(
  //             el,
  //             {
  //                 x: -100,
  //                 opacity: 0,
  //             },
  //             {
  //                 x: 0,
  //                 opacity: 1,
  //                 duration: 1,
  //                 ease: "power3.out",
  //                 scrollTrigger: {
  //                     trigger: el,
  //                     start: "top 65%",
  //                     toggleActions: "play none none reverse",
  //                 },
  //             }
  //         );
  //     }, sectionRef);

  //     return () => ctx.revert();
  // }, []);

  return (
    <div
      ref={sectionRef}
      data-cursor="light"
      className="relative w-full h-[85vh] md:h-screen mt-0 md:mt-10 z-100"
    >
      {/* Background Image */}
      <Image
        ref={bgImgRef}
        src={image}
        alt={tag}
        fill
        className="object-contain object-bottom md:object-fill"
      />

      {/* Content Overlay */}
      <div className="absolute top-10 flex">
        <div
          ref={contentRef} // 👈 attach ref here
          className="ml-6 md:ml-20 max-w-sm md:max-w-lg text-[#0F3C78]"
        >
          <div className="2xl:mt-12 mb-10 2xl:mb-20 mb-6">
            <p
              ref={titleRef}
              className={`${blauerNue.className} lg:text-[18px] flex items-center lg:leading-[20px] gap-3 tracking-[0.5px]`}
            >
              <Image
                src={"/images/about/about-bullet.png"}
                alt="bullet"
                height={16}
                width={16}
              />{" "}
              {tag}
            </p>

            <div className="relative w-[190px] h-[100px] md:w-[290px] md:h-[170px] mt-[-12px] mb-[-30px] md:mb-[-39px]">
              <Image
                ref={numberRef}
                src="/images/home/about-30.png"
                alt="30 years of experience"
                fill
                className="object-fill"
              />
            </div>

            <h1
              ref={headingRef}
              className={`${agency.className} text-[24px] lg:text-[36px] font-normal lg:leading-[46px]`}
            >
              {heading}
            </h1>

            <p
              ref={descRef}
              className={`${blauerNue.className} mt-4 2xl:mt-6 lg:leading-[24px] font-light tracking-[0.5px]`}
            >
              {description}
            </p>
          </div>

          <CommonBtn
            href={`/about`}
            variant="primary"
            className="shadow-[0_2px_2px_0_rgba(0,0,0,0.2)]"
            rightIcon={
              <Image
                src={"/images/icons/arrow-up.svg"}
                alt="arrow"
                width={12}
                height={14}
              />
            }
          >
            {" "}
            {buttonText}
          </CommonBtn>

          {/* <button
                        className={`${blauerNue.className} mt-6 px-6 py-3 text-xs md:text-sm text-white rounded-[100px] tracking-[1.2px] flex items-center bg-[#0F3C78]`}
                        style={{
                            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        {buttonText}
                        <span className="inline-block ml-2">
                            <Image
                                src="/images/home/arrow.svg"
                                alt="arrow"
                                width={0}
                                height={0}
                                className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-3 lg:h-3"
                            />
                        </span>
                    </button> */}
        </div>
      </div>
    </div>
  );
}
