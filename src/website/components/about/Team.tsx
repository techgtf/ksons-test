"use client";

import SectionHeader from "../common/SectionHeader";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, EffectFade } from "swiper/modules";
import { agency, blauerNue } from "@/src/app/fonts";
import { gsap } from "../../utils/gsap";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { useReveal } from "../../hooks/useReveal";
import MicroHeader from "../projects/micro/MicroHeader";

/* ================= TYPES ================= */

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  description: string;
};

export type TeamProps = {
  tag: string;
  heading: string;
  bulletImage: string;

  backgroundImage: string;
  glowImage: string;
  triangleImage: string;
  arrowImage: string;

  members: TeamMember[];
};

/* ================= COMPONENT ================= */

export default function Team({
  tag,
  heading,
  bulletImage,
  backgroundImage,
  glowImage,
  triangleImage,
  arrowImage,
  members,
}: TeamProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !leftRefs.current.includes(el)) {
      leftRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    leftRefs.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { x: -200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        },
      );
    });
  }, []);

  return (
    <div className="w-full pt-20 pb-10 lg:pb-30 2xl:pb-60 px-4 lg:px-20 flex flex-col items-center justify-center relative text-white">
      {/* <SectionHeader
                tag={tag}
                heading={heading}
                bulletType="triangle"
                bulletImage={bulletImage}
                className="text-white"
            /> */}
      <MicroHeader
        title={tag}
        description={heading}
        titleColor="white"
        descriptionColor="white"
      />
      <Image
        src={backgroundImage}
        alt="background"
        fill
        className="object-fill mt-130"
      />
      <Image src={glowImage} alt="Glow" fill className="object-fill top-0" />
      <div className="mt-16 relative max-w-7xl w-full flex flex-col items-center justify-center">
        <Swiper
          modules={[Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full"
        >
          {members.map((member, index) => (
            <SwiperSlide key={index}>
              <div ref={addToRefs} className="" key={index}>
                <SlideCard
                  member={member}
                  index={index}
                  triangleImage={triangleImage}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NAVIGATION */}
        <div className="flex items-center gap-4 mt-10 left-0 lg:left-8 relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="team-prev text-2xl"
          >
            <Image
              className="rotate-180"
              src={arrowImage}
              alt="Slider arrow"
              height={20}
              width={20}
            />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="team-next text-2xl"
          >
            <Image src={arrowImage} alt="Slider arrow" height={20} width={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  member: TeamMember;
  index: number;
  triangleImage: string;
};
const SlideCard = ({ member, index, triangleImage }: CardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardMemnerRef = useRef<HTMLImageElement | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT CONTENT */}
        <div
          ref={cardRef}
          className="relative left-46 bottom-[60px] z-10 hidden lg:block items-center"
        >
          <Image
            className="relative top-16 -left-16 -z-1"
            src={triangleImage}
            alt="Team triangle"
            width={135}
            height={135}
          />

          <h2
            className={`${agency.className} text-[50px] 2xl:text-[65px] leading-tight`}
          >
            {member.name}
          </h2>

          <p
            className={`${blauerNue.className} font-light lg:leading-[27px] mt-4 tracking-[0.5px] uppercase max-w-[369px]`}
          >
            {member.role}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center flex-col items-center lg:items-start">
          <div className="w-[320px] h-[400px] relative shadow-[2px_2px_10px_0px_rgba(0,0,0,0.6)] lg:shadow-[2px_2px_30px_0px_rgba(0,0,0,0.6)]">
            <Image
              ref={cardMemnerRef}
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE CONTENT */}
          <div className="relative z-10 block lg:hidden mt-8 ml-3">
            <Image
              className="absolute -top-6 -left-3 -z-1"
              src={triangleImage}
              alt="Team triangle"
              width={70}
              height={70}
            />

            <h2 className={`${agency.className} text-[25px] font-normal`}>
              {member.name}
            </h2>

            <p
              className={`${blauerNue.className} font-light leading-[27px] mt-3 lg:mt-4 text-sm lg:text-base tracking-[0.5px] uppercase max-w-xs`}
            >
              {member.role}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6 lg:mt-12 ml-3 lg:ml-0">
            <p
              className={`${blauerNue.className} text-sm lg:text-base lg:leading-[24px] tracking-[0.5px] font-light max-w-[628px]`}
            >
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
