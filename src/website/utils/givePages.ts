import { givePlatterWithProject } from "../components/projects/projects";

export const OtherPagesLinks = [
  { label: "Contact Us", href: "/contact" },
  // { label: "Media Center", href: "/media-center" },
  { label: "Blogs", href: "/blogs" },
  // { label: "Careers", href: "/careers" },
  // { label: "awards", href: "/awards" },
  { label: "CSR", href: "/csr" },
  { label: "FAQ", href: "/faq" },
  { label: "gallery", href: "/gallery" },
  { label: "home loan", href: "/home-loan" },
  { label: "NRI corner", href: "/nri-corner" },
  { label: "tax benefit", href: "/tax-benefit" },
  { label: "testimonials", href: "/testimonials" },
  { label: "news & events", href: "/news-events" },
  { label: "EMI calculator", href: "/emi-calculator" },
  { label: "investor", href: "/investor" },
];

export const ProjectsLinks = givePlatterWithProject();

export const HEADER_MENU_ITEMS = [
  ...ProjectsLinks,
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
];
