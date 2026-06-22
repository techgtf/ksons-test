import { agency, blauerNue } from "@/src/app/fonts";
import { locationProjectsData } from "@/src/website/components/home/homeLocations/locationData";
import Image from "next/image";
import LocationProjectContainer from "@/src/website/components/locationsProject/LocationProjectContainer";

export default async function LocationPage({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string }>;
}) {
  const { loc } = await searchParams;

  // Find location data from the locationData configuration if loc exists
  const locList = loc ? loc.split(",").map((l) => l.trim().toLowerCase()) : [];

  const selectedLocations = locationProjectsData.filter((l) =>
    locList.includes(l.name.toLowerCase()),
  );

  // Default header info if no specific location is provided
  const headerInfo = {
    name:
      selectedLocations.length === 1
        ? selectedLocations[0].name
        : selectedLocations.length > 1
          ? "Selected Locations"
          : "Discover Locations",
    description:
      selectedLocations.length === 1
        ? `Explore premium residential, township and commercial developments thoughtfully crafted across ${selectedLocations[0].name}.`
        : selectedLocations.length > 1
          ? `Explore our premium developments across ${selectedLocations.map((l) => l.name).join(", ")}.`
          : "Explore our premium residential, township, and commercial developments by selecting your preferred locations.",
  };

  return (
    <div
      className="location-page pt-20 bg-[linear-gradient(180deg,rgba(51,211,238,0.07)_0%,rgba(15,60,120,0.07)_100%)]
    "
    >
      <div
        data-cursor="light"
        className="border-b border-(--blue)/10 py-6 lg:py-20"
      >
        <div className="app-container flex flex-col gap-y-4 lg:gap-y-8 text-center">
          <div className="flex justify-center items-center gap-x-2">
            <Image
              // ref={iconRef}
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
      </div>

      <LocationProjectContainer loc={loc || ""} />
    </div>
  );
}
