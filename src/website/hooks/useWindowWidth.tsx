"use client";

import { useEffect, useState } from "react";


export function useWindowWidth() {
    const [width, setWidth] = useState<number>(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const updateWidth = () => {
            setWidth(window.innerWidth);
        };

        updateWidth();
        setMounted(true);

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    return {
        width,
        mounted,
        isMobile: mounted && width < 768,
        isTablet: mounted && width >= 768 && width < 1024,
        isDesktop: mounted && width >= 768,
    };
}