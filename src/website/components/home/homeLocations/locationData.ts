export const ResponsivePosition = [
  // Govardhan
  {
    mobile: { top: "58.05%", left: "29.02%" },
    desktop: { top: "64.91%", left: "29.22%" },
  },
  // Vrindavan
  {
    mobile: { top: "54.48%", left: "38.90%" },
    desktop: { top: "58.74%", left: "36.45%" },
  },
  // Mathura
  {
    mobile: { top: "59.36%", left: "44.77%" },
    desktop: { top: "68.24%", left: "39.90%" },
  },
  // Noida
  {
    mobile: { top: "21.04%", left: "40.31%" },
    desktop: { top: "27.81%", left: "35.13%" },
  },
  // Faridabad
  {
    mobile: { top: "34.52%", left: "13.13%" },
    desktop: { top: "39.59%", left: "27.52%" },
  },
  // Hathras
  {
    mobile: { top: "56.53%", left: "66.16%" },
    desktop: { top: "62.77%", left: "52.76%" },
  },
];

// import { categories } from "../../projects/projects";

// const allProjects = categories.flatMap((cat) =>
//   cat.projects.map((proj) => ({
//     ...proj,
//     categorySlug: cat.slug,
//   })),
// );

// export const ResponsivePosition = [
//   {
//     mobile: { top: "50%", left: "13%" },
//     desktop: { top: "53%", left: "13%" },
//   },
//   {
//     mobile: { top: "52%", left: "27%" },
//     desktop: { top: "56%", left: "21%" },
//   },
//   {
//     mobile: { top: "60%", left: "30%" },
//     desktop: { top: "67%", left: "21%" },
//   },
// ];

// export const locationProjectsData = [
//   {
//     id: 1,

//     name: "Govardhan",
//     hero: {
//       img: "/images/home/location-wise-pro/govardhan.webp",
//       title: "Govardhan",
//       desc: "Premium residential and spiritual township projects near Govardhan with modern amenities and peaceful surroundings.",
//     },
//     properties: allProjects
//       .filter((p) => {
//         const loc = (p.location || "").toLowerCase();
//         return loc.includes("govardhan");
//       })
//       .map((p) => ({
//         img: p.featured_img || "/images/home/location-wise-pro/project.avif",
//         title: p.title,
//         slug: `/${p.categorySlug}/${p.slug}`,
//       })),
//   },
//   {
//     id: 2,

//     name: "Vrindavan",
//     hero: {
//       img: "/images/home/location-wise-pro/vrindavan.webp",
//       title: "Vrindavan",
//       desc: "Luxury plotted developments and lifestyle communities in the heart of Vrindavan.",
//     },
//     properties: allProjects
//       .filter((p) => {
//         const loc = (p.location || "").toLowerCase();
//         return loc.includes("vrindavan");
//       })
//       .map((p) => ({
//         img: p.featured_img || "/images/home/location-wise-pro/project.avif",
//         title: p.title,
//         slug: `/${p.categorySlug}/${p.slug}`,
//       })),
//   },
//   {
//     id: 3,

//     name: "Mathura",
//     hero: {
//       img: "/images/home/location-wise-pro/mathura.webp",
//       title: "Mathura",
//       desc: "High-value investment properties and modern townships in prime Mathura locations.",
//     },
//     properties: allProjects
//       .filter((p) => {
//         const loc = (p.location || "").toLowerCase();
//         return loc.includes("mathura");
//       })
//       .map((p) => ({
//         img: p.featured_img || "/images/home/location-wise-pro/project.avif",
//         title: p.title,
//         slug: `/${p.categorySlug}/${p.slug}`,
//       })),
//   },
// ];
