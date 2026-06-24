// src/admin/config/projectsConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
import { IconType } from "react-icons";
import {
  HiOutlineFolder,
  HiOutlineChartPie,
  HiOutlineCollection,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { ListColumn } from "./adminConfig";

export type FieldType =
  | "text"
  | "hidden"
  | "number"
  | "textarea"
  | "image"
  | "select"
  | "multiselect"
  | "toggle"
  | "color"
  | "date"
  | "email"
  | "url"
  | "image"
  | "video"
  | "textEditor"
  | "phone"
  | "repeater";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string | string[];
  section?: string;
  required?: boolean;
  options?: FieldOption[]; // for select / multiselect
  dynamicSource?: string; // key from ADMIN_SECTION_REGISTRY to fetch options from
  searchEndpoint?: string; // API endpoint for autocomplete/search
  hint?: string;
  hideInDisplay?: boolean;
  excludeFromPayload?: boolean; // If true, field value will not be sent to backend
  excludeFromTable?: boolean; // If true, field will not be shown as a column in tables
  dependsOn?: string;
  showIf?:
    | {
        field: string;
        value: any;
      }
    | ((formValues: any) => boolean);
  defaultValue?: any;
  colSpan?: string;
  repeaterFields?: FormField[];
  addButtonText?: string;
  maxItems?: number;
  minItems?: number;
  isFlatArray?: boolean;
  noSpecialChar?: boolean;
}

export interface FilterConfig {
  name: string;
  label: string;
  options?: { label: string; value: string }[];
  dynamicSource?: string;
  valueField?: string;
}

export interface ProjectSectionConfig {
  title: string;
  noun: string;
  fields: FormField[];
  listColumns: ListColumn[];
  endpoint: string;
  tableDataApi?: string;
  queryParams?: Record<string, any>;
  icon?: IconType;
  filters?: FilterConfig[];
  displaySearch?: boolean;
  hideInSidebar?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECT: ProjectSectionConfig = {
  title: "Project",
  noun: "projects",
  endpoint: "/admin/project",
  // tableDataApi: "/admin/project", This is for get only not for post and patch
  icon: HiOutlineClipboardList,
  listColumns: [
    { key: "name", title: "Name", dataKey: "projectName" },
    {
      key: "statusTitle",
      title: "Status",
      dataKey: "projectStatus.name",
      showIcon: false,
    },
    { key: "seq", title: "Sequence", dataKey: "seq" },
    { key: "status", title: "Active", dataKey: "status" },
    { key: "is_featured", title: "Featured", dataKey: "is_featured" },
    {
      key: "add_project_section",
      title: "Add Project Section",
      dataKey: "add_project_section",
      isAction: true,
      showIcon: true,
      linkTemplate: "/admin/{slug}/{id}/sections",
    },
  ],

  fields: [
    {
      name: "projectName",
      label: "Name",
      type: "text",
      placeholder: "Project Name",
      section: "Basic Information",
      required: true,
    },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "toggle",
    //   section: "Basic Information",
    //   defaultValue: true,
    //   colSpan: "w-[48%]",
    // },
    {
      name: "platterId",
      label: "Platter",
      type: "select",
      section: "General Information",
      dynamicSource: "platter",
      required: true,
      colSpan: "w-[48%]",
    },
    {
      name: "projectStatusId",
      label: "Project Status",
      type: "select",
      section: "General Information",
      dynamicSource: "projectStatus",
      required: true,
      colSpan: "w-[48%]",
    },
    {
      name: "location",
      label: "Address",
      type: "text",
      placeholder: "Sunrakh Road, Vrindavan",
      section: "General Information",
      required: true,
    },
    // This is a display-only search field. Its value will not be sent to the backend.
    // The hidden fields below will send location-related data to the backend based on the selected location.
    {
      name: "state",
      label: "Search Location",
      type: "text",
      placeholder: "Uttar Pradesh",
      section: "General Information",
      searchEndpoint: "website/location",
      // required: true, // If we mark this true then we have to add city everytime like on edit
      excludeFromPayload: true,
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "hidden",
      hideInDisplay: true,
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "hidden",
      hideInDisplay: true,
    },
    {
      name: "countryId",
      label: "Country",
      type: "hidden",
      hideInDisplay: true,
    },
    { name: "stateId", label: "State", type: "hidden", hideInDisplay: true },
    { name: "cityId", label: "City", type: "hidden", hideInDisplay: true },

    // End hidden fields

    {
      name: "typologyId",
      label: "Select Typologies",
      type: "select",
      section: "Typlogies",
      dynamicSource: "typology",
      required: true,
      colSpan: "w-[100%]",
    },
    {
      name: "subTypologyId",
      label: "Select Sub Typologies",
      type: "multiselect",
      section: "Typlogies",
      dynamicSource: "subtypology?limit=50",
      dependsOn: "typologyId",
      required: true,
    },
    {
      name: "size_unit",
      label: "Area Type",
      type: "select",
      placeholder: "Total Area",
      section: "Project Area",
      options: [
        { label: "Acres", value: "Acres" },
        { label: "Square Feet", value: "Square Feet" },
        { label: "Square Meter", value: "Square Meter" },
        { label: "Square Yard", value: "Square Yard" },
      ],
      colSpan: "w-[48%]",
    },
    {
      name: "starting_size",
      label: "Project Size",
      type: "number",
      placeholder: "27",
      section: "Project Area",
      colSpan: "w-[48%]",
    },
    {
      name: "shortDescription",
      label: "",
      type: "textarea",
      placeholder: "Project Description",
      section: "Project Description",
      colSpan: "w-[100%]",
    },
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      section: "SEO Settings",
      hint: "Optional",
    },
    {
      name: "seoTags.title",
      label: "Meta Title",
      type: "text",
      section: "SEO Settings",
    },
    {
      name: "seoTags.keywords",
      label: "Meta Keywords",
      type: "textarea",
      section: "SEO Settings",
    },
    {
      name: "seoTags.description",
      label: "Meta Description",
      type: "textarea",
      section: "SEO Settings",
    },
    {
      type: "textarea",
      name: "seoTags.headData",
      label: "Head Data",
      section: "SEO Settings",
    },
    {
      type: "textarea",
      name: "seoTags.bodyData",
      label: "Body Data",
      section: "SEO Settings",
    },
    {
      name: "mainLabel",
      label: "Desktop Image Label",
      type: "text",
      placeholder: "Residential",
      section: "Images",
    },
    {
      name: "featuredLabel",
      label: "Featured Image Label",
      type: "text",
      placeholder: "Featured",
      section: "Images",
    },
    // ---------------- FILES ----------------
    {
      name: "featured_desktop_file",
      label: "Featured Desktop",
      type: "image",
      section: "Images",
      hint: "Recommended: 1440x778 (16:9). Format: WebP. Max: 800KB",
    },
    {
      name: "featured_mobile_file",
      label: "Featured Mobile",
      type: "image",
      section: "Images",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
    },
    {
      name: "desktop_image",
      label: "Desktop Image",
      type: "image",
      section: "Images",
      hint: "Recommended: 1440x778. Format: WebP. Max: 800KB",
    },
    {
      name: "mobile_image",
      label: "Mobile Image",
      type: "image",
      section: "Images",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
    },
  ],
  filters: [
    {
      name: "platterId",
      label: "Category",
      dynamicSource: "platter",
    },
  ],
  displaySearch: true,
};

