"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import { registerGSAP, gsap } from "@/src/website/utils/gsap";
import Image from "next/image";
import Link from "next/link";
import React, {
    useLayoutEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import { locationProjectsData } from "./locationData";
import { LocationData, ModalHandle } from "./LocationContainers";



interface Props {
    /** Called after the close animation fully completes */
    onClosed?: () => void;
    /**
     * Ref owned by the parent — modal sets it true while pointer is inside
     * the panel so the scroll-driven logic doesn't fire during panel scrolling.
     */
    panelHoveredRef?: React.RefObject<boolean>;
}

export const LocationWiseProjectModal = forwardRef<ModalHandle, Props>(
    ({ onClosed, panelHoveredRef }, ref) => {
        const panelRef = useRef<HTMLDivElement>(null);
        const cardImgRef = useRef<HTMLDivElement>(null);
        const viewportRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        const [data, setData] = useState<LocationData | null>(null);
        const isOpenRef = useRef(false);
        const activeTl = useRef<gsap.core.Timeline | null>(null);

        // ── Imperative API ────────────────────────────────────────────────────
        useImperativeHandle(ref, () => ({

            open(newData) {
                if (isOpenRef.current) return; // already open — caller should use swap()
                isOpenRef.current = true;
                setData(newData);

                requestAnimationFrame(() => {
                    if (!panelRef.current) return;
                    activeTl.current?.kill();

                    gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });


                    activeTl.current = gsap.timeline()
                        .to(panelRef.current, {
                            xPercent: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            ease: "power3.out",
                        }, "-=0.1");
                });
            },

            swap(newData) {
                // Panel stays open, only content fades
                setData(newData);
                requestAnimationFrame(() => {
                    if (!contentRef.current) return;
                    gsap.set(contentRef.current, { y: 0 }); // reset internal scroll
                    gsap.fromTo(
                        contentRef.current,
                        { autoAlpha: 0, y: 10 },
                        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }
                    );
                });
            },

            close() {
                if (!isOpenRef.current) return; // already closed
                isOpenRef.current = false;
                activeTl.current?.kill();

                if (!panelRef.current) return;

                activeTl.current = gsap.timeline({
                    onComplete: () => {
                        setData(null);
                        onClosed?.();
                    },
                })
                    .to(panelRef.current, {
                        xPercent: 100,
                        autoAlpha: 0,
                        duration: 0.4,
                        ease: "power3.in",
                    })

            },
        }));

        // ── Hide on mount (GSAP controls visibility from here on) ────────────
        useLayoutEffect(() => {
            registerGSAP();
            if (!panelRef.current) return;
            gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
        }, []);

        // ── Custom smooth scroll inside the panel ─────────────────────────────
        useLayoutEffect(() => {
            const viewport = viewportRef.current;
            const content = contentRef.current;
            if (!viewport || !content) return;

            let y = 0, startY = 0;

            const maxScroll = () => Math.max(0, content.scrollHeight - viewport.clientHeight);
            const clamp = (v: number) => gsap.utils.clamp(-maxScroll(), 0, v);
            const animateTo = (v: number) => {
                y = clamp(v);
                gsap.to(content, { y, duration: 0.45, ease: "power3.out" });
            };

            const onWheel = (e: WheelEvent) => {
                e.preventDefault();
                e.stopPropagation(); // keep ScrollTrigger on window from seeing this
                animateTo(y - e.deltaY);
            };
            const onTouchStart = (e: TouchEvent) => {
                e.stopPropagation();
                startY = e.touches[0].clientY;
            };
            const onTouchMove = (e: TouchEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = startY - e.touches[0].clientY;
                startY = e.touches[0].clientY;
                animateTo(y - delta);
            };

            // Also block wheel on the whole panel element (covers header, close btn area etc.)
            const panel = panelRef.current;
            const blockWheel = (e: WheelEvent) => {
                e.preventDefault();
                e.stopPropagation();
            };
            panel?.addEventListener("wheel", blockWheel, { passive: false });

            // Toggle the parent's hover flag so scroll-driven logic is suppressed
            const onPanelEnter = () => { if (panelHoveredRef) (panelHoveredRef as React.MutableRefObject<boolean>).current = true; };
            const onPanelLeave = () => { if (panelHoveredRef) (panelHoveredRef as React.MutableRefObject<boolean>).current = false; };
            panel?.addEventListener("pointerenter", onPanelEnter);
            panel?.addEventListener("pointerleave", onPanelLeave);

            viewport.addEventListener("wheel", onWheel, { passive: false });
            viewport.addEventListener("touchstart", onTouchStart, { passive: true });
            viewport.addEventListener("touchmove", onTouchMove, { passive: false });

            return () => {
                panel?.removeEventListener("wheel", blockWheel);
                panel?.removeEventListener("pointerenter", onPanelEnter);
                panel?.removeEventListener("pointerleave", onPanelLeave);
                viewport.removeEventListener("wheel", onWheel);
                viewport.removeEventListener("touchstart", onTouchStart);
                viewport.removeEventListener("touchmove", onTouchMove);
            };
        }, []);

        // ── User clicks X or the overlay ─────────────────────────────────────
        const handleClose = () => {
            if (!isOpenRef.current) return;
            isOpenRef.current = false;
            activeTl.current?.kill();

            if (!panelRef.current) return;

            activeTl.current = gsap.timeline({
                onComplete: () => { setData(null); onClosed?.(); },
            })
                .to(panelRef.current, {
                    xPercent: 100,
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "power3.in",
                })
        };

        // Always in the DOM — GSAP controls visibility via autoAlpha
        return (
            <div className="absolute inset-0 z-[999] pointer-events-none">

                <div
                    ref={panelRef}
                    className="relative ml-auto h-full w-full lg:w-[400px] bg-white py-10 px-6 z-10 flex flex-col pointer-events-auto"
                    style={{ visibility: "hidden" }}
                >
                    <button
                        className={`pb-3 ${blauerNue.className} text-sm font-medium flex items-center justify-end ml-auto mr-0 gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition shrink-0`}
                        onClick={handleClose}
                    >
                        CLOSE
                        <span>
                            <Image
                                src="/images/home/testimonial-arrow.png"
                                alt="Close"
                                width={15}
                                height={15}
                            />
                        </span>
                    </button>

                    <div ref={viewportRef} className="flex-1 overflow-hidden relative">
                        <div ref={contentRef}>
                            {data && (
                                <>
                                    <div className="modal-hero-section">
                                        <div
                                            ref={cardImgRef}
                                            className="overflow-hidden">
                                            <Image
                                                src={data.hero.img}
                                                alt={data.hero.title}
                                                height={300}
                                                width={400}
                                                className="h-[300px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                                            />
                                        </div>
                                        <h5 className={`${agency.className} text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}>
                                            {data.hero.title}
                                        </h5>
                                        <p className={`${blauerNue.className} font-extralight tracking-[0.5px] pt-2`}>
                                            {data.hero.desc}
                                        </p>
                                    </div>

                                    <div className="flex flex-col space-y-5 pt-8">
                                        {data.properties.map((item, i) => (
                                            <ProjectCard key={i} item={item} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

LocationWiseProjectModal.displayName = "LocationWiseProjectModal";

// ─────────────────────────────────────────────────────────────────────────────

const ProjectCard = ({ item }: { item: (typeof locationProjectsData)[0]["properties"][0] }) => (
    <Link
        href={item.slug ?? "#"}
        className="flex gap-6 items-center group border-b border-(--blue)/20 pb-5"
    >
        <div className="overflow-hidden shrink-0">
            <Image
                src={item.img}
                height={120}
                width={150}
                alt={item.title}
                className="transition-transform duration-700 ease-out group-hover:scale-110"
            />
        </div>
        <div>
            <p className={`${agency.className} text-base tracking-[1px] opacity-[0.9] uppercase`}>
                {item.title}
            </p>
            <span className="text-(--blue) opacity-[0.9] font-semibold flex items-center gap-2 capitalize pt-1">
                view more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path d="M1 13L13 1M13 1H4M13 1V10" stroke="#0F3C78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </div>
    </Link>
);

// import { agency, blauerNue } from "@/src/app/fonts";
// import { registerGSAP, gsap } from "@/src/website/utils/gsap";
// import Image from "next/image";
// import Link from "next/link";
// import { useLayoutEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { scrollLock } from "../../SmoothScroller";

// const propertiesList = [
//     {
//         img: '/images/home/location-wise-pro/project.avif',
//         title: 'Vrindavan',
//         slug: '#'
//     },
//     {
//         img: '/images/home/location-wise-pro/project.avif',
//         title: 'Vrindavan',
//         slug: '#'
//     },
//     {
//         img: '/images/home/location-wise-pro/project.avif',
//         title: 'Vrindavan',
//         slug: '#'
//     },
// ]

// export const LocationWiseProjectModal = ({ closeModal }: any) => {
//     const panelRef = useRef<HTMLDivElement>(null);
//     const overlayRef = useRef<HTMLDivElement>(null);

//     const viewportRef = useRef<HTMLDivElement>(null);
//     const contentRef = useRef<HTMLDivElement>(null);

//     const lockScroll = () => scrollLock.lock();
//     const unlockScroll = () => scrollLock.unlock();


//     useLayoutEffect(() => {
//         registerGSAP();

//         if (!viewportRef.current || !contentRef.current) return;

//         const viewport = viewportRef.current;
//         const content = contentRef.current;

//         let y = 0;
//         let startY = 0;

//         const maxScroll = () =>
//             Math.max(0, content.scrollHeight - viewport.clientHeight);

//         const clamp = (value: number) =>
//             gsap.utils.clamp(-maxScroll(), 0, value);

//         const animateTo = (value: number) => {
//             y = clamp(value);

//             gsap.to(content, {
//                 y,
//                 duration: 0.45,
//                 ease: "power3.out",
//             });
//         };

//         const onWheel = (e: WheelEvent) => {
//             e.preventDefault();
//             animateTo(y - e.deltaY);
//         };

//         const onTouchStart = (e: TouchEvent) => {
//             startY = e.touches[0].clientY;
//         };

//         const onTouchMove = (e: TouchEvent) => {
//             e.preventDefault();

//             const currentY = e.touches[0].clientY;
//             const delta = startY - currentY;

//             startY = currentY;

//             animateTo(y - delta);
//         };

//         viewport.addEventListener("wheel", onWheel, { passive: false });
//         viewport.addEventListener("touchstart", onTouchStart, { passive: true });
//         viewport.addEventListener("touchmove", onTouchMove, { passive: false });

//         return () => {
//             viewport.removeEventListener("wheel", onWheel);
//             viewport.removeEventListener("touchstart", onTouchStart);
//             viewport.removeEventListener("touchmove", onTouchMove);
//         };
//     }, []);


//     useLayoutEffect(() => {
//         registerGSAP()
//         if (!panelRef.current || !overlayRef.current) return;
//         lockScroll()

//         const tl = gsap.timeline();

//         gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
//         gsap.set(overlayRef.current, { autoAlpha: 0 });

//         tl.to(overlayRef.current, {
//             autoAlpha: 1,
//             duration: 0.3,
//             ease: "power2.out",
//         }).to(
//             panelRef.current,
//             {
//                 xPercent: 0,
//                 autoAlpha: 1,
//                 duration: 0.5,
//                 ease: "power3.out",
//             },
//             "-=0.1"
//         );
//     }, []);

//     const handleClose = () => {
//         if (!panelRef.current || !overlayRef.current) return;
//         unlockScroll();

//         const tl = gsap.timeline({
//             onComplete: closeModal, // unmount AFTER animation
//         });

//         tl.to(panelRef.current, {
//             xPercent: 100,
//             autoAlpha: 0,
//             duration: 0.4,
//             ease: "power3.in",
//         }).to(
//             overlayRef.current,
//             {
//                 autoAlpha: 0,
//                 duration: 0.3,
//                 ease: "power2.in",
//             },
//             "-=0.2"
//         );
//     };

//     return createPortal(
//         <div className="fixed inset-0 z-[999999]">
//             <div
//                 ref={overlayRef}
//                 onClick={handleClose}
//                 className="absolute inset-0 bg-black/30"
//             />

//             <div
//                 ref={panelRef}
//                 className="relative ml-auto h-full w-full lg:w-[400px] bg-white py-10 px-6 z-10">

//                 <button
//                     className={`pb-3 ${blauerNue.className} text-sm font-medium flex items-center justify-end ml-auto mr-0 gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition`}
//                     onClick={handleClose}
//                 >
//                     CLOSE
//                     <span>
//                         <Image
//                             src="/images/home/testimonial-arrow.png"
//                             alt="Close"
//                             width={15}
//                             height={15}
//                         />
//                     </span>
//                 </button>
//                 <div ref={viewportRef} className="panel-content h-full overflow-hidden relative">
//                     <div ref={contentRef}>
//                         <div className="modal-hero-section">
//                             <div className="img-div overflow-hidden">
//                                 <Image
//                                     src="/images/home/location-wise-pro/project.avif"
//                                     alt=""
//                                     height={300}
//                                     width={400}
//                                     className="h-[300px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
//                                 />
//                             </div>
//                             <h5 className={`${agency.className} text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}>Vrindavan</h5>
//                             <p className={`pera ${blauerNue} font-extralight tracking-[0.5px] pt-2`}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi dolorum officia suscipit. Expedita eaque totam dolorem velit laborum quo asperiores, magnam consequuntur aspernatur neque magni, voluptatem nemo aliquid voluptates voluptatum!</p>
//                         </div>
//                         <div
//                             className="flex flex-col space-y-5 pt-8">
//                             {propertiesList.map((item, i) => {
//                                 return <ProjectCards key={i} item={item} />
//                             })}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>,
//         document.body
//     );
// };

// const ProjectCards = ({ item }: any) => {
//     return (
//         <Link
//             className="flex gap-6 items-center group border-b border-(--blue)/20 pb-5"
//             // key={i}
//             href={item.title ?? '#'}>
//             <div className="overflow-hidden">
//                 <Image
//                     src={item.img}
//                     height={120}
//                     width={150}
//                     alt=""
//                     className="transition-transform duration-700 ease-out group-hover:scale-110"
//                 />
//             </div>
//             <div className="">
//                 <p className={`${agency.className} text-base tracking-[1px]  opacity-[0.9] uppercase`}>{item.title}</p>
//                 <span className="text-(--blue) opacity-[0.9] font-semibold flex items-center gap-2 capitalize pt-1">view more  <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 14 14"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                 >
//                     <path
//                         d="M1 13L13 1M13 1H4M13 1V10"
//                         stroke="#0F3C78"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     />
//                 </svg> </span>
//             </div>
//         </Link>
//     )
// }