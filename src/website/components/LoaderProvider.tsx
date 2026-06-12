"use client";
import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import AnimatedLoader, { AnimatedLoaderHandle } from "./common/AnimatedLoader";


export default function LoaderProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const loaderRef = useRef<AnimatedLoaderHandle | null>(null);
    const pathname = usePathname();
    const isFirst = useRef(true);

    useEffect(() => {
        // Skip initial mount — already plays via useEffect inside AnimatedLoader
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        // Play on every subsequent route change
        loaderRef.current?.show();
    }, [pathname]);

    return (
        <>
            {/* Always mounted — never unmounts, never gets killed by Next.js */}
            <AnimatedLoader ref={loaderRef} />
            {children}
        </>
    );
}