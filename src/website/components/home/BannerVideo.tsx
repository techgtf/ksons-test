"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../utils/gsap";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { BsFillSkipForwardFill } from "react-icons/bs";

export default function BannerVideo() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const video1Ref = useRef<HTMLVideoElement | null>(null);
    const video2Ref = useRef<HTMLVideoElement | null>(null);

    // 👉 NEW refs (animation only)
    const triangleRef = useRef<HTMLDivElement | null>(null);
    const maskTriangleRef = useRef<SVGGElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const leftLogoRef = useRef<HTMLDivElement | null>(null);
    const rightLogoRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);

    const totalVideos = 4;

    const reachedLastVideo = useRef<boolean>(false);
    const skipRef = useRef<() => void>(() => { });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const getVideoSrc = (index: number) => {
        return isMobile
            ? `/images/home/banner/mobile/${index}.mp4`
            : `/images/home/banner/${index}.mp4`;
    };

    useEffect(() => {
        // gsap.registerPlugin(ScrollTrigger);
        const smoother = (window as any).ScrollSmoother?.get?.();

        if (!video1Ref.current || !video2Ref.current) return;

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

        videoEls.forEach((video) => {
            video.muted = true;
            video.playsInline = true;
            video.setAttribute("playsinline", "true");
            video.setAttribute("webkit-playsinline", "true");

            video.playsInline = true;
            video.muted = true;
            video.defaultMuted = true;
        });

        let active = 0;
        let currentIndex = 0;
        let targetIndex = 0;
        let isPlaying = false;
        let isLocked = false;
        let isFinished = false;

        // =============================
        // 🎬 VIDEO PRELOAD
        // =============================
        for (let i = 1; i <= totalVideos; i++) {
            const v = document.createElement("video");
            v.src = getVideoSrc(i);
            v.preload = "auto";
            v.load();
        }

        let introStarted = false;

        const startIntro = () => {
            if (introStarted) return;
            introStarted = true;

            if (
                !triangleRef.current ||
                !maskTriangleRef.current ||
                !overlayRef.current ||
                !leftLogoRef.current ||
                !rightLogoRef.current ||
                !contentRef.current ||
                !ctaRef.current
            ) return;

            const rect = triangleRef.current.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            gsap.set(maskTriangleRef.current, {
                x: centerX - 50,
                y: centerY - 50,
                scale: 0.2,
                transformOrigin: "center center",
            });

            const tl = gsap.timeline();

            tl.to([triangleRef.current, maskTriangleRef.current], {
                scale: 180,
                duration: 3.5,
                ease: "expo.inOut",
            });

            tl.to(overlayRef.current, { opacity: 0, duration: 1.2 }, "-=0.8");
            tl.to(leftLogoRef.current, { x: -200, opacity: 0, duration: 1.5 }, "-=3");
            tl.to(rightLogoRef.current, { x: 200, opacity: 0, duration: 1.5 }, "-=3");
            tl.to(contentRef.current, { opacity: 0, duration: 1 }, "-=3");

            tl.to(
                ctaRef.current,
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                },
                "-=2.3"
            );
        };

        const firstVideo = videoEls[0];
        firstVideo.src = getVideoSrc(1);
        firstVideo.load();

        firstVideo.onloadeddata = () => {
            firstVideo.currentTime = 0;

            const tryPlay = () => {
                firstVideo.play().then(() => {
                    startIntro();
                }).catch(() => {
                    // wait for ANY interaction (touch is important)
                    const resume = () => {
                        firstVideo.play();
                        startIntro();
                        window.removeEventListener("touchstart", resume);
                        window.removeEventListener("click", resume);
                    };

                    window.addEventListener("touchstart", resume, { once: true });
                    window.addEventListener("click", resume, { once: true });
                });
            };

            tryPlay();
        };

        // =============================
        // 🎬 VIDEO SEQUENCE LOGIC
        // =============================

        let trigger: ScrollTrigger;

        const playNext = () => {
            if (isPlaying) return;

            isPlaying = true;
            isLocked = true;

            lockScroll();

            if (smoother) smoother.paused(true); // 🔥 HARD LOCK

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

                            nextVideo.onended = () => {
                                if (reachedLastVideo.current) return; // 🔥 ADD THIS

                                isPlaying = false;
                                isLocked = false;
                                unlockScroll();

                                if (smoother) smoother.paused(false);
                            };
                        },
                    });
                }).catch(() => {
                    isPlaying = false;
                    isLocked = false;
                    unlockScroll();
                    if (smoother) smoother.paused(false);
                });
            };
        };

        // =============================
        // 📜 SCROLLTRIGGER
        // =============================
        trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=1", // minimal, we don't rely on scroll anymore
            pin: true,
            pinSpacing: true,
            scrub: false,
        });

        ScrollTrigger.normalizeScroll(true);

        const preventScroll = (e: Event) => {
            if (!reachedLastVideo.current) {
                e.preventDefault();
            }
        };

        const handleScroll = (e: WheelEvent) => {
            if (reachedLastVideo.current) return;

            e.preventDefault(); // ALWAYS block native scroll

            if (isPlaying || isLocked) return;

            if (e.deltaY > 0) {
                if (currentIndex < totalVideos - 1) {
                    playNext();
                } else {
                    // ✅ FINAL RELEASE
                    reachedLastVideo.current = true;

                    const finalY = scrollY + window.innerHeight * 0.6;

                    trigger.kill();
                    unlockScroll();

                    requestAnimationFrame(() => {
                        window.scrollTo({
                            top: finalY,
                            behavior: "smooth",
                        });
                    });

                    if (smoother) {
                        smoother.scrollTo(finalY, true);
                        smoother.paused(false);
                    }

                    window.removeEventListener("wheel", handleScroll);
                }
            }
        };

        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (reachedLastVideo.current) return;

            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) < 10) return; // ignore small moves

            e.preventDefault();

            if (isPlaying || isLocked) return;

            if (deltaY > 0) {
                // swipe up → next video
                if (currentIndex < totalVideos - 1) {
                    playNext();
                } else {
                    reachedLastVideo.current = true;

                    const finalY = scrollY + window.innerHeight * 0.6;

                    trigger.kill();
                    unlockScroll();

                    requestAnimationFrame(() => {
                        window.scrollTo({
                            top: finalY,
                            behavior: "smooth",
                        });
                    });

                    if (smoother) {
                        smoother.scrollTo(finalY, true);
                        smoother.paused(false);
                    }

                    window.removeEventListener("touchmove", handleTouchMove);
                }
            }
        };

        const skipAll = () => {
            if (reachedLastVideo.current) return;

            reachedLastVideo.current = true;

            // 🔥 STOP ALL VIDEOS + REMOVE EVENTS
            videoEls.forEach((video) => {
                video.pause();
                video.onended = null;
                video.onloadeddata = null;
            });

            const finalY = window.scrollY + window.innerHeight * 0.6;

            trigger.kill();
            unlockScroll();

            requestAnimationFrame(() => {
                window.scrollTo({
                    top: finalY,
                    behavior: "smooth",
                });
            });

            if (smoother) {
                smoother.scrollTo(finalY, true);
                smoother.paused(false);
            }

            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };

        skipRef.current = skipAll;

        window.addEventListener("wheel", handleScroll, { passive: false });

        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

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

        ScrollTrigger.config({
            ignoreMobileResize: true,
        });

        // =============================
        // 🧹 CLEANUP
        // =============================
        return () => {
            trigger.kill();

            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("keydown", handleKeyDown);

            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-screen overflow-hidden will-change-transform bg-white flex items-center justify-center"
        >
            {[video1Ref, video2Ref].map((ref, i) => (
                <video
                    key={i}
                    ref={ref}
                    muted
                    playsInline
                    autoPlay
                    loop={false}
                    preload="auto"
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    webkit-playsinline="true"
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

            <svg className="absolute inset-0 z-20 w-full h-full pointer-events-none">
                <defs>
                    <mask id="triangle-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <g ref={maskTriangleRef}>
                            <polygon points="50,0 0,100 100,100" fill="black" />
                        </g>
                    </mask>
                </defs>

                <rect width="100%" height="100%" fill="white" mask="url(#triangle-mask)" />
            </svg>

            <div ref={contentRef} className="flex flex-col items-start z-20">
                <div className="flex items-end">
                    <div ref={leftLogoRef}>
                        <Image src="/images/home/logo-initial.svg" alt="left" width={50} height={50} className="mr-2.5" />
                    </div>

                    <div
                        ref={triangleRef}
                        className="mr-2.5 relative z-30"
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
                                background:
                                    "linear-gradient(180deg, #2FD2ED 0%, #1C71E8 100%)",
                                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                            }}
                        />
                    </div>

                    <div ref={rightLogoRef}>
                        <Image src="/images/home/logo-last.svg" alt="right" width={150} height={30} />
                    </div>
                </div>

                <p className={`${blauerNue.className} uppercase mt-3 flex items-center gap-2 w-full justify-between font-light tracking-[3.4px] text-sm`}>
                    <span className="w-14 h-[0.6px] bg-black"></span>
                    Creating Value
                </p>
            </div>

            <div
                ref={ctaRef}
                className="absolute bottom-10 left-10 md:left-16 right-16 z-30 flex items-end justify-between opacity-0 translate-y-20"
            >
                <h2 className={`${agency.className} text-[#0F3C78] text-3xl md:text-4xl leading-snug max-w-sm`}>
                    K.sons: Building Trust, Creating Tomorrow
                </h2>

                <button
                    className={`${blauerNue.className} px-6 py-3 text-white text-sm font-medium rounded-[100px] shadow-md transition hover:opacity-90 tracking-[1.2px] flex items-center`}
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(47, 210, 237, 0.80) 0%, rgba(28, 113, 232, 0.80) 100%)",
                        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    Explore
                </button>

                <button
                    onClick={() => skipRef.current()}
                    className={`${blauerNue.className} flex items-center justify-center absolute top-0 right-4 z-50 px-4 py-2 text-sm bg-black/40 transition duration-300 hover:bg-black/60 text-white rounded-full`}
                >
                    Skip <BsFillSkipForwardFill className="ml-2" />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white z-50 pointer-events-none" />
        </div>
    );
}