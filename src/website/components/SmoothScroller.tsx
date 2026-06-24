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

// Set scrollRestoration to manual and reset scroll as early as possible on module load
if (typeof window !== "undefined") {
  registerGSAP();
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  ScrollTrigger.clearScrollMemory();
  window.scrollTo(0, 0);
}

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

    const resetScroll = () => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    };

    // Multi-stage reset to handle mobile browsers & safari quirks
    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(() => {
        resetScroll();
      });
    });
    const timeoutId = setTimeout(resetScroll, 100);

    return () => {
      ScrollTrigger.removeEventListener("refresh", refreshHandler);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
      clearTimeout(timeoutId);
    };
  }, []);

  // Listen for loaderDone event to perform a clean scroll reset and ScrollTrigger recalculation
  useEffect(() => {
    const handleLoaderDone = () => {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener("loaderDone", handleLoaderDone);
    return () => {
      window.removeEventListener("loaderDone", handleLoaderDone);
    };
  }, []);

  // Scroll to top on pathname change (route transitions)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Ensure lenis is running to allow scroll commands
    lenis.start();

    // Reset scroll immediately
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // Force recalculations on subsequent frames when layout has settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });
        ScrollTrigger.refresh();
      });
    });
  }, [pathname]);

  return <>{children}</>;
}
