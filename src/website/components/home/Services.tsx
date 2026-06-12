"use client";

import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";

export type ServiceSlide = {
  title: string;
  desc: string;
  files: {
    mobile: string;
    desktop: string;
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
      <div className="relative md:w-full h-[90vh] lg:h-[88vh] 2xl:h-[80vh]">
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
              className="max-w-xl text-white absolute left-[10%] bottom-[20%]"
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
            {/* <div
                            ref={(el) => { rightRefs.current[index] = el; }}
                            className="absolute right-10 bottom-16 text-white/70 hidden md:flex flex-col items-center gap-6"
                        >
                            <button
                                onClick={() => handleArrow(-1)}
                                className={`transition ${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                            >
                                <Image src={arrowIcon} alt="up" className="rotate-180" height={80} width={80} />
                            </button>

                            <span className={`${blauerNue.className} text-white text-xl`}>({scrollText})</span>

                            <button
                                onClick={() => handleArrow(1)}
                                className={`transition ${activeIndex === slides.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                            >
                                <Image src={arrowIcon} alt="down" height={80} width={80} />
                            </button>
                        </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
// import { gsap, ScrollTrigger } from "../../utils/gsap";
// import Image from "next/image";
// import { agency, blauerNue } from "@/src/app/fonts";

// gsap.registerPlugin(ScrollTrigger);

// export type ServiceSlide = {
//     title: string;
//     desc: string;
//     img: string;
// };

// export type ServicesProps = {
//     slides: ServiceSlide[];
//     scrollText?: string;
//     arrowIcon?: string;
// };

// export default function Services({
//     slides,
//     scrollText = "SCROLL",
//     arrowIcon = "/images/home/services/arrow.svg",
// }: ServicesProps) {
//     const sectionRef = useRef<HTMLDivElement | null>(null);
//     const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
//     const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
//     const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

//     const [activeIndex, setActiveIndex] = useState(0);
//     const activeIndexRef = useRef(0);
//     const isTransitioning = useRef(false);
//     const wheelAccum = useRef(0);
//     const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//     const stRef = useRef<ScrollTrigger | null>(null);

//     const touchStartY = useRef(0);
//     const touchEndY = useRef(0);

//     // ─── SLIDE CHANGE ─────────────────────────────────────────────────────────
//     const goToSlide = useCallback((next: number) => {
//         const prev = activeIndexRef.current;
//         if (next === prev || next < 0 || next >= slides.length) return;
//         if (isTransitioning.current) return;

//         isTransitioning.current = true;
//         activeIndexRef.current = next;
//         setActiveIndex(next);

//         const goingDown = next > prev;
//         const prevEl = slideRefs.current[prev];
//         const nextEl = slideRefs.current[next];

//         if (prevEl) {
//             gsap.to(prevEl, {
//                 y: goingDown ? "-25%" : "110%",
//                 scale: goingDown ? 0.9 : 0.95,
//                 opacity: goingDown ? 0.6 : 1,
//                 duration: 1,
//                 ease: "power3.inOut",
//             });
//         }

//         if (nextEl) {
//             gsap.fromTo(
//                 nextEl,
//                 {
//                     y: goingDown ? "110%" : "-25%",
//                     scale: goingDown ? 0.95 : 0.9,
//                     opacity: goingDown ? 1 : 0.6,
//                 },
//                 {
//                     y: "0%",
//                     scale: 1,
//                     opacity: 1,
//                     duration: 1,
//                     ease: "power3.inOut",
//                     onComplete: () => {
//                         isTransitioning.current = false;
//                     },
//                 }
//             );
//         }

//         leftRefs.current.forEach((el, i) => {
//             if (!el) return;
//             if (i === next) gsap.fromTo(el, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
//             else gsap.to(el, { x: -100, opacity: 0, duration: 0.5, ease: "power3.in" });
//         });

//         rightRefs.current.forEach((el, i) => {
//             if (!el) return;
//             if (i === next) gsap.fromTo(el, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
//             else gsap.to(el, { x: 100, opacity: 0, duration: 0.5, ease: "power3.in" });
//         });
//     }, [slides.length]);

//     // ─── INITIAL POSITIONS ────────────────────────────────────────────────────
//     useLayoutEffect(() => {
//         slideRefs.current.forEach((el, i) => {
//             if (!el) return;
//             gsap.set(el, i === 0 ? { y: "0%", scale: 1, opacity: 1 } : { y: "110%", scale: 0.95, opacity: 1 });
//         });
//         if (leftRefs.current[0]) gsap.fromTo(leftRefs.current[0], { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
//         if (rightRefs.current[0]) gsap.fromTo(rightRefs.current[0], { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
//     }, []);

//     // ─── SCROLLTRIGGER PIN ────────────────────────────────────────────────────
//     useLayoutEffect(() => {
//         if (!sectionRef.current) return;

//         const ctx = gsap.context(() => {
//             stRef.current = ScrollTrigger.create({
//                 trigger: sectionRef.current,
//                 start: "top 1.4%",
//                 end: () => `+=${(slides.length - 1) * window.innerHeight} * 0.5`,
//                 pin: true,
//                 pinSpacing: true,
//                 invalidateOnRefresh: true,
//                 anticipatePin: 1,
//             });
//             setTimeout(() => {
//                 ScrollTrigger.refresh();
//             }, 0);
//         });

//         return () => {
//             ctx.revert();
//             stRef.current = null;
//         };
//     }, [slides.length]);

//     // ─── WHEEL INTERCEPT ──────────────────────────────────────────────────────
//     useLayoutEffect(() => {
//         const onWheel = (e: WheelEvent) => {
//             // Only intercept while ScrollTrigger pin is active
//             if (!stRef.current?.isActive) return;

//             e.preventDefault();
//             if (isTransitioning.current) return;

//             wheelAccum.current += e.deltaY;

//             if (wheelTimer.current) clearTimeout(wheelTimer.current);
//             wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 80);

//             if (Math.abs(wheelAccum.current) < 30) return;

//             const direction = wheelAccum.current > 0 ? 1 : -1;
//             wheelAccum.current = 0;

//             const next = activeIndexRef.current + direction;

//             // At the first/last slide — release the pin so page scroll resumes
//             if (next < 0 || next >= slides.length) return;

//             goToSlide(next);
//         };

//         const onTouchStart = (e: TouchEvent) => {
//             touchStartY.current = e.touches[0].clientY;
//         };

//         const onTouchMove = (e: TouchEvent) => {
//             if (!stRef.current?.isActive) return;
//             if (isTransitioning.current) return;

//             touchEndY.current = e.touches[0].clientY;
//         };

//         const onTouchEnd = () => {
//             if (!stRef.current?.isActive) return;

//             const delta = touchStartY.current - touchEndY.current;

//             if (Math.abs(delta) < 50) return; // threshold

//             const direction = delta > 0 ? 1 : -1;

//             const next = activeIndexRef.current + direction;

//             if (next < 0 || next >= slides.length) return;

//             goToSlide(next);
//         };

//         const target = document.getElementById("smooth-wrapper") ?? window;
//         target.addEventListener("wheel", onWheel as EventListener, { passive: false });
//         target.addEventListener("touchstart", onTouchStart as EventListener, { passive: true });
//         target.addEventListener("touchmove", onTouchMove as EventListener, { passive: true });
//         target.addEventListener("touchend", onTouchEnd as EventListener);

//         return () => {
//             target.removeEventListener("wheel", onWheel as EventListener);
//             target.removeEventListener("touchstart", onTouchStart as EventListener);
//             target.removeEventListener("touchmove", onTouchMove as EventListener);
//             target.removeEventListener("touchend", onTouchEnd as EventListener);
//             if (wheelTimer.current) clearTimeout(wheelTimer.current);
//         };
//     }, [slides.length, goToSlide]);

//     // ─── ARROW BUTTONS ────────────────────────────────────────────────────────
//     const handleArrow = useCallback((direction: 1 | -1) => {
//         goToSlide(activeIndexRef.current + direction);
//     }, [goToSlide]);

//     return (
//         // Plain section — ScrollTrigger handles pinning and adds its own spacer.
//         <section ref={sectionRef} className="w-full h-screen p-4 md:p-8 box-border flex items-center justify-center">
//             <div className="relative w-full h-[85%] md:h-full rounded-[40px] overflow-hidden">
//                 {slides.map((slide, index) => (
//                     <div
//                         key={index}
//                         ref={(el) => { slideRefs.current[index] = el; }}
//                         className="absolute inset-0 rounded-[40px] overflow-hidden shadow-xl"
//                         style={{ willChange: "transform, opacity" }}
//                     >
//                         <Image fill src={slide.img} alt={slide.title} className="object-cover" />
//                         <div className="absolute inset-0 bg-black/50" />

//                         <div className="relative z-10 h-full flex items-end pb-26 pr-8 md:pr-18 pl-8 md:pl-36">
//                             <div
//                                 ref={(el) => { leftRefs.current[index] = el; }}
//                                 className="max-w-xl text-white"
//                             >
//                                 <h2 className={`${agency.className} text-[40px] md:text-[48px] mb-6`}>{slide.title}</h2>
//                                 <p className={`${blauerNue.className} text-[16px] leading-relaxed`}>{slide.desc}</p>
//                             </div>

//                             <div
//                                 ref={(el) => { rightRefs.current[index] = el; }}
//                                 className="absolute right-10 bottom-16 text-white/70 hidden md:flex flex-col items-center gap-6"
//                             >
//                                 <button
//                                     onClick={() => handleArrow(-1)}
//                                     className={`transition ${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
//                                 >
//                                     <Image src={arrowIcon} alt="up" className="rotate-180" height={80} width={80} />
//                                 </button>

//                                 <span className={`${blauerNue.className} text-white text-xl`}>({scrollText})</span>

//                                 <button
//                                     onClick={() => handleArrow(1)}
//                                     className={`transition ${activeIndex === slides.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
//                                 >
//                                     <Image src={arrowIcon} alt="down" height={80} width={80} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }
