export interface SectionHeader {
  title: string;
  description: string;
}

export interface MicroOverView extends SectionHeader {
  long_description?: string;
  address: string;
  area: string;
  status: string;
  typology: string;
}
export interface MicroHighlights extends SectionHeader {
  list: {
    icons: string;
    name: string;
  }[];
}

export interface MicroSpecification extends SectionHeader {
  listing: {
    title: string;
    children: {
      title: string;
      short_description: string;
    }[];
  }[];
}

export interface PlanTypes {
  title: string;
  id: string;
}

export interface PlanContent {
  id?: string;
  title?: string;
  image?: string;
  thumbnail?: string;
}

export interface MicroFloorAndMasterPlan extends SectionHeader {
  planTypes: PlanTypes[];
  masterPlan: PlanContent;
  floorPlans: PlanContent[];
}

export interface MicroLocation extends SectionHeader {
  desktop_file: string;
  mobile_file: string;
  iframe?: string;
  location_data: {
    heading: string;
    description: string;
    list: {
      icons: string;
      name: string;
      time: string;
      type: "walk" | "drive";
    }[];
  };
}
export interface GalleryItem {
  title: string;
  desktop_file: string;
  mobile_file: string;
}
export interface MicroGallery extends SectionHeader {
  long_description: string;
  gallery: GalleryItem[];
}

export interface MicroAmenitiesTypes {
  title: string;
  mobile_image: string;
  desktop_image: string;
  icon: string;
}

export interface MicroAmenities extends SectionHeader {
  list: MicroAmenitiesTypes[];
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  cityName?: string;
  year: number;
  price?: number;
  area: string;
  desktop_file: string;
  mobile_file: string;
  featured_img?: string;
  featured?: boolean;
  typology?: string;
  status?: "completed" | "delivered" | "ongoing" | "upcoming" | "new launch";
  short_description?: string;
  featuredLabel?: string;
  mainLabel?: string;
  // overview?: MicroOverView;
  highlights?: MicroHighlights;
  specifications?: MicroSpecification;
  floorAndMasterPlan?: MicroFloorAndMasterPlan;
  microLocation?: MicroLocation;
  microGallery?: MicroGallery;
  microAmenities?: MicroAmenities;
  seo?: SEO;
};

export type SEO = {
  title: string;
  keywords: string;
  description: string;
  alternates: {
    canonical: string;
  };
};

export type Category = {
  id?: string;
  slug: string;
  label: string;
  // tagline: string;
  hasFutureExtention?: boolean;
  projects: Project[];
  bannerData: {
    tag?: string;
    heading?: string;
    description?: string;
    bulletIcon?: string;
    files: {
      featured_desktop_file: string;
      featured_mobile_file: string;
      desktop_file: string;
      mobile_file: string;
      featuedLabel?: string;
    };
    headingArea?: string;
    peraArea?: string;
  };
  seo?: SEO;
};

