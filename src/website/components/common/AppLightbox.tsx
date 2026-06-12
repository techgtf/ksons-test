"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

import type { SlideImage, SlideVideo } from "yet-another-react-lightbox";

interface AppLightboxProps {
    open: boolean;
    onClose: () => void;
    slides: (SlideImage | SlideVideo)[];
    initialIndex?: number;
}

export default function AppLightbox({
    open,
    onClose,
    slides,
    initialIndex = 0,
}: AppLightboxProps) {
    const isSingle = slides.length === 1

    return (
        <Lightbox
            open={open}
            close={onClose}
            slides={slides}
            index={initialIndex}
            plugins={
                isSingle
                    ? [Thumbnails, Zoom, Video, Fullscreen] // ✅ added Thumbnails
                    : [Thumbnails, Zoom, Video, Fullscreen, Counter]
            }
            carousel={{
                finite: true, // ✅ no looping
            }}
            render={{
                buttonPrev: isSingle ? () => null : undefined,
                buttonNext: isSingle ? () => null : undefined,
            }}
            thumbnails={{
                position: "bottom",
                width: 120,
                height: 80,
                gap: 16,
            }}
            counter={isSingle ? undefined : {}}
            styles={{
                root: { "--yarl__color_backdrop": "rgba(0,0,0,0.85)" },
            }}
        />
    )
}