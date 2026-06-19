"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/src/website/utils/gsap";
import { agency } from "@/src/app/fonts";
import Link from "next/link";

type Props = {
  locations: any[];
};

export default function LocationWiseProjectsMobile({ locations }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const mapImgRef = useRef<HTMLImageElement>(null);
  const locationBadgeRef = useRef<HTMLDivElement>(null);
  const locationTextRef = useRef<HTMLSpanElement>(null);
  const locationImageRef = useRef<HTMLImageElement>(null);
  const locationLinkRef = useRef<HTMLAnchorElement>(null);
  const currentLocIndexRef = useRef<number>(-1);

  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useLayoutEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1024) return;

      const section = sectionRef.current;
      const mapWrap = mapWrapRef.current;
      const map = mapRef.current;
      const cloud1 = cloud1Ref.current;
      const cloud2 = cloud2Ref.current;
      const hint = hintRef.current;
      if (!section || !mapWrap || !map) return;

      gsap.set(pointsRef.current, { autoAlpha: 0, scale: 0.6, y: 20 });

      // Centered initial state
      gsap.set(map, { scale: 1.0, xPercent: -50, yPercent: -50 });

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

      const total = locations.length;
      const PHASE1_UNITS = 1.0;
      const DOT_UNITS = 0.6;
      const HOLD_UNITS = 1.0;
      const LAST_HOLD_UNITS = 1.5;
      const PER_LOC = DOT_UNITS + HOLD_UNITS;

      const totalUnits =
        PHASE1_UNITS + (total - 1) * PER_LOC + DOT_UNITS + LAST_HOLD_UNITS;

      const tl = gsap.timeline({ paused: true });

      // ── Phase 1: clouds exit + map zooms slightly ──────────────
      tl.to(
        [cloud1, cloud2],
        {
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud1,
        {
          xPercent: 50,
          yPercent: -40,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud2,
        {
          xPercent: -50,
          yPercent: 40,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        map,
        {
          scale: 1.1,
          xPercent: -50,
          yPercent: -50,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      // Initial state: ensure badge is hidden
      tl.set(locationBadgeRef.current, { autoAlpha: 0, y: 20 }, 0);

      // ── Phase 2: Location badge entrance + text updates + zoom & pan ──────────────
      const updateBadge = (index: number, isManual: boolean = false) => {
        if (index === currentLocIndexRef.current && !isManual) return;

        const badge = locationBadgeRef.current;
        const badgeInner = badge?.querySelector(".badge-inner");

        const hideBadge = () => {
          if (!badge) return;
          gsap.to(badge, {
            autoAlpha: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
          });
          currentLocIndexRef.current = -1;
        };

        const applyUpdate = () => {
          const loc = locations[index];
          setSelectedLocation(loc.name);
          if (!loc) {
            hideBadge();
            return;
          }

          currentLocIndexRef.current = index;
          if (locationTextRef.current)
            locationTextRef.current.innerText = loc.name;
          if (locationImageRef.current)
            locationImageRef.current.src = loc.hero.img;

          if (locationLinkRef.current) {
            locationLinkRef.current.href = `/locations?location=${loc.name.toLowerCase()}`;
          }
        };

        if (index === -1) {
          hideBadge();
          return;
        }

        // First time show
        if (badge && (currentLocIndexRef.current === -1 || isManual)) {
          applyUpdate();
          gsap.set(badge, { visibility: "visible", pointerEvents: "auto" });
          gsap.to(badge, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          return;
        }

        // Subsequent updates
        if (badgeInner) {
          gsap.to(badgeInner, {
            autoAlpha: 0,
            y: 5,
            duration: 0.2,
            onComplete: () => {
              applyUpdate();
              gsap.to(badgeInner, {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            },
          });
        } else {
          applyUpdate();
        }
      };

      // Store function in ref for access in onClick
      (section as any)._updateBadge = (index: number) => {
        updateBadge(index, true);
        const st = ScrollTrigger.getById("mobileMapTrigger");
        if (!st) return;

        const targetPos =
          PHASE1_UNITS + index * PER_LOC + DOT_UNITS + HOLD_UNITS / 2;
        const progress = targetPos / totalUnits;
        const targetScroll = st.start + progress * (st.end - st.start);

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      };

      // Add a hide call at the very beginning of the exploration phase
      tl.call(() => updateBadge(-1), [], 0.1);

      // Loop to build the zoom/pan/badge animations for all locations
      locations.forEach((loc, i) => {
        const startPos = PHASE1_UNITS + i * PER_LOC;
        const left = parseFloat(loc.position?.mobile?.left || "50");
        const top = parseFloat(loc.position?.mobile?.top || "50");
        const clamped = getClampedTranslation(left, top, 1.6);

        // Map zoom & pan tween
        tl.to(
          map,
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
          },
          startPos,
        );

        // Update badge as it scrolls to this location
        tl.call(() => updateBadge(i), [], startPos + DOT_UNITS / 2);
      });

      // Hide badge at the very end
      tl.to(
        locationBadgeRef.current,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.1,
          ease: "power2.in",
        },
        totalUnits - 0.1,
      );

      // ── ScrollTrigger drives the timeline ──────────────────────────────
      ScrollTrigger.create({
        id: "mobileMapTrigger",
        trigger: section,
        start: "top top",
        end: `+=${50 * totalUnits}%`, // Scroll length proportional to number of locations
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          if (hint) gsap.set(hint, { autoAlpha: self.progress > 0.05 ? 0 : 1 });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [locations]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen w-full lg:hidden block overflow-x-hidden"
      >
        {/* ── MAP ── */}
        <div
          ref={mapWrapRef}
          className="relative h-full overflow-hidden"
          style={{ width: "100%" }}
        >
          <div
            ref={mapRef}
            style={{
              width: "max(100vw, calc(100vh * 1288 / 2377))",
              height: "max(100vh, calc(100vw * 2377 / 1288))",
            }}
            className="absolute left-1/2 top-1/2 origin-center will-change-transform"
          >
            <img
              ref={mapImgRef}
              src="/images/home/location-wise-pro/map-mob.webp"
              className="w-full h-full object-fill select-none pointer-events-none"
              draggable={false}
            />

            {/* POINTS inside the map container so they zoom and translate with it */}
            {locations.map((loc, i) => {
              const position = loc.position;
              return (
                <div
                  key={loc.id}
                  ref={(el) => {
                    pointsRef.current[i] = el;
                  }}
                  onClick={() => {
                    if (sectionRef.current) {
                      (sectionRef.current as any)._updateBadge?.(i);
                    }
                  }}
                  style={{
                    top: position?.mobile?.top,
                    left: position?.mobile?.left,
                  }}
                  className="absolute z-50 cursor-pointer flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative w-3.5 h-3.5">
                    <span className="absolute inset-0 rounded-full bg-(--blue) animate-ping" />
                    <span className="absolute inset-0 rounded-full bg-(--blue) border-[3px] border-white" />
                  </div>
                  <p
                    className={`${agency.className} mt-2 text-[12px] capitalize whitespace-nowrap bg-white rounded-2xl px-2 py-0.5 leading-normal font-semibold text-(--blue) shadow-md`}
                  >
                    {loc.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CLOUD 1 */}
          <div
            ref={cloud1Ref}
            className="absolute top-[-8%] -left-55 z-10 pointer-events-none"
          >
            <img
              src="/images/home/location-wise-pro/cloud-2.png"
              className="w-[110%] object-contain"
            />
          </div>

          <img
            className="static-triangle absolute bottom-4 left-[25%] w-[100px] opacity-55"
            src="/images/home/location-wise-pro/triangle.svg"
            alt="triangle"
          />

          {/* CLOUD 2 */}
          <div
            ref={cloud2Ref}
            className="absolute bottom-[-10%] -left-[55%] z-10 pointer-events-none"
          >
            <img
              src="/images/home/location-wise-pro/cloud-2.png"
              className="w-[100%] object-contain"
            />
          </div>
        </div>

        {/* ── FLOATING LOCATION INDICATOR ───────────────── */}
        <div
          ref={locationBadgeRef}
          className="absolute top-15 left-1/2 -translate-x-1/2 z-50 pointer-events-none invisible opacity-0 translate-y-2 flex flex-col items-center cursor-pointer"
        >
          <div className="bg-white p-3 w-[200px] badge-inner will-change-transform">
            <Link
              href={`/projects?location=${selectedLocation}`}
              className="text-black "
            >
              <div className="w-full h-25  overflow-hidden border border-white/20 shrink-0 bg-white/5">
                <img
                  ref={locationImageRef}
                  src="/images/"
                  className="w-full h-full object-cover"
                  alt="Location"
                />
              </div>
              <div className="flex flex-col pt-2 text-center">
                <span
                  ref={locationTextRef}
                  className={`${agency.className} text-black text-[12px] uppercase tracking-[0.2em] whitespace-nowrap leading-tight`}
                >
                  Our Locations
                </span>
                <span className="text-black text-[8px] uppercase tracking-[0.3em]">
                  View Projects
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        ></div>
      </section>
    </>
  );
}
