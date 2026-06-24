"use client";

import Image from "next/image";
import { blauerNue, agency } from "@/src/app/fonts";
import { useRef, useLayoutEffect } from "react";
import { gsap, registerGSAP } from "../../utils/gsap";
import AnimatedTriangle from "../common/AnimatedTriangle";
import WaterMark from "../common/WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

/* ================= TYPES ================= */

export type AboutBannerProps = {
  tag: string;
  heading: string;
  subtext: string;
  mainLabel?: string;

  bulletImage: string;
  bannerImage: string;
  triangleImage: string;
  // bottomIcon: string;
};

/* ================= COMPONENT ================= */

export default function Banner({
  tag,
  heading,
  subtext,
  bulletImage,
  bannerImage,
  triangleImage,
  mainLabel,
}: AboutBannerProps) {
  registerGSAP();

  const headingTextRef = useRef<HTMLDivElement>(null);
  const paraTextRef = useRef<HTMLParagraphElement>(null);
  // const bottomParaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    if (headingTextRef.current) {
      tl.fromTo(
        headingTextRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        1.3,
      );
    }

    if (paraTextRef.current) {
      tl.fromTo(
        paraTextRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        2.3,
      );
    }

    // if (bottomParaRef.current) {
    //     gsap.fromTo(
    //         bottomParaRef.current,
    //         { y: -80, opacity: 0 },
    //         {
    //             y: 0,
    //             opacity: 1,
    //             duration: 1,
    //             ease: "power3.out",
    //             scrollTrigger: {
    //                 trigger: bottomParaRef.current,
    //                 start: "top 70%",
    //                 toggleActions: "play none none reverse",
    //             },
    //         }
    //     );
    // }
  }, []);

  return (
    <div data-cursor="light" className="relative text-[#0F3C78] mt-8 lg:mt-10">
      {/* Heading */}
      <div className="text-center absolute top-10 lg:top-4 2xl:top-10 z-10 pointer-events-none px-6 lg:px-75 flex flex-col w-full items-center">
        <div ref={headingTextRef}>
          <div className="flex relative items-center justify-center gap-2 lg:gap-4">
            <Image src={bulletImage} alt="bullet" height={16} width={16} />
            <p
              className={`${blauerNue.className} lg:text-[18px] tracking-[0.5px] lg:leading-[20px] capitalize`}
            >
              {tag}
            </p>
          </div>

          <h2
            className={`${agency.className} tracking-normal text-[22px] lg:text-[30px] max-w-[900px] 2xl:text-[36px] mt-5 2xl:mt-8 leading-[32px] lg:leading-[40px] 2xl:leading-[54px]`}
          >
            {heading}
          </h2>
        </div>

        <p
          ref={paraTextRef}
          className={`${blauerNue.className} tracking-[0.5px] font-light lg:leading-[27px] uppercase 2xl:mt-8.5 mt-5 max-w-[450px]`}
        >
          {subtext}
        </p>
      </div>

      {/* Banner Image */}
      <div className="relative lg:h-screen pt-60 lg:pt-70 w-full flex items-center justify-center">
        <Image
          src={bannerImage}
          alt="About Us"
          width={1440}
          height={780}
          className="object-cover lg:object-contain object-top w-full h-[500px] lg:h-auto"
        />

        {/* ✅ Reusable Triangle Component */}
        <AnimatedTriangle
          src={triangleImage}
          className="absolute z-10 ml-29 lg:ml-40 -mb-0 lg:mb-0"
        />
        <div className="absolute right-5 bottom-0">
          <WaterMark
            textColor="text-black"
            opacity="opacity-40"
            label={getDisplayLabel(mainLabel)}
          />
        </div>
      </div>

      {/* Bottom Text */}
      {/* <div
                ref={bottomParaRef}
                className="flex items-center justify-center flex-col"
            >
                <p
                    className={`${blauerNue.className} font-light leading-[24px] tracking-[0.5px] mt-6 px-12 lg:px-90 text-center text-sm lg:text-base`}
                >
                    {bottomText}
                </p>

                <Image
                    src={bottomIcon}
                    alt="icon"
                    height={22}
                    width={22}
                    className="mt-6"
                />
            </div> */}
    </div>
  );
}

// const hasPlayed = useRef(false);

// const runHeroAnimation = () => {
//     if (hasPlayed.current) return;
//     hasPlayed.current = true;

//     const tl = gsap.timeline({
//         defaults: { ease: "power1.out" },
//     });

//     tl.from(
//         headingTextRef.current?.children || [],
//         {
//             opacity: 0,
//             y: 10,
//             duration: 0.7,
//             stagger: 0.08,
//         },
//     );

//     tl.from(
//         paraTextRef.current,
//         {
//             opacity: 0,
//             y: 15,
//             duration: 0.8,
//         },
//         "-=0.2"
//     );
// };

// useLayoutEffect(() => {
//     gsap.set(headingTextRef.current, { opacity: 1 });
//     gsap.set(paraTextRef.current, { opacity: 1 });

//     if (triangleRef.current) {
//         gsap.set(triangleRef.current, {
//             opacity: 0,
//             x: 80,
//             y: -80,
//             rotation: 10,
//             filter: "blur(10px)",
//         });
//     }
// }, []);

// useLayoutEffect(() => {
//     const start = () => {
//         runHeroAnimation();
//         setTimeout(() => runTriangleAnimation(), 300);
//     };

//     if (bootState.isBooted) {
//         start();
//     } else {
//         window.addEventListener("boot-complete", start, { once: true });
//     }

//     return () => {
//         window.removeEventListener("boot-complete", start);
//     };
// }, []);

// const runTriangleAnimation = () => {
//     if (!triangleRef.current) return;

//     gsap.to(triangleRef.current, {
//         x: 0,
//         y: 0,
//         rotation: 0,
//         opacity: 1,
//         filter: "blur(0px)",
//         duration: 1.6,
//         delay: 0,
//         ease: "power3.out",
//     });
// };
