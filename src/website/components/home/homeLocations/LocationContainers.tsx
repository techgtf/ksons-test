import React from "react";
import LocationWiseProjects from "./LocatonWiseProjects";
import LocationWiseProjectsMobile from "./LocationWiseProjectsMobile";
import { ResponsivePosition } from "./locationData";
import { fetchPageData } from "@/src/website/utils/api";

export type LocationData = {
  id: number;
  name: string;
  hero: {
    img: string;
    title: string;
    desc: string;
  };
  properties: {
    img: string;
    title: string;
    slug: string;
  }[];
} & {
  desc?: string | undefined;
};

export interface ModalHandle {
  /** Slide the panel in and load `data` */
  open: (data: LocationData) => void;
  /** Swap content without any panel animation (location changed while open) */
  swap: (data: LocationData) => void;
  /** Slide the panel out */
  close: () => void;
}

async function giveProjects() {
  const cityRes = await fetchPageData("website/city");

  if (!cityRes || !Array.isArray(cityRes.data)) {
    return {
      data: [],
    };
  }

  const filteredCities = cityRes.data
    .map((city: any) => ({
      ...city,
      projects:
        city.projects?.filter((project: any) => project.status === true) || [],
    }))
    .filter((city: any) => city.projects.length > 0);

  return {
    ...cityRes,
    data: filteredCities,
  };
}

export const LocationContainers = async () => {
  const cityRes = await giveProjects();

  const locations =
    (cityRes?.data || [])
      .filter((p: any) => p.status === true)
      .sort((a: any, b: any) => a.seq - b.seq) // Needs to be done from the Backend
      ?.map((city: any, index: number) => ({
        id: city.id,
        name: city.name,
        position: ResponsivePosition[index],
        desc: city.description,

        hero: {
          img:
            city.projects?.[0]?.files?.featured_desktop_file ||
            "/images/home/location-wise-pro/project.avif",
          title: city.name,
          desc: "",
        },

        properties:
          city.projects?.map((project: any) => ({
            img:
              project.files?.featured_desktop_file ||
              "/images/home/location-wise-pro/project.avif",
            title: project.projectName,
            slug: project.platter?.slug
              ? `/${project.platter.slug}/${project.slug}`
              : `/${project.slug}`,
          })) || [],
      })) || [];

  // console.log(locations, "locations");

  const ncrLocations = [
    {
      id: "cmqu2mrr300022pnt9405s39b",
      name: "Noida",
      position: ResponsivePosition[3],
      desc: "Noida is a rapidly developing city in the National Capital Region (NCR) of India, known for its modern infrastructure and growing real estate market.",

      hero: {
        img: "/images/home/location-wise-pro/project.avif",
        title: "Noida",
        desc: "",
      },
      properties: [],
    },

    {
      id: "cmqu2mrr300022pnt9405s39d",
      name: "Faridabad",
      position: ResponsivePosition[4],
      desc: "Faridabad is a rapidly developing city in the National Capital Region (NCR) of India, known for its modern infrastructure and growing real estate market.",

      hero: {
        img: "/images/home/location-wise-pro/project.avif",
        title: "Faridabad",
        desc: "",
      },

      properties: [],
    },
  ];
  const hatrasLocation = [
    {
      id: "cmqu2mrr300022pttt9405s39b",
      name: "Hathras",
      position: ResponsivePosition[5],
      desc: "Hathras is a rapidly developing city in the National Capital Region (NCR) of India, known for its modern infrastructure and growing real estate market.",

      hero: {
        img: "/images/home/location-wise-pro/project.avif",
        title: "Hathras",
        desc: "",
      },
      properties: [],
    },
  ];

  const mergedLocations = [...locations, ...ncrLocations, ...hatrasLocation];

  return (
    <>
      <LocationWiseProjects locations={mergedLocations} />
      <LocationWiseProjectsMobile locations={mergedLocations} />
    </>
  );
};
