import About, { AboutProps } from "@/src/website/components/home/About";
import NewsLetter, {
  NewsLetterProps,
} from "@/src/website/components/home/NewsLetter";
import Services, {
  ServicesProps,
} from "@/src/website/components/home/Services";
import Values, { ValuesProps } from "@/src/website/components/home/Values";
import Testimonials, {
  TestimonialsProps,
} from "@/src/website/components/home/Testimonials";
import HeroContainer, {
  HeroBasicProps,
} from "@/src/website/components/home/Hero/HeroContainer";
import CSR, { CSRProps } from "@/src/website/components/home/CSR";
import NumbersScales, {
  NumbersScalesProps,
} from "@/src/website/components/home/NumbersScales";
import SliderContainer from "@/src/website/components/home/Slider";
import {
  LocationContainers,
  PageCitiesBasicData,
} from "@/src/website/components/home/homeLocations/LocationContainers";
import Blogs from "@/src/website/components/home/Blogs";

import { Metadata } from "next";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";
import { fetchPageData } from "@/src/website/utils/api";
import { cache } from "react";
import { formatDate } from "@/src/website/utils/dateFormat";

// In Next.js App Router, you can use React's cache() to deduplicate requests:
// This ensures the request is only executed once per render cycle.
const getHomePageData = cache(async () => {
  return fetchPageData("website/page/home");
});

