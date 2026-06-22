// src/admin/config/adminConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every dynamic admin section.
// Each key matches the Next.js [slug] segment exactly.
// ─────────────────────────────────────────────────────────────────────────────
import { IconType } from "react-icons";
import {
  HiOutlineFolder,
  HiOutlineChartPie,
  HiOutlineCollection,
} from "react-icons/hi";

import { PROJECT, DEFAULT_PROJECT_SECTION_FIELDS } from "./projectsConfig";
import { PAGE_BASIC_DETAILS, DEFAULT_PAGE_SECTION_FIELDS } from "./pagesConfig";

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
  dependsOn?: string; // field name that this field depends on
  hint?: string;
  hideInDisplay?: boolean;
  excludeFromPayload?: boolean; // If true, field value will not be sent to backend
  excludeFromTable?: boolean; // If true, field will not be shown as a column in tables
  showIf?:
    | {
        field: string;
        value: any;
      }
    | ((formValues: any) => boolean);
  excludeExisting?: boolean; // If true, filter out options that already exist in the database (requires dynamicSource)
  defaultValue?: any;
  colSpan?: string;
  repeaterFields?: FormField[];
  addButtonText?: string;
  maxItems?: number;
  minItems?: number;
  disabled?: boolean;
  disabledInEdit?: boolean;
}

export interface ListColumn {
  key: string;
  title: string;
  /** dot-path into the row object, e.g. "name" or "meta.title" */
  dataKey: string;
  badge?: boolean; // render as a pill badge
  truncate?: boolean;
  isAction?: boolean; // If true, render as an action button
  linkTemplate?: string; // Template for action URL, e.g. "/admin/project/{id}"
  showIcon?: boolean; // Whether to show a plus icon (for action buttons)
  type?: string; // Optional type for specialized rendering
  render?: (row: any, index?: number) => React.ReactNode;
}

export interface FilterConfig {
  name: string;
  label: string;
  options?: { label: string; value: string }[];
  dynamicSource?: string;
  valueField?: string;
}

export interface AdminSectionConfig {
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

const PLATTER: AdminSectionConfig = {
  title: "Platter",
  noun: "platters",
  endpoint: "/admin/platter",
  icon: HiOutlineCollection,
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    { key: "image", title: "Image", dataKey: "files.desktop_image" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
    {
      key: "viewprojects",
      title: "View Projects",
      dataKey: "viewprojects",
      isAction: true,
      showIcon: false,
      linkTemplate: "/admin/project?category={name}",
    },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Residential",
      section: "Basic Information",
      required: true,
    },

    {
      name: "title.main",
      label: "Heading",
      type: "text",
      section: "General Information",
    },

    {
      name: "title.sub",
      label: "Sub Heading",
      type: "text",
      section: "General Information",
    },

    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      section: "SEO Settings",
    },

    {
      name: "seoTags.meta_title",
      label: "Meta Title",
      type: "text",
      section: "SEO Settings",
    },

    {
      name: "seoTags.meta_keywords",
      label: "Meta Keywords",
      type: "textarea",
      section: "SEO Settings",
    },

    {
      name: "seoTags.meta_description",
      label: "Meta Description",
      type: "textarea",
      section: "SEO Settings",
    },

    {
      type: "textarea",
      name: "seoTags.headData",
      label: "Head Data",
      section: "SEO Section",
    },
    {
      type: "textarea",
      name: "seoTags.bodyData",
      label: "Body Data",
      section: "SEO Section",
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
  displaySearch: true,
};

const PROJECT_STATUS: AdminSectionConfig = {
  title: "Project Status",
  noun: "statuses",
  icon: HiOutlineChartPie,
  endpoint: "/website/projectstatus",
  listColumns: [{ key: "name", title: "Name", dataKey: "name" }],
  fields: [],
};

const COUNTRIES: AdminSectionConfig = {
  title: "Countries",
  noun: "countries",
  icon: HiOutlineChartPie,
  endpoint: "/admin/countries",
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    {
      key: "states",
      title: "States",
      dataKey: "states",
      linkTemplate: "/admin/states?countryId={id}",
      isAction: true,
      showIcon: false,
    },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "India",
      required: true,
      colSpan: "w-[100%]",
    },
  ],
  displaySearch: true,
};

const STATES: AdminSectionConfig = {
  title: "States",
  noun: "states",
  icon: HiOutlineChartPie,
  endpoint: "/admin/states",
  hideInSidebar: true,
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    {
      key: "cities",
      title: "Cities",
      dataKey: "cities",
      linkTemplate: "/admin/cities?stateId={id}",
      isAction: true,
      showIcon: false,
    },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Maharashtra",
      required: true,
      colSpan: "w-[48%]",
    },
    {
      name: "countyrId",
      label: "Country",
      type: "select",
      dynamicSource: "countries",
      required: true,
      colSpan: "w-[48%]",
    },
  ],
  displaySearch: true,
};

