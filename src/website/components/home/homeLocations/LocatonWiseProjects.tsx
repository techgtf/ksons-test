"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { registerGSAP, gsap, ScrollTrigger } from "@/src/website/utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";
import { LocationWiseProjectModal } from "./LocationWiseProjectModal";
import { ModalHandle } from "./LocationContainers";
import { blauerNue } from "@/src/app/fonts";

type Props = {
  locations: any[];
};

export default function LocationWiseProjects({ locations }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<ModalHandle>(null);
  const activeIdRef = useRef<number | null>(null);
  const panelHoveredRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeId, setActiveId] = useState<any>(null);

  useLayoutEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      if (window.innerWidth < 1024) return;
      if (!sectionRef.current || !mapRef.current) return;

      // const locations = locations;
      const total = locations.length;

      const PHASE1_UNITS = 1;
      const DOT_UNITS = 0.5;
      const HOLD_UNITS = 0.8;
      const LAST_HOLD_UNITS = 1.2;
      const PER_LOC = DOT_UNITS + HOLD_UNITS;

      const totalUnits =
        PHASE1_UNITS + (total - 1) * PER_LOC + DOT_UNITS + LAST_HOLD_UNITS;
      const scrollLength = `+=${55 * totalUnits}%`;

      gsap.set(mapRef.current, { xPercent: -50, yPercent: -50 });
      gsap.set(pointsRef.current, { autoAlpha: 0, scale: 0.6, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: scrollLength,
          scrub: 2,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,

          onRefresh(self) {
            stRef.current = self;
          },

          onLeave() {
            // scrolled past bottom → reset
            activeIdRef.current = null;
            setActiveId(null);
            modalRef.current?.close();
          },
          onLeaveBack() {
            // scrolled past top → reset
            activeIdRef.current = null;
            setActiveId(null);
            modalRef.current?.close();
          },
        },
      });

      // ST instance — tl.scrollTrigger se directly lo, no onInit needed
      stRef.current = tl.scrollTrigger as ScrollTrigger;

      // Helper to calculate translation to center a point (left, top) under scale
      const getClampedTranslation = (
        leftPct: number,
        topPct: number,
        scale: number,
      ) => {
        const maxTranslateX = (scale - 1) * 50;
        const maxTranslateY = (scale - 1) * 50;

        const targetX = -scale * (leftPct - 50);
        const targetY = -scale * (topPct - 50);

        return {
          xPercent: Math.max(-maxTranslateX, Math.min(maxTranslateX, targetX)),
          yPercent: Math.max(-maxTranslateY, Math.min(maxTranslateY, targetY)),
        };
      };

      // Phase 1: clouds remove slowly, map zooms slightly
      tl.to(
        cloud1Ref.current,
        {
          xPercent: 100,
          yPercent: -80,
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );
      tl.to(
        cloud2Ref.current,
        {
          xPercent: -100,
          yPercent: 80,
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );
      tl.to(
        mapRef.current,
        {
          scale: 1.1,
          xPercent: -50,
          yPercent: -50,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      // Phase 2: dots + map pan/zoom + modal
      locations.forEach((loc, i) => {
        const startPos = PHASE1_UNITS + i * PER_LOC;
        const holdDuration = i === total - 1 ? LAST_HOLD_UNITS : HOLD_UNITS;

        const left = parseFloat(loc.position?.desktop.left || "50");
        const top = parseFloat(loc.position?.desktop.top || "50");
        const clamped = getClampedTranslation(left, top, 1.6);

        // Map zoom & pan tween
        tl.to(
          mapRef.current,
          {
            scale: 1.6,
            xPercent: -50 + clamped.xPercent,
            yPercent: -50 + clamped.yPercent,
            duration: DOT_UNITS,
            ease: "power2.inOut",
          },
          startPos,
        );

        // Dot tween
        tl.to(
          pointsRef.current[i],
          {
            autoAlpha: 1,
            scale: 0.62, // counter-scale for map zoom (1 / 1.6 ≈ 0.62)
            y: 0,
            duration: DOT_UNITS,
            ease: "power2.out",

            // Scroll DOWN: dot fully visible → open/swap modal
            onComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.swap(loc);
              }
            },

            // Scroll UP: dot animated back out → close only for first location
            onReverseComplete() {
              if (i === 0) {
                activeIdRef.current = null;
                setActiveId(null);
                modalRef.current?.close();
              }
            },
          },
          startPos,
        );

        // Hold tween
        tl.to(
          {},
          {
            duration: holdDuration,

            // Scroll UP: user scrolled back into this location's hold window
            onReverseComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
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

  const handleClick = (loc: any, index: number) => {
    const st = stRef.current;
    if (!st) return;

    const PHASE1_UNITS = 1;
    const DOT_UNITS = 0.8;
    const HOLD_UNITS = 1.8;
    const PER_LOC = DOT_UNITS + HOLD_UNITS;
    const total = locations.length;
    const LAST_HOLD_UNITS = 2.5;
    const totalUnits =
      PHASE1_UNITS + (total - 1) * PER_LOC + DOT_UNITS + LAST_HOLD_UNITS;

    // Scroll to the middle of the active location's hold window
    const targetPos =
      PHASE1_UNITS + index * PER_LOC + DOT_UNITS + HOLD_UNITS / 2;
    const progress = targetPos / totalUnits;
    const targetScroll = st.start + progress * (st.end - st.start);

    lenisInstance?.scrollTo(targetScroll);
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
          style={{
            width: "max(100vw, calc(100vh * 2568 / 1607))",
            height: "max(100vh, calc(100vw * 1607 / 2568))",
          }}
          className="absolute left-1/2 top-1/2 origin-center will-change-transform"
        >
          <img
            src="/images/home/location-wise-pro/map.webp"
            className="w-full h-full object-fill select-none pointer-events-none"
            alt="Map"
          />

          {/* CLOUD 1 */}
          <div
            ref={cloud1Ref}
            className="absolute -top-[5%] -right-[15%] z-10 pointer-events-none"
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
            className="absolute -bottom-[5%] -left-[20%] z-10 pointer-events-none"
          >
            <img
              src="/images/home/location-wise-pro/cloud-2.png"
              className="w-[80%] object-contain"
              alt=""
            />
          </div>

          {/* DOTS inside the map container so they zoom and translate with it */}
          {locations.map((loc, i) => {
            const position = loc.position;
            const isActive = activeId === loc.id;

            return (
              <button
                key={loc.id}
                ref={(el) => {
                  pointsRef.current[i] = el;
                }}
                onClick={() => handleClick(loc, i)}
                style={{
                  top: position?.desktop.top,
                  left: position?.desktop.left,
                }}
                className={`locItem locItem${i + 1} absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center`}
              >
                <div
                  className={`flex flex-col items-center transition-all duration-500 ease-out ${
                    activeId === null
                      ? "opacity-100 scale-100"
                      : isActive
                        ? "opacity-100"
                        : "opacity-70"
                  }`}
                >
                  <div className="relative w-4.5 h-4.5">
                    <span className="absolute inset-0 rounded-full bg-[var(--blue)] animate-ping" />
                    <span className="absolute inset-0 rounded-full bg-[var(--blue)] border-4 border-white" />
                  </div>
                  <p className="mt-2 text-sm capitalize whitespace-nowrap bg-white rounded-2xl px-2 py-0.5 leading-normal font-semibold text-[var(--blue)] shadow-md">
                    {loc.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

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
          setActiveId(null);
        }}
      />
    </section>
  );
}