export const PROJECT_SECTION_FIELDS: Record<string, FormField[]> = {
  highlight: [],
  specification: [],
  floorPlan: [],
  locationadvantage: [
    {
      name: "iframe",
      label: "Iframe Embed Code / Link",
      type: "textarea",
      section: "Iframe",
      // required: true,
      // showIf: { field: "media_type", value: "iframe" },
    },
    {
      name: "description.title",
      label: "Location Advantage Title",
      type: "text",
      section: "Location Advantage Section",
      required: true,
    },
    {
      name: "description.heading",
      label: "Location Advantage Heading",
      type: "text",
      section: "Location Advantage Section",
      required: true,
    },
    // {
    //   name: "media_type",
    //   label: "Media Type",
    //   type: "select",
    //   section: "Media",
    //   required: true,
    //   excludeFromPayload: true,
    //   defaultValue: "iframe",
    //   options: [
    //     { label: "Image", value: "image" },
    //     { label: "Iframe", value: "iframe" },
    //   ],
    // },
    {
      name: "map_desktop_image",
      label: "Desktop Image",
      type: "image",
      section: "Media",
      hint: "Optional",
      // required: true,
      // showIf: { field: "media_type", value: "image" },
    },
    {
      name: "map_mobile_image",
      label: "Location Map Mobile Image",
      type: "image",
      section: "Media",
      hint: "Optional",

      // required: true,
      // showIf: { field: "media_type", value: "image" },
    },
  ],
  gallery: [
    {
      name: "description.short",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Description",
      section: "Basic Information",
      required: true,
    },
  ],
  amenities: [],
};

