import { categories } from "../../projects/projects";

const allProjects = categories.flatMap((cat) =>
  cat.projects.map((proj) => ({
    ...proj,
    categorySlug: cat.slug,
  })),
);

export const locationProjectsData = [
  {
    id: 1,
    responsive: {
      mobile: {
        top: "50%",
        left: "13%",
      },
      desktop: {
        top: "53%",
        left: "13%",
      },
    },
    name: "Govardhan",
    hero: {
      img: "/images/home/location-wise-pro/govardhan.webp",
      title: "Govardhan",
      desc: "Premium residential and spiritual township projects near Govardhan with modern amenities and peaceful surroundings.",
    },
    properties: allProjects
      .filter((p) => {
        const loc = (p.location || "").toLowerCase();
        return loc.includes("govardhan");
      })
      .map((p) => ({
        img: p.featured_img || "/images/home/location-wise-pro/project.avif",
        title: p.title,
        slug: `/${p.categorySlug}/${p.slug}`,
      })),
  },
  {
    id: 2,
    responsive: {
      mobile: {
        top: "52%",
        left: "27%",
      },
      desktop: {
        top: "56%",
        left: "21%",
      },
    },
    name: "Vrindavan",
    hero: {
      img: "/images/home/location-wise-pro/vrindavan.webp",
      title: "Vrindavan",
      desc: "Luxury plotted developments and lifestyle communities in the heart of Vrindavan.",
    },
    properties: allProjects
      .filter((p) => {
        const loc = (p.location || "").toLowerCase();
        return loc.includes("vrindavan");
      })
      .map((p) => ({
        img: p.featured_img || "/images/home/location-wise-pro/project.avif",
        title: p.title,
        slug: `/${p.categorySlug}/${p.slug}`,
      })),
  },
  {
    id: 3,

    responsive: {
      mobile: {
        top: "60%",
        left: "30%",
      },
      desktop: {
        top: "67%",
        left: "21%",
      },
    },
    name: "Mathura",
    hero: {
      img: "/images/home/location-wise-pro/mathura.webp",
      title: "Mathura",
      desc: "High-value investment properties and modern townships in prime Mathura locations.",
    },
    properties: allProjects
      .filter((p) => {
        const loc = (p.location || "").toLowerCase();
        return loc.includes("mathura");
      })
      .map((p) => ({
        img: p.featured_img || "/images/home/location-wise-pro/project.avif",
        title: p.title,
        slug: `/${p.categorySlug}/${p.slug}`,
      })),
  },
];
