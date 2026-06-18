"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/src/website/utils/gsap";
import { agency, blauerNue } from "@/src/app/fonts";
import { BsFillSkipForwardFill } from "react-icons/bs";
import { scrollLock } from "../../SmoothScroller";
import Lenis from "lenis";
import { FileType } from "./HeroContainer";
import Image from "next/image";

type Props = {
  tagLine: string;
  logo?: string;
  files: FileType[];
  thumbnails: string;
};

export let lenisInstance: Lenis | null = null;
export default function ButtonBannerVideo({
  tagLine,
  logo,
  files,
  thumbnails,
}: Props) {
  if (!files) return null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const skipBtnRef = useRef<HTMLButtonElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const totalVideos = files.length;
  const reachedLastVideo = useRef(false);
  const controlsRef = useRef<{ skip?: () => void }>({});

  useLayoutEffect(() => {
    registerGSAP();

    if (window.innerWidth < 768) return;

    const cleaner: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (!video1Ref.current || !video2Ref.current || !containerRef.current)
        return;

      const container = containerRef.current;

      let active = 0;
      let currentIndex = 0;
      let isPlaying = false;
      let loopStarted = false;

      const videoEls = [video1Ref.current, video2Ref.current];

      /* CTA */
      if (ctaRef.current) {
        gsap
          .timeline({ delay: 0.6 })
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
          )
          .fromTo(
            ctaRef.current.querySelector("h2"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4",
          )
          .fromTo(
            ctaRef.current.querySelector("button"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4",
          );
      }

      const getVideoSrc = (index: number) => {
        const file = files[index - 1];
        if (!file) return "";
        return file.desktop_file;
      };

      const lockScroll = () => scrollLock.lock();
      const unlockScroll = () => scrollLock.unlock();

      cleaner.push(() => unlockScroll());

      /* preload */
      for (let i = 1; i <= totalVideos; i++) {
        const v = document.createElement("video");
        v.src = getVideoSrc(i);
        v.preload = "auto";
        v.load();
      }

      /* pin */
      let trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=1",
        pin: true,
        pinSpacing: true,
      });

      let triggerKilled = false;

      const killTriggerSafely = () => {
        if (!trigger || triggerKilled) return;
        trigger.kill(true);
        triggerKilled = true;
      };

      /* PLAY VIDEO */
      const playVideoAt = (index: number) => {
        if (reachedLastVideo.current) return;

        if (index > totalVideos) {
          reachedLastVideo.current = true;

          videoEls.forEach((v) => v.pause());

          killTriggerSafely();
          unlockScroll();

          document.body.style.overflow = "";

          // requestAnimationFrame(() => {
          //   scrollLock.scrollTo(window.innerHeight * 0.6, {
          //     duration: 1.2,
          //   });
          // });

          return;
        }

        isPlaying = true;

        const next = (active + 1) % 2;
        const currentVideo = videoEls[active];
        const nextVideo = videoEls[next];

        nextVideo.src = getVideoSrc(index);
        nextVideo.load();

        const doPlay = () => {
          nextVideo.oncanplay = null;
          nextVideo.currentTime = 0;

          nextVideo.play().then(() => {
            // Ensure next video is on top and starts transparent
            gsap.set(nextVideo, { zIndex: 10, opacity: 0 });
            gsap.set(currentVideo, { zIndex: 5 });

            gsap.to(nextVideo, {
              opacity: 1,
              duration: 0.25,
              ease: "none",
              onComplete: () => {
                active = next;
                currentIndex = index;

                // Now safe to hide the old video underneath
                gsap.set(currentVideo, { opacity: 0 });

                const triggerNext = () => {
                  nextVideo.ontimeupdate = null;
                  nextVideo.onended = null;
                  isPlaying = false;
                  /* PLAY NEXT VIDEO */
                  playVideoAt(index + 1);
                };

                // Trigger next video 0.4s before current ends for seamless transition
                nextVideo.ontimeupdate = () => {
                  if (
                    nextVideo.duration &&
                    nextVideo.duration - nextVideo.currentTime < 0.4
                  ) {
                    triggerNext();
                  }
                };

                nextVideo.onended = triggerNext;
              },
            });
          });
        };

        if (nextVideo.readyState >= 3) {
          doPlay();
        } else {
          nextVideo.oncanplay = doPlay;
        }
      };

      /* FIRST VIDEO ONLY ON SCROLL */
      const startLoop = () => {
        if (loopStarted) return;

        loopStarted = true;

        const firstVideo = videoEls[0];
        firstVideo.src = getVideoSrc(1);
        firstVideo.load();

        const playFirst = () => {
          firstVideo.currentTime = 0;
          isPlaying = true;

          firstVideo.play().catch((err) => {
            console.error("First video play failed", err);
          });

          firstVideo.onended = () => {
            isPlaying = false;
            currentIndex = 1;

            /* continue loop */
            playVideoAt(2);
          };

          const triggerNext = () => {
            firstVideo.ontimeupdate = null;
            firstVideo.onended = null;
            isPlaying = false;
            currentIndex = 1;

            /* continue loop */
            playVideoAt(2);
          };

          // Trigger next video 0.4s before current ends for seamless transition
          firstVideo.ontimeupdate = () => {
            if (
              firstVideo.duration &&
              firstVideo.duration - firstVideo.currentTime < 0.4
            ) {
              triggerNext();
            }
          };

          firstVideo.onended = triggerNext;
        };

        if (firstVideo.readyState >= 3) {
          playFirst();
        } else {
          firstVideo.oncanplay = () => {
            firstVideo.oncanplay = null;
            playFirst();
          };
        }
      };

      /* skip */
      controlsRef.current.skip = () => {
        reachedLastVideo.current = true;

        videoEls.forEach((v) => v.pause());

        killTriggerSafely();
        unlockScroll();
        document.body.style.overflow = "";

        requestAnimationFrame(() => {
          scrollLock.scrollTo(window.innerHeight * 1, {
            duration: 1.2,
          });
        });
      };

      // Check if homepage loader is active in the DOM
      const isLoaderActive = !!document.getElementById("homepage-loader");

      if (isLoaderActive) {
        /* Lock scroll until loader is done */
        lockScroll();
        document.body.style.overflow = "hidden";

        const handleLoaderDone = () => {
          startLoop();
          unlockScroll();
          document.body.style.overflow = "";
        };

        window.addEventListener("loaderDone", handleLoaderDone);
        cleaner.push(() =>
          window.removeEventListener("loaderDone", handleLoaderDone),
        );
      } else {
        /* No loader active, start video and ensure scroll is unlocked immediately */
        startLoop();
        unlockScroll();
        document.body.style.overflow = "";
      }

      cleaner.push(() => {
        videoEls.forEach((v) => {
          v.pause();
          v.onended = null;
          v.oncanplay = null;
          v.ontimeupdate = null;
        });
      });
    }, containerRef);

    return () => {
      cleaner.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  }, []);

  return (
    <div className="hidden md:flex">
      <div
        ref={containerRef}
        className="relative h-screen w-screen overflow-hidden bg-white items-center justify-center"
      >
        {[video1Ref, video2Ref].map((ref, i) => (
          <video
            key={i}
            ref={ref}
            poster={thumbnails || "/images/home/banner/1.webp"}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              top: 0,
              left: 0,
              opacity: i === 0 ? 1 : 0,
              transform: "scale(1.01)",
              backfaceVisibility: "hidden",
            }}
          />
        ))}

        <div
          ref={ctaRef}
          className="absolute bottom-12 left-16 right-16 z-30 flex items-end justify-between opacity-0"
        >
          <div>
            {logo && (
              <h2
                className={`${agency.className} text-[#000] text-[24px] lg:text-[30px] flex items-baseline `}
              >
                <Image
                  src={logo}
                  alt="Logo"
                  width={140}
                  height={140}
                  className="w-28 object-contain"
                />{" "}
                <span className="block relative top-[-3px]"> :</span>
              </h2>
            )}

            <h2
              className={`${agency.className} pt-1 text-[#0F3C78] text-[24px] lg:text-[35px] lg:leading-[52px] tracking-[-0.5px] max-w-xl`}
            >
              {" "}
              {tagLine}
            </h2>
          </div>

          <button
            ref={skipBtnRef}
            onClick={() => controlsRef.current.skip?.()}
            className={`${blauerNue.className} flex items-center justify-center absolute top-0 right-4 z-50 px-4 py-2 text-sm bg-black/40 transition duration-300 hover:bg-black/60 text-white rounded-full mt-10`}
          >
            Skip
            <BsFillSkipForwardFill className="ml-2" />
          </button>
        </div>

        <div className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-white z-50 pointer-events-none" />
      </div>
    </div>
  );
}
