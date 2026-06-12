"use client";
import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import Image from "next/image";
import { gsap } from "../../utils/gsap";
import { blauerNue } from "@/src/app/fonts";
import { scrollLock } from "../SmoothScroller";

export interface AnimatedLoaderHandle {
  show: () => void;
}

let loaderShown = false;

const AnimatedLoader = forwardRef<AnimatedLoaderHandle>((_, ref) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<HTMLDivElement | null>(null);
  const maskTriangleRef = useRef<SVGGElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const leftLogoRef = useRef<HTMLDivElement | null>(null);
  const rightLogoRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const tagLine = useRef<HTMLParagraphElement | null>(null);

  const [shouldRender, setShouldRender] = useState(!loaderShown);

  const runAnimation = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    if (loaderShown) return;
    loaderShown = true;

    // Lock scrolling while loader is active
    scrollLock.lock();
    document.body.style.overflow = "hidden";

    if (
      !wrapperRef.current ||
      !triangleRef.current ||
      !maskTriangleRef.current ||
      !overlayRef.current ||
      !leftLogoRef.current ||
      !rightLogoRef.current ||
      !contentRef.current
    )
      return;

    tlRef.current?.kill();

    gsap.set(wrapperRef.current, { opacity: 1, pointerEvents: "all" });

    gsap.set([triangleRef.current, maskTriangleRef.current], {
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      transformOrigin: "center center",
    });

    gsap.set(leftLogoRef.current, { x: -50, opacity: 0 });
    gsap.set(rightLogoRef.current, { x: 50, opacity: 0 });
    gsap.set(tagLine.current, { y: 20, opacity: 0 });
    gsap.set(contentRef.current, { opacity: 1 });
    gsap.set(overlayRef.current, { opacity: 1 });

    triangleRef.current.getBoundingClientRect();

    const rect = triangleRef.current.getBoundingClientRect();
    const parentRect = wrapperRef.current.getBoundingClientRect();

    const centerX = rect.left - parentRect.left + rect.width / 2;
    const centerY = rect.top - parentRect.top + rect.height / 2;

    gsap.set(maskTriangleRef.current, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 0.2,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline();
    tlRef.current = tl;

    // 1️⃣ Triangle first
    tl.to([triangleRef.current, maskTriangleRef.current], {
      opacity: 1,
      duration: 0.6,
    });

    // 2️⃣ Left logo
    tl.to(leftLogoRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.6,
    });

    // 3️⃣ Right logo
    tl.to(rightLogoRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.6,
    });

    // 4 Right logo
    tl.to(tagLine.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
    });

    // 4️⃣ Now triangle zoom (same as before)
    tl.to([triangleRef.current, maskTriangleRef.current], {
      scale: 180,
      duration: 2.8, // Reduced from 3.5 for better feel
      ease: "expo.inOut",
    });

    tl.to(overlayRef.current, { opacity: 0, duration: 1.2 }, "-=0.5");
    tl.to(leftLogoRef.current, { x: -200, opacity: 0, duration: 1.5 }, "-=3");
    tl.to(rightLogoRef.current, { x: 200, opacity: 0, duration: 1.5 }, "-=3");
    tl.to(contentRef.current, { opacity: 0, duration: 1 }, "-=3");

    tl.set(wrapperRef.current, { pointerEvents: "none" }, "-=1");

    tl.to(
      wrapperRef.current,
      {
        opacity: 0,
        duration: 0.6, // Reduced from 1 to make it snappier
        ease: "power1.out",
        onUpdate: function () {
          // Fire once at 20% progress of this tween
          if (this.progress() >= 0.2) {
            window.dispatchEvent(new CustomEvent("loaderDone"));
            this.vars.onUpdate = undefined; // prevent firing again
          }
        },
        onComplete: () => {
          // No Need to unlock screen here bcz we have to lock it for our home page hero section
          // scrollLock.unlock();
          // document.body.style.overflow = "";
          setShouldRender(false);
        },
      },
      "-=0.3",
    );
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShouldRender(false);
      return;
    }

    const timeout = setTimeout(() => {
      runAnimation();
    }, 50); // small delay fixes layout inconsistencies

    return () => {
      clearTimeout(timeout);
      tlRef.current?.kill();
      scrollLock.unlock();
      document.body.style.overflow = "";
    };
  }, []);

  useImperativeHandle(ref, () => ({
    show: () => runAnimation(),
  }));

  if (!shouldRender) return null;

  return (
    <div
      ref={wrapperRef}
      className="hidden md:flex fixed inset-0 z-[9999] items-center justify-center will-change-transform"
      // 👇 no pointerEvents here — gsap controls it entirely
    >
      <svg className="absolute inset-0 z-20 w-full h-full pointer-events-none">
        <defs>
          <mask id="triangle-mask">
            <rect width="100%" height="100%" fill="white" />
            <g ref={maskTriangleRef} style={{ opacity: 0 }}>
              <polygon points="50,0 0,100 100,100" fill="black" />
            </g>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="white"
          mask="url(#triangle-mask)"
        />
      </svg>

      <div
        ref={contentRef}
        className="flex flex-col items-start z-20 opacity-0"
      >
        <div className="flex items-end gap-2">
          <div ref={leftLogoRef}>
            <Image
              src="/images/home/logo-initial.svg"
              alt="left"
              width={50}
              height={50}
              className=""
            />
          </div>

          <div
            ref={triangleRef}
            className=" relative z-30"
            style={{
              width: "20px",
              height: "17px",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              transformOrigin: "center center",
            }}
          >
            <div
              ref={overlayRef}
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #2FD2ED 0%, #1C71E8 100%)",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          <div ref={rightLogoRef}>
            <Image
              src="/images/home/logo-last.svg"
              alt="right"
              width={150}
              height={30}
            />
          </div>
        </div>

        <p
          ref={tagLine}
          className={`${blauerNue.className} uppercase mt-3 flex items-center gap-2 w-full justify-between font-light tracking-[3.4px] text-sm`}
        >
          <span className="w-14 h-[0.6px] bg-black"></span>
          Creating Value
        </p>
      </div>
    </div>
  );
});

