import { IconType } from "react-icons";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineChatAlt2,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { AdminSectionConfig, FormField } from "./adminConfig";
import {
  HOME_SECTIONS,
  ABOUT_SECTIONS,
  CONTACT_SECTIONS,
  SectionDefinition,
  CSR_SECTIONS,
  BLOG_SECTIONS,
  GALLERY_SECTIONS,
  NRI_CORNOR_SECTIONS,
  TESTIMONIALS_SECTIONS,
  EMI_CALCULATOR_SECTIONS,
  FAQ_SECTIONS,
  HOME_LOAN_SECTIONS,
  TAX_BENEFITS_SECTIONS,
  NEWS_EVENTS_SECTIONS,
  INVESTOR_SECTIONS,
  CAREER_SECTIONS,
} from "./pageSectionFields";

export type PageConfig = {
  title: string;
  icon: IconType;
  slug: string;
  endpoint: string;
};

// This is for page data
export const PAGE_BASIC_DETAILS: AdminSectionConfig = {
  title: "Pages",
  noun: "Pages",
  endpoint: "/admin/pages",
  icon: HiOutlineDocumentText,
  listColumns: [
    { key: "pageName", title: "Name", dataKey: "pageName" },
    // { key: "slug", title: "Slug", dataKey: "slug" },
    { key: "sequence", title: "Sequence", dataKey: "seq" },
    { key: "status", title: "Status", dataKey: "status" },
    {
      key: "add_page_sections",
      title: "Add Page Sections",
      dataKey: "add_page_sections",
      isAction: true,
      showIcon: true,
      linkTemplate: "/admin/{slug}/{id}/sections",
    },
  ],
  displaySearch: true,
  fields: [
    {
      name: "pageName",
      label: "Page Name",
      type: "select",
      options: [
        { label: "Home", value: "home" },
        { label: "About", value: "about" },
        { label: "Contact", value: "contact" },
        { label: "CSR", value: "csr" },
        { label: "Gallery", value: "gallery" },
        { label: "NRI Corner", value: "nri-corner" },
        { label: "Testimonials", value: "testimonials" },
        { label: "Emi Calculator", value: "emi-calculator" },
        { label: "Blogs", value: "blogs" },
        { label: "FAQ", value: "faq" },
        { label: "Home Loan", value: "home-loan" },
        { label: "Tax Benefits", value: "tax-benefits" },
        { label: "News & Events", value: "news-events" },
        { label: "Investor", value: "investor" },
        { label: "Careers", value: "careers" },
        { label: "Projects", value: "projects" },
      ],
      dynamicSource: "pages",
      excludeExisting: true,
      section: "Basic Information",
      required: true,
      colSpan: "w-full",
      disabledInEdit: true,
    },
    {
      name: "title.heading",
      label: "Main Heading",
      type: "text",
      section: "Basic Information",
    },
    {
      name: "title.sub_heading",
      label: "Sub Heading",
      type: "text",
      section: "Basic Information",
    },
    {
      name: "title.description",
      label: "Description",
      type: "textarea",
      section: "Basic Information",
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
    {
      type: "select",
      label: "Page Type",
      name: "pageType",
      section: "Images",
      options: [
        { value: "Image", label: "Image" },
        { value: "Video", label: "Video" },
      ],
      defaultValue: "Image",
    },
    {
      name: "desktop_file",
      label: "Desktop Image",
      type: "image",
      section: "Images",
      showIf: (formValues: any) => formValues.pageType === "Image",
      hint: "Recommended: 1440x778 (16:9). Format: WebP. Max: 800KB",
    },
    {
      name: "mobile_file",
      label: "Mobile Image",
      type: "image",
      section: "Images",
      showIf: (formValues: any) => formValues.pageType === "Image",
      hint: "Recommended: 9:16 Aspect Ratio. Format: WebP. Max: 500KB",
    },
    {
      name: "desktop_file",
      label: "Desktop Video",
      type: "video",
      section: "Images",
      showIf: (formValues: any) => formValues.pageType === "Video",
    },
    {
      name: "mobile_file",
      label: "Mobile Video",
      type: "video",
      section: "Images",
      showIf: (formValues: any) => formValues.pageType === "Video",
    },
  ],
};

const ALL_PAGE_SECTIONS: Record<string, Record<string, SectionDefinition>> = {
  home: HOME_SECTIONS,
  about: ABOUT_SECTIONS,
  contact: CONTACT_SECTIONS,
  csr: CSR_SECTIONS,
  gallery: GALLERY_SECTIONS,
  "nri-corner": NRI_CORNOR_SECTIONS,
  testimonials: TESTIMONIALS_SECTIONS,
  "emi-calculator": EMI_CALCULATOR_SECTIONS,
  blogs: BLOG_SECTIONS,
  faq: FAQ_SECTIONS,
  "home-loan": HOME_LOAN_SECTIONS,
  "tax-benefits": TAX_BENEFITS_SECTIONS,
  "news-events": NEWS_EVENTS_SECTIONS,
  investor: INVESTOR_SECTIONS,
  careers: CAREER_SECTIONS,
};

// Generates the registry for dropdowns
export const PAGE_SECTION_REGISTRY = Object.entries(ALL_PAGE_SECTIONS).reduce(
  (acc, [pageSlug, sections]) => {
    acc[pageSlug] = Object.entries(sections).map(([type, def]) => ({
      id: type,
      name: def.name,
      type: type,
      excludeDefaultFields: def.excludeDefaultFields,
    }));
    return acc;
  },
  {} as Record<string, any[]>,
);

// Generates the fields for forms
export const PAGE_SECTION_FIELDS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      acc[type] = def.fields;
    });
    return acc;
  },
  {} as Record<string, FormField[]>,
);

