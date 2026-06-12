import { BannerProps } from "@/src/website/components/home/Banner";
import About, { AboutProps } from "@/src/website/components/home/About";
import NewsLetter, {
  NewsLetterProps,
} from "@/src/website/components/home/NewsLetter";
import Services, {
  ServicesProps,
} from "@/src/website/components/home/Services";
import { SliderContainer } from "@/src/website/components/home/Slider";
import Values, { ValuesProps } from "@/src/website/components/home/Values";
import Testimonials, {
  TestimonialsProps,
} from "@/src/website/components/home/Testimonials";
import { VenturesProps } from "@/src/website/components/home/Ventures";
import Blogs from "@/src/website/components/home/Blogs";
import { NewsProps } from "@/src/website/components/home/News";
import NumbersScales, {
  NumbersScalesProps,
} from "@/src/website/components/home/NumbersScales";
import { CSRProps } from "@/src/website/components/home/CSR";
// import BannerVideo from "@/src/website/components/home/BannerVideo";
// import ButtonBannerVideo from "@/src/website/components/home/ButtonBannerVideo";
import HeroContainer from "@/src/website/components/home/Hero/HeroContainer";
import { LocationContainers } from "@/src/website/components/home/homeLocations/LocationContainers";
import { TestimonialsData } from "@/src/website/components/testimonials/data";
import { givePlatterPages } from "@/src/website/components/projects/projects";
import { blogs } from "@/src/website/components/blogs/blogs";
import CSR from "@/src/website/components/home/CSR";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Sons Group – Trusted Real Estate Developers Since 1970",
  keywords:
    "K.Sons Group, real estate developer Vrindavan, Mathura real estate, residential projects Vrindavan, commercial projects Vrindavan, premium villas, plots for sale Mathura, integrated townships, K.Sons real estate, legacy real estate developer ",
  description:
    "Founded in 1970, K.Sons Group builds lasting residential & commercial projects in Mathura & Delhi NCR, blending quality, credibility & timeless design.",
  alternates: {
    canonical: "https://ksonsgroup.com/",
  },
};

