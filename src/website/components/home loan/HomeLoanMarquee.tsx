"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { agency, blauerNue } from "@/src/app/fonts";
import { useSlideY } from "../../hooks/useSlideY";
import { useScrollScale } from "../../hooks/useScrollScale";

// const heading = "Open The Door To Your Dream Home With The Right Home Loan";

// const subHeading = {
//   para1: `Our team ensures quick processing, minimal paperwork, and personalized assistance at every stage. We work closely with leading financial. With no hidden charges and clear communication, your path to homeownership becomes smooth, secure, and truly rewarding.`,
//   para2: `Our team ensures quick processing, minimal paperwork, and personalized assistance at every stage. With no hidden charges and clear communication, your path to homeownership becomes smooth, secure, and truly rewarding.`,
// };

// const bankLogos = [
//   { name: "Axis Bank", src: "/images/home-loan/bank/axis.png" },
//   { name: "SBI", src: "/images/home-loan/bank/sbi.png" },
//   { name: "ICICI Bank", src: "/images/home-loan/bank/icici.png" },
//   { name: "Axis Bank", src: "/images/home-loan/bank/axis.png" },
//   { name: "SBI", src: "/images/home-loan/bank/sbi.png" },
//   { name: "ICICI Bank", src: "/images/home-loan/bank/icici.png" },
// ];

const HomeLoanMarquee = ({ heading, subHeading, bankLogos }: any) => {
  // Multiply the logos for a truly seamless loop
  const marqueeLogos = [...bankLogos, ...bankLogos, ...bankLogos, ...bankLogos];

  const headingRef = useRef<HTMLDivElement | null>(null);
  const subHeadingsRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<HTMLDivElement | null>(null);
  const marqueeLogosRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: headingRef, direction: "down", distance: -80 });
  useSlideY({ target: subHeadingsRef, direction: "up", distance: -80 });
  useScrollScale(triangleRef, { fromScale: 0.7, start: "top 70%" });
  useScrollScale(marqueeLogosRef, { fromScale: 0.9, start: "top 80%" });

  return (
    <div data-cursor="light" className="app-container">
      <section
        className="py-20 md:py-30 overflow-hidden relative"
        style={{
          backgroundImage: "url('/images/home-loan/overlay.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10">
          {/* Header Section */}
          <div className="text-center md:mb-[200px] mb-[80px]">
            <h2
              ref={headingRef}
              className={`${agency.className} mx-auto lg:max-w-[750px] lg:text-[36px] text-[24px] text-[#003c71] lg:mb-19 mb-10 lg:leading-[54px]`}
            >
              {heading}
            </h2>
            <div
              ref={subHeadingsRef}
              className={`${blauerNue.className} lg:space-y-11 space-y-6 text-[#0F3C78] font-light tracking-[0.5px] leading-[24px] text-base lg:max-w-[884px] mx-auto`}
            >
              <p>{subHeading.para1}</p>
              <p>{subHeading.para2}</p>
            </div>
          </div>
        </div>

        {/* Marquee + Triangle wrapper */}
        <div
          ref={marqueeLogosRef}
          className="relative lg:max-w-[867px] mx-auto"
        >
          {/* Background Band */}
          <div
            className="h-[168px] lg:h-[192px]"
            style={{
              borderTop: "1px solid rgba(15, 60, 120, 0.15)",
              borderBottom: "1px solid rgba(15, 60, 120, 0.15)",
              background:
                "linear-gradient(90deg, rgba(51, 211, 238, 0.07) 0%, rgba(15, 60, 120, 0.07) 100%)",
            }}
          />

          {/* Marquee — absolutely fills the band */}
          <div className="absolute inset-0 z-10 flex items-center overflow-hidden">
            <motion.div
              className="flex items-center gap-12 md:gap-24 whitespace-nowrap"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
              {marqueeLogos.map((logo, index) => (
                <div
                  key={index}
                  className="shrink-0 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    width={140}
                    height={65}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Triangle — anchored to this wrapper, not the animated child */}
          <div
            ref={triangleRef}
            className="absolute -bottom-[30px] lg:-bottom-[35px] left-1/2 -translate-x-1/2 md:flex hidden z-30 pointer-events-none"
          >
            <Image
              src="/images/home-loan/marquee-triangle.svg"
              alt="Marquee Triangle"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeLoanMarquee;