// Generates the endpoints mapping
export const PAGE_SECTION_ENDPOINTS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if (def.endpoint) {
        acc[type] = def.endpoint;
      }
    });
    return acc;
  },
  {} as Record<string, string>,
);

export const PAGE_SECTION_TABLE_DATA_API = Object.values(
  ALL_PAGE_SECTIONS,
).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if (def.tableDataApi) {
        acc[type] = def.tableDataApi;
      }
    });
    return acc;
  },
  {} as Record<string, string>,
);

// Generates the query params mapping
export const PAGE_SECTION_PARAMS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if (def.queryParams) {
        acc[type] = def.queryParams;
      }
    });
    return acc;
  },
  {} as Record<string, Record<string, any>>,
);

// Generates the layout mapping
export const PAGE_SECTION_LAYOUTS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if (def.layout) {
        acc[type] = def.layout;
      }
    });
    return acc;
  },
  {} as Record<string, "split" | "full">,
);

// This is for page section list
export const DEFAULT_PAGE_SECTION_FIELDS: AdminSectionConfig = {
  title: "Page Section",
  noun: "sections",
  icon: HiOutlineFolder,
  endpoint: "/admin/page-sections",
  hideInSidebar: true,
  // tableDataApi: "/admin/page-sections",
  listColumns: [
    { key: "name", title: "Section Name", dataKey: "type" },
    { key: "status", title: "status", dataKey: "status" },
    { key: "seq", title: "Sequence", dataKey: "seq" },
    { key: "more_details", title: "More Details", dataKey: "more_details" },
  ],
  fields: [],
};

// This is for sections list page
export const PAGE_SECTION_LIST_FIELDS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if ((def as any).listFields) {
        acc[type] = (def as any).listFields;
      }
    });

    return acc;
  },
  {} as Record<string, FormField[]>,
);

// This is for custom list columns per section
export const PAGE_SECTION_COLUMNS = Object.values(ALL_PAGE_SECTIONS).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if ((def as any).listColumns) {
        acc[type] = (def as any).listColumns;
      }
    });

    return acc;
  },
  {} as Record<string, any[]>,
);

// This is for page section list custom actions
export const PAGE_SECTION_CUSTOM_ACTIONS = Object.values(
  ALL_PAGE_SECTIONS,
).reduce(
  (acc, sections) => {
    Object.entries(sections).forEach(([type, def]) => {
      if ((def as any).customActions) {
        acc[type] = (def as any).customActions;
      }
    });

    return acc;
  },
  {} as Record<string, any[]>,
);
