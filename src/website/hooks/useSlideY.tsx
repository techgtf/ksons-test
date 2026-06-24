import { gsap, registerGSAP } from "../utils/gsap"
import { RefObject, useLayoutEffect } from "react"


type Direction = "up" | "down"

interface UseSlideYProps {
    target: RefObject<HTMLElement | null>
    direction?: Direction
    distance?: number
    duration?: number
    stagger?: number
    ease?: string
    start?: string
    animateOnMount?: boolean
}

export function useSlideY({
    target,
    direction = "up",
    distance = 50,
    duration = 0.9,
    stagger = 0.15,
    ease = "power3.out",
    start = "top 85%",
    animateOnMount = false,
}: UseSlideYProps) {
    useLayoutEffect(() => {
        registerGSAP();
        const el = target.current
        if (!el) return

        const ctx = gsap.context(() => {
            const elements = el.children.length ? el.children : el

            const yFrom = direction === "up" ? distance : -distance

            gsap.fromTo(
                elements,
                { y: yFrom, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration,
                    ease,
                    stagger,
                    scrollTrigger: animateOnMount ? undefined : {
                        trigger: el,
                        start,
                        toggleActions: "play none none reverse"
                    },
                }
            )
        }, el)

        return () => ctx.revert()
    }, [target, direction, distance, duration, ease, stagger, start, animateOnMount])
}

