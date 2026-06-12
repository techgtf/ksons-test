"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGSAP, gsap } from "@/src/website/utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";
import { LocationWiseProjectModal } from "./LocationWiseProjectModal";
import { locationProjectsData } from "./locationData";
import { ModalHandle } from "./LocationContainers";
import { blauerNue } from "@/src/app/fonts";

export default function LocationWiseProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<ModalHandle>(null);
  const activeIdRef = useRef<number | null>(null);
  const panelHoveredRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  useLayoutEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      if (window.innerWidth < 1024) return;
      if (!sectionRef.current || !mapRef.current) return;

      const locations = locationProjectsData;
      const total = locations.length;

      const PHASE1_UNITS = 1;
      const DOT_UNITS = 0.5;
      const HOLD_UNITS = 1.5;
      const LAST_HOLD_UNITS = 3;
      const PER_LOC = DOT_UNITS + HOLD_UNITS;

      const totalUnits =
        PHASE1_UNITS + (total - 1) * PER_LOC + DOT_UNITS + LAST_HOLD_UNITS;
      const scrollLength = `+=${90 * totalUnits}%`;

      gsap.set(pointsRef.current, { autoAlpha: 0, scale: 0.6, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: scrollLength,
          scrub: 1.2,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,

          onRefresh(self) {
            stRef.current = self;
          },

          onLeave() {
            // scrolled past bottom → reset
            activeIdRef.current = null;
            modalRef.current?.close();
          },
          onLeaveBack() {
            // scrolled past top → reset
            activeIdRef.current = null;
            modalRef.current?.close();
          },
        },
      });

      // ST instance — tl.scrollTrigger se directly lo, no onInit needed
      stRef.current = tl.scrollTrigger as ScrollTrigger;

      // Phase 1: clouds + map zoom
      tl.to(
        cloud1Ref.current,
        {
          xPercent: 50,
          yPercent: -40,
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );
      tl.to(
        cloud2Ref.current,
        {
          xPercent: -50,
          yPercent: 40,
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );
      tl.to(
        mapRef.current,
        { scale: 1.4, duration: PHASE1_UNITS, ease: "none" },
        0,
      );

      // Phase 2: dots + modal
      //
      // Scroll DOWN: dot tween onComplete      → modal open/swap
      // Scroll UP  : hold tween onReverseComplete → modal open/swap
      //              (hold ends = user scrolled back into this location's window)
      //              dot tween onReverseComplete → modal close (only for first loc)
      //
      locations.forEach((loc, i) => {
        const startPos = PHASE1_UNITS + i * PER_LOC;
        const holdDuration = i === total - 1 ? LAST_HOLD_UNITS : HOLD_UNITS;

        // ── Dot tween ──────────────────────────────────────────────────────
        tl.to(
          pointsRef.current[i],
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: DOT_UNITS,
            ease: "power2.out",

            // Scroll DOWN: dot fully visible → open/swap modal
            onComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                modalRef.current?.swap(loc);
              }
            },

            // Scroll UP: dot animated back out → close only for first location
            // (for others, hold tween's onReverseComplete handles swap)
            onReverseComplete() {
              if (i === 0) {
                activeIdRef.current = null;
                modalRef.current?.close();
              }
            },
          },
          startPos,
        );

        // ── Hold tween ─────────────────────────────────────────────────────
        tl.to(
          {},
          {
            duration: holdDuration,

            // Scroll UP: user scrolled back into this location's hold window
            // → show this location's modal (mirror of scroll-down onComplete)
            onReverseComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                modalRef.current?.swap(loc);
              }
            },
          },
          startPos + DOT_UNITS,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (loc: (typeof locationProjectsData)[0]) => {
    if (activeIdRef.current === null) {
      activeIdRef.current = loc.id;
      modalRef.current?.open(loc);
    } else {
      activeIdRef.current = loc.id;
      modalRef.current?.swap(loc);
    }
  };

  // Skip — direction based on scroll position vs section midpoint
  const handleSkip = () => {
    const st = stRef.current;
    if (!st) return;

    const scrollY = window.scrollY;
    const sectionTop = st.start;
    const sectionEnd = st.end;
    const midpoint = (sectionTop + sectionEnd) / 2;
    const goingDown = scrollY <= midpoint;

    if (goingDown) {
      // Jump past section end → next section
      lenisInstance?.scrollTo(sectionEnd + window.innerHeight * 1);
    } else {
      // Jump before section start → previous section
      lenisInstance?.scrollTo(Math.max(0, sectionTop - window.innerHeight * 1));
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden lg:block hidden"
    >
      <div className="relative h-full w-full">
        {/* MAP */}
        <div
          ref={mapRef}
          className="relative h-full w-full origin-center will-change-transform"
        >
          <img
            src="/images/home/location-wise-pro/map.webp"
            className="w-full h-full object-cover"
            alt="Map"
          />

          {/* CLOUD 1 */}
          <div
            ref={cloud1Ref}
            className="absolute -top-[25%] -right-[15%] z-10"
          >
            <img
              src="/images/home/location-wise-pro/cloud-1.png"
              className="w-[80%] ml-auto object-contain"
              alt=""
            />
          </div>

          {/* CLOUD 2 */}
          <div
            ref={cloud2Ref}
            className="absolute -bottom-[25%] -left-[20%] z-10"
          >
            <img
              src="/images/home/location-wise-pro/cloud-2.png"
              className="w-[80%] object-contain"
              alt=""
            />
          </div>
        </div>

        {/* DOTS */}
        {locationProjectsData.map((loc, i) => (
          <button
            key={loc.id}
            ref={(el) => {
              pointsRef.current[i] = el;
            }}
            onClick={() => handleClick(loc)}
            style={{
              top: loc.responsive.desktop.top,
              left: loc.responsive.desktop.left,
            }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center"
          >
            <div className="relative w-4.5 h-4.5">
              <span className="absolute inset-0 rounded-full bg-[var(--blue)] animate-ping" />
              <span className="absolute inset-0 rounded-full bg-[var(--blue)] border-4 border-white" />
            </div>
            <p className="mt-2 text-sm capitalize whitespace-nowrap bg-white rounded-2xl px-2 py-0.5 leading-normal font-semibold">
              {loc.name}
            </p>
          </button>
        ))}

        {/* SKIP BUTTON — always jumps to next section */}
        <button
          onClick={handleSkip}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/30 transition-colors"
        >
          <span className={`${blauerNue.className}`}>Skip</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Modal — always in DOM, GSAP controls via autoAlpha */}
      <LocationWiseProjectModal
        ref={modalRef}
        panelHoveredRef={panelHoveredRef}
        onClosed={() => {
          activeIdRef.current = null;
        }}
      />
    </section>
  );
}