AnimatedLoader.displayName = "AnimatedLoader";
export default AnimatedLoader;

// =======================================//
// Loader with Global State
// =======================================//

// "use client";
// import { useRef, useEffect, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
// import Image from "next/image";
// import { gsap } from "../../utils/gsap";
// import { blauerNue } from "@/src/app/fonts";
// import { bootState } from "@/src/website/utils/bootState";

// export interface AnimatedLoaderHandle {
//     show: () => void;
// }

// const AnimatedLoader = forwardRef<AnimatedLoaderHandle>((_, ref) => {
//     const wrapperRef = useRef<HTMLDivElement | null>(null);
//     const triangleRef = useRef<HTMLDivElement | null>(null);
//     const maskTriangleRef = useRef<SVGGElement | null>(null);
//     const overlayRef = useRef<HTMLDivElement | null>(null);
//     const leftLogoRef = useRef<HTMLDivElement | null>(null);
//     const rightLogoRef = useRef<HTMLDivElement | null>(null);
//     const contentRef = useRef<HTMLDivElement | null>(null);
//     const tlRef = useRef<gsap.core.Timeline | null>(null);
//     const tagLine = useRef<HTMLParagraphElement | null>(null);

//     const bootTriggered = useRef(false);

//     const runAnimation = () => {
//         if (
//             !wrapperRef.current ||
//             !triangleRef.current ||
//             !maskTriangleRef.current ||
//             !overlayRef.current ||
//             !leftLogoRef.current ||
//             !rightLogoRef.current ||
//             !contentRef.current
//         )
//             return;

//         tlRef.current?.kill();

//         gsap.set(wrapperRef.current, { opacity: 1, pointerEvents: "all" });

//         gsap.set([triangleRef.current, maskTriangleRef.current], {
//             scale: 1,
//             opacity: 0,
//             transformOrigin: "center center",
//         });

//         gsap.set(leftLogoRef.current, { x: -50, opacity: 0 });
//         gsap.set(rightLogoRef.current, { x: 50, opacity: 0 });
//         gsap.set(tagLine.current, { y: 20, opacity: 0 });
//         gsap.set(contentRef.current, { opacity: 1 });
//         gsap.set(overlayRef.current, { opacity: 1 });

//         triangleRef.current.getBoundingClientRect();

//         const rect = triangleRef.current.getBoundingClientRect();
//         const parentRect = wrapperRef.current.getBoundingClientRect();

//         const centerX = rect.left - parentRect.left + rect.width / 2;
//         const centerY = rect.top - parentRect.top + rect.height / 2;

//         gsap.set(maskTriangleRef.current, {
//             x: centerX - 50,
//             y: centerY - 50,
//             scale: 0.2,
//             transformOrigin: "center center",
//         });

//         const tl = gsap.timeline();
//         tlRef.current = tl;

//         /* 1 Triangle */
//         tl.to([triangleRef.current, maskTriangleRef.current], {
//             opacity: 1,
//             duration: 0.45,
//         });

