"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import CommonBtn from "../common/CommonBtn";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import MicroHeader from "../projects/micro/MicroHeader";

/* ================= TYPES ================= */

export type NewsItem = {
  category: string;
  title: string;
  description: string;
  image: string;
};

export type NewsProps = {
  tag: string;
  heading: string;
  news: NewsItem[];

  buttonText: string;
  buttonIcon: string;
};

/* ================= COMPONENT ================= */

export default function News({
  tag,
  heading,
  news,
  buttonText,
  buttonIcon,
}: NewsProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndex = useRef(1);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const cards = cardsRef.current;

      // INITIAL STATE
      cards.forEach((card, i) => {
        if (!card) return;

        const media = card.querySelector(".card-media");
        const content = card.querySelectorAll(".card-content");

        gsap.set(media, {
          scale: i === 1 ? 1.2 : 0.7,
        });

        gsap.set(content, {
          opacity: i === 1 ? 1 : 0,
          y: i === 1 ? 0 : 50,
        });
      });

      function setActive(index: number) {
        if (activeIndex.current === index) return;
        activeIndex.current = index;

        cards.forEach((card, i) => {
          if (!card) return;

          const media = card.querySelector(".card-media");
          const content = card.querySelectorAll(".card-content");

          gsap.killTweensOf([media, content]);

          if (i === index) {
            gsap.to(media, {
              scale: 1.2,
              duration: 0.9,
              ease: "power4.out",
            });

            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power4.out",
              stagger: 0.05,
            });
          } else {
            gsap.to(media, {
              scale: 0.7,
              duration: 0.9,
              ease: "power4.out",
            });

            gsap.to(content, {
              opacity: 0,
              y: 50,
              duration: 0.6,
              ease: "power3.out",
            });
          }
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;

          let index;

          if (isMobile) {
            if (progress < 0.45) index = 0;
            else if (progress < 0.65) index = 1;
            else index = 2;
          } else {
            if (progress < 0.33) index = 0;
            else if (progress < 0.5) index = 1;
            else index = 2;
          }

          setActive(index);
        },
      });
    }, sectionRef); // 👈 scope to this component

    return () => ctx.revert(); // 👈 clean ONLY this component
  }, []);

  return (
    <div
      data-cursor="light"
      ref={sectionRef}
      className="py-16 lg:py-20 lg:px-0 px-5"
    >
      <div className="app-container">
        {/* Heading */}
        <div ref={headingRef}>
          <MicroHeader title={tag} description={heading} />
        </div>

        <div className="h-full flex flex-col justify-center items-center gap-10 text-[#0F3C78] relative mt-24">
          {/* CENTER LINE */}
          <div className="hidden lg:block absolute left-1/2 bottom-0 -translate-x-1/2 h-[80%] w-[1px] bg-[rgba(15,60,120,0.25)] pointer-events-none" />

          {news.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="flex flex-col lg:flex-row items-start lg:items-end justify-center gap-6 lg:gap-10 w-full"
            >
              {/* LEFT */}
              <div className="hidden lg:flex w-2/6 justify-end pr-10">
                <div className="card-content">
                  <span
                    className={`px-[20px] py-[8px] border rounded-full text-[12px] capitalize ${blauerNue.className}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* IMAGE */}
              <div className="card-media w-full lg:w-3/6 h-[200px] lg:h-[220px] relative will-change-transform order-1 lg:order-0">
                <Image
                  src={item.image}
                  alt="news"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* RIGHT */}
              <div className="w-full lg:w-2/6 px-4 lg:pr-0 lg:pl-10 flex flex-col justify-between order-2 lg:order-0">
                <div className="card-content lg:hidden my-6">
                  <span
                    className={`px-[20px] py-[8px] border rounded-full text-[12px] capitalize ${blauerNue.className}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="card-content">
                  <h3
                    className={`${agency.className} text-[22px] lg:leading-[32px] -tracking-[0.5px]`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`${blauerNue.className} tracking-[0.5px] lg:leading-[24px] font-light mt-4 lg:mt-6`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="lg:py-3" />

          <CommonBtn
            href={`/news-events`}
            variant="primary"
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
        </div>
      </div>
    </div>
  );
}
