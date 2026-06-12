"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CommonBtn from "@/src/website/components/common/CommonBtn";
import { IoClose } from "react-icons/io5";
import { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";

interface FutureExtentionsProps {
  hasFutureExtention?: boolean;
}

export default function FutureExtentions({
  hasFutureExtention,
}: FutureExtentionsProps) {
  if (!hasFutureExtention) return null;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: titleRef, direction: "down", duration: 2 });
  useSlideY({ target: headingRef, direction: "up", duration: 2 });
  useSlideY({ target: descRef, direction: "down", duration: 2 });

  return (
    <section
      data-cursor="light"
      className="future-extentions relative py-20 lg:py-32 overflow-hidden bg-[#F8FAFC]"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#33D3EE]/5 blur-[100px] rounded-full -mr-72 -mt-72" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0F3C78]/5 blur-[100px] rounded-full -ml-72 -mb-72" />
      <div className="app-container relative z-10 px-4 md:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-full">
            <div
              ref={titleRef}
              className={`builder-name flex items-center justify-center gap-2 text-[#0F3C78] ${agency.className} text-[15px] leading-normal`}
            >
              <Image
                src={"/images/about/about-bullet.png"}
                alt="bullet"
                height={16}
                width={16}
              />
              Strategic Future
            </div>
          </div>

          <h2
            ref={headingRef}
            className={`${agency.className} pt-2 lg:py-8 text-[22px] md:text-[36px] text-[#0F3C78] capitalize leading-[32px] lg:leading-[34px]`}
          >
            The next phase of expansion
          </h2>

          <p
            ref={descRef}
            className={`${blauerNue.className} text-[#0F3C78]/70 text-base md:text-lg  max-w-2xl mx-auto font-light leading-relaxed`}
          >
            K.sons is entering its most ambitious phase of expansion, with over
            300 acres of planned developments across Delhi NCR, Mathura,
            Vrindavan and Hathras, spanning residential, commercial and mixed
            real estate formats.
          </p>
        </div>
      </div>
    </section>
  );
}
