"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGSAP } from "../../utils/gsap";

type AnimatedTriangleProps = {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;

    // optional control (so it stays reusable)
    delay?: number;
};

export default function AnimatedTriangle({
    src,
    alt = "triangle",
    width = 290,
    height = 290,
    className = "",
    delay = 1.6,
}: AnimatedTriangleProps) {
    registerGSAP();

    const triangleRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!triangleRef.current) return;

        gsap.fromTo(
            triangleRef.current,
            { x: 550, y: -550, rotation: 90, opacity: 0, filter: "blur(20px)" },
            {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 2.8,
                delay,
                ease: "power3.out",
                motionPath: {
                    path: [
                        { x: 550, y: -550 },
                        { x: 200, y: -500 },
                        { x: 0, y: 0 },
                    ],
                    curviness: 1.8,
                },
            }
        );
    }, [delay]);

    return (
        <div ref={triangleRef} className={className}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-[120px] lg:w-[290px] h-auto"
            />
        </div>
    );
}