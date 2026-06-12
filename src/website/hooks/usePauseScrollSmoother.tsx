'use client'

import { useEffect, useRef } from 'react'
import { lenisInstance } from '../components/SmoothScroller'

export function usePauseScrollSmoother({
    enabled,
    lockBodyScroll = true,
}: {
    enabled: boolean
    lockBodyScroll?: boolean
}) {
    const scrollY = useRef(0);

    useEffect(() => {
        if (!lenisInstance) return;

        const html = document.documentElement;
        const body = document.body;

        if (enabled) {
            // ✅ Save current scroll position
            scrollY.current = window.scrollY;

            // ✅ Stop Lenis
            lenisInstance.stop();

            if (lockBodyScroll) {
                // ✅ Lock without jump
                body.style.position = 'fixed';
                body.style.top = `-${scrollY.current}px`;
                body.style.left = '0';
                body.style.right = '0';
                body.style.width = '100%';
            }

        } else {
            // ✅ Resume Lenis
            lenisInstance.start();

            if (lockBodyScroll) {
                // ✅ Restore scroll position
                body.style.position = '';
                body.style.top = '';
                body.style.left = '';
                body.style.right = '';
                body.style.width = '';

                window.scrollTo(0, scrollY.current);
            }
        }

        return () => {
            lenisInstance?.start();

            if (lockBodyScroll) {
                body.style.position = '';
                body.style.top = '';
                body.style.left = '';
                body.style.right = '';
                body.style.width = '';
            }
        };

    }, [enabled, lockBodyScroll]);
}