"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import { registerGSAP, gsap } from "@/src/website/utils/gsap";
import Image from "next/image";
import Link from "next/link";
import React, {
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { LocationData, ModalHandle } from "./LocationContainers";
import { TriangleImg } from "../../common/VectorImages";
import { FiArrowRight } from "react-icons/fi";
import { LocationIcon } from "../../common/SVGIcons";

interface Props {
  /** Called after the close animation fully completes */
  onClosed?: () => void;
  /**
   * Ref owned by the parent — modal sets it true while pointer is inside
   * the panel so the scroll-driven logic doesn't fire during panel scrolling.
   */
  panelHoveredRef?: React.RefObject<boolean>;
}

export const LocationWiseProjectModal = forwardRef<ModalHandle, Props>(
  ({ onClosed, panelHoveredRef }, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const cardImgRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<LocationData | null>(null);
    const isOpenRef = useRef(false);
    const activeTl = useRef<gsap.core.Timeline | null>(null);

    // ── Imperative API ────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      open(newData) {
        if (isOpenRef.current) return; // already open — caller should use swap()
        isOpenRef.current = true;
        setData(newData);

        requestAnimationFrame(() => {
          if (!panelRef.current) return;
          activeTl.current?.kill();

          gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });

          activeTl.current = gsap.timeline().to(
            panelRef.current,
            {
              xPercent: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.1",
          );
        });
      },

      swap(newData) {
        // Panel stays open, only content fades
        setData(newData);
        requestAnimationFrame(() => {
          if (!contentRef.current) return;
          gsap.set(contentRef.current, { y: 0 }); // reset internal scroll
          gsap.fromTo(
            contentRef.current,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          );
        });
      },

      close() {
        if (!isOpenRef.current) return; // already closed
        isOpenRef.current = false;
        activeTl.current?.kill();

        if (!panelRef.current) return;

        activeTl.current = gsap
          .timeline({
            onComplete: () => {
              setData(null);
              onClosed?.();
            },
          })
          .to(panelRef.current, {
            xPercent: 100,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power3.in",
          });
      },
    }));

    // ── Hide on mount (GSAP controls visibility from here on) ────────────
    useLayoutEffect(() => {
      registerGSAP();
      if (!panelRef.current) return;
      gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
    }, []);

    // ── Custom smooth scroll inside the panel ─────────────────────────────
    useLayoutEffect(() => {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return;

      let y = 0,
        startY = 0;

      const maxScroll = () =>
        Math.max(0, content.scrollHeight - viewport.clientHeight);
      const clamp = (v: number) => gsap.utils.clamp(-maxScroll(), 0, v);
      const animateTo = (v: number) => {
        y = clamp(v);
        gsap.to(content, { y, duration: 0.45, ease: "power3.out" });
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation(); // keep ScrollTrigger on window from seeing this
        animateTo(y - e.deltaY);
      };
      const onTouchStart = (e: TouchEvent) => {
        e.stopPropagation();
        startY = e.touches[0].clientY;
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = startY - e.touches[0].clientY;
        startY = e.touches[0].clientY;
        animateTo(y - delta);
      };

      // Also block wheel on the whole panel element (covers header, close btn area etc.)
      const panel = panelRef.current;
      const blockWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      panel?.addEventListener("wheel", blockWheel, { passive: false });

      // Toggle the parent's hover flag so scroll-driven logic is suppressed
      const onPanelEnter = () => {
        if (panelHoveredRef)
          (panelHoveredRef as React.MutableRefObject<boolean>).current = true;
      };
      const onPanelLeave = () => {
        if (panelHoveredRef)
          (panelHoveredRef as React.MutableRefObject<boolean>).current = false;
      };
      panel?.addEventListener("pointerenter", onPanelEnter);
      panel?.addEventListener("pointerleave", onPanelLeave);

      viewport.addEventListener("wheel", onWheel, { passive: false });
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchmove", onTouchMove, { passive: false });

      return () => {
        panel?.removeEventListener("wheel", blockWheel);
        panel?.removeEventListener("pointerenter", onPanelEnter);
        panel?.removeEventListener("pointerleave", onPanelLeave);
        viewport.removeEventListener("wheel", onWheel);
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchmove", onTouchMove);
      };
    }, []);

    // ── User clicks X or the overlay ─────────────────────────────────────
    const handleClose = () => {
      if (!isOpenRef.current) return;
      isOpenRef.current = false;
      activeTl.current?.kill();

      if (!panelRef.current) return;

      activeTl.current = gsap
        .timeline({
          onComplete: () => {
            setData(null);
            onClosed?.();
          },
        })
        .to(panelRef.current, {
          xPercent: 100,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power3.in",
        });
    };

    const renderContent = () => {
      return (
        <>
          {data?.properties.length === 0 ? (
            <>
              <div className="flex flex-col pt-65 h-full  relative z-1">
                <div className="absolute top-8 z-0 flex justify-center left-0 right-0">
                  <TriangleImg
                    // src="/images/home/testimonial-bg.png"
                    size="w-[200px]"
                  />
                </div>

                {/* Location */}
                <div className="pb-10">
                  <h5
                    className={`${agency.className} flex gap-3 items-center text-lg tracking-[1px] text-[#0F3C78] mb-4`}
                  >
                    <LocationIcon /> {data.hero.title}
                  </h5>

                  <p
                    className={`${blauerNue.className} text-base leading-[1.8] font-light text-black`}
                  >
                    {data?.desc || data?.hero?.desc}
                  </p>
                </div>
                {/* Coming Soon */}
                <div className="flex">
                  <h2
                    className={`${agency.className} text-[#0F3C78] text-[32px] leading-none tracking-[2px] uppercase py-6`}
                  >
                    Coming Soon
                  </h2>
                </div>
                {/* <div className="flex justify-between opacity-100 pt-5">
                  {["", "", "", ""].map((_, i) => (
                    <div className={`relative`} key={i}>
                      <TriangleImg
                        src="/images/home/testimonial-bg.png"
                        size="w-[70px] lg:w-[70px]"
                      />
                    </div>
                  ))}
                </div> */}
              </div>
            </>
          ) : (
            <>
              {data && (
                <>
                  <div className="modal-hero-section">
                    <div ref={cardImgRef} className="overflow-hidden">
                      <Image
                        src={data.hero.img}
                        alt={data.hero.title}
                        height={300}
                        width={400}
                        className="h-[300px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                      />
                    </div>
                    <h5
                      className={`${agency.className} flex gap-3 items-center text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}
                    >
                      <LocationIcon /> {data.hero.title}
                    </h5>
                    <p
                      className={`${blauerNue.className} font-extralight tracking-[0.5px] pt-2`}
                    >
                      {data?.desc || data?.hero?.desc}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-5 pt-8">
                    {data.properties.map((item, i) => (
                      <ProjectCard key={i} item={item} />
                    ))}
                  </div>

                  <div className="pt-8 pb-4 shrink-0">
                    <Link
                      href={`/projects?location=${encodeURIComponent(data.name)}`}
                      className={`group flex items-center justify-center gap-2 w-full py-3.5 border border-[#0F3C78] text-[#0F3C78] hover:bg-[#0F3C78] hover:text-white transition-colors duration-300 font-semibold tracking-[1.5px] uppercase ${blauerNue.className} text-xs`}
                    >
                      view all projects
                      <FiArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </>
      );
    };

    // Always in the DOM — GSAP controls visibility via autoAlpha
    return (
      <div className="absolute inset-0 z-[999] pointer-events-none">
        <div
          ref={panelRef}
          className="relative ml-auto h-full w-full lg:w-[400px] bg-white py-10 px-6 z-10 flex flex-col pointer-events-auto"
          style={{ visibility: "hidden" }}
        >
          <button
            className={`pb-3 ${blauerNue.className} text-sm font-medium flex items-center justify-end ml-auto mr-0 gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition shrink-0`}
            onClick={handleClose}
          >
            CLOSE
            <span>
              <Image
                src="/images/home/testimonial-arrow.png"
                alt="Close"
                width={15}
                height={15}
              />
            </span>
          </button>
          <div ref={viewportRef} className="flex-1 overflow-hidden relative">
            <div ref={contentRef} className="h-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

LocationWiseProjectModal.displayName = "LocationWiseProjectModal";

// ─────────────────────────────────────────────────────────────────────────────

const ProjectCard = ({ item }: { item: LocationData["properties"][0] }) => (
  <Link
    href={item.slug ?? "#"}
    className="flex gap-6 items-center group border-b border-(--blue)/20 pb-5"
  >
    <div className="overflow-hidden shrink-0">
      <Image
        src={item.img}
        height={120}
        width={150}
        alt={item.title}
        className="transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </div>
    <div>
      <p
        className={`${agency.className} text-base tracking-[1px] opacity-[0.9] uppercase`}
      >
        {item.title}
      </p>
      <span className="text-(--blue) opacity-[0.9] font-semibold flex items-center gap-2 capitalize pt-1">
        view more
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          <path
            d="M1 13L13 1M13 1H4M13 1V10"
            stroke="#0F3C78"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  </Link>
);

// "use client";

// import { agency, blauerNue } from "@/src/app/fonts";
// import { registerGSAP, gsap } from "@/src/website/utils/gsap";
// import Image from "next/image";
// import Link from "next/link";
// import React, {
//   useLayoutEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
//   useState,
// } from "react";
// import { LocationData, ModalHandle } from "./LocationContainers";

// interface Props {
//   /** Called after the close animation fully completes */
//   onClosed?: () => void;
//   /**
//    * Ref owned by the parent — modal sets it true while pointer is inside
//    * the panel so the scroll-driven logic doesn't fire during panel scrolling.
//    */
//   panelHoveredRef?: React.RefObject<boolean>;
// }

// export const LocationWiseProjectModal = forwardRef<ModalHandle, Props>(
//   ({ onClosed, panelHoveredRef }, ref) => {
//     const panelRef = useRef<HTMLDivElement>(null);
//     const cardImgRef = useRef<HTMLDivElement>(null);
//     const viewportRef = useRef<HTMLDivElement>(null);
//     const contentRef = useRef<HTMLDivElement>(null);

//     const [data, setData] = useState<LocationData | null>(null);
//     const isOpenRef = useRef(false);
//     const activeTl = useRef<gsap.core.Timeline | null>(null);

//     // ── Imperative API ────────────────────────────────────────────────────
//     useImperativeHandle(ref, () => ({
//       open(newData) {
//         if (isOpenRef.current) return; // already open — caller should use swap()
//         isOpenRef.current = true;
//         setData(newData);

//         requestAnimationFrame(() => {
//           if (!panelRef.current) return;
//           activeTl.current?.kill();

//           gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });

//           activeTl.current = gsap.timeline().to(
//             panelRef.current,
//             {
//               xPercent: 0,
//               autoAlpha: 1,
//               duration: 0.5,
//               ease: "power3.out",
//             },
//             "-=0.1",
//           );
//         });
//       },

//       swap(newData) {
//         // Panel stays open, only content fades
//         setData(newData);
//         requestAnimationFrame(() => {
//           if (!contentRef.current) return;
//           gsap.set(contentRef.current, { y: 0 }); // reset internal scroll
//           gsap.fromTo(
//             contentRef.current,
//             { autoAlpha: 0, y: 10 },
//             { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
//           );
//         });
//       },

//       close() {
//         if (!isOpenRef.current) return; // already closed
//         isOpenRef.current = false;
//         activeTl.current?.kill();

//         if (!panelRef.current) return;

//         activeTl.current = gsap
//           .timeline({
//             onComplete: () => {
//               setData(null);
//               onClosed?.();
//             },
//           })
//           .to(panelRef.current, {
//             xPercent: 100,
//             autoAlpha: 0,
//             duration: 0.4,
//             ease: "power3.in",
//           });
//       },
//     }));

//     // ── Hide on mount (GSAP controls visibility from here on) ────────────
//     useLayoutEffect(() => {
//       registerGSAP();
//       if (!panelRef.current) return;
//       gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
//     }, []);

//     // ── Custom smooth scroll inside the panel ─────────────────────────────
//     useLayoutEffect(() => {
//       const viewport = viewportRef.current;
//       const content = contentRef.current;
//       if (!viewport || !content) return;

//       let y = 0,
//         startY = 0;

//       const maxScroll = () =>
//         Math.max(0, content.scrollHeight - viewport.clientHeight);
//       const clamp = (v: number) => gsap.utils.clamp(-maxScroll(), 0, v);
//       const animateTo = (v: number) => {
//         y = clamp(v);
//         gsap.to(content, { y, duration: 0.45, ease: "power3.out" });
//       };

//       const onWheel = (e: WheelEvent) => {
//         e.preventDefault();
//         e.stopPropagation(); // keep ScrollTrigger on window from seeing this
//         animateTo(y - e.deltaY);
//       };
//       const onTouchStart = (e: TouchEvent) => {
//         e.stopPropagation();
//         startY = e.touches[0].clientY;
//       };
//       const onTouchMove = (e: TouchEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         const delta = startY - e.touches[0].clientY;
//         startY = e.touches[0].clientY;
//         animateTo(y - delta);
//       };

//       // Also block wheel on the whole panel element (covers header, close btn area etc.)
//       const panel = panelRef.current;
//       const blockWheel = (e: WheelEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//       };
//       panel?.addEventListener("wheel", blockWheel, { passive: false });

//       // Toggle the parent's hover flag so scroll-driven logic is suppressed
//       const onPanelEnter = () => {
//         if (panelHoveredRef)
//           (panelHoveredRef as React.MutableRefObject<boolean>).current = true;
//       };
//       const onPanelLeave = () => {
//         if (panelHoveredRef)
//           (panelHoveredRef as React.MutableRefObject<boolean>).current = false;
//       };
//       panel?.addEventListener("pointerenter", onPanelEnter);
//       panel?.addEventListener("pointerleave", onPanelLeave);

//       viewport.addEventListener("wheel", onWheel, { passive: false });
//       viewport.addEventListener("touchstart", onTouchStart, { passive: true });
//       viewport.addEventListener("touchmove", onTouchMove, { passive: false });

//       return () => {
//         panel?.removeEventListener("wheel", blockWheel);
//         panel?.removeEventListener("pointerenter", onPanelEnter);
//         panel?.removeEventListener("pointerleave", onPanelLeave);
//         viewport.removeEventListener("wheel", onWheel);
//         viewport.removeEventListener("touchstart", onTouchStart);
//         viewport.removeEventListener("touchmove", onTouchMove);
//       };
//     }, []);

//     // ── User clicks X or the overlay ─────────────────────────────────────
//     const handleClose = () => {
//       if (!isOpenRef.current) return;
//       isOpenRef.current = false;
//       activeTl.current?.kill();

//       if (!panelRef.current) return;

//       activeTl.current = gsap
//         .timeline({
//           onComplete: () => {
//             setData(null);
//             onClosed?.();
//           },
//         })
//         .to(panelRef.current, {
//           xPercent: 100,
//           autoAlpha: 0,
//           duration: 0.4,
//           ease: "power3.in",
//         });
//     };

//     // Always in the DOM — GSAP controls visibility via autoAlpha
//     return (
//       <div className="absolute inset-0 z-[999] pointer-events-none">
//         <div
//           ref={panelRef}
//           className="relative ml-auto h-full w-full lg:w-[400px] bg-white py-10 px-6 z-10 flex flex-col pointer-events-auto"
//           style={{ visibility: "hidden" }}
//         >
//           <button
//             className={`pb-3 ${blauerNue.className} text-sm font-medium flex items-center justify-end ml-auto mr-0 gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition shrink-0`}
//             onClick={handleClose}
//           >
//             CLOSE
//             <span>
//               <Image
//                 src="/images/home/testimonial-arrow.png"
//                 alt="Close"
//                 width={15}
//                 height={15}
//               />
//             </span>
//           </button>

//           <div ref={viewportRef} className="flex-1 overflow-hidden relative">
//             <div ref={contentRef}>
//               {data && (
//                 <>
//                   <div className="modal-hero-section">
//                     <div ref={cardImgRef} className="overflow-hidden">
//                       <Image
//                         src={data.hero.img}
//                         alt={data.hero.title}
//                         height={300}
//                         width={400}
//                         className="h-[300px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
//                       />
//                     </div>
//                     <h5
//                       className={`${agency.className} text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}
//                     >
//                       {data.hero.title}
//                     </h5>
//                     <p
//                       className={`${blauerNue.className} font-extralight tracking-[0.5px] pt-2`}
//                     >
//                       {data?.desc || data?.hero?.desc}
//                     </p>
//                   </div>

//                   <div className="flex flex-col space-y-5 pt-8">
//                     {data.properties.map((item, i) => (
//                       <ProjectCard key={i} item={item} />
//                     ))}
//                   </div>

//                   <div className="pt-8 pb-4 shrink-0">
//                     <Link
//                       href={`/projects?location=${encodeURIComponent(data.name)}`}
//                       className={`group flex items-center justify-center gap-2 w-full py-3.5 border border-[#0F3C78] text-[#0F3C78] hover:bg-[#0F3C78] hover:text-white transition-colors duration-300 font-semibold tracking-[1.5px] uppercase ${blauerNue.className} text-xs`}
//                     >
//                       view all projects
//                       <svg
//                         width="12"
//                         height="12"
//                         viewBox="0 0 14 14"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="transition-transform duration-300 group-hover:translate-x-1"
//                       >
//                         <path
//                           d="M1 7H13M13 7L7 1M13 7L7 13"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </Link>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   },
// );

// LocationWiseProjectModal.displayName = "LocationWiseProjectModal";

// // ─────────────────────────────────────────────────────────────────────────────

// const ProjectCard = ({
//   item,
// }: {
//   item: LocationData["properties"][0];
// }) => (
//   <Link
//     href={item.slug ?? "#"}
//     className="flex gap-6 items-center group border-b border-(--blue)/20 pb-5"
//   >
//     <div className="overflow-hidden shrink-0">
//       <Image
//         src={item.img}
//         height={120}
//         width={150}
//         alt={item.title}
//         className="transition-transform duration-700 ease-out group-hover:scale-110"
//       />
//     </div>
//     <div>
//       <p
//         className={`${agency.className} text-base tracking-[1px] opacity-[0.9] uppercase`}
//       >
//         {item.title}
//       </p>
//       <span className="text-(--blue) opacity-[0.9] font-semibold flex items-center gap-2 capitalize pt-1">
//         view more
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 14 14"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//         >
//           <path
//             d="M1 13L13 1M13 1H4M13 1V10"
//             stroke="#0F3C78"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </span>
//     </div>
//   </Link>
// );
