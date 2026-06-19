"use client";

import { useEffect, useRef, useState } from "react";
import { registerGSAP, gsap, ScrollTrigger } from "@/src/website/utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";
import { LocationWiseProjectModal } from "./LocationWiseProjectModal";
import { ModalHandle } from "./LocationContainers";
import { blauerNue } from "@/src/app/fonts";
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
    stylers: [{ color: "#ffffffd" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels.text.fill",
    stylers: [{ color: "#316818" }], // Gold text for states
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

export default function LocationWiseProjects({ locations }: Props) {
  const isLoaded = useGoogleMaps();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<ModalHandle>(null);

  const activeIdRef = useRef<number | string | null>(null);
  const panelHoveredRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeId, setActiveId] = useState<any>(null);

  const sharedUnits = useRef({
    PHASE1_UNITS: 1.0,
    DOT_UNITS: 1.2,
    HOLD_UNITS: 0.6,
    LAST_HOLD_UNITS: 1.2,
    PER_LOC: 1.8,
  });

  const total = locations.length;
  sharedUnits.current.PER_LOC =
    sharedUnits.current.DOT_UNITS + sharedUnits.current.HOLD_UNITS;
  const totalUnits =
    sharedUnits.current.PHASE1_UNITS +
    (total - 1) * sharedUnits.current.PER_LOC +
    sharedUnits.current.DOT_UNITS +
    sharedUnits.current.LAST_HOLD_UNITS;

  useEffect(() => {
    if (!isLoaded) return;
    if (window.innerWidth < 1024) return;
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
          new google.maps.LatLng(this.pos.lat, this.pos.lng),
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
        y: 30,
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
      const pingSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      pingSvg.setAttribute(
        "class",
        "absolute inset-0 w-full h-full animate-ping opacity-75",
      );
      pingSvg.setAttribute("viewBox", "0 0 24 24");
      pingSvg.setAttribute("fill", "none");

      const pingPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      pingPath.setAttribute("d", "M12 23L2 3H22L12 23Z");
      pingPath.setAttribute("fill", "#0F3C78");
      pingSvg.appendChild(pingPath);

      // Solid Gradient Triangle SVG
      const solidSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      solidSvg.setAttribute(
        "class",
        "absolute inset-0 w-full h-full drop-shadow-md",
      );
      solidSvg.setAttribute("viewBox", "0 0 24 24");
      solidSvg.setAttribute("fill", "none");

      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs",
      );
      const linearGradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient",
      );
      linearGradient.setAttribute("id", `pinGrad-${index}`);
      linearGradient.setAttribute("x1", "0");
      linearGradient.setAttribute("y1", "0");
      linearGradient.setAttribute("x2", "0");
      linearGradient.setAttribute("y2", "24");
      linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

      const stop1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop",
      );
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "#38bdf8"); // Cyan / Sky blue at top

      const stop2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop",
      );
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#0F3C78"); // Brand Blue at bottom

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
      solidSvg.appendChild(defs);

      const solidPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      solidPath.setAttribute("d", "M12 22L3 4H21L12 22Z");
      solidPath.setAttribute("fill", `url(#pinGrad-${index})`);
      solidPath.setAttribute("stroke", "white");
      solidPath.setAttribute("stroke-width", "2");
      solidPath.setAttribute("stroke-linejoin", "round");
      solidSvg.appendChild(solidPath);

      pinContainer.appendChild(pingSvg);
      pinContainer.appendChild(solidSvg);

      const textLabel = document.createElement("p");
      textLabel.className =
        "absolute capitalize whitespace-nowrap bg-white rounded-2xl px-2 py-0.5 leading-normal font-semibold text-[#0F3C78] shadow-md border border-gray-100 text-[11px]";
      textLabel.style.top = "4px";
      textLabel.style.left = "0";
      textLabel.style.transform = "translateX(-50%)"; // Center text horizontally
      textLabel.innerText = loc.name;

      element.appendChild(pinContainer);
      element.appendChild(textLabel);

      element.addEventListener("click", (e) => {
        e.stopPropagation();
        handleClick(loc, index);
      });

      container.appendChild(element);

      const overlay = new CustomOverlay(loc.coords, container);
      overlay.setMap(map);

      overlays.push(overlay);
      markerElements.push(element);
    });

    // Curated nearby famous places
    const famousPlaces = [
      { name: "Prem Mandir", coords: { lat: 27.5714, lng: 77.674 } },
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
      element.className =
        "flex flex-col items-center select-none opacity-85 scale-90";
      gsap.set(element, {
        xPercent: -50,
        yPercent: -50,
      });

      const dot = document.createElement("div");
      dot.className =
        "w-2 h-2 rounded-full bg-[#a1824a] border border-white shadow-sm";

      const label = document.createElement("p");
      label.className =
        "mt-1 text-[9px] font-semibold text-[#826a3c] bg-[#fffdfa] border border-[#ebdcb2] rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm capitalize";
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
      const scrollLength = `+=${60 * totalUnits}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: scrollLength,
          scrub: 2,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh(self) {
            stRef.current = self;
          },
          onLeave() {
            activeIdRef.current = null;
            setActiveId(null);
            modalRef.current?.close();
          },
          onLeaveBack() {
            activeIdRef.current = null;
            setActiveId(null);
            modalRef.current?.close();
          },
        },
      });

      stRef.current = tl.scrollTrigger as ScrollTrigger;

      tl.to(
        cloud1Ref.current,
        {
          xPercent: 100,
          yPercent: -80,
          autoAlpha: 0,
          duration: sharedUnits.current.PHASE1_UNITS,
          ease: "none",
        },
        0,
      );
      tl.to(
        cloud2Ref.current,
        {
          xPercent: -100,
          yPercent: 80,
          autoAlpha: 0,
          duration: sharedUnits.current.PHASE1_UNITS,
          ease: "none",
        },
        0,
      );

      tl.to(
        mapState,
        {
          zoom: 9.0,
          duration: sharedUnits.current.PHASE1_UNITS,
          ease: "none",
          onUpdate: () => {
            map.setCenter({ lat: mapState.lat, lng: mapState.lng });
            map.setZoom(mapState.zoom);
          },
        },
        0,
      );

      locations.forEach((loc, i) => {
        const startPos =
          sharedUnits.current.PHASE1_UNITS + i * sharedUnits.current.PER_LOC;
        const holdDuration =
          i === total - 1
            ? sharedUnits.current.LAST_HOLD_UNITS
            : sharedUnits.current.HOLD_UNITS;

        tl.to(
          mapState,
          {
            lat: loc.coords.lat,
            lng: loc.coords.lng,
            zoom: 12.0,
            duration: sharedUnits.current.DOT_UNITS,
            ease: "power3.inOut",
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
            duration: sharedUnits.current.DOT_UNITS,
            ease: "power2.out",
            onComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.swap(loc);
              }
            },
            onReverseComplete() {
              if (i === 0) {
                activeIdRef.current = null;
                setActiveId(null);
                modalRef.current?.close();
              }
            },
          },
          startPos,
        );

        tl.to(
          {},
          {
            duration: holdDuration,
            onReverseComplete() {
              if (panelHoveredRef.current) return;
              if (activeIdRef.current === loc.id) return;
              if (activeIdRef.current === null) {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.open(loc);
              } else {
                activeIdRef.current = loc.id;
                setActiveId(loc.id);
                modalRef.current?.swap(loc);
              }
            },
          },
          startPos + sharedUnits.current.DOT_UNITS,
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      overlays.forEach((o) => o.setMap(null));
    };
  }, [isLoaded]);

  const handleClick = (loc: any, index: number) => {
    const st = stRef.current;
    if (!st) return;

    const targetPos =
      sharedUnits.current.PHASE1_UNITS +
      index * sharedUnits.current.PER_LOC +
      sharedUnits.current.DOT_UNITS +
      sharedUnits.current.HOLD_UNITS / 2;

    const progress = targetPos / totalUnits;
    const targetScroll = st.start + progress * (st.end - st.start);

    lenisInstance?.scrollTo(targetScroll);
  };

  const handleSkip = () => {
    const st = stRef.current;
    if (!st) return;

    const scrollY = window.scrollY;
    const sectionTop = st.start;
    const sectionEnd = st.end;
    const midpoint = (sectionTop + sectionEnd) / 2;
    const goingDown = scrollY <= midpoint;

    if (goingDown) {
      lenisInstance?.scrollTo(sectionEnd + window.innerHeight * 1);
    } else {
      lenisInstance?.scrollTo(Math.max(0, sectionTop - window.innerHeight * 1));
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden lg:block hidden bg-[#e8f2e5]"
    >
      <div className="relative h-full w-full">
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#e8f2e5] flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-full bg-[#0F3C78] animate-ping" />
              <p
                className={`mt-4 text-[#0F3C78] ${blauerNue.className} tracking-[2px] uppercase text-xs font-semibold`}
              >
                Loading Map...
              </p>
            </div>
          </div>
        )}

        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div
            ref={cloud1Ref}
            className="absolute -top-[5%] -right-[15%] pointer-events-none"
          >
            <img
              src="/images/home/location-wise-pro/cloud-1.png"
              className="w-[80vw] ml-auto object-contain"
              alt=""
            />
          </div>

          <div
            ref={cloud2Ref}
            className="absolute -bottom-[5%] -left-[20%] pointer-events-none"
          >
            <img
              src="/images/home/location-wise-pro/cloud-2.png"
              className="w-[80vw] object-contain"
              alt=""
            />
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-[#0F3C78]/10 backdrop-blur-md border border-[#0F3C78]/20 px-4 py-2 text-sm text-[#0F3C78] hover:bg-[#0F3C78]/20 transition-colors"
        >
          <span className={`${blauerNue.className} font-semibold`}>Skip</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <LocationWiseProjectModal
        ref={modalRef}
        panelHoveredRef={panelHoveredRef}
        onClosed={() => {
          activeIdRef.current = null;
          setActiveId(null);
        }}
      />
    </section>
  );
}
