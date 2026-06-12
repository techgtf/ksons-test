import { Variants } from "framer-motion";
export const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1],
        },
    },
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};