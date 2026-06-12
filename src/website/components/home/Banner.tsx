"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type BannerProps = {
    backgroundImage: string;
    leftLogo: string;
    rightLogo: string;
    tagline: string;
    heading: string;
    buttonText: string;
    buttonLink?: string;
    isExternal?: boolean;
};

export default function Banner({
    backgroundImage,
    leftLogo,
    rightLogo,
    tagline,
    heading,
    buttonText,
}: BannerProps) {
    const triangleRef = useRef<HTMLDivElement | null>(null);
    const maskTriangleRef = useRef<SVGGElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const leftLogoRef = useRef<HTMLDivElement | null>(null);
    const rightLogoRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const layer2Ref = useRef<HTMLDivElement | null>(null);
    const scrollTriangleRef = useRef<HTMLDivElement | null>(null);

    const nextBannerRef = useRef<HTMLDivElement | null>(null);
    const transitionOverlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const triangleEl = triangleRef.current;
        const maskEl = maskTriangleRef.current;

        if (
            !triangleEl ||
            !maskEl ||
            !overlayRef.current ||
            !leftLogoRef.current ||
            !rightLogoRef.current ||
            !contentRef.current ||
            !ctaRef.current
        )
            return;

        const rect = triangleEl.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        gsap.set(maskEl, {
            x: centerX - 50,
            y: centerY - 50,
            scale: 0.2,
            transformOrigin: "center center",
        });

        gsap.set(ctaRef.current, {
            y: 80,
            opacity: 0,
        });

        const tl = gsap.timeline();

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                scrub: true,
            },
        });

        scrollTl.to(layer2Ref.current, {
            scale: 0.82,
            duration: 1,
            ease: "power2.out",
        }, 0);

        scrollTl.to(scrollTriangleRef.current, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
        }, 0.2);

        scrollTl.to(scrollTriangleRef.current, {
            x: 400,
            y: -120,
            rotation: 12,
            scale: 0.5,
            duration: 1.2,
            ease: "power1.inOut",
        }, 0.6);

        // scrollTl.to(scrollTriangleRef.current, {
        //     filter: "blur(2px)",
        //     duration: 0.4,
        // }, 0.6);

        scrollTl.fromTo(
            nextBannerRef.current,
            { x: "100%", scale: 1.05 },
            {
                x: "0%",
                scale: 1,
                duration: 1.2,
                ease: "power3.inOut",
            },
            0.6
        );

        scrollTl.to([layer2Ref.current], {
            x: "-15%",
            duration: 1.2,
            ease: "power3.inOut",
        }, 0.6);

        scrollTl.to(transitionOverlayRef.current, {
            opacity: 0.5,
            duration: 0.5,
            ease: "power1.out",
        }, 0.55);

        scrollTl.to(transitionOverlayRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
        }, 1.1);

        scrollTl.to(layer2Ref.current, {
            opacity: 0,
            duration: 0.6,
        }, 0.7);

        scrollTl.to(scrollTriangleRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1.5,
            duration: 0.8,
            ease: "power3.out",
        }, 1.2);

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=200%",
            pin: true,
            pinSpacing: true,
        });

        tl.to([triangleEl, maskEl], {
            scale: 180,
            duration: 3.5,
            ease: "expo.inOut",
        });

        tl.to(
            overlayRef.current,
            {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
            },
            "-=0.8"
        );

        tl.to(
            leftLogoRef.current,
            {
                x: -200,
                opacity: 0,
                duration: 1.5,
            },
            "-=3"
        );

        tl.to(
            rightLogoRef.current,
            {
                x: 200,
                opacity: 0,
                duration: 1.5,
            },
            "-=3"
        );

        tl.to(
            contentRef.current,
            {
                opacity: 0,
                duration: 1,
            },
            "-=3"
        );

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
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-white flex items-center justify-center">
            {/* IMAGE */}
            <div className="absolute inset-0 z-0">

                {/* 🔵 Layer 1 (back) */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/home/banner/1.1.png"
                        alt="layer-1"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* 🟣 Layer 2 (middle - WILL ANIMATE LATER) */}
                <div
                    ref={layer2Ref}
                    className="absolute inset-0 z-10 will-change-transform"
                    id="layer-2"
                >
                    <Image
                        src="/images/home/banner/1.2.png"
                        alt="layer-2"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* 🔶 Layer 3 (top details) */}
                <div className="absolute inset-0 z-20">
                    <Image
                        src="/images/home/banner/1.3.png"
                        alt="layer-3"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

            </div>

            {/* MASK */}
            <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                <defs>
                    <mask id="triangle-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <g ref={maskTriangleRef}>
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

            {/* CONTENT */}
            <div ref={contentRef} className="flex flex-col items-start z-20">
                <div className="flex items-end">
                    {/* LEFT LOGO */}
                    <div ref={leftLogoRef}>
                        <Image
                            src={leftLogo}
                            alt="Logo Initial"
                            className="mr-2.5"
                            width={50}
                            height={50}
                        />
                    </div>

                    {/* TRIANGLE */}
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
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, #2FD2ED 0%, #1C71E8 100%)",
                                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                            }}
                        />
                    </div>

                    {/* RIGHT LOGO */}
                    <div ref={rightLogoRef}>
                        <Image
                            src={rightLogo}
                            alt="Logo Last"
                            width={150}
                            height={30}
                        />
                    </div>
                </div>

                {/* TAGLINE */}
                <p
                    className={`${blauerNue.className} uppercase mt-3 flex items-center gap-2 w-full justify-between font-light tracking-[3.4px] text-sm`}
                >
                    <span className="w-14 h-[0.6px] bg-black"></span>
                    {tagline}
                </p>
            </div>

            {/* CTA */}
            <div
                ref={ctaRef}
                className="absolute bottom-10 left-16 right-16 z-30 flex items-end justify-between"
            >
                <h2
                    className={`${agency.className} text-[#0F3C78] text-4xl leading-snug max-w-sm`}
                >
                    {heading}
                </h2>

                <button
                    className={`${blauerNue.className} px-6 py-3 text-white text-sm font-medium rounded-[100px] shadow-md transition hover:opacity-90 tracking-[1.2px] flex items-center cursor-pointer`}
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(47, 210, 237, 0.80) 0%, rgba(28, 113, 232, 0.80) 100%)",
                        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {buttonText}
                    <span className="inline-block ml-2">
                        <Image
                            src="/images/home/arrow.svg"
                            alt="arrow"
                            width={11}
                            height={11}
                        />
                    </span>
                </button>
            </div>

            <div
                ref={transitionOverlayRef}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                    background: "#ffffff",
                    opacity: 0,
                }}
            />
            <div
                ref={scrollTriangleRef}
                className="absolute z-30 pointer-events-none"
                style={{
                    width: "100px",
                    height: "90px",
                    left: "55%",
                    top: "27%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0,
                }}
            >
                <svg viewBox="0 0 100 90" width="100%" height="100%">
                    <path
                        d="
        M50 6
        Q50 -2 38 10
        L2 80
        Q-2 92 20 92
        L80 92
        Q102 92 98 80
        L62 10
        Q50 -2 50 6
        Z
    "
                        fill="#4cc2e1"
                    />
                </svg>
            </div>

            <div
                ref={nextBannerRef}
                className="absolute inset-0 z-0 will-change-transform"
                style={{
                    transform: "translateX(100%)",
                }}
            >
                <Image
                    src="/images/home/banner/banner2.png"
                    alt="banner-2"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}