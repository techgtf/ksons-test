import localFont from "next/font/local";

/* 🔵 BLAUER NUE */
export const blauerNue = localFont({
    src: [
        {
            path: "./fonts/BlauerNue-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "./fonts/BlauerNue-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/BlauerNue-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/BlauerNue-SemiBold.woff2",
            weight: "600",
            style: "normal",
        },
    ],
    variable: "--font-blauer",
});


/* 🔴 AGENCY */
export const agency = localFont({
    src: [
        {
            path: "./fonts/Agency.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-agency",
});


/* 🟢 AMS KARTIK */
export const amsKartik = localFont({
    src: [
        {
            path: "./fonts/AMS KARTIK REGULAR.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-ams-kartik",
});


/* 🟣 ANDIMANTE PERSONAL USE */
export const andimante = localFont({
    src: [
        {
            path: "./fonts/AndimantePersonalUse-Regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-andimante",
});


/* 🟡 MYRIAD PRO */
export const myriadPro = localFont({
    src: [
        {
            path: "./fonts/MyriadPro-Regular_0.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-myriad",
});