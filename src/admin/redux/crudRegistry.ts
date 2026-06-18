// src/redux/crudRegistry.ts
// ─────────────────────────────────────────────────────────────────────────────
// Creates one slice per admin section and exports:
//   - `crudReducers`  → plug into configureStore
//   - `crudActions`   → slice actions (setFilter, setPage, …)
//   - `crudThunks`    → async thunks (fetchList, createRecord, …)
// ─────────────────────────────────────────────────────────────────────────────

import { createCrudSlice } from "./features/crudSlice";
import { ADMIN_SECTION_REGISTRY } from "@/src/admin/config/adminConfig";

// Build one slice per registered section
const registry = Object.fromEntries(
    Object.keys(ADMIN_SECTION_REGISTRY).map((key) => [key, createCrudSlice(key)])
);

/** Reducers to spread into configureStore */
export const crudReducers = Object.fromEntries(
    Object.entries(registry).map(([key, { slice }]) => [key, slice.reducer])
);

/** Slice actions keyed by section name */
export const crudActions = Object.fromEntries(
    Object.entries(registry).map(([key, { slice }]) => [key, slice.actions])
) as Record<string, ReturnType<typeof createCrudSlice>["slice"]["actions"]>;

/** Async thunks keyed by section name */
export const crudThunks = Object.fromEntries(
    Object.entries(registry).map(([key, { thunks }]) => [key, thunks])
) as Record<string, ReturnType<typeof createCrudSlice>["thunks"]>;