// "use client";

// import React, { useLayoutEffect, useRef, useState } from "react";
// import { gsap, registerGSAP } from "@/src/website/utils/gsap";
// import { agency } from "@/src/app/fonts";
// import { LocationWiseProjectModal } from "./LocationWiseProjectModal";

// const locations = [
//     { id: 1, top: "43%", left: "13%", name: "Delhi Ncr" },
//     { id: 2, top: "58%", left: "22%", name: "Pune" },
//     { id: 3, top: "62%", left: "84%", name: "Bengaluru" },
//     { id: 4, top: "67%", left: "92%", name: "Ahmedabad" },
//     { id: 5, top: "13%", left: "92%", name: "Bengaluru" },
// ];

// export default function LocationWiseProjects() {
//     const sectionRef = useRef<HTMLDivElement>(null);
//     const mapWrapRef = useRef<HTMLDivElement>(null);
//     const mapRef = useRef<HTMLDivElement>(null);
//     const cloud1Ref = useRef<HTMLDivElement>(null);
//     const cloud2Ref = useRef<HTMLDivElement>(null);
//     const pointsRef = useRef<(HTMLButtonElement | null)[]>([]);

//     const [activeLocation, setActiveLocation] = useState<any>(null);

//     useLayoutEffect(() => {
//         registerGSAP();
//         const ctx = gsap.context(() => {
//             if (window.innerWidth < 1024) return;
//             if (!sectionRef.current || !mapRef.current) return;

//             gsap.set(pointsRef.current, {
//                 autoAlpha: 0,
//                 scale: 0.6,
//                 y: 30,
//             });

//             const tl = gsap.timeline({
//                 scrollTrigger: {
//                     trigger: sectionRef.current,
//                     start: "top top",
//                     end: "+=220%",
//                     scrub: 1.2,
//                     pin: true,
//                     invalidateOnRefresh: true,
//                     anticipatePin: 1,
//                 },
//             });

