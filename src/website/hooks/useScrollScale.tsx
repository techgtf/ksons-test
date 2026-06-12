import { RefObject, useLayoutEffect } from "react";
import { gsap, registerGSAP } from "../utils/gsap";

interface UseScrollScaleOptions {
    trigger?: RefObject<HTMLElement | null>;
    fromScale?: number;
    toScale?: number;
    start?: string;
    end?: string;
    scrub?: number;
}

export function useScrollScale(
    target: RefObject<HTMLElement | null>,
    options: UseScrollScaleOptions = {}
) {
    const {
        trigger,
        fromScale = 0.85,
        toScale = 1,
        start = "top bottom",
        end = "top center",
        scrub = 1.5,
    } = options;

    useLayoutEffect(() => {
        registerGSAP();
        if (!target.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                target.current,
                { scale: fromScale },
                {
                    scale: toScale,
                    ease: "none",
                    scrollTrigger: {
                        trigger: trigger?.current || target.current,
                        start,
                        end,
                        scrub,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, target);

        return () => ctx.revert();
    }, []);
}
