import Banner, {
  AboutBannerProps,
} from "@/src/website/components/about/Banner";
import BrandMetrics, {
  BrandMetricsProps,
} from "@/src/website/components/about/BrandMetrics";

import TeamTimelineParent from "@/src/website/components/about/TeamTimelineParent";
import { TeamProps } from "@/src/website/components/about/Team";
import { TimelineProps } from "@/src/website/components/about/Timeline";

import Values, { OurValues } from "@/src/website/components/about/Values";
import VissionMission, {
  VisionMissionProps,
} from "@/src/website/components/about/VisionMission";
import Overview, {
  OverViewProps,
} from "@/src/website/components/about/Overview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About K.Sons Group – Legacy Real Estate Developers",
  keywords: "K.Sons Group about, real estate developers Vrindavan, Mathura property experts, residential and commercial projects, legacy real estate",
  description: "Founded in 1970, K.Sons Group builds premium residential and commercial projects in Vrindavan and Mathura with credibility, quality, and foresight.",
  alternates: {
    canonical: "https://ksonsgroup.com/about",
  },
};

export default function AboutUs() {
  const bannerData: AboutBannerProps = {
    tag: "About",
    // heading:
    //   "K.sons: Where Legacy Meets Innovation, and Every Brick We Lay Tells a Story of Vision, Integrity, and a Future Built to Last.",
    heading:
      "K.sons: Where Legacy Meets Innovation, and Every Brick Reflects Vision and Integrity",

    subtext: `Where Vision Shapes Tomorrow, and Legacy Endures Forever.`,

    bulletImage: "/images/about/about-bullet.png",
    bannerImage: "/images/about/about-page-banner.png",
    triangleImage: "/images/about/banner-triangle.png",
  };

  const OverView: OverViewProps = {
    descriptions: [
      {
        pera: "Founded in 1970, we have always believed that enduring value is built through long-term decisions, not fleeting moments. Our journey into real estate in 1997 marked the beginning of creating spaces that transcend time, spaces that reflect foresight, responsibility, and an unwavering commitment to quality. Across Mathura, Vrindavan, Hathras, Noida, and Delhi NCR.",
      },
    ],
    Icons: "/images/about/about-page-banner-bottom.png",
  };

  const brandMetricsData: BrandMetricsProps = {
    tag: "Brand Metrics",
    heading: "Execution at Scale. Growth in Motion.",

    leftTitle: "Execution At Scale",
    rightTitle: "Growth In Motion",

    bulletImage: "/images/about/about-bullet.png",

    leftLineImage: "/images/about/left-connecting-line.png",
    rightLineImage: "/images/about/right-connecting-line.png",

    leftData: [
      { value: "08", label: "Completed Projects" },
      { value: "03", label: "Ongoing Projects" },
      {
        value: "5K+",
        label: "Units Delivered Across Residential & Plotted Communities",
      },
      { value: "3+", label: "Million sq.m. of Developed Land" },
    ],

    rightData: [
      { value: "2+", label: "Million sq.m. Under Development" },
      { value: "1.2+", label: "Million sq.m. of Land Reserve" },
      { value: "07", label: "Upcoming Projects" },
    ],
  };

  const visionMissionData: VisionMissionProps = {
    leftImage: "/images/about/tree.png",
    dividerImage: "/images/about/divider-line.png",

    vision: {
      title: "Our Vision",
      description:
        "To be India’s most trusted real estate brand, one where every family, investor and stakeholder feels the confidence of clarity, the assurance of process and the permanence of responsible development.",
    },

    mission: {
      title: "Our Mission",
      description:
        "To make long-term real estate decisions feel clearer, safer and more dependable for families and investors, not by offering more choice, speed, or spectacle, but by offering greater confidence and lasting trust at every stage.",
    },
  };

  const teamData: TeamProps = {
    tag: "Leadership",
    heading:
      "Guided by Vision, Led with Purpose—Our Leaders Shape Tomorrow’s Legacy.",
    bulletImage: "/images/about/about-bullet.png",

    backgroundImage: "/images/about/way.png",
    glowImage: "/images/about/glow.png",
    triangleImage: "/images/about/team-triangle.png",
    arrowImage: "/images/about/team-arrow.png",

    members: [
      {
        name: "Mr. Suresh Chandra Kaushik",
        role: "Chairman",
        image: "/images/about/team/mr_suresh.webp",
        description: `A visionary leader and philanthropist with over five decades of experience, Mr. Kaushik laid the foundation of K.sons and has guided its evolution into a diversified enterprise through foresight, integrity and disciplined leadership. Alongside his business pursuits, he remains deeply committed to social responsibilities. He serves as the Vice President of Shree Jee Baba Educational Society, President of the K.sons Foundation and is an active member of organisations such as Ujjwal Braj and Kalyanam Karoti. Through these initiatives, he continues to support efforts in education, environmental stewardship and healthcare for underserved communities.`,
      },
      {
        name: "Mr. Ashish Kaushik",
        role: "Managing Director",
        image: "/images/about/team/mr_ashish.webp",
        description: `A seasoned professional with over 15 years of leadership experience across real estate, finance and packaging, Mr. Ashish Kaushik plays a pivotal role in driving K.sons growth and strategic direction. He holds a Master’s in Financial Services from K.J. Somaiya College, Mumbai and brings strong financial insight with a progressive outlook to the group’s expanding portfolio.`,
      },
      {
        name: "Mr. Neeraj Sharma",
        role: "Director",
        image: "/images/about/team/mr_neeraj.webp",
        description: `With over 20 years of experience, Mr. Sharma brings a dynamic and strategic approach to the real estate sector, leading the company’s ongoing and upcoming developments. He holds a Master’s degree in Business Intelligence from the University of Greenwich, London and brings strong acumen in both sales and construction, contributing to the effective execution and growth of the company’s projects.`,
      },
    ],
  };

  const timelineData: TimelineProps = {
    markerImage: "/images/about/active-timeline-triangle.png",
    ranges: [
      {
        title: "THE FOUNDATION",
        range: "(1970-2001)",
        description: "The formative years that shaped the Group’s foundations.",
        years: [
          {
            year: "1970",
            text: "The K.sons Group’s Legacy began with entry into the transport sector, laying the foundation of discipline and enterprise.",
          },
          {
            year: "1986",
            text: "Established a cylinder ring manufacturing facility, strengthening industrial expertise.",
          },
          {
            year: "1997",
            text: "Ventured into real estate, combining land insight with business discipline.",
          },
          {
            year: "2001",
            text: "Entered the Mathura market with launch of Indraprastha Enclave, Group's first residential project.",
          },
        ],
      },
      {
        title: "LANDMARK GROWTH",
        range: "(2002-2017)",
        description:
          "A phase of structured growth across sectors and geographies.",
        years: [
          {
            year: "2002",
            text: "Launched the CRISIL- rated Brij Vasundhara Resort & Spa in Govardhan, a distinctive holiday living destination and second-home living marking the Group’s entry into hospitality.",
          },
          {
            year: "2003",
            text: "Expanded into education sector with the establishment of Shree Jee Baba College of Law, Mathura.",
          },
          {
            year: "2004",
            text: "Successfully completed and delivered Indraprastha Enclave.",
          },
          {
            year: "2008",
            text: "Delivered Brij Vasundhara Resort & Spa. Launched Radha Golf in Govardhan.",
          },
          {
            year: "2009",
            text: "Launched Radha Valley on the Agra–Mathura Highway. NRI Greens in Vrindavan, demonstrating capability for parallel project execution.",
          },
          {
            year: "2010",
            text: "Launched Radha Florence, marking the Group’s entry into the Vrindavan market.",
          },
          { year: "2014", text: "Delivered Radha Golf and NRI Greens." },
          { year: "2015", text: "Delivered Radha Florence." },
          { year: "2016", text: "Launched Gulmohar Township in Mathura." },
          { year: "2017", text: "Delivered Radha Valley." },
        ],
      },
      {
        title: "EXPANSION & NEW HORIZONS",
        range: "(2018–Onwards)",
        description: "A new era of diversification, scale, and forward growth.",
        years: [
          {
            year: "2018",
            text: "Acquired Sybron Leasing and Finance Pvt. Ltd.; a NBFC, marking the Group’s entry into financial sector.",
          },
          {
            year: "2021",
            text: "Launched Vasudev Elements in Vrindavan, a landmark township development.",
          },
          {
            year: "2024",
            text: "Launched Courtyard Mall in Vrindavan. Became the first developer to be a part of a project, Govind Vihar, under the Uttar Pradesh Government’s Land Pooling Scheme, with MVDA.",
          },
          {
            year: "2025",
            text: "Delivered Gulmohar Township. Launched Eternity 2 in Vrindavan. Introduced the Brij Star Kabaddi Team, marking the Group’s entry into the sports industry with its own professional team.",
          },
          {
            year: "Onwards",
            text: "300+ acres of planned future development across Delhi NCR, Mathura, Vrindavan and Hathras.",
          },
        ],
      },
    ],
  };

  const OurValues: OurValues = {
    data: [
      {
        id: 1,
        title: "Trust built through conduct:",
        description:
          "Credibility is established through consistent action over time, not through assertion or visibility.",
      },
      {
        id: 3,
        title: "Innovation that strengthens structure:",
        description:
          "Innovation is applied where it enhances planning, relevance and readiness, without introducing volatility.",
      },
      {
        id: 2,
        title: "Progress with perspective:",
        description:
          "Growth is guided by experience and foresight, advancing with clarity rather than acceleration.",
      },
      {
        id: 4,
        title: "Reliability across cycles:",
        description:
          "The brand remains steady through market shifts, supporting decisions that carry long-term consequences.",
      },
    ],
    bgImage: "/images/about/values-center.png",
  };

  return (
    <div className="py-10 lg:py-20">
      <Banner {...bannerData} />
      <Overview {...OverView} />
      <BrandMetrics {...brandMetricsData} />
      <VissionMission {...visionMissionData} />
      {/* <Team /> */}
      {/* <Timeline /> */}
      <TeamTimelineParent teamData={teamData} timelineData={timelineData} />
      <Values {...OurValues} />
    </div>
  );
}