const CITIES: AdminSectionConfig = {
  title: "Cities",
  noun: "cities",
  icon: HiOutlineChartPie,
  endpoint: "/admin/cities",
  hideInSidebar: true,
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    { key: "isHome", title: "Show On Heme", dataKey: "isHome" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Mumbai",
      required: true,
      colSpan: "w-[32%]",
      disabled: true,
    },
    {
      name: "stateId",
      label: "State",
      type: "select",
      dynamicSource: "states",
      required: true,
      disabled: true,
      colSpan: "w-[32%]",
    },
    {
      name: "seq",
      label: "Sequence",
      type: "number",
      placeholder: "1",
      required: true,
      colSpan: "w-[32%]",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
      required: true,
      colSpan: "w-[100%]",
    },
  ],
  displaySearch: true,
};

const AMENITIES: AdminSectionConfig = {
  title: "Amenity",
  noun: "amenities",
  icon: HiOutlineChartPie,
  endpoint: "/admin/amenities",
  listColumns: [
    { key: "title", title: "Name", dataKey: "title" },
    { key: "image", title: "Icon", dataKey: "image" },
  ],
  fields: [
    // {
    //   name: "type",
    //   label: "Type",
    //   type: "select",
    //   section: "Basic Information",
    //   options: [
    //     { label: "Interior", value: "interior" },
    //     { label: "Exterior", value: "exterior" },
    //   ],
    //   colSpan: "w-[48%]",
    // },
    {
      name: "title",
      label: "Amenity Name",
      type: "text",
      placeholder: "Swimming Pool",
      section: "Basic Information",
      required: true,
      colSpan: "w-[100%]",
    },
    {
      name: "type",
      label: "",
      type: "hidden",
      section: "Basic Information",
      colSpan: "w-full",
      defaultValue: "interior",
    },
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      placeholder: "Swimming Pool",
      section: "Basic Information",
      colSpan: "w-[100%]",
    },
    {
      name: "image",
      label: "Icon",
      type: "image",
      section: "Media",
      hint: "Format: PNG or WEBP. Max: 50KB",
    },
  ],
  // filters: [
  //   {
  //     name: "type",
  //     label: "Amenities",
  //     options: [
  //       { label: "Interior", value: "interior" },
  //       { label: "Exterior", value: "exterior" },
  //     ],
  //   },
  // ],
  displaySearch: true,
};

const TYPOLOGY: AdminSectionConfig = {
  title: "Typology",
  noun: "typologies",
  icon: HiOutlineCollection,
  endpoint: "/admin/typology",
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    {
      key: "add_sub_typology",
      title: "Add Sub Typology",
      dataKey: "add_sub_typology",
      isAction: true,
      showIcon: true,
      linkTemplate: "/admin/{slug}/{id}/mapping",
    },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "2 BHK",
      section: "Basic Information",
      required: true,
    },
    // {
    //   name: "sequence",
    //   label: "Sequence",
    //   type: "number",
    //   placeholder: "1",
    //   section: "Basic Information",
    // },
  ],
  displaySearch: true,
};

const SUBTYPOLOGY: AdminSectionConfig = {
  title: "Sub-Typology",
  noun: "sub-typologies",
  icon: HiOutlineCollection,
  endpoint: "/admin/subtypology",
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    // { key: "sequence", title: "Sequence", dataKey: "seq" },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "2 BHK",
      section: "Basic Information",
      required: true,
    },
  ],
  displaySearch: true,
};

const WEBSITEICONS: AdminSectionConfig = {
  title: "Website Icons",
  noun: "website-icons",
  endpoint: "/admin/website-icons",
  listColumns: [
    { key: "title", title: "Name", dataKey: "title" },
    { key: "image", title: "Icon", dataKey: "image" },
  ],
  fields: [
    {
      name: "title",
      label: "Name",
      type: "text",
      placeholder: "market, temple, school, etc",
      section: "Basic Information",
      required: true,
    },
    {
      name: "search_text",
      label: "Search Text",
      type: "text",
      placeholder: "market, temple, school, etc",
      section: "Basic Information",
      hint: "Separate multiple search texts with comma",
    },
    {
      name: "image",
      label: "Icon",
      type: "image",
      section: "Media",
      required: true,
      hint: "Format: PNG, WEBP Max: 50KB",
    },
  ],
  displaySearch: true,
};

