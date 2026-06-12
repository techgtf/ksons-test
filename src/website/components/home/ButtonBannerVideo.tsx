"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { BsFillSkipForwardFill } from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";

export default function ButtonBannerVideo() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const video1Ref = useRef<HTMLVideoElement | null>(null);
    const video2Ref = useRef<HTMLVideoElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
    const nextBtnRef = useRef<HTMLButtonElement | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const totalVideos = 4;

    const reachedLastVideo = useRef<boolean>(false);
    const controlsRef = useRef<{
        next?: () => void;
        prev?: () => void;
        skip?: () => void;
    }>({});

    useLayoutEffect(() => {
        registerGSAP();

        if (ctaRef.current) {
            const tl = gsap.timeline({ delay: 0.6 });

            tl.fromTo(
                ctaRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );

            tl.fromTo(
                ctaRef.current.querySelector("h2"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            );

            tl.fromTo(
                ctaRef.current.querySelector("button"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            );
        }

        const smoother = (window as any).ScrollSmoother?.get?.();

        if (!video1Ref.current || !video2Ref.current) return;

        gsap.set(nextBtnRef.current, { opacity: 1 }); // 👈 no longer hidden by animation

        const isMobile = window.innerWidth < 768;

        const getVideoSrc = (index: number) =>
            isMobile
                ? `/images/home/banner/mobile/M${index}.mp4`
                : `/images/home/banner/${index}.mp4`;

        let scrollY = 0;

        const lockScroll = () => {
            scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
        };

        const unlockScroll = () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);
        };

        const videoEls = [video1Ref.current, video2Ref.current] as HTMLVideoElement[];

        let active = 0;
        let currentIndex = 0;
        let isPlaying = false;
        let isLocked = false;

        // =============================
        // 🎬 VIDEO PRELOAD
        // =============================
        for (let i = 1; i <= totalVideos; i++) {
            const v = document.createElement("video");
            v.src = getVideoSrc(i);
            v.preload = "auto";
            v.load();
        }

        const firstVideo = videoEls[0];
        firstVideo.src = getVideoSrc(1);
        firstVideo.load();

        firstVideo.onloadeddata = () => {
            firstVideo.currentTime = 0;
            const playPromise = firstVideo.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    const resume = () => {
                        firstVideo.play();
                        window.removeEventListener("click", resume);
                    };
                    window.addEventListener("click", resume);
                });
            }
        };

        // =============================
        // 🎬 VIDEO SEQUENCE LOGIC
        // =============================
        let trigger: ScrollTrigger;

        const playNext = () => {
            if (isPlaying) return;

            isPlaying = true;
            isLocked = true;

            if (!isMobile) {
                lockScroll();
                if (smoother) smoother.paused(true);
            }

            const nextIndex = currentIndex + 1;
            const next = (active + 1) % 2;
            const currentVideo = videoEls[active];
            const nextVideo = videoEls[next];

            nextVideo.src = getVideoSrc(nextIndex + 1);
            nextVideo.load();

            nextVideo.onloadeddata = () => {
                nextVideo.currentTime = 0;

                nextVideo.play().then(() => {
                    gsap.to(currentVideo, { opacity: 0, duration: 0.25 });
                    gsap.to(nextVideo, {
                        opacity: 1,
                        duration: 0.25,
                        onComplete: () => {
                            active = next;
                            currentIndex = nextIndex;
                            setActiveIndex(nextIndex);

                            nextVideo.onended = () => {
                                if (reachedLastVideo.current) return;

                                isPlaying = false;
                                isLocked = false;
                                if (!isMobile) {
                                    unlockScroll();
                                    if (smoother) smoother.paused(false);
                                }
                            };
                        },
                    });
                }).catch(() => {
                    isPlaying = false;
                    isLocked = false;
                    if (!isMobile) {
                        unlockScroll();
                        if (smoother) smoother.paused(false);
                    }
                });
            };
        };

        const playPrev = () => {
            if (isPlaying || currentIndex === 0) return;

            isPlaying = true;

            const prevIndex = currentIndex - 1;
            const next = (active + 1) % 2;
            const currentVideo = videoEls[active];
            const nextVideo = videoEls[next];

            nextVideo.src = getVideoSrc(prevIndex + 1);
            nextVideo.load();

            nextVideo.onloadeddata = () => {
                nextVideo.currentTime = 0;

                nextVideo.play().then(() => {
                    gsap.to(currentVideo, { opacity: 0, duration: 0.25 });
                    gsap.to(nextVideo, {
                        opacity: 1,
                        duration: 0.25,
                        onComplete: () => {
                            active = next;
                            currentIndex = prevIndex;
                            setActiveIndex(prevIndex);

                            nextVideo.onended = () => {
                                isPlaying = false;
                            };
                        },
                    });
                }).catch(() => {
                    isPlaying = false;
                });
            };
        };

        controlsRef.current.next = playNext;
        controlsRef.current.prev = playPrev;

        // =============================
        // 📜 SCROLLTRIGGER
        // =============================
        if (!isMobile) {
            trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=1",
                pin: true,
                pinSpacing: true,
                scrub: false,
            });
        }

        if (!isMobile) {
            ScrollTrigger.normalizeScroll(true);
        }

        const handleScroll = (e: WheelEvent) => {
            if (reachedLastVideo.current) return;

            e.preventDefault();

            if (isPlaying || isLocked) return;

            if (e.deltaY > 0) {
                if (currentIndex < totalVideos - 1) {
                    playNext();
                } else {
                    reachedLastVideo.current = true;

                    const finalY = scrollY + window.innerHeight * 0.6;

                    if (trigger) trigger.kill();
                    unlockScroll();

                    requestAnimationFrame(() => {
                        window.scrollTo({ top: finalY, behavior: "smooth" });
                    });

                    if (smoother) {
                        smoother.scrollTo(finalY, true);
                        smoother.paused(false);
                    }

                    window.removeEventListener("wheel", handleScroll);
                }
            }
        };

        const skipAll = () => {
            if (reachedLastVideo.current) return;

            reachedLastVideo.current = true;

            videoEls.forEach((video) => {
                video.pause();
                video.onended = null;
                video.onloadeddata = null;
            });

            if (!isMobile) {
                const finalY = window.scrollY + window.innerHeight * 0.6;

                if (trigger) trigger.kill();
                unlockScroll();

                requestAnimationFrame(() => {
                    window.scrollTo({ top: finalY, behavior: "smooth" });
                });

                if (smoother) {
                    smoother.scrollTo(finalY, true);
                    smoother.paused(false);
                }
            }

            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };

        controlsRef.current.skip = skipAll;

        if (!isMobile) {
            window.addEventListener("wheel", handleScroll, { passive: false });
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                !reachedLastVideo.current &&
                (e.key === "ArrowDown" ||
                    e.key === "PageDown" ||
                    e.key === " " ||
                    e.key === "ArrowUp" ||
                    e.key === "PageUp")
            ) {
                e.preventDefault();
            }
        };

        ScrollTrigger.config({ ignoreMobileResize: true });

        // =============================
        // 🧹 CLEANUP
        // =============================
        return () => {
            if (trigger) trigger.kill();
            if (!isMobile) window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-[90vh] md:h-screen w-screen overflow-hidden will-change-transform bg-white flex items-center justify-center"
        >
            {[video1Ref, video2Ref].map((ref, i) => (
                <video
                    key={i}
                    ref={ref}
                    muted
                    playsInline
                    autoPlay
                    preload="auto"
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        top: 0,
                        left: 0,
                        opacity: i === 0 ? 1 : 0,
                        transform: "scale(1.01)",
                        backfaceVisibility: "hidden",
                    }}
                />
            ))}

            <div
                ref={ctaRef}
                className="absolute bottom-20 md:bottom-10 left-8 md:left-16 right-10 md:right-16 z-30 flex items-end justify-between opacity-0"
            >
                <h2 className={`${agency.className} text-[#0F3C78] text-xl md:text-4xl leading-snug max-w-sm`}>
                    K.sons: Building Trust, Creating Tomorrow
                </h2>

                {/* <button
                    className={`${blauerNue.className} px-4 md:px-6 py-2 md:py-3 text-white text-xs md:text-sm font-medium rounded-[100px] shadow-md transition hover:opacity-90 tracking-[1.2px] flex items-center`}
                    style={{
                        background: "linear-gradient(180deg, rgba(47, 210, 237, 0.80) 0%, rgba(28, 113, 232, 0.80) 100%)",
                        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    Explore
                </button> */}

                <button
                    onClick={() => controlsRef.current.skip?.()}
                    className={`${blauerNue.className} hidden md:flex items-center justify-center absolute top-0 right-4 z-50 px-4 py-2 text-sm bg-black/40 transition duration-300 hover:bg-black/60 text-white rounded-full`}
                >
                    Skip <BsFillSkipForwardFill className="ml-2" />
                </button>
            </div>

            {/* 📱 Mobile Controls */}
            <div className={`${agency.className} md:hidden absolute bottom-6 left-0 w-full flex justify-center gap-16 z-20`}>
                <button
                    onClick={() => controlsRef.current.prev?.()}
                    className="px-3 md:px-5 py-1 bg-black/40 text-white rounded-full transition-opacity duration-300 flex items-center justify-between font-extralight text-sm md:text-base"
                    style={{ visibility: activeIndex > 0 ? "visible" : "hidden" }}
                >
                    <MdNavigateNext className="rotate-180 text-lg" /> Previous
                </button>

                <button
                    ref={nextBtnRef}
                    onClick={() => controlsRef.current.next?.()}
                    className="px-3 md:px-5 py-1 bg-black/40 text-white rounded-full transition-opacity duration-300 flex items-center justify-between font-extralight text-sm md:text-base"
                    style={{
                        opacity: activeIndex < totalVideos - 1 ? 1 : 0,
                        pointerEvents: activeIndex < totalVideos - 1 ? "auto" : "none",
                    }}
                >
                    Next <MdNavigateNext className="text-lg" />
                </button>
            </div>

            <div className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-white z-50 pointer-events-none" />
        </div>
    );
}





