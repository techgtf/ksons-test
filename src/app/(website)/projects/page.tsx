import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import LocationProjectContainer from "@/src/website/components/locationsProject/LocationProjectContainer";
import { fetchPageData } from "@/src/website/utils/api";

export default async function LocationPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; page?: string }>;
}) {
  const { location, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const pageRes = await fetchPageData("website/page/projects");
  const pageData = pageRes?.data;

  // 1. Fetch cities, projects, and statuses from the API
  const [cityRes, projectRes, projectStatusRes] = await Promise.all([
    fetchPageData("website/city"),
    fetchPageData(
      `website/project?status=true&limit=${limit}&page=${currentPage}`,
    ),
    fetchPageData("website/projectstatus"),
  ]);

  const citiesData = cityRes?.data || [];
  const projectsData = projectRes?.data || [];
  const statusData = projectStatusRes?.data || projectStatusRes || [];

  const paginationData = projectRes?.pagination || {
    total: projectsData.length,
    page: currentPage,
    limit: limit,
    totalPages: Math.ceil(projectsData.length / limit),
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Extract unique active city names
  const apiCities = citiesData
    .filter((city: any) => city.projects && city.projects.length > 0)
    .map((city: any) => city.name);

  // Map status names by status ID
  const statusMap: Record<string, string> = {};
  if (Array.isArray(statusData)) {
    statusData.forEach((s: any) => {
      statusMap[s.id] = s.name;
    });
  }

  // Map API projects to the Project interface format expected by components
  const projectsList = projectsData
    .filter((p: any) => p.status === true)
    .map((p: any) => {
      const typologyName = p.typology?.name || "";
      const subTypologies =
        p.projectSubTypology
          ?.map((st: any) => st.subTypology?.name?.trim())
          .filter(Boolean) || [];
      const combinedTypology =
        [typologyName, ...subTypologies].filter(Boolean).join(", ") || "";

      return {
        id: p.id,
        slug: p.slug,
        title: p.projectName,
        categorySlug: p.platter?.slug || "",
        description: p.shortDescription || "",
        location: p.location || p.city?.name || "",
        year: p.createdAt
          ? new Date(p.createdAt).getFullYear()
          : new Date().getFullYear(),
        price: p.price || 0,
        area: p.starting_size
          ? `${p.starting_size} ${p.size_unit || "Acres"}`
          : "",
        desktop_file: p.files?.desktop_image || "",
        mobile_file: p.files?.mobile_image || "",
        featured_img:
          p.files?.featured_desktop_file || p.files?.desktop_image || "",
        featured: p.is_featured || false,
        typology: combinedTypology,
        status: statusMap[p.projectStatusId] || "Ongoing",
        seq: Number(p.seq) || 0,
      };
    });

  const locList = location
    ? location.split(",").map((l) => decodeURIComponent(l).trim().toLowerCase())
    : [];

  const selectedLocations = apiCities.filter((c: string) =>
    locList.includes(c.toLowerCase()),
  );

  // Default header info if no specific location is provided
  const headerInfo = {
    name: selectedLocations[0],
    // name:
    //   selectedLocations.length === 1
    //     ? selectedLocations[0]
    //     : selectedLocations.length > 1
    //       ? "Selected Locations"
    //       : "Discover Locations",
    description:
      selectedLocations.length === 1
        ? `Explore premium residential, township and commercial developments thoughtfully crafted across ${selectedLocations[0]}.`
        : selectedLocations.length > 1
          ? `Explore our premium developments across ${selectedLocations.join(", ")}.`
          : "Explore our premium residential, township, and commercial developments by selecting your preferred locations.",
  };

  return (
    <div
      data-cursor="light"
      className="location-page  bg-[linear-gradient(180deg,rgba(51,211,238,0.07)_0%,rgba(15,60,120,0.07)_100%)]"
    >
      <div className="relative">
        <div className="app-container absolute top-[50%] translate-y-[-50%] text-center left-0 right-0">
          <h1
            className={`${
              agency.className
            } text-3xl md:text-6xl font-medium tracking-[1px] text-(--blue) pb-10`}
          >
            {headerInfo.name}
          </h1>
        </div>
        <picture className="h-[400px] lg:h-[70vh] block overflow-hidden">
          <source
            media="(max-width: 768px)"
            srcSet={pageData?.files?.mobile_file}
          />
          <img
            className="w-full object-cover h-full"
            src={pageData?.files?.desktop_file}
            alt="Project Hero Image"
          />
        </picture>
      </div>
      {/* <div
        data-cursor="light"
        className="border-b border-(--blue)/10 py-6 lg:py-20"
      >
        <div className="app-container flex flex-col gap-y-4 lg:gap-y-8 text-center">
          <div className="flex justify-center items-center gap-x-2">
            <Image
              src={"/images/about/about-page-banner-bottom.png"}
              alt="icon"
              width={25}
              height={25}
              className="w-[18px] lg:w-[25px]"
            />
            <p
              className={`${blauerNue.className} text-sm tracking-[0.25em] uppercase text-(--blue)/50`}
            >
              Projects
            </p>
          </div>

          <h1
            className={`${
              agency.className
            } text-2xl md:text-6xl font-medium tracking-[1px] text-(--blue)`}
          >
            {headerInfo.name}
          </h1>
          <p
            className={`${blauerNue.className} max-w-xl font-light mx-auto text-(--blue)/60 leading-7`}
          >
            {headerInfo.description}
          </p>
        </div>
      </div> */}

      <div className="pb-16 -mt-20 relative z-2">
        <LocationProjectContainer
          location={location || ""}
          initialProjects={projectsList}
          initialCities={apiCities}
          initialStatuses={statusData}
          initialPagination={paginationData}
        />
      </div>
    </div>
  );
}
