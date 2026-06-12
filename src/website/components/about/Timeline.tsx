"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { agency, blauerNue } from "@/src/app/fonts";
import { gsap, ScrollTrigger } from "../../utils/gsap";
import { lenisInstance } from "../SmoothScroller";
import { useReveal } from "../../hooks/useReveal";
import { useSlideY } from "../../hooks/useSlideY";

/* ================= TYPES ================= */

export type TimelineYear = {
  year: string;
  text: string;
};

export type TimelineRange = {
  title: string;
  range: string;
  description: string;
  years: TimelineYear[];
};

export type TimelineProps = {
  ranges: TimelineRange[];
  markerImage: string;
};

/* ================= COMPONENT ================= */

export default function Timeline({ ranges, markerImage }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const leftItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const markerRef = useRef<HTMLImageElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const horizontalRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const handleTouchStart = (e: Event) => {
      const target = e.target;

      if (target instanceof Element && target.closest(".normal-scroll")) {
        lenisInstance?.stop();
      }
    };

    const handleTouchEnd = (e: Event) => {
      const target = e.target;

      if (target instanceof Element && target.closest(".normal-scroll")) {
        lenisInstance?.start();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const sections = gsap.utils.toArray<HTMLElement>(
          trackRef.current!.children,
        );

        const totalSections = sections.length;
        const totalScroll = trackRef.current!.scrollHeight;

        gsap.to(trackRef.current, {
          y: () => -(trackRef.current!.scrollHeight - window.innerHeight),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${totalScroll}`,
            scrub: 1,
            pin: true,
          },
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1,
          onUpdate: (self) => {
            const track = trackRef.current;
            if (!track) return;
            const children = Array.from(track.children) as HTMLElement[];
            if (children.length === 0) return;

            // Current scroll position relative to the track's scrollable range
            const maxScrollHeight = track.scrollHeight - window.innerHeight;
            const currentScrollPos = self.progress * maxScrollHeight;

            let newIndex = 0;
            for (let i = 0; i < children.length; i++) {
              // Determine active index based on whether the section's top is within the upper part of viewport
              // Using a 20% viewport height threshold for a more natural transition
              if (
                currentScrollPos >=
                children[i].offsetTop - window.innerHeight * 0.2
              ) {
                newIndex = i;
              }
            }

            setActiveIndex(newIndex);

            const el = leftItemsRef.current[newIndex];
            if (el && markerRef.current && circleRef.current) {
              gsap.to([markerRef.current, circleRef.current], {
                y: el.offsetTop,
                duration: 0.25,
                ease: "power2.out",
              });
            }
          },
        });
      });
    }, containerRef);

    const firstEl = leftItemsRef.current[0];

    if (firstEl && markerRef.current && circleRef.current) {
      const offset = firstEl.offsetTop;

      gsap.set([markerRef.current, circleRef.current], {
        y: offset,
      });
    }

    return () => ctx.revert();
  }, []);

  useReveal(sectionRef, { direction: "left" });

  return (
    <div
      ref={sectionRef}
      className="relative bg-[#053864] text-white md:overflow-visible overflow-x-hidden"
    >
      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-6 py-10 relative z-10 overflow-visible">
        <div
          ref={horizontalRef}
          className="overflow-x-auto pb-6 border-b border-white/20 -mx-6 px-6 touch-pan-x normal-scroll"
          data-scroll-ignore
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pinch-zoom",
            overscrollBehaviorX: "auto",
          }}
        >
          <div className="flex gap-6 w-max">
            {ranges.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <button
                  onClick={() => setActiveIndex(i)}
                  className={`whitespace-nowrap flex-shrink-0 ${agency.className}`}
                >
                  <h5
                    className={`${activeIndex === i ? "text-base" : "text-sm opacity-50"} uppercase transition-all duration-100`}
                  >
                    {item.title}
                  </h5>
                  <p
                    className={`text-[#33D3EE] mt-1 ${activeIndex === i ? "opacity-100" : "opacity-50"}`}
                  >
                    {item.range}
                  </p>
                </button>

                <div className="h-full w-px bg-white/20 ml-3"></div>
              </div>
            ))}
          </div>
        </div>

        <p
          className={`${blauerNue.className} mt-6 text-sm uppercase tracking-[0.5px] leading-[24px]`}
        >
          {ranges[activeIndex].description}
        </p>

        <div className="mt-10 flex flex-col gap-16">
          {ranges[activeIndex].years.map((yearItem, j) => (
            <div key={j}>
              <h5 className={`${agency.className} text-3xl`}>
                {yearItem.year}
              </h5>
              <p className={`${blauerNue.className} text-sm mt-4 font-light`}>
                {yearItem.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div
        ref={containerRef}
        className="hidden md:block h-screen overflow-hidden relative z-10"
      >
        <div className="flex h-full">
          {/* LEFT */}
          <div className="w-1/2 px-30 flex flex-col justify-center gap-20 relative">
            <Image
              ref={markerRef}
              src={markerImage}
              alt="marker"
              width={30}
              height={30}
              className="absolute left-16 top-0"
            />

            {ranges.map((item, i) => (
              <div
                key={i}
                ref={(el) => {
                  leftItemsRef.current[i] = el;
                }}
                className={`max-w-base transition-all duration-300 ${activeIndex === i ? "opacity-100" : "opacity-40"}`}
              >
                <h5
                  className={`${agency.className} ${activeIndex === i ? "text-3xl" : "text-lg"} uppercase`}
                >
                  {item.title}
                </h5>
                <p
                  className={`${agency.className} text-[#33D3EE] ${activeIndex === i ? "text-lg" : "text-base"} mt-2`}
                >
                  {item.range}
                </p>
                <p
                  className={`${blauerNue.className} mt-4 ${activeIndex === i ? "text-base" : "text-xs"} tracking-[0.5px] leading-[27px] uppercase`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="relative py-6">
            <div className="h-full w-[1px] bg-white"></div>
            <div
              ref={circleRef}
              className="absolute top-0 bg-white h-5 w-5 rounded-full -left-2.5"
            ></div>
          </div>

          {/* RIGHT */}
          <div className="w-1/2 relative mt-6">
            <div ref={trackRef} className="flex flex-col">
              {ranges.map((range, i) => (
                <div key={i} className="h-full flex flex-col justify-start">
                  <div className="flex flex-col gap-32 py-20 px-30">
                    {range.years.map((yearItem, j) => (
                      <div key={j} className="max-w-sm">
                        <h5 className={`${agency.className} text-4xl`}>
                          {yearItem.year}
                        </h5>
                        <p
                          className={`${blauerNue.className} text-base mt-6 font-light max-w-[377px]`}
                        >
                          {yearItem.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import Image from "next/image";
// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { agency, blauerNue } from "@/src/app/fonts";
// import { gsap, ScrollTrigger, ScrollSmoother } from "../../utils/gsap";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// /* ================= TYPES ================= */

// export type TimelineYear = {
//   year: string;
//   text: string;
// };

// export type TimelineRange = {
//   title: string;
//   range: string;
//   description: string;
//   years: TimelineYear[];
// };

// export type TimelineProps = {
//   ranges: TimelineRange[];
//   markerImage: string;
// };

// /* ================= COMPONENT ================= */

// export default function Timeline({ ranges, markerImage }: TimelineProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const leftItemsRef = useRef<(HTMLDivElement | null)[]>([]);
//   const markerRef = useRef<HTMLImageElement>(null);
//   const circleRef = useRef<HTMLDivElement>(null);

//   const horizontalRef = useRef<HTMLDivElement>(null);

//   const [activeIndex, setActiveIndex] = useState(0);

//   useLayoutEffect(() => {
//     const smoother = ScrollSmoother.get();
//     if (!smoother) return;

//     const handleTouchStart = (e: Event) => {
//       const target = e.target;
//       if (target instanceof Element && target.closest(".normal-scroll")) {
//         smoother.paused(true);
//       }
//     };

//     const handleTouchEnd = (e: Event) => {
//       const target = e.target;
//       if (target instanceof Element && target.closest(".normal-scroll")) {
//         smoother.paused(false);
//       }
//     };

//     document.addEventListener("touchstart", handleTouchStart, { passive: true });
//     document.addEventListener("touchend", handleTouchEnd, { passive: true });
//     document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

//     return () => {
//       document.removeEventListener("touchstart", handleTouchStart);
//       document.removeEventListener("touchend", handleTouchEnd);
//       document.removeEventListener("touchcancel", handleTouchEnd);
//     };
//   }, []);

//   useLayoutEffect(() => {
//     if (typeof window !== "undefined" && window.innerWidth < 768) return;

//     const ctx = gsap.context(() => {
//       const sections = gsap.utils.toArray<HTMLElement>(
//         trackRef.current!.children
//       );

//       const totalSections = sections.length;
//       const totalScroll = trackRef.current!.scrollHeight;

//       gsap.to(trackRef.current, {
//         y: () =>
//           -(trackRef.current!.scrollHeight - window.innerHeight),
//         ease: "none",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: `+=${totalScroll}`,
//           scrub: 1,
//           pin: true,
//         },
//       });

//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: "top top",
//         end: `+=${totalScroll}`,
//         scrub: 1,
//         onUpdate: (self) => {
//           const index = Math.min(
//             totalSections - 1,
//             Math.floor(self.progress * totalSections * 0.8)
//           );

//           setActiveIndex(index);

//           const el = leftItemsRef.current[index];
//           if (el && markerRef.current && circleRef.current) {
//             gsap.to([markerRef.current, circleRef.current], {
//               y: el.offsetTop,
//               duration: 0.25,
//               ease: "power2.out",
//             });
//           }
//         },
//       });
//     }, containerRef);

//     const firstEl = leftItemsRef.current[0];

//     if (firstEl && markerRef.current && circleRef.current) {
//       const offset = firstEl.offsetTop;

//       gsap.set([markerRef.current, circleRef.current], {
//         y: offset,
//       });
//     }

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div className="relative bg-[#053864] text-white md:overflow-visible overflow-x-hidden">

//       {/* ================= MOBILE ================= */}
//       <div className="md:hidden px-6 py-10 relative z-10 overflow-visible">
//         <div
//           ref={horizontalRef}
//           className="overflow-x-auto pb-6 border-b border-white/20 -mx-6 px-6 touch-pan-x normal-scroll"
//           data-scroll-ignore
//           style={{
//             WebkitOverflowScrolling: "touch",
//             touchAction: "pan-x pinch-zoom",
//             overscrollBehaviorX: "auto",
//           }}
//         >
//           <div className="flex gap-6 w-max">
//             {ranges.map((item, i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <button
//                   onClick={() => setActiveIndex(i)}
//                   className={`whitespace-nowrap flex-shrink-0 ${agency.className}`}
//                 >
//                   <h5 className={`${activeIndex === i ? "text-base" : "text-sm opacity-50"} uppercase transition-all duration-100`}>
//                     {item.title}
//                   </h5>
//                   <p className={`text-[#33D3EE] mt-1 ${activeIndex === i ? "opacity-100" : "opacity-50"}`}>
//                     {item.range}
//                   </p>
//                 </button>

//                 <div className="h-full w-px bg-white/20 ml-3"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p className={`${blauerNue.className} mt-6 text-sm uppercase tracking-[0.5px] leading-[24px]`}>
//           {ranges[activeIndex].description}
//         </p>

//         <div className="mt-10 flex flex-col gap-16">
//           {ranges[activeIndex].years.map((yearItem, j) => (
//             <div key={j}>
//               <h5 className={`${agency.className} text-3xl`}>
//                 {yearItem.year}
//               </h5>
//               <p className={`${blauerNue.className} text-sm mt-4 font-light`}>
//                 {yearItem.text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= DESKTOP ================= */}
//       <div
//         ref={containerRef}
//         className="hidden md:block h-screen overflow-hidden relative z-10"
//       >
//         <div className="flex h-full">

//           {/* LEFT */}
//           <div className="w-1/2 px-30 flex flex-col justify-center gap-20 relative">
//             <Image
//               ref={markerRef}
//               src={markerImage}
//               alt="marker"
//               width={30}
//               height={30}
//               className="absolute left-16 top-0"
//             />

//             {ranges.map((item, i) => (
//               <div
//                 key={i}
//                 ref={(el) => {
//                   leftItemsRef.current[i] = el;
//                 }}
//                 className={`max-w-base transition-all duration-300 ${activeIndex === i ? "opacity-100" : "opacity-40"}`}
//               >
//                 <h5 className={`${agency.className} ${activeIndex === i ? "text-3xl" : "text-lg"} uppercase`}>
//                   {item.title}
//                 </h5>
//                 <p className={`${agency.className} text-[#33D3EE] ${activeIndex === i ? "text-lg" : "text-base"} mt-2`}>
//                   {item.range}
//                 </p>
//                 <p className={`${blauerNue.className} mt-4 ${activeIndex === i ? "text-base" : "text-xs"} tracking-[0.5px] leading-[27px] uppercase`}>
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* DIVIDER */}
//           <div className="relative py-6">
//             <div className="h-full w-[1px] bg-white"></div>
//             <div
//               ref={circleRef}
//               className="absolute top-0 bg-white h-5 w-5 rounded-full -left-2.5"
//             ></div>
//           </div>

//           {/* RIGHT */}
//           <div className="w-1/2 relative mt-6">
//             <div ref={trackRef} className="flex flex-col">
//               {ranges.map((range, i) => (
//                 <div key={i} className="h-full flex flex-col justify-start">
//                   <div className="flex flex-col gap-32 py-20 px-30">
//                     {range.years.map((yearItem, j) => (
//                       <div key={j} className="max-w-sm">
//                         <h5 className={`${agency.className} text-4xl`}>
//                           {yearItem.year}
//                         </h5>
//                         <p className={`${blauerNue.className} text-base mt-6 font-light max-w-sm`}>
//                           {yearItem.text}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
