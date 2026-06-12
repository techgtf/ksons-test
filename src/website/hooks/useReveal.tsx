'use client'

import { useEffect, useLayoutEffect } from 'react'
import { gsap, registerGSAP } from "../utils/gsap"

type RevealDirection = 'top' | 'bottom' | 'left' | 'right'

interface UseRevealOptions {
    start?: string
    duration?: number
    ease?: string
    delay?: number
    once?: boolean
    direction?: RevealDirection
}

const clipMap: Record<RevealDirection, { from: string; to: string }> = {
    top: {
        from: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },
    bottom: {
        from: 'inset(100% 0% 0% 0%)',
        to: 'inset(0% 0% 0% 0%)',
    },
    left: {
        from: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },
    right: {
        from: 'polygon(81% 0, 100% 0, 100% 100%, 81% 100%)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },

}

export function useReveal<T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T | null>,
    {
        start = 'top 80%',
        duration = 1.6,
        ease = 'power3.out',
        delay = 0,
        once = false,
        direction = 'top',
    }: UseRevealOptions = {}
) {
    useLayoutEffect(() => {
        registerGSAP();
        if (!ref.current) return

        const el = ref.current
        const clip = clipMap[direction]

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { clipPath: clip.from },
                {
                    clipPath: clip.to,
                    duration,
                    ease,
                    delay,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: "play none none reverse",
                    },
                }
            )
        }, el)

        return () => ctx.revert()
    }, [ref, start, duration, ease, delay, once, direction])
}