// =============  ================= //
// play and pause video on scroll ================= //
// =============  ================= //


// "use client";
// import { useLayoutEffect, useRef, useState } from "react";
// import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
// import Image from "next/image";
// import { agency, blauerNue } from "@/src/app/fonts";
// import { BsFillSkipForwardFill } from "react-icons/bs";
// import { MdNavigateNext } from "react-icons/md";

// export default function ButtonBannerVideo() {
//     const containerRef = useRef<HTMLDivElement | null>(null);
//     const video1Ref = useRef<HTMLVideoElement | null>(null);
//     const video2Ref = useRef<HTMLVideoElement | null>(null);
//     const ctaRef = useRef<HTMLDivElement | null>(null);
//     const nextBtnRef = useRef<HTMLButtonElement | null>(null);

//     const [activeIndex, setActiveIndex] = useState(0);

//     const totalVideos = 4;

//     const reachedLastVideo = useRef<boolean>(false);
//     const controlsRef = useRef<{
//         next?: () => void;
//         prev?: () => void;
//         skip?: () => void;
//     }>({});

//     useLayoutEffect(() => {
//         registerGSAP();

//         if (ctaRef.current) {
//             const tl = gsap.timeline({ delay: 0.6 });

//             tl.fromTo(
//                 ctaRef.current,
//                 { opacity: 0, y: 30 },
//                 { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
//             );