//             // clouds remove slowly
//             tl.to(
//                 cloud1Ref.current,
//                 {
//                     xPercent: 50,
//                     yPercent: -40,
//                     autoAlpha: 0,
//                     duration: 1,
//                     ease: "none",
//                 },
//                 0
//             );

//             tl.to(
//                 cloud2Ref.current,
//                 {
//                     xPercent: -50,
//                     yPercent: 40,
//                     autoAlpha: 0,
//                     duration: 1,
//                     ease: "none",
//                 },
//                 0
//             );

//             // map zoom little
//             tl.to(
//                 mapRef.current,
//                 {
//                     scale: 1.2,
//                     duration: 1,
//                     ease: "none",
//                 },
//                 0
//             );

//             // show locations smoothly
//             tl.to(
//                 pointsRef.current,
//                 {
//                     autoAlpha: 1,
//                     scale: 1,
//                     y: 0,
//                     stagger: 0.15,
//                     duration: 0.8,
//                     ease: "power2.out",
//                 },
//                 0.7
//             );
//         }, sectionRef);

//         return () => ctx.revert();
//     }, []);

//     const handleClick = (loc: any, e: any) => {
//         const map = mapRef.current;
//         if (!map) return;

//         // const rect = map.getBoundingClientRect();

//         // const x = e.clientX - rect.left;
//         // const y = e.clientY - rect.top;

//         // const xPercent = (x / rect.width) * 100;
//         // const yPercent = (y / rect.height) * 100;

//         // gsap.to(map, {
//         //     scale: 1.4,
//         //     transformOrigin: `${xPercent}% ${yPercent}%`,
//         //     duration: 0.8,
//         //     ease: "power2.out",
//         // });

//         setActiveLocation(loc);
//     };

//     const closeModal = () => {
//         // gsap.to(mapRef.current, {
//         //     scale: 1.12,
//         //     transformOrigin: "center center",
//         //     duration: 0.8,
//         //     ease: "power2.out",
//         // });

//         setActiveLocation(null);
//     };

//     return (
//         <>
//             <section
//                 ref={sectionRef}
//                 className="relative h-screen w-full overflow-hidden lg:block hidden"
//             >
//                 <div ref={mapWrapRef} className="relative h-full w-full">
//                     {/* MAP */}
//                     <div
//                         ref={mapRef}
//                         className="relative h-full w-full origin-center will-change-transform"
//                     >
//                         <img
//                             src="/images/home/location-wise-pro/map.webp"
//                             className="w-full h-full object-cover"
//                         />

//                         {/* CLOUD 1 */}
//                         <div
//                             ref={cloud1Ref}
//                             className="absolute -top-[25%] -right-[15%] z-10"
//                         >
//                             <img
//                                 src="/images/home/location-wise-pro/cloud-1.png"
//                                 className="w-[80%] ml-auto object-contain"
//                             />
//                         </div>

//                         {/* CLOUD 2 */}
//                         <div
//                             ref={cloud2Ref}
//                             className="absolute -bottom-[25%] -left-[20%] z-10"
//                         >
//                             <img
//                                 src="/images/home/location-wise-pro/cloud-2.png"
//                                 className="w-[80%] object-contain"
//                             />
//                         </div>
//                     </div>

//                     {/* POINTS */}
//                     {locations.map((loc, i) => (
//                         <button
//                             key={loc.id}
//                             ref={(el) => {
//                                 pointsRef.current[i] = el;
//                             }}
//                             onClick={(e) => handleClick(loc, e)}
//                             style={{ top: loc.top, left: loc.left }}
//                             className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center"
//                         >
//                             <div className="relative w-4.5 h-4.5">
//                                 <span className="absolute inset-0 rounded-full bg-[var(--blue)] animate-ping"></span>
//                                 <span className="absolute inset-0 rounded-full bg-[var(--blue)] border-4 border-white"></span>
//                             </div>

//                             <p className={`${agency.className} mt-2 text-sm capitalize  whitespace-nowrap text-white [text-shadow:0_0_4px_rgba(0,0,0,1)]`}>
//                                 {loc.name}
//                             </p>
//                         </button>
//                     ))}
//                 </div>
//             </section>

//             {activeLocation && (
//                 <LocationWiseProjectModal closeModal={closeModal} />
//             )}
//         </>
//     );
// }
