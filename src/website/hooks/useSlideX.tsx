import { gsap, registerGSAP } from "../utils/gsap";
import { RefObject, useLayoutEffect } from "react";

type Direction = "left" | "right";

interface UseSlideXProps {
    target: RefObject<HTMLElement | null>;
    direction?: Direction;
    distance?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
}

export function useSlideX({
    target,
    direction = "left",
    distance = 80,
    duration = 0.9,
    stagger = 0.15,
    ease = "power3.out",
    start = "top 85%",
}: UseSlideXProps) {
    useLayoutEffect(() => {
        registerGSAP();

        const el = target.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const elements = el.children.length ? el.children : el;

            const xFrom = direction === "left" ? -distance : distance;

            gsap.fromTo(
                elements,
                {
                    x: xFrom,
                    opacity: 0,
                },
                {
                    x: 0,
                    opacity: 1,
                    duration,
                    stagger,
                    ease,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, el);

        return () => ctx.revert();
    }, [target, direction, distance, duration, stagger, ease, start]);
}