export const generateMetadata = async (): Promise<Metadata> => {
  const home = await getHomePageData();
  if (!home) {
    return {
      title: "K.sons Group",
    };
  }
  return {
    title: home?.data?.seoTags?.meta_title,
    description: home?.data?.seoTags?.meta_description,
    keywords: home?.data?.seoTags?.meta_keywords,
    alternates: {
      canonical: `${BASE_FRONTEND}/home`,
    },
    openGraph: {
      type: "website",
      url: `${BASE_FRONTEND}/home`,
      siteName: "KSons Group",
      title: home?.data?.seoTags?.meta_title,
      description: home?.data?.seoTags?.meta_description,
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@KSonsGroup",
      creator: "@KSonsGroup",
      title: home?.data?.seoTags?.meta_title,
      description: home?.data?.seoTags?.meta_description,
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
};

export default async function Home() {
  const [
    pageRes,
    bannerRes,
    aboutSectionRes,
    pageCitiesRes,
    serviceRes,
    valuesSectionRes,
    platterRes,
    testimonialRes,
    tesimonialSectionRes,
    newsLetterSectionRes,
    numbersScalesSectionRes,
    blogsRes,
    blogHeadingRes,
    csrHeadingRes,
    eventsRes,
  ] = await Promise.all([
    getHomePageData(),
    fetchPageData("website/home-banners"),
    fetchPageData("website/page-section/home_about_us"),
    fetchPageData("website/page-section/home_cities_section"),
    fetchPageData("website/services"),
    fetchPageData("website/page-section/home_our_value"),
    fetchPageData("website/platter"),
    fetchPageData("website/testimonials"),
    fetchPageData("website/page-section/home_testimonial"),
    fetchPageData("website/page-section/home_news_letter"),
    fetchPageData("website/page-section/home_number_and_scale"),
    fetchPageData("website/blogs?page=1&limit=4"),
    fetchPageData("website/page-section/home_our_blogs"),
    fetchPageData("website/page-section/home_csr"),
    fetchPageData("website/events"),
  ]);

  const pageResData = pageRes?.data;

  const heroBasicData: HeroBasicProps = {
    alt: pageResData?.alt,
    tagLine: pageResData?.title?.heading,
    logo: "/images/header/logo-no-line.svg",
    thumbnails: {
      desktop_file: pageResData?.files?.desktop_file,
      mobile_file: pageResData?.files?.mobile_file,
    },
  };

  // banner videos
  const bannerData = bannerRes?.data || [];
  const heroFiles = bannerData.map((item: any) => ({
    id: item.id,
    desktop_file: item.files?.desktopFile,
    mobile_file: item.files?.mobileFile,
  }));

  const aboutSectionData = aboutSectionRes?.data?.[0];

  const aboutData: AboutProps = {
    tag: aboutSectionData?.title?.sub_heading,
    heading: aboutSectionData?.title?.heading,
    description: aboutSectionData?.title?.description,
    buttonText: "Our Story",
    image: "/images/home/about.png",
    smallText: aboutSectionData?.title?.small,
  };

  const pageCitiesBasicData: PageCitiesBasicData = pageCitiesRes?.data?.[0];

  const serviceSectionData = serviceRes?.data || [];

  const servicesData: ServicesProps = {
    slides: serviceSectionData.map((service: any) => ({
      title: service.title,
      desc: service.description,
      files: {
        mobile: service.files?.mobile_file || "",
        desktop: service.files?.desktop_file || "",
        mainLabel: service.files?.mainLabel || "",
      },
    })),
    scrollText: "SCROLL",
    arrowIcon: "/images/home/services/arrow.svg",
  };

  const valuesSectionData = valuesSectionRes?.data?.[0];

  const valuesData: ValuesProps = {
    tag: valuesSectionData?.title?.main,
    heading: valuesSectionData?.title?.sub,
    values: valuesSectionData?.list?.map((item: any) => {
      return {
        title: item?.title,
        image: "/images/home/value-triangle-hollow.png",
        filledImage: "/images/home/value-triangle.png",
        description: item?.description,
      };
    }),
  };

  const plattersData = platterRes?.data || [];

  const slides = plattersData?.map((item: any) => ({
    slug: item?.slug,
    title: item?.name,
    label: `${item?.name} Projects`,
    description: item?.title?.main,
    files: {
      featured_mobile_file: item?.files?.featured_mobile_file,
      featured_desktop_file: item?.files?.featured_desktop_file,
      mainLabel: item?.files?.mainLabel,
      featuredLabel: item?.files?.featuredLabel,
    },
  }));

  const testimonialResData = testimonialRes?.data;

  const testimonialMappedData = testimonialResData?.map(
    (item: {
      name: string;
      designation: string;
      files: { image: string; mainLabel: string };
      description: string;
    }) => ({
      name: item.name,
      role: item.designation,
      image: item.files?.image,
      mainLabel: item.files?.mainLabel,
      text: item.description,
    }),
  );

  const testimonialSectionData = tesimonialSectionRes?.data?.[0];

  const testimonialsData: TestimonialsProps = {
    tag: testimonialSectionData?.title?.main,
    heading: testimonialSectionData?.title?.sub,
    testimonials: testimonialMappedData,
  };

  const newsLetterSectionData = newsLetterSectionRes?.data?.[0];

  const newsletterData: NewsLetterProps = {
    tag: newsLetterSectionData?.title?.main,
    heading: newsLetterSectionData?.title?.sub,
    subtext: newsLetterSectionData?.title?.description,
  };

  const numbersScalesSectionData = numbersScalesSectionRes?.data?.[0];

  const numbersScalesData: NumbersScalesProps = {
    tag: numbersScalesSectionData?.title?.main,
    heading: numbersScalesSectionData?.title?.sub,

    triangleImage: "/images/home/value-triangle.png",
    dividerImage: "/images/home/numbersScales-line.png",

    leftTitle: numbersScalesSectionData?.title?.sub_heading,

    description: numbersScalesSectionData?.title?.description,
    counters:
      numbersScalesSectionData?.list?.map((item: any) => ({
        value: item?.number,
        suffix: Number(item?.number) > 9 ? "+" : null,
        label: item?.text,
      })) || [],
  };

  const blogsResData = blogsRes?.data;

  const blogHeadingResData = blogHeadingRes?.data?.[0];

  const blogsMappedData = blogsResData?.map((item: any) => ({
    title: item?.title,
    description: item?.description?.short,
    date: formatDate(item?.dateAt),
    slug: item?.slug,
  }));
  type BlogType = {
    tag: string;
    heading: string;
    backgroundImage: string;
    blogs: {
      title: string;
      description: string;
      date: string;
      slug: string;
    }[];
    exploreText: string;
    exploreIcon: string;
  };
  const blogsData: BlogType = {
    tag: blogHeadingResData?.title?.main,
    heading: blogHeadingResData?.title?.sub,
    backgroundImage: "/images/home/blogs-bg.png",
    blogs: blogsMappedData,
    exploreText: "Explore All",
    exploreIcon: "/images/home/blog-explore-arrow.png",
  };

  const csrHeadingResData = csrHeadingRes?.data?.[0];

  const eventsData = eventsRes?.data || [];

  const mappedEvents = eventsData.map((item: any) => {
    return {
      title: item.title,
      year: item.year,
      image: item.files?.desktop_file || item.files?.mobile_file,
      mainLabel: item?.files?.mainLabel || "",
    };
  });

  const csrData: CSRProps = {
    tag: csrHeadingResData?.title?.main,
    heading: csrHeadingResData?.title?.sub,
    description: csrHeadingResData?.title?.description,
    backgroundImage: "/images/home/events-bg.png",
    events: mappedEvents,
    arrowIcon: "/images/home/testimonial-arrow.png",
  };

  return (
    <>
      <HeroContainer basicData={heroBasicData} files={heroFiles} />
      {aboutData && <About {...aboutData} />}
      {numbersScalesData && <NumbersScales {...numbersScalesData} />}
      {slides && <SliderContainer slides={slides} />}
      {valuesData && <Values {...valuesData} />}
      {servicesData && <Services {...servicesData} />}
      {testimonialsData && <Testimonials {...testimonialsData} />}

      <LocationContainers pageCitiesBasicData={pageCitiesBasicData} />
      {/* <News {...newsData} /> */}
      {/* <Ventures {...venturesData} /> */}
      {csrData && <CSR {...csrData} />}
      {blogsData && <Blogs {...blogsData} />}
      {newsletterData && <NewsLetter {...newsletterData} />}
    </>
  );
}
