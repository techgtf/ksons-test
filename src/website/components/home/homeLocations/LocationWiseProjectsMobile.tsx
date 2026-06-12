"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/src/website/utils/gsap";
import { agency } from "@/src/app/fonts";
import { locationProjectsData } from "./locationData";
import Link from "next/link";

export default function LocationWiseProjectsMobile() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);
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

  const locations = locationProjectsData;

  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useLayoutEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1024) return;

      const section = sectionRef.current;
      const mapWrap = mapWrapRef.current;
      const mapImg = mapImgRef.current;
      const cloud1 = cloud1Ref.current;
      const cloud2 = cloud2Ref.current;
      const hint = hintRef.current;
      if (!section || !mapWrap) return;

      gsap.set(pointsRef.current, { autoAlpha: 0, scale: 0.6, y: 20 });

      // Hide everything initially
      gsap.set(mapImg, { scale: 1.4, transformOrigin: "center center" });

      const tl = gsap.timeline({ paused: true });

      // ── Phase 1 (0% → 35%): clouds exit + image zooms in ──────────────
      tl.to(
        [cloud1, cloud2],
        {
          autoAlpha: 0,
          duration: 0.35,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud1,
        {
          xPercent: 50,
          yPercent: -40,
          duration: 0.35,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud2,
        {
          xPercent: -50,
          yPercent: 40,
          duration: 0.35,
          ease: "none",
        },
        0,
      );

      tl.to(
        mapImg,
        {
          scale: 2.5,
          duration: 0.35,
          ease: "none",
        },
        0,
      );

      // ── Phase 3 (55% → 100%): map pans left ────────────────────────────
      tl.to(
        mapWrap,
        {
          xPercent: 0,
          duration: 0.45,
          ease: "none",
        },
        0.55,
      );

      // ── Phase 4: Points appear ──────────────────────
      pointsRef.current.forEach((point, i) => {
        if (!point) return;

        tl.to(
          point,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          0.4 + i * 0.25, // Spread out widely: 0.4, 0.65, 0.9
        );
      });

      // Initial state: ensure badge is hidden
      tl.set(locationBadgeRef.current, { autoAlpha: 0, y: 20 }, 0);

      // ── Phase 5: Location badge entrance + text updates ──────────────

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
            locationLinkRef.current.href = `/locations?loc=${loc.name.toLowerCase()}`;
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
      (section as any)._updateBadge = (index: number) =>
        updateBadge(index, true);

      // Add a hide call at the very beginning of the exploration phase
      tl.call(() => updateBadge(-1), [], 0.1);

      // Spread out the location updates more evenly
      // Zoom is 0-0.35
      // Pan is 0.55-1.0
      // Let's put updates at 0.5, 0.75, 0.95
      tl.call(() => updateBadge(0), [], 0.45);
      tl.call(() => updateBadge(1), [], 0.7);
      tl.call(() => updateBadge(2), [], 0.9);

      // Hide badge at the very end
      tl.to(
        locationBadgeRef.current,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.1,
          ease: "power2.in",
        },
        0.98,
      );

      // ── ScrollTrigger drives the timeline ──────────────────────────────
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%", // Increased for slower scroll
        scrub: 1.5, // Increased for smoother feel
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
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen w-full lg:hidden block overflow-x-hidden"
      >
        {/* ── MAP (200% wide) ─────────────────────────── */}
        <div
          ref={mapWrapRef}
          className="relative h-full will-change-transform overflow-hidden"
          style={{ width: "150%" }}
        >
          <img
            ref={mapImgRef}
            src="/images/home/location-wise-pro/map-mob.webp"
            // src="/images/home/location-wise-pro/Map_6.png"
            className="w-full h-full object-cover"
            draggable={false}
          />

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

          {/* POINTS */}
          {locations.map((loc, i) => {
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
                  top: loc.responsive.mobile.top,
                  left: loc.responsive.mobile.left,
                }}
                className="absolute z-50 cursor-pointer flex flex-col items-center"
              >
                <div className="relative w-3.5 h-3.5">
                  <span className="absolute inset-0 rounded-full bg-(--blue) animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-(--blue) border-[3px] border-white" />
                </div>
                <p
                  className={`${agency.className} mt-1.5 text-[12px] capitalize whitespace-nowrap text-white [text-shadow:0_0_6px_rgba(0,0,0,1)]`}
                >
                  {loc.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── FLOATING LOCATION INDICATOR ───────────────── */}
        <div
          ref={locationBadgeRef}
          className="absolute top-15 left-1/2 -translate-x-1/2 z-50 pointer-events-none invisible opacity-0 translate-y-2 flex flex-col items-center cursor-pointer"
        >
          <div className="bg-white p-3 w-[200px] badge-inner will-change-transform">
            <div className="w-full h-25  overflow-hidden border border-white/20 shrink-0 bg-white/5">
              <img
                ref={locationImageRef}
                src="/images/home/location-wise-pro/map-mob.webp"
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
              <Link
                href={`/projects?loc=${selectedLocation}`}
                className="text-black text-[8px] uppercase tracking-[0.3em]"
              >
                View Projects
              </Link>
            </div>
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
// "use client";

// import React, { useLayoutEffect, useRef, useState } from "react";
// import { gsap, ScrollTrigger, registerGSAP } from "@/src/website/utils/gsap";
// import { agency } from "@/src/app/fonts";
// import { LocationWiseProjectModal } from "./LocationWiseProjectModal";

// const locations = [
//     { id: 1, top: "46.5%", left: "36%", name: "Delhi Ncr", side: "left" },
//     { id: 2, top: "54%", left: "52%", name: "Pune", side: "left" },
//     { id: 3, top: "55%", left: "164%", name: "Bengaluru", side: "right" },
//     { id: 4, top: "57%", left: "179%", name: "Ahmedabad", side: "right" },
//     { id: 5, top: "34%", left: "176%", name: "Bengaluru", side: "right" },
// ];

// export default function LocationWiseProjectsMobile() {
//     const sectionRef = useRef<HTMLDivElement>(null);
//     const mapWrapRef = useRef<HTMLDivElement>(null);
//     const cloud1Ref = useRef<HTMLDivElement>(null);
//     const cloud2Ref = useRef<HTMLDivElement>(null);
//     const pointsRef = useRef<(HTMLDivElement | null)[]>([]);
//     const hintRef = useRef<HTMLDivElement>(null);
//     const mapImgRef = useRef<HTMLImageElement>(null);
//     const [activeLocation, setActiveLocation] = useState<any>(null);

//     useLayoutEffect(() => {
//         registerGSAP();
//         const ctx = gsap.context(() => {
//             if (window.innerWidth >= 1024) return;

//             const section = sectionRef.current;
//             const mapWrap = mapWrapRef.current;
//             const mapImg = mapImgRef.current;
//             const cloud1 = cloud1Ref.current;
//             const cloud2 = cloud2Ref.current;
//             const hint = hintRef.current;
//             if (!section || !mapWrap) return;

//             const leftPoints = pointsRef.current.filter((_, i) => locations[i].side === "left");
//             const rightPoints = pointsRef.current.filter((_, i) => locations[i].side === "right");

//             // Hide everything initially
//             gsap.set([...leftPoints, ...rightPoints], { autoAlpha: 0, y: 20 });
//             gsap.set(mapImg, { scale: 1, transformOrigin: "center center" });

//             const tl = gsap.timeline({ paused: true });

//             // ── Phase 1 (0% → 35%): clouds exit + image zooms in ──────────────
//             tl.to([cloud1, cloud2], {
//                 autoAlpha: 0,
//                 duration: 0.35,
//                 ease: "none",
//             }, 0);

//             tl.to(cloud1, {
//                 xPercent: 50,
//                 yPercent: -40,
//                 duration: 0.35,
//                 ease: "none",
//             }, 0);

//             tl.to(cloud2, {
//                 xPercent: -50,
//                 yPercent: 40,
//                 duration: 0.35,
//                 ease: "none",
//             }, 0);

//             tl.to(mapImg, {
//                 scale: 1.2,
//                 duration: 0.35,
//                 ease: "none",
//             }, 0);

//             // ── Phase 2 (35% → 55%): left points appear ────────────────────────
//             tl.to(leftPoints, {
//                 autoAlpha: 1,
//                 y: 0,
//                 stagger: 0.08,
//                 duration: 0.15,
//                 ease: "power2.out",
//             }, 0.35);

//             // ── Phase 3 (55% → 100%): map pans left ────────────────────────────
//             tl.to(mapWrap, {
//                 xPercent: -50,
//                 duration: 0.45,
//                 ease: "none",
//             }, 0.55);

//             // ── Phase 4 (80% → 100%): right points appear ──────────────────────
//             tl.to(rightPoints, {
//                 autoAlpha: 1,
//                 y: 0,
//                 stagger: 0.06,
//                 duration: 0.15,
//                 ease: "power2.out",
//             }, 0.85);

//             // ── ScrollTrigger drives the timeline ──────────────────────────────
//             ScrollTrigger.create({
//                 trigger: section,
//                 start: "top top",
//                 end: "+=200%",
//                 scrub: 1,
//                 pin: true,
//                 anticipatePin: 1,
//                 invalidateOnRefresh: true,
//                 animation: tl,
//                 onUpdate: (self) => {
//                     if (hint) gsap.set(hint, { autoAlpha: self.progress > 0.05 ? 0 : 1 });
//                 },
//             });

//         }, sectionRef);

//         return () => ctx.revert();
//     }, []);

//     return (
//         <>
//             <section
//                 ref={sectionRef}
//                 className="relative h-screen w-full lg:hidden block overflow-x-hidden"
//             >
//                 {/* ── MAP (200% wide) ─────────────────────────── */}
//                 <div
//                     ref={mapWrapRef}
//                     className="relative h-full will-change-transform overflow-hidden"
//                     style={{ width: "200%" }}
//                 >
//                     <img
//                         ref={mapImgRef}
//                         src="/images/home/location-wise-pro/map-mob.webp"
//                         // src="/images/home/location-wise-pro/Map_6.png"
//                         className="w-full h-full object-cover"
//                         draggable={false}
//                     />

//                     {/* CLOUD 1 */}
//                     <div
//                         ref={cloud1Ref}
//                         className="absolute -top-[12%] -left-55 z-10 pointer-events-none"
//                     >
//                         <img
//                            src="/images/home/location-wise-pro/cloud-2.png"
//                             className="w-[1y0%] object-contain"
//                         />
//                     </div>

//                     {/* CLOUD 2 */}
//                     <div
//                         ref={cloud2Ref}
//                         className="absolute -bottom-[10%] -left-[55%] z-10 pointer-events-none"
//                     >
//                         <img
//                             src="/images/home/location-wise-pro/cloud-2.png"
//                             className="w-[100%] object-contain"
//                         />
//                     </div>

//                     {/* POINTS */}
//                     {locations.map((loc, i) => {
//                         const remappedLeft = `${parseFloat(loc.left) / 2}%`;
//                         return (
//                             <div
//                                 key={loc.id}
//                                 ref={(el) => { pointsRef.current[i] = el; }}
//                                 onClick={() => setActiveLocation(loc)}
//                                 style={{ top: loc.top, left: remappedLeft }}
//                                 className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
//                             >
//                                 <div className="relative w-3.5 h-3.5">
//                                     <span className="absolute inset-0 rounded-full bg-[var(--blue)] animate-ping" />
//                                     <span className="absolute inset-0 rounded-full bg-[var(--blue)] border-[3px] border-white" />
//                                 </div>
//                                 <p className={`${agency.className} mt-1.5 text-[12px] capitalize whitespace-nowrap text-white [text-shadow:0_0_6px_rgba(0,0,0,1)]`}>
//                                     {loc.name}
//                                 </p>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* ── SCROLL HINT ──────────────────────────────── */}
//                 <div
//                     ref={hintRef}
//                     className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
//                 >
//                     <div className="w-5 h-7 border-2 border-white/40 rounded-full flex justify-center pt-1">
//                         <span className="w-1 h-2 bg-white rounded-full animate-bounce" />
//                     </div>
//                     <p className="text-white/60 text-[9px] tracking-widest uppercase">Scroll to explore</p>
//                 </div>

//             </section>

//             {activeLocation && (
//                 <LocationWiseProjectModal closeModal={() => setActiveLocation(null)} />
//             )}
//         </>
//     );
// }