//         /* 2 Left */
//         tl.to(leftLogoRef.current, {
//             x: 0,
//             opacity: 1,
//             duration: 0.45,
//         });

//         /* 3 Right */
//         tl.to(rightLogoRef.current, {
//             x: 0,
//             opacity: 1,
//             duration: 0.45,
//         });

//         /* 4 Tagline */
//         tl.to(tagLine.current, {
//             y: 0,
//             opacity: 1,
//             duration: 0.4,
//         });

//         /* 5 Zoom faster */
//         tl.to([triangleRef.current, maskTriangleRef.current], {
//             scale: 180,
//             duration: 2.6, // before 3.5
//             ease: "expo.inOut",
//         });

//         /* exit faster */
//         tl.to(overlayRef.current, { opacity: 0, duration: 0.8 }, "-=0.6");

//         tl.to(
//             leftLogoRef.current,
//             { x: -200, opacity: 0, duration: 1 },
//             "-=2.3"
//         );

//         tl.to(
//             rightLogoRef.current,
//             { x: 200, opacity: 0, duration: 1 },
//             "-=2.3"
//         );

//         tl.to(contentRef.current, { opacity: 0, duration: 0.8 }, "-=2.3");

//         tl.set(wrapperRef.current, { pointerEvents: "none" }, "-=0.3");

//         tl.to(
//             wrapperRef.current,
//             {
//                 opacity: 0,
//                 duration: 0.7,
//                 ease: "power1.out",
//                 // onComplete: () => {
//                 //     bootState.isBooted = true;
//                 //     window.dispatchEvent(new Event("boot-complete"));
//                 // },
//                 onStart: () => {
//                     if (!bootTriggered.current) {
//                         bootTriggered.current = true;
//                         bootState.isBooted = true;

//                         window.dispatchEvent(
//                             new CustomEvent("boot-complete")
//                         );
//                     }
//                 }
//             },
//             "-=0.1"
//         );
//     };

//     useLayoutEffect(() => {
//         const raf = requestAnimationFrame(() => {
//             runAnimation();
//         });

//         return () => {
//             cancelAnimationFrame(raf);
//             tlRef.current?.kill();
//         };
//     }, []);

//     useImperativeHandle(ref, () => ({
//         show: () => runAnimation(),
//     }));

//     return (
//         <div
//             ref={wrapperRef}
//             className="fixed inset-0 z-[9999] flex items-center justify-center will-change-transform opacity-0"
//         // 👇 no pointerEvents here — gsap controls it entirely
//         >
//             <svg className="absolute inset-0 z-20 w-full h-full pointer-events-none">
//                 <defs>
//                     <mask id="triangle-mask">
//                         <rect width="100%" height="100%" fill="white" />
//                         <g ref={maskTriangleRef}>
//                             <polygon points="50,0 0,100 100,100" fill="black" />
//                         </g>
//                     </mask>
//                 </defs>
//                 <rect width="100%" height="100%" fill="white" mask="url(#triangle-mask)" />
//             </svg>

//             <div ref={contentRef} className="flex flex-col items-start z-20">
//                 <div className="flex items-end">
//                     <div ref={leftLogoRef}>
//                         <Image
//                             src="/images/home/logo-initial.svg"
//                             alt="left"
//                             width={50}
//                             height={50}
//                             className="mr-2.5"
//                         />
//                     </div>

//                     <div
//                         ref={triangleRef}
//                         className="mr-2.5 relative z-30 bg-white"
//                         style={{
//                             width: "20px",
//                             height: "17px",
//                             clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
//                             transformOrigin: "center center",
//                         }}
//                     >
//                         <div
//                             ref={overlayRef}
//                             className="absolute inset-0"
//                             style={{
//                                 background: "linear-gradient(180deg, #2FD2ED 0%, #1C71E8 100%)",
//                                 clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
//                             }}
//                         />
//                     </div>

//                     <div ref={rightLogoRef}>
//                         <Image
//                             src="/images/home/logo-last.svg"
//                             alt="right"
//                             width={150}
//                             height={30}
//                         />
//                     </div>
//                 </div>

//                 <p ref={tagLine} className={`${blauerNue.className} uppercase mt-3 flex items-center gap-2 w-full justify-between font-light tracking-[3.4px] text-sm`}>
//                     <span className="w-14 h-[0.6px] bg-black"></span>
//                     Creating Value
//                 </p>
//             </div>
//         </div>
//     );
// });

// AnimatedLoader.displayName = "AnimatedLoader";
// export default AnimatedLoader;