//             tl.fromTo(
//                 ctaRef.current.querySelector("h2"),
//                 { opacity: 0, y: 20 },
//                 { opacity: 1, y: 0, duration: 0.6 },
//                 "-=0.4"
//             );

//             tl.fromTo(
//                 ctaRef.current.querySelector("button"),
//                 { opacity: 0, y: 20 },
//                 { opacity: 1, y: 0, duration: 0.6 },
//                 "-=0.4"
//             );
//         }

//         const smoother = (window as any).ScrollSmoother?.get?.();

//         if (!video1Ref.current || !video2Ref.current) return;

//         gsap.set(nextBtnRef.current, { opacity: 1 });

//         const isMobile = window.innerWidth < 768;

//         const getVideoSrc = (index: number) =>
//             isMobile
//                 ? `/images/home/banner/mobile/M${index}.mp4`
//                 : `/images/home/banner/${index}.mp4`;

//         let scrollY = 0;

//         const lockScroll = () => {
//             scrollY = window.scrollY;
//             document.body.style.position = "fixed";
//             document.body.style.top = `-${scrollY}px`;
//             document.body.style.left = "0";
//             document.body.style.right = "0";
//             document.body.style.width = "100%";
//         };

//         const unlockScroll = () => {
//             document.body.style.position = "";
//             document.body.style.top = "";
//             document.body.style.left = "";
//             document.body.style.right = "";
//             document.body.style.width = "";
//             window.scrollTo(0, scrollY);
//         };