export default function Home() {
  const bannerData: BannerProps = {
    backgroundImage: "/images/home/banner.png",
    leftLogo: "/images/home/logo-initial.svg",
    rightLogo: "/images/home/logo-last.svg",
    tagline: "Creating value",
    heading: `K.sons: Building Trust, Creating Tomorrow`,
    buttonText: "Explore",
  };

  const aboutData: AboutProps = {
    tag: "About K.sons",
    heading: "We don’t just build, we shape generations",
    description:
      "Founded in 1970, K.sons has consistently built legacies that transcend generations. From residential havens to commercial landmarks, we craft spaces that endure, offering a blend of responsibility, credibility, and foresight in every project.",
    buttonText: "Our Story",
    image: "/images/home/about.png",
  };

  const servicesData: ServicesProps = {
    slides: [
      {
        title: "NBFC",
        desc: "K.sons ventured into finance in 2005 by acquiring Sybron Leasing and Finance Pvt. Ltd., reinforcing our business ecosystem and enabling strategic investments with a foundation of financial prudence and structured decision-making.",
        files: {
          mobile: "/images/home/services/slider-img1-mb.webp",
          desktop: "/images/home/services/slider-img1.webp",
        },
      },
      // {
      //   title: "Hospitality",
      //   desc: "Our commitment to hospitality is embodied in the Brij Vasundhara Resort & Spa, delivered in 2002, offering a seamless blend of luxury and spiritual context, where holiday living meets modern convenience.",
      //   files: {
      //     mobile: "/images/home/services/slider-img2-mb.webp",
      //     desktop: "/images/home/services/slider-img2.webp",
      //   },
      // },
      {
        title: "Education",
        desc: "With the establishment of Shree Jee Baba College of Law in 2003, K.sons has expanded into education, shaping a brighter future by nurturing knowledge and promoting sustainable communities through access to quality education.",
        files: {
          mobile: "/images/home/services/slider-img3-mb.webp",
          desktop: "/images/home/services/slider-img3.webp",
        },
      },
      {
        title: "Sports Team",
        desc: "In 2025, K.sons introduced the Brij Stars Kabaddi Team, marking our foray into sports ownership and community engagement, driven by the belief in sports as a means to inspire, foster competitive excellence, and shape long-term regional identity.",
        files: {
          mobile: "/images/home/services/slider-img4-mb.webp",
          desktop: "/images/home/services/slider-img4.webp",
        },
      },
    ],
    scrollText: "SCROLL",
    arrowIcon: "/images/home/services/arrow.svg",
  };

  const valuesData: ValuesProps = {
    tag: "Our Values",
    heading: "Values That Endure, Like the Spaces We Create",
    values: [
      {
        title: "Earned through every action",
        image: "/images/home/value-triangle-hollow.png",
        filledImage: "/images/home/value-triangle.png",
        description:
          "Credibility at K.sons is not declared; it is earned through consistent action over time. Our focus remains on delivering quality that stands the test of time, backed by transparent and dependable execution. Every milestone is a testament to the trust we have cultivated with our stakeholders.",
      },
      {
        title: "Planning for a timeless future.",
        image: "/images/home/value-triangle-hollow.png",
        filledImage: "/images/home/value-triangle.png",
        description:
          "At K.sons, foresight is integral to our process. Every decision, from design to development, is made with a long-term perspective, ensuring our projects remain relevant across market cycles and life stages. We anticipate needs and respect context, building with clarity and intention.",
      },
      {
        title: "Delivering growth with integrity.",
        image: "/images/home/value-triangle-hollow.png",
        filledImage: "/images/home/value-triangle.png",
        description:
          "Responsibility is at the core of everything we do. We believe in growing with care, ensuring that every project we undertake benefits not just the immediate stakeholders but contributes positively to the community and the environment. We build with responsibility, knowing that our decisions today shape tomorrow.",
      },
    ],
  };

  const { slides } = givePlatterPages();

  // const sliderData: SliderProps = {
  //   slides: [
  //     {
  //       title: "Residential Projects",
  //       label: "Residential",
  //       description:
  //         "In 2018, K.sons ventured into finance by acquiring Sybron Leasing and Finance Pvt. Ltd., reinforcing our business ecosystem and enabling strategic investments with a foundation of financial prudence and structured decision-making.",
  //       files: {
  //         mobile: "/images/home/project-slider/residential-mb.webp",
  //         desktop: "/images/home/project-slider/residential.webp",
  //       }
  //     },
  //     {
  //       title: "Township",
  //       label: "Township",
  //       description: "Expansive communities built with the future in mind, fostering a harmonious living experience.",

  //       files: {
  //         mobile: "/images/home/project-slider/township-mb.webp",
  //         desktop: "/images/home/project-slider/township.webp",
  //       }
  //     },
  //     {
  //       title: "Commercial",
  //       label: "Commercial",
  //       description: "Strategically located, our commercial developments serve as thriving hubs of growth and innovation.",
  //       files: {
  //         mobile: "/images/home/project-slider/commercial-mb.webp",
  //         desktop: "/images/home/project-slider/commercial.webp",
  //       }

  //     },
  //     {
  //       title: "Hospitality",
  //       label: "Hospitality",
  //       description: "Elevating leisure and spiritual experiences, blending comfort with contemporary hospitality.",
  //       files: {
  //         mobile: "/images/home/project-slider/hospitality-mb.webp",
  //         desktop: "/images/home/project-slider/hospitality.webp",
  //       }

  //     },
  //   ],
  //   buttonText: "Explore",
  //   buttonIcon: "/images/home/arrow2.png",
  // };

  const testimonialsData: TestimonialsProps = {
    tag: "Testimonial",
    heading: "Legacies That Speak Louder Than Words",
    testimonials: TestimonialsData,
  };

  const venturesData: VenturesProps = {
    tag: "Brand Ventures",
    heading: "Venture Into the Future, Build for the Generations",
    description:
      "K.sons brand ventures extend beyond real estate, enriching communities with impactful initiatives in finance, education, sports, and hospitality. Each venture is thoughtfully crafted to add value, drive progress, and foster long-term growth, staying true to our belief in building for the future.",

    backgroundImage: "/images/home/ventures-bg.png",

    logos: [
      {
        src: "/images/home/ventures-logo.png",
        alt: "venture 1",
        link: "#",
      },
      {
        src: "/images/home/ventures-logo2.png",
        alt: "venture 2",
        link: "#",
      },
      {
        src: "/images/home/ventures-logo3.png",
        alt: "venture 3",
        link: "#",
      },
    ],
  };

  const newsletterData: NewsLetterProps = {
    tag: "Newsletter",
    heading: "Subscribe To Our Newsletter",
    subtext: "Be the first to receive updates, tips, and more",
  };

  const numbersScalesData: NumbersScalesProps = {
    tag: "Numbers And Scale",
    heading: "Built On Experience. Expanded With Intent",

    triangleImage: "/images/home/value-triangle.png",
    dividerImage: "/images/home/numbersScales-line.png",

    leftTitle: "Legacy & Footprint",

    description:
      "At K.sons, progress is intentional, driven by preparedness and clarity. We approach each development with accountability and a long-term vision.",

    counters: [
      {
        value: 30,
        suffix: "+",
        label: "Years Of Experience",
      },
      {
        value: 5,
        label: "Key Regions Across India",
      },
      {
        value: 5,
        label: "Integrated Business Verticals",
      },
    ],
  };

  const blogsData: any = {
    tag: "Our Blogs",
    heading: "Words that Shape Tomorrow, Stories that Inspire Today",
    backgroundImage: "/images/home/blogs-bg.png",

    // blogs: [
    //   {
    //     date: "05-10-2022",
    //     title: "Investing in Real Estate",
    //     description:
    //       "we are committed to creating developments that balance cultural heritage with modern ambition.",
    //     image: "/images/home/blog-card-img.png",
    //     arrowIcon: "/images/home/blog-card-arrow.png",
    //   },
    //   {
    //     date: "05-10-2022",
    //     title: "Prime Commercial Assets",
    //     description:
    //       "we are committed to creating developments that balance cultural heritage with modern ambition.",
    //     image: "/images/home/blog-card-img.png",
    //     arrowIcon: "/images/home/blog-card-arrow.png",
    //   },
    //   {
    //     date: "05-10-2022",
    //     title: "Future Land Value",
    //     description:
    //       "we are committed to creating developments that balance cultural heritage with modern ambition.",
    //     image: "/images/home/blog-card-img.png",
    //     arrowIcon: "/images/home/blog-card-arrow.png",
    //   },
    // ],
    blogs: blogs,
    exploreText: "Explore All",
    exploreIcon: "/images/home/blog-explore-arrow.png",
  };

  const newsData: NewsProps = {
    tag: "News & Events",
    heading: "Where Knowledge Drives Tomorrow’s Vision",

    news: [
      {
        category: "Residential",
        title: "Top 5 emerging real estate trends in 2024",
        description:
          "We are committed to creating developments that balance cultural heritage growth for our customers.",
        image: "/images/home/our-news/residential.png",
      },
      {
        category: "Commercial",
        title: "Commercial spaces shaping the future",
        description:
          "Modern infrastructure and planning driving business ecosystems.",
        image: "/images/home/our-news/commercial.webp",
      },
      {
        category: "Hospitality",
        title: "Hospitality trends to watch",
        description:
          "Creating premium experiences with comfort and service excellence.",
        image: "/images/home/our-news/hospitality.webp",
      },
    ],

    buttonText: "Explore",
    buttonIcon: "/images/home/arrow.svg",
  };

  const eventsData: CSRProps = {
    tag: "CSR & Sustainbility",
    heading: "CSR: Building Communities with Purpose",
    description:
      "Advancing social impact through education, environmental care and community welfare.",

    backgroundImage: "/images/home/events-bg.png",

    events: [
      {
        image: "/images/csr/green-plantation/5.jpeg",
        year: "2026",
        title: "Green Plantation & Sustainability Efforts",
      },
      {
        image: "/images/csr/cleanliness.png",
        year: "2025",
        title: "Braj Cleanliness & Heritage Preservation",
      },
      {
        image: "/images/csr/education.png",
        year: "2025",
        title: "Education & Community Welfare",
      },
      {
        image: "/images/csr/eye-care.png",
        year: "2024",
        title: "Eye Care for the Underprivileged",
      },
    ],

    arrowIcon: "/images/home/testimonial-arrow.png",
  };

  return (
    <>
      <HeroContainer />
      <About {...aboutData} />
      <NumbersScales {...numbersScalesData} />
      {slides && <SliderContainer slides={slides} />}
      <Values {...valuesData} />
      <Services {...servicesData} />
      <Testimonials {...testimonialsData} />
      {/* <LocationWiseProjects /> */}

      <LocationContainers />
      {/* <News {...newsData} /> */}
      {/* <Ventures {...venturesData} /> */}
      <CSR {...eventsData} />
      <Blogs {...blogsData} />
      <NewsLetter {...newsletterData} />
    </>
  );
}
