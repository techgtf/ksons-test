"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/src/website/utils/gsap";
import { agency } from "@/src/app/fonts";
import Link from "next/link";
import { useGoogleMaps } from "./useGoogleMaps";

declare const google: any;

type Props = {
  locations: any[];
};

const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1B3313" }], // Deep dark forest green land
  },
  {
    elementType: "labels",
    stylers: [{ visibility: "off" }], // Hide default labels
  },
  {
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e2c275" }], // Gold text for states
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2E4F23" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3B612E" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#233F1A" }], // Parks deep green
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#C5A86D" }, { weight: 0.5 }], // Gold roads
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#AA8D52" }, { weight: 1.0 }], // Highway gold lines
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1B3313" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#00E5FF" }], // Neon cyan water/rivers
  },
];

export default function LocationWiseProjectsMobile({ locations }: Props) {
  const isLoaded = useGoogleMaps();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const locationBadgeRef = useRef<HTMLDivElement>(null);
  const locationTextRef = useRef<HTMLSpanElement>(null);
  const locationImageRef = useRef<HTMLImageElement>(null);
  const locationLinkRef = useRef<HTMLAnchorElement>(null);
  const currentLocIndexRef = useRef<number>(-1);

  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    if (!isLoaded) return;
    if (window.innerWidth >= 1024) return;
    if (!sectionRef.current || !mapContainerRef.current) return;

    registerGSAP();

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: 28.0, lng: 77.6 },
      zoom: 8.5,
      disableDefaultUI: true,
      gestureHandling: "none",
      styles: mapStyles,
    });

    // Custom HTML Overlay class definition
    class CustomOverlay extends google.maps.OverlayView {
      private pos: { lat: number; lng: number };
      private el: HTMLElement;

      constructor(pos: { lat: number; lng: number }, el: HTMLElement) {
        super();
        this.pos = pos;
        this.el = el;
      }

      onAdd() {
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(this.el);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        const pixel = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(this.pos.lat, this.pos.lng)
        );
        if (pixel) {
          this.el.style.position = "absolute";
          this.el.style.left = `${pixel.x}px`;
          this.el.style.top = `${pixel.y}px`;
        }
      }

      onRemove() {
        if (this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }
      }
    }

    const overlays: CustomOverlay[] = [];
    const markerElements: HTMLDivElement[] = [];

    locations.forEach((loc, index) => {
      // Wrapper container
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.width = "0px";
      container.style.height = "0px";

      // Animated inner marker element (relative container with coordinates at (0,0))
      const element = document.createElement("div");
      element.className = "relative cursor-pointer select-none";
      
      // Initialize GSAP positioning styles
      gsap.set(element, {
        xPercent: 0,
        yPercent: 0,
        scale: 0.6,
        y: 20,
        autoAlpha: 0,
      });

      // Pin container (24px wide, 24px tall)
      const pinContainer = document.createElement("div");
      pinContainer.style.position = "absolute";
      pinContainer.style.width = "24px";
      pinContainer.style.height = "24px";
      pinContainer.style.left = "-12px";
      pinContainer.style.top = "-23px"; // Places the tip of the triangle exactly at the coordinate

      // Triangle Ping SVG
      const pingSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      pingSvg.setAttribute("class", "absolute inset-0 w-full h-full animate-ping opacity-75");
      pingSvg.setAttribute("viewBox", "0 0 24 24");
      pingSvg.setAttribute("fill", "none");
      
      const pingPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pingPath.setAttribute("d", "M12 23L2 3H22L12 23Z");
      pingPath.setAttribute("fill", "#0F3C78");
      pingSvg.appendChild(pingPath);

      // Solid Gradient Triangle SVG
      const solidSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      solidSvg.setAttribute("class", "absolute inset-0 w-full h-full drop-shadow-md");
      solidSvg.setAttribute("viewBox", "0 0 24 24");
      solidSvg.setAttribute("fill", "none");

      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      linearGradient.setAttribute("id", `pinGrad-mob-${index}`);
      linearGradient.setAttribute("x1", "0");
      linearGradient.setAttribute("y1", "0");
      linearGradient.setAttribute("x2", "0");
      linearGradient.setAttribute("y2", "24");
      linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "#38bdf8"); // Cyan / Sky blue at top
      
      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#0F3C78"); // Brand Blue at bottom

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
      solidSvg.appendChild(defs);

      const solidPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      solidPath.setAttribute("d", "M12 22L3 4H21L12 22Z");
      solidPath.setAttribute("fill", `url(#pinGrad-mob-${index})`);
      solidPath.setAttribute("stroke", "white");
      solidPath.setAttribute("stroke-width", "2");
      solidPath.setAttribute("stroke-linejoin", "round");
      solidSvg.appendChild(solidPath);

      pinContainer.appendChild(pingSvg);
      pinContainer.appendChild(solidSvg);

      const textLabel = document.createElement("p");
      textLabel.className = `${agency.className} absolute capitalize whitespace-nowrap bg-white rounded-2xl px-2 py-0.5 leading-normal font-semibold text-[#0F3C78] shadow-md border border-gray-100 text-[10px]`;
      textLabel.style.top = "4px";
      textLabel.style.left = "0";
      textLabel.style.transform = "translateX(-50%)"; // Center text horizontally
      textLabel.innerText = loc.name;

      element.appendChild(pinContainer);
      element.appendChild(textLabel);

      element.addEventListener("click", (e) => {
        e.stopPropagation();
        if (sectionRef.current) {
          (sectionRef.current as any)._updateBadge?.(index);
        }
      });

      container.appendChild(element);

      const overlay = new CustomOverlay(loc.coords, container);
      overlay.setMap(map);

      overlays.push(overlay);
      markerElements.push(element);
    });

    // Curated nearby famous places
    const famousPlaces = [
      { name: "Prem Mandir", coords: { lat: 27.5714, lng: 77.6740 } },
      { name: "Banke Bihari", coords: { lat: 27.5807, lng: 77.7011 } },
      { name: "Krishna Janmasthan", coords: { lat: 27.5054, lng: 77.6698 } },
      { name: "Taj Mahal", coords: { lat: 27.1751, lng: 78.0421 } },
      { name: "Akshardham Temple", coords: { lat: 28.6127, lng: 77.2773 } },
      { name: "DLF Mall of India", coords: { lat: 28.5677, lng: 77.3258 } },
      { name: "Surajkund Lake", coords: { lat: 28.4876, lng: 77.2828 } },
    ];

    famousPlaces.forEach((place) => {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.width = "0px";
      container.style.height = "0px";

      const element = document.createElement("div");
      element.className = "flex flex-col items-center select-none opacity-85 scale-90";
      gsap.set(element, {
        xPercent: -50,
        yPercent: -50,
      });

      const dot = document.createElement("div");
      dot.className = "w-2 h-2 rounded-full bg-[#a1824a] border border-white shadow-sm";

      const label = document.createElement("p");
      label.className = "mt-1 text-[9px] font-semibold text-[#826a3c] bg-[#fffdfa] border border-[#ebdcb2] rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm capitalize";
      label.innerText = place.name;

      element.appendChild(dot);
      element.appendChild(label);
      container.appendChild(element);

      const overlay = new CustomOverlay(place.coords, container);
      overlay.setMap(map);
      overlays.push(overlay);
    });

    const mapState = {
      lat: 28.0,
      lng: 77.6,
      zoom: 8.5,
    };

    const ctx = gsap.context(() => {
      const total = locations.length;
      const PHASE1_UNITS = 1.0;
      const DOT_UNITS = 1.2;
      const HOLD_UNITS = 0.6;
      const LAST_HOLD_UNITS = 1.0;
      const PER_LOC = DOT_UNITS + HOLD_UNITS;
      const totalUnits =
        PHASE1_UNITS + (total - 1) * PER_LOC + DOT_UNITS + LAST_HOLD_UNITS;

      const tl = gsap.timeline({ paused: true });

      tl.to(
        [cloud1Ref.current, cloud2Ref.current],
        {
          autoAlpha: 0,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud1Ref.current,
        {
          xPercent: 50,
          yPercent: -40,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        cloud2Ref.current,
        {
          xPercent: -50,
          yPercent: 40,
          duration: PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        mapState,
        {
          zoom: 9.0,
          duration: PHASE1_UNITS,
          ease: "none",
          onUpdate: () => {
            map.setCenter({ lat: mapState.lat, lng: mapState.lng });
            map.setZoom(mapState.zoom);
          },
        },
        0,
      );

      tl.set(locationBadgeRef.current, { autoAlpha: 0, y: 20 }, 0);

      const updateBadge = (index: number, isManual: boolean = false) => {
        if (index === currentLocIndexRef.current && !isManual) return;

        const badge = locationBadgeRef.current;
        const badgeInner = badge?.querySelector(".badge-inner");

        const hideBadge = () => {
          if (!badge) return;
          gsap.to(badge, {
            autoAlpha: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
          });
          currentLocIndexRef.current = -1;
        };

        const applyUpdate = () => {
          const loc = locations[index];
          setSelectedLocation(loc.name);
          if (!loc) {
            hideBadge();
            return;
          }

          currentLocIndexRef.current = index;
          if (locationTextRef.current)
            locationTextRef.current.innerText = loc.name;
          if (locationImageRef.current)
            locationImageRef.current.src = loc.hero.img;

          if (locationLinkRef.current) {
            locationLinkRef.current.href = `/locations?location=${loc.name.toLowerCase()}`;
          }
        };

        if (index === -1) {
          hideBadge();
          return;
        }

        if (badge && (currentLocIndexRef.current === -1 || isManual)) {
          applyUpdate();
          gsap.set(badge, { visibility: "visible", pointerEvents: "auto" });
          gsap.to(badge, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          return;
        }

        if (badgeInner) {
          gsap.to(badgeInner, {
            autoAlpha: 0,
            y: 5,
            duration: 0.2,
            onComplete: () => {
              applyUpdate();
              gsap.to(badgeInner, {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            },
          });
        } else {
          applyUpdate();
        }
      };

      (sectionRef.current as any)._updateBadge = (index: number) => {
        updateBadge(index, true);
        const st = ScrollTrigger.getById("mobileMapTrigger");
        if (!st) return;

        const targetPos =
          PHASE1_UNITS + index * PER_LOC + DOT_UNITS + HOLD_UNITS / 2;
        const progress = targetPos / totalUnits;
        const targetScroll = st.start + progress * (st.end - st.start);

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      };

      tl.call(() => updateBadge(-1), [], 0.1);

      locations.forEach((loc, i) => {
        const startPos = PHASE1_UNITS + i * PER_LOC;

        tl.to(
          mapState,
          {
            lat: loc.coords.lat,
            lng: loc.coords.lng,
            zoom: 11.5,
            duration: DOT_UNITS,
            ease: "power2.inOut",
            onUpdate: () => {
              map.setCenter({ lat: mapState.lat, lng: mapState.lng });
              map.setZoom(mapState.zoom);
            },
          },
          startPos,
        );

        tl.to(
          markerElements[i],
          {
            autoAlpha: 1,
            scale: 1.0,
            y: 0,
            duration: DOT_UNITS,
            ease: "power2.out",
          },
          startPos,
        );

        tl.call(() => updateBadge(i), [], startPos + DOT_UNITS / 2);
      });

      tl.to(
        locationBadgeRef.current,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.1,
          ease: "power2.in",
        },
        totalUnits - 0.1,
      );

      ScrollTrigger.create({
        id: "mobileMapTrigger",
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${50 * totalUnits}%`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          if (hintRef.current)
            gsap.set(hintRef.current, {
              autoAlpha: self.progress > 0.05 ? 0 : 1,
            });
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      overlays.forEach((o) => o.setMap(null));
    };
  }, [isLoaded]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen w-full lg:hidden block overflow-x-hidden bg-[#e8f2e5]"
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#e8f2e5] flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-[#0F3C78] animate-ping" />
              <p
                className={`mt-4 text-[#0F3C78] ${agency.className} tracking-[2px] uppercase text-xs font-semibold`}
              >
                Loading Map...
              </p>
            </div>
          </div>
        )}

        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        <div
          ref={cloud1Ref}
          className="absolute top-[-8%] -left-55 z-10 pointer-events-none"
        >
          <img
            src="/images/home/location-wise-pro/cloud-2.png"
            className="w-[110%] object-contain"
            alt=""
          />
        </div>

        <img
          className="static-triangle absolute bottom-4 left-[25%] w-[100px] opacity-55 z-10 pointer-events-none"
          src="/images/home/location-wise-pro/triangle.svg"
          alt="triangle"
        />

        <div
          ref={cloud2Ref}
          className="absolute bottom-[-10%] -left-[55%] z-10 pointer-events-none"
        >
          <img
            src="/images/home/location-wise-pro/cloud-2.png"
            className="w-[100%] object-contain"
            alt=""
          />
        </div>

        <div
          ref={locationBadgeRef}
          className="absolute top-15 left-1/2 -translate-x-1/2 z-50 pointer-events-none invisible opacity-0 translate-y-2 flex flex-col items-center cursor-pointer"
        >
          <div className="bg-white p-3 w-[200px] badge-inner will-change-transform pointer-events-auto shadow-xl border border-gray-100 rounded-lg">
            <Link
              ref={locationLinkRef}
              href={`/projects?location=${selectedLocation}`}
              className="text-black "
            >
              <div className="w-full h-25 overflow-hidden border border-white/20 shrink-0 bg-white/5 relative">
                <img
                  ref={locationImageRef}
                  src="/images/"
                  className="w-full h-full object-cover"
                  alt="Location"
                />
              </div>
              <div className="flex flex-col pt-2 text-center">
                <span
                  ref={locationTextRef}
                  className={`${agency.className} text-black text-[12px] uppercase tracking-[0.2em] whitespace-nowrap leading-tight`}
                >
                  Our Locations
                </span>
                <span className="text-black text-[8px] uppercase tracking-[0.3em] font-medium text-gray-500 mt-0.5">
                  View Projects
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        />
      </section>
    </>
  );
}
