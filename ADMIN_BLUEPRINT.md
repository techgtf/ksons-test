# Admin CMS Blueprint & Developer Guide

This document serves as a "cheat sheet" and architectural overview for the GTF Builder Sites. Use this to understand how to add new features, configure sections, and manage API endpoints.

---

## 🏗️ Architecture Overview

The admin system is a **data-driven CMS** built with:

- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit (standardized CRUD slices)
- **Forms**: Dynamic rendering using `DynamicForm` and `Field` configurations.
- **Tables**: Standardized `DataTable` component driven by `listColumns`.

---

## 📁 Key Configuration Files

| Path                                     | Purpose                                                                                                          |
| :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `src/admin/config/adminConfig.ts`        | **Top-level Sections**: Defines main menu items like Platters, Events, and Enquiries.                            |
| `src/admin/config/projectsConfig.ts`     | **Project Configuration**: Specialized fields and sections for "Projects".                                       |
| `src/admin/config/pagesConfig.tsx`       | **Page Structure**: Maps Next.js pages to specific sections (Home, About, etc.) and registers sub-section types. |
| `src/admin/config/pageSectionFields.tsx` | **Section Definitions**: Detailed field and column definitions for every sub-section used on pages.              |

---

## ⚙️ Section Configuration Interface

Every section follows a similar interface (`AdminSectionConfig` or `SectionDefinition`).

### Basic Properties

- `title` / `name`: The display name of the section.
- `noun`: Singular name for UI labels (e.g., "enquiry").
- `endpoint`: The base API path for ALL operations (**POST**, **PATCH**, **DELETE**).
- `tableDataApi` _(Optional)_: If set, the table will fetch data from this specific path instead of `endpoint`.
- `queryParams` _(Optional)_: An object merged into the API **GET** requests (e.g., `{ type: "nri" }`).

### Field Definitions

- `fields`: Array of fields for the "Add" and "Edit" forms.
- `listFields`: (For sub-sections) Fields for the sub-CRUD forms.
- `listColumns`: Array defining table columns. Supports `dataKey`, `isAction`, and `linkTemplate`.

---

## 🚀 Common Tasks

### 1. Adding a New Top-Level Menu

1. Define your section object in `adminConfig.ts`.
2. Add it to the `ADMIN_SECTION_REGISTRY`.
3. It will automatically appear in the sidebar (unless `hideInSidebar: true`) and support CRUD via `/admin/[slug]`.

### 2. Creating a Page Sub-Section

1. Define fields in `pageSectionFields.tsx` within the appropriate constants (e.g., `HOME_SECTIONS`).
2. Register the section in `pagesConfig.tsx` under `ALL_PAGE_SECTIONS`.
3. Components like `PageSectionSubCrudPage` will automatically pick up the new configuration.

### 3. Adding Custom Table Actions

Add a `customActions` array to your section definition:

```typescript
customActions: [
  {
    label: "Register Interest",
    linkTemplate: "/admin/interest/{id}",
    showIcon: true,
  },
];
```

### 4. Overriding Table Endpoints

If your **GET** request needs a different URL or specific parameters (like "NRI Corner" using the generic "other-faqs" endpoint):

```typescript
{
  endpoint: "/admin/other-faqs",
  tableDataApi: "/admin/other-faqs",
  queryParams: { faq_type: "nri-corner" },
}
```

---

## 🛠️ Hook & Component Reference

### `useCrud(sectionKey)`

The primary hook for managing data in a section.

- **Returns**: `rows`, `isLoadingList`, `create`, `update`, `remove`, `fetchList`.
- **Note**: It automatically handles normalization of `tableDataApi` and `queryParams`.

### `DynamicForm` Props

- `fields`: The configuration array.
- `initialData`: Values to populate (for edit mode).
- `onSubmit`: Handles FormData submission to the API.

### `DataTable` Props

- `data`: Array of rows.
- `columns`: Column definitions.
- `onEdit` / `onDelete`: Actions for row management.

---

## 💡 Pro Tips

- **ColSpan**: Use `colSpan: "w-[48%]"` in field definitions to create two-column grid layouts for forms.
- **Hidden Fields**: Use `type: "hidden"` with a `defaultValue` for parameters that must be sent to the backend but not shown to users.
- **Sequence**: Use `dataKey: "seq"` in `listColumns` to automatically enable the `SequenceCell` (drag-drop ordering).
