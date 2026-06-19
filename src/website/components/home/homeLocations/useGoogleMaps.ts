"use client";

import { GOOGLE_MAP_ACCESS_TOKEN } from "@/config";
import { useEffect, useState } from "react";

let loadPromise: Promise<any> | null = null;

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).google && (window as any).google.maps) {
      setIsLoaded(true);
      return;
    }

    if (!loadPromise) {
      loadPromise = new Promise((resolve, reject) => {
        const apiKey = GOOGLE_MAP_ACCESS_TOKEN;
        if (!apiKey) {
          reject(
            new Error(
              "Google Maps API key is missing in environment variables.",
            ),
          );
          return;
        }

        const scriptId = "google-maps-api-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }

        script.onload = () => {
          resolve((window as any).google);
        };
        script.onerror = (err) => {
          reject(err);
        };
      });
    }

    loadPromise
      .then(() => setIsLoaded(true))
      .catch((err) => console.error("Error loading Google Maps:", err));
  }, []);

  return isLoaded;
}