//         const videoEls = [video1Ref.current, video2Ref.current] as HTMLVideoElement[];

//         let active = 0;
//         let currentIndex = 0;
//         let isTransitioning = false;
//         let isLocked = false;

//         // ============================================================
//         // 📌 SCROLL STOP DETECTION — pause after user stops scrolling
//         // ============================================================
//         let scrollStopTimer: ReturnType<typeof setTimeout> | null = null;
//         const SCROLL_STOP_DELAY = 120; // ms of silence = "stopped scrolling"

//         const pauseCurrentVideo = () => {
//             videoEls[active]?.pause();
//         };

//         const onScrollActivity = () => {
//             if (scrollStopTimer) {
//                 clearTimeout(scrollStopTimer);
//                 scrollStopTimer = null;
//             }
//             scrollStopTimer = setTimeout(() => {
//                 pauseCurrentVideo();
//             }, SCROLL_STOP_DELAY);
//         };

//         // ============================================================
//         // 🎬 VIDEO PRELOAD
//         // ============================================================
//         for (let i = 1; i <= totalVideos; i++) {
//             const v = document.createElement("video");
//             v.src = getVideoSrc(i);
//             v.preload = "auto";
//             v.load();
//         }

//         const firstVideo = videoEls[0];
//         firstVideo.src = getVideoSrc(1);
//         firstVideo.load();

//         firstVideo.onloadeddata = () => {
//             firstVideo.currentTime = 0;
//             // Don't auto-play — wait for first scroll
//         };

//         // ============================================================
//         // 🎬 VIDEO SEQUENCE LOGIC
//         // ============================================================
//         let trigger: ScrollTrigger;

//         const playNext = () => {
//             if (isTransitioning) return;

//             isTransitioning = true;
//             isLocked = true;

//             if (!isMobile) {
//                 lockScroll();
//                 if (smoother) smoother.paused(true);
//             }

//             const nextIndex = currentIndex + 1;
//             const next = (active + 1) % 2;
//             const currentVideo = videoEls[active];
//             const nextVideo = videoEls[next];

//             nextVideo.src = getVideoSrc(nextIndex + 1);
//             nextVideo.load();

//             nextVideo.onloadeddata = () => {
//                 nextVideo.currentTime = 0;

//                 nextVideo.play().then(() => {
//                     gsap.to(currentVideo, { opacity: 0, duration: 0.25 });
//                     gsap.to(nextVideo, {
//                         opacity: 1,
//                         duration: 0.25,
//                         onComplete: () => {
//                             active = next;
//                             currentIndex = nextIndex;
//                             setActiveIndex(nextIndex);
//                             isTransitioning = false;

//                             nextVideo.onended = () => {
//                                 if (reachedLastVideo.current) return;