export const DEFAULT_PROJECT_SECTION_FIELDS: ProjectSectionConfig = {
  title: "Project Section",
  noun: "sections",
  icon: HiOutlineChartPie,
  endpoint: "/admin/project-sections",
  tableDataApi: "/admin/project-sections/{projectId}/sections",
  hideInSidebar: true,
  listColumns: [
    { key: "name", title: "Name", dataKey: "title.main" },
    // { key: "type", title: "Type", dataKey: "section.name" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
    { key: "status", title: "Active", dataKey: "status" },
    { key: "more_details", title: "More Details", dataKey: "more_details" },
  ],

  fields: [
    {
      name: "title.main",
      label: "Section Title",
      type: "text",
      placeholder: "Enter Section Title",
      section: "Basic Information",
      required: true,
      colSpan: "w-[48%]",
    },
    {
      name: "title.short",
      label: "Section Heading",
      type: "text",
      placeholder: "Enter Section Heading",
      section: "Basic Information",
      colSpan: "w-[48%]",
    },
  ],
};

export const PROJECT_SECTION_LIST_FIELDS: Record<string, FormField[]> = {
  banner: [
    {
      name: "desktop_image",
      label: "Desktop Image",
      type: "image",
      required: true,
      section: "Media",
      hint: "Recommended: 1440x778 (16:9). Format: WebP. Max: 800KB",
    },
    {
      name: "mobile_image",
      label: "Mobile Image",
      type: "image",
      required: true,
      section: "Media",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
    },
  ],
  highlight: [
    {
      name: "title",
      label: "Highlight Name",
      type: "text",
      placeholder: "e.g. Primest Location",
      required: true,
      section: "Highlight Details",
    },
    {
      name: "alt",
      label: "Icon Alt",
      type: "text",
      section: "Highlight Details",
    },
    {
      name: "image",
      label: "Icon / Image",
      type: "image",
      required: true,
      section: "Media",
      hint: "Format: PNG, WEBP Max: 50KB",
    },
  ],
  specification: [
    {
      name: "type",
      label: "Specifications",
      type: "select",
      // placeholder: "e.g. Infrastructure, Flooring",
      required: true,
      section: "Specifications",
      options: [
        { label: "Infrastructure", value: "INFRASTRUCTURE" },
        { label: "Flooring", value: "FLOORING" },
        { label: "Location", value: "LOCATION" },
        { label: "Walls And Ceiling", value: "WALLS_CEILING" },
        { label: "Windows", value: "WINDOWS" },
        { label: "Electrical", value: "ELECTRICAL" },
        { label: "Sanitary", value: "SANITARY" },
        { label: "Home Automation", value: "HOME_AUTOMATION" },
        { label: "Doors", value: "DOORS" },
      ],
      colSpan: "w-[48%]",
    },
    {
      name: "title",
      label: "Specification Title",
      type: "text",
      placeholder: "e.g. Structure, Kitchen",
      section: "Specifications",
      colSpan: "w-[48%]",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "e.g. Strong RCC framed structure...",
      section: "Specifications",
    },
  ],
  floorPlan: [
    {
      name: "type",
      label: "Plan Type",
      type: "select",
      options: [
        { label: "Master Plan", value: "masterplan" },
        { label: "Floor Plan", value: "floorplan" },
      ],
      section: "Plan Details",
      required: true,
      colSpan: "w-[100%]",
    },
    {
      name: "title",
      label: "Plan Title",
      type: "text",
      placeholder: "e.g. 3 BHK floor plan",
      required: true,
      section: "Plan Details",
      colSpan: "w-[100%]",
    },
    {
      name: "desktop_image",
      label: "Desktop Image",
      type: "image",
      section: "Media",
      hint: "Recommended: 1440x778. Format: WebP. Max: 800KB",
    },
    {
      name: "mobile_image",
      label: "Mobile Image",
      type: "image",
      section: "Media",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
    },
  ],
  locationadvantage: [
    // {
    //   name: "type",
    //   label: "Travel Type",
    //   type: "select",
    //   options: [
    //     { label: "Walk", value: "walk" },
    //     { label: "Drive", value: "drive" },
    //   ],
    //   required: true,
    //   section: "Advantage Details",
    //   colSpan: "w-[48%]",
    // },
    {
      name: "type",
      label: "Travel Type",
      type: "hidden",
      required: true,
      defaultValue: "drive",
      section: "Advantage Details",
      colSpan: "w-[48%]",
      excludeFromTable: true,
    },
    {
      name: "iconId",
      label: "Location Icon",
      type: "select",
      dynamicSource: "websiteIcons",
      required: true,
      section: "Advantage Details",
      colSpan: "w-[100%]",
      excludeFromTable: true,
    },

    {
      name: "destination",
      label: "Advantage Title",
      type: "text",
      placeholder: "e.g. Prem Temple, Yamuna Expressway",
      required: true,
      section: "Advantage Details",
    },
    {
      name: "duration",
      label: "Time Duration",
      type: "text",
      placeholder: "e.g. 5 Mins, 10 Mins",
      required: true,
      section: "Advantage Details",
    },
  ],
  gallery: [
    {
      name: "alt",
      label: "Image Alt",
      type: "text",
      placeholder: "e.g. Club House Exterior",
      section: "Gallery Details",
    },
    {
      name: "type",
      label: "Media Type",
      type: "select",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
      ],
      colSpan: "w-full",
      required: true,
      defaultValue: "image",
      section: "Gallery Details",
    },
    {
      name: "mainLabel",
      label: "Watermark",
      type: "text",
      placeholder: "Artistic Impression",
      section: "Gallery Details",
      colSpan: "w-full",
    },
    // Media Fields
    {
      name: "desktop_file",
      label: "Desktop Image",
      type: "image",
      required: true,
      section: "Media",
      hint: "Recommended: 1440x778 (16:9). Format: WebP. Max: 800KB",
      showIf: {
        field: "type",
        value: "image",
      },
    },
    {
      name: "mobile_file",
      label: "Mobile Image",
      type: "image",
      required: true,
      section: "Media",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
      showIf: {
        field: "type",
        value: "image",
      },
    },

    {
      name: "desktop_file",
      label: "Video",
      type: "video",
      required: true,
      section: "Media",
      hint: "Max: 1GB",
      showIf: {
        field: "type",
        value: "video",
      },
    },
    {
      name: "mobile_file",
      label: "Video",
      type: "video",
      section: "Media",
      hint: "Max: 1GB",
      showIf: {
        field: "type",
        value: "video",
      },
    },
  ],
  amenities: [
    {
      name: "amenitiesId",
      label: "Amenity Icon",
      type: "select",
      dynamicSource: "amenities",
      required: true,
      section: "Amenity Icons and Title",
      excludeFromTable: true,
      colSpan: "w-[48%]",
    },
    {
      name: "title",
      label: "Amenity Title",
      type: "text",
      placeholder: "e.g. State-of-the-Art Multiplex",
      required: true,
      section: "Amenity Icons and Title",
      colSpan: "w-[48%]",
    },
    {
      name: "mainLabel",
      label: "Watermark",
      type: "text",
      placeholder: "Artistic Impression",
      section: "Amenity Icons and Title",
      colSpan: "w-full",
    },

    {
      name: "image",
      label: "Image",
      type: "image",
      required: true,
      section: "Media",
    },
  ],
};

