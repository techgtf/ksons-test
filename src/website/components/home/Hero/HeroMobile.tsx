"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/src/website/utils/gsap";
import { agency } from "@/src/app/fonts";
import { FileType } from "./HeroContainer";
import Image from "next/image";

type Props = {
  tagLine: string;
  logo?: string;
  files: FileType[];
};

export default function HeroMobile({ tagLine, logo, files }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const totalVideos = files.length;

  useLayoutEffect(() => {
    registerGSAP();

    // ✅ Only run on mobile
    if (window.innerWidth >= 768) return;

    const cleaner: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (!video1Ref.current || !video2Ref.current || !containerRef.current)
        return;

      const videoEls = [video1Ref.current, video2Ref.current];

      let active = 0;
      let loopStarted = false;

      const getVideoSrc = (index: number) => {
        const file = files[index - 1];
        if (!file) return "";
        return `${file.mobile_file}${index}.mp4`;
      };

      /* CTA animation */
      if (ctaRef.current) {
        gsap
          .timeline({ delay: 0.4 })
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 },
          )
          .fromTo(
            ctaRef.current.querySelector("h2"),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.3",
          );
      }

      /* Preload all videos */
      for (let i = 1; i <= totalVideos; i++) {
        const v = document.createElement("video");
        v.src = getVideoSrc(i);
        v.preload = "auto";
        v.load();
      }

      /* Play video at index */
      const playVideoAt = (index: number) => {
        let targetIndex = index;
        if (targetIndex > totalVideos) {
          targetIndex = 1;
        }

        const next = (active + 1) % 2;
        const currentVideo = videoEls[active];
        const nextVideo = videoEls[next];

        nextVideo.src = getVideoSrc(targetIndex);
        nextVideo.load();

        const doPlay = () => {
          nextVideo.oncanplay = null;
          nextVideo.currentTime = 0;

          nextVideo.play().then(() => {
            gsap.set(nextVideo, { zIndex: 10, opacity: 0 });
            gsap.set(currentVideo, { zIndex: 5 });

            gsap.to(nextVideo, {
              opacity: 1,
              duration: 0.25,
              onComplete: () => {
                active = next;
                gsap.set(currentVideo, { opacity: 0 });
                const triggerNext = () => {
                  nextVideo.ontimeupdate = null;
                  nextVideo.onended = null;
                  playVideoAt(targetIndex + 1);
                };

                // Trigger next video 0.5s before current ends for seamless transition
                nextVideo.ontimeupdate = () => {
                  if (
                    nextVideo.duration &&
                    nextVideo.duration - nextVideo.currentTime < 0.5
                  ) {
                    triggerNext();
                  }
                };

                nextVideo.onended = triggerNext;
              },
            });
          }).catch((err) => {
            console.log("Next video play failed", err);
          });
        };

        if (nextVideo.readyState >= 3) {
          doPlay();
        } else {
          nextVideo.oncanplay = doPlay;
        }
      };

      /* Start first video */
      const startLoop = () => {
        if (loopStarted) return;
        loopStarted = true;

        const firstVideo = videoEls[0];
        firstVideo.src = getVideoSrc(1);
        firstVideo.load();

        const playFirst = () => {
          firstVideo.currentTime = 0;
          firstVideo.play().then(() => {
            const triggerNext = () => {
              firstVideo.ontimeupdate = null;
              firstVideo.onended = null;
              playVideoAt(2);
            };

            // Trigger next video 0.5s before current ends for seamless transition
            firstVideo.ontimeupdate = () => {
              if (
                firstVideo.duration &&
                firstVideo.duration - firstVideo.currentTime < 0.5
              ) {
                triggerNext();
              }
            };

            firstVideo.onended = triggerNext;
          }).catch((err) => {
            console.log("First video play failed", err);
          });
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

      // Start autoplay sequence
      startLoop();

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

  return (
    <section
      ref={containerRef}
      className="relative md:hidden h-[94vh] w-full overflow-hidden bg-white"
    >
      {[video1Ref, video2Ref].map((ref, i) => (
        <video
          key={i}
          ref={ref}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/images/home/banner/mobile/1.webp"
          controlsList="nodownload nofullscreen noremoteplayback"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === 0 ? 1 : 0,
            transform: "scale(1.01)",
            backfaceVisibility: "hidden",
          }}
        />
      ))}

      {/* CTA */}
      <div
        ref={ctaRef}
        className="absolute bottom-16 left-6 right-6 z-30 flex items-center gap-4 opacity-0"
      >
        <div>
          {logo && (
            <h2
              className={`${agency.className} text-[#000] text-[27px] lg:text-[40px] flex items-baseline `}
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
            className={`${agency.className} text-[#0F3C78] text-[24px] tracking-[-0.5px] `}
          >
            {tagLine}
          </h2>
        </div>
      </div>
    </section>
  );
}