export const categories: Category[] = [
  {
    slug: "residential",
    label: "Residential",
    hasFutureExtention: true,
    bannerData: {
      tag: "Residential projects",
      heading:
        "Homes Beyond Walls—Where Every Space Tells a Story of Legacy and Living",
      description: "Homes That Live, Breathe, and Endure.",
      files: {
        featured_desktop_file:
          "/images/projects/residential/indraprastha-enclave/hero.webp",
        featured_mobile_file:
          "/images/projects/residential/indraprastha-enclave/hero.webp",
        desktop_file: "/images/projects/residential/hero.webp",
        mobile_file: "/images/projects/residential/hero.webp",
      },
      headingArea: "lg:w-[850px]",
    },
    projects: [
      {
        id: "res-001",
        title: "Indraprastha Enclave",
        description: `Indraprastha Enclave was the group’s first independent residential colony in
            Mathura, a foundational project that translated decades of land expertise and
            business discipline into structured, ground-up real estate delivery. The colony
            established K.sons’ credibility as a developer capable of planned execution and
            dependable handover, setting the tone for every project that followed.`,
        location: "Mathura",
        year: 2001 - 2004,
        price: 7000000,
        area: "",
        featured_img:
          "/images/projects/residential/indraprastha-enclave/featured-img.webp",
        desktop_file:
          "/images/projects/residential/indraprastha-enclave/hero.webp",
        mobile_file:
          "/images/projects/residential/indraprastha-enclave/hero.webp",
        featured: true,
        slug: "indraprastha-enclave",
        status: "delivered",
        typology: "Residential Colony",
        seo: {
          title: "Indraprastha Enclave: Premium Residential Colony in Mathura",
          keywords:
            "Indraprastha Enclave Mathura, K.Sons Group, residential projects Mathura, premium homes Mathura, independent colony Mathura, K.Sons real estate",
          description:
            "Explore Indraprastha Enclave by K.Sons in Mathura – the group’s foundational residential project combining legacy, expertise, and quality homes.",
          alternates: {
            canonical:
              "https://ksonsgroup.com/residential/indraprastha-enclave",
          },
        },
      },
      {
        id: "res-002",
        title: "NRI Greens",
        description: `A compact, high-density residential development thoughtfully designed for
            NRIs, working professionals and small families seeking a secure and
            dependable address in Mathura. Spread across 8.3 acres, within a gated
            environment supported by 24×7 security, power backup, covered parking
            and essential community infrastructure, delivering convenience, clarity of
            format and low-maintenance living.`,
        location: "Vrindavan",
        year: 2009 - 2014,
        price: 10000000,
        area: "8.3 Acres",
        featured_img:
          "/images/projects/residential/nri-greens/featured-img.webp",
        desktop_file: "/images/projects/residential/nri-greens/hero.webp",
        mobile_file: "/images/projects/residential/nri-greens/hero.webp",
        slug: "nri-greens",
        status: "delivered",
        typology: "Studio Apartments, 1 & 2 BHK Residences",
        seo: {
          title: "NRI Greens: K.Sons Group Residential Projects in Mathura",
          keywords:
            "NRI Greens Mathura, K.Sons Group, residential projects Mathura, NRI homes Mathura, premium apartments Mathura, secure residential address, K.Sons real estate, small family homes Mathura, high-density housing Mathura",
          description:
            "NRI Greens by K.Sons Group is a secure, high-density residential project in Mathura, ideal for NRIs, professionals, and small families.",
          alternates: {
            canonical: "https://ksonsgroup.com/residential/nri-greens",
          },
        },
      },
      {
        id: "res-003",
        title: "Radha Florence",
        description: `A villa-led residential development spread across 25 acres in Vrindavan, Radha Florence is envisioned around a distinctive Italian architectural theme, bringing classical design sensibilities and spacious planning into a serene residential setting. The project offers simplex and duplex villas along with residential plots, designed within a thoughtfully structured community layout. Amenities include a clubhouse, swimming pool, sports facilities and landscaped greens, complemented by close proximity to Vrindavan’s key
        spiritual landmarks, creating a refined environment for spacious and independent living.`,
        location: "Vrindavan",
        year: 2010 - 2015,
        area: "25 Acres",
        featured_img:
          "/images/projects/residential/radha-florence/featured-img.webp",
        desktop_file: "/images/projects/residential/radha-florence/hero.webp",
        mobile_file: "/images/projects/residential/radha-florence/hero.webp",
        slug: "radha-florence",
        status: "delivered",
        typology: "Plots, Simplex & Duplex Villas",
        seo: {
          title: "Radha Florence: K.Sons Group Villas & Plots Vrindavan",
          keywords:
            "Radha Florence Vrindavan, K.Sons Group, plots in Vrindavan, simplex villas Vrindavan, duplex villas Vrindavan, residential plots, premium villas, K.Sons real estate, delivered villas Vrindavan",
          description:
            "Explore Radha Florence by K.Sons Group in Vrindavan – 25 acres of delivered plots, simplex & duplex villas offering premium residential living.",
          alternates: {
            canonical: "https://ksonsgroup.com/residential/radha-florence",
          },
        },
      },
    ],
    seo: {
      title: "K.Sons Group Residential – Vrindavan Homes & Apartments",
      keywords:
        "K.Sons Group residential, villas Vrindavan, apartments Mathura, residential plots, K.Sons real estate, premium homes Vrindavan, Mathura housing projects, independent houses, simplex villas, duplex villas, integrated residential township",
      description:
        "Explore premium residential projects by K.Sons Group in Vrindavan. Quality homes designed with credibility, foresight, and timeless living spaces.",
      alternates: {
        canonical: "https://ksonsgroup.com/residential",
      },
    },
  },
  {
    slug: "commercial",
    label: "Commercial",
    hasFutureExtention: true,
    bannerData: {
      tag: "Commercial projects",
      // heading:"Pioneering Spaces for Visionaries—Where Ambition Meets Infrastructure, and Success Finds Its Home.",
      heading: "Pioneering Spaces for Visionaries—Where Ambition Meets Success",
      description: "Innovative Spaces That Inspire Growth, Drive Success.",
      files: {
        featured_desktop_file: "/images/home/project-slider/commercial.webp",
        featured_mobile_file: "/images/home/project-slider/commercial-mb.webp",
        desktop_file: "/images/projects/commercial/hero.webp",
        mobile_file: "/images/projects/commercial/hero.webp",
      },
      headingArea: "lg:w-[850px]",
    },
    projects: [
      {
        id: "com-001",
        title: "Courtyard Mall",
        description: `Courtyard Mall is a 2-acre mixed-use development in Vrindavan, integrating
            organised retail, office spaces and studio residences within a single,
            well-planned ecosystem. Designed to serve both the region’s growing visitor
            economy and its expanding residential demand, the project blends
            commercial vitality with hospitality-led living.`,
        location: "Rukmani Vihar",
        year: 2024,
        area: "2 Acres",
        featured_img:
          "/images/projects/commercial/courtyard-mall/featured-img.webp",
        desktop_file: "/images/projects/commercial/hero.webp",
        mobile_file: "/images/projects/commercial/hero.webp",
        featured: true,
        slug: "courtyard-mall",
        status: "ongoing",
        typology: "Mixed-Use Development, Commercial & Studios",
        seo: {
          title: "Courtyard Mall – K.Sons Group Commercial Project Vrindavan",
          keywords:
            "Courtyard Mall Vrindavan, K.Sons Group commercial, mixed-use development Vrindavan, commercial & studio spaces, business properties Vrindavan, K.Sons real estate, ongoing commercial project",
          description:
            "Discover Courtyard Mall by K.Sons Group in Vrindavan – a 2-acre mixed-use commercial and studio development, designed for modern businesses and ongoing construction.",
          alternates: {
            canonical: "https://ksonsgroup.com/commercial/courtyard-mall",
          },
        },
        highlights: {
          title: "Highlights",
          description:
            "Discover the Core of Vrindavan’s Most Anticipated Destination.",
          list: [
            {
              icons: "/images/projects/highlights/multiplex.svg",
              name: "Vrindavan’s First Multiplex",
            },
            {
              icons: "/images/projects/highlights/retail.svg",
              name: "Premier Retail Experience",
            },
            {
              icons: "/images/projects/highlights/dining.svg",
              name: "Exclusive Dining Options",
            },
            {
              icons: "/images/projects/highlights/hall.svg",
              name: "Modern Leisure & Events Spaces",
            },
            {
              icons: "/images/projects/highlights/location.svg",
              name: "Strategic Location Advantage",
            },
          ],
        },
        specifications: {
          title: "Specifications",
          description:
            "Crafted to Perfection, Designed for Tomorrow—Where Every Detail Speaks of Excellence.",
          listing: [
            {
              title: "infrastructure",
              children: [
                {
                  title: "Structure",
                  short_description:
                    "Strong RCC framed structure for high footfall.",
                },
                {
                  title: "Landscape",
                  short_description:
                    "Modern landscaping with inviting greenery.",
                },
                {
                  title: "Planning",
                  short_description: "Optimized for retail and customer flow.",
                },
              ],
            },
            // {
            //   title: "Walls & Ceilings",
            //   children: [
            //     {
            //       title: "External Walls",
            //       short_description: "Durable texture paint & cladding.",
            //     },
            //     {
            //       title: "Ceiling",
            //       short_description:
            //         "False ceilings with acrylic emulsion paint.",
            //     },
            //     {
            //       title: "Kitchen",
            //       short_description:
            //         "Ceramic tiles for functionality and style.",
            //     },
            //   ],
            // },
            // {
            //   title: "Flooring",
            //   children: [
            //     {
            //       title: "Living/Dining/Lobby/Kitchen",
            //       short_description:
            //         "Polished marble flooring for high traffic.",
            //     },
            //     {
            //       title: "Ground Floor Bedrooms",
            //       short_description: "Marble flooring for sophistication.",
            //     },
            //     {
            //       title: "Other Bedrooms",
            //       short_description:
            //         "Engineered hardwood flooring for durability.",
            //     },
            //   ],
            // },
          ],
        },
        microAmenities: {
          title: "Amenities",
          description:
            "Where Comfort Meets Convenience—Every Amenity, Thoughtfully Crafted.",
          list: [
            {
              title: "Multiplex",
              icon: "/images/amenities/icons/multiplex.svg",
              desktop_image: "/images/amenities/images/multiplex.jpg",
              mobile_image: "/images/amenities/images/multiplex.jpg",
            },
            {
              title: "Food Court",
              icon: "/images/amenities/icons/food-court.svg",
              desktop_image: "/images/amenities/images/food-court.jpg",
              mobile_image: "/images/amenities/images/food-court.jpg",
            },
            {
              title: "Kids Fun Zone",
              icon: "/images/amenities/icons/kids-play-area.svg",
              desktop_image: "/images/amenities/images/kid-fun-zone.jpg",
              mobile_image: "/images/amenities/images/kid-fun-zone.jpg",
            },
            {
              title: "Shops",
              icon: "/images/amenities/icons/shop.svg",
              desktop_image: "/images/amenities/images/shop.jpg",
              mobile_image: "/images/amenities/images/shop.jpg",
            },
          ],
        },
        floorAndMasterPlan: {
          title: "Master & Floor Plan",
          description:
            "Blueprints of Possibility—Designing Spaces for a Future that Fits.",
          planTypes: [
            {
              title: "Master Plan",
              id: "master-plan",
            },
            {
              title: "Floor Plan",
              id: "floor-plan",
            },
          ],
          masterPlan: {},
          floorPlans: [],
        },
        microLocation: {
          title: "Location",
          description:
            "At the Heart of It All—Where Connectivity Meets Serenity.",
          desktop_file: "",
          mobile_file: "",
          iframe:
            '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.5846588935146!2d77.6273487!3d27.5753979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973713fea79469b%3A0x1a3eb0534fea4496!2sSUNBEAM%20REAL%20ESTATE%20%7C%20Vrindavan!5e0!3m2!1sen!2sin!4v1780393501051!5m2!1sen!2sin" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          location_data: {
            heading: "Location Advantages",
            description:
              "Where Convenience Meets Culture—Connecting You to the Heart of Vrindavan.",
            list: [
              {
                icons: "/images/projects/expressway.svg",
                name: "Yamuna Expressway",
                time: "10 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Prem Temple",
                time: "1 Min",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Chandrodaya Temple",
                time: "1 Min",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "ISKCON Temple",
                time: "2 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/road.svg",
                name: "Chhatikara Mor",
                time: "7 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Banke Bihari Temple",
                time: "10 Mins",
                type: "drive",
              },
              // walk
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "Prem Temple",
              //   time: "5 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "Chandrodaya Temple",
              //   time: "5 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "ISKCON Temple",
              //   time: "12 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/road.svg",
              //   name: "Chhatikara Mor",
              //   time: "15 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "Banke Bihari Temple",
              //   time: "20 Mins",
              //   type: "walk",
              // },
            ],
          },
        },
        microGallery: {
          title: "Gallery",
          description: "See the Vision, Experience the Legacy.",
          long_description:
            "Step into a visual journey where each image brings our vision to life, showcasing the artistry and precision behind every space we create.",
          gallery: [
            {
              title: "Gallery 1",
              desktop_file:
                "/images/projects/commercial/courtyard-mall/gallery/1.jpg",
              mobile_file:
                "/images/projects/commercial/courtyard-mall/gallery/1.jpg",
            },
            {
              title: "Gallery 2",
              desktop_file:
                "/images/projects/commercial/courtyard-mall/gallery/2.jpg",
              mobile_file:
                "/images/projects/commercial/courtyard-mall/gallery/2.jpg",
            },
            {
              title: "Gallery 3",
              desktop_file:
                "/images/projects/commercial/courtyard-mall/gallery/3.jpg",
              mobile_file:
                "/images/projects/commercial/courtyard-mall/gallery/3.jpg",
            },
            {
              title: "Gallery 4",
              desktop_file:
                "/images/projects/commercial/courtyard-mall/gallery/4.jpg",
              mobile_file:
                "/images/projects/commercial/courtyard-mall/gallery/4.jpg",
            },
          ],
        },
      },
    ],
    seo: {
      title: "K.Sons Group: Commercial Properties in Mathura, Vrindavan",
      keywords:
        "K.Sons Group commercial, commercial properties Vrindavan, office spaces Vrindavan, premium commercial projects, business properties Vrindavan, K.Sons real estate, Vrindavan commercial buildings, commercial development",
      description:
        "Explore premium commercial projects by K.Sons Group in Vrindavan, offering thoughtfully designed spaces for businesses with credibility and foresight.",
      alternates: {
        canonical: "https://ksonsgroup.com/commercial",
      },
    },
  },
  {
    slug: "hospitality",
    label: "Hospitality",
    hasFutureExtention: true,
    bannerData: {
      tag: "Hospitality projects",
      heading:
        "Where Every Stay Transcends the Ordinary and Every Moment Feels Like Home",
      description:
        "Where Luxury Meets Tranquility, Every Stay a Lasting Experience.",
      files: {
        featured_desktop_file: "/images/home/project-slider/hospitality.webp",
        featured_mobile_file: "/images/home/project-slider/hospitality-mb.webp",
        desktop_file: "/images/projects/hospitality/hero.webp",
        mobile_file: "/images/projects/hospitality/hero.webp",
      },
      headingArea: "lg:w-[850px]",
    },
    projects: [
      {
        id: "hos-001",
        title: "Brij Vasundhara",
        description: `Brij Vasundhara Resort & Spa is a distinctive resort-led residential destination spread across 26.32 acres near the sacred Govardhan Parikrama Marg. Designed
      around the idea of leisure, holiday living and second homes, the development
      blends hospitality-style amenities with a serene residential environment. The
      project features luxury cottage clusters, a multi-cuisine restaurant, spa, swimming
      pool, clubhouse, temple, jogging tracks and banquet facilities, creating a complete
      retreat for relaxation and rejuvenation. The development has also been
      recognised with a CRISIL- rated assessment, reflecting its credibility and quality
      standards. Over the years, it has emerged as one of the Braj region’s most
      recognised resort and second-home communities.`,
        location: "Govardhan, Mathura",
        year: 2002,
        area: "26.32 Acres",
        featured_img:
          "/images/projects/hospitality/brij-vasundhara/featured-img.webp",
        desktop_file: "/images/projects/hospitality/brij-vasundhara/hero.webp",
        mobile_file: "/images/projects/hospitality/brij-vasundhara/hero.webp",
        slug: "brij-vasundhara",
        status: "delivered",
        typology: "Resort & Holiday Living, Second Homes",
        short_description:
          "A refined 150-acre villa community designed for privacy, space and elevated living. Located on Govardhan Road.",
        seo: {
          title: "Brij Vasundhara – K.Sons Group Hospitality, Govardhan",
          keywords:
            "Brij Vasundhara Govardhan, K.Sons Group hospitality, MVDA township, Govind Vihar Avasiya Yojna, premium resorts Mathura, integrated township lodging",
          description:
            "Discover Brij Vasundhara by K.Sons Group in Govardhan, Mathura – a premium hospitality project within the MVDA integrated township under the Land Pooling Scheme.",
          alternates: {
            canonical: "https://ksonsgroup.com/hospitality/brij-vasundhara",
          },
        },
      },
    ],
    seo: {
      title: "K.Sons Group Hospitality – Premium Stays & Properties",
      keywords:
        "K.Sons Group hospitality, premium hotels Vrindavan, resorts Mathura, integrated township hospitality, lodging and stays, K.Sons real estate",
      description:
        "Explore K.Sons Group hospitality offerings in Vrindavan and Mathura, featuring premium stays, resorts, and integrated township properties.",
      alternates: {
        canonical: "https://ksonsgroup.com/hospitality",
      },
    },
  },
  {
    slug: "township",
    label: "Township",
    hasFutureExtention: true,
    bannerData: {
      tag: "Township projects",
      heading:
        "A Place Where Communities Thrive, Legacies Are Created, and Every Corner Speaks",
      description: "Where Communities Flourish, Futures Are Built to Last.",
      files: {
        featured_desktop_file: "/images/home/project-slider/township.webp",
        featured_mobile_file: "/images/home/project-slider/township-mb.webp",
        desktop_file: "/images/projects/township/hero.webp",
        mobile_file: "/images/projects/township/hero.webp",
      },
      headingArea: "lg:w-[850px]",
    },
    projects: [
      {
        id: "res-001",
        title: "Vasudev Elements",
        description: `Vasudev Elements is a thoughtfully planned 17-acre integrated township in Sunrakh Bangar, one of Vrindavan’s fastest-growing corridors. The development brings together villas, residential plots, commercial spaces and group housing within a structured master plan designed for a balanced community environment. Strategically located near Prem Mandir and ISKCON, it is aligned with upcoming expressway connectivity. The project combines spiritual proximity with strong regional access, offering a well-planned, secure living ecosystem in the expanding
        Vrindavan landscape.`,
        location: "Sunrakh Road, Vrindavan",
        year: 2023,
        area: "17 Acres",
        featured_img:
          "/images/projects/township/vasudev-elements/featured-img.webp",
        desktop_file: "/images/projects/township/vasudev-elements/hero.webp",
        mobile_file: "/images/projects/township/vasudev-elements/hero.webp",
        featured: true,
        slug: "vasudev-elements",
        status: "ongoing",
        typology: "Plots, Villas, Commercial & Group Housing",
        short_description:
          "A refined 150-acre villa community designed for privacy, space and elevated living. Located on Govardhan Road.",
        seo: {
          title: "Vasudev Elements – K.Sons Group Township Vrindavan",
          keywords:
            "Vasudev Elements Vrindavan, K.Sons Group township, 17-acre integrated township, plots, villas, commercial, group housing",
          description:
            "Vasudev Elements by K.Sons Group is a 17-acre integrated township in Sunrakh Bangar, Vrindavan, featuring plots, villas, commercial & group housing.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/vasudev-elements",
          },
        },
        highlights: {
          title: "Highlights",
          description:
            "Where Vision Meets Reality—Vasudev Elements: A Legacy of Modern Living.",
          list: [
            {
              icons: "/images/projects/highlights/approved.svg",
              name: "RERA Registered Residential Plot Community",
            },
            {
              icons: "/images/projects/highlights/plots.svg",
              name: "Wide Range of Plot Sizes ",
            },
            {
              icons: "/images/projects/highlights/location.svg",
              name: "Prime Location Of Vrindavan",
            },
            {
              icons: "/images/projects/highlights/water.svg",
              name: "24×7 Water Supply & Electrification",
            },
            {
              icons: "/images/projects/highlights/infrastructure.svg",
              name: "Sewage Treatment & Modern Infrastructure Elements",
            },
          ],
        },
        specifications: {
          title: "Specifications",
          description:
            "Precision in Every Corner—Built to Endure, Crafted to Inspire.",
          listing: [
            {
              title: "infrastructure",
              children: [
                {
                  title: "Structure",
                  short_description:
                    "Earthquake-resistant RCC framed structure.",
                },
                {
                  title: "Landscape",
                  short_description:
                    "Designed softscape with sustainable flora",
                },
                {
                  title: "Planning",
                  short_description:
                    "Vastu-compliant layout for harmonious living.",
                },
              ],
            },
            {
              title: "Walls & Ceilings",
              children: [
                {
                  title: "External Walls",
                  short_description: "Texture paint & cladding for durability.",
                },
                {
                  title: "Ceiling",
                  short_description:
                    "False ceilings with acrylic emulsion paint.",
                },
                {
                  title: "Kitchen",
                  short_description: "Dado ceramic tiles as per design.",
                },
              ],
            },
            {
              title: "Flooring",
              children: [
                {
                  title: "Living/Dining/Lobby/Kitchen",
                  short_description: "Marble flooring for elegance.",
                },
                {
                  title: "Ground Floor Bedrooms",
                  short_description: "Marble flooring for luxury.",
                },
                {
                  title: "Other Bedrooms",
                  short_description: "Engineered hardwood flooring.",
                },
              ],
            },
          ],
        },
        microAmenities: {
          title: "Amenities",
          description:
            "Beyond the Basics—A World of Amenities, Designed for You.",
          list: [
            {
              title: "Clubhouse",
              icon: "/images/amenities/icons/clubhouse.svg",
              desktop_image: "/images/amenities/images/clubhouse.jpg",
              mobile_image: "/images/amenities/images/clubhouse.jpg",
            },
            {
              title: "Swimming Pool",
              icon: "/images/amenities/icons/swimming-pool.svg",
              desktop_image: "/images/amenities/images/swimming-pool.jpg",
              mobile_image: "/images/amenities/images/swimming-pool.jpg",
            },
            {
              title: "Fully Equipped Gym",
              icon: "/images/amenities/icons/gym.svg",
              desktop_image: "/images/amenities/images/fitness-centers.jpg",
              mobile_image: "/images/amenities/images/fitness-centers.jpg",
            },
            {
              title: "Community Hall",
              icon: "/images/amenities/icons/hall.svg",
              desktop_image: "/images/amenities/images/banquet-halls.jpg",
              mobile_image: "/images/amenities/images/banquet-halls.jpg",
            },
            {
              title: "Mini Theatre",
              icon: "/images/amenities/icons/multiplex.svg",
              desktop_image: "/images/amenities/images/multiplex.jpg",
              mobile_image: "/images/amenities/images/multiplex.jpg",
            },
            {
              title: "Yoga Room",
              icon: "/images/amenities/icons/fitness.svg",
              desktop_image: "/images/amenities/images/yoga-room.jpg",
              mobile_image: "/images/amenities/images/yoga-room.jpg",
            },
            {
              title: "Garden",
              icon: "/images/amenities/icons/garden.svg",
              desktop_image: "/images/amenities/images/garden.jpg",
              mobile_image: "/images/amenities/images/garden.jpg",
            },
            {
              title: "Badminton Court",
              icon: "/images/amenities/icons/badminton.svg",
              desktop_image: "/images/amenities/images/badminton.jpg",
              mobile_image: "/images/amenities/images/badminton.jpg",
            },
            {
              title: "Children Playing Zone",
              icon: "/images/amenities/icons/kids-play-area.svg",
              desktop_image: "/images/amenities/images/kids-area.jpg",
              mobile_image: "/images/amenities/images/kids-area.jpg",
            },
            {
              title: "Indoor Games Room",
              icon: "/images/amenities/icons/indoor-games.svg",
              desktop_image: "/images/amenities/images/indoor-game.jpg",
              mobile_image: "/images/amenities/images/indoor-game.jpg",
            },
          ],
        },
        floorAndMasterPlan: {
          title: "Master & Floor Plan",
          description:
            "Spaces That Speak to You—Blueprints Designed for Every Dream.",
          planTypes: [
            {
              title: "Master Plan",
              id: "master-plan",
            },
            {
              title: "Floor Plan",
              id: "floor-plan",
            },
          ],
          masterPlan: {},
          floorPlans: [],
        },
        microLocation: {
          title: "Location",
          description:
            "Where Spirituality Meets Convenience—Perfectly Positioned for Peace and Prosperity.",
          desktop_file: "",
          mobile_file: "",
          iframe:
            '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.432705677628!2d77.6488074!3d27.5801114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397371eba2e090af%3A0xc7c1f3e967c39d47!2sVasudev%20Elements!5e0!3m2!1sen!2sin!4v1777551487605!5m2!1sen!2sin" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          location_data: {
            heading: "Location Advantages",
            description:
              "Where Spirituality Meets Convenience—Everything You Need, Right Around the Corner.",
            list: [
              {
                icons: "/images/projects/expressway.svg",
                name: "Yamuna Expressway",
                time: "15 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Prem Mandir",
                time: "12 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "ISKCON Temple",
                time: "12 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Banke Bihari Temple",
                time: "15 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/train.svg",
                name: "Mathura Railway Station",
                time: "30 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/bus.svg",
                name: "Vrindavan Bus Stand",
                time: "15 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Krishna Janmabhoomi (Mathura)",
                time: "25 Mins",
                type: "drive",
              },
              // walk
              // {
              //   icons: "/images/projects/market.svg",
              //   name: "Local Market (Sunrakh Bangar)",
              //   time: "12 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/kund.svg",
              //   name: "Radha Kund",
              //   time: "30 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/road.svg",
              //   name: "Chhatikara Mor",
              //   time: "35 Mins",
              //   type: "walk",
              // },
            ],
          },
        },
        microGallery: {
          title: "Gallery",
          description:
            "Experience the Future in Every Frame—See the Vision, Live the Legacy.",
          long_description:
            "Walk through a collection of visual stories—where every image captures the essence of modern living, elegance, and comfort.",
          gallery: [
            {
              title: "Gallery 1",
              desktop_file:
                "/images/projects/township/vasudev-elements/gallery/g1.webp",
              mobile_file:
                "/images/projects/township/vasudev-elements/gallery/g1.webp",
            },
          ],
        },
      },
      {
        id: "res-002",
        title: "Gulmohar Township",
        description: `A refined 150-acre villa community designed for privacy, space and elevated
        living. Located on Govardhan Road, just minutes from central Mathura, it offers
        a serene yet well-connected address. Expansive villa plots feature rooftop
        lounges, provisions for a home theatre and landscaped greens, supported by
        24×7 infrastructure and vastu-aligned planning. A private lifestyle where
        everyday conveniences remain effortlessly within reach.`,
        location: "Govardhan, Mathura",
        year: 2023,
        area: "150 Acres",
        featured_img:
          "/images/projects/township/gulmohar-township/featured-img.webp",
        desktop_file: "/images/projects/township/gulmohar-township/hero.webp",
        mobile_file: "/images/projects/township/gulmohar-township/hero.webp",
        featured: true,
        slug: "gulmohar-township",
        status: "delivered",
        typology: "4 Bhk Villas, Plots, Commercial",
        seo: {
          title: "Gulmohar Township – K.Sons Group Villas Mathura",
          keywords:
            "Gulmohar Township Mathura, K.Sons Group villas, 150-acre villa community, private residences Mathura, integrated township",
          description:
            "Gulmohar Township by K.Sons Group is a 150-acre villa community on Govardhan Road, Mathura, designed for privacy, space, and elevated living.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/gulmohar-township",
          },
        },
      },
      {
        id: "res-003",
        title: "Radha Golf",
        description: `The first and only residential development in the Braj region with an integrated golf course. Spread across 100 acres near Govardhan, Radha Golf offers 2 and 3 BHK villas alongside residential plots, supported by a clubhouse, swimming pool, sports facilities and landscaped greens. A lifestyle township where spirituality meets leisure.`,
        location: "NH-2, Agra-Mathura Highway",
        year: 2023,
        area: "100 Acres",
        price: 7000000,
        featured_img: "/images/projects/township/radha-golf/featured-img.webp",
        desktop_file: "/images/projects/township/radha-golf/hero.webp",
        mobile_file: "/images/projects/township/radha-golf/hero.webp",
        featured: true,
        slug: "radha-golf",
        status: "delivered",
        typology: "2 & 3 BHK Villas, Plots",
        seo: {
          title: "Radha Golf Township – K.Sons Group Mathura",
          keywords:
            "Radha Golf Mathura, K.Sons Group township, integrated living, NH-2 residential project, Krishna Janmabhoomi area",
          description:
            "Radha Golf by K.Sons Group is an integrated township on NH-2 near Krishna Janmabhoomi Temple, Mathura, offering structured residential living.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/radha-golf",
          },
        },
      },
      {
        id: "res-004",
        title: "Radha Valley",
        description: `The township that introduced structured, integrated living to Mathura.
            Strategically located on NH-2 near the Krishna Janmabhoomi Temple, Shri
            Radha Valley spans 67 acres of thoughtfully planned living. With diverse
            residences, 12 zodiac-inspired gardens, a 20-acre green expanse and everyday
            essentials including a school, temple, shopping complex, clubhouse and
            gymnasium, it offers a complete living ecosystem`,
        location: "NH-2, Agra-Mathura Highway",
        year: 2009 - 2017,
        area: "67 Acres",
        featured_img:
          "/images/projects/township/radha-valley/featured-img.webp",
        desktop_file: "/images/projects/township/radha-valley/hero.webp",
        mobile_file: "/images/projects/township/radha-valley/hero.webp",
        featured: true,
        slug: "radha-valley",
        status: "delivered",
        typology: "4 BHK Residences, Penthouses, Bungalows, Studios & Plots",
        seo: {
          title: "Radha Valley – K.Sons Group Residential Township Mathura",
          keywords:
            "Radha Valley Mathura, K.Sons Group township, NH-2 residential project, 4 BHK, penthouses, villas, studios, plots",
          description:
            "Radha Valley by K.Sons Group is a structured township on NH-2 near Krishna Janmabhoomi, Mathura, featuring 4 BHK residences, penthouses, villas, studios, and plots.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/radha-valley",
          },
        },
      },
      {
        id: "res-005",
        title: "Eternity 2",
        description: `Planned as a complete, self-sustained ecosystem, Eternity 2 is a 101-acre
            integrated township in the Mathura–Vrindavan region. Envisioned as a
            thoughtfully structured community where living, commerce and everyday
            conveniences come together within one cohesive master plan, the
            development brings together plots, villas, commercial spaces, studio
            residences and group housing designed for contemporary living.`,
        location: "Vrindavan",
        year: 2025,
        area: "101 Acres",
        price: 60000000,
        featured_img: "/images/projects/township/eternity-2/featured-img.webp",
        desktop_file: "/images/projects/township/eternity-2/hero.webp",
        mobile_file: "/images/projects/township/eternity-2/hero.webp",
        featured: true,
        slug: "eternity-2",
        status: "ongoing",
        typology: "Plots, Villas, Commercial, Studios & Group Housing",
        seo: {
          title:
            "Eternity 2 – K.Sons Group Integrated Township Mathura-Vrindavan",
          keywords:
            "Eternity 2 Mathura-Vrindavan, K.Sons Group township, 101-acre integrated township, plots, villas, studios, group housing, commercial spaces",
          description:
            "Eternity 2 by K.Sons Group is a 101-acre integrated township in Mathura–Vrindavan with plots, villas, studios, group housing, and commercial spaces.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/eternity-2",
          },
        },
        highlights: {
          title: "Highlights",
          description:
            "Where Every Moment Is a Milestone—Your Gateway to Future-Ready Living.",
          // no information available
          list: [
            {
              icons: "/images/projects/highlights/approved.svg",
              name: "RERA Registered Residential Plot Community",
            },
            {
              icons: "/images/projects/highlights/plots.svg",
              name: "Wide Range of Plot Sizes ",
            },
            {
              icons: "/images/projects/highlights/location.svg",
              name: "Prime Location Of Vrindavan",
            },
            {
              icons: "/images/projects/highlights/water.svg",
              name: "24×7 Water Supply & Electrification",
            },
            {
              icons: "/images/projects/highlights/infrastructure.svg",
              name: "Sewage Treatment & Modern Infrastructure Elements",
            },
          ],
        },
        specifications: {
          title: "Specifications",
          description:
            "Crafting the Future, One Detail at a Time—Specifications That Stand the Test of Time.",
          listing: [
            {
              title: "infrastructure",
              children: [
                {
                  title: "Structure",
                  short_description:
                    "Earthquake-resistant RCC framed structure.",
                },
                {
                  title: "Landscape",
                  short_description:
                    "Well-maintained landscape with decorative flora.",
                },
                {
                  title: "Planning",
                  short_description:
                    "Vastu-compliant design for guest comfort.",
                },
              ],
            },
            {
              title: "Walls & Ceilings",
              children: [
                {
                  title: "External Walls",
                  short_description:
                    "Textured paint & cladding for aesthetic appeal.",
                },
                {
                  title: "Ceiling",
                  short_description:
                    "False ceilings with smooth acrylic emulsion finish.",
                },
                {
                  title: "Kitchen",
                  short_description:
                    "High-quality ceramic tiles as per design.",
                },
              ],
            },
            {
              title: "Flooring",
              children: [
                {
                  title: "Living/Dining/Lobby/Kitchen",
                  short_description:
                    "Luxurious marble flooring for high traffic areas.",
                },
                {
                  title: "Ground Floor Bedrooms",
                  short_description: "Marble flooring for luxury.",
                },
                {
                  title: "Other Bedrooms",
                  short_description:
                    "Engineered hardwood flooring for durability.",
                },
              ],
            },
          ],
        },
        microAmenities: {
          title: "Amenities",
          description:
            "More Than Just Comfort—A Lifestyle Designed for the Visionary.",
          // no information available
          list: [
            {
              title: "Temple",
              icon: "/images/amenities/icons/temple.svg",
              desktop_image: "/images/amenities/images/temple.jpg",
              mobile_image: "/images/amenities/images/temple.jpg",
            },
            {
              title: "Parks",
              icon: "/images/amenities/icons/park.svg",
              desktop_image: "/images/amenities/images/park-with-trees.jpg",
              mobile_image: "/images/amenities/images/park-with-trees.jpg",
            },
            {
              title: "Children’s Play Area",
              icon: "/images/amenities/icons/kids-play-area.svg",
              desktop_image: "/images/amenities/images/kids-area.jpg",
              mobile_image: "/images/amenities/images/kids-area.jpg",
            },
            {
              title: "EV Charging Points",
              icon: "/images/amenities/icons/charging-station.svg",
              desktop_image: "/images/amenities/images/ev-charging.jpg",
              mobile_image: "/images/amenities/images/ev-charging.jpg",
            },
            {
              title: "Clubhouse",
              icon: "/images/amenities/icons/clubhouse.svg",
              desktop_image: "/images/amenities/images/clubhouse.jpg",
              mobile_image: "/images/amenities/images/clubhouse.jpg",
            },
            {
              title: "24M & 30M Wide Internal Roads",
              icon: "/images/amenities/icons/road.svg",
              desktop_image: "/images/amenities/images/road.jpg",
              mobile_image: "/images/amenities/images/road.jpg",
            },
            {
              title: "Hospital",
              icon: "/images/amenities/icons/hospital.svg",
              desktop_image: "/images/amenities/images/hospital.jpg",
              mobile_image: "/images/amenities/images/hospital.jpg",
            },
            {
              title: "Shops",
              icon: "/images/amenities/icons/shop.svg",
              desktop_image: "/images/amenities/images/shop.jpg",
              mobile_image: "/images/amenities/images/shop.jpg",
            },
          ],
        },
        floorAndMasterPlan: {
          title: "Master & Floor Plan",
          description:
            "Blueprints of Tomorrow—Designed to Fit Every Dream and Every Family.",
          planTypes: [
            {
              title: "Master Plan",
              id: "master-plan",
            },
            {
              title: "Floor Plan",
              id: "floor-plan",
            },
          ],
          masterPlan: {},
          floorPlans: [],
        },
        microLocation: {
          title: "Location",
          description:
            "In the Heart of Connectivity—Where Convenience Meets Spiritual Serenity.",
          desktop_file: "",
          mobile_file: "",
          iframe:
            '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3537.235019441665!2d77.57898809999999!3d27.555215699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736d00270b0eb7%3A0x46a3759ada8b15ce!2sOmaxe%20Ral%20Radha%20kund%20Rd%20Vrindavan%20new%20project!5e0!3m2!1sen!2sin!4v1780393629664!5m2!1sen!2sin" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          location_data: {
            heading: "Location Advantages",
            description:
              "In the Heart of Spiritual Serenity—Where Every Landmark is Within Reach.",
            list: [
              {
                icons: "/images/projects/temple.svg",
                name: "4 Dham",
                time: "5 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Prem Mandir",
                time: "15 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Iskcon",
                time: "17 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/kund.svg",
                name: "Radhakund",
                time: "20 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/mountain.svg",
                name: "Govardhan Parikrama",
                time: "25 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/road.svg",
                name: "Yamuna Expressway",
                time: "35 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/road.svg",
                name: "Bareilly Highway",
                time: "35 Mins",
                type: "drive",
              },
              // walk
              // {
              //   icons: "/images/projects/hospital.svg",
              //   name: "Nayati Hospital",
              //   time: "20 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/hospital.svg",
              //   name: "Nayati Hospital",
              //   time: "20 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/hospital.svg",
              //   name: "Nayati Hospital",
              //   time: "20 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/hospital.svg",
              //   name: "Nayati Hospital",
              //   time: "20 Mins",
              //   type: "walk",
              // },
            ],
          },
        },
        microGallery: {
          title: "Gallery",
          description:
            "Every Frame Tells a Story of Innovation and Excellence.",
          long_description:
            "Step into our world through a visual journey—each image unveils a narrative of elegance, precision, and purpose.",
          gallery: [
            {
              title: "Gallery 1",
              desktop_file:
                "/images/projects/township/eternity-2/featured-img.webp",
              mobile_file:
                "/images/projects/township/eternity-2/featured-img.webp",
            },
          ],
        },
      },
      {
        id: "res-006",
        title: "Govind Vihar",
        description:
          "Govind Vihar Avasiya Yojna is an integrated township developed under the Mathura–Vrindavan Development Authority (MVDA) as part of the Uttar Pradesh Government’s Land Pooling Scheme. Strategically located in Village Jait, bang on NH-2, the project spans 71.28 acres and is envisioned as a planned residential ecosystem bringing structured urban living to the Braj region. K.sons became the first developer to receive land under Uttar Pradesh’s Land Pooling Scheme through MVDA’s Govind Vihar, marking a key milestone in the region’s planned development.",
        location: "NH-2, Vrindavan",
        year: 2024,
        area: "71.28 Acres",
        featured_img:
          "/images/projects/township/govind-vihar/featured-img.webp",
        desktop_file: "/images/projects/township/govind-vihar/hero.webp",
        mobile_file: "/images/projects/township/govind-vihar/hero.webp",
        featured: true,
        slug: "govind-vihar",
        status: "ongoing",
        typology: "Integrated Township Development",
        seo: {
          title: "Govind Vihar – K.Sons Group Integrated Township Vrindavan",
          keywords:
            "Govind Vihar Vrindavan, K.Sons Group integrated township, MVDA Land Pooling Scheme, residential and commercial development, plots and villas",
          description:
            "Govind Vihar by K.Sons Group is an integrated township in Vrindavan developed under MVDA’s Land Pooling Scheme, featuring residential and commercial spaces.",
          alternates: {
            canonical: "https://ksonsgroup.com/township/govind-vihar",
          },
        },
        highlights: {
          title: "Highlights",
          description:
            "Strategically Connected, Securely Approved, and Thoughtfully Planned for Modern Living.",
          list: [
            {
              icons: "/images/projects/highlights/temple.svg",
              name: "Excellent Connectivity to Mathura & Vrindavan Temples",
            },
            {
              icons: "/images/projects/highlights/train.svg",
              name: "Close to Vrindavan Road Railway Station",
            },
            {
              icons: "/images/projects/highlights/location.svg",
              name: "Located Near Proposed 400-Acre Mega Park",
            },
            {
              icons: "/images/projects/highlights/infrastructure.svg",
              name: "Wide Roads, Proper Drainage & Street Lighting",
            },
            {
              icons: "/images/projects/highlights/gated.svg",
              name: "Planned Gated Township with Green Open Spaces",
            },
            {
              icons: "/images/projects/highlights/approved.svg",
              name: "Fully MVDA-Approved Government Authorized Project",
            },
          ],
        },
        specifications: {
          title: "Specifications",
          description:
            "Where Every Detail Is Designed for Tomorrow, Crafted for a Lifetime.",
          listing: [
            {
              title: "infrastructure",
              children: [
                {
                  title: "Road Connectivity",
                  short_description:
                    "Excellent connectivity via VIP Road & NH-19.",
                },
                {
                  title: "Prime Accessibility",
                  short_description:
                    "Easy access to Mathura & Vrindavan major destinations.",
                },
                {
                  title: "Essential Facilities",
                  short_description:
                    "Nearby reputed schools, hospitals & daily conveniences.",
                },
              ],
            },
            // {
            //   title: "Walls & Ceilings",
            //   children: [
            //     {
            //       title: "External Walls",
            //       short_description: "Texture paint & cladding for durability.",
            //     },
            //     {
            //       title: "Ceiling",
            //       short_description:
            //         "False ceilings with acrylic emulsion paint.",
            //     },
            //     {
            //       title: "Kitchen",
            //       short_description: "Dado ceramic tiles as per design.",
            //     },
            //   ],
            // },
            // {
            //   title: "Flooring",
            //   children: [
            //     {
            //       title: "Living/Dining/Lobby/Kitchen",
            //       short_description: "Marble flooring for elegance.",
            //     },
            //     {
            //       title: "Ground Floor Bedrooms",
            //       short_description: "Marble flooring for luxury.",
            //     },
            //     {
            //       title: "Other Bedrooms",
            //       short_description: "Engineered hardwood flooring.",
            //     },
            //   ],
            // },
          ],
        },
        // microAmenities: {
        //   title: "Amenities",
        //   description: "More Than Comfort—A Lifestyle Built Around You.",
        //   list: [
        //     {
        //       title: "Electricity connection",
        //       icon: "/images/amenities/icons/electricity.svg",
        //       desktop_image:
        //         "/images/amenities/images/electricity-connection.jpg",
        //       mobile_image:
        //         "/images/amenities/images/electricity-connection.jpg",
        //     },
        //     {
        //       title: "Water supply provision",
        //       icon: "/images/amenities/icons/water-supply.svg",
        //       desktop_image: "/images/amenities/images/water-supply.jpg",
        //       mobile_image: "/images/amenities/images/water-supply.jpg",
        //     },
        //     {
        //       title: "Street lighting",
        //       icon: "/images/amenities/icons/street-light.svg",
        //       desktop_image: "/images/amenities/images/street-light.jpg",
        //       mobile_image: "/images/amenities/images/street-light.jpg",
        //     },
        //     {
        //       title: "Security provisions",
        //       icon: "/images/amenities/icons/cctv.svg",
        //       desktop_image:
        //         "/images/amenities/images/security-and-surveillance.jpg",
        //       mobile_image:
        //         "/images/amenities/images/security-and-surveillance.jpg",
        //     },
        //     {
        //       title: "Wide Internal Roads",
        //       icon: "/images/amenities/icons/road.svg",
        //       desktop_image: "/images/amenities/images/road.jpg",
        //       mobile_image: "/images/amenities/images/road.jpg",
        //     },
        //     {
        //       title: "Proper Drainage System",
        //       icon: "/images/amenities/icons/drainage.svg",
        //       desktop_image:
        //         "/images/amenities/images/proper-drainage-system.jpg",
        //       mobile_image:
        //         "/images/amenities/images/proper-drainage-system.jpg",
        //     },
        //     {
        //       title: "Landscaping & Green Open Areas",
        //       icon: "/images/amenities/icons/landscape.svg",
        //       desktop_image: "/images/amenities/images/green-space.jpg",
        //       mobile_image: "/images/amenities/images/green-space.jpg",
        //     },
        //     {
        //       title: "Gated Layout / Community Boundary",
        //       icon: "/images/amenities/icons/gate.svg",
        //       desktop_image: "/images/amenities/images/gated-community.jpg",
        //       mobile_image: "/images/amenities/images/gated-community.jpg",
        //     },
        //     {
        //       title: "Open Spaces for Future Development",
        //       icon: "/images/amenities/icons/nature.svg",
        //       desktop_image: "/images/amenities/images/free-land.jpg",
        //       mobile_image: "/images/amenities/images/free-land.jpg",
        //     },
        //     {
        //       title: "Well-Defined Residential Plots",
        //       icon: "/images/amenities/icons/plot.svg",
        //       desktop_image: "/images/amenities/images/plot-land.jpg",
        //       mobile_image: "/images/amenities/images/plot-land.jpg",
        //     },
        //   ],
        // },
        // floorAndMasterPlan: {
        //   title: "Master & Floor Plan",
        //   description:
        //     "Blueprints of Possibility—Designing Spaces for Every Vision.",
        //   planTypes: [
        //     {
        //       title: "Master Plan",
        //       id: "master-plan",
        //     },
        //     {
        //       title: "Floor Plan",
        //       id: "floor-plan",
        //     },
        //   ],
        //   masterPlan: {},
        //   floorPlans: [],
        // },
        microLocation: {
          title: "Location",
          description:
            "At the Intersection of Connectivity, Convenience, and Community.",
          desktop_file: "",
          mobile_file: "",
          iframe:
            '<iframe src="https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1sGovind+Vihar+Awasiya+Yojana+jait!5e0!6i12" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          location_data: {
            heading: "Location Advantages",
            description:
              "Where Serenity Meets Accessibility—Everything You Need, Just a Step Away.",
            list: [
              {
                icons: "/images/projects/temple.svg",
                name: "ISKCON Temple",
                time: "20 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Prem Mandir",
                time: "25 Mins",
                type: "drive",
              },
              {
                icons: "/images/projects/temple.svg",
                name: "Vaishno Devi Temple",
                time: "13 Mins",
                type: "drive",
              },
              // walk
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "ISKCON Temple",
              //   time: "25 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/road.svg",
              //   name: "Chhatikara Mor",
              //   time: "30 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/temple.svg",
              //   name: "Banke Bihari Temple",
              //   time: "30 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/kund.svg",
              //   name: "Surya Kund (Sacred Water Body)",
              //   time: "20 Mins",
              //   type: "walk",
              // },
              // {
              //   icons: "/images/projects/market.svg",
              //   name: "Local Shopping Markets",
              //   time: "15 Mins",
              //   type: "walk",
              // },
            ],
          },
        },
        microGallery: {
          title: "Gallery",
          description: "Where Every Frame Captures the Essence of Our Vision.",
          long_description:
            "Step into our visual journey—where each image unfolds a story of craftsmanship, innovation, and future-ready living.",
          gallery: [
            {
              title: "Gallery 1",
              desktop_file:
                "/images/projects/township/govind-vihar/gallery/1.png",
              mobile_file:
                "/images/projects/township/govind-vihar/gallery/1.png",
            },
            {
              title: "Gallery 2",
              desktop_file:
                "/images/projects/township/govind-vihar/gallery/2.png",
              mobile_file:
                "/images/projects/township/govind-vihar/gallery/2.png",
            },
            {
              title: "Gallery 3",
              desktop_file:
                "/images/projects/township/govind-vihar/gallery/3.png",
              mobile_file:
                "/images/projects/township/govind-vihar/gallery/3.png",
            },
          ],
        },
      },
    ],
    seo: {
      title: "K.Sons Group – Township Projects in Mathura & Vrindavan",
      keywords:
        "K.Sons Group township, integrated township Mathura, Vrindavan residential projects, villas, plots, group housing, commercial spaces",
      description:
        "Explore K.Sons Group township projects in Mathura & Vrindavan, offering thoughtfully planned villas, plots, group housing, and commercial developments.",
      alternates: {
        canonical: "https://ksonsgroup.com/township",
      },
    },
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// all slugs
export function getAllSlugs(): string[] {
  return categories.map((c) => c.slug);
}

// Returns only platters (for home page)
export function givePlatterPages() {
  const slides = categories.map((page) => ({
    slug: page.slug,
    title: page.label,
    label: page.bannerData.tag ?? "",
    description: page.bannerData.heading ?? "",
    files: {
      featured_mobile_file: page.bannerData.files.featured_mobile_file,
      featured_desktop_file: page.bannerData.files.featured_desktop_file,
    },
  }));

  return {
    slides,
  };
}

// Returns platter with projects (for footer/header/other links);
export function givePlatterWithProject() {
  return categories.map((page) => ({
    label: page.label,
    href: `/${page.slug}`,
    projects: page.projects.map((project) => ({
      label: project.title,
      href: `/${page.slug}/${project.slug}`,
    })),
  }));
}