export const PROJECT_SECTION_COLUMNS: Record<string, any[]> = {
  banner: [
    { key: "image", title: "Image", dataKey: "desktop_image", type: "image" },
    { key: "subtitle", title: "Subtitle", dataKey: "subtitle" },
    { key: "title", title: "Title", dataKey: "title" },
  ],
  highlight: [
    { key: "image", title: "Icon", dataKey: "image", type: "image" },
    { key: "title", title: "Title", dataKey: "title" },
    { key: "status", title: "Status", dataKey: "status" },
  ],
  amenities: [
    { key: "image", title: "Image", dataKey: "image", type: "image" },
    { key: "title", title: "Title", dataKey: "title" },
    { key: "status", title: "Status", dataKey: "status" },
  ],
  specification: [
    { key: "type", title: "Type", dataKey: "type" },
    { key: "title", title: "Title", dataKey: "title" },
    { key: "status", title: "Status", dataKey: "status" },
  ],
  floorPlan: [
    { key: "title", title: "Plan Title", dataKey: "title" },
    { key: "type", title: "Type", dataKey: "type" },
    {
      key: "image",
      title: "Desktop Image",
      dataKey: "desktop_image",
      type: "image",
    },
    { key: "status", title: "Status", dataKey: "status" },
  ],
  locationadvantage: [
    { key: "destination", title: "Destination", dataKey: "destination" },
    { key: "duration", title: "Duration", dataKey: "duration" },
    { key: "status", title: "Status", dataKey: "status" },
    // { key: "type", title: "Travel Type", dataKey: "type" },
  ],
  gallery: [
    { key: "type", title: "Media Type", dataKey: "type" },
    {
      key: "image",
      title: "Media File",
      dataKey: "desktop_file",
      type: "image",
    },

    // { key: "video", title: "Video", dataKey: "video_file", type: "video" },
    { key: "alt", title: "Alt Text", dataKey: "alt" },
    { key: "status", title: "Status", dataKey: "status" },
  ],
};

export const PROJECT_SECTION_ENDPOINTS: Record<string, string> = {
  banner: "/admin/project-banners",
  highlight: "/admin/project-highlights",
  amenities: "/admin/project-amenities",
  specification: "/admin/project-specifications",
  floorPlan: "/admin/project-floorplan",
  locationadvantage: "/admin/project-location",
  gallery: "/admin/project-gallery",
};

export const PROJECT_SECTION_PARAMS: Record<string, Record<string, any>> = {
  // Add section-specific params here if needed
  //E.g  highlight: { active: true },
};
