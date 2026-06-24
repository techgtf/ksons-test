import React from "react";

export default function LocationContainersOld() {
  return <div>LocationContainersOld</div>;
}

// import React from "react";
// import { locationProjectsData, ResponsivePosition } from "./locationData";
// import { fetchPageData } from "@/src/website/utils/api";
// import LocationWiseProjects from "./LocatonWiseProjects";
// import LocationWiseProjectsMobile from "./LocationWiseProjectsMobile";

// export interface PageCitiesBasicData {
//   title: { main: string; sub: string };
//   files: {
//     desktop_image: string;
//     mobile_image: string;
//   };
// }

// export type LocationData = (typeof locationProjectsData)[0] & {
//   desc?: string;
// };

// export interface ModalHandle {
//   /** Slide the panel in and load `data` */
//   open: (data: LocationData) => void;
//   /** Swap content without any panel animation (location changed while open) */
//   swap: (data: LocationData) => void;
//   /** Slide the panel out */
//   close: () => void;
// }

// async function giveProjects() {
//   const cityRes = await fetchPageData("website/city");

//   if (!cityRes || !Array.isArray(cityRes.data)) {
//     return {
//       data: [],
//     };
//   }

//   const filteredCities = cityRes.data
//     .map((city: any) => ({
//       ...city,
//       projects:
//         city.projects?.filter((project: any) => project.status === true) || [],
//     }))
//     .filter((city: any) => city.projects.length > 0);

//   return {
//     ...cityRes,
//     data: filteredCities,
//   };
// }

// export const LocationContainers = async ({
//   pageCitiesBasicData,
// }: {
//   pageCitiesBasicData: PageCitiesBasicData;
// }) => {
//   const cityRes = await giveProjects();

//   const locations =
//     (cityRes?.data || [])
//       .filter((p: any) => p.status === true)
//       .sort((a: any, b: any) => a.seq - b.seq) // Needs to be done from the Backend
//       ?.map((city: any, index: number) => ({
//         id: city.id,
//         name: city.name,
//         position: ResponsivePosition[index],
//         desc: city.description,

//         hero: {
//           img:
//             city.projects?.[0]?.files?.featured_desktop_file ||
//             "/images/home/location-wise-pro/project.avif",
//           title: city.name,
//           desc: "", // This Also needs to come in city
//         },

//         properties:
//           city.projects?.map((project: any) => ({
//             img:
//               project.files?.featured_desktop_file ||
//               "/images/home/location-wise-pro/project.avif",
//             title: project.projectName,
//             slug: project.platter?.slug
//               ? `/${project.platter.slug}/${project.slug}`
//               : `/${project.slug}`,
//           })) || [],
//       })) || [];

//   // console.log(locations, "locations");
//   return (
//     <>
//       <LocationWiseProjects
//         desktop_file={pageCitiesBasicData.files.desktop_image}
//         locations={locations}
//       />
//       <LocationWiseProjectsMobile
//         mobile_file={pageCitiesBasicData.files.mobile_image}
//         locations={locations}
//       />
//     </>
//   );
// };