//                                 isLocked = false;
//                                 if (!isMobile) {
//                                     unlockScroll();
//                                     if (smoother) smoother.paused(false);
//                                 }
//                             };
//                         },
//                     });
//                 }).catch(() => {
//                     isTransitioning = false;
//                     isLocked = false;
//                     if (!isMobile) {
//                         unlockScroll();
//                         if (smoother) smoother.paused(false);
//                     }
//                 });
//             };
//         };

//         const playPrev = () => {
//             if (isTransitioning || currentIndex === 0) return;

//             isTransitioning = true;

//             const prevIndex = currentIndex - 1;
//             const next = (active + 1) % 2;
//             const currentVideo = videoEls[active];
//             const nextVideo = videoEls[next];

//             nextVideo.src = getVideoSrc(prevIndex + 1);
//             nextVideo.load();

//             nextVideo.onloadeddata = () => {
//                 // For prev, start from END to reverse
//                 nextVideo.currentTime = nextVideo.duration || 0;

//                 gsap.to(currentVideo, { opacity: 0, duration: 0.25 });
//                 gsap.to(nextVideo, {
//                     opacity: 1,
//                     duration: 0.25,
//                     onComplete: () => {
//                         active = next;
//                         currentIndex = prevIndex;
//                         setActiveIndex(prevIndex);
//                         isTransitioning = false;
//                     },
//                 });
//             };
//         };

//         controlsRef.current.next = () => {
//             videoEls[active]?.play().catch(() => { });
//         };
//         controlsRef.current.prev = playPrev;

//         // ============================================================
//         // 📜 SCROLLTRIGGER PIN
//         // ============================================================
//         if (!isMobile) {
//             trigger = ScrollTrigger.create({
//                 trigger: containerRef.current,
//                 start: "top top",
//                 end: "+=1",
//                 pin: true,
//                 pinSpacing: true,
//                 scrub: false,
//             });
//         }

//         if (!isMobile) {
//             ScrollTrigger.normalizeScroll(true);
//         }

//         // ============================================================
//         // 🖱️ WHEEL HANDLER — core scroll-driven control
//         // ============================================================
//         const handleScroll = (e: WheelEvent) => {
//             if (reachedLastVideo.current) return;
//             e.preventDefault();

//             const deltaY = e.deltaY;

//             // ---- SCROLL UP — ignore ----
//             if (deltaY <= 0) return;

//             // ---- SCROLL DOWN ----
//             const video = videoEls[active];

//             if (video.paused) {
//                 video.play().catch(() => { });
//             }

//             onScrollActivity();

//             video.onended = () => {
//                 if (reachedLastVideo.current) return;

//                 if (currentIndex < totalVideos - 1) {
//                     playNext();
//                 } else {
//                     reachedLastVideo.current = true;
//                     const finalY = scrollY + window.innerHeight * 0.6;

//                     if (trigger) trigger.kill();
//                     unlockScroll();

//                     requestAnimationFrame(() => {
//                         window.scrollTo({ top: finalY, behavior: "smooth" });
//                     });

//                     if (smoother) {
//                         smoother.scrollTo(finalY, true);
//                         smoother.paused(false);
//                     }

//                     window.removeEventListener("wheel", handleScroll);
//                 }
//             };
//         };

//         // ============================================================
//         // ⏭️ SKIP ALL
//         // ============================================================
//         const skipAll = () => {
//             if (reachedLastVideo.current) return;

//             reachedLastVideo.current = true;

//             videoEls.forEach((video) => {
//                 video.pause();
//                 video.onended = null;
//                 video.onloadeddata = null;
//             });

//             if (!isMobile) {
//                 const finalY = window.scrollY + window.innerHeight * 0.6;

//                 if (trigger) trigger.kill();
//                 unlockScroll();

//                 requestAnimationFrame(() => {
//                     window.scrollTo({ top: finalY, behavior: "smooth" });
//                 });

//                 if (smoother) {
//                     smoother.scrollTo(finalY, true);
//                     smoother.paused(false);
//                 }
//             }

