"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "../utils/gsap";

type Props = {
  children: React.ReactNode;
};

export let lenisInstance: Lenis | null = null;

export const scrollLock = {
  lock: () => lenisInstance?.stop(),
  unlock: () => lenisInstance?.start(),
  scrollTo: (target: number, options?: object) =>
    lenisInstance?.scrollTo(target, options),
};

export default function SmoothScroller({ children }: Props) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGSAP();

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 0.8,
      syncTouch: true,
      touchMultiplier: 1.2,
    });

    lenisInstance = lenis;
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    const refreshHandler = () => {
      lenis.raf(performance.now());
    };

    ScrollTrigger.addEventListener("refresh", refreshHandler);

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.removeEventListener("refresh", refreshHandler);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // using this bcz of home page's hero section we are locking the screen
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Ensure lenis is started so it can receive scroll commands
    lenis.start();

    // kill lenis scroll immediately
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0); // hard native reset
        lenis.scrollTo(0, { immediate: true }); // sync lenis
        ScrollTrigger.refresh();

        // iOS Safari fallback
        // setTimeout(() => {
        //   window.scrollTo(0, 0);
        //   lenis.scrollTo(0, { immediate: true });
        //   ScrollTrigger.refresh();
        // }, 10);
      });
    });
  }, [pathname]);

  return <>{children}</>;
}

// "use client";

// import { useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";
// import Lenis from "@studio-freight/lenis";
// import { gsap, ScrollTrigger, registerGSAP } from "../utils/gsap";

// type Props = {
//     children: React.ReactNode;
// };

// export let lenisInstance: Lenis | null = null;

// export const scrollLock = {
//     lock: () => lenisInstance?.stop(),
//     unlock: () => lenisInstance?.start(),
//     scrollTo: (target: number, options?: object) =>
//         lenisInstance?.scrollTo(target, options),
// };

// export default function SmoothScroller({ children }: Props) {
//     const pathname = usePathname();
//     const lenisRef = useRef<Lenis | null>(null);

//     useEffect(() => {
//         registerGSAP();

//         const lenis = new Lenis({
//             duration: 1.2,
//             smoothWheel: true,
//         });

//         lenisInstance = lenis;
//         lenisRef.current = lenis;

//         const raf = (time: number) => {
//             lenis.raf(time * 1000);
//         };

//         gsap.ticker.add(raf);
//         gsap.ticker.lagSmoothing(0);

//         lenis.on("scroll", ScrollTrigger.update);

//         const refreshHandler = () => {
//             lenis.raf(performance.now());
//         };

//         ScrollTrigger.addEventListener("refresh", refreshHandler);

//         requestAnimationFrame(() => {
//             window.scrollTo(0, 0);
//             lenis.scrollTo(0, { immediate: true });
//             ScrollTrigger.refresh();
//         });

//         return () => {
//             ScrollTrigger.removeEventListener("refresh", refreshHandler);
//             gsap.ticker.remove(raf);
//             lenis.destroy();
//             lenisInstance = null;
//         };
//     }, []);

//     useEffect(() => {
//         // Disable browser scroll restoration — we handle it manually
//         if ('scrollRestoration' in history) {
//             history.scrollRestoration = 'manual';
//         }
//     }, []);

//     // using this bcz of home page's hero section we are locking the screen
//     useEffect(() => {
//         const lenis = lenisRef.current;
//         if (!lenis) return;

//         // kill lenis scroll immediately
//         lenis.scrollTo(0, { immediate: true });

//         // double rAF ensures browser scroll restoration has settled
//         requestAnimationFrame(() => {
//             requestAnimationFrame(() => {
//                 window.scrollTo(0, 0);          // hard native reset
//                 lenis.scrollTo(0, { immediate: true }); // sync lenis
//                 ScrollTrigger.refresh();
//             });
//         });
//     }, [pathname]);

//     return <>{children}</>;
// }
