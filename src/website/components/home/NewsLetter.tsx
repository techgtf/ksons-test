"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { gsap, registerGSAP } from "../../utils/gsap";
import CommonBtn from "../common/CommonBtn";
import { BASE_ADMIN } from "@/config";
import StatusModal from "../common/StatusModal";

export type NewsLetterProps = {
  tag: string;
  heading: string;
  subtext: string;
  placeholder?: string;
  buttonText?: string;

  // Background assets
  smallBg?: string;
  bigBg?: string;
};

export default function NewsLetter({
  tag,
  heading,
  subtext,
  placeholder = "Enter Your E-Mail",
  buttonText = "SUBSCRIBE",
  smallBg = "/images/home/newsletter-bg.png",
  bigBg = "/images/home/newsletter-big-triangle.svg",
}: NewsLetterProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useLayoutEffect(() => {
    registerGSAP();
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_ADMIN}website/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Something went wrong");
      }

      setShowModal(true);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative max-md:h-auto w-full py-24 max-md:py-16 bg-[#F5F7FA] overflow-hidden flex items-center justify-center"
    >
      <StatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Subscribed!"
        message="Thank you for subscribing to our newsletter. We'll keep you updated with our latest news and offers."
      />

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={smallBg}
          alt="bg-1"
          height={160}
          width={160}
          className="absolute top-[22%] left-[12%] max-md:top-[10%] max-md:left-[5%] max-md:w-[100px] max-md:h-[100px]"
        />

        <Image
          src={bigBg}
          alt="bg-main"
          height={278}
          width={278}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-md:w-[278px] max-md:h-[278px]"
        />

        <Image
          src={smallBg}
          alt="bg-2"
          height={160}
          width={160}
          className="absolute bottom-[20%] right-[8%] max-md:bottom-[10%] max-md:right-[5%] max-md:w-[100px] max-md:h-[100px]"
        />
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="app-container relative z-10 w-full flex lg:flex-row flex-col justify-between items-center gap-10 lg:gap-20 max-md:px-4"
      >
        {/* LEFT COLUMN - HEADING & TAG */}
        <div className="flex flex-col items-center lg:items-start gap-4 lg:w-1/2 w-full">
          <div className={`flex items-center gap-4 text-[#0F3C78] ${blauerNue.className} tracking-[0.5px]`}>
            <Image
              src="/images/about/about-bullet.png"
              alt="bullet"
              height={16}
              width={16}
            />
            {tag}
          </div>
          <h2 className={`${agency.className} text-[32px] lg:text-[36px] text-[#0F3C78] leading-normal lg:leading-[50px] font-normal tracking-normal text-center lg:text-left max-w-[364px]`}>
            {heading}
          </h2>
        </div>

        {/* RIGHT COLUMN - SUBTEXT & FORM */}
        <div className="flex flex-col items-start gap-4 lg:w-[48%] w-full">
          <p
            className={`${blauerNue.className} text-[#1B3F75] font-light lg:leading-[24px] tracking-[0.5px] lg:text-left text-center`}
          >
            {subtext}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-4 w-full max-sm:flex-col"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={`${blauerNue.className} placeholder:font-light flex-1 min-w-[240px] max-sm:w-full px-6 py-3 rounded-[100px] text-[#0F3C78] border border-[#0F3C78] bg-transparent outline-none font-light tracking-[0.5px] placeholder:text-[#0f3c78]`}
            />

            <CommonBtn disabled={loading} type="submit" variant="primary">
              {loading ? "Submitting..." : buttonText}
            </CommonBtn>
          </form>
        </div>
      </div>
    </section>
  );
}