//             window.removeEventListener("wheel", handleScroll);
//             window.removeEventListener("keydown", handleKeyDown);
//         };

//         controlsRef.current.skip = skipAll;

//         if (!isMobile) {
//             window.addEventListener("wheel", handleScroll, { passive: false });
//         }

//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (
//                 !reachedLastVideo.current &&
//                 (e.key === "ArrowDown" ||
//                     e.key === "PageDown" ||
//                     e.key === " " ||
//                     e.key === "ArrowUp" ||
//                     e.key === "PageUp")
//             ) {
//                 e.preventDefault();
//             }
//         };

//         ScrollTrigger.config({ ignoreMobileResize: true });

//         // ============================================================
//         // 🧹 CLEANUP
//         // ============================================================
//         return () => {
//             if (scrollStopTimer) clearTimeout(scrollStopTimer);
//             if (trigger) trigger.kill();
//             if (!isMobile) ScrollTrigger.getAll().forEach((t) => t.kill());
//             if (!isMobile) window.removeEventListener("wheel", handleScroll);
//             window.removeEventListener("keydown", handleKeyDown);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="relative h-[90vh] md:h-screen w-screen overflow-hidden will-change-transform bg-white flex items-center justify-center"
//         >
//             {[video1Ref, video2Ref].map((ref, i) => (
//                 <video
//                     key={i}
//                     ref={ref}
//                     muted
//                     playsInline
//                     preload="auto"
//                     disablePictureInPicture
//                     controlsList="nodownload nofullscreen noremoteplayback"
//                     style={{
//                         position: "absolute",
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         top: 0,
//                         left: 0,
//                         opacity: i === 0 ? 1 : 0,
//                         transform: "scale(1.01)",
//                         backfaceVisibility: "hidden",
//                     }}
//                 />
//             ))}

//             <div
//                 ref={ctaRef}
//                 className="absolute bottom-20 md:bottom-10 left-8 md:left-16 right-10 md:right-16 z-30 flex items-end justify-between opacity-0"
//             >
//                 <h2 className={`${agency.className} text-[#0F3C78] text-xl md:text-4xl leading-snug max-w-sm`}>
//                     K.sons: Building Trust, Creating Tomorrow
//                 </h2>

//                 <button
//                     onClick={() => controlsRef.current.skip?.()}
//                     className={`${blauerNue.className} hidden md:flex items-center justify-center absolute top-0 right-4 z-50 px-4 py-2 text-sm bg-black/40 transition duration-300 hover:bg-black/60 text-white rounded-full`}
//                 >
//                     Skip <BsFillSkipForwardFill className="ml-2" />
//                 </button>
//             </div>

//             {/* 📱 Mobile Controls */}
//             <div className={`${agency.className} md:hidden absolute bottom-6 left-0 w-full flex justify-center gap-16 z-20`}>
//                 <button
//                     onClick={() => controlsRef.current.prev?.()}
//                     className="px-3 md:px-5 py-1 bg-black/40 text-white rounded-full transition-opacity duration-300 flex items-center justify-between font-extralight text-sm md:text-base"
//                     style={{ visibility: activeIndex > 0 ? "visible" : "hidden" }}
//                 >
//                     <MdNavigateNext className="rotate-180 text-lg" /> Previous
//                 </button>

//                 <button
//                     ref={nextBtnRef}
//                     onClick={() => controlsRef.current.next?.()}
//                     className="px-3 md:px-5 py-1 bg-black/40 text-white rounded-full transition-opacity duration-300 flex items-center justify-between font-extralight text-sm md:text-base"
//                     style={{
//                         opacity: activeIndex < totalVideos - 1 ? 1 : 0,
//                         pointerEvents: activeIndex < totalVideos - 1 ? "auto" : "none",
//                     }}
//                 >
//                     Next <MdNavigateNext className="text-lg" />
//                 </button>
//             </div>

//             <div className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-white z-50 pointer-events-none" />
//         </div>
//     );
// }