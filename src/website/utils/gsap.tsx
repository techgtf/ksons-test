import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

let isRegistered = false;

export const registerGSAP = () => {
    if (typeof window === "undefined") return;
    if (isRegistered) return;

    gsap.registerPlugin(
        ScrollTrigger,
        ScrollToPlugin,
        MotionPathPlugin
    );

    isRegistered = true;
};

export { gsap, ScrollTrigger };