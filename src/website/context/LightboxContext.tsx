'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import { SlideImage, SlideVideo } from "yet-another-react-lightbox";
import AppLightbox from "../components/common/AppLightbox";

interface LightboxContextType {
    openLightbox: (slides: (SlideImage | SlideVideo)[], index?: number) => void;
    closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [slides, setSlides] = useState<(SlideImage | SlideVideo)[]>([]);
    const openLightbox = (newSlides: (SlideImage | SlideVideo)[], newIndex = 0) => {
        setSlides(newSlides);
        setIndex(newIndex);
        setOpen(true);
    };
    const closeLightbox = () => setOpen(false);

    return (
        <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
            {children}
            {open && (
                <AppLightbox
                    open={open}
                    onClose={closeLightbox}
                    slides={slides}
                    initialIndex={index}
                />
            )}
        </LightboxContext.Provider>
    );
}
export function useLightbox() {
    const context = useContext(LightboxContext);
    if (!context) {
        throw new Error("useLightbox must be used within LightboxProvider");
    }
    return context;
}