const TESTIMONIAL: AdminSectionConfig = {
  title: "Testimonial",
  noun: "testimonial",
  icon: HiOutlineCollection,
  endpoint: "/admin/testimonial",
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Aditi Khanna",
      required: true,
      section: "Basic Information",
      colSpan: "w-[48%]",
    },
    {
      name: "designation",
      label: "Designation",
      type: "text",
      placeholder: "Director",
      required: true,
      section: "Basic Information",
      colSpan: "w-[48%]",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Description",
      required: true,
      section: "Basic Information",
    },
    {
      type: "select",
      label: "Type",
      name: "type",
      section: "Images",
      options: [
        { value: "image", label: "image" },
        { value: "video", label: "video" },
      ],
      defaultValue: "image",
      colSpan: "w-full",
    },
    {
      name: "image",
      label: "Image",
      type: "image",
      section: "Images",
      showIf: (formValues: any) => formValues.type === "image",
      hint: "Recommended: 1440x778 (16:9). Format: WebP. Max: 800KB",
    },
    {
      name: "video_url",
      label: "Video Url",
      type: "text",
      section: "Images",
      showIf: (formValues: any) => formValues.type === "video",
    },
    // {
    //   name: "video_url",
    //   label: "Desktop Video",
    //   type: "video",
    //   section: "Images",
    //   showIf: (formValues: any) => formValues.pageType === "Video",
    // },
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      placeholder: "Enter Alt Text",
      section: "Images",
    },
  ],
  displaySearch: true,
};

const EVENTS: AdminSectionConfig = {
  title: "Events",
  noun: "event",
  icon: HiOutlineCollection,
  endpoint: "/admin/events",
  listColumns: [{ key: "title", title: "Title", dataKey: "title" }],
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter Title",
      required: true,
    },
  ],
  hideInSidebar: true,
};

const ENQUIRY: AdminSectionConfig = {
  title: "Enquiries",
  noun: "enquiries",
  icon: HiOutlineCollection,
  endpoint: "/admin/enquiry",
  hideInSidebar: true,
  listColumns: [
    { key: "name", title: "Name", dataKey: "name" },
    { key: "email", title: "Email", dataKey: "email" },
    { key: "createdAt", title: "Date", dataKey: "createdAt" },
    { key: "mobile", title: "Mobile", dataKey: "mobile" },
    { key: "message", title: "Message", dataKey: "message" },
  ],
  fields: [],
  displaySearch: true,
};

const NEWSLETTER: AdminSectionConfig = {
  title: "Newsletter",
  noun: "newsletter",
  icon: HiOutlineCollection,
  endpoint: "/admin/newsletter",
  hideInSidebar: true,
  listColumns: [
    { key: "email", title: "Email", dataKey: "email" },
    { key: "createdAt", title: "Date", dataKey: "createdAt" },
  ],
  fields: [],
  displaySearch: true,
};

const JOBS: AdminSectionConfig = {
  title: "Jobs",
  noun: "jobs",
  icon: HiOutlineCollection,
  endpoint: "/admin/jobs",
  hideInSidebar: true,
  listColumns: [
    { key: "title", title: "Title", dataKey: "title" },
    { key: "createdAt", title: "Date", dataKey: "createdAt" },
    { key: "location", title: "Location", dataKey: "location" },
    { key: "experience", title: "Experience", dataKey: "experience_required" },
  ],
  fields: [],
  displaySearch: true,
};

export const FAQ: AdminSectionConfig = {
  title: "FAQ",
  noun: "FAQ",
  icon: HiOutlineCollection,
  endpoint: "/admin/faqs",
  hideInSidebar: true,
  fields: [
    {
      name: "status",
      label: "",
      type: "hidden",
      defaultValue: true,
      colSpan: "w-full",
    },
    {
      name: "question",
      label: "Question",
      type: "text",
      placeholder: "Enter Question",
      required: true,
      colSpan: "w-full",
    },
    {
      name: "answer",
      label: "Answer",
      type: "textarea",
      placeholder: "Enter Answer",
      required: true,
      colSpan: "w-full",
    },
  ],
  listColumns: [
    { key: "question", title: "Question", dataKey: "question" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
    { key: "status", title: "Status", dataKey: "status" },
  ],
  displaySearch: true,
};

export const ADMIN_SECTION_REGISTRY: Record<string, AdminSectionConfig> = {
  platter: PLATTER,
  project: PROJECT,
  pages: PAGE_BASIC_DETAILS,
  projectStatus: PROJECT_STATUS,
  countries: COUNTRIES,
  states: STATES,
  cities: CITIES,
  typology: TYPOLOGY,
  subtypology: SUBTYPOLOGY,
  amenities: AMENITIES,
  websiteIcons: WEBSITEICONS,
  testimonial: TESTIMONIAL,
  events: EVENTS,
  enquies: ENQUIRY,
  newsletter: NEWSLETTER,
  jobs: JOBS,
  projectSections: DEFAULT_PROJECT_SECTION_FIELDS,
  pageSections: DEFAULT_PAGE_SECTION_FIELDS,
  faq: FAQ,
};

export function getSectionConfig(slug: string): AdminSectionConfig {
  const config = ADMIN_SECTION_REGISTRY[slug];
  if (!config) {
    throw new Error(
      `[adminConfig] No config found for slug "${slug}". ` +
        `Register it in ADMIN_SECTION_REGISTRY.`,
    );
  }
  return config;
}
