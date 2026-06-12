import { agency, blauerNue } from "@/src/app/fonts";
import { registerGSAP, gsap } from "@/src/website/utils/gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { scrollLock } from "../../SmoothScroller";
export interface ProjectProperty {
  img: string;
  title: string;
  slug: string;
}

export interface LocationData {
  id: number;
  name: string;
  hero: {
    img: string;
    title: string;
    desc: string;
  };
  properties: ProjectProperty[];
}

export const LocationWiseProjectModalMob = ({
  data,
  closeModal,
}: {
  data: LocationData;
  closeModal: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const lockScroll = () => scrollLock.lock();
  const unlockScroll = () => scrollLock.unlock();

  const scrollYRef = useRef(0);

  useLayoutEffect(() => {
    registerGSAP();

    if (!viewportRef.current || !contentRef.current) return;

    const viewport = viewportRef.current;
    const content = contentRef.current;

    let startY = 0;

    const maxScroll = () =>
      Math.max(0, content.scrollHeight - viewport.clientHeight);

    const clamp = (value: number) => gsap.utils.clamp(-maxScroll(), 0, value);

    const animateTo = (value: number) => {
      scrollYRef.current = clamp(value);

      gsap.to(content, {
        y: scrollYRef.current,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      animateTo(scrollYRef.current - e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      const delta = startY - currentY;

      startY = currentY;

      animateTo(scrollYRef.current - delta);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useLayoutEffect(() => {
    registerGSAP();
    if (!panelRef.current || !overlayRef.current) return;
    lockScroll();

    const tl = gsap.timeline();

    gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    tl.to(overlayRef.current, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    }).to(
      panelRef.current,
      {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.1",
    );

    return () => {
      unlockScroll();
    };
  }, []);

  // Smoothly animate content swap when data changes
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    
    // Skip the very first mount animation for the content itself 
    // because the main entrance animation handles it.
    const isFirstMount = !panelRef.current?.style.visibility || panelRef.current?.style.visibility === "hidden";
    if (isFirstMount) return;

    const tl = gsap.timeline();
    tl.to(contentRef.current, {
      autoAlpha: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        // Reset scroll position when content is hidden
        scrollYRef.current = 0;
        gsap.set(contentRef.current, { y: 0 });
      },
    }).to(contentRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [data.id]);

  const handleClose = () => {
    if (!panelRef.current || !overlayRef.current) return;
    unlockScroll();

    const tl = gsap.timeline({
      onComplete: closeModal, // unmount AFTER animation
    });

    tl.to(panelRef.current, {
      xPercent: 100,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power3.in",
    }).to(
      overlayRef.current,
      {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2",
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999]">
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/30"
      />

      <div
        ref={panelRef}
        className="relative ml-auto h-fit w-[300px] lg:w-[400px] bg-white py-5 px-6 z-10"
      >
        <div
          ref={viewportRef}
          className="panel-content h-full overflow-hidden relative"
        >
          <div ref={contentRef}>
            <div className="modal-hero-section">
              <div className="img-div overflow-hidden">
                <Image
                  src={data.hero.img}
                  alt={data.hero.title}
                  height={120}
                  width={200}
                  className="h-[120px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                />
              </div>
              <h5
                className={`${agency.className} text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}
              >
                {data.hero.title}
              </h5>
              <p
                className={`${blauerNue.className} font-extralight tracking-[0.5px] pt-2`}
              >
                {data.hero.desc.length > 90
                  ? data.hero.desc.slice(0, 90) + "..."
                  : data.hero.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// import { agency, blauerNue } from "@/src/app/fonts";
// import { registerGSAP, gsap } from "@/src/website/utils/gsap";
// import Image from "next/image";
// import Link from "next/link";
// import { useLayoutEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { scrollLock } from "../../SmoothScroller";
// export interface ProjectProperty {
//   img: string;
//   title: string;
//   slug: string;
// }

// export interface LocationData {
//   id: number;
//   name: string;
//   hero: {
//     img: string;
//     title: string;
//     desc: string;
//   };
//   properties: ProjectProperty[];
// }

// export const LocationWiseProjectModalMob = ({
//   data,
//   closeModal,
// }: {
//   data: LocationData;
//   closeModal: () => void;
// }) => {
//   const panelRef = useRef<HTMLDivElement>(null);
//   const overlayRef = useRef<HTMLDivElement>(null);

//   const viewportRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   const lockScroll = () => scrollLock.lock();
//   const unlockScroll = () => scrollLock.unlock();

//   useLayoutEffect(() => {
//     registerGSAP();

//     if (!viewportRef.current || !contentRef.current) return;

//     const viewport = viewportRef.current;
//     const content = contentRef.current;

//     let y = 0;
//     let startY = 0;

//     const maxScroll = () =>
//       Math.max(0, content.scrollHeight - viewport.clientHeight);

//     const clamp = (value: number) => gsap.utils.clamp(-maxScroll(), 0, value);

//     const animateTo = (value: number) => {
//       y = clamp(value);

//       gsap.to(content, {
//         y,
//         duration: 0.45,
//         ease: "power3.out",
//       });
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       animateTo(y - e.deltaY);
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       startY = e.touches[0].clientY;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       e.preventDefault();

//       const currentY = e.touches[0].clientY;
//       const delta = startY - currentY;

//       startY = currentY;

//       animateTo(y - delta);
//     };

//     viewport.addEventListener("wheel", onWheel, { passive: false });
//     viewport.addEventListener("touchstart", onTouchStart, { passive: true });
//     viewport.addEventListener("touchmove", onTouchMove, { passive: false });

//     return () => {
//       viewport.removeEventListener("wheel", onWheel);
//       viewport.removeEventListener("touchstart", onTouchStart);
//       viewport.removeEventListener("touchmove", onTouchMove);
//     };
//   }, []);

//   useLayoutEffect(() => {
//     registerGSAP();
//     if (!panelRef.current || !overlayRef.current) return;
//     lockScroll();

//     const tl = gsap.timeline();

//     gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 0 });
//     gsap.set(overlayRef.current, { autoAlpha: 0 });

//     tl.to(overlayRef.current, {
//       autoAlpha: 1,
//       duration: 0.3,
//       ease: "power2.out",
//     }).to(
//       panelRef.current,
//       {
//         xPercent: 0,
//         autoAlpha: 1,
//         duration: 0.5,
//         ease: "power3.out",
//       },
//       "-=0.1",
//     );
//   }, []);

//   const handleClose = () => {
//     if (!panelRef.current || !overlayRef.current) return;
//     unlockScroll();

//     const tl = gsap.timeline({
//       onComplete: closeModal, // unmount AFTER animation
//     });

//     tl.to(panelRef.current, {
//       xPercent: 100,
//       autoAlpha: 0,
//       duration: 0.4,
//       ease: "power3.in",
//     }).to(
//       overlayRef.current,
//       {
//         autoAlpha: 0,
//         duration: 0.3,
//         ease: "power2.in",
//       },
//       "-=0.2",
//     );
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-[999999]">
//       <div
//         ref={overlayRef}
//         onClick={handleClose}
//         className="absolute inset-0 bg-black/30"
//       />

//       <div
//         ref={panelRef}
//         className="relative ml-auto h-full w-full lg:w-[400px] bg-white py-10 px-6 z-10"
//       >
//         <button
//           className={`pb-3 ${blauerNue.className} text-sm font-medium flex items-center justify-end ml-auto mr-0 gap-2 text-[#0F3C78] hover:text-[#1B3F75] transition`}
//           onClick={handleClose}
//         >
//           CLOSE
//           <span>
//             <Image
//               src="/images/home/testimonial-arrow.png"
//               alt="Close"
//               width={15}
//               height={15}
//             />
//           </span>
//         </button>
//         <div
//           ref={viewportRef}
//           className="panel-content h-full overflow-hidden relative"
//         >
//           <div ref={contentRef}>
//             <div className="modal-hero-section">
//               <div className="img-div overflow-hidden">
//                 <Image
//                   src={data.hero.img}
//                   alt={data.hero.title}
//                   height={300}
//                   width={400}
//                   className="h-[300px] w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
//                 />
//               </div>
//               <h5
//                 className={`${agency.className} text-lg tracking-[1px] text-(--blue) opacity-[0.8] pt-6`}
//               >
//                 {data.hero.title}
//               </h5>
//               <p
//                 className={`${blauerNue.className} font-extralight tracking-[0.5px] pt-2`}
//               >
//                 {data.hero.desc}
//               </p>
//             </div>
//             <div className="flex flex-col space-y-5 pt-8">
//               {data.properties.map((item: ProjectProperty, i: number) => {
//                 return <ProjectCards key={i} item={item} />;
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.body,
//   );
// };

// const ProjectCards = ({ item }: { item: ProjectProperty }) => {
//   return (
//     <Link
//       className="flex gap-6 items-center group border-b border-(--blue)/20 pb-5"
//       href={item.slug ?? "#"}
//     >
//       <div className="overflow-hidden">
//         <Image
//           src={item.img}
//           height={120}
//           width={150}
//           alt={item.title}
//           className="transition-transform duration-700 ease-out group-hover:scale-110"
//         />
//       </div>
//       <div className="">
//         <p
//           className={`${agency.className} text-base tracking-[1px]  opacity-[0.9] uppercase`}
//         >
//           {item.title}
//         </p>
//         <span className="text-(--blue) opacity-[0.9] font-semibold flex items-center gap-2 capitalize pt-1">
//           view more{" "}
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 14 14"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//           >
//             <path
//               d="M1 13L13 1M13 1H4M13 1V10"
//               stroke="#0F3C78"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>{" "}
//         </span>
//       </div>
//     </Link>
//   );
// };
