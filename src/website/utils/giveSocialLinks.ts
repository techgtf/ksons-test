import { useState, useEffect } from "react";
import { BASE_WEBSITE } from "@/config";



const iconMap: Record<string, string> = {
  facebook: "/images/footer/facebook-logo.svg",
  instagram: "/images/footer/instagram-logo.svg",
  linkedin: "/images/footer/linkedin-logo.svg",
  youtube: "/images/footer/youtube-logo.svg",
  x: "/images/footer/twitter-logo.svg",
  twitter: "/images/footer/twitter-logo.svg",
};

export interface SocialLinkItem {
  icon: string;
  link: string;
}

const defaultLinks: SocialLinkItem[] = [
  {
    icon: "/images/footer/facebook-logo.svg",
    link: "https://www.facebook.com/thek.sonsgroup/",
  },
  {
    icon: "/images/footer/instagram-logo.svg",
    link: "https://www.instagram.com/the_k.sonsgroup/",
  },
  {
    icon: "/images/footer/linkedin-logo.svg",
    link: "https://www.linkedin.com/company/theksonsgroup/",
  },
  {
    icon: "/images/footer/youtube-logo.svg",
    link: "https://www.youtube.com/@thek.sonsgroup",
  },
  {
    icon: "/images/footer/twitter-logo.svg",
    link: "https://x.com/theksonsgroup",
  },
];

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLinkItem[]>(defaultLinks);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`${BASE_WEBSITE}website/social-links`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data)) {
          const mapped = json.data
            .filter((item: any) => item.status)
            .map((item: any) => ({
              icon:
                iconMap[item.key.toLowerCase()] ||
                "/images/footer/facebook-logo.svg",
              link: item.url,
            }));
          if (mapped.length > 0) {
            setLinks(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch social links", error);
      }
    };
    fetchLinks();
  }, []);

  return links;